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
import { AfterContentInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { debounceTime, finalize } from 'rxjs/operators';
import { Project } from 'src/app/models/domain/project';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { InternalSearchService } from 'src/app/services/internal-search.service';
import { InternalSearchQuery } from 'src/app/models/resources/internal-search-query';
import { PaginationService } from 'src/app/services/pagination.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { environment } from 'src/environments/environment';
import { SelectFormOption } from 'src/app/interfaces/select-form-option';
import { SearchResultsResource } from 'src/app/models/resources/search-results';
import { SEOService } from 'src/app/services/seo.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DetailsComponent } from 'src/app/modules/project/details/details.component';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

/**
 * Overview of all the projects
 */
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, AfterContentInit {
  /**
   * Array to receive and store the projects from the api.
   */
  public projects: Project[] = [];
  public projectsToDisplay: Project[] = [];
  public projectsTotal: Project[] = [];


  /**
   * Determine whether we need to render a list or cart view
   */
  public showListView = false;

  /**
   * Stores the response with the paginated projects etc. from the api.
   */
  public paginationResponse: SearchResultsResource;

  /**
   * Boolean to determine whether the component is loading the information from the api.
   */
  public projectsLoading = true;

  /**
   * FormControl for getting the input.
   */
  public searchControl: FormControl = null;

  /**
   * The amount of projects that will be displayed on a single page.
   */
  public amountOfProjectsOnSinglePage = 12;

  /**
   * The number of projects that are on the platform
   */
  public totalNrOfProjects = 0;

  /**
   * Default pagination option for the dropdown
   */
  public defaultPaginationOption = {
    id: 0,
    amountOnPage: 12
  };

  public showPaginationFooter = true;

  /**
   * The possible pagination options for the dropdown
   */
  public paginationDropDownOptions = [
    { id: 0, amountOnPage: 12 },
    { id: 1, amountOnPage: 24 },
    { id: 2, amountOnPage: 36 },
  ];

  /**
   * FormGroup for the category search option.
   */
  public categoryForm: FormGroup;

  /**
   * FormGroup for the tags search option.
   */
  public tagsForm: FormGroup;

  public sortSelectOptions: SelectFormOption[] = [
    { value: 'updated,desc', viewValue: 'Updated (new-old)' },
    { value: 'updated,asc', viewValue: 'Updated (old-new)' },
    { value: 'name,asc', viewValue: 'Name (a-z)' },
    { value: 'name,desc', viewValue: 'Name (z-a)' },
    { value: 'created,desc', viewValue: 'Created (new-old)' },
    { value: 'created,asc', viewValue: 'Created (old-new)' },
  ];

  public displaySearchElements = false;
  public currentPage = 1;
  /**
   * Project parameter gets updated per project detail modal
   */
  public currentProject: Project = null;
  private searchSubject = new BehaviorSubject<string>(null);
  /**
   * Parameters for keeping track of the current internalSearch query values.
   */
  private currentSearchInput: string = null;
  private currentSortOptions: string = this.sortSelectOptions[0].value;
  private currentSortType: string = this.currentSortOptions.split(',')[0];
  private currentSortDirection: string = this.currentSortOptions.split(',')[1];
  /**
   * Property to indicate whether the project is loading.
   */
  private projectLoading = true;


  private modalRef: BsModalRef;
  private modalSubscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private paginationService: PaginationService,
    private internalSearchService: InternalSearchService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private seoService: SEOService,
    private modalService: BsModalService,
    private location: Location,
    private authService: AuthService) {
    this.searchControl = new FormControl('');

    this.categoryForm = this.formBuilder.group({
      code: false,
      video: false,
      research_paper: false,
      survey_results: false
    });

    this.tagsForm = this.formBuilder.group({
      learning: false,
      research: false,
      mobile: false,
      ux: false
    });

    if (!environment.production) {
      this.displaySearchElements = true;
    }

  }

  ngOnInit(): void {
    this.currentSearchInput = this.activatedRoute.snapshot.queryParamMap.get('query');
    this.searchControl.patchValue(this.currentSearchInput);
    this.onInternalQueryChange();

    // Subscribe to search subject to debounce the input and afterwards searchAndFilter.
    this.searchSubject
      .pipe(
        debounceTime(500)
      )
      .subscribe((result) => {
        if (result == null) {
          return;
        }
        this.onInternalQueryChange();
      });

    this.searchControl.valueChanges.subscribe((value) => this.onSearchInputValueChange(value));

    this.updateSEOTags();


    // Following two oberservables can be used in the feature to implement category & tags searching
    // this.categoryForm.valueChanges.subscribe((categoryFormResult: CategoryFormResult) => {
    //   console.log(categoryFormResult);
    // });

    // this.tagsForm.valueChanges.subscribe((tagFormResult: TagFormResult) => {
    //   console.log(tagFormResult);
    // });
  }

  ngAfterContentInit() {
    this.activatedRoute.params.subscribe(params => {
      const projectId = params.id?.split('-')[0];
      this.createProjectModal(projectId);
    });
  }

  /**
   * Method which triggers when the serach input receives a key up.
   * Updates the search subject with the query.
   * @param $event the event containing the info of the keyboard press.
   */
  public onSearchInputValueChange(value: string): void {
    // Do nothing if input did not change.
    if (this.currentSearchInput === value) {
      return;
    }

    // Do nothing if the input contains only spaces or line breaks AND the value is not already empty.
    // Indicating that the search was cleared and a new request should be made.
    if (value !== '' && !value.replace(/\s/g, '').length) {
      return;
    }

    this.currentSearchInput = value;
    this.searchSubject.next(value);
  }

  /**
   * Checks whether there are any projects
   */
  public projectsEmpty(): boolean {
    return this.projects.length < 1;
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
   * Method that retrieves the page of the pagination footer when the user selects a new one.
   * @param event holds the current page of the pagination footer, as well as the amount
   * of projects that are being displayed on a single page.
   */
  public pageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.onInternalQueryChange();
  }

  /**
   * Method that retrieves the value that has changed from the pagination dropdown in the accordion,
   * and based on that value retrieves the paginated projects with the right parameters.
   * @param $event the identifier of the selected value.
   */
  public onChangePaginationSelect($event: number) {
    this.amountOfProjectsOnSinglePage = this.paginationDropDownOptions[$event].amountOnPage;
    if (this.amountOfProjectsOnSinglePage === this.paginationResponse.totalCount) {
      this.currentPage = 1;
    }
    this.onInternalQueryChange();
  }

  /**
   * Method to handle value changes of the sort form.
   * @param value the value of the form.
   */
  public onSortFormValueChange(value: string): void {
    if (value == null) {
      return;
    }
    this.currentSortType = value.split(',')[0];
    this.currentSortDirection = value.split(',')[1];
    this.onInternalQueryChange();
  }

  /**
   * Method to build the new internal search query when any of it params have changed.
   * Calls the projectService or searchService based on the value of the query.
   */
  private onInternalQueryChange(): void {
    const internalSearchQuery: InternalSearchQuery = {
      query: this.currentSearchInput === '' ? null : this.currentSearchInput,
      // If there is a search query, search on all pages
      page: !this.currentSearchInput ? this.currentPage : null,
      amountOnPage: this.amountOfProjectsOnSinglePage,
      sortBy: this.currentSortType,
      sortDirection: this.currentSortDirection,
    };

    if (internalSearchQuery.query == null) {
      // No search query provided use projectService.
      this.paginationService
        .getProjectsPaginated(internalSearchQuery)
        .pipe(finalize(() => (this.projectsLoading = false)))
        .subscribe((result) => this.handleSearchAndProjectResponse(result));
    } else {
      // Search query provided use searchService.
      this.internalSearchService
        .getSearchResultsPaginated(internalSearchQuery)
        .pipe(finalize(() => (this.projectsLoading = false)))
        .subscribe((result) => this.handleSearchAndProjectResponse(result));
    }
  }

  /**
   * Method to handle the response of the call to the project or search service.
   */
  private handleSearchAndProjectResponse(response: SearchResultsResource): void {
    this.paginationResponse = response;

    this.projects = response.results;
    this.projectsToDisplay = response.results;
    this.totalNrOfProjects = response.totalCount;

    if (this.projects.length < this.amountOfProjectsOnSinglePage && this.currentPage <= 1) {
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
        const projectIndexToUpdate = this.projects.findIndex(project => project.id === projectId);
        if (isLiked) {
          this.projects[projectIndexToUpdate].likeCount++;
          this.projects[projectIndexToUpdate].userHasLikedProject = true;
        } else {
          this.projects[projectIndexToUpdate].likeCount--;
          this.projects[projectIndexToUpdate].userHasLikedProject = false;
        }
      });

      // Go back to home page after the modal is closed
      this.modalSubscriptions.push(
        this.modalService.onHide.subscribe(() => {
          if (this.location.path().startsWith('/project/details')) {
            this.location.replaceState('/project/overview');
            this.updateSEOTags();
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

  /**
 * Method to make tags change appearance on clicking.
 * further implementation is still pending.
 */
  public tagClicked(event) {
    if (event.target.className === 'tag clicked') {
      event.target.className = 'tag';
    } else {
      event.target.className = 'tag clicked';
    }
  }

  /**
 * Method to display the tags based on the environment variable.
 * Tags should be hidden in production for now until further implementation is finished.
 */
  public displayTags(): boolean {
    return !environment.production;
  }
}
