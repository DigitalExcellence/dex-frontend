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
import { API_CONFIG } from 'src/app/config/api-config';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import * as Sentry from '@sentry/browser';
import { environment } from 'src/environments/environment';
import { AlertType } from 'src/app/models/internal/alert-type';
import { AlertConfig } from 'src/app/models/internal/alert-config';
import { AlertService } from 'src/app/services/alert.service';
import { DeXHttpErrorResponse } from 'src/app/models/internal/dex-http-error-response';

/**
 * Interface to define ignoredRequests.
 */
interface IgnoredRequests {
  endpoint: string;
  method: HttpMethods;
}

/**
 * Enum to define possible HTTP Methods.
 */
enum HttpMethods {
  'GET',
  'POST',
  'DELETE',
  'PUT',
  'PATCH'
}


/**
 * Interceptor which handles error handling and displaying for http requests.
 */
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  /**
   * Array to define which request should be ignored by this interceptor.
   * This can be used to not display error message for certain requests.
   */
  private readonly ignoredEndpoints: IgnoredRequests[] = [
    {endpoint: 'highlight', method: HttpMethods.GET},
    {endpoint: 'highlight/project/', method: HttpMethods.GET},
    {endpoint: 'wizard', method: HttpMethods.GET},
    {endpoint: 'project/search/autocomplete', method: HttpMethods.GET},
  ];

  private readonly ignoredStatusCodes: number[] = [
    404
  ];

  constructor(
      private alertService: AlertService
  ) { }

  /**
   * Intercept the request.
   * Retry once if something went wrong.
   * Display a user friendly error message.
   * Catch the error and send it to Sentry for production.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Find a matching ignoredEndpoint based on the endpoint and method.
    const foundIgnoredEndpoint = this.ignoredEndpoints.find(ignoredEndpoint => {
      return request.url.includes(API_CONFIG.url + ignoredEndpoint.endpoint) &&
          request.method === HttpMethods[ignoredEndpoint.method];
    });

    // If a ignored endpoint was found return with default behavior.
    if (foundIgnoredEndpoint != null) {
      return next.handle(request)
          .pipe(
              // First retry the request.
              retry(1)
          );
    }

    // For all non ignored requests use the error handler and retry functionality.
    return next.handle(request)
        .pipe(
            // First retry the request.
            retry(1)
        )
        .pipe(
            // Then catch the error after retrying.
            catchError((httpErrorResponse: DeXHttpErrorResponse) => {
              // Create and send alert.
              if (httpErrorResponse.status === 0) {
                // API Could not be reached
                this.alertService.pushAlert(this.createErrorAlertConfig(
                    'API could not be reached',
                    'Please check your internet connection'));
              } else {
                // API Could be reached but returned error
                // tslint:disable-next-line: max-line-length
                this.alertService.pushAlert(this.createErrorAlertConfig(httpErrorResponse.error.title, httpErrorResponse.error.detail));
              }

              // Return if the status codes are ignored.
              if (this.ignoredStatusCodes.includes(httpErrorResponse.status)) {
                return EMPTY;
              }

              // Stop error from continuing if application is not run in production.
              if (!environment.production) {
                return EMPTY;
              }

              // Log error to sentry.
              Sentry.captureException(new Error(` http error:${httpErrorResponse.status} - ${httpErrorResponse.message}`));
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
