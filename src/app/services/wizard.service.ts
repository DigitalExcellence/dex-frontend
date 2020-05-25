import { WizardGitlabService } from './wizard-gitlab.service';
import { WizardGithubService } from './wizard-github.service';
import { Project } from 'src/app/models/domain/project';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

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

@Injectable({
  providedIn: 'root'
})
export class WizardService {

  public fetchedSource: BehaviorSubject<Project> = new BehaviorSubject(null);

  constructor(
    private wizardGithubService: WizardGithubService,
    private wizardGitLabService: WizardGitlabService,
  ) { }

  public fetchProjectForSource(url: string): void {

    url = url.slice(0,url.indexOf("?"));

    const githubRegex = new RegExp('^https?:\/\/github.com\/.+\/.+');
    const gitlabFHICTRegex = new RegExp('^https?:\/\/git\.fhict.nl\/.+\/.+');
    if (githubRegex.test(url)) {
      this.fetchSourceOnGithub(url);
      return;
    }
    if (gitlabFHICTRegex.test(url)) {
      this.fetchSourceOnGitLab(url);
    }

  }

  // TODO add return types back to methods.
  private fetchSourceOnGithub(url: string) {
    this.wizardGithubService.fetchProjectDetails(url);
  }
  private fetchSourceOnGitLab(url: string) {
    this.wizardGitLabService.fetchProjectDetails(url);
  }
}
