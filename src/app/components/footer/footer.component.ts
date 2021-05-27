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
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Component which functions as the footer of the application.
 */
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  /**
   * Array that holds the routes that should have the simple footer
   */
  private simpleFooterRoutes = [
    '/home'
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  /**
   * Method that checks if the current page should have the footer with the shapes
   * or the simple footer without the shapes. This needs to be switched out sometimes to
   * keep the pages from being too busy.
   */
  public showShapesInFooter(): boolean {
    const currentUrl = this.router.url;
    return !this.simpleFooterRoutes.includes(currentUrl);
  }

}
