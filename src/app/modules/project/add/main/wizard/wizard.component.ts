import { Component, OnInit } from '@angular/core';
import { WizardPage } from 'src/app/models/domain/wizard-page';
import { Observable } from 'rxjs';
import { WizardService } from 'src/app/services/wizard.service';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { AlertConfig } from 'src/app/models/internal/alert-config';
import { AlertType } from 'src/app/models/internal/alert-type';
import { AlertService } from 'src/app/services/alert.service';
import { LocationStrategy } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectAdd } from 'src/app/models/resources/project-add';


@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit {
  /**
   * Copy of the current page to prevent unnecessary service calls
   */
  public currentStep: Observable<WizardPage>;
  public formSubmitted: boolean;

  constructor(
      private wizardService: WizardService,
      private router: Router,
      private projectService: ProjectService,
      private alertService: AlertService,
      private location: LocationStrategy,
      private authService: AuthService) {
    // check if back or forward button is pressed and prevent it.
    this.registerNavigationListener();
  }

  ngOnInit(): void {
    if (!this.wizardService.serviceIsValid()) {
      this.router.navigate(['project', 'add']);
    }
    this.formSubmitted = false;
    this.currentStep = this.wizardService.getCurrentStep();
    console.log(this.currentStep);
  }

  /**
   * Method which triggers when the form is submitted
   */
  public onSubmit(): void {
    if (this.wizardService.allStepsCompleted()) {
      const project = this.wizardService.builtProject;
      project.userId = this.authService.getCurrentBackendUser().id;
      this.createProject(project);
    } else {
      const alertConfig: AlertConfig = {
        type: AlertType.danger,
        mainMessage: 'Please complete all the steps',
        dismissible: true,
        autoDismiss: true,
        timeout: this.alertService.defaultTimeout
      };
      this.alertService.pushAlert(alertConfig);
    }
  }

  /**
   * Method which triggers when the button to the next page is pressed
   */
  public onNextStep() {
    if (this.wizardService.isLastStep()) {
      this.onSubmit();
    } else {
      this.wizardService.moveToNextStep();
    }
  }

  /**
   * Method that will take the built project in the wizard and send it to the backend
   * @param newProject - the built projec
   */
  private createProject(newProject: ProjectAdd): void {
    this.formSubmitted = true;
    this.projectService
        .post(newProject)
        .subscribe(() => {
          const alertConfig: AlertConfig = {
            type: AlertType.success,
            mainMessage: 'Project was succesfully saved',
            dismissible: true,
            autoDismiss: true,
            timeout: this.alertService.defaultTimeout
          };
          this.alertService.pushAlert(alertConfig);
          this.router.navigate([`/project/overview`]);
        }, error => {
          const alertConfig: AlertConfig = {
            type: AlertType.danger,
            mainMessage: error,
            dismissible: true,
            autoDismiss: true,
            timeout: this.alertService.defaultTimeout
          };
          this.alertService.pushAlert(alertConfig);
          this.formSubmitted = false;
        });
  }

  private registerNavigationListener(): void {
    history.pushState(null, null, location.href);
    this.location.onPopState((e) => {
      history.pushState(null, null, location.href);
      this.wizardService.moveToPreviousStep();
      this.currentStep = this.wizardService.getCurrentStep();
    });
  }
}
