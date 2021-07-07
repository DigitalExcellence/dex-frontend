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

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Highlight } from 'src/app/models/domain/highlight';
import { AlertConfig } from 'src/app/models/internal/alert-config';
import { AlertType } from 'src/app/models/internal/alert-type';
import { AlertService } from 'src/app/services/alert.service';
import { HighlightService } from 'src/app/services/highlight.service';

@Component({
  selector: 'app-highlights-modal',
  templateUrl: './highlights-modal.component.html',
  styleUrls: ['./highlights-modal.component.scss']
})
export class HighlightsModalComponent {
  @Input() highlights: Highlight[];
  @Output() selectHighlightToEdit = new EventEmitter();
  @Output() selectAddHighlight = new EventEmitter();

  constructor(
    private bsModalRef: BsModalRef,
    private highlightService: HighlightService,
    private alertService: AlertService
  ) { }

  /**
   * Method which is triggered when a highlight is clicked
   */
  onSelectHighlight(selectedHighlight: Highlight) {
    this.selectHighlightToEdit.emit(selectedHighlight);
    this.hide();
  }


  /**
   * Method which is triggered when the delete button of a highlight is clicked
   */
  onDeleteHighlight(selectedHighlight: Highlight) {
    this.highlightService.delete(selectedHighlight.id)
      .subscribe(() => {
        const alertConfig: AlertConfig = {
          type: AlertType.success,
          mainMessage: 'The highlight was succesfully deleted',
          dismissible: true,
          timeout: this.alertService.defaultTimeout
        };

        this.alertService.pushAlert(alertConfig);
        this.hide();
      });
  }

  /**
   * Method which is triggered when the add button is clicked
   */
  onAddHighlight() {
    this.selectAddHighlight.emit();
    this.hide();
  }

    /**
   * Method to hide the modal
   */
  hide() {
    this.bsModalRef.hide();
  }
}
