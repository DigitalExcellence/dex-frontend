import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WizardPage } from 'src/app/models/domain/wizard-page';

@Component({
  selector: 'app-wizard-step-base',
  template: ``
})
export class WizardStepBaseComponent {
  @Input() step: WizardPage;
  @Output() clickNext = new EventEmitter();

  onCompleteStep() {
    this.step.isComplete = true;
  }

  onClickNext() {
    this.onCompleteStep();
    this.clickNext.emit();
  }
}
