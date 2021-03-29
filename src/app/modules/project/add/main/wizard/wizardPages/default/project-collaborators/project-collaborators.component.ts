import { Component, OnInit } from '@angular/core';
import { WizardStepBaseComponent } from 'src/app/modules/project/add/main/wizard/wizardPages/wizard-step-base/wizard-step-base.component';
import { FormControl } from '@angular/forms';
import { CollaboratorAdd } from 'src/app/models/resources/collaborator-add';

@Component({
  selector: 'app-project-collaborators',
  templateUrl: './project-collaborators.component.html',
  styleUrls: ['./project-collaborators.component.scss', '../../shared-wizard-styles.scss']
})
export class ProjectCollaboratorsComponent extends WizardStepBaseComponent implements OnInit {

  constructor() {
    super();
  }

  public collaboratorName = new FormControl('');
  public collaboratorRole = new FormControl('');

  ngOnInit(): void {

  }

  /**
   * Method which triggers when the add Collaborator button is pressed.
   * Adds submitted Collaborator to the collaborator array.
   */
  public onClickAddCollaborator(): void {
    if (this.collaboratorRole.valid && this.collaboratorName.valid) {
      const newCollaborator: CollaboratorAdd = {fullName: this.collaboratorName.value, role: this.collaboratorRole.value};
      this.step.project.collaborators.push(newCollaborator);
      this.collaboratorName.reset();
      this.collaboratorRole.reset();
    } else {
      // TODO: show error
    }

  }

  public deleteCollaboratorClick(collaborator: CollaboratorAdd) {
    const index = this.step.project.collaborators.indexOf(collaborator);
    if (index > -1) {
      this.step.project.collaborators.splice(index, 1);
    }
  }
}
