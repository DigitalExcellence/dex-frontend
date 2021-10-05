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
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlertComponent } from './components/alert/alert.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { FooterComponent } from './components/footer/footer.component';
import { ModalDeleteGenericComponent } from './components/modals/modal-delete-generic/modal-delete-generic.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { SearchComponent } from './components/search/search.component';
import { errorHandlerFactory } from './error-handler/error-handler-factory';
import { TokenInterceptor } from './interceptors/auth.interceptor';
import { HttpErrorInterceptor } from './interceptors/http.interceptor';
import { HomeModule } from './modules/home/home.module';
import { ProjectModule } from './modules/project/project.module';
import { SharedModule } from './modules/shared/shared.module';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { QuillModule } from 'ngx-quill';
import { ModalPotentialNewOwnerUserEmailComponent } from './components/modals/modal-potential-new-owner-user-email/modal-potential-new-owner-user-email.component';
import { ModalPotentialNewOwnerUserEmailConfirmationComponent } from './components/modals/modal-potential-new-owner-user-email-confirmation/modal-potential-new-owner-user-email-confirmation.component';
import { TransferOwnershipComponent } from './modules/project/transfer-ownership/transfer-ownership.component';
import { ModalInformationGenericComponent } from './components/modals/modal-information-generic/modal-information-generic.component';

@NgModule({
  declarations: [
    AppComponent,
    AppLayoutComponent,
    AuthCallbackComponent,
    AlertComponent,
    FooterComponent,
    PrivacyPolicyComponent,
    NotFoundComponent,
    ModalDeleteGenericComponent,
    SearchComponent,
    ModalPotentialNewOwnerUserEmailComponent,
    ModalPotentialNewOwnerUserEmailConfirmationComponent,
    TransferOwnershipComponent,
    ModalInformationGenericComponent
  ],
  imports: [
    BsDropdownModule.forRoot(),
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    QuillModule.forRoot(),
    HomeModule,
    ProjectModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    {
      provide: ErrorHandler,
      useFactory: errorHandlerFactory,
    }
  ],
  bootstrap: [AppComponent],
  exports: [SearchComponent]
})
export class AppModule { }
