import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { UserProjectsComponent } from './user-projects/user-projects.component';
import { ProjectModule } from 'src/app/modules/project/project.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UserProjectsComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ProjectModule,
    FormsModule
  ]
})
export class UserModule {
}
