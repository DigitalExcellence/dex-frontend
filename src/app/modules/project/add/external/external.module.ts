import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExternalRoutingModule } from './external-routing.module';
import { MainComponent } from '../main/main.component';
import { EnterLinkPageComponent } from './external-source-pages/enter-link-page/enter-link-page.component';
import { LoginPageComponent } from './external-source-pages/login-page/login-page.component';


@NgModule({
  declarations: [MainComponent, EnterLinkPageComponent, LoginPageComponent],
  imports: [
    CommonModule,
    ExternalRoutingModule
  ]
})
export class ExternalModule {
}
