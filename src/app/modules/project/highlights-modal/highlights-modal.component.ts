import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Highlight } from '../../../models/domain/highlight';
import { HighlightService } from 'src/app/services/highlight.service';
import { AlertService } from 'src/app/services/alert.service';
import { AlertType } from 'src/app/models/internal/alert-type';
import { AlertConfig } from 'src/app/models/internal/alert-config';

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

  selectHighlight(selectedHighlight: Highlight) {
    this.selectHighlightToEdit.emit(selectedHighlight);
    this.bsModalRef.hide();
  }

  deleteHighlight(selectedHighlight: Highlight) {
    this.highlightService.delete(selectedHighlight.id)
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

  addHighlight() {
    this.selectAddHighlight.emit();
    this.bsModalRef.hide();
  }
}
