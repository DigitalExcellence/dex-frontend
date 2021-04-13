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
import * as showdown from 'showdown';
import { QuillUtils } from 'src/app/utils/quill.utils';
import { ProjectAdd } from 'src/app/models/resources/project-add';
import { WizardService } from 'src/app/services/wizard.service';

@Component({
  selector: 'app-project-description',
  templateUrl: './project-description.component.html',
  styleUrls: ['./project-description.component.scss', '../../shared-wizard-styles.scss']
})

export class ProjectDescriptionComponent extends WizardStepBaseComponent implements OnInit {

  /**
   * Configuration for the quill editor
   */
  public modulesConfiguration = QuillUtils.getDefaultModulesConfiguration();
  /**
   * Form fields variables
   */
  public shortDescription = new FormControl('');
  public longDescription = new FormControl('');

  /**
   * Hold a copy of the project temporarily to prevent the service from listening to every change
   */
  private project: ProjectAdd;

  constructor(private wizardService: WizardService) {
    super();
  }

  ngOnInit(): void {
    this.project = this.wizardService.builtProject;
    if (this.project.shortDescription) {
      this.shortDescription.setValue(this.project.shortDescription);
    }
    if (this.project.description) {
      const converter = new showdown.Converter(
          {
            literalMidWordUnderscores: true
          }
      );
      this.project.description = converter.makeHtml(this.project.description);

      this.longDescription.setValue(this.project.description);
    }
  }

  /**
   * Method which triggers when the button to the next page is pressed
   */
  public onClickNext(): void {
    this.wizardService.updateProject({
      ...this.project,
      shortDescription: this.shortDescription.value,
      description: this.longDescription.value
    });
    super.onClickNext();
  }

}
