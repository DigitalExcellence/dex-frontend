/*
 *  Digital Excellence Copyright (C) 2020 Brend Smits
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU Lesser General Public License as published
 *   by the Free Software Foundation version 3 of the License.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty
 *   of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *   See the GNU Lesser General Public License for more details.
 *
 *   You can find a copy of the GNU Lesser General Public License
 *   along with this program, in the LICENSE.md file in the root project directory.
 *   If not, see https://www.gnu.org/licenses/lgpl-3.0.txt
 */
import { Component, OnInit } from '@angular/core';
import { WizardStepBaseComponent } from 'src/app/modules/project/add/main/wizard/wizardPages/wizard-step-base/wizard-step-base.component';
import { FormControl } from '@angular/forms';
import { CollaboratorAdd } from 'src/app/models/resources/collaborator-add';
import { ProjectAdd } from 'src/app/models/resources/project-add';
import { WizardService } from 'src/app/services/wizard.service';

@Component({
  selector: 'app-project-collaborators',
  templateUrl: './project-collaborators.component.html',
  styleUrls: ['./project-collaborators.component.scss', '../../shared-wizard-styles.scss']
})
export class ProjectCollaboratorsComponent extends WizardStepBaseComponent implements OnInit {

  /**
   * Forms fields
   */
  public collaboratorName = new FormControl('');
  public collaboratorRole = new FormControl('');
  /**
   * Local copy of the collaborators to prevent unnecessary service calls
   */
  public collaboratorList: CollaboratorAdd[];

  /**
   * Hold a copy of the project temporarily to prevent the service from listening to every change
   */
  private project: ProjectAdd;

  constructor(private wizardService: WizardService) {
    super();
  }

  ngOnInit(): void {
    this.project = this.wizardService.builtProject;
    if (this.project.collaborators) {
      this.collaboratorList = this.project.collaborators.map(collaborator => {
        return {...collaborator, role: 'Developer'};
      });
    }
  }

  /**
   * Method which triggers when the add Collaborator button is pressed.
   * Adds submitted Collaborator to the collaborator array.
   */
  public onClickAddCollaborator(): void {
    if (this.collaboratorRole.valid && this.collaboratorName.valid) {
      const newCollaborator: CollaboratorAdd = {fullName: this.collaboratorName.value, role: this.collaboratorRole.value};
      this.collaboratorList.push(newCollaborator);
      this.collaboratorName.reset();
      this.collaboratorRole.reset();
    } else {
      // TODO: show error
    }

  }

  /**
   * Method which triggers when the delete collaborator button is pressed.
   * Removes corresponding collaborator from collaborator array.
   */
  public deleteCollaboratorClick(collaborator: CollaboratorAdd): void {
    const index = this.collaboratorList.indexOf(collaborator);
    if (index > -1) {
      this.collaboratorList.splice(index, 1);
    }
  }

  /**
   * Method which triggers when the button to the next page is pressed
   */
  public onClickNext(): void {
    this.wizardService.updateProject({...this.project, collaborators: this.collaboratorList});
    super.onClickNext();
  }
}
