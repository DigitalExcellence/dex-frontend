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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'src/app/models/domain/project';
import { ProjectService } from 'src/app/services/project.service';
import { AuthService } from 'src/app/services/auth.service';
import { HighlightService } from 'src/app/services/highlight.service';
import { HighlightAdd } from 'src/app/models/resources/highlight-add';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalHighlightComponent, HighlightFormResult } from 'src/app/components/modals/modal-highlight/modal-highlight.component';
import { switchMap, first, flatMap } from 'rxjs/operators';
import { User } from 'src/app/models/domain/user';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';

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
  public displayEditButton = false;

  private currentUser: User;

  constructor(
    private activedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private authService: AuthService,
    private highlightService: HighlightService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    const routeId = this.activedRoute.snapshot.paramMap.get('id');
    if (!routeId) {
      return;
    }
    const id = Number(routeId);
    if (id < 1) {
      return;
    }

    this.authService.authNavStatus$.subscribe((status) => {
      this.isAuthenticated = status;
    });

    this.projectService.get(id)
      .pipe(
        flatMap(project => {
          if (project == null) {
            return throwError(`Could not fetch project for id: ${id}`);
          }
          this.project = project;
          return this.authService.$user.pipe(
            first()
          );
        })
      ).subscribe(user => {
        if (user == null) {
          return;
        }
        this.currentUser = user;
        this.determineDisplayEditProjectButton();
      });
  }

  /**
   * Highlight a project by calling the API
   * When Indeterminate checkbox is checked start date and end date fields are disabled and will be null,
   * resulting in an infinite highlight.
   */
  public onClickHighlightButton(): void {
    if (this.project == null || this.project.id === 0) {
      // TODO: Show appropriate error message: project id could not be found and therefore not be highlighted.
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
        // TODO: display success message.
      }, () => {
        // TODO: display error message.
      });
  }

  /**
   * Method to display the tags based on the environment variable.
   * Tags should be hidden in production for now untill futher implementation is finished.
   */
  public displayTags(): boolean {
    return !environment.production;
  }

  /**
   * Method to display the edit project button based on the current user and the project user.
   * @param project The project to check if the current user is the owner.
   */
  private determineDisplayEditProjectButton(): void {
    if (this.currentUser == null || this.project == null || this.project.user == null) {
      this.displayEditButton = false;
    }
    this.displayEditButton = this.project.user.id === this.currentUser.id;
  }
}
