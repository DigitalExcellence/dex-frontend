import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Highlight } from 'src/app/models/domain/hightlight';

@Component({
  selector: 'app-modal-highlight-edit',
  templateUrl: './modal-highlight-edit.component.html',
  styleUrls: ['./modal-highlight-edit.component.scss']
})
export class ModalHighlightEditComponent {
  @Input() highlights: Highlight[];
  @Output() selectHighlightToEdit = new EventEmitter();

  constructor(public bsModalRef: BsModalRef) {}

  selectHighlight(selectedHighlight: Highlight) {
    this.selectHighlightToEdit.emit(selectedHighlight);
    this.bsModalRef.hide();
  }
}
