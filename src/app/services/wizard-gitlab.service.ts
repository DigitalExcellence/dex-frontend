import { GitHubRepo } from './../models/resources/external/github/repo';
import { HttpClient } from '@angular/common/http';
import { Project } from 'src/app/models/domain/project';
import { GenericWizard } from './interfaces/generic-wizard';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { MappedProject } from '../models/internal/mapped-project';

@Injectable({
  providedIn: 'root'
})
export class WizardGitlabService implements GenericWizard {

  private readonly gitLabApiUrl = 'https://gitlab.com';
  private readonly gitLabReposEndpoint = 'api/v4/projects';
  private readonly githubCollaboratorsEndpoint = 'contributors';

  constructor(
    private httpClient: HttpClient
  ) { }

  fetchProjectDetails(url: string): Observable<MappedProject> {
    const project: Project = null;

    const gitLabRegex = new RegExp('^https?:\/\/gitlab.com\/(?<ownerName>.+)\/(?<repoName>.+)$');
    const urlGroups = (url.match(gitLabRegex).groups)
    const ownerName = urlGroups.ownerName;
    const repoName = urlGroups.repoName;

    console.log(urlGroups)
    this.fetchRepo(repoName, ownerName)
    // .pipe(
    //   mergeMap(repo => {
    //     console.log(repo);
    //     return this.fetchReadme(repoName, ownerName, repo.default_branch);
    //   }
    //   )
    // )
    // .subscribe(result => {
    //   console.log(result);
    // });

    // forkJoin([
    //   this.fetchRepo(repoName, ownerName)
    //     .pipe(
    //       mergeMap(results => {
    //         return this.fetchReadme(repoName, ownerName, results[0].default_branch);
    //       })
    //     ),
    //   this.fetchCollaborators(repoName, ownerName)
    // ])
    // .subscribe(results => {
    //   console.log(results);
    // });


    // forkJoin([
    //   this.fetchRepo(repoName, ownerName),
    //   this.fetchCollaborators(repoName, ownerName)
    // ])
    // .pipe(
    //   mergeMap(results => {
    //     this.fetchReadme(repoName, ownerName, results[0].default_branch);
    //   })
    // )
    // .subscribe(results => {
    //   console.log(results);
    // });

    // this.httpClient.get(finalUrl).subscribe(result => {
    //   console.log(result);
    // });

    return null;
  }

  private fetchRepo(repo: string, owner: string): void {
    const url = `${this.gitLabApiUrl}/${this.gitLabReposEndpoint}/${owner}%2F${repo}`;
    this.httpClient.get<GitHubRepo>(url).subscribe(
      data => {
        console.log(data)
      }
    );
  }
  /*
    private fetchCollaborators(repo: string, owner: string) {
      const url = `${this.githubApiUrl}/${this.githubReposEndpoint}/${owner}/${repo}/${this.githubCollaboratorsEndpoint}`;
      return this.httpClient.get(url);
    }
  
    private fetchReadme(repo: string, owner: string, defaultBranch: string) {
      const url = `${this.githubRawContentUrl}/${owner}/${repo}/${defaultBranch}/${this.githubReadme}`;
      return this.httpClient.get(url);
    }
    */
}
