import { environment } from '../../../../../environments/environment';
import { UploadFile } from '../../../../models/domain/uploadFile';
import { AuthService } from '../../../../services/auth.service';
import { FileRetrieverService } from '../../../../services/file-retriever.service';

import { Component, Input } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { fromEvent, Observable, Subject, Subscription } from 'rxjs';
import { Project } from 'src/app/models/domain/project';
import { ProjectTag } from 'src/app/models/domain/projectTag';
import { AlertConfig } from 'src/app/models/internal/alert-config';
import { AlertType } from 'src/app/models/internal/alert-type';
import { AlertService } from 'src/app/services/alert.service';
import { LikeService } from 'src/app/services/like.service';
import { Router } from '@angular/router';
import { TagfilterService } from '../../../../services/tagfilter.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent {
  @Input() project: Project;
  @Input() onLike: Subject<boolean>;
  @Input() animationTriggered: boolean;

  // strings to store the tags to handle displaying them
  public displayedTags = [{'id': 1, 'name': 'test'}];
  public overflowTags = [];
  public displayOverflowTags = false;

  constructor(
      private router: Router,
      private likeService: LikeService,
      private alertService: AlertService,
      private authService: AuthService,
      private tagFilterService: TagfilterService,
      private fileRetrieverService: FileRetrieverService) { }

  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;

  ngOnInit(): void {
        this.resizeObservable$ = fromEvent(window, 'resize');
        this.resizeSubscription$ = this.resizeObservable$.subscribe(evt => {
          this.displayMyTags(this.project.tags, document.getElementsByClassName('detail-tag-group')[0].clientWidth * 2);
        });
      }

  ngAfterViewInit() {
    this.displayMyTags(this.project.tags, document.getElementsByClassName('detail-tag-group')[0].clientWidth * 2);
  }

  ngOnDestroy() {
    this.resizeSubscription$.unsubscribe();
  }
  /**
   * Method to handle the click of the like button
   * It will either like or unlike the project
   */
  public likeClicked(): void {
    if (this.authService.isAuthenticated()) {
      if (!this.project.userHasLikedProject) {
        this.likeService.likeProject(this.project.id);
        this.project.likeCount++;
        this.animationTriggered = true;
        // We add this so we can update the overview page when the modal is closed
        this.onLike.next(true);
      } else {
        this.likeService.removeLike(this.project.id);
        this.project.likeCount--;
        this.animationTriggered = true;
        // We add this so we can update the overview page when the modal is closed
        this.onLike.next(false);
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

    /**
   * Method to split tags into what fits directly and what is
   * in the collapsable part
   */
  public displayMyTags(tagList: ProjectTag[], maxWidth: number) {
    let totalLength = 0;
    const displayedTags = [];
    const overflowTags = [];

    tagList.forEach(function (tag) {
      totalLength += (tag.name.length * 10 + 30);
      if (totalLength < maxWidth) {
        // displayedTags.push(tag);
      } else {
        overflowTags.push(tag);
      }
    });
    // this.displayedTags = displayedTags;
    this.overflowTags = overflowTags;
  }

  public filterTag(tagId) {
    this.tagFilterService.emitTagChangeEvent(tagId);
  }

  /**
   * Method to get the url of the icon of the project. This is retrieved
   * from the file retriever service.
   */
  public getIconUrl(file: UploadFile): SafeUrl {
    return this.fileRetrieverService.getIconUrl(file);
  }

  /**
   * Method to display the tags based on the environment variable.
   * Tags should be hidden in production for now until further implementation is finished.
   */
  public isProduction(): boolean {
    return environment.production;
  }
}
