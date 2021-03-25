import { Component, OnInit } from '@angular/core';
import { WizardStepBaseComponent } from 'src/app/modules/project/add/main/wizard/wizardPages/dynamic/wizard-step-base/wizard-step-base.component';

@Component({
  selector: 'app-project-image',
  templateUrl: './project-image.component.html',
  styleUrls: ['./project-image.component.scss']
})
export class ProjectImageComponent extends WizardStepBaseComponent implements OnInit {

  constructor() { super(); }

  ngOnInit(): void {
  }

}
