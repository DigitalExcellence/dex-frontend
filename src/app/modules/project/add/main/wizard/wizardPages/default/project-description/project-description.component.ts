import { Component, OnInit } from '@angular/core';
import { WizardStepBaseComponent } from '../../dynamic/wizard-step-base/wizard-step-base.component';

@Component({
  selector: 'app-project-description',
  templateUrl: './project-description.component.html',
  styleUrls: ['./project-description.component.scss']
})
export class ProjectDescriptionComponent extends WizardStepBaseComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
