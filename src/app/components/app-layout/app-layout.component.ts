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

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.subscription = this.authService.authNavStatus$.subscribe((status) => {
      this.isAuthenticated = status;
      this.name = this.authService.name;
    });
  }
  /**
   * Sign the user out of their account by calling the Auth Service signout method.
   */
  public async onClickSignout() {
    await this.authService.signout();
  }
}
