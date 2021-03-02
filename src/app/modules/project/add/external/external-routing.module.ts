import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PickFlowPageComponent } from './external-source-pages/pick-flow-page/pick-flow-page.component';
import { LoginPageComponent } from './external-source-pages/login-page/login-page.component';
import { EnterUsernamePageComponent } from './external-source-pages/enter-username-page/enter-username-page.component';


const routes: Routes = [
  {path: 'pickflow', component: PickFlowPageComponent},
  {path: 'login', component: LoginPageComponent},
  {path: 'username', component: EnterUsernamePageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExternalRoutingModule {
}
