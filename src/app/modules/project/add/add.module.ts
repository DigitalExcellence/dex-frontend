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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { AddRoutingModule } from './add-routing.module';
import { MainComponent } from './main/main.component';
import { WizardComponent } from './main/wizard/wizard.component';
import { StepHeaderComponent } from './main/wizard/step-header/step-header.component';
import { ProjectCollaboratorsComponent } from './main/wizard/wizardPages/default/project-collaborators/project-collaborators.component';
import { ProjectLinkComponent } from './main/wizard/wizardPages/default/project-link/project-link.component';
import { ProjectDescriptionComponent } from './main/wizard/wizardPages/default/project-description/project-description.component';
import { ProjectIconComponent } from './main/wizard/wizardPages/default/project-icon/project-icon.component';
import { ProjectNameComponent } from './main/wizard/wizardPages/default/project-name/project-name.component';
import { ProjectModule } from 'src/app/modules/project/project.module';
import { ProjectCallToActionComponent } from './main/wizard/wizardPages/default/project-call-to-action/project-call-to-action.component';

@NgModule({
  declarations: [
    ProjectNameComponent,
    MainComponent,
    WizardComponent,
    StepHeaderComponent,
    ProjectCollaboratorsComponent,
    ProjectLinkComponent,
    ProjectDescriptionComponent,
    ProjectIconComponent,
    ProjectNameComponent,
    ProjectCallToActionComponent,

  ],
  imports: [
    CommonModule,
    AddRoutingModule,
    ReactiveFormsModule,
    QuillModule,
    FormsModule,
    ProjectModule
  ],
})
export class AddModule {
}
