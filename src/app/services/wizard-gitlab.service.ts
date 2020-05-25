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

import { MappedProject } from 'src/app/models/internal/mapped-project';
import { HttpClient } from '@angular/common/http';
import { GenericWizard } from './interfaces/generic-wizard';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { mergeMap, map, switchMap } from 'rxjs/operators';
import { MappedCollaborator } from 'src/app/models/internal/mapped-collaborator';
import { Collaborator } from 'src/app/models/domain/collaborator';
import { GitLabRepo } from 'src/app/models/resources/external/gitlab/repo';
import { GitLabContributor } from 'src/app/models/resources/external/gitlab/contributor';

/**
 * Service to fetch a repo and it's details from Github.
 */
@Injectable({
  providedIn: 'root'
})
export class WizardGitlabService implements GenericWizard {

  private readonly gitlabApiUrl = 'https://gitlab.com';
  private readonly gitlabReposEndpoint = 'api/v4/projects';

  constructor(
    private httpClient: HttpClient
  ) { }

  fetchProjectDetails(url: string): Observable<MappedProject> {
    return forkJoin([
      this.fetchRepo(url)
        // .pipe(
        //   // switchMap(repo => {
        //   //   return this.fetchReadme(repo.readme_url)
        //   //     .pipe(
        //   //       map(readme => {
        //   //         console.log(repo)
        //   //         return readme;
        //   //       }),
        //   //     );
        //   // }),
        //   Map(repo =>{
        //     return repo;
        //   })
        // ),
      //this.fetchCollaborators(y)
    ])
      .pipe(
        map(([repo]) => {
          console.log("finished")
          console.log(repo)
          // console.log(repo, readme, collaborators);
          const collaborators = [];
          const mappedCollaborators: MappedCollaborator[] = [];
          if (collaborators) {
            collaborators.forEach(colloborator => {
              const mappedCollaborator: Collaborator = {
                id: null,
                fullName: colloborator.login,
                role: 'Developer'
              };
              mappedCollaborators.push(mappedCollaborator);
            });
          }
          

          const mappedProject: MappedProject = {
            name: repo.name,
            description: repo.description,
            shortDescription: repo.description,
            uri: repo.web_url,
            collaborators: mappedCollaborators 
          };
          return mappedProject;
          
        })
      );
  }

  /**
   * Method to fetch the details of a repo.
   * @param repoUrl url of the repository.
   */
  private fetchRepo(repoUrl: string): Observable<GitLabRepo> {
    let projectName = repoUrl.replace("https://gitlab.com/","")
    projectName = projectName.replace(/\//g,"%2F")
    const url = `${this.gitlabApiUrl}/${this.gitlabReposEndpoint}/${projectName}`;
    return this.httpClient.get<GitLabRepo>(url);
  }

  /**
   * Method to fetch the colloborators of a repo.
   * @param repoUrl url of the repository.
   */
  private fetchCollaborators(repoUrl: string): Observable<GitLabContributor[]> {
    const url = `${this.gitlabApiUrl}/${this.gitlabReposEndpoint}/${repoUrl}/members`;
    return this.httpClient.get<GitLabContributor[]>(url);
  }

  /**
   * Method to fetch the readme of a repo.
   * @param readmeUrl url of the readme file.
   */
  private fetchReadme(readmeUrl: string) {
    const url = readmeUrl.replace("-/blob","-/raw")
    return this.httpClient.get(url, { responseType: 'text' });
  }
}
