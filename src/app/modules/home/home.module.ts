import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { HighlightSliderComponent } from './highlight-slider/highlight-slider.component';
import { InfoCardsComponent } from './info-cards/info-cards.component';
import { WhoIsDexComponent } from './who-is-dex/who-is-dex.component';
import { PartnersComponent } from './partners/partners.component';
import { ContainerLeftComponent } from './container-left/container-left.component';
import { ContainerRightComponent } from './container-right/container-right.component';
import { StripHtmlPipe } from 'src/app/utils/striptags.pipe';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { RecommendationCardsComponent } from './recommendations/recommendations.component';
import { ProjectModule } from '../project/project.module';

@NgModule({
  declarations: [
    MainComponent,
    HighlightSliderComponent,
    InfoCardsComponent,
    WhoIsDexComponent,
    PartnersComponent,
    ContainerLeftComponent,
    ContainerRightComponent,
    StripHtmlPipe,
    RecommendationCardsComponent
    
  ],
  imports: [
    CommonModule,
    PopoverModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    ProjectModule
  ]
})
export class HomeModule {
}
