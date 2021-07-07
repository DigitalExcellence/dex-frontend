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
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalAcceptGenericComponent } from 'src/app/components/modals/modal-accept-generic/modal-accept-generic.component';
import { AuthService } from 'src/app/services/auth.service';
import { SEOService } from 'src/app/services/seo.service';
import { LocalStorageOptions, LocalStorageUtils } from 'src/app/utils/localstorage.utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private modalService: BsModalService,
    private seoService: SEOService
  ) {
    seoService.updateTitle('Login');
    seoService.updateDescription('Log in to DeX with your institution ID');
  }

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
    const privacyConsentGiven: boolean = JSON.parse(LocalStorageUtils.getValue(LocalStorageOptions.PrivacyConsentGiven));
    if (privacyConsentGiven) {
      this.authService.login(provider);
    } else {
      // set modal options
      const modalOptions: ModalOptions = {
        initialState: {
          titleText: 'We value your privacy!',
          mainText: `By clicking accept, you agree to our <a href="/privacy" target="_blank" >Privacy Policy</a>. You acknowledge that you have read and understood it. If you have questions or concerns you can <a href="mailto:dex.fhict@gmail.com">contact us</a>.`,
        }
      };
      // Display modal
      const modalRef = this.modalService.show(ModalAcceptGenericComponent, modalOptions);
      // wait for modal to emit true
      modalRef.content.accept.subscribe((result: boolean) => {
        if (result) {
          LocalStorageUtils.setValue(LocalStorageOptions.PrivacyConsentGiven, true);
          this.authService.login(provider);
        }
      });
    }
  }
}
