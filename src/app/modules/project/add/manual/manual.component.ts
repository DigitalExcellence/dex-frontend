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

import { ProjectService } from 'src/app/services/project.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ProjectAdd } from 'src/app/models/resources/project-add';
import { CollaboratorAdd } from 'src/app/models/resources/contributor-add';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

/**
 * Component for manually adding a project.
 */
@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.scss']
})
export class ManualComponent implements OnInit {

  /**
   * Formgroup for entering project details.
   */
  public newProjectForm: FormGroup;
  public newContributorForm: FormGroup;

  /**
   * Project's contributors.
   */
  public collaborators: CollaboratorAdd[] = [];

  /**
   * Boolean to enable and disable submit button
   */
  public submitEnabled = true;


  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private projectService: ProjectService) {

    this.newProjectForm = this.formBuilder.group({
      name: [null, Validators.required],
      uri: [null, Validators.required],
      shortDescription: [null, Validators.required],
      description: [null]
    });

    this.newContributorForm = this.formBuilder.group({
      fullName: [null, Validators.required],
      role: [null, Validators.required]
    });

  }

  ngOnInit(): void {

  }

  public onSubmit(): void {
    if (!this.newProjectForm.valid) {
      this.newProjectForm.markAllAsTouched();
      return;
    }

    const newProject: ProjectAdd = this.newProjectForm.value;
    newProject.collaborators = this.collaborators;

    this.projectService.post(newProject)
      .pipe(
        finalize(() => this.submitEnabled = false)
      ).subscribe(result => {
        this.router.navigate([`/project/overview`]);
      });
  }

  /**
   * Method which triggers when the add contributor button is pressed.
   * Adds submitted contributor to the contributors array.
   */
  public onClickAddContributor(): void {
    if (!this.newContributorForm.valid) {
      // Todo display error.
      return;
    }

    const newContributor: CollaboratorAdd = this.newContributorForm.value;
    this.collaborators.push(newContributor);
    this.newContributorForm.reset();
  }

  /**
   * Method which triggers when the delete contributor button is pressed.
   * Removes the contributors from the contributors array.
   */
  public onClickDeleteContributor(clickedContributor: CollaboratorAdd): void {
    const index = this.collaborators.findIndex(contributor => contributor === clickedContributor);
    if (index < 0) {
      // Todo display error.
      return;
    }
    this.collaborators.splice(index, 1);
  }
}
