import { Injectable } from '@angular/core';
import { API_CONFIG } from 'src/app/config/api-config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ExternalSource } from 'src/app/models/domain/external-source';
import { BehaviorSubject, Observable } from 'rxjs';
import { WizardPage } from 'src/app/models/domain/wizard-page';
import { Router } from '@angular/router';
import { Project } from 'src/app/models/domain/project';
import { ProjectAdd } from '../models/resources/project-add';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WizardService {
  public allUserProjects: Array<Project>;
  public selectedUserProject: Project;
  public selectedSource: ExternalSource;
  protected readonly datasourceUrl = API_CONFIG.url + API_CONFIG.dataSourceRoute;
  protected readonly wizardUrl = API_CONFIG.url + API_CONFIG.wizardRoute;
  private steps$: BehaviorSubject<Array<WizardPage>>;
  private currentStep$: BehaviorSubject<WizardPage> = new BehaviorSubject<WizardPage>(null);
  private publicFlow: Array<WizardPage>;
  private privateFlow: Array<WizardPage>;
  private selectedFlow: Array<WizardPage>;
  private currentWizardPage: WizardPage;
  public builtProject: ProjectAdd = {
    callToAction: undefined,
    collaborators: [],
    name: '',
    shortDescription: '',
    uri: '',
    userId: 0
  };

  private defaultSteps: Array<WizardPage> = [
    {
      authFlow: false,
      orderIndex: 1,
      name: 'project-name',
      description: 'What would you like to name your project?',
      isComplete: false,
      project: this.builtProject
    },
    {
      authFlow: false,
      orderIndex: 2,
      name: 'project-description',
      description: 'How would you describe your project?',
      isComplete: false,
      project: this.builtProject
    },
    {
      authFlow: false,
      orderIndex: 3,
      name: 'project-icon',
      description: 'Do you have any images that fit your project?',
      isComplete: false,
      project: this.builtProject
    },
    {
      authFlow: false,
      orderIndex: 4,
      name: 'project-collaborators',
      description: 'Who collaborated to your project?',
      isComplete: false,
      project: this.builtProject
    },
    {
      authFlow: false,
      orderIndex: 5,
      name: 'project-link',
      description: 'Do you have a link for you project?',
      isComplete: false,
      project: this.builtProject
    },
  ];

  constructor(
      private http: HttpClient,
      private router: Router,
      private authService: AuthService) { }

  /**
   * This function fetches all the available external sources
   */
  public fetchExternalSources(): Observable<Array<ExternalSource>> {
    return this.http.get<Array<ExternalSource>>(this.datasourceUrl);
  }

  public fetchProjectFromExternalSource(projectUri: string): Observable<Project> {
    return this.http.get<Project>(`${this.wizardUrl}/uri/${projectUri}`, {
      params: {
        dataSourceGuid: this.selectedSource.guid
      }
    });
  }

  public fetchProjectsFromExternalSource(selectedSourceGuid: string, token: string): Observable<Array<Project>> {
    let params = new HttpParams();
    params = params.append('dataSourceGuid', selectedSourceGuid);
    params = params.append('token', token);
    params = params.append('needsAuth', 'false');

    return this.http.get<Array<Project>>(this.wizardUrl + '/projects', {
      params: params
    });
  }

  public selectExternalSource(source: ExternalSource): void {
    this.selectedSource = source;
  }

  public selectManualSource(): void {
    this.selectedFlow = this.defaultSteps;
  }

  /**
   * This function determines the next step in the wizard flow
   */
  public goToNextStep(): void {
    if (!this.steps$) {
      this.determineFlow();
    } else {
      this.moveToNextStep();
    }
  }

  public serviceIsValid(): boolean {
    return this.steps$.value.length > 0 && this.authService.getCurrentBackendUser().id > 0;
  }

  public setCurrentStep(step: WizardPage): void {
    this.currentStep$.next(step);
  }

  public getCurrentStep(): Observable<WizardPage> {
    return this.currentStep$.asObservable();
  }

  public getSteps(): Observable<Array<WizardPage>> {
    return this.steps$.asObservable();
  }

  public moveToNextStep(): void {
    const index = this.currentStep$.value.orderIndex;

    if (index < this.steps$.value.length) {
      this.currentStep$.next(this.steps$.value[index]);
    }
  }

  public moveToPreviousStep(): void {
    const index = this.currentStep$.value.orderIndex;
    console.log(index);
    if (index > 1) {
      // -2 because the order index starts at 1, array starts at 0
      this.currentStep$.next(this.steps$.value[index - 2]);
    }
  }

  public isLastStep(): boolean {
    return this.currentStep$.value.orderIndex === this.steps$.value.length;
  }

  public resetService(): void {
    this.steps$ = undefined;
    this.selectedSource = undefined;
    this.selectedFlow = undefined;
  }

  public allStepsCompleted() {
    return this.steps$.value.every(page => page.isComplete);
  }

  private determineFlow(): void {
    // There is no flow selected yet, check which options we have
    // Make sure there are wizard pages
    if (this.selectedSource?.wizardPages.length > 0) {
      this.publicFlow = this.selectedSource.wizardPages.filter(s => s.authFlow === false).sort((s1, s2) => s1.orderIndex - s2.orderIndex);
      this.privateFlow = this.selectedSource.wizardPages.filter(s => s.authFlow === true).sort((s1, s2) => s1.orderIndex - s2.orderIndex);

      if (this.publicFlow.length === 0 && this.privateFlow.length > 0) {
        // There only is a private flow
        this.setBehaviourSubject(this.privateFlow);
        this.goToNextStep();
      } else if (this.publicFlow.length > 0 && this.privateFlow.length === 0) {
        // There is only a public flow
        this.setBehaviourSubject(this.publicFlow);
      } else {
        // TODO: Change this to determine flow so the user can pick.
        this.setBehaviourSubject(this.publicFlow);
      }
    } else {
      // Flow is invalid or the manual flow was selected
      this.setBehaviourSubject(this.defaultSteps);
    }
  }

  private setBehaviourSubject(wizardPages: Array<WizardPage>) {
    if (wizardPages !== this.defaultSteps) {
      // Make sure that we do not end up with duplicate pages
      wizardPages = [...wizardPages, ...this.defaultSteps];
      for (let i = 1; i < wizardPages.length; i++) {
        wizardPages[i].orderIndex = i;
      }
    }
    this.steps$ = new BehaviorSubject<Array<WizardPage>>(wizardPages);
    this.currentStep$.next(this.steps$.value[0]);
  }
}
