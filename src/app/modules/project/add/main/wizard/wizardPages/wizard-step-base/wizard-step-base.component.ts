import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WizardPage } from 'src/app/models/domain/wizard-page';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  selector: 'app-wizard-step-base',
  template: ``
})
export class WizardStepBaseComponent {
  @Input() step: WizardPage;
  @Output() clickNext = new EventEmitter();

  /**
   * Method which triggers when the button to the next page is pressed
   */
  public onClickNext() {
    this.step.isComplete = true;
    this.clickNext.emit();
  }


}
