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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CollaboratorAdd } from 'src/app/models/resources/collaborator-add';
import { ProjectService } from 'src/app/services/project.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Project } from 'src/app/models/domain/project';
import { ProjectUpdate } from 'src/app/models/resources/project-update';

/**
 * Component for editting adding a project.
 */
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  /**
   * Formgroup for entering project details.
   */
  public editProjectForm: FormGroup;
  public editCollaboratorForm: FormGroup;
  public project: Project;

  /**
   * Project's collaborators.
   */
  public collaborators: CollaboratorAdd[] = [];

  /**
   * Boolean to enable and disable submit button
   */
  public submitEnabled = true;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute
  ) {
    this.editProjectForm = this.formBuilder.group({
      name: [null, Validators.required],
      uri: [null, Validators.required],
      shortDescription: [null, Validators.required],
      description: [null],
    });

    this.editCollaboratorForm = this.formBuilder.group({
      fullName: [null, Validators.required],
      role: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    const routeId = this.activatedRoute.snapshot.paramMap.get('id');
    if (!routeId) {
      return;
    }
    const id = Number(routeId);
    if (id < 1) {
      return;
    }

    this.projectService.get(id).subscribe(
      (result) => {
        this.project = result;
        this.collaborators = this.project.collaborators;
      },
      (error: HttpErrorResponse) => {
        if (error.status !== 404) {
          // TODO: Return a user friendly error
        }
      }
    );
  }

  public onClickSubmit(): void {
    if (!this.editProjectForm.valid) {
      this.editProjectForm.markAllAsTouched();
      return;
    }

    const edittedProject: ProjectUpdate = this.editProjectForm.value;
    edittedProject.collaborators = this.collaborators;

    this.projectService
      .put(this.project.id, edittedProject)
      .pipe(finalize(() => (this.submitEnabled = false)))
      .subscribe((result) => {
        this.router.navigate([`/project/overview`]);
      });
  }

  /**
   * Method which triggers when the add collaborator button is pressed.
   * Adds submitted collaborator to the collaborators array.
   */
  public onClickAddCollaborator(): void {
    if (!this.editCollaboratorForm.valid) {
      // Todo display error.
      return;
    }

    const newCollaborator: CollaboratorAdd = this.editCollaboratorForm.value;
    this.collaborators.push(newCollaborator);
    this.editCollaboratorForm.reset();
  }

  /**
   * Method which triggers when the delete collaborator button is pressed.
   * Removes the collaborator from the collaborators array.
   */
  public onClickDeleteCollaborator(clickedCollaborator: CollaboratorAdd): void {
    const index = this.collaborators.findIndex((collaborator) => collaborator === clickedCollaborator);
    if (index < 0) {
      // Todo display error.
      return;
    }
    this.collaborators.splice(index, 1);
  }
}
