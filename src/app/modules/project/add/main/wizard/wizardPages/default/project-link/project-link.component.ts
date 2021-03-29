import { Component, OnInit } from '@angular/core';
import { WizardStepBaseComponent } from 'src/app/modules/project/add/main/wizard/wizardPages/wizard-step-base/wizard-step-base.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-project-link',
  templateUrl: './project-link.component.html',
  styleUrls: ['./project-link.component.scss', '../../shared-wizard-styles.scss']
})
export class ProjectLinkComponent extends WizardStepBaseComponent implements OnInit {

  public link = new FormControl('');

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (this.step.project.uri) {
      this.link.setValue(this.step.project.shortDescription);
    }
  }

  onClickNext() {
    if (this.link.valid) {
      this.step.project.uri = this.link.value;
      console.log(this.step.project.uri);
      super.onClickNext();
    }
  }

}
