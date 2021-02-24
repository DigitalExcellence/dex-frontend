import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExternalRoutingModule } from './external-routing.module';
import { MainComponent } from '../main/main.component';
import { EnterLinkPageComponent } from './external-source-pages/enter-link-page/enter-link-page.component';


@NgModule({
  declarations: [MainComponent, EnterLinkPageComponent],
  imports: [
    CommonModule,
    ExternalRoutingModule
  ]
})
export class ExternalModule {
}
