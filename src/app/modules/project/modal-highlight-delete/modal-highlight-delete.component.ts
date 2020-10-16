import { AlertService } from './../../../services/alert.service';
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

import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Highlight } from 'src/app/models/domain/highlight';
import { HighlightService } from 'src/app/services/highlight.service';
import { AlertType } from 'src/app/models/internal/alert-type';
import { AlertConfig } from 'src/app/models/internal/alert-config';

/**
 * Pop-up modal where you can select a highlight that
 * you want to delete.
 */
@Component({
  selector: 'app-modal-highlight-delete',
  templateUrl: './modal-highlight-delete.component.html',
  styleUrls: ['./modal-highlight-delete.component.scss']
})
export class ModalHighlightDeleteComponent implements OnInit {

  @Output() confirm = new EventEmitter();

  public deleteHighlightForm: FormGroup;
  public highlights: Highlight[];
  public isNeverEnding = false;
  public defaultTimeStamp = 'Thu, 01 Jan 1970 00:00:00 GMT';

  constructor(
    public bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private highlightService: HighlightService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.deleteHighlightForm = this.formBuilder.group(this.generateFormFields());
    if (this.highlights == null) {
      return;
    }
    this.highlights.forEach(highlight => {
      if (highlight.startDate === this.defaultTimeStamp && highlight.endDate === this.defaultTimeStamp) {
        highlight.isNeverEnding = true;
      }
    });
  }

  /**
   * Method to dynamically create the form fields
   */
  public generateFormFields(): Object {
    const empObj = {};
    for (const highlight of this.highlights) {
      empObj[highlight.id.toString()] = '';
    }
    return empObj;
  }

  /**
   * Method which triggers when the confirm button is clicked. On confirm values are checked.
   * Error message is shown if there is no field selected.
   */
  public onClickConfirm(): void {
    for (const key of Object.keys(this.deleteHighlightForm.value)) {
      const value = this.deleteHighlightForm.value[key];
      if (value != null && value !== '') {
        this.highlightService.delete(+key).subscribe();
      }
    }
    const alertConfig: AlertConfig = {
      type: AlertType.success,
      mainMessage: 'The highlight was succesfully deleted',
      dismissible: true,
      timeout: this.alertService.defaultTimeout
    };
    this.alertService.pushAlert(alertConfig);
    this.confirm.emit();
    this.bsModalRef.hide();
  }

  /**
   * Method which triggers when the deny button is clicked.
   */
  public onClickDeny(): void {
    this.bsModalRef.hide();
  }
}
