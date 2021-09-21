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
import { CallToActionsEditComponent } from './call-to-actions-edit/call-to-actions-edit.component';
import { CollaboratorComponent } from './collaborator/collaborator.component';
import { BottomDrawerComponent } from './details/bottom-drawer/bottom-drawer.component';
import { SettingsDropdownComponent } from './details/bottom-drawer/settings-dropdown/settings-dropdown.component';
import { DetailsComponent } from './details/details.component';
import { SummaryComponent } from './details/summary/summary.component';
import { EditComponent } from './edit/edit.component';
import { EmbedButtonComponent } from './embed-button/embed-button.component';
import { EmbedComponent } from './embed/embed.component';
import { HighlightsModalComponent } from './highlights-modal/highlights-modal.component';
import { FilterMenuComponent } from './overview/filter-menu/filter-menu.component';
import { OverviewComponent } from './overview/overview.component';
import { PaginationComponent } from './overview/pagination/pagination.component';
import { ProjectListComponent } from './overview/project-list/project-list.component';
import { ProjectRoutingModule } from './project-routing.module';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Meta } from '@angular/platform-browser';
import { NgxDebounceClickModule } from '@ngx-lite/debounce-click';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { QuillModule } from 'ngx-quill';
import { DndDirective } from 'src/app/components/file-uploader/DndDirective';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';
import { ModalHighlightFormComponent } from 'src/app/modules/project/modal-highlight-form/modal-highlight-form.component';
import { ProjectComponent } from 'src/app/modules/project/overview/project-list/project/project.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormatDatePipe } from 'src/app/utils/format-date.pipe';
import { SafeHtmlPipe } from 'src/app/utils/safeHtml.pipe';

@NgModule({
  declarations: [
    OverviewComponent,
    DetailsComponent,
    EditComponent,
    EmbedButtonComponent,
    EmbedComponent,
    ModalHighlightFormComponent,
    FormatDatePipe,
    DndDirective,
    FileUploaderComponent,
    SafeHtmlPipe,
    HighlightsModalComponent,
    ProjectComponent,
    CollaboratorComponent,
    ProjectComponent,
    CallToActionsEditComponent,
    ProjectListComponent,
    FilterMenuComponent,
    PaginationComponent,
    SummaryComponent,
    SettingsDropdownComponent,
    BottomDrawerComponent
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
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    CarouselModule.forRoot(),
    QuillModule,
    NgxDebounceClickModule,
    PopoverModule.forRoot(),
    QuillModule
  ],
  exports: [
    FileUploaderComponent,
    SafeHtmlPipe,
    ProjectComponent,
    CallToActionsEditComponent,
    PaginationComponent
  ],
  providers: [Meta]
})
export class ProjectModule {
}
