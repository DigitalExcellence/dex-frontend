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
import { Router, ActivatedRoute } from '@angular/router';
import { finalize, debounceTime } from 'rxjs/operators';
import { Project } from 'src/app/models/domain/project';
import { FormControl } from '@angular/forms';
import { InternalSearchService } from 'src/app/services/internal-search.service';
import { InternalSearchQuery } from 'src/app/models/resources/internal-search-query';
import { PaginationService } from 'src/app/services/pagination.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { SelectFormOption } from 'src/app/interfaces/select-form-option';
import { SearchResultsResource } from 'src/app/models/resources/search-results';


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

  public highlightFormControl: FormControl;

  public sortTypeSelectOptions: SelectFormOption[] = [
    { value: 'updated', viewValue: 'Updated' },
    { value: 'created', viewValue: 'Created' },
    { value: 'name', viewValue: 'Name' }
  ];

  public sortDirectionSelectOptions: SelectFormOption[] = [
    { value: 'desc', viewValue: 'Descending' },
    { value: 'asc', viewValue: 'Ascending' }
  ];

  public highlightSelectOptions: SelectFormOption[] = [
    { value: null, viewValue: 'All projects' },
    { value: true, viewValue: 'Only highlighted' },
    { value: false, viewValue: 'Only non highlighted' }
  ];

  public displaySearchElements = false;

  private searchSubject = new BehaviorSubject<string>(null);

  /**
   * Parameters for keeping track of the current internalSearch query values.
   */
  private currentSearchInput: string = null;

  private currentSortType: string = this.sortTypeSelectOptions[0].value;

  private currentSortDirection: string = this.sortDirectionSelectOptions[0].value;

  public currentOnlyHighlightedProjects: boolean = null;

  private currentPage = 1;

  constructor(
    private router: Router,
    private paginationService: PaginationService,
    private internalSearchService: InternalSearchService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {
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
      type: this.sortTypeSelectOptions[0].value,
      direction: this.sortDirectionSelectOptions[0].value
    });

    // Initialize with index value of 0 to by default select the first select option.
    this.highlightFormControl = this.formBuilder.control(0);

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

    this.sortForm.valueChanges.subscribe((value) => this.onSortFormValueChange(value));

    this.highlightFormControl.valueChanges.subscribe((value) => this.onHighlightFormValueChanges(value));

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
   * @param id project id.
   */
  public onClickProject(id: number): void {
    this.router.navigate([`/project/details/${id}`]);
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
  private onSortFormValueChange(value: SortFormResult): void {
    if (value == null || value.type == null || value.type === 'null') {
      return;
    }
    this.currentSortType = value.type;
    this.currentSortDirection = value.direction;
    this.onInternalQueryChange();
  }

  /**
   * Method to handle the value changes of the highlight form.
   * @param value the value of the highlight form.
   */
  private onHighlightFormValueChanges(value: number): void {
    // Case the value since for some reason it is always returned as a string.
    const convertedIndex = +value;
    const foundOption = this.highlightSelectOptions[convertedIndex];
    if (foundOption == null) {
      return;
    }
    this.currentOnlyHighlightedProjects = foundOption.value;
    this.onInternalQueryChange();
  }

  /**
   * Method to build the new internal search query when any of it params have changed.
   * Calls the projectService or searchService based on the value of the query.
   */
  private onInternalQueryChange(): void {
    const internalSearchQuery: InternalSearchQuery = {
      query: this.currentSearchInput === '' ? null : this.currentSearchInput,
      page: this.currentPage,
      amountOnPage: this.amountOfProjectsOnSinglePage,
      sortBy: this.currentSortType,
      sortDirection: this.currentSortDirection,
      highlighted: this.currentOnlyHighlightedProjects,
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
}
