import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-potential-new-owner-user-email-confirmation',
  templateUrl: './modal-potential-new-owner-user-email-confirmation.component.html',
  styleUrls: ['./modal-potential-new-owner-user-email-confirmation.component.scss']
})
export class ModalPotentialNewOwnerUserEmailConfirmationComponent {

  @Input() email: string;
  @Output() didConfirmEvent = new EventEmitter<boolean>();

  constructor(
    public bsModalRef: BsModalRef,
  ) { }

  /**
   * Method which triggers when accept is clicked.
   * Emits true via the output property and closes the modal.
   */
  public onAcceptClicked(): void {
    this.didConfirmEvent.emit(true);
    this.bsModalRef.hide();
  }
}
