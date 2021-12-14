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
import { Component, Input, ViewEncapsulation} from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { Project } from 'src/app/models/domain/project';
import { AlertConfig } from 'src/app/models/internal/alert-config';
import { AlertType } from 'src/app/models/internal/alert-type';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { FileRetrieverService } from 'src/app/services/file-retriever.service';
import { LikeService } from 'src/app/services/like.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectComponent {
  @Input() showListView: boolean;
  @Input() project: Project;

  /**
   * Boolean to trigger animation only after first click and not on page load.
   */
  public animationTriggered = false;

  // temporary string of tags
  public tags = ['UX', 'JavaScript', 'Angular', 'C#', 'HelloWorld', 'UX', 'JavaScript', 'Angular'];
  public displayedTags = [];
  public overflowTags = [];

  constructor(
    private fileRetrieverService: FileRetrieverService,
    private likeService: LikeService,
    private authService: AuthService,
    private alertService: AlertService) {
  }

  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;

  ngOnInit(): void {
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe(evt => {
      this.displayMyTags(this.tags, document.getElementsByClassName('project-tag-group')[0].clientWidth);
    });
  }

  ngAfterViewInit() {
    this.displayMyTags(this.tags, document.getElementsByClassName('project-tag-group')[0].clientWidth);
  }

  ngOnDestroy() {
    this.resizeSubscription$.unsubscribe();
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
   * It will either like or unlike the project.
   */
  public likeClicked(event): void {
    event.stopPropagation();
    if (this.authService.isAuthenticated()) {
      if (!this.project.userHasLikedProject) {
        this.likeService.likeProject(this.project.id);
        this.project.likeCount++;
        this.animationTriggered = true;
      } else {
        this.likeService.removeLike(this.project.id);
        this.project.likeCount--;
        this.animationTriggered = true;
      }
      this.project.userHasLikedProject = !this.project.userHasLikedProject;
    } else {
      // User is not logged in
      const alertConfig: AlertConfig = {
        type: AlertType.warning,
        mainMessage: 'You need to be logged in to like a project',
        dismissible: true,
        autoDismiss: true,
        timeout: this.alertService.defaultTimeout
      };
      this.alertService.pushAlert(alertConfig);
    }
  }

  public displayMyTags(tagList: string[], maxWidth: number) {
    let totalLength = 0;
    const displayedTags = [];
    const overflowTags = [];

    tagList.forEach(function (tag) {
      totalLength += (tag.length * 10 + 25);
      if (totalLength < maxWidth) {
        displayedTags.push(tag);
      } else if (overflowTags.length < 5 ) {
        overflowTags.push(tag);
      }
    });

    if (overflowTags.length < (this.tags.length - displayedTags.length)) {
      overflowTags.push('+' + (this.tags.length - displayedTags.length - overflowTags.length) + ' more');
    }

    this.displayedTags = displayedTags;
    this.overflowTags = overflowTags;
  }

}

