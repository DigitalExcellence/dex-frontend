import { Component, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-information-generic',
  templateUrl: './modal-information-generic.component.html',
  styleUrls: ['./modal-information-generic.component.scss']
})
export class ModalInformationGenericComponent {

  @Output() cta = new EventEmitter<boolean>(true);

  public readonly titleText = '';
  public readonly mainText = '';
  public readonly ctaButtonText = '';
  public readonly secondaryButtonText = '';

  constructor(
    public bsModalRef: BsModalRef,
  ) { }

  ngOnInit(): void {
  }

  /**
   * Method which triggers when remove is confirmed.
   * Emits true via the output property and closes the modal.
   */
  public onClickCta(): void {
    this.cta.emit(true);
    this.bsModalRef.hide();
  }

}
