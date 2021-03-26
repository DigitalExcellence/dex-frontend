import { Component, OnInit } from '@angular/core';
import { WizardStepBaseComponent } from 'src/app/modules/project/add/main/wizard/wizardPages/wizard-step-base/wizard-step-base.component';

@Component({
  selector: 'app-project-description',
  templateUrl: './project-description.component.html',
  styleUrls: ['./project-description.component.scss', '../../shared-wizard-styles.scss']
})
export class ProjectDescriptionComponent extends WizardStepBaseComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}