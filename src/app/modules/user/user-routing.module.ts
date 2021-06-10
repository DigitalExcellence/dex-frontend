import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserProjectComponent } from './user-project/user-project.component';


const routes: Routes = [
  { path: 'projects', component: UserProjectComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
