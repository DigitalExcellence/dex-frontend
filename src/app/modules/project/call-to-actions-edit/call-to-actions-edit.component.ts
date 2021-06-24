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
import { Component, Input, OnInit } from '@angular/core';
import { CallToActionOption } from 'src/app/models/domain/call-to-action-option';
import { WizardService } from 'src/app/services/wizard.service';
import { CallToActionOptionService } from 'src/app/services/call-to-action-option.service';
import { CallToAction } from 'src/app/models/domain/call-to-action';

@Component({
  selector: 'app-call-to-actions-edit',
  templateUrl: './call-to-actions-edit.component.html',
  styleUrls: ['./call-to-actions-edit.component.scss']
})
export class CallToActionsEditComponent implements OnInit {
  @Input() projectCallToActions: CallToAction[];

  /**
   * Local copy of all call-to-action options
   */
  public callToActionOptions: CallToActionOption[];

  /**
   * The selected call to action option
   */
  public selectedCallToActionOptionIds: number[] = [];

  /**
   * Holds whether the call-to-action options are loading or not
   */
  public callToActionOptionsLoading = true;
  public errorMessage: string;

  constructor(private wizardService: WizardService,
              private callToActionOptionService: CallToActionOptionService) {
  }

  ngOnInit(): void {
    this.callToActionOptionService.getAll().subscribe(options => {
      this.callToActionOptions = options;
      this.callToActionOptionsLoading = false;

      if (this.projectCallToActions) {
        this.callToActionOptions = this.callToActionOptions.map(ctaOption => {
          const callToAction = this.projectCallToActions.find(cta => ctaOption.value.toLowerCase() === cta.optionValue);
          if (callToAction) {
            this.selectedCallToActionOptionIds.push(ctaOption.id);
            return {
              ...ctaOption, optionValue: this.projectCallToActions.find(cta => ctaOption.value.toLowerCase() === cta.optionValue).value
            };
          }
          return {
            ...ctaOption
          };
        });
      }
    });
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

  public validateUrls(): boolean {
    if (this.callToActionOptions.filter(cta => this.selectedCallToActionOptionIds.includes(cta.id) &&
        !this.validURL(cta.optionValue)).length === 0) {
      return true;
    }

    this.errorMessage = 'Invalid url.';
    return false;
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
