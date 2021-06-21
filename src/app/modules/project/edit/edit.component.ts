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

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CollaboratorAdd } from 'src/app/models/resources/collaborator-add';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/models/domain/project';
import { ProjectUpdate } from 'src/app/models/resources/project-update';
import { AlertConfig } from 'src/app/models/internal/alert-config';
import { AlertType } from 'src/app/models/internal/alert-type';
import { AlertService } from 'src/app/services/alert.service';
import { QuillUtils } from 'src/app/utils/quill.utils';
import { CallToActionOptionService } from 'src/app/services/call-to-action-option.service';
import { CallToActionOption } from 'src/app/models/domain/call-to-action-option';
import { CallToAction } from 'src/app/models/domain/call-to-action';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';
import { ProjectCategory } from 'src/app/models/domain/projectCategory';
import { CategoryService } from 'src/app/services/category.service';

/**
 * Component for editing adding a project.
 */
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  /**
   * Configuration for file-picker
   */
  @ViewChild(FileUploaderComponent) fileUploader: FileUploaderComponent;
  public acceptedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
  public acceptMultiple = false;
  public showPreview = true;

  /**
   * Formgroup for entering project details.
   */
  public editProjectForm: FormGroup;
  public editCallToActionForm: FormGroup;
  public editCollaboratorForm: FormGroup;
  public project: Project;
  public categories: ProjectCategory[];

  /**
   * Projects selected call to action
   */
  /**
   * The selected call to action option
   */
  public selectedCallToActionOptionIds: number[] = [];
  public callToActionOptionValues: CallToAction[] = [];

  /**
   * The specified redirect url from the call to action
   */
  public callToActionRedirectUrl: string;

  /**
   * Project's collaborators.
   */
  public collaborators: CollaboratorAdd[] = [];

  /**
   * Boolean to enable and disable submit button
   */
  public submitEnabled = true;

  /**
   * Configuration of QuillToolbar
   */
  public modulesConfigration = QuillUtils.getDefaultModulesConfiguration();

  /**
   * The available call to action options to select from
   */
  public callToActionOptions: CallToActionOption[] = [];

  public callToActionsLoading = true;

  /**
   * Property for storting the invalidId if an invalid project id was entered.
   */
  public invalidId: string;

  /**
   * Property to indicate whether the project is loading.
   */
  public projectLoading = true;

  constructor(
      private router: Router,
      private formBuilder: FormBuilder,
      private projectService: ProjectService,
      private activatedRoute: ActivatedRoute,
      private alertService: AlertService,
      private callToActionOptionService: CallToActionOptionService,
      private categoryService: CategoryService,
  ) {
    this.editProjectForm = this.formBuilder.group({
      name: [null, Validators.required],
      uri: [null],
      shortDescription: [null, Validators.required],
      description: [null],
    });

    this.editCallToActionForm = this.formBuilder.group({
      type: [null, Validators.required],
      value: [null, Validators.required],
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
    if (id == null || Number.isNaN(id) || id < 1) {
      this.invalidId = routeId;
      return;
    }

    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories;
    });

    /**
     * Retrieve the available call to actions
     */
    this.callToActionOptionService
        .getAll()
        .pipe(finalize(() => (this.callToActionsLoading = false)))
        .subscribe((result) => {
          this.callToActionOptions = result.filter(o => o.type === 'title');

          this.projectService.get(id)
              .pipe(
                  finalize(() => this.projectLoading = false)
              )
              .subscribe(
                  (projectResult) => {
                    this.project = projectResult;
                    this.collaborators = this.project.collaborators;
                    this.fileUploader.setFiles([this.project.projectIcon]);


                    console.log(projectResult);
                    console.log(this.callToActionOptions);
                    this.callToActionOptions = this.callToActionOptions.map(cta => ({
                      ...cta,
                      optionValue: projectResult.callToActions.find(pcta => cta.value === pcta.value).optionValue
                    }));
                    console.log(this.callToActionOptions);

                    this.categories = this.categories.map(category => ({
                      ...category,
                      selected: !!this.project.categories?.find(c => c.name === category.name)
                    }));
                  }
              );
        });
  }

  public onCategoryClick(category): void {
    this.categories = this.categories.map(cat => (
        cat.name === category.name
            ? {...cat, selected: !category.selected}
            : {...cat}
    ));
  }

  public onClickSubmit(): void {
    if (!this.editProjectForm.valid) {
      this.editProjectForm.markAllAsTouched();

      const alertConfig: AlertConfig = {
        type: AlertType.danger,
        preMessage: 'The edit project form is invalid',
        mainMessage: 'The project could not be updated, please fill all required fields',
        dismissible: true,
        autoDismiss: true
      };
      this.alertService.pushAlert(alertConfig);
      return;
    }

    const editedProject: ProjectUpdate = this.editProjectForm.value;
    editedProject.collaborators = this.collaborators;
    editedProject.categories = this.categories.filter(category => category.selected);

    this.fileUploader.uploadFiles()
        .subscribe(uploadedFiles => {
          if (uploadedFiles) {
            if (uploadedFiles[0]) {
              // Project icon was set and uploaded
              editedProject.fileId = uploadedFiles[0].id;
              this.editProject(editedProject);
            }
            // Project icon was set but not uploaded successfully, the component will show the error
          } else {
            // There was no project icon
            if (this.project.projectIcon) {
              editedProject.fileId = 0;
            }
            this.editProject(editedProject);
          }
        });

    editedProject.callToActions = this.callToActionOptions.map(cta => (
        this.selectedCallToActionOptionIds.includes(cta.id) ? {
          id: cta.id,
          optionValue: cta.optionValue,
          value: cta.value
        } : undefined
    )).filter(cta => cta)
  }

  /**
   * Method  which triggers when the cancel button is pressed.
   * Redirects the user back to the project or the overview.
   */
  public onClickCancel(): void {
    if (this.project == null) {
      this.router.navigate(['project/overview']);
    }
    this.router.navigate([`project/details/${this.project.id}`]);
  }

  /**
   * Method which triggers when the add collaborator button is pressed.
   * Adds submitted collaborator to the collaborators array.
   */
  public onClickAddCollaborator(): void {
    if (!this.editCollaboratorForm.valid) {
      const alertConfig: AlertConfig = {
        type: AlertType.danger,
        preMessage: 'The add collaborator form is invalid',
        mainMessage: 'Collaborator could not be added',
        dismissible: true,
        autoDismiss: true
      };
      this.alertService.pushAlert(alertConfig);
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
      const alertConfig: AlertConfig = {
        type: AlertType.danger,
        mainMessage: 'Collaborator could not be removed',
        dismissible: true,
        autoDismiss: true
      };
      this.alertService.pushAlert(alertConfig);
      return;
    }
    this.collaborators.splice(index, 1);
  }

  /**
   * Method that is triggered when any of the url input fields changes
   * @param event The change event
   * @param callToActionId The id of the call-to-action-option that was changed
   */
  public urlChange(event: Event, callToActionId: number): void {
    const element = event.target as HTMLInputElement;
    const value = element.value;
    this.callToActionOptions = this.callToActionOptions.map(callToActionOption => {
      return callToActionOption.id === callToActionId
          ? {
            ...callToActionOption,
            optionValue: value
          } : callToActionOption;
    });
  }

  /**
   * @param event The browser event
   * @param clickedCheckboxId The clicked radio button
   */
  public ctaButtonClicked(event: Event, clickedCheckboxId: number): void {
    if (!this.selectedCallToActionOptionIds.find(id => id === clickedCheckboxId)) {
      this.selectedCallToActionOptionIds.push(clickedCheckboxId);
    } else {
      this.selectedCallToActionOptionIds.splice(
          this.selectedCallToActionOptionIds.indexOf(
              this.selectedCallToActionOptionIds.find(ctaId => ctaId === clickedCheckboxId)
          ), 1);
    }
  }

  /**
   * Check if the entered url is valid
   * @param url The url that needs to be checked
   */
  private validURL(url: string): boolean {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

    return !!pattern.test(url);
  }

  /**
   * Method which will send the requests to the API to edit the project
   */
  private editProject(edittedProject) {
    this.projectService
        .put(this.project.id, edittedProject)
        .pipe(
            finalize(() => {
              this.submitEnabled = false;
            })
        )
        .subscribe(() => {
          const alertConfig: AlertConfig = {
            type: AlertType.success,
            mainMessage: 'Project was succesfully updated',
            dismissible: true,
            autoDismiss: true,
            timeout: this.alertService.defaultTimeout

          };
          this.alertService.pushAlert(alertConfig);
          this.router.navigate([`project/details/${this.project.id}`]);
        });
  }
}
