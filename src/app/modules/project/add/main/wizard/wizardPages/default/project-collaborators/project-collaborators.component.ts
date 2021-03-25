import { Component, OnInit } from '@angular/core';
import { WizardStepBaseComponent } from '../../dynamic/wizard-step-base/wizard-step-base.component';

@Component({
  selector: 'app-project-collaborators',
  templateUrl: './project-collaborators.component.html',
  styleUrls: ['./project-collaborators.component.scss']
})
export class ProjectCollaboratorsComponent extends WizardStepBaseComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
