import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PickFlowPageComponent } from './external-source-pages/pick-flow-page/pick-flow-page.component';
import { MainComponent } from '../main/main.component';


const routes: Routes = [

  {path: '/', component: MainComponent, pathMatch: 'full'},
  {path: '1/:flow-guid', component: PickFlowPageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExternalRoutingModule {
}
