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
import { WizardApiService } from './wizard-api.service';
import { GenericWizard } from './interfaces/generic-wizard';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MappedProject } from 'src/app/models/internal/mapped-project';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { WizardGithubService } from './wizard-github.service';
import { AlertConfig } from '../models/internal/alert-config';
import { AlertType } from '../models/internal/alert-type';
import { AlertService } from './alert.service';

/**
 * Service to fetch project for various resources.
 */
@Injectable({
  providedIn: 'root'
})
export class WizardServiceOld {

  public readonly fetchedProject: BehaviorSubject<MappedProject> = new BehaviorSubject(null);

  private readonly addManualProjectRoute = 'project/add/manual';

  constructor(
      private router: Router,
      private wizardGithubService: WizardGithubService,
      private wizardApiService: WizardApiService,
      private alertService: AlertService,
  ) { }

  /**
   * Method to fetch a project from a source based on a url.
   * @param url Url where the project is located.
   */
  public fetchProjectForSource(url: string): void {
    // Remove parameters from url
    url = url.replace(/\?.*$/g, '');

    const githubRegex = new RegExp('^h?t?t?p?s?:?\/?\/?w?w?w?.?github.com\/.+\/.+');

    if (githubRegex.test(url)) {
      this.fetchSource(this.wizardGithubService, url);
      return;
    }
    this.fetchSource(this.wizardApiService, url);
  }

  /**
   * Method to clear out the last fetchedProject.
   */
  public reset(): void {
    this.fetchedProject.next(null);
  }

  /**
   * Method to fetch a repo/project from the wizard service.
   * Set the fetchedProject and redirect the user to the add manual project component.
   * @param service the service to use to fetch the source.
   * @param url url where the project is located.
   */
  private fetchSource(service: GenericWizard, url: string): void {
    service.fetchProjectDetails(url).subscribe(project => {
          this.fetchedProject.next(project);
          this.router.navigate([this.addManualProjectRoute]);
        },
        () => {
          const alertConfig: AlertConfig = {
            type: AlertType.info,
            preMessage: null,
            mainMessage: 'We were unable to automagically retrieve information about your project. You can manually add this information using the form!',
            dismissible: true,
            timeout: this.alertService.defaultTimeout
          };
          const project: MappedProject = {
            collaborators: [],
            name: '',
            description: '',
            shortDescription: '',
            uri: url
          };
          this.fetchedProject.next(project);
          this.router.navigate([this.addManualProjectRoute]);
          this.alertService.pushAlert(alertConfig);
        });
  }

}
