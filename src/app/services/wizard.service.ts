import { Injectable } from '@angular/core';
import { API_CONFIG } from 'src/app/config/api-config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ExternalSource } from 'src/app/models/domain/external-source';
import { BehaviorSubject, Observable } from 'rxjs';
import { WizardPage } from 'src/app/models/domain/wizard-page';
import { Router } from '@angular/router';
import { Project } from 'src/app/models/domain/project';
import { ProjectAdd } from 'src/app/models/resources/project-add';
import { AuthService } from './auth.service';
import { WizardPageConfig } from 'src/app/config/wizard-page-config';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WizardService {
  public allUserProjects: Array<Project>;
  public selectedUserProject: Project;
  public selectedSource: ExternalSource;
  public builtProject: ProjectAdd = {
    callToAction: undefined,
    collaborators: [],
    name: '',
    shortDescription: '',
    uri: '',
    userId: 0
  };
  protected readonly datasourceUrl = API_CONFIG.url + API_CONFIG.dataSourceRoute;
  protected readonly wizardUrl = API_CONFIG.url + API_CONFIG.wizardRoute;
  private readonly defaultSteps: Array<WizardPage> = [
    {
      id: 4,
      authFlow: false,
      orderIndex: 1,
      name: 'What is the name of your project?',
      description: 'What would you like to name your project?',
      isComplete: false
    },
    {
      id: 5,
      authFlow: false,
      orderIndex: 2,
      name: 'How would you describe the project?',
      description: 'Here you can enter a short and long description for the project.',
      isComplete: false
    },
    {
      id: 6,
      authFlow: false,
      orderIndex: 3,
      name: 'What project icon would fit the project?',
      description: 'Please upload a fitting image for the project!',
      isComplete: false
    },
    {
      id: 7,
      authFlow: false,
      orderIndex: 4,
      name: 'Who has worked on the project?',
      description: 'Here you can name all the project members and their role within the project!',
      isComplete: false
    },
    {
      id: 8,
      authFlow: false,
      orderIndex: 5,
      name: 'Would you like to add a call to action button?',
      description: 'If you want to get people in action you can show it here!',
      isComplete: false
    },
    {
      id: 9,
      authFlow: false,
      orderIndex: 5,
      name: 'If your project has a link with a project page or another source you can link it here!',
      description: 'If your project has a link with a project page or another source you can link it here!',
      isComplete: false
    },
  ];
  private readonly steps$ = new BehaviorSubject<WizardPage[]>(null);
  private readonly currentStep$: BehaviorSubject<WizardPage> = new BehaviorSubject<WizardPage>(null);
  private publicFlow: Array<WizardPage>;
  private privateFlow: Array<WizardPage>;
  private selectedFlow: Array<WizardPage>;
  private currentWizardPage: WizardPage;

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

  private static checkNotEmpty(string: string) {
    return string.trim().length > 0;
  }

  public selectExternalSource(source: ExternalSource): void {
    this.selectedSource = source;
  }

  public selectManualSource(): void {
    this.selectedFlow = this.defaultSteps;
  }

  public fetchProjectFromExternalSource(projectUri: string) {
    let params = new HttpParams();
    params = params.append('dataSourceGuid', this.selectedSource.guid);

    return this.http.get<Project>(`${this.wizardUrl}/project/uri/${encodeURIComponent(projectUri)}`, {params: params})
        .pipe(
            tap(
                project => {
                  this.updateProject({
                    collaborators: project.collaborators,
                    userId: this.authService.getCurrentBackendUser().id,
                    shortDescription: project.shortDescription,
                    name: project.name,
                    callToAction: project.callToAction,
                    uri: projectUri,
                    description: project.description
                  });
                  this.determineStepsCompleted(project);
                }
            )
        );
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
    if (index > 1) {
      // -2 because the order index starts at 1, array starts at 0
      this.currentStep$.next(this.steps$.value[index - 2]);
    }
  }

  public isLastStep(): boolean {
    return this.currentStep$.value.orderIndex === this.steps$.value.length;
  }

  /**
   * This function determines the next step in the wizard flow
   */
  public goToNextStep(): void {
    if (!this.selectedFlow || !this.selectedSource) {
      console.log('setting flow');
      this.determineFlow();
    } else {
      this.moveToNextStep();
    }
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

  public resetService(): void {
    this.selectedSource = undefined;
    this.selectedFlow = undefined;
    this.builtProject = {
      callToAction: undefined,
      collaborators: [],
      name: '',
      shortDescription: '',
      uri: '',
      userId: -1
    };
  }

  public updateProject(project: ProjectAdd) {
    this.builtProject = project;
  }

  private setBehaviourSubject(wizardPages: Array<WizardPage>) {
    if (wizardPages !== this.defaultSteps) {
      // Make sure that we do not end up with duplicate pages
      wizardPages = [...wizardPages, ...this.defaultSteps]
          .map((wp, idx) => ({
            ...wp,
            orderIndex: idx + 1
          }));
    }
    // Determine which component belongs to the step
    wizardPages = wizardPages.map((wp: WizardPage) => ({
      ...wp,
      wizardPageName: WizardPageConfig[wp.id]
    }));

    this.steps$.next(wizardPages);
    this.currentStep$.next(wizardPages[0]);
  }

  private determineStepsCompleted(project: Project) {
    let updatedSteps = this.steps$.value;
    if (WizardService.checkNotEmpty(project.name)) {
      updatedSteps.find(step => step.wizardPageName === 'project-name').isComplete = true;
    }
    if (WizardService.checkNotEmpty(project.description) &&
        WizardService.checkNotEmpty(project.shortDescription)) {
      updatedSteps.find(step => step.wizardPageName === 'project-description').isComplete = true;
    }
    if (project.projectIcon) {
      updatedSteps.find(step => step.wizardPageName === 'project-icon').isComplete = true;
    }
    if (project.collaborators.length > 0) {
      updatedSteps.find(step => step.wizardPageName === 'project-collaborators').isComplete = true;
    }
    if (project.callToAction) {
      updatedSteps.find(step => step.wizardPageName === 'project-call-to-action').isComplete = true;
    }
    if (project.uri) {
      updatedSteps.find(step => step.wizardPageName === 'project-link').isComplete = true;
    }
    this.steps$.next(updatedSteps);
  }
}
