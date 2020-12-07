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
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Project } from 'src/app/models/domain/project';
import { SafeUrl } from '@angular/platform-browser';
import { FileRetrieverService } from 'src/app/services/file-retriever.service';
import { environment } from 'src/environments/environment';
import { LikeService } from 'src/app/services/like.service';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectComponent {

  @Input() showListView: boolean;
  @Input() project: Project;

  constructor(
      private fileRetrieverService: FileRetrieverService,
      private likeService: LikeService) {
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


  /**
   * Method to handle the click of the like button
   * It will either like or unlike the project
   */
  public likeClicked(event) {
    event.stopPropagation();
    if (!this.project.userHasLikedProject) {
      this.likeService.likeProject(this.project.id);
      this.project.likeCount++;
    } else {
      this.likeService.removeLike(this.project.id);
      this.project.likeCount--;
    }
    this.project.userHasLikedProject = !this.project.userHasLikedProject;
  }

  /**
   * Method to display the tags based on the environment variable.
   * Tags should be hidden in production for now until further implementation is finished.
   */
  public displayTags(): boolean {
    return !environment.production;
  }
}
