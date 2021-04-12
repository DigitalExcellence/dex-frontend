/*
 *  Digital Excellence Copyright (C) 2020 Brend Smits
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU Lesser General Public License as published
 *   by the Free Software Foundation version 3 of the License.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty
 *   of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *   See the GNU Lesser General Public License for more details.
 *
 *   You can find a copy of the GNU Lesser General Public License
 *   along with this program, in the LICENSE.md file in the root project directory.
 *   If not, see https://www.gnu.org/licenses/lgpl-3.0.txt
 */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WizardPage } from 'src/app/models/domain/wizard-page';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  selector: 'app-wizard-step-base',
  template: ``
})
export class WizardStepBaseComponent {
  @Input() step: WizardPage;
  @Input() isOptional = false;
  @Output() clickNext = new EventEmitter();

  /**
   * Method which triggers when the button to the next page is pressed
   */
  public onClickNext(): void {
    this.step.isComplete = true;
    this.clickNext.emit();
  }
}
