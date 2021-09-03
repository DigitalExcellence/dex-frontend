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

import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { Project } from 'src/app/models/domain/project';
import { DetailsComponent } from 'src/app/modules/project/details/details.component';
import { AuthService } from 'src/app/services/auth.service';
import { FileRetrieverService } from 'src/app/services/file-retriever.service';
import { SEOService } from 'src/app/services/seo.service';
import { UserService } from 'src/app/services/user.service';
import { ProjectDetailModalUtility } from 'src/app/utils/project-detail-modal.util';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'user-project',
  templateUrl: './user-projects.component.html',
  styleUrls: ['./user-projects.component.scss'],
})
export class UserProjectsComponent implements OnInit {
  public projectsToDisplay: Project[] = [];

  /**
   * User info
   */
  public userName: string;

  /**
   * The number of projects that belong to the user
   */
  public totalNrOfProjects = 0;

  /**
   * Boolean to determine whether the component is loading the information from the api.
   */
  public projectsLoading = true;

   /**
   * Boolean to determine whether to show the projects in listview or gridview
   */
  public showListView = false;

  /**
   * Boolean to determine whether the pagination footer has to be showed
   */
  public showPaginationFooter = true;

  /**
   * The pagination page the user is currently on
   */
  public currentPage;

  /**
   * Array to receive and store the projects from the api.
   */
  public userprojects: Project[] = [];

  /**
   * Boolean to determine whether the component is loading the information from the api.
   */
  public userProjectsLoading = true;

  /**
   * Project parameter gets updated per project detail modal
   */
  public currentProject: Project = null;

  public noProjects = false;

  /**
   * Property to indicate whether the project is loading.
   */
  private modalRef: BsModalRef;

  constructor(private userService: UserService,
              private router: Router,
              private fileRetrieverService: FileRetrieverService,
              private modalUtility: ProjectDetailModalUtility,
              private authService: AuthService,
              private seoService: SEOService,
              private location: Location,
              private modalService: BsModalService,
              private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.authService.authNavStatus$.subscribe(status => {
      this.userName = this.authService.name;
      if (status) {
        this.userService.getProjectsFromUser()
            .pipe(
                finalize(() => (
                    this.userProjectsLoading = false
                ))
            ).subscribe(result => {
              if (result) {
                this.userprojects = result;
              } else {
                this.noProjects = true;
              }
        });
      }
    });
    this.updateSEOTags();
  }

  ngAfterViewInit() {
    this.activatedRoute.params.subscribe(params => {
      const projectId = params.id?.split('-')[0];
      this.createProjectModal(projectId);
    });
  }

  public onClickUserProject(id: number, name: string): void {
    name = name.split(' ').join('-');
    this.modalUtility.openProjectModal(id, name, '/home');
  }

  /**
   * Checks whether there are any projects
   */
  public projectsEmpty(): boolean {
    return this.userprojects.length < 1;
  }

  /**
   * Triggers on project click in the list.
   * @param event click event
   * @param id project id.
   * @param name project name
   */
  public onClickProject(event: Event, id: number, name: string): void {
    name = name.split(' ').join('-');

    const clickedSection = event.target as Element;

    if (clickedSection.classList.contains('project-collaborators')) {
      this.createProjectModal(id, 'collaborators');
    } else {
      this.createProjectModal(id);
    }
    this.location.replaceState(`/project/details/${id}-${name}`);
  }

  /**
   * Method to get the url of the icon of the project. This is retrieved
   * from the file retriever service
   */
  public getIconUrl(project: Project): SafeUrl {
    return this.fileRetrieverService.getIconUrl(project.projectIcon);
  }

  /**
   * Method to open the modal for a projects detail
   * @param projectId the id of the project that should be shown.
   * @param activeTab Define the active tab
   */
  private createProjectModal(projectId: number, activeTab: string = 'description') {
    const initialState = {
      projectId: projectId,
      activeTab: activeTab
    };
    if (projectId) {
      this.modalRef = this.modalService.show(DetailsComponent, {animated: true, initialState});
      this.modalRef.setClass('project-modal');

      this.modalRef.content.onLike.subscribe(isLiked => {
        const projectIndexToUpdate = this.userprojects.findIndex(project => project.id === projectId);
        if (isLiked) {
          this.userprojects[projectIndexToUpdate].likeCount++;
          this.userprojects[projectIndexToUpdate].userHasLikedProject = true;
        } else {
          this.userprojects[projectIndexToUpdate].likeCount--;
          this.userprojects[projectIndexToUpdate].userHasLikedProject = false;
        }
      });

      // Go back to home page after the modal is closed
      this.modalService.onHide.subscribe(() => {
        this.location.replaceState(`/user/projects`);
        this.updateSEOTags();
      });
    }
  }

  /**
   * Methods to update the title and description through the SEO service
   */
  private updateSEOTags() {
    // Updates meta and title tags
    this.seoService.updateTitle('User projects');
    this.seoService.updateDescription('View your own projects within DeX');
  }

  /**
   * Method to display the tags based on the environment variable.
   * Tags should be hidden in production for now until further implementation is finished.
   */
  public displayTags(): boolean {
    return !environment.production;
  }

  public addProjectClicked() {
    this.router.navigateByUrl('project/add');
  }
}
