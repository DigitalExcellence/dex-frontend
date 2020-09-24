import { finalize } from 'rxjs/operators';
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
import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/models/domain/project';
import { ProjectService } from 'src/app/services/project.service';
import { AuthService } from 'src/app/services/auth.service';
import { HighlightService } from 'src/app/services/highlight.service';
import { HighlightAdd } from 'src/app/models/resources/highlight-add';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalHighlightComponent, HighlightFormResult } from 'src/app/modules/project/modal-highlight/modal-highlight.component';
import { AlertConfig } from 'src/app/models/internal/alert-config';
import { AlertType } from 'src/app/models/internal/alert-type';
import { AlertService } from 'src/app/services/alert.service';
import { switchMap } from 'rxjs/operators';
import { User } from 'src/app/models/domain/user';
import { Observable, EMPTY } from 'rxjs';
import { HighlightByProjectIdService } from 'src/app/services/highlightid.service';
import { ModalHighlightDeleteComponent } from 'src/app/modules/project/modal-highlight-delete/modal-highlight-delete.component';
import { Highlight } from 'src/app/models/domain/hightlight';
import { ModalDeleteGenericComponent } from 'src/app/components/modals/modal-delete-generic/modal-delete-generic.component';
import { scopes } from 'src/app/models/domain/scopes';
import { SEOService } from 'src/app/services/seo.service';

/**
 * Overview of a single project
 */
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  /**
   * Variable to store the project which is retrieved from the api
   */
  public project: Project;
  public isAuthenticated: boolean;
  public isProjectHighlighted = false;

  public displayEditButton = false;
  public displayDeleteProjectButton = false;
  public displayHighlightButton = false;
  public displayEmbedButton = false;

  /**
   * Property to indicate whether the project is loading.
   */
  public projectLoading = true;

  /**
   * Property for storting the invalidId if an invalid project id was entered.
   */
  public invalidId: string;

  private currentUser: User;

  constructor(
    private activedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private authService: AuthService,
    private highlightService: HighlightService,
    private modalService: BsModalService,
    private alertService: AlertService,
    private highlightByProjectIdService: HighlightByProjectIdService,
    private router: Router,
    private seoService: SEOService
  ) { }

  ngOnInit(): void {
    const routeId = this.activedRoute.snapshot.paramMap.get('id');
    if (!routeId) {
      return;
    }
    const id = Number(routeId);
    if (id == null || Number.isNaN(id) || id < 1) {
      this.invalidId = routeId;
      return;
    }

    this.authService.authNavStatus$.subscribe((status) => {
      this.isAuthenticated = status;
    });
    this.currentUser = this.authService.getCurrentBackendUser();

    this.projectService.get(id)
      .pipe(
        finalize(() => this.projectLoading = false)
      )
      .subscribe(
        (result) => {
          this.project = result;
          const desc = (this.project.shortDescription) ? this.project.shortDescription : this.project.description;
          this.determineDisplayEditProjectButton();
          this.determineDisplayDeleteProjectButton();
          this.determineDisplayEmbedButton();
          this.determineDisplayHighlightButton();

          // Updates meta and title tags
          this.seoService.updateDescription(desc);
          this.seoService.updateTitle(this.project.name);
        }
      );

    if (this.authService.currentBackendUserHasScope(scopes.HighlightRead)) {
      this.highlightByProjectIdService.getHighlightsByProjectId(id)
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
   * Highlight a project by calling the API
   * When Indeterminate checkbox is checked start date and end date fields are disabled and will be null,
   * resulting in an infinite highlight.
   */
  public onClickHighlightButton(): void {
    if (this.project == null || this.project.id === 0) {
      const alertConfig: AlertConfig = {
        type: AlertType.danger,
        preMessage: 'Project could not be highlighted',
        mainMessage: 'Project id could not be found',
        dismissible: true,
        timeout: this.alertService.defaultTimeout
      };
      this.alertService.pushAlert(alertConfig);
      return;
    }
    const modalRef = this.modalService.show(ModalHighlightComponent);

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
          timeout: this.alertService.defaultTimeout
        };
        this.alertService.pushAlert(alertConfig);
        this.isProjectHighlighted = true;
      });
  }

  /**
   * Method to delete a highlight.
   */
  public onClickDeleteHighlightButton(): void {
    if (this.project == null || this.project.id === 0) {
      return;
    }
    this.highlightByProjectIdService.getHighlightsByProjectId(this.project.id).subscribe(
      (results: Highlight[]) => {
        if (results == null) {
          return;
        }
        results.forEach(highlight => {
          if (highlight.startDate != null && highlight.endDate != null) {
            highlight.startDate = this.formatTimestamps(highlight.startDate);
            highlight.endDate = this.formatTimestamps(highlight.endDate);
          } else {
            highlight.startDate = 'Never Ending';
            highlight.endDate = 'Never Ending';
          }
        });
        const initialState = { highlights: results };
        this.modalService.show(ModalHighlightDeleteComponent, { initialState });
      }
    );
  }

  /**
   * Method to display the tags based on the environment variable.
   * Tags should be hidden in production for now untill futher implementation is finished.
   */
  public displayTags(): boolean {
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
        type: AlertType.success
      });
      this.router.navigate(['project/overview']);
    });
  }

  /**
   * Method to display the edit project button based on the current user and the project user.
   * If the user either has the ProjectWrite scope or is the creator of the project
   */
  private determineDisplayEditProjectButton(): void {
    if (this.authService.currentBackendUserHasScope(scopes.ProjectWrite)) {
      this.displayEditButton = true;
      return;
    }

    if (this.currentUser == null || this.project == null || this.project.user == null) {
      this.displayEditButton = false;
      return;
    }
    this.displayEditButton = this.project.user.id === this.currentUser.id;
  }

  /**
   * Method to display the delete project button based on the current user and the project user.
   * If the user either has the ProjectWrite scope or is the creator of the project
   */
  private determineDisplayDeleteProjectButton(): void {
    if (this.authService.currentBackendUserHasScope(scopes.ProjectWrite)) {
      this.displayDeleteProjectButton = true;
      return;
    }

    if (this.currentUser == null || this.project == null || this.project.user == null) {
      this.displayDeleteProjectButton = false;
      return;
    }
    this.displayDeleteProjectButton = this.project.user.id === this.currentUser.id;
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

  private formatTimestamps(highlightTimestamp: string): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfTheWeek = days[new Date(highlightTimestamp).getDay()];
    const dateStamp = new Date(highlightTimestamp).getUTCDate() + '-' + (new Date(highlightTimestamp).getUTCMonth() + 1)
      + '-' + new Date(highlightTimestamp).getUTCFullYear();
    const timeStamp = new Date(highlightTimestamp).getUTCHours() + ':' + ('0' + new Date(highlightTimestamp).getUTCMinutes()).slice(-2);
    const timeZone = 'GMT';
    return dayOfTheWeek + ', ' + dateStamp + ', ' + timeStamp + ' ' + timeZone;
  }


}
