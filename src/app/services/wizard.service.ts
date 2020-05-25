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
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MappedProject } from 'src/app/models/internal/mapped-project';
import { WizardGitLabService } from './wizard-gitlab.service';
import { WizardGithubService } from './wizard-github.service';
import { WizardGitlabFHICTService } from './wizard-gitlab-fhict.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class WizardService {

  public fetchedProject: BehaviorSubject<MappedProject> = new BehaviorSubject(null);

  private readonly addManualProjectRoute = 'project/add/manual';

  constructor(
    private router: Router,
    private wizardGithubService: WizardGithubService,
    private wizardGitLabService: WizardGitLabService,
    private WizardGitlabFHICTService: WizardGitlabFHICTService
  ) { }

  public fetchProjectForSource(url: string): void {

    // Remove parameters from url
    url = url.replace(/\?.*$/g, "")

    const githubRegex = new RegExp('^https?:\/\/github.com\/.+\/.+');
    const gitlabFHICTRegex = new RegExp('^https?:\/\/git\.fhict.nl\/.+\/.+');
    const gitlabRegex = new RegExp('^https?:\/\/gitlab.com\/.+\/.+');

    if (githubRegex.test(url)) {
      this.fetchSourceOnGithub(url);
      return;
    }
    if(gitlabRegex.test(url)){
      this.fetchSourceOnGitLab(url);
      return;
    }
  }

  private fetchSourceOnGithub(url: string): void {
    this.wizardGithubService.fetchProjectDetails(url).subscribe(project => {
      this.fetchedProject.next(project);
      this.router.navigate([this.addManualProjectRoute]);
    });
  }

  // private fetchSourceOnGitLabFHICT(url: string) {
  //   this.WizardGitlabFHICTService.fetchProjectDetails(url);
  // }

  private fetchSourceOnGitLab(url: string) {
    this.wizardGitLabService.fetchProjectDetails(url).subscribe(project => {
      this.fetchedProject.next(project);
      this.router.navigate([this.addManualProjectRoute]);
    });
  }
}
