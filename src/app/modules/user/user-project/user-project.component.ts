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
import { FormControl } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { SelectFormOption } from 'src/app/interfaces/select-form-option';
import { Project } from 'src/app/models/domain/project';
import { ProjectCategory } from 'src/app/models/domain/projectCategory';
import { SearchResultsResource } from 'src/app/models/resources/search-results';
import { AuthService } from 'src/app/services/auth.service';
import { FileRetrieverService } from 'src/app/services/file-retriever.service';
import { InternalSearchService } from 'src/app/services/internal-search.service';
import { PaginationService } from 'src/app/services/pagination.service';
import { UserService } from 'src/app/services/user.service';
import { ProjectDetailModalUtility } from 'src/app/utils/project-detail-modal.util';
import { InternalSearchQuery } from 'src/app/models/resources/internal-search-query';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { SEOService } from 'src/app/services/seo.service';
import { Location } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DetailsComponent } from '../../project/details/details.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'user-project',
  templateUrl: './user-project.component.html',
  styleUrls: ['./user-project.component.scss'],
})
export class UserProjectComponent implements OnInit {

    public sortSelectOptions: SelectFormOption[] = [
        {value: 'updated,desc', viewValue: 'Updated (new-old)'},
        {value: 'updated,asc', viewValue: 'Updated (old-new)'},
        {value: 'name,asc', viewValue: 'Name (a-z)'},
        {value: 'name,desc', viewValue: 'Name (z-a)'},
        {value: 'created,desc', viewValue: 'Created (new-old)'},
        {value: 'created,asc', viewValue: 'Created (old-new)'},
      ];

  public isAuthenticated: boolean;
  public projectsToDisplay: Project[] = [];
  public searchControl: FormControl = null;

  public categories: ProjectCategory[];

  private modalRef: BsModalRef;
  private modalSubscriptions: Subscription[] = [];

    /**
   * The number of projects that are on the platform
   */
     public totalNrOfProjects = 0;

  /**
   * Boolean to determine whether the component is loading the information from the api.
   */
   public projectsLoading = true;

  /**
   * Stores the response with the paginated projects etc. from the api.
   */
   public paginationResponse: SearchResultsResource;

  public showListView: boolean = false;

  public showPaginationFooter = true;
  public currentPage;
  /**
   * Parameters for keeping track of the current internalSearch query values.
   */
   private currentSearchInput: string;
   private currentSortOptions: string = this.sortSelectOptions[0].value;
   private currentSortType: string = this.currentSortOptions.split(',')[0];
   private currentSortDirection: string = this.currentSortOptions.split(',')[1];
    /**
   * The amount of projects that will be displayed on a single page.
   */
     public amountOfProjectsOnSinglePage = 12;
  /**
   * Array to receive and store the projects from the api.
   */
  public userprojects: Project[] = [];

  /**
   * Boolean to determine whether the component is loading the information from the api.
   */
  public userprojectsLoading = true;

  constructor(private userService: UserService,
    private router: Router,
              private fileRetrieverService: FileRetrieverService,
              private modalUtility: ProjectDetailModalUtility,
              private authService: AuthService,
              private internalSearchService: InternalSearchService,
              private paginationService: PaginationService,
              private seoService: SEOService,
              private location: Location,
              private modalService: BsModalService) {}

  ngOnInit(): void {
    this.authService.authNavStatus$.subscribe((status) => {
      this.isAuthenticated = status;
      if (status) {
        this.userService.getProjectsFromUser()
          .pipe(finalize(() => (this.userprojectsLoading = false)))
          .subscribe((result) => {
            this.userprojects = result;
            this.userprojects.forEach(element => {
              element.likeCount = element.likes.length;
            });
            this.projectsToDisplay = this.userprojects;
          });
      }
    });
  }

  /**
* Triggers on project click in the list.
* @param id project id.
* @param name project name
*/
  public onClickUserProject(id: number, name: string): void {
    name = name.split(' ').join('-');
    this.modalUtility.openProjectModal(id, name, '/home');
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

  public projectsEmpty(): boolean {
    return this.userprojects.length < 1;
  }

    /**
   * Method that retrieves the page of the pagination footer when the user selects a new one.
   * @param event holds the current page of the pagination footer, as well as the amount
   * of projects that are being displayed on a single page.
   */
     public pageChanged(event: PageChangedEvent): void {
        this.currentPage = event.page;
        this.onInternalQueryChange();
      }

      private onInternalQueryChange(): void {
        const internalSearchQuery: InternalSearchQuery = {
          query: this.currentSearchInput === '' ? null : this.currentSearchInput,
          // If there is a search query, search on all pages
          page: !this.currentSearchInput ? this.currentPage : null,
          amountOnPage: this.amountOfProjectsOnSinglePage,
          sortBy: this.currentSortType,
          sortDirection: this.currentSortDirection,
          categories: this.categories
              .map(value => value.selected ? value.id : null)
              .filter(value => value)
        };

        this.updateQueryParams();

        if (internalSearchQuery.query == null) {
          // No search query provided use projectService.
          this.paginationService
              .getProjectsPaginated(internalSearchQuery)
              .pipe(finalize(() => (this.userprojectsLoading = false)))
              .subscribe((result) => this.handleSearchAndProjectResponse(result));
        } else {
          // Search query provided use searchService.
          this.internalSearchService
              .getSearchResultsPaginated(internalSearchQuery)
              .pipe(finalize(() => (this.userprojectsLoading = false)))
              .subscribe((result) => this.handleSearchAndProjectResponse(result));
        }
      }

      private updateQueryParams() {
        this.router.navigate(
            [],
            {
              queryParams: {
                query: this.searchControl.value,
                sortOption: this.currentSortOptions,
                pagination: this.amountOfProjectsOnSinglePage,
                categories: JSON.stringify(
                    this.categories?.map(category =>
                        category.selected ? category.id : null
                    ).filter(category => category)
                )
              },
              queryParamsHandling: 'merge'
            });
      }

       /**
   * Method to handle the response of the call to the project or search service.
   */
  private handleSearchAndProjectResponse(response: SearchResultsResource): void {
    this.paginationResponse = response;

    this.userprojects = response.results;
    this.projectsToDisplay = response.results;
    this.totalNrOfProjects = response.totalCount;

    this.userprojects = response.results;

    if (this.userprojects.length < this.amountOfProjectsOnSinglePage && this.currentPage <= 1) {
      this.showPaginationFooter = false;
    } else {
      this.showPaginationFooter = true;
    }
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
          this.modalSubscriptions.push(
              this.modalService.onHide.subscribe(() => {
                    if (this.location.path().startsWith('/project/details')) {
                      const queryString = `query=${this.searchControl.value}`
                          + `&sortOption=${this.currentSortOptions}`
                          + `&pagination=${this.amountOfProjectsOnSinglePage}`
                          + `&page=${this.currentPage}`
                          + `&categories=${JSON.stringify(this.categories?.map(
                              category => category.selected ? category.id : null)
                              .filter(category => category)
                          )}`;
                      this.location.replaceState(`/project/overview/`, queryString);
                      this.updateSEOTags();
                      this.onInternalQueryChange();
                    }
                  }
              ));
        }
      }

        /**
   * Methods to update the title and description through the SEO service
   */
  private updateSEOTags() {
    // Updates meta and title tags
    this.seoService.updateTitle('Project overview');
    this.seoService.updateDescription('Browse or search for specific projects or ideas within DeX');
  }
}
