import { ProjectService } from 'src/app/services/project.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ProjectAdd } from 'src/app/models/resources/project-add';
import { CollaboratorAdd } from 'src/app/models/resources/contributor-add';

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

  constructor(
    private formBuilder: FormBuilder,
    private projectService: ProjectService) {

    this.newProjectForm = this.formBuilder.group({
      name: [null, Validators.required],
      uri: [null, Validators.required],
      shortDescription: [null, Validators.required],
      description: [null, null]
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
      // Todo display error.
      return;
    }

    const newProject: ProjectAdd = this.newProjectForm.value;
    newProject.collaborators = this.collaborators;
    // Todo implement service call.
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
