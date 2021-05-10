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

import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})

/**
 * This service is used for SEO within the project (Search Engine Optimization). This means that
 * all things related to modifying page metadata will be executed from this service.
 */
export class SEOService {

  constructor(private title: Title, private meta: Meta) { }

  // Updates the page title of the webpage
  public updateTitle(title: string): void {
    this.title.setTitle(title + ' - DeX');
  }

  /** Updates the meta description of the webpage */
  public updateDescription(desc: string): void {

    // Cut string if length is greater than 155
    if (desc.length > 155) {
      desc = desc.substring(0, 155);
    }
    this.meta.updateTag({ name: 'description', content: desc });
  }
}
