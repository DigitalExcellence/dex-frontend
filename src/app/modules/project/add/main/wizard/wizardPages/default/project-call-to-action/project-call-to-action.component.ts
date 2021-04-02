import { Component, OnInit } from '@angular/core';
import { WizardStepBaseComponent } from '../../wizard-step-base/wizard-step-base.component';

@Component({
  selector: 'app-project-call-to-action',
  templateUrl: './project-call-to-action.component.html',
  styleUrls: ['./project-call-to-action.component.scss']
})
export class ProjectCallToActionComponent extends WizardStepBaseComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
