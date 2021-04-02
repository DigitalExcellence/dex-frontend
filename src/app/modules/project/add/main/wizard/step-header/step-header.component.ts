import { Component, OnInit } from '@angular/core';
import { WizardPage } from 'src/app/models/domain/wizard-page';
import { WizardService } from 'src/app/services/wizard.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-step-header',
  templateUrl: './step-header.component.html',
  styleUrls: ['./step-header.component.scss']
})
export class StepHeaderComponent implements OnInit {

  steps: Observable<Array<WizardPage>>;
  currentStep: Observable<WizardPage>;

  constructor(private stepsService: WizardService) { }

  ngOnInit(): void {
    this.steps = this.stepsService.getSteps();
    this.currentStep = this.stepsService.getCurrentStep();
    this.steps.subscribe(steps => console.log(steps));
  }

  onStepClick(step: WizardPage) {
    this.stepsService.setCurrentStep(step);
  }

}
