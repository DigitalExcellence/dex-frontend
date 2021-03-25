import { Component, OnInit } from '@angular/core';
import { WizardStepBaseComponent } from '../../dynamic/wizard-step-base/wizard-step-base.component';

@Component({
  selector: 'app-project-name',
  templateUrl: './project-name.component.html',
  styleUrls: ['./project-name.component.scss']
})
export class ProjectNameComponent extends WizardStepBaseComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
