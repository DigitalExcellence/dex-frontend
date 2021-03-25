import { Component, OnInit } from '@angular/core';
import { WizardStepBaseComponent } from '../../dynamic/wizard-step-base/wizard-step-base.component';

@Component({
  selector: 'app-project-icon',
  templateUrl: './project-icon.component.html',
  styleUrls: ['./project-icon.component.scss']
})
export class ProjectIconComponent extends WizardStepBaseComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
