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
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { AlertConfig } from 'src/app/models/internal/alert-config';
import { AlertType } from 'src/app/models/internal/alert-type';

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

  public sourceUriInput: FormControl = new FormControl('');

  constructor(
    private wizardService: WizardService,
    private router: Router,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.mostUsedSources.push(
        {
          id: 1,
          name: "GitHub",
          image: "assets/images/github-logo.svg",
        },
        {
          id: 2,
          name: "GitLab",
          image: "assets/images/gitlab-logo.png",
        },
        {
          id: 3,
          name: "Codepen",
          image: "assets/images/codepen-logo.png",
        },
        {
          id: 4,
          name: "HBO Kennisbank",
          image: "assets/images/hbokennisbank-logo.png",
        },
        {
          id: 5,
          name: "Google Drive",
          image: "assets/images/googledrive-logo.png",
        },
        {
          id: 6,
          name: "Dropbox",
          image: "assets/images/dropbox-logo.png",
        }
    );
  }

  /**
   * Method which triggers when the submit source uri button is pressed.
   * Fetches the source from the wizard service.
   */
  public onClickSubmitSourceUri(): void {
    const sourceUri = this.sourceUriInput.value;
    if (sourceUri == null || sourceUri === '') {
      const alertConfig: AlertConfig = {
        type: AlertType.danger,
        preMessage: 'Source uri/url was invalid',
        mainMessage: 'Source details could not be fetched',
        dismissible: true,
        timeout: this.alertService.defaultTimeout
      };
      this.alertService.pushAlert(alertConfig);
      return;
    }

    this.wizardService.fetchProjectForSource(sourceUri);
  }

  /**
   * Method which triggers when the add manual project is pressed.
   * Resets the fetched source in the wizard service.
   */
  public onClickAddProjectManual(): void {
    this.wizardService.reset();
    this.router.navigate(['/project/add/manual']);
  }
}
