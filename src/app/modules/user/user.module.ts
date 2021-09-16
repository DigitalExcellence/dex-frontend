import { UserProjectsComponent } from './user-projects/user-projects.component';
import { UserRoutingModule } from './user-routing.module';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  ]
})
export class UserModule {
}
