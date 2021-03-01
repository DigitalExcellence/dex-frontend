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
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

// Import showdown for markdown to html conversion.
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';
import { Project } from 'src/app/models/domain/project';
import { AlertConfig } from 'src/app/models/internal/alert-config';
import { AlertType } from 'src/app/models/internal/alert-type';
import { MappedProject } from 'src/app/models/internal/mapped-project';
import { CollaboratorAdd } from 'src/app/models/resources/collaborator-add';
import { ProjectAdd } from 'src/app/models/resources/project-add';
import { AlertService } from 'src/app/services/alert.service';
import { ProjectService } from 'src/app/services/project.service';
import { SEOService } from 'src/app/services/seo.service';
import { QuillUtils } from 'src/app/utils/quill.utils';
import { DataService } from '../data.service';

// import { LinkComponent } from "src/app/modules/project/add/manual/wizardmodules/link/wizardlink.component";
// import { FinalComponent } from 'src/app/modules/project/add/manual/wizardmodules/final/wizardfinal.component';
// import { ProjectNameComponent } from 'src/app/modules/project/add/manual/wizardmodules/name/wizardname.component';
// import { DescriptionComponent } from 'src/app/modules/project/add/manual/wizardmodules/description/wizarddescription.component';
// import { ColabComponent } from 'src/app/modules/project/add/manual/wizardmodules/colab/wizardcolab.component';


/**
 * Component for manually adding a project.
 */
@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.scss']
})

export class ManualComponent implements OnInit {
  @Input() pageRange: string[];

  constructor(
      private dataService: DataService,
      private router: Router,
      private formBuilder: FormBuilder,
      private projectService: ProjectService,
      private alertService: AlertService,
      private seoService: SEOService,) {
    this.newProjectForm = this.formBuilder.group({
      name: [null, Validators.required],
      uri: [null, Validators.required],
      shortDescription: [null, Validators.required],
      description: [null],
    });

    this.newCollaboratorForm = this.formBuilder.group({
      fullName: [null, Validators.required],
      role: [null, Validators.required],
      id: [null, Validators.required],
    });
  }

  component = 'link';
  projectMessage: Project;
  subscription: Subscription;

  dataForm: FormControl;

  visibility = 'visible';
  show = true;
  hidden = false;

  /**
   * Formgroup for entering project details.
   */
  public newProjectForm: FormGroup;
  public newCollaboratorForm: FormGroup;


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
   * Configuration for file-picker
   */
  public acceptedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
  public acceptMultiple = false;
  @ViewChild(FileUploaderComponent) fileUploader: FileUploaderComponent;

  toggleShow() {
    this.show = !this.show;
  }

  toggleHidden() {
    this.hidden = !this.hidden;
  }

  toggleVisible() {
    this.visibility = this.visibility == 'visible' ? 'hidden' : 'visible';
  }

  ngOnInit(): void {
    // Keep updated with incoming messages;
    this.subscription = this.dataService.currentProject.subscribe((message: Project) => {
      this.projectMessage = message;
      console.log(message.uri);
      console.log(message.name);
      console.log(message.description);
      console.log(message.shortDescription);
      console.log(message.collaborators);
    });

    // this.wizardService.fetchedProject.subscribe(project => {
    //   if (project == null) {
    //     return;
    //   }
    //   if (project.description != null && project.description.length > 0) {
    //     const converter = new showdown.Converter(
    //       {
    //         literalMidWordUnderscores: true
    //       }
    //     );
    //     project.description = converter.makeHtml(project.description);
    //   }
    //   this.fillFormWithProject(project);
    // });

    // Updates meta and title tags
    this.seoService.updateTitle('Add new project');
    this.seoService.updateDescription('Create a new project in DeX');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  /**
   * Method which triggers when the submit button is pressed.
   * Creates a new project.
   */
  public onClickSubmit(): void {
    if (!this.newProjectForm.valid) {
      this.newProjectForm.markAllAsTouched();
      const alertConfig: AlertConfig = {
        type: AlertType.danger,
        preMessage: 'The add project form is invalid',
        mainMessage: 'The project could not be saved, please fill all required fields',
        dismissible: true,
        timeout: this.alertService.defaultTimeout
      };
      this.alertService.pushAlert(alertConfig);
      return;
    }

    const newProject: ProjectAdd = this.newProjectForm.value;
    newProject.collaborators = this.collaborators;
    // Start uploading files
    this.fileUploader.uploadFiles()
      .subscribe(uploadedFiles => {
        if (uploadedFiles) {
          if (uploadedFiles[0]) {
            // Project icon was set and uploaded
            newProject.fileId = uploadedFiles[0].id;
            this.createProject(newProject);
          }
        } else {
          // There was no project icon
          newProject.fileId = 0;
          this.createProject(newProject);
        }
      });
  }





  /**
   * Method which triggers when the add Collaborator button is pressed.
   * Adds submitted Collaborator to the collaborator array.
   */
  public onClickAddCollaborator(): void {
    if (!this.newCollaboratorForm.valid) {
      const alertConfig: AlertConfig = {
        type: AlertType.danger,
        preMessage: 'The add collaborator form is invalid',
        mainMessage: 'Collaborator could not be added',
        dismissible: true
      };
      this.alertService.pushAlert(alertConfig);
      return;
    }

    const newCollaborator: CollaboratorAdd = this.newCollaboratorForm.value;
    this.collaborators.push(newCollaborator);
    this.newCollaboratorForm.reset();
  }




  public onClickDeleteCollaborator(clickedCollaborator: CollaboratorAdd): void {
    const index = this.collaborators.findIndex((collaborator) => collaborator === clickedCollaborator);
    if (index < 0) {
      const alertConfig: AlertConfig = {
        type: AlertType.danger,
        mainMessage: 'Collaborator could not be removed',
        dismissible: true
      };
      this.alertService.pushAlert(alertConfig);
      return;
    }
    this.collaborators.splice(index, 1);
  }








  private createProject(newProject): void {
    this.projectService
      .post(newProject)
      .pipe(finalize(() => (this.submitEnabled = false)))
      .subscribe(() => {
        const alertConfig: AlertConfig = {
          type: AlertType.success,
          mainMessage: 'Project was succesfully saved',
          dismissible: true
        };
        this.alertService.pushAlert(alertConfig);
        this.router.navigate([`/project/overview`]);
      });
  }

  public onClickNextButton() {
    console.log('something cool!');
  }


  onSubmit() {
    return false;
  }

  next(page: string) {
    let stepTwo = document.getElementById('step2');
    let stepThree = document.getElementById('step3');
    let stepFour = document.getElementById('step4');
    let stepFive = document.getElementById('step5');

    if (this.component === 'link') {
      this.component = 'name';
      page = 'name';
      stepTwo.className = 'step active';
      document.getElementById('backButton').style.display = '';
    } else if (this.component === 'name') {
      this.component = 'description';
      page = 'description';
      stepThree.className = 'step active';
    } else if (this.component === 'description') {
      this.component = 'colab';
      page = 'colab';
      stepFour.className = 'step active';
    } else if (this.component === 'colab') {
      this.component = 'final';
      stepFive.className = 'step active';
      document.getElementById('hideButton').innerText = 'Finalize';
      document.getElementById('nextButton').style.display = 'none';
    } else if (this.component === 'link') {
    }
  }


  // Stepper and next/previous page

  back(page: string) {

    let stepTwo = document.getElementById('step2');
    let stepThree = document.getElementById('step3');
    let stepFour = document.getElementById('step4');
    let stepFive = document.getElementById('step5');

    if (this.component === 'link') {
      document.getElementById('backButton').style.display = 'none';
    } else if (this.component === 'name') {
      this.component = 'link';
      page = 'link';
      stepTwo.className = 'step';
    } else if (this.component === 'description') {
      this.component = 'name';
      page = 'name';
      stepThree.className = 'step';
    } else if (this.component === 'colab') {
      this.component = 'description';
      page = 'description';
      stepFour.className = 'step';
    } else if (this.component === 'final') {
      this.component = 'colab';
      stepFive.className = 'step';
      document.getElementById('hideButton').innerText = 'Hide';
      document.getElementById('nextButton').style.display = '';
    }
  }

  /**
   * Method to fill a form with the values of a mapped project.
   */
  private fillFormWithProject(project: MappedProject): void {
    this.newProjectForm.get('name').setValue(project.name);
    this.newProjectForm.get('uri').setValue(project.uri);
    this.newProjectForm.get('shortDescription').setValue(project.shortDescription);
    this.newProjectForm.get('description').setValue(project.description);
    this.newProjectForm.get('collaborators').setValue(project.collaborators);
    console.log('fillformwithdata');
    console.log(this.newProjectForm);
  }
}


