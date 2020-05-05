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
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { HomeComponent } from './components/home/home.component';
import { TokenInterceptor } from './interceptors/auth.interceptor';
import { TopHighlightCardsComponent } from './modules/highlight/top-highlight-cards/top-highlight-cards.component';
import { SharedModule } from './modules/shared/shared.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalComponent } from './components/modal/modal.component';
import { ModalService } from './services/modal.service';

@NgModule({
  declarations: [AppComponent, AppLayoutComponent, HomeComponent, AuthCallbackComponent, TopHighlightCardsComponent, ModalComponent],
  imports: [BsDropdownModule.forRoot(), BrowserModule, AppRoutingModule, BrowserAnimationsModule, HttpClientModule, SharedModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    ModalService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
