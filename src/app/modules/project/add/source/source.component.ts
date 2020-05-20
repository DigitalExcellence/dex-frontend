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
import { ExternalSource } from 'src/app/models/domain/external-source';

/**
 * Component to import projects from external sources
 */
@Component({
  selector: 'app-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.scss'],
})
export class SourceComponent implements OnInit {
  /**
   * ExternalSources available to import your projects from
   */
  public mostUsedSources: ExternalSource[] = [];

  constructor() {}

  ngOnInit(): void {
    const demoSource: ExternalSource = {
      id: 1,
      name: 'GitHub',
      image: 'assets/images/github-logo.svg',
    };
    for (let index = 0; index < 6; index++) {
      demoSource.id = demoSource.id + index;
      this.mostUsedSources.push(demoSource);
    }
  }
}
