import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview/overview.component';
import { ProjectRoutingModule } from './project-routing.module';
import { DetailsComponent } from './details/details.component';
import {ClrAccordionModule} from '@clr/angular';

@NgModule({
  declarations: [OverviewComponent, DetailsComponent],
  imports: [
        CommonModule,
        ProjectRoutingModule,
        ClrAccordionModule
    ]
})
export class ProjectModule { }
