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
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

/**
 * Component which functions as the landing page of the application.
 */
@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent {

  public searchControl: FormControl = null;

  constructor(
    private router: Router) {
    this.searchControl = new FormControl('');
   }

  public onClickSearch(): void {
    this.validateSearchInput();
  }

  public keyDownFunction(event): void {
    if (event.code === 'Enter') {
      this.validateSearchInput();
    }
  }

  private validateSearchInput(): void {
    if (this.searchControl.value !== '' && this.searchControl.value.replace(/\s/g, '').length) {
      this.router.navigate(['/project/overview'], {queryParams: {query: this.searchControl.value}});
    } else {
      this.router.navigate(['/project/overview']);
    }
  }
}
