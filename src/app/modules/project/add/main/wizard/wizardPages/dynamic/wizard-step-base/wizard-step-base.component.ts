import { Component, Input } from '@angular/core';
import { WizardPage } from 'src/app/models/domain/wizard-page';

@Component({
  selector: 'app-wizard-step-base',
  template: ``
})
export class WizardStepBaseComponent {
  @Input() step: WizardPage;

  onCompleteStep() {
    this.step.isComplete = true;
  }
}
