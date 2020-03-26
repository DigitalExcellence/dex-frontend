import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { DetailsComponent } from './details/details.component';

const routes: Routes = [
  { path: 'overview', component: OverviewComponent },
  { path: 'details', component: DetailsComponent },
  { path: 'add', loadChildren: () => import('./add/add.module').then(m => m.AddModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
