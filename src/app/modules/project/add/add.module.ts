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
import { FinalComponent } from 'src/app/modules/project/add/manual/wizardmodules/final/wizardfinal.component';
import { LinkComponent } from 'src/app/modules/project/add/manual/wizardmodules/link/wizardlink.component';
import { ProjectNameComponent } from 'src/app/modules/project/add/manual/wizardmodules/name/wizardname.component';
import { DescriptionComponent } from 'src/app/modules/project/add/manual/wizardmodules/description/wizarddescription.component';
import { ColabComponent } from 'src/app/modules/project/add/manual/wizardmodules/colab/wizardcolab.component';
import { ProjectModule } from '../project.module';
import { AddRoutingModule } from './add-routing.module';
import { ManualComponent } from './manual/manual.component';
import { PickFlowPageComponent } from './external/external-source-pages/pick-flow-page/pick-flow-page.component';

@NgModule({
  declarations: [
    ManualComponent,
    LinkComponent,
    ProjectNameComponent,
    DescriptionComponent,
    ColabComponent,
    FinalComponent,
    PickFlowPageComponent,
  ],
  imports: [
    CommonModule,
    AddRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    QuillModule,
    ProjectModule
  ],
})
export class AddModule { }
