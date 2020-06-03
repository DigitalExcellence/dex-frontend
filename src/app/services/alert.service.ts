/*
 *
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
 *
 */
import { AlertConfig } from 'src/app/models/internal/alert-config';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Injectable } from '@angular/core';
import { timer } from 'rxjs';

/**
 * Service for keeping track of alerts.
 */
@Injectable({
  providedIn: 'root'
})
export class AlertService {

  public readonly $activeAlerts = new BehaviorSubject<AlertConfig[]>(null);

  private activeAlerts: AlertConfig[] = [];

  /**
   * Default timeout in milliseconds.
   */
  private readonly defaultTimeout = 1000;

  constructor() { }

  /**
   * Method to push and display a new alert.
   * @param alertConfig the alert to display.
   */
  public pushAlert(alertConfig: AlertConfig): void {
    this.activeAlerts.push(alertConfig);

    this.$activeAlerts.next(this.activeAlerts);

    // Dismissable alerts with no timeout will not be automaticcaly removed.
    if (alertConfig.dismissible && (alertConfig.timeout == null || alertConfig.timeout <= 0)) {
      return;
    }

    // Start a observable which will remove the alertConfig
    this.removeAlertConfigAfterTimeout(alertConfig);
  }

  /**
   * Method to remove an alert after a certain timeout.
   * @param alertConfig the alert to remove.
   */
  private removeAlertConfigAfterTimeout(alertConfig: AlertConfig): void {
    let alertTimeOut = this.defaultTimeout;
    if (alertConfig.timeout != null && alertConfig.timeout > 0) {
      alertTimeOut = alertConfig.timeout;
    }

    timer(alertTimeOut).subscribe(() => {
      const index = this.activeAlerts.findIndex(activeAlert => activeAlert === alertConfig);
      if (index < 0) {
        return;
      }

      this.activeAlerts.splice(index, 1);
      this.$activeAlerts.next(this.activeAlerts);
    });
  }
}
