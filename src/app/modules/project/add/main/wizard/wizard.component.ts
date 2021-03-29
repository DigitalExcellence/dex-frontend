import { Component, OnInit } from '@angular/core';
import { WizardPage } from 'src/app/models/domain/wizard-page';
import { Observable } from 'rxjs';
import { WizardService } from 'src/app/services/wizard.service';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { AlertConfig } from 'src/app/models/internal/alert-config';
import { AlertType } from 'src/app/models/internal/alert-type';
import { AlertService } from '../../../../../services/alert.service';
import { LocationStrategy } from '@angular/common';


@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit {
  currentStep: Observable<WizardPage>;

  constructor(
      private wizardService: WizardService,
      private router: Router,
      private projectService: ProjectService,
      private alertService: AlertService,
      private location: LocationStrategy) {
    // check if back or forward button is pressed.
    this.location.onPopState(() => {
      this.wizardService.moveToPreviousStep();
      this.currentStep = this.wizardService.getCurrentStep();
      console.log(this.currentStep);
    });

  }

  ngOnInit(): void {
    if (!this.wizardService.serviceIsValid()) {
      this.router.navigate(['project', 'add']);
    }
    this.currentStep = this.wizardService.getCurrentStep();
    this.wizardService.getSteps().subscribe(items => console.log(items));
  }

  public onNextStep() {
    if (!this.wizardService.isLastStep()) {
      this.wizardService.moveToNextStep();
    } else {
      this.onSubmit();
    }
  }

  public onSubmit(): void {
    this.createProject(this.wizardService.builtProject);
  }

  private createProject(newProject): void {
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
        });
  }
}
