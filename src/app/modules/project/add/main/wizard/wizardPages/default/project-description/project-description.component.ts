import { Component, OnInit } from '@angular/core';
import { WizardStepBaseComponent } from 'src/app/modules/project/add/main/wizard/wizardPages/wizard-step-base/wizard-step-base.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-project-description',
  templateUrl: './project-description.component.html',
  styleUrls: ['./project-description.component.scss', '../../shared-wizard-styles.scss']
})
export class ProjectDescriptionComponent extends WizardStepBaseComponent implements OnInit {

  constructor() {
    super();
  }

  public shortDescription = new FormControl('');
  public longDescription = new FormControl('');

  ngOnInit(): void {
    if (this.step.project.shortDescription) {
      this.shortDescription.setValue(this.step.project.shortDescription);
    }
    if (this.step.project.description) {
      this.longDescription.setValue(this.step.project.description);
    }

    this.shortDescription.valueChanges.subscribe(value => {
      this.step.project.shortDescription = value;
    });
    this.longDescription.valueChanges.subscribe(value => {
      this.step.project.description = value;
    });
  }

}
