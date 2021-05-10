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
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { FormsModule } from '@angular/forms';
import { TokenInterceptor } from './interceptors/auth.interceptor';
import { SharedModule } from './modules/shared/shared.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FooterComponent } from './components/footer/footer.component';
import { HttpErrorInterceptor } from './interceptors/http.interceptor';
import { errorHandlerFactory } from './error-handler/error-handler-factory';
import { AlertModule } from 'ngx-bootstrap/alert';
import { AlertComponent } from './components/alert/alert.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { ModalDeleteGenericComponent } from './components/modals/modal-delete-generic/modal-delete-generic.component';
import { QuillModule } from 'ngx-quill';
import { HomeModule } from './modules/home/home.module';


@NgModule({
  declarations: [
    AppComponent,
    AppLayoutComponent,
    AuthCallbackComponent,
    AlertComponent,
    FooterComponent,
    PrivacyPolicyComponent,
    NotFoundComponent,
    ModalDeleteGenericComponent
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
    HomeModule
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
})
export class AppModule { }
