import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExternalRoutingModule } from './external-routing.module';
import { MainComponent } from '../main/main.component';
import { EnterLinkPageComponent } from './external-source-pages/enter-link-page/enter-link-page.component';
import { LoginPageComponent } from './external-source-pages/login-page/login-page.component';
import { EnterUsernamePageComponent } from './external-source-pages/enter-username-page/enter-username-page.component';
import { AvailableProjectsPageComponent } from './external-source-pages/available-projects-page/available-projects-page.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [MainComponent, EnterLinkPageComponent, LoginPageComponent, EnterUsernamePageComponent, AvailableProjectsPageComponent],
  imports: [
    CommonModule,
    ExternalRoutingModule,
    ReactiveFormsModule
  ]
})
export class ExternalModule {
}
