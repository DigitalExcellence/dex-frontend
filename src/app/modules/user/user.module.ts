import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserProjectComponent } from './user-project/user-project.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ProjectModule } from '../project/project.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [UserProjectComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    PaginationModule.forRoot(),
    ProjectModule,
    FormsModule
  ]
})
export class UserModule { }
