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
import { Component } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

/**
 * Modal to remove items.
 * Emits true via remove property if the removable was confirmed.
 */
@Component({
  selector: 'app-modal-delete-generic',
  templateUrl: './modal-delete-generic.component.html',
  styleUrls: ['./modal-delete-generic.component.scss']
})
export class ModalDeleteGenericComponent {

  @Output() remove = new EventEmitter<boolean>();

  public readonly titleText = '';
  public readonly mainText = '';

  constructor(
    public bsModalRef: BsModalRef,
  ) { }

  /**
   * Method which triggers when remove is confirmed.
   * Emits true via the output property and closes the modal.
   */
  public onClickDelete(): void {
    this.remove.emit(true);
    this.bsModalRef.hide();
  }

}
