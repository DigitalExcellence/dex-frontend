import { Component, OnInit } from '@angular/core';
import { WizardStepBaseComponent } from 'src/app/modules/project/add/main/wizard/wizardPages/wizard-step-base/wizard-step-base.component';
import { FormControl } from '@angular/forms';
import { WizardService } from 'src/app/services/wizard.service';
import { ProjectAdd } from 'src/app/models/resources/project-add';

@Component({
  selector: 'app-project-name',
  templateUrl: './project-name.component.html',
  styleUrls: ['./project-name.component.scss', '../../shared-wizard-styles.scss']
})
export class ProjectNameComponent extends WizardStepBaseComponent implements OnInit {

  /**
   * Form fields
   */
  public projectName = new FormControl('');
  /**
   * Hold a copy of the project temporarily to prevent the service from listening to every change
   */
  private project: ProjectAdd;

  constructor(private wizardService: WizardService) {
    super();
  }

  public ngOnInit(): void {
    this.project = this.wizardService.builtProject;
    if (this.project.name) {
      this.projectName.setValue(this.project.name);
    }
  }

  /**
   * Method which triggers when the button to the next page is pressed
   */
  public onClickNext(): void {
    this.wizardService.updateProject({...this.project, name: this.projectName.value});
    super.onClickNext();
  }
}
