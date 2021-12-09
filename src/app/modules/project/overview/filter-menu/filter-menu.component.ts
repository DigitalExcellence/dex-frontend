import { SelectFormOption } from '../../../../interfaces/select-form-option';
import { ProjectCategory } from '../../../../models/domain/projectCategory';
import { InternalSearchQuery } from '../../../../models/resources/internal-search-query';
import { SearchResultsResource } from '../../../../models/resources/search-results';
import { CategoryService } from '../../../../services/category.service';
import { InternalSearchService } from '../../../../services/internal-search.service';
import { PaginationService } from '../../../../services/pagination.service';

import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { debounceTime, distinctUntilChanged, filter, finalize } from 'rxjs/operators';
import { Project } from 'src/app/models/domain/project';

@Component({
  selector: 'app-filter-menu',
  templateUrl: './filter-menu.component.html',
  styleUrls: ['./filter-menu.component.scss']
})
export class FilterMenuComponent implements OnInit {
  @Output() filteredProjectsChanged = new EventEmitter<{ projects: Project[], totalAmount: number }>();
  @Output() projectsLoadingChanged = new EventEmitter<boolean>();
  @Input() currentPage = 1;

  public categories: ProjectCategory[];

   /**
  * Temporary strings to display as tags
  * toDo: Fix Connection to backend!
  */
  public tags = ['C#', 'JavaScript', 'UI/UX', 'Open Innovation'];
  public recommended = ['Angular', 'Smart Mobile'];

  /**
   * Stores the api response with the paginated projects etc.
   */
  public paginationResponse: SearchResultsResource;

  /**
   * The amount of projects that will be displayed on a single page.
   */
  public amountOfProjectsOnSinglePage = 12;

  /**
   * The possible pagination options for the dropdown
   */
  public paginationDropDownOptions = [
    {id: 0, amountOnPage: 12},
    {id: 1, amountOnPage: 24},
    {id: 2, amountOnPage: 36},
  ];

  public sortSelectOptions: SelectFormOption[] = [
    {value: 'likes,desc', viewValue: 'Likes (high-low)'},
    {value: 'likes,asc', viewValue: 'Likes (low-high)'},
    {value: 'updated,desc', viewValue: 'Updated (new-old)'},
    {value: 'updated,asc', viewValue: 'Updated (old-new)'},
    {value: 'name,asc', viewValue: 'Name (a-z)'},
    {value: 'name,desc', viewValue: 'Name (z-a)'},
    {value: 'created,desc', viewValue: 'Created (new-old)'},
    {value: 'created,asc', viewValue: 'Created (old-new)'}
  ];

  /**
   * FormControl for getting search inputs.
   */
  public searchControl: FormControl = null;
  public sortOptionControl: FormControl = null;
  public paginationOptionControl: FormControl = null;
  /**
   * Parameters to keep track of all the selected search options
   */
  public currentSortOptions: string = this.sortSelectOptions[0].value;
  /**
   * This let's us handle all the search value changes without spamming the api
   */
  private searchSubject = new BehaviorSubject<string>(null);
  private currentSortType: string = this.currentSortOptions.split(',')[0];
  private currentSortDirection: string = this.currentSortOptions.split(',')[1];
  private currentSearchInput = '';

  constructor(private router: Router,
              private paginationService: PaginationService,
              private internalSearchService: InternalSearchService,
              private location: Location,
              private categoryService: CategoryService,
              private route: ActivatedRoute) {
    this.sortOptionControl = new FormControl(this.sortSelectOptions[0]);
    this.paginationOptionControl = new FormControl(this.paginationDropDownOptions[0]);
  }

  ngOnInit(): void {
    this.projectsLoadingChanged.emit(true);
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
  }

  ngAfterViewInit() {
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories;
      this.processQueryParams();
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

    if (value === '') {
      this.updateQueryParams();
      return this.onInternalQueryChange();
    }

    // If the field is empty we don't want to update the searchSubject anymore because the debounce will mess with the query.
    this.searchSubject.next(value);
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
   * Method that retrieves the value that has changed from the pagination dropdown in the accordion,
   * and based on that value retrieves the paginated projects with the right parameters.
   */
  public onPaginationChange(page: number = this.currentPage) {
    this.amountOfProjectsOnSinglePage = this.paginationOptionControl.value.amountOnPage;
    if (this.amountOfProjectsOnSinglePage === this.paginationResponse.totalCount) {
      this.currentPage = 1;
    }
    this.currentPage = page;
    this.updateQueryParams();
    this.onInternalQueryChange();
  }

  public modalOpened(projectId: number, projectName: string): void {
    this.location.replaceState(`/project/details/${projectId}-${projectName}`, this.buildQueryParams());
  }

  public modalClosed() {
    if (this.location.path().startsWith('/project/details')) {
      this.updateQueryParams();
      this.location.replaceState('/project/overview', this.buildQueryParams());
    }
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
          .pipe(finalize(() => this.projectsLoadingChanged.emit(false)))
          .subscribe((result) => this.handleSearchAndProjectResponse(result));
    } else {
      // Search query provided use searchService.
      this.internalSearchService
          .getSearchResultsPaginated(internalSearchQuery)
          .pipe(finalize(() => this.projectsLoadingChanged.emit(false)))
          .subscribe((result) => this.handleSearchAndProjectResponse(result));
    }
  }

  /**
   * Method to handle the response of the call to the project or search service.
   */
  private handleSearchAndProjectResponse(response: SearchResultsResource): void {
    this.paginationResponse = response;

    this.filteredProjectsChanged.emit({
      projects: response.results,
      totalAmount: response.totalCount
    });
  }

  private updateQueryParams() {
    this.router.navigate(
        ['/project/overview'],
        {
          queryParams: {
            query: this.currentSearchInput,
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
        this.currentSearchInput = query;
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
}
