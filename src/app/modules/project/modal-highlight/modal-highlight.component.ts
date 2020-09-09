/*
 *
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
 *
 */
import { Component, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup } from '@angular/forms';

export interface HighlightFormResult {
  startDate?: Date;
  endDate?: Date;
  description?: string;
  indeterminate: boolean;
}

/**
 * Pop-up modal with duration settings for highlighting a project.
 */
@Component({
  selector: 'app-modal-highlight',
  templateUrl: './modal-highlight.component.html',
  styleUrls: ['./modal-highlight.component.scss']
})
export class ModalHighlightComponent {

  @Output() confirm = new EventEmitter();

  public highlightProjectForm: FormGroup;
  public dateFieldsEnabled = true;
  public dateErrorMessage: string = null;

  constructor(
    public bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
  ) {
    this.highlightProjectForm = this.formBuilder.group({
      startDate: [null],
      endDate: [null],
      description: [null],
      indeterminate: [false],
    });

    this.highlightProjectForm.get('indeterminate').valueChanges.subscribe(value => {
      this.onChangeCheckbox(value);
    });
  }

  /**
   * This method disables the start date and end date fields when the indeterminate checkbox is checked.
   * @param checked the value of the check input.
   */
  public onChangeCheckbox(checked: boolean): void {
    if (checked) {
      this.highlightProjectForm.get('startDate').disable();
      this.highlightProjectForm.get('endDate').disable();
    } else {
      this.highlightProjectForm.get('startDate').enable();
      this.highlightProjectForm.get('endDate').enable();
    }

  }
  /**
   * Method which triggers when the confirm button is clicked. On confirm highlight form values are checked.
   * Error message is shown if the form fields are empty.
   * Error message is shown if the start date later than the end date.
   */
  public onClickConfirm(): void {
    const highlightFormResult: HighlightFormResult = this.highlightProjectForm.value;

    if ((highlightFormResult.startDate == null || highlightFormResult.endDate == null) &&
      highlightFormResult.indeterminate === false) {
      this.dateErrorMessage = 'Error: Fill in a start and end date or choose never ending';
      return;
    }
    if (highlightFormResult.startDate > highlightFormResult.endDate || highlightFormResult.endDate < highlightFormResult.startDate) {
      this.dateErrorMessage = 'Error: Start date can\'t be later than end date';
      return;
    }
    if (highlightFormResult.description === null) {
      this.dateErrorMessage = 'Error: Please enter a description';
      return;
    }
    this.confirm.emit(this.highlightProjectForm.value);
    this.bsModalRef.hide();
  }

  /**
   * Method which triggers when the deny button is clicked.
   */
  public onClickDeny(): void {
    this.bsModalRef.hide();
  }
}
