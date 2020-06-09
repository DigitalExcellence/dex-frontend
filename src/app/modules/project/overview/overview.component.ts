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
import { Router } from '@angular/router';
import { finalize, debounceTime } from 'rxjs/operators';
import { Project } from 'src/app/models/domain/project';
import { FormControl } from '@angular/forms';
import { InternalSearchService } from 'src/app/services/internal-search.service';
import { InternalSearchQuery } from 'src/app/models/resources/internal-search-query';
import { PaginationService } from 'src/app/services/pagination.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Pagination } from 'src/app/models/domain/pagination';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { SelectFormOption } from 'src/app/interfaces/select-form-option';

interface CategoryFormResult {
  code: boolean;
  video: boolean;
  research_paper: boolean;
  survey_results: boolean;
}

interface TagFormResult {
  learning: boolean;
  reserach: boolean;
  mobile: boolean;
  ux: boolean;
}
interface SortFormResult {
  type: string;
  direction: string;
}

/**
 * Overview of all the projects
 */
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  /**
   * Array to receive and store the projects from the api.
   */
  public projects: Project[] = [];
  public projectsToDisplay: Project[] = [];
  public projectsTotal: Project[] = [];

  /**
   * Stores the response with the paginated projects etc. from the api.
   */
  public paginationResponse: Pagination;

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
  public amountOfProjectsOnSinglePage = 10;


  /**
   * The number of projects that are on the platform
   */
  public totalNrOfProjects = 0;

  /**
   * Default pagination option for the dropdown
   */
  public defaultPaginationOption = {
    id: 0,
    amountOnPage: 10
  };

  public showPaginationFooter = true;

  /**
   * The possible pagination options for the dropdown
   */
  public paginationDropDownOptions = [
    { id: 0, amountOnPage: 10 },
    { id: 1, amountOnPage: 20 },
    { id: 2, amountOnPage: 30 },
  ];

  /**
   * FormGroup for the category search option.
   */
  public categoryForm: FormGroup;

  /**
   * FormGroup for the tags search option.
   */
  public tagsForm: FormGroup;

  public sortForm: FormGroup;

  public sortTypeSelectOptions: SelectFormOption[] = [
    { value: null, viewValue: '-' },
    { value: 'name', viewValue: 'Name' },
    { value: 'created', viewValue: 'Created' },
    { value: 'updated', viewValue: 'Updated' }
  ];

  public sortDirectionSelectOptions: SelectFormOption[] = [
    { value: 'asc', viewValue: 'Ascending' },
    { value: 'desc', viewValue: 'Descending' },
  ];

  public displaySearchElements = false;

  /**
  * The current selected page of the pagination footer.
  */
  private currentPage = 1;

  private searchSubject = new BehaviorSubject<InternalSearchQuery>(null);

  private currentSearchInput: string = null;

  private currentSortType: string = null;

  private currentSortDirection: string = null;

  private onlyHighlightedProjects = false;

  constructor(
    private router: Router,
    private paginationService: PaginationService,
    private internalSearchService: InternalSearchService,
    private formBuilder: FormBuilder) {
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

    this.sortForm = this.formBuilder.group({
      type: null,
      direction: this.sortDirectionSelectOptions[0].value
    });

    if (!environment.production) {
      this.displaySearchElements = true;
    }
  }

  ngOnInit(): void {
    const internalSearchQuery: InternalSearchQuery = {
      page: this.currentPage,
      amountOnPage: this.amountOfProjectsOnSinglePage,
      sortBy: null,
      sortDirection: null,
      highlighted: null,

    };
    this.getProjectsWithPaginationParams(internalSearchQuery);

    // Subscribe to search subject to debounce the input and afterwards searchAndFilter.
    this.searchSubject
      .pipe(
        debounceTime(500)
      )
      .subscribe((searchQuery) => {
        this.searchAndFilterProjects(searchQuery);
      });

    this.sortForm.valueChanges.subscribe(value => this.onSortFormValueChange(value));

    // Following two oberservables can be used in the feature to implement category & tags searching
    // this.categoryForm.valueChanges.subscribe((categoryFormResult: CategoryFormResult) => {
    //   console.log(categoryFormResult);
    // });

    // this.tagsForm.valueChanges.subscribe((tagFormResult: TagFormResult) => {
    //   console.log(tagFormResult);
    // });
  }

  /**
   * Method which triggers when the serach input receives a key up.
   * Updates the search subject with the query.
   * @param $event the event containing the info of the keyboard press.
   */
  public onSearchInput($event: KeyboardEvent): void {
    const controlValue: string = this.searchControl.value;
    let internalSearchQuery: InternalSearchQuery = null;
    if (controlValue == null || controlValue === '') {
      // No search value present, display the default project list.
      internalSearchQuery = {
        page: this.currentPage,
        amountOnPage: this.amountOfProjectsOnSinglePage,
        sortBy: this.currentSortType,
        sortDirection: this.currentSortDirection,
        highlighted: null
      };
      this.getProjectsWithPaginationParams(internalSearchQuery);
      this.showPaginationFooter = true;
      return;
    }
    this.currentSearchInput = controlValue;
    internalSearchQuery = {
      query: this.currentSearchInput,
      page: this.currentPage,
      amountOnPage: this.amountOfProjectsOnSinglePage,
      sortBy: this.currentSortType,
      sortDirection: this.currentSortDirection,
      highlighted: null
    };
    this.searchSubject.next(internalSearchQuery);
  }

  /**
   * Checks whether there are any projects
   */
  public projectsEmpty(): boolean {
    return this.projects.length < 1;
  }

  /**
   * Triggers on project click in the list
   * @param id project id
   */
  public onClickProject(id: number): void {
    this.router.navigate([`/project/details/${id}`]);
  }

  /**
   * Method that retrieves the page of the pagination footer when the user selects a new one
   * @param event holds the current page of the pagination footer, as well as the amount
   * of projects that are being displayed on a single page
   */
  public pageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;

    const internalSearchQuery: InternalSearchQuery = {
      query: this.currentSearchInput,
      page: this.currentPage,
      amountOnPage: this.amountOfProjectsOnSinglePage,
      sortBy: this.currentSortType,
      sortDirection: this.currentSortDirection,
      highlighted: null
    };
    this.getProjectsWithPaginationParams(internalSearchQuery);
  }

  /**
   * Method that retrieves the value that has changed from the pagination dropdown in the accordion,
   * and based on that value retrieves the paginated projects with the right parameters.
   * @param $event the identifier of the selected value
   */
  public onChangePaginationSelect($event: number) {
    this.amountOfProjectsOnSinglePage = this.paginationDropDownOptions[$event].amountOnPage;
    if (this.amountOfProjectsOnSinglePage === this.paginationResponse.totalCount) {
      this.currentPage = 1;
    }
    const internalSearchQuery: InternalSearchQuery = {
      query: this.currentSearchInput,
      page: this.currentPage,
      amountOnPage: this.amountOfProjectsOnSinglePage,
      sortBy: this.currentSortType,
      sortDirection: this.currentSortDirection,
      highlighted: null
    };
    this.getProjectsWithPaginationParams(internalSearchQuery);
  }

  /**
   * Method to search for projects based on the query.
   * Filters projects based on the foundProjects matching the query.
   * Modifies the projectToDisplay list based on the filter.
   * @param query The query to search a project for.
   */
  private searchAndFilterProjects(query: InternalSearchQuery): void {
    if (query == null) {
      return;
    }

    this.internalSearchService.getSearchResultsPaginated(query)
      .subscribe(result => {
        const foundProjects = result.results;
        if (foundProjects == null || this.projects == null) {
          return;
        }
        if (foundProjects.length < this.amountOfProjectsOnSinglePage) {
          this.showPaginationFooter = false;
        }
        this.projectsToDisplay = foundProjects;
      });
  }

  /**
   * Method that retrieves paginated projects.
   * @param currentPage the pagenumber for which we need to retrieve the projects.
   * @param numberOfProjectsOnSinglePage the number of projects that will be displayed on a single page.
   */
  private getProjectsWithPaginationParams(internalSearchQuery: InternalSearchQuery): void {
    this.paginationService.getProjectsPaginated(internalSearchQuery)
      .pipe(finalize(() => (this.projectsLoading = false)))
      .subscribe(
        (result) => {
          this.paginationResponse = result;
          this.projects = result.results;
          this.projectsToDisplay = result.results;
          this.totalNrOfProjects = result.totalCount;
          console.log(this.projects);
        }
      );
  }

  private onSortFormValueChange(value: SortFormResult): void {
    console.log(value);
    if (value == null || value.type == null) {
      return;
    }
    this.currentSortType = value.type;
    this.currentSortDirection = value.direction;

    const internalSearchQuery: InternalSearchQuery = {
      query: this.currentSearchInput,
      page: this.currentPage,
      amountOnPage: this.amountOfProjectsOnSinglePage,
      sortBy: this.currentSortType,
      sortDirection: this.currentSortDirection,
      highlighted: null
    };
    this.getProjectsWithPaginationParams(internalSearchQuery);
  }
}
