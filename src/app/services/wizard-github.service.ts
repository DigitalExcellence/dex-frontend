import { GithubRepo } from './../models/resources/external/github/repo';
import { HttpClient } from '@angular/common/http';
import { Project } from 'src/app/models/domain/project';
import { GenericWizard } from './interfaces/generic-wizard';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { GithubContributor } from '../models/resources/external/contributor';

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

  fetchProjectDetails(url: string): Project {
    const project: Project = null;

    // const ownerName = 'DigitalExcellence';
    // const repoName = 'dex-backend';
    
    const gitLabRegex = new RegExp('^https?:\/\/github.com\/(?<ownerName>.+)\/(?<repoName>.+)$');
    const urlGroups = (url.match(gitLabRegex).groups)
    const ownerName = urlGroups.ownerName;
    const repoName = urlGroups.repoName;

    forkJoin([
      this.fetchRepo(repoName, ownerName),
      this.fetchCollaborators(repoName, ownerName),
      this.fetchRepo(repoName, ownerName)
        .pipe(
          mergeMap((repo) => {
            return this.fetchReadme(repoName, ownerName, repo.default_branch);
          })
        )
    ])
      .subscribe(([repo, collobators, readme]) => {
        console.log(repo, collobators, readme);
      }, error => console.log(error));

    return null;
  }

  private fetchRepo(repo: string, owner: string): Observable<GithubRepo> {
    const url = `${this.githubApiUrl}/${this.githubReposEndpoint}/${owner}/${repo}`;
    return this.httpClient.get<GithubRepo>(url);
  }

  private fetchCollaborators(repo: string, owner: string): Observable<GithubContributor[]> {
    const url = `${this.githubApiUrl}/${this.githubReposEndpoint}/${owner}/${repo}/${this.githubCollaboratorsEndpoint}`;
    return this.httpClient.get<GithubContributor[]>(url);
  }

  private fetchReadme(repo: string, owner: string, defaultBranch: string) {
    const url = `${this.githubRawContentUrl}/${owner}/${repo}/${defaultBranch}/${this.githubReadme}`;
    return this.httpClient.get(url, { responseType: 'text' });
  }
}
