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
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Subscription } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { debounceTime, distinctUntilChanged, filter, finalize } from 'rxjs/operators';
import { SelectFormOption } from 'src/app/interfaces/select-form-option';
import { Project } from 'src/app/models/domain/project';
import { ProjectCategory } from 'src/app/models/domain/projectCategory';
import { InternalSearchQuery } from 'src/app/models/resources/internal-search-query';
import { SearchResultsResource } from 'src/app/models/resources/search-results';
import { DetailsComponent } from 'src/app/modules/project/details/details.component';
import { CategoryService } from 'src/app/services/category.service';
import { InternalSearchService } from 'src/app/services/internal-search.service';
import { PaginationService } from 'src/app/services/pagination.service';
import { SEOService } from 'src/app/services/seo.service';
import { environment } from 'src/environments/environment';

/**
 * Overview of all the projects
 */
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, AfterViewInit {

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
  public sortOptionControl: FormControl = null;
  public paginationOptionControl: FormControl = null;

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
    {id: 0, amountOnPage: 12},
    {id: 1, amountOnPage: 24},
    {id: 2, amountOnPage: 36},
  ];

  public sortSelectOptions: SelectFormOption[] = [
    {value: 'updated,desc', viewValue: 'Updated (new-old)'},
    {value: 'updated,asc', viewValue: 'Updated (old-new)'},
    {value: 'name,asc', viewValue: 'Name (a-z)'},
    {value: 'name,desc', viewValue: 'Name (z-a)'},
    {value: 'created,desc', viewValue: 'Created (new-old)'},
    {value: 'created,asc', viewValue: 'Created (old-new)'},
    {value: 'likes,desc', viewValue: 'Likes (high-low)'},
    {value: 'likes,asc', viewValue: 'Likes (low-high)'},
  ];

  public displaySearchElements = false;
  public currentPage;

  public categories: ProjectCategory[];

  /**
   * Project parameter gets updated per project detail modal
   */
  public currentProject: Project = null;
  private searchSubject = new BehaviorSubject<string>(null);

  /**
   * Parameters for keeping track of the current internalSearch query values.
   */
  private currentSearchInput: string;
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
      private categoryService: CategoryService,
      private route: ActivatedRoute) {
    this.searchControl = new FormControl('');
    this.sortOptionControl = new FormControl(this.sortSelectOptions[0]);
    this.paginationOptionControl = new FormControl(this.paginationDropDownOptions[0]);


  }

  ngOnInit(): void {
    // Subscribe to search subject to debounce the input and afterwards searchAndFilter.
    this.searchSubject
        .pipe(
            filter(Boolean),
            debounceTime(500),
            distinctUntilChanged()
        )
        .subscribe((result) => {
          if (!result) {
            return;
          }
          this.onInternalQueryChange();
          this.updateQueryParams();
        });

    this.searchControl.valueChanges.subscribe((value) => this.onSearchInputValueChange(value));

    this.updateSEOTags();
  }

  ngAfterViewInit() {
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories;
      this.processQueryParams();
    });

    this.activatedRoute.params.subscribe(params => {
      const projectId = params.id?.split('-')[0];
      this.createProjectModal(projectId);
    });
  }

  public onCategoryClick(category): void {
    this.categories = this.categories.map(cat => (
        cat.name === category.name
            ? {...cat, selected: !category.selected}
            : {...cat}
    ));
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

    if (value === '') {
      this.updateQueryParams();
      return this.onInternalQueryChange();
    }

    // If the field is empty we don't want to update the searchSubject anymore because the debounce will mess with the query.
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

    this.location.replaceState(`/project/details/${id}-${name}`, this.buildQueryParams());
  }

  /**
   * Method that retrieves the page of the pagination footer when the user selects a new one.
   * @param event holds the current page of the pagination footer, as well as the amount
   * of projects that are being displayed on a single page.
   */
  public pageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;

    this.onInternalQueryChange();
    this.updateQueryParams();
  }

  /**
   * Method that retrieves the value that has changed from the pagination dropdown in the accordion,
   * and based on that value retrieves the paginated projects with the right parameters.
   * @param $event the identifier of the selected value.
   */
  public onPaginationChange() {
    this.amountOfProjectsOnSinglePage = this.paginationOptionControl.value.amountOnPage;
    if (this.amountOfProjectsOnSinglePage === this.paginationResponse.totalCount) {
      this.currentPage = 1;
    }

    this.onInternalQueryChange();
    this.updateQueryParams();
  }

  /**
   * Method to handle value changes of the sort form.
   * @param value the value of the form.
   */
  public onSortFormValueChange(): void {
    if (!this.sortOptionControl.value) {
      return;
    }
    this.currentSortType = this.sortOptionControl.value.value.split(',')[0];
    this.currentSortDirection = this.sortOptionControl.value.value.split(',')[1];
    this.currentSortOptions = this.sortOptionControl.value.value;
    this.onInternalQueryChange();
    this.updateQueryParams();
  }

  public onCategoryChange(categoryId: number): void {
    this.categories = this.categories.map(category =>
        category.id === categoryId
            ? {...category, selected: !category.selected}
            : category);

    this.onInternalQueryChange();
    this.updateQueryParams();
  }

  /**
   * Method to build the new internal search query when any of it params have changed.
   * Calls the projectService or searchService based on the value of the query.
   */
  private onInternalQueryChange(): void {
    const internalSearchQuery: InternalSearchQuery = {
      query: !this.currentSearchInput || this.currentSearchInput === '' ? null : this.currentSearchInput,
      // If there is a search query, search on all pages
      page: !this.currentSearchInput ? this.currentPage : null,
      amountOnPage: this.amountOfProjectsOnSinglePage,
      sortBy: this.currentSortType,
      sortDirection: this.currentSortDirection,
      categories: this.categories
          .map(value => value.selected ? value.id : null)
          .filter(value => value)
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

    this.showPaginationFooter = !(this.projects.length < this.amountOfProjectsOnSinglePage && this.currentPage <= 1);
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
                  // this.updateQueryParams();
                  // this.location.replaceState('/project/overview', this.buildQueryParams());
                  this.updateSEOTags();

                  this.updateQueryParams();
                  this.onInternalQueryChange();
                }
              }
          ));
    }
  }

  private updateQueryParams() {
    this.router.navigate(
        ['/project/overview'],
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

  private processQueryParams() {
    this.route.queryParams.subscribe((params) => {
      const {query, sortOption, pagination} = params;
      let {categories: selectedCategories} = params;
      if (query && query !== 'null' && query !== 'undefined') {
        this.searchControl.setValue(query);
      }

      if (selectedCategories) {
        selectedCategories = JSON.parse(selectedCategories);
        if (selectedCategories.length > 0) {
          this.categories = this.categories?.map(category => {
            return {
              ...category,
              selected: selectedCategories.indexOf(category.id) >= 0
            };
          });
        }
      }

      if (sortOption) {
        this.currentSortOptions = sortOption;
        const parsed = this.sortSelectOptions.find(option => option.value === sortOption);
        this.sortOptionControl.setValue(parsed ? parsed : this.sortSelectOptions[0]);
      }

      if (pagination) {
        const parsed = this.paginationDropDownOptions.find(option =>
            option.amountOnPage === parseInt(pagination, 10));

        this.paginationOptionControl.setValue(parsed ? parsed : this.paginationDropDownOptions[0]);
        this.amountOfProjectsOnSinglePage = parsed ? parsed.amountOnPage : 12;
      }

      this.onInternalQueryChange();
    });
  }

  private buildQueryParams() {
    const categories = this.categories?.map(
        category => category.selected ? category.id : null)
        .filter(category => category);

    const queryValue = this.currentSearchInput;
    const sortOptionValue = this.sortOptionControl.value.value;
    const paginationValue = this.amountOfProjectsOnSinglePage;
    const categoriesValue = JSON.stringify(categories);

    return `query=${queryValue}`
        + `&sortOption=${sortOptionValue}`
        + `&pagination=${paginationValue}`
        + `&categories=${categoriesValue}`;
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
