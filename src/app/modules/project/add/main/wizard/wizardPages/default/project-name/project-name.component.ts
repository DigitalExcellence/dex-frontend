import { Component, OnInit } from '@angular/core';
import { WizardStepBaseComponent } from 'src/app/modules/project/add/main/wizard/wizardPages/wizard-step-base/wizard-step-base.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-project-name',
  templateUrl: './project-name.component.html',
  styleUrls: ['./project-name.component.scss', '../../shared-wizard-styles.scss']
})
export class ProjectNameComponent extends WizardStepBaseComponent implements OnInit {

  constructor() {
    super();
  }

  public projectName = new FormControl('');

  async ngOnInit(): Promise<void> {
    this.step.project.subscribe(project => {
      if (project.name) {
        this.projectName.setValue(project.name);
      }

      this.projectName.valueChanges.subscribe(value => {
        this.step.updateProject({name: value, ...project});
      });
    });
  }
}
