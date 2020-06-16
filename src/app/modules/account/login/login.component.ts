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

import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalAcceptGenericComponent } from 'src/app/components/modals/modal-accept-generic/modal-accept-generic.component';
import { Observable, EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private authService: AuthService,
              private modalService: BsModalService,
    ) { }
  public readonly title = 'Sign in';

  /**
   * Method which triggers when the login FHICT button is pressed.
   */
  public onClickLoginFHICT() {
    this.loginWithConsent('FHICT');
  }
  public onClickLoginIdentityServer() {
    this.loginWithConsent();
  }

  /**
   * Checks if the user already has given consent to use their data.
   * If the user did not consent before a modal is shown to request consent.
   */
  private loginWithConsent(provider?: string): void {
    const privacyConsentKeyName = 'PrivacyConsentGiven';
    if (localStorage.getItem(privacyConsentKeyName) === 'true') {
      this.authService.login(provider);
    } else {
      // set modal options
      const modalOptions: ModalOptions = {
        initialState: {
          titleText: 'We value your privacy!',
          mainText: `By clicking accept, you agree to our <a href="/policy" target="_blank">Privacy Policy</a>. You acknowledge that you have read and understand it. If you have questions or concerns you can contact us.`,
        }
      };
      // Display modal
      const modalRef = this.modalService.show(ModalAcceptGenericComponent, modalOptions);
      // wait for the true emitter
      modalRef.content.accept.subscribe((result: boolean) => {
        if (result) {
          localStorage.setItem(privacyConsentKeyName, 'true');
          this.authService.login(provider);
        }
      });
    }
  }
}
