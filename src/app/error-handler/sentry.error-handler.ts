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
import * as Sentry from '@sentry/browser';
import { ErrorHandler, Inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AlertType } from 'src/app/models/internal/alert-type';
import { AlertConfig } from 'src/app/models/internal/alert-config';
import { AlertService } from 'src/app/services/alert.service';

Sentry.init({
    dsn: environment.sentryDsnUrl
});

/**
 * Error Handler which logs all errors to Sentry.
 */
@Injectable()
export class SentryErrorHandler implements ErrorHandler {

    constructor(
        private alertService: AlertService
    ) { }

    handleError(error: any) {
        const alertConfig: AlertConfig = {
            type: AlertType.danger,
            mainMessage: 'Project was succesfully updated',
            dismissible: true,
            timeout: this.alertService.defaultTimeout
        };
        this.alertService.pushAlert(alertConfig);

        Sentry.captureException(error.originalError || error);
        throw error;
    }
}
