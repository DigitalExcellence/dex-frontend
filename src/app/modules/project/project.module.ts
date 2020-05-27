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
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DetailsComponent } from "./details/details.component";
import { OverviewComponent } from "./overview/overview.component";
import { ProjectRoutingModule } from "./project-routing.module";
import { AccordionModule } from "ngx-bootstrap/accordion";
import { EditComponent } from "./edit/edit.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { EmbedButtonComponent } from './embed-button/embed-button.component';
import { EmbedComponent } from './embed/embed.component';

@NgModule({
  declarations: [OverviewComponent, DetailsComponent, EditComponent, EmbedButtonComponent, EmbedComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ProjectRoutingModule, AccordionModule.forRoot()],
})
export class ProjectModule {}
