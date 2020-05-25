import { MappedProject } from 'src/app/models/internal/mapped-project';
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
import { HttpClient } from '@angular/common/http';
import { GenericWizard } from './interfaces/generic-wizard';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { mergeMap, map, switchMap } from 'rxjs/operators';
import { GitHubContributor } from '../models/resources/external/github/contributor';
import { MappedCollaborator } from '../models/internal/mapped-collaborator';
import { Collaborator } from '../models/domain/collaborator';
import { GitHubRepo } from '../models/resources/external/github/repo';

/**
 * Service to fetch a repo and it's details from Github.
 */
@Injectable({
  providedIn: 'root'
})
export class WizardGithubService implements GenericWizard {

  private readonly githubApiUrl = 'https://api.github.com';
  private readonly githubReposEndpoint = 'repos';
  private readonly githubCollaboratorsEndpoint = 'contributors';

  private readonly githubRawContentUrl = 'https://raw.githubusercontent.com';
  private readonly githubReadme = 'README.md';

  constructor(
    private httpClient: HttpClient
  ) { }

  fetchProjectDetails(url: string): Observable<MappedProject> {
    const gitLabRegex = new RegExp('^https?:\/\/github.com\/(?<ownerName>.+)\/(?<repoName>.+)$');
    const urlGroups = (url.match(gitLabRegex).groups);
    const ownerName = urlGroups.ownerName;
    const repoName = urlGroups.repoName;

    return forkJoin([
      this.fetchRepo(repoName, ownerName)
        .pipe(
          switchMap(repo => {
            return this.fetchReadme(repoName, ownerName, repo.default_branch)
              .pipe(
                map(readme => {
                  return { repo, readme };
                })
              );
          })
        ),
      this.fetchCollaborators(repoName, ownerName),
    ])
      .pipe(
        map(([{ repo, readme }, collaborators]) => {
          console.log(repo, readme, collaborators);

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
            description: readme,
            shortDescription: repo.description,
            uri: repo.html_url,
            collaborators: mappedCollaborators
          };
          return mappedProject;
        })
      );
  }

  /**
   * Method to fetch the details of a repo.
   * @param repoName Name of the repo.
   * @param ownerName Name of the repo owner.
   */
  private fetchRepo(repoName: string, ownerName: string): Observable<GitHubRepo> {
    const url = `${this.githubApiUrl}/${this.githubReposEndpoint}/${ownerName}/${repoName}`;
    return this.httpClient.get<GitHubRepo>(url);
  }

  /**
   * Method to fetch the colloborators of a repo.
   * @param repoName Name of the repo.
   * @param ownerName Name of the repo owner.
   */
  private fetchCollaborators(repoName: string, ownerName: string): Observable<GitHubContributor[]> {
    const url = `${this.githubApiUrl}/${this.githubReposEndpoint}/${ownerName}/${repoName}/${this.githubCollaboratorsEndpoint}`;
    return this.httpClient.get<GitHubContributor[]>(url);
  }

  /**
   * Method to fetch the readme of a repo.
   * @param repoName Name of the repo.
   * @param ownerName Name of the repo owner.
   * @param defaultBranch Name of the default branch.
   */
  private fetchReadme(repoName: string, ownerName: string, defaultBranch: string) {
    const url = `${this.githubRawContentUrl}/${ownerName}/${repoName}/${defaultBranch}/${this.githubReadme}`;
    return this.httpClient.get(url, { responseType: 'text' });
  }
}
