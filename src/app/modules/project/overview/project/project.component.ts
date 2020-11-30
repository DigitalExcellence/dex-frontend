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
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Project } from 'src/app/models/domain/project';
import { SafeUrl } from '@angular/platform-browser';
import { FileRetrieverService } from 'src/app/services/file-retriever.service';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectComponent implements OnInit {

  @Input() showListView: boolean;
  @Input() project: Project;

  constructor(
      private fileRetrieverService: FileRetrieverService) {
  }

  ngOnInit(): void {
    console.log(this.project);
  }

  /**
   * Method to get the url of the icon of the project. This is retrieved
   * from the file retriever service
   */
  public getIconUrl(project): SafeUrl {
    return this.fileRetrieverService.getIconUrl(project.projectIcon);
  }

  public tagClicked(event) {
    event.stopPropagation();
  }

  public userClicked(event) {
    event.stopPropagation();
  }
}
