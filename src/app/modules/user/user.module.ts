import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserProjectComponent } from './user-project/user-project.component';


@NgModule({
  declarations: [UserProjectComponent],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }
