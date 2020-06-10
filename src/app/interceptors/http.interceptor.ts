/*
 *  Digital Excellence Copyright (C) 2020 Brend Smits
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU Lesser General Public License as published
 *   by the Free Software Foundation version 3 of the License.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty
 *   of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *   See the GNU Lesser General Public License for more details.
 *
 *   You can find a copy of the GNU Lesser General Public License
 *   along with this program, in the LICENSE.md file in the root project directory.
 *   If not, see https://www.gnu.org/licenses/lgpl-3.0.txt
 */
import { HttpRequest, HttpInterceptor, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import * as Sentry from '@sentry/browser';
import { environment } from 'src/environments/environment';
import { AlertType } from 'src/app/models/internal/alert-type';
import { AlertConfig } from 'src/app/models/internal/alert-config';
import { AlertService } from 'src/app/services/alert.service';
import { DeXHttpErrorResponse } from 'src/app/models/internal/dex-http-error-response';

/**
 * Interceptor which handles error handling and displaying for http requests.
 */
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(
        private alertService: AlertService
    ) { }

    /**
     * Intercept the request.
     * Retry once if something went wrong.
     * Display a user fiendly error message.
     * Catch the error and send it to Sentry for production.
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                retry(1)
            )
            .pipe(
                catchError((httpErrorResponse: DeXHttpErrorResponse) => {
                    // Create and send alert.
                    if (httpErrorResponse.status === 0) {
                        // API Could not be reached
                        this.alertService.pushAlert(this.createErrorAlertConfig('API could not be reached', 'Please check your internet connection'));
                    } else {
                        // API Could be reached but returned error
                        this.alertService.pushAlert(this.createErrorAlertConfig(httpErrorResponse.error.title, httpErrorResponse.error.detail));
                    }

                    if (environment.production) {
                        // Log error to sentry.
                        Sentry.captureException(new Error(` http error:${httpErrorResponse.status} - ${httpErrorResponse.message}`));
                    }
                    // Stop error from continuing.
                    return EMPTY;
                })
            );
    }

    /**
     * Method to return the default error AlertConfig for HttpInterceptor
     * @param preMessage the alert message prefix.
     * @param mainMessage the alert message main content.
     */
    private createErrorAlertConfig(preMessage: string, mainMessage: string): AlertConfig {
        const alertConfig: AlertConfig = {
            type: AlertType.danger,
            preMessage: preMessage,
            mainMessage: mainMessage,
            dismissible: true,
            timeout: this.alertService.defaultTimeout
        };
        return alertConfig;
    }
}
