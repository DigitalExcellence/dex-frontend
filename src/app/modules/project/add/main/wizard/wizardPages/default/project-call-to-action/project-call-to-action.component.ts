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
import { Component, OnInit } from '@angular/core';
import { WizardStepBaseComponent } from 'src/app/modules/project/add/main/wizard/wizardPages/wizard-step-base/wizard-step-base.component';
import { CallToActionOptionService } from 'src/app/services/call-to-action-option.service';
import { CallToActionOption } from 'src/app/models/domain/call-to-action-option';
import { ProjectAdd } from 'src/app/models/resources/project-add';
import { WizardService } from 'src/app/services/wizard.service';
import { CallToAction } from 'src/app/models/domain/call-to-action';

@Component({
  selector: 'app-project-call-to-action',
  templateUrl: './project-call-to-action.component.html',
  styleUrls: ['./project-call-to-action.component.scss', '../../shared-wizard-styles.scss']
})
export class ProjectCallToActionComponent extends WizardStepBaseComponent implements OnInit {
  /**
   * Local copy of all call-to-action options
   */
  public callToActionOptions: Array<CallToActionOption>;

  /**
   * The selected call to action option
   */
  public selectedCallToActionOptionIds: number[] = [];

  /**
   * Hold a copy of the project temporarily to prevent the service from listening to every change
   */
  public project: ProjectAdd;
  /**
   * Holds whether the call-to-action options are loading or not
   */
  public callToActionOptionsLoading = true;
  public errorMessage: string;

  constructor(private wizardService: WizardService,
              private callToActionOptionService: CallToActionOptionService) {
    super();
  }

  ngOnInit(): void {
    this.project = this.wizardService.builtProject;
    this.callToActionOptionService.getAll().subscribe(options => {
      this.callToActionOptions = options;
      this.callToActionOptionsLoading = false;

      if (this.project.callToActions?.length > 0) {
        this.selectedCallToActionOptionIds = this.project.callToActions.map(p => p.id);
        this.callToActionOptions = this.callToActionOptions.map(ctaOption => {
          return this.project.callToActions.find(cta => ctaOption.id == cta.id)
              ? {
                ...ctaOption, optionValue: this.project.callToActions.find(cta => ctaOption.id === cta.id).value
              }
              : {
                ...ctaOption
              };
        });
      }
    });
  }

  /**
   * Method which triggers when the button to the next page is pressed
   */
  public onClickNext(): void {
    if (this.selectedCallToActionOptionIds.length > 0) {
      const selectedCallToActions = this.callToActionOptions.filter(option => this.selectedCallToActionOptionIds.includes(option.id));
      if (selectedCallToActions.filter(cta => !this.validURL(cta.optionValue)).length > 0) {
        this.errorMessage = 'Invalid url';
        return;
      }

      console.log(selectedCallToActions);
      console.log(selectedCallToActions.map(cta => ({
        optionValue: cta.value,
        value: cta.optionValue,
        id: cta.id
      })));
      this.wizardService.updateProject({
        ...this.project,
        callToActions: selectedCallToActions.map(cta => ({
          optionValue: cta.value,
          value: cta.optionValue,
          id: cta.id
        }))
      });
    } else {
      // No call to action selected, make sure it's empty
      this.project.callToActions = undefined;
    }
    super.onClickNext();
  }

  /**
   * Method that is triggered when any of the url input fields changes
   * @param event The change event
   * @param callToActionId The id of the call-to-action-option that was changed
   */
  public urlChange(event: Event, callToActionId: number): void {
    const element = event.target as HTMLInputElement;
    const value = element.value;
    this.callToActionOptions = this.callToActionOptions.map(callToActionOption => {
      return callToActionOption.id === callToActionId
          ? {
            ...callToActionOption,
            optionValue: value
          } : callToActionOption;
    });
  }

  /**
   * @param event The browser event
   * @param clickedCheckboxId The clicked radio button
   */
  public ctaButtonClicked(event: Event, clickedCheckboxId: number): void {
    if (!this.selectedCallToActionOptionIds.find(id => id === clickedCheckboxId)) {
      this.selectedCallToActionOptionIds.push(clickedCheckboxId);
    } else {
      this.selectedCallToActionOptionIds.splice(
          this.selectedCallToActionOptionIds.indexOf(
              this.selectedCallToActionOptionIds.find(ctaId => ctaId === clickedCheckboxId)
          ), 1);
    }
  }

  /**
   * Check if the entered url is valid
   * @param url The url that needs to be checked
   */
  private validURL(url: string): boolean {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

    return !!pattern.test(url);
  }
}
