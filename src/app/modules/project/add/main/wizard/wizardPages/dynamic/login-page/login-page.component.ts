import { Component, OnInit } from '@angular/core';
import { WizardStepBaseComponent } from '../wizard-step-base/wizard-step-base.component';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent extends WizardStepBaseComponent implements OnInit {

  constructor() { super(); }

  ngOnInit(): void {
  }

}
