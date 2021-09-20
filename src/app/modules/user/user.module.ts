import { UserProjectsComponent } from './user-projects/user-projects.component';
import { UserRoutingModule } from './user-routing.module';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ProjectModule } from 'src/app/modules/project/project.module';


@NgModule({
  declarations: [
    UserProjectsComponent
  ],
  imports: [
        CommonModule,
        UserRoutingModule,
        ProjectModule,
        FormsModule,
        PaginationModule,
        ReactiveFormsModule,
    ]
})
export class UserModule {
}
