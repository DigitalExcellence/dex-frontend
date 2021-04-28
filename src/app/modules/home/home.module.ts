import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { HighlightSliderComponent } from './highlight-slider/highlight-slider.component';
import { InfoCardsComponent } from './info-cards/info-cards.component';
import { WhoIsDexComponent } from './who-is-dex/who-is-dex.component';
import { PartnersComponent } from './partners/partners.component';
import { ContainerLeftComponent } from './container-left/container-left.component';
import { ContainerRightComponent } from './container-right/container-right.component';
import { SharedModule } from '../shared/shared.module';
import { StripHtmlPipe } from '../../utils/striptags.pipe';

@NgModule({
  declarations: [
    MainComponent,
    HighlightSliderComponent,
    InfoCardsComponent,
    WhoIsDexComponent,
    PartnersComponent,
    ContainerLeftComponent,
    ContainerRightComponent,
    StripHtmlPipe
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class HomeModule {
}
