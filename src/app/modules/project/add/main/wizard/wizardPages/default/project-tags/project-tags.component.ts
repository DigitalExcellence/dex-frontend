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
import { FormControl } from '@angular/forms';
import { ProjectAdd } from 'src/app/models/resources/project-add';
import { ProjectTagAdd } from 'src/app/models/resources/project-tag-add';
import { WizardStepBaseComponent } from 'src/app/modules/project/add/main/wizard/wizardPages/wizard-step-base/wizard-step-base.component';
import { WizardService } from 'src/app/services/wizard.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-project-tags',
  templateUrl: './project-tags.component.html',
  styleUrls: ['./project-tags.component.scss', '../../shared-wizard-styles.scss']
})
export class ProjectTagsComponent extends WizardStepBaseComponent implements OnInit {

  public suggestionQuestions = [
    'What programming languages do you use?',
    'What themes does your project have?',
    'What workfield does your project relate to?',
    'Which competence level is the project?'
  ];
  public suggestionExamples = [
    'C#, JavaScript, Python',
    'Glow, Education, Health',
    'UX, Software, Technology, Infrastructure',
    'Beginner, Intermediate, Expert'
  ];

  public tags: ProjectTagAdd[] = [];

  public tagInput = new FormControl('');

  public recommendedTags: ProjectTagAdd[] = [];

  public questionIndex = 0;

  /**
  * Hold a copy of the project temporarily to prevent the service from listening to every change
  */
  private project: ProjectAdd;

  constructor(private wizardService: WizardService) {
    super();
  }

  ngOnInit(): void {
    this.project = this.wizardService.builtProject;
  }

  /**
* Method to switch between different suggestion-questions
*/
  public nextSuggestion() {
    if (this.questionIndex + 1 >= this.suggestionQuestions.length) {
      this.questionIndex = 0;
    } else {
      this.questionIndex++;
    }
  }

  public inputTag(): void {
    if (this.tagInput.value.length > 0) {
      const newTag = { name: this.tagInput.value };
      this.tags.push(newTag);
      this.nextSuggestion();
      this.tagInput.setValue('');
    }
  }

  public moveTag(start: any[], end: any[], myIndex: number): void {
    end.push(start[myIndex]);
    start.splice(myIndex, 1);
  }

  /**
 * Method which triggers when the button to the next page is pressed
 */
  public onClickNext(): void {
    this.wizardService.updateProject({
      ...this.project,
      tags: this.tags
    });
    super.onClickNext();
  }
}
