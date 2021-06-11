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

import { Component, HostListener, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { EMPTY, Observable, Subject } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { ModalDeleteGenericComponent } from 'src/app/components/modals/modal-delete-generic/modal-delete-generic.component';
import { Highlight } from 'src/app/models/domain/highlight';
import { Project } from 'src/app/models/domain/project';
import { scopes } from 'src/app/models/domain/scopes';
import { User } from 'src/app/models/domain/user';
import { AlertConfig } from 'src/app/models/internal/alert-config';
import { AlertType } from 'src/app/models/internal/alert-type';
import { HighlightAdd } from 'src/app/models/resources/highlight-add';
import { HighlightUpdate } from 'src/app/models/resources/highlight-update';
import { HighlightsModalComponent } from 'src/app/modules/project/highlights-modal/highlights-modal.component';
// tslint:disable-next-line: max-line-length
import {
  HighlightFormResult,
  ModalHighlightFormComponent
} from 'src/app/modules/project/modal-highlight-form/modal-highlight-form.component';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommentService } from 'src/app/services/comment.service';
import { FileRetrieverService } from 'src/app/services/file-retriever.service';
import { HighlightService } from 'src/app/services/highlight.service';
import { HighlightByProjectIdService } from 'src/app/services/highlightid.service';
import { LikeService } from 'src/app/services/like.service';
import { ProjectService } from 'src/app/services/project.service';
import { SEOService } from 'src/app/services/seo.service';
import { environment } from 'src/environments/environment';
import { Comment } from 'src/app/models/domain/comment';

/**
 * Overview of a single project
 */
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailsComponent implements OnInit {

  @Input() projectId: number;
  @Input() activeTab = 'description';

  /**
   * Variable to store the project which is retrieved from the api
   */
  public project: Project;
  public newComment: Comment;
  public isAuthenticated: boolean;
  public isProjectHighlighted = false;

  public displayEditButton = false;
  public displayDeleteProjectButton = false;
  public displayCallToActionButton = true;
  public displayHighlightButton = false;
  public displayEmbedButton = false;
  public projectComments : any[][];
  public today = new Date();
  public projectCommentsOld= [
    {
      id: 1, 
      userId : 1,
      username: "Prince Ron",
      created: new Date("31/12/1998"),
      updated: new Date(),
      content: 'Super project! Zou hier graag aan willen sluiten. Leave a like and subscribe!!',
      likes: '22',
    },
    {
      id: 2, 
      userId : 2,
      username: "Humble Andrew",
      created: new Date(this.today.getDate() - 60*60*24*5),
      updated: new Date(),
      content: 'Super project! Zou hier graag aan willen sluiten. Leave a like and subscribe!!',
      likes: '14',
    },
    {
      id: 3, 
      username: "Doctor Ron",
      created: new Date(this.today.getDate() - 60*60*24*10),
      updated: new Date(),
      content: 'Super project! Zou hier graag aan willen sluiten. Leave a like and subscribe!!',
      likes: '2',
    },
    {
      id: 4, 
      username: "Teacher Ron",
      created: new Date(this.today.getDate() - 60*60*24*200),
      updated: new Date(),
      content: 'Super project! Zou hier graag aan willen sluiten. Leave a like and subscribe!!',
      likes: '9',
    },
    {
      id: 5, 
      username: "Athlete Ron",
      created: new Date(this.today.getDate() - 60*60*24*365),
      updated: new Date(),
      content: 'Super project! Zou hier graag aan willen sluiten. Leave a like and subscribe!!',
      likes: '7',
    },
    {
      id: 6, 
      username: "Developer Andrew",
      created: new Date(this.today.getDate() - 342786),
      updated: new Date(),
      content: 'Super project! Zou hier graag aan willen sluiten. Leave a like and subscribe!!',
      likes: '1',
    },
  ];

  /**
   * Property to indicate whether the project is loading.
   */
  public projectLoading = true;

  /**
   * Property for storting the invalidId if an invalid project id was entered.
   */
  public invalidId: string;

  private currentUser: User;

  /**
   * Return whether the project was liked or not to the overview page
   */
  public onLike: Subject<boolean>;

  /**
   * Boolean to trigger animation only after first click and not on page load.
   */
  public animationTriggered = false;

  constructor(
    private projectService: ProjectService,
    private authService: AuthService,
    private commentService: CommentService,
    private highlightService: HighlightService,
    private modalService: BsModalService,
    private alertService: AlertService,
    private highlightByProjectIdService: HighlightByProjectIdService,
    private router: Router,
    private seoService: SEOService,
    private fileRetrieverService: FileRetrieverService,
    private likeService: LikeService
  ) {
    this.onLike = new Subject<boolean>();
  }

  ngOnInit(): void {
    if (this.projectId == null || Number.isNaN(this.projectId) || this.projectId < 1) {
      this.invalidId = this.projectId.toString();
      return;
    }

    this.authService.authNavStatus$.subscribe((status) => {
      this.isAuthenticated = status;
    });
    this.currentUser = this.authService.getCurrentBackendUser();
    
    this.fetchProjectComments();


    this.projectService.get(this.projectId)
      .pipe(
        finalize(() => this.projectLoading = false)
      )
      .subscribe(
        (result) => {
          this.project = result;
          const desc = (this.project.shortDescription) ? this.project.shortDescription : this.project.description;
          this.determineDisplayEditAndDeleteProjectButton();
          this.determineDisplayEmbedButton();
          this.determineDisplayHighlightButton();
          this.determineDisplayCallToActionButton();

          // Updates meta and title tags
          this.seoService.updateDescription(desc);
          this.seoService.updateTitle(this.project.name);
        }
      );

    if (this.authService.currentBackendUserHasScope(scopes.HighlightRead)) {
      this.highlightByProjectIdService.getHighlightsByProjectId(this.projectId)
        .subscribe(highlights => {
          if (highlights == null) {
            return;
          }
          if (highlights.length > 0) {
            this.isProjectHighlighted = true;
          }
        });
    }
  }

  /**
   * The pop state event is fired when the active history entry
   * changes while the user navigates the session history. Whenever
   * the user navigates to another route, this function will hide
   * the active modal.
   * @param event that will be received when history entry changes.
   */
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.hideModalAndRemoveClass();
  }

  public onClickCallToActionButton(url: string) {
    if (!url.match(/^https?:\/\//i)) {
      url = 'http://' + url;
    }

    window.open(url, '_blank');
  }

  public fetchProjectComments(){
    this.commentService
      .fetchComments(this.projectId)
      .subscribe(
        (fetchComments) => {
          this.projectComments = Object.keys(fetchComments)
          .map(function(key) {
            return fetchComments[key]
            });
        }
      );
  }

  public onClickAddCommentToProject() {
    //POST-COMMENT
    let commentObject = (<HTMLInputElement>document.getElementById('project-comment-input-field')).value;
    let newCommentObject = {
      created: "2021-01-05T11:46:18.558Z",
      updated: "2021-02-10T11:46:18.558Z",
      // content : "Hope inexpedient joy disgust virtues endless prejudice suicide decieve christianity against pious. Prejudice hatred prejudice noble zarathustra merciful oneself grandeur transvaluation truth ultimate revaluation aversion intentions. Faith spirit depths victorious ocean superiority burying free inexpedient virtues christian spirit disgust joy. Faithful war madness horror ideal contradict fearful mountains insofar christian mountains grandeur right fearful."};
      content : commentObject};

      if(this.authService.isAuthenticated()){
        //commentService
        this.commentService.addComment(this.projectId, newCommentObject);
        //commentService
      } else {
      // User is not logged in
      const alertConfig: AlertConfig = {
        type: AlertType.warning,
        mainMessage: 'You need to be logged in to comment on this project',
        dismissible: true,
        autoDismiss: true,
        timeout: this.alertService.defaultTimeout
      };
      this.alertService.pushAlert(alertConfig);
    }

    //Like post version
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
    }
  }

  /**
   * Highlight a project by calling the API
   * When Indeterminate checkbox is checked start date and end date fields are disabled and will be null,
   * resulting in an infinite highlight.
   */
  public onClickHighlightButton(canGoBack?: Boolean): void {
    if (this.project == null || this.project.id === 0) {
      const alertConfig: AlertConfig = {
        type: AlertType.danger,
        preMessage: 'Project could not be highlighted',
        mainMessage: 'Project id could not be found',
        dismissible: true,
        autoDismiss: true,
        timeout: this.alertService.defaultTimeout
      };
      this.alertService.pushAlert(alertConfig);
      return;
    }

    const modalRef = this.modalService.show(ModalHighlightFormComponent, {initialState: {canGoBack}});

    modalRef.content.confirm
      .pipe(
        switchMap((highlightFormResult: HighlightFormResult) => {
          // Use result of confirm subscription to call the api.
          const highlightAddResource: HighlightAdd = {
            projectId: this.project.id,
            startDate: highlightFormResult.startDate,
            description: highlightFormResult.description,
            endDate: highlightFormResult.endDate
          };

          if (highlightFormResult.indeterminate) {
            highlightAddResource.startDate = null;
            highlightAddResource.endDate = null;
          }

          return this.highlightService.post(highlightAddResource);
        })
      )
      .subscribe(() => {
        const alertConfig: AlertConfig = {
          type: AlertType.success,
          mainMessage: 'Project was successfully highlighted',
          dismissible: true,
          autoDismiss: true,
          timeout: this.alertService.defaultTimeout
        };
        this.alertService.pushAlert(alertConfig);
        this.isProjectHighlighted = true;
      });

    modalRef.content.goBack.subscribe(() => {
      this.onClickEditHighlightButton();
    });
  }

  /**
   * Method to first open a modal to select project highlight to edit and then the highlight modal form
   */
  public onClickEditHighlightButton(): void {
    this.highlightByProjectIdService
      .getHighlightsByProjectId(this.project.id)
      .subscribe(
        highlights => this.handleHighlightResponse(highlights),
        err => {
          if (err.status === 404) {
            this.onClickHighlightButton(false);
          }
        }
      );
  }

  /**
   * Method to display the tags based on the environment variable.
   * Tags should be hidden in production for now until further implementation is finished.
   */
  public isProduction(): boolean {
    return !environment.production;
  }

  /**
   * Method which triggers when the delete project button is clicked.
   * Displays the remove modal.
   * Removes the project if modal returned true to confirm the delete.
   */
  public onClickRemoveProject(): void {
    const modalOptions: ModalOptions = {
      initialState: {
        titleText: 'Delete project',
        mainText: `Are you sure you want to delete the project, ${this.project.name}?`,
      }
    };
    // Display modal
    const modalRef = this.modalService.show(ModalDeleteGenericComponent, modalOptions);
    // Map observable back to original type
    const modalRefRemove = modalRef.content.remove as Observable<boolean>;

    // Subscribe to remove event.
    // Call the project remove service if true was returned.
    modalRefRemove.pipe(
      switchMap(deleteProject => {
        if (deleteProject) {
          return this.projectService.delete(this.project.id);
        }
        return EMPTY;
      })
    ).subscribe(() => {
      this.alertService.pushAlert({
        mainMessage: 'Removal of project was successful',
        timeout: this.alertService.defaultTimeout,
        dismissible: true,
        autoDismiss: true,
        type: AlertType.success
      });
      this.modalService.hide(1);
      this.router.navigate(['project/overview']);
    });
  }

  /**
   * Method to get the url of the icon of the project. This is retrieved
   * from the file retriever service.
   */
  public getIconUrl(): SafeUrl {
    return this.fileRetrieverService.getIconUrl(this.project.projectIcon);
  }

  /**
   * Method to set the tab to the active tab from the params
   */
  public setActiveTab(newActiveTab): void {
    this.activeTab = newActiveTab;
  }

  /**
   * Method to display the edit project button based on the current user and the project user.
   * If the user either has the ProjectWrite scope or is the creator of the project
   */
  private determineDisplayEditAndDeleteProjectButton(): void {
    if (this.currentUser == null || this.project == null || this.project.user == null) {
      this.displayEditButton = false;
      this.displayDeleteProjectButton = false;
      return;
    }
    if (this.project.user.id === this.currentUser.id ||
        this.authService.currentBackendUserHasScope(scopes.AdminProjectWrite)) {
      this.displayEditButton = true;
      this.displayDeleteProjectButton = true;
    }
  }

  /**
   * Method to display the project's call to action button based on whether or not the project has a set call to action.
   */
  private determineDisplayCallToActionButton(): void {
    if (this.project && this.project.callToAction) {
      this.displayCallToActionButton = true;
      return;
    } else {
      this.displayCallToActionButton = false;
      return;
    }
  }

  /**
   * Method to display the highlight buttons based on the current user.
   * If the user either has the HighlightWrite scope.
   */
  private determineDisplayHighlightButton(): void {
    if (this.authService.currentBackendUserHasScope(scopes.HighlightWrite)) {
      this.displayHighlightButton = true;
      return;
    }
    this.displayHighlightButton = false;
  }

  /**
   * Method to close the modal and redirect to a different page
   * @param url the url to redirect to
   */
  public closeModalAndRedirect(url: string) {
    this.hideModalAndRemoveClass();
    this.router.navigate([url]);
  }

  /**
   * This method will hide the active modal and remove the
   * according class.
   */
  private hideModalAndRemoveClass(): void {
    this.modalService.hide(1);
    document.getElementsByTagName('body')[0].classList.remove('modal-open');
  }

  /**
   * Method to display the embed button based on the current user and the project user.
   * If the user either has the EmbedWrite scope or is the creator of the project
   * @param project The project to check if the current user is the owner.
   */
  private determineDisplayEmbedButton(): void {
    if (this.authService.currentBackendUserHasScope(scopes.EmbedWrite)) {
      this.displayEmbedButton = true;
      return;
    }

    if (this.currentUser == null || this.project == null || this.project.user == null) {
      this.displayEmbedButton = false;
      return;
    }
    this.displayEmbedButton = this.project.user.id === this.currentUser.id;
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

  private formatTimestamps(highlightTimestamp: string): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfTheWeek = days[new Date(highlightTimestamp).getDay()];
    const dateStamp = new Date(highlightTimestamp).getUTCDate() + '-' + (new Date(highlightTimestamp).getUTCMonth() + 1)
      + '-' + new Date(highlightTimestamp).getUTCFullYear();
    const timeStamp = new Date(highlightTimestamp).getUTCHours() + ':' + ('0' + new Date(highlightTimestamp).getUTCMinutes()).slice(-2);
    const timeZone = 'GMT';
    return dayOfTheWeek + ', ' + dateStamp + ', ' + timeStamp + ' ' + timeZone;
  }



  /**
   * Method to display the timedifference between current date and published date.
   * @param commentDateString The comment published date.
   */
  public commentFormatDate(commentDateString: string) {
    //Constants we use within our switch
    const limitMinute = 60;
    const limitHour = limitMinute*60;
    const limitDay = limitHour* 24;
    const limitWeek = limitDay * 7;
    const limitMonth = limitWeek*4;
    const limitYear = limitDay*365;

    let formattedCommentDate = '';
    let today = new Date();
    let commentDate = new Date(commentDateString);
    let dateDifferenceInMs = today.getTime() - commentDate.getTime();
    let dateDifferenceInSecs = dateDifferenceInMs/1000;
    let dateDifInMinutes = dateDifferenceInSecs/60;
    let dateDifInHours = dateDifInMinutes/60;
    let dateDifInDays = dateDifInHours/24;
    let dateDifInWeeks = dateDifInDays/7;
    let dateDifInMonths = dateDifInWeeks/4;
    let dateDifInYears = dateDifInDays/365;
    let diffInSeconds = dateDifferenceInSecs;

    switch(true) {
      case (diffInSeconds < limitMinute):
        return Math.ceil(diffInSeconds) +" second(s) ago.";
      case (diffInSeconds < limitHour):
        return Math.floor(dateDifInMinutes) +" minute(s) ago.";
      case (diffInSeconds < limitDay):
        return Math.floor(dateDifInHours)+" hour(s) ago.";
      case (diffInSeconds < (limitWeek)):
        return Math.floor(dateDifInDays)+" day(s) ago.";
      case (diffInSeconds < (limitWeek+1)):
        return Math.floor(dateDifInWeeks)+" week(s) ago.";
      case (diffInSeconds < (limitWeek)):
        return Math.floor(dateDifInMonths)+" month(s) ago.";
      case (diffInSeconds < (limitYear+1)):
        return Math.floor(dateDifInYears)+" year(s) ago.";
      default:
          return " once upon a time.";
    }
  }

  /**
   * Method for opening the highlight-modal-form
   * @param highlights the array of highlights to be displayed in the modals
   */
  private handleHighlightResponse(highlights: Highlight[]) {
    const options = {initialState: {highlights}, class: 'modal-lg highlight-modal'};
    const highlightsModalComponentRef = this.modalService.show(HighlightsModalComponent, options);

    highlightsModalComponentRef.content.selectHighlightToEdit.subscribe(highlight => {
      const formModalRef = this.modalService.show(ModalHighlightFormComponent, {initialState: {highlight, canGoBack: true}});

      formModalRef.setClass('highlight-form-modal');
      formModalRef.content.confirm.pipe(
        switchMap((highlightFormResult: HighlightFormResult) => {
          const highlightAddResource: HighlightUpdate = {
            projectId: this.project.id,
            startDate: highlightFormResult.startDate,
            description: highlightFormResult.description,
            endDate: highlightFormResult.endDate
          };

          if (highlightFormResult.indeterminate) {
            highlightAddResource.startDate = null;
            highlightAddResource.endDate = null;
          }

          return this.highlightService.put(highlight.id, highlightAddResource);
        })
      ).subscribe(() => {
        const alertConfig: AlertConfig = {
          type: AlertType.success,
          mainMessage: 'Highlight was successfully updated',
          dismissible: true,
          autoDismiss: true,
          timeout: this.alertService.defaultTimeout
        };
        this.alertService.pushAlert(alertConfig);
        this.isProjectHighlighted = true;
      });

      formModalRef.content.goBack.subscribe(() => {
        this.onClickEditHighlightButton();
      });
    });

    highlightsModalComponentRef.content.selectAddHighlight.subscribe(() => {
      this.onClickHighlightButton(true);
    });
  }
}
