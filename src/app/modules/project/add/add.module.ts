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
import { FinalComponent } from 'src/app/modules/project/add/main/wizard/wizardPages/final/wizardfinal.component';
import { LinkComponent } from 'src/app/modules/project/add/main/wizard/wizardPages/link/wizardlink.component';
import { ProjectNameComponent } from 'src/app/modules/project/add/main/wizard/wizardPages/name/wizardname.component';
import { DescriptionComponent } from 'src/app/modules/project/add/main/wizard/wizardPages/description/wizarddescription.component';
import { ColabComponent } from 'src/app/modules/project/add/main/wizard/wizardPages/colab/wizardcolab.component';
import { ProjectModule } from '../project.module';
import { AddRoutingModule } from './add-routing.module';
import { ManualComponent } from './manual/manual.component';
import { PickFlowPageComponent } from './main/wizard/wizardPages/pick-flow-page/pick-flow-page.component';
import { MainComponent } from './main/main.component';
import { WizardComponent } from './main/wizard/wizard.component';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { UsernameComponent } from './main/wizard/wizardPages/username/username.component';
import { AvailableProjectsPageComponent } from './main/wizard/wizardPages/available-projects-page/available-projects-page.component';
import { NgWizardModule } from '@cmdap/ng-wizard';

@NgModule({
  declarations: [
    ManualComponent,
    LinkComponent,
    ProjectNameComponent,
    DescriptionComponent,
    ColabComponent,
    FinalComponent,
    PickFlowPageComponent,
    MainComponent,
    WizardComponent,
    UsernameComponent,
    AvailableProjectsPageComponent
  ],
  imports: [
    CommonModule,
    AddRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    QuillModule,
    ProjectModule,
    ModalModule.forRoot(),
    NgWizardModule,
  ],
  entryComponents: [
    WizardComponent
  ],
  providers: [
    BsModalRef
  ]
})
export class AddModule { }
