import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api-config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ExternalSource } from '../models/domain/external-source';
import { Observable } from 'rxjs';
import { WizardPage } from '../models/domain/wizard-page';
import { NavigationExtras, Router } from '@angular/router';
import { Project } from '../models/domain/project';

@Injectable({
  providedIn: 'root'
})
export class WizardService {
  public allUserProjects: Array<Project>;
  public selectedUserProject: Project;

  private selectedSource: ExternalSource;
  private publicFlow: Array<WizardPage>;
  private privateFlow: Array<WizardPage>;
  private selectedFlow: Array<WizardPage>;
  private currentWizardPage: WizardPage;
  private userToken: string;
  protected readonly datasourceUrl = API_CONFIG.url + API_CONFIG.dataSourceRoute;
  protected readonly wizardUrl = API_CONFIG.url + API_CONFIG.wizardRoute;

  constructor(
      private http: HttpClient,
      private router: Router) { }

  /**
   * This function fetches all the available external sources
   */
  public fetchExternalSources(): Observable<Array<ExternalSource>> {
    return this.http.get<Array<ExternalSource>>(this.datasourceUrl);
  }

  public fetchProjectsFromExternalSource(selectedSourceGuid: string, token: string): Observable<Array<Project>> {
    let params = new HttpParams();
    params = params.append('dataSourceGuid', selectedSourceGuid);
    params = params.append('token', token);
    params = params.append('needsAuth', this.selectedFlow[0].authFlow.toString());

    return this.http.get<Array<Project>>(this.wizardUrl + '/projects', {
      params: params
    });
  }

  public selectProject(project: Project): void {
    this.selectedUserProject = project;
    console.log('Selected project', this.selectedUserProject);
  }

  /**
   * This function can be used to select the public or private flow
   * @param {string} selectedFlow - The selected flow (private/public)
   */
  public selectFlow(selectedFlow: string): void {
    // Reset position in flow so we know for sure that we begin at the first page
    // When a user changes flow in the middle of the flow.
    this.currentWizardPage = undefined;
    if (selectedFlow.toLowerCase() === 'public') {
      this.selectedFlow = this.publicFlow;
      this.goToNextStep();
    } else if (selectedFlow.toLowerCase() === 'private') {
      this.selectedFlow = this.privateFlow;
      this.goToNextStep();
    } else {
      throw new Error('Invalid flow type');
    }
  }

  /**
   * This function determines the next step in the wizard flow
   */
  public goToNextStep(): void {
    if (!this.selectedFlow) {
      this.determineFlow();
    } else {
      this.determineNextPage();
    }
  }

  private determineFlow(): void {
    // There is no flow selected yet, check which options we have
    // Make sure there are wizard pages
    if (this.selectedSource?.wizardPages.length > 0) {
      this.publicFlow = this.selectedSource.wizardPages.filter(s => s.authFlow === false).sort((s1, s2) => s1.orderIndex - s2.orderIndex);
      this.privateFlow = this.selectedSource.wizardPages.filter(s => s.authFlow === true).sort((s1, s2) => s1.orderIndex - s2.orderIndex);

      if (this.publicFlow.length === 0 && this.privateFlow.length > 0) {
        // There only is a private flow
        this.selectedFlow = this.privateFlow;
        this.goToNextStep();
      } else if (this.publicFlow.length > 0 && this.privateFlow.length === 0) {
        // There is only a public flow
        this.selectedFlow = this.publicFlow;
      } else {
        // Both flows are present
        this.router.navigate(['project', 'add', 'external', 'pickflow']);
      }
    }
  }

  private determineNextPage(): void {
    const nextIndex = this.currentWizardPage?.orderIndex || 0;
    if (nextIndex <= this.selectedFlow.length) {
      this.currentWizardPage = this.selectedFlow[nextIndex];
      let navigationExtras: NavigationExtras = {
        queryParams: {
          'externalSource': this.selectedSource.guid,
          'token': this.userToken
        }
      };

      this.router.navigate(['project', 'add', 'external', this.currentWizardPage.name.toLowerCase()], navigationExtras);
    } else {
      console.info('No steps left');
    }
  }
}
