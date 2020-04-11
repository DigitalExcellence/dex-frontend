import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SourceComponent } from './source/source.component';
import { ManualComponent } from './manual/manual.component';


const routes: Routes = [
  { path: 'source', component: SourceComponent },
  { path: 'manual', component: ManualComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddRoutingModule { }
