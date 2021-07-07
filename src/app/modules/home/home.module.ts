import { ContainerLeftComponent } from './container-left/container-left.component';
import { ContainerRightComponent } from './container-right/container-right.component';
import { HighlightSliderComponent } from './highlight-slider/highlight-slider.component';
import { InfoCardsComponent } from './info-cards/info-cards.component';
import { MainComponent } from './main/main.component';
import { PartnersComponent } from './partners/partners.component';
import { RecommendationCardsComponent } from './recommendations/recommendations.component';
import { WhoIsDexComponent } from './who-is-dex/who-is-dex.component';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ProjectModule } from 'src/app/modules/project/project.module';
import { StripHtmlPipe } from 'src/app/utils/striptags.pipe';


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
        ProjectModule,
        CarouselModule
    ]
})
export class HomeModule {
}
