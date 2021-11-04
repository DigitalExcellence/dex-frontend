import { Component, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-potential-new-owner-user-email',
  templateUrl: './modal-potential-new-owner-user-email.component.html',
  styleUrls: ['./modal-potential-new-owner-user-email.component.scss']
})
export class ModalPotentialNewOwnerUserEmailComponent {

  public potentialNewOwnerUserEmail: string;
  @Output() potentialNewOwnerUserEmailEvent = new EventEmitter<string>();

  constructor(
    public bsModalRef: BsModalRef,
  ) { }

  /**
   * Method which triggers when continue is clicked.
   * Emits true via the output property and closes the modal.
   */
  public onClickContinue(): void {
    this.bsModalRef.hide();
    this.potentialNewOwnerUserEmailEvent.emit(this.potentialNewOwnerUserEmail);
  }
}
