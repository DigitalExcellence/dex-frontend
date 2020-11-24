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
import { DetailsComponent } from './details/details.component';
import { OverviewComponent } from './overview/overview.component';
import { ProjectRoutingModule } from './project-routing.module';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { EditComponent } from './edit/edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmbedButtonComponent } from './embed-button/embed-button.component';
import { EmbedComponent } from './embed/embed.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalHighlightDeleteComponent } from 'src/app/modules/project/modal-highlight-delete/modal-highlight-delete.component';
import { ModalHighlightFormComponent } from 'src/app/modules/project/modal-highlight-form/modal-highlight-form.component';
import { SharedModule } from './../shared/shared.module';
import { QuillModule } from 'ngx-quill';
import { SafeHtmlPipe } from 'src/app/utils/safeHtml.pipe';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';
import { DndDirective } from 'src/app/components/file-uploader/DndDirective';
import { Meta } from '@angular/platform-browser';
import { ModalHighlightEditComponent } from './modal-highlight-edit/modal-highlight-edit.component';
import { FormatDatePipe } from 'src/app/utils/format-date.pipe';

@NgModule({
  declarations: [
    OverviewComponent,
    DetailsComponent,
    EditComponent,
    EmbedButtonComponent,
    EmbedComponent,
    ModalHighlightDeleteComponent,
    ModalHighlightFormComponent,
    ModalHighlightEditComponent,
    FormatDatePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProjectRoutingModule,
    SharedModule,
    AccordionModule.forRoot(),
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    QuillModule
  ],
  exports: [
      FileUploaderComponent
  ],
  providers: [Meta]
})
export class ProjectModule { }
