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
import { WizardService } from 'src/app/services/wizard.service';
import { FormControl } from '@angular/forms';
import { ProjectAdd } from 'src/app/models/resources/project-add';
import { ProjectCategory } from 'src/app/models/domain/projectCategory';
import { CategoryService } from 'src/app/services/category.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-project-categories',
  templateUrl: './project-categories.component.html',
  styleUrls: ['./project-categories.component.scss', '../../shared-wizard-styles.scss']
})
export class ProjectCategoriesComponent extends WizardStepBaseComponent implements OnInit {

  public categories: ProjectCategory[];

  public tags = [];

  public tagInput = new FormControl('');

  /**
   * Hold a copy of the project temporarily to prevent the service from listening to every change
   */
  private project: ProjectAdd;

  constructor(private wizardService: WizardService,
              private categoryService: CategoryService) {
    super();
  }

  ngOnInit(): void {
    this.project = this.wizardService.builtProject;
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories;
      this.categories = this.categories.map(category => ({
        ...category,
        selected: !!this.project.categories?.find(c => c.name === category.name)
      }));
    });
  }

  public onCategoryClick(category): void {
    this.categories = this.categories.map(cat => (
        cat.name === category.name
            ? {...cat, selected: !category.selected}
            : {...cat}
    ));
  }

  public onTagEnter(): void {
    if (this.tagInput.value.length > 0) {
      this.tags.push(this.tagInput.value);
      this.tagInput.setValue('');
    }
  }

  public onTagClick(tag): void {
    this.tags = this.tags.filter(t => t !== tag);
  }

  public showSkipOrNext(): boolean {
    return this.categories.some(c => c.selected) || this.tags.length > 0;
  }

  /**
   * Method which triggers when the button to the next page is pressed
   */
  public onClickNext(): void {
    this.wizardService.updateProject({
      ...this.project,
      categories: this.categories.filter(category => category.selected)
    });
    super.onClickNext();
  }

  /**
   * Method to display the tags based on the environment variable.
   * Tags should be hidden in production for now until further implementation is finished.
   */
  public isProduction(): boolean {
    return !environment.production;
  }
}
