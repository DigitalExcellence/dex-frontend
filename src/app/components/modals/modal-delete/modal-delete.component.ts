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
import { Highlight } from 'src/app/models/domain/hightlight';
import { HighlightService } from 'src/app/services/highlight.service';

/**
 * Pop-up modal where you can select a highlight that
 * you want to delete.
 */
@Component({
    selector: 'app-modal',
    templateUrl: './modal-delete.component.html',
    styleUrls: ['./modal-delete.component.scss']
  })
  export class ModalDeleteComponent implements OnInit {

    @Output() confirm = new EventEmitter();

    public deleteHighlightForm: FormGroup;
    public highlights: Highlight[];
    public isNeverEnding = false;
    public defaultTimeStamp = 'Thu, 01 Jan 1970 00:00:00 GMT';

    constructor(
      public bsModalRef: BsModalRef,
      private formBuilder: FormBuilder,
      private highlightService: HighlightService
    ) {}

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
