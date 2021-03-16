import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsernameComponent } from './wizardPages/username/username.component';
import { LinkComponent } from './wizardPages/link/wizardlink.component';
import { NgWizardComponent } from '@cmdap/ng-wizard';
import { FinalComponent } from './wizardPages/final/wizardfinal.component';

const wizardConfig = {
  name: 'Wizard',
  navBar: {
    icons: {
      previous: '<em class="fas fa-backward"></em>',
      current: '<em class="fas fa-play"></em>',
      next: '<em class="fas fa-forward"></em>',
    },
  },
  buttons: {
    previous: {
      label: '<em class="fas fa-backward"></em> Previous',
    },
    next: {
      label: 'Next <em class="fas fa-forward"></em>',
    },
  }
};

const doneStepOptions = {
  icon: '<i class="material-icons ng-wizard-icon">done_all</i>',
  buttons: {
    previous: {
      hidden: true,
    },
  },
  cleanQueryParameters: false,
  disableNavigation: true,
};

const routes: Routes = [
  {
    path: '', component: NgWizardComponent, children: [
      {path: 'username', component: UsernameComponent},
      {path: 'link', component: LinkComponent},
      {path: 'done', component: FinalComponent, data: doneStepOptions},
      {path: '**', redirectTo: ''},
    ], data: wizardConfig
  },
  {path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WizardRoutingModule {
}
