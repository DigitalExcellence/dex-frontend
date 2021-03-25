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
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/models/domain/project';

import { CollaboratorAdd } from 'src/app/models/resources/collaborator-add';
import { AlertConfig } from 'src/app/models/internal/alert-config';
import { AlertType } from 'src/app/models/internal/alert-type';
import { AlertService } from 'src/app/services/alert.service';
import { WizardStepBaseComponent } from '../../dynamic/wizard-step-base/wizard-step-base.component';

@Component({
  selector: 'app-colab',
  templateUrl: './wizardcolab.component.html',
  styleUrls: ['./wizardcolab.component.scss']
})
export class ColabComponent extends WizardStepBaseComponent implements OnInit {


  project: Project;
  subscription: Subscription;
  linkForm: FormControl;
  public newCollaboratorForm: FormGroup;
  public collaborators: CollaboratorAdd[] = [];

  constructor(private formBuilder: FormBuilder,
              private alertService: AlertService,) {
    super();
    this.linkForm = new FormControl('');

    this.newCollaboratorForm = this.formBuilder.group({
      fullName: [null, Validators.required],
      role: [null, Validators.required],
    });
  }

    ngOnInit() {

    }


    ngOnDestroy() {
        this.subscription.unsubscribe();
    }


    onSubmit() {
        return false;
    }

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

    addIdToCollaborators() {
        let i = 0;
      this.collaborators.map(n => {
        n['id'] = i;
        i++;
      });
      this.onClickNextButton(this.collaborators);
    }

    onClickNextButton(collaborators) {
        this.project.collaborators = collaborators;
    }



}
