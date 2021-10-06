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
import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectAdd } from 'src/app/models/resources/project-add';
import { WizardStepBaseComponent } from 'src/app/modules/project/add/main/wizard/wizardPages/wizard-step-base/wizard-step-base.component';
import { CallToActionsEditComponent } from 'src/app/modules/project/call-to-actions-edit/call-to-actions-edit.component';
import { WizardService } from 'src/app/services/wizard.service';

@Component({
  selector: 'app-project-call-to-action',
  templateUrl: './project-call-to-action.component.html',
  styleUrls: ['./project-call-to-action.component.scss', '../../shared-wizard-styles.scss']
})
export class ProjectCallToActionComponent extends WizardStepBaseComponent implements OnInit {
  /**
   * Hold a copy of the project temporarily to prevent the service from listening to every change
   */
  public project: ProjectAdd;
  @ViewChild(CallToActionsEditComponent) callToActions: CallToActionsEditComponent;

  /**
   * Holds whether the call-to-action options are loading or not
   */

  constructor(private wizardService: WizardService) {
    super();
  }

  ngOnInit(): void {
    this.project = this.wizardService.builtProject;
  }

  /**
   * Method which triggers when the button to the next page is pressed
   */
  public onClickNext(): void {
    if (this.callToActions.selectedCallToActionOptionIds.length > 0) {
      if (this.callToActions.validateUrls()) {
        const selectedCallToActions = this.callToActions.callToActionOptions
            .filter(option => this.callToActions.selectedCallToActionOptionIds
                .includes(option.id));

        this.wizardService.updateProject({
          ...this.project,
          callToActions: selectedCallToActions.map(cta => ({
            optionValue: cta.value,
            value: cta.optionValue,
            id: cta.id
          }))
        });
        super.onClickNext();
      }
    } else {
      // No call to action selected, make sure it's empty
      this.project.callToActions = undefined;
      super.onClickNext();
    }
  }
}
