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

import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageUtils, LocalStorageOptions } from 'src/app/utils/localstorage.utils';
import { AlertService } from 'src/app/services/alert.service';

/**
 * Component used to display the basic layout of the application.
 */
@Component({
  selector: 'app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss'],
})
export class AppLayoutComponent implements OnInit {
  public name: string;
  public isAuthenticated: boolean;
  public subscription: Subscription;
  public displayAlertContainer = false;

  public readonly dexGithubIssueUrl = 'https://github.com/DigitalExcellence/dex-frontend/issues/new/choose';
  public displayBetaBanner = true;

  constructor(
    private authService: AuthService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.subscription = this.authService.authNavStatus$.subscribe((status) => {
      this.isAuthenticated = status;
      this.name = this.authService.name;
    });

    this.alertService.$activeAlerts.subscribe(alerts => {
      if (alerts == null || alerts.length <= 0) {
        this.displayAlertContainer = false;
      } else {
        this.displayAlertContainer = true;
      }
    });

    this.displayBetaBanner = !JSON.parse(LocalStorageUtils.getValue(LocalStorageOptions.BetaBannerDismissed));
  }
  /**
   * Sign the user out of their account by calling the Auth Service signout method.
   */
  public async onClickSignout() {
    await this.authService.signout();
  }

  /**
   * Method which triggers when the user clicks the close beta banner button.
   * Hides the beta banner.
   */
  public onClickCloseBetaMessage(): void {
    LocalStorageUtils.setValue(LocalStorageOptions.BetaBannerDismissed, true);
    this.displayBetaBanner = false;
  }

  /**
   * Method which triggers when the user clicks the beta text in the header.
   * Displays the beta banner.
   */
  public onClickHeaderBetaText(): void {
    this.displayBetaBanner = true;
  }
}
