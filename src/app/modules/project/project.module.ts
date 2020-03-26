import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview/overview.component';
import { ProjectRoutingModule } from './project-routing.module';
import { DetailsComponent } from './details/details.component';

@NgModule({
  declarations: [OverviewComponent, DetailsComponent],
  imports: [
    CommonModule,
    ProjectRoutingModule
  ]
})
export class ProjectModule { }
