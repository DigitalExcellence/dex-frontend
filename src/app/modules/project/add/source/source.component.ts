import { FormControl } from '@angular/forms';
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
import { WizardService } from 'src/app/services/wizard.service';

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

  public sourceUrlInput: FormControl = new FormControl('https://gitlab.com/matfpveb/projekti/2019-2020/12-animecentral');

  constructor(
    private wizardService: WizardService
  ) { }

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

  public onClickSubmitSourceUrl(): void {
    const sourceUrl = this.sourceUrlInput.value;
    if (sourceUrl == null || sourceUrl === '') {
      // TODO: display error invalid url
      return;
    }

    this.wizardService.fetchProjectForSource(sourceUrl);
  }
}
