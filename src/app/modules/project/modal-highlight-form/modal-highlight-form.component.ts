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
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Highlight } from 'src/app/models/domain/highlight';
import { HighlightService } from 'src/app/services/highlight.service';
import * as moment from 'moment';
import { AlertConfig } from 'src/app/models/internal/alert-config';
import { AlertService } from 'src/app/services/alert.service';
import { AlertType } from 'src/app/models/internal/alert-type';
import { FileRetrieverService } from '../../../services/file-retriever.service';
import { FileUploaderComponent } from '../../../components/file-uploader/file-uploader.component';

export interface HighlightFormResult {
  startDate?: Date;
  endDate?: Date;
  description?: string;
  imageId?: number;
  indeterminate: boolean;
}

/**
 * Pop-up modal with duration settings for highlighting a project.
 */
@Component({
  selector: 'app-modal-highlight-form',
  templateUrl: './modal-highlight-form.component.html',
  styleUrls: ['./modal-highlight-form.component.scss']
})
export class ModalHighlightFormComponent implements OnInit, AfterViewInit {
  @Input() highlight: Highlight;
  @Input() canGoBack: Boolean;
  @Output() confirm = new EventEmitter();
  @Output() goBack = new EventEmitter();

  @ViewChild(FileUploaderComponent) fileUploader: FileUploaderComponent;


  public highlightProjectForm: FormGroup;
  public dateFieldsEnabled = true;
  public validationErrorMessage: string = null;
  public canDelete = false;

  /**
   * File uploader variables
   */
  public acceptedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
  public acceptMultiple = false;

  constructor(
      public bsModalRef: BsModalRef,
      private formBuilder: FormBuilder,
      private highlightService: HighlightService,
      private alertService: AlertService,
      private fileRetrieverService: FileRetrieverService
  ) { }

  ngOnInit() {
    this.highlightProjectForm = this.formBuilder.group({
      startDate: [this.highlight?.startDate ? moment(this.highlight?.startDate).format('YYYY-MM-DD') : null],
      endDate: [this.highlight?.endDate ? moment(this.highlight?.endDate).format('YYYY-MM-DD') : null],
      description: [this.highlight?.description],
      indeterminate: [this.highlight?.startDate === null && this.highlight?.endDate === null],
    });

    this.highlightProjectForm.get('indeterminate').valueChanges.subscribe(value => {
      this.onChangeCheckbox(value);
    });

    if (this.highlightProjectForm.get('indeterminate').value === true) {
      this.highlightProjectForm.get('startDate').disable();
      this.highlightProjectForm.get('endDate').disable();
    }

    this.canDelete = !!this.highlight;
  }

  ngAfterViewInit(): void {
    if (this.highlight.image) {
      setTimeout(() => {
        this.fileUploader.setFiles([this.highlight.image]);
      }, 5)
    }
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
      this.validationErrorMessage = 'Error: Fill in a start and end date or choose never ending';
      return;
    }
    if (highlightFormResult.startDate > highlightFormResult.endDate || highlightFormResult.endDate < highlightFormResult.startDate) {
      this.validationErrorMessage = 'Error: Start date can\'t be later than end date';
      return;
    }
    if (highlightFormResult.description === null) {
      this.validationErrorMessage = 'Error: Please enter a description';
      return;
    } else if (highlightFormResult.description.length < 50 || highlightFormResult.description.length > 100) {
      this.validationErrorMessage = 'Error: Description must be between 50 and 100 characters long';
      return;
    }
    if (this.fileUploader.files.length > 0) {
      this.fileUploader.uploadFiles().subscribe(files => {
        this.confirm.emit({
          ...this.highlightProjectForm.value,
          imageId: files[0].id
        });
        this.bsModalRef.hide();
      });
    }
  }

  /**
   * Method that triggers when the upload image button is clicked on mobile
   */
  public mobileUploadButtonClick(): void {
    document.querySelector('input').click();
  }

  /**
   * Method which triggers when the deny button is clicked.
   */
  public onClickDeny(): void {
    this.bsModalRef.hide();
  }

  /**
   * Method which triggers when the back button is clicked.
   */
  public onClickBack(): void {
    this.goBack.emit();
    this.bsModalRef.hide();
  }

  /**
   * Method which triggers when the delete button is clicked.
   */
  public onClickDelete(): void {
    if (!this.canDelete) {
      return;
    }

    this.highlightService.delete(this.highlight.id)
        .subscribe(() => {
          const alertConfig: AlertConfig = {
            type: AlertType.success,
            mainMessage: 'The highlight was succesfully deleted',
            dismissible: true,
            timeout: this.alertService.defaultTimeout
          };

          this.alertService.pushAlert(alertConfig);
          this.bsModalRef.hide();
        });
  }
}
