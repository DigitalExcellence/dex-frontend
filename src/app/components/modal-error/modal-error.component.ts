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
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

/**
 * Component which functions as a modal. Functions as proof of concept to use NGX-bootstrap modals.
 */
@Component({
  selector: 'app-modal-error',
  templateUrl: './modal-error.component.html',
  styleUrls: ['./modal-error.component.scss']
})
export class ModalErrorComponent implements OnInit {

  /**
   * EventEmitters to output which button was clicked.
   * Could also be one eventEmitter which emits a boolean instead of use two separate events.
   */
  @Output() confirm = new EventEmitter();
  @Output() deny = new EventEmitter();

  constructor(
    public bsModalRef: BsModalRef
  ) { }

  ngOnInit(): void {
  }

  /**
   * Method which triggers when the confirm button is clicked.
   */
  public onClickConfirm(): void {
    this.confirm.emit();
    this.bsModalRef.hide();
  }

  /**
   * Method which triggers when the deny button is clicked.
   */
  public onClickDeny(): void {
    this.deny.emit();
    this.bsModalRef.hide();
  }

}
