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

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, finalize } from 'rxjs/operators';
import { SelectFormOption } from 'src/app/interfaces/select-form-option';
import { Project } from 'src/app/models/domain/project';
import { ProjectCategory } from 'src/app/models/domain/projectCategory';
import { SearchResultsResource } from 'src/app/models/resources/search-results';
import { AuthService } from 'src/app/services/auth.service';
import { FileRetrieverService } from 'src/app/services/file-retriever.service';
import { UserService } from 'src/app/services/user.service';
import { ProjectDetailModalUtility } from 'src/app/utils/project-detail-modal.util';
import { InternalSearchQuery } from 'src/app/models/resources/internal-search-query';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { SEOService } from 'src/app/services/seo.service';
import { Location } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DetailsComponent } from '../../project/details/details.component';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { environment } from 'src/environments/environment';
import { CategoryService } from 'src/app/services/category.service';

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
;



    /**
   * FormControl for getting the input.
   */
     public sortOptionControl: FormControl = null;
     public paginationOptionControl: FormControl = null;
     public searchControl: FormControl = null

  public categories: ProjectCategory[];


  public name: string;
  public photo : File;
  public subscription: Subscription;
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
   * The possible pagination options for the dropdown
   */
     public paginationDropDownOptions = [
      {id: 0, amountOnPage: 12},
      {id: 1, amountOnPage: 24},
      {id: 2, amountOnPage: 36},
    ];

      /**
   * Default pagination option for the dropdown
   */
  public defaultPaginationOption = {
    id: 0,
    amountOnPage: 12
  };

    
  /**
   * Parameters for keeping track of the current internalSearch query values.
   */
   private currentSortOptions: string = this.sortSelectOptions[0].value;

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

  private searchSubject = new BehaviorSubject<string>(null);

   /**
   * Array to receive and store the projects from the api.
   */
   // public projects: Project[] = [];
   // public projectsTotal: Project[] = [];
  
    public displaySearchElements = false;
 
  
    /**
     * Project parameter gets updated per project detail modal
     */
    public currentProject: Project = null;

    /**
     * Parameters for keeping track of the current internalSearch query values.
     */
    private currentSearchInput: string;
    private currentSortType: string = this.currentSortOptions.split(',')[0];
    private currentSortDirection: string = this.currentSortOptions.split(',')[1];
  
    /**
     * Property to indicate whether the project is loading.
     */
    private projectLoading = true;
  
  
    private modalRef: BsModalRef;
    private modalSubscriptions: Subscription[] = [];
  

  constructor(private userService: UserService,
              private router: Router,
              private fileRetrieverService: FileRetrieverService,
              private modalUtility: ProjectDetailModalUtility,
              private authService: AuthService,
              private seoService: SEOService,
              private location: Location,
              private modalService: BsModalService,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute, 
              private categoryService: CategoryService,
              private route: ActivatedRoute) {
               this.searchControl = new FormControl('');
               this.sortOptionControl = new FormControl(this.sortSelectOptions);
                this.paginationOptionControl = new FormControl(this.paginationDropDownOptions[0]);
            
              }

              ngOnInit(): void {
                this.subscription = this.authService.authNavStatus$.subscribe((status) => {
                  this.isAuthenticated = status;
                  this.name = this.authService.name;
                });

                this.authService.authNavStatus$.subscribe((status) => {
                  this.isAuthenticated = status;
                  if (status) {
                    this.userService.getProjectsFromUser()
                      .pipe(finalize(() => (this.userprojectsLoading = false)))
                      .subscribe((result) => {
                        this.userprojects = result;
                        console.log(this.userprojects)
                        this.userprojects.forEach(element => {
                          element.likeCount = element.likes.length;
                        });
                       // this.projectsToDisplay = this.userprojects;
                      });
                  }
                });
              
                // Subscribe to search subject to debounce the input and afterwards searchAndFilter.
                this.searchSubject
                    .pipe(
                        debounceTime(500)
                    )
                    .subscribe((result) => {
                      if (!result) {
                        return;
                      }
                      this.onInternalQueryChange();
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
              public onClickUserProject(id: number, name: string): void {
                name = name.split(' ').join('-');
                this.modalUtility.openProjectModal(id, name, '/home');
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
                this.searchSubject.next(value);
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
              public onPaginationChange() {
                this.amountOfProjectsOnSinglePage = this.paginationOptionControl.value.amountOnPage;
                if (this.amountOfProjectsOnSinglePage === this.paginationResponse.totalCount) {
                  this.currentPage = 1;
                }
                this.onInternalQueryChange();
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
                this.onInternalQueryChange();
              }
            
              public onCategoryChange(categoryId: number): void {
                this.categories = this.categories.map(category =>
                    category.id === categoryId
                        ? {...category, selected: !category.selected}
                        : category);
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
                  categories: this.categories
                      .map(value => value.selected ? value.id : null)
                      .filter(value => value)
                };
            
                this.updateQueryParams();
            

              }
            
              /**
               * Method to handle the response of the call to the project or search service.
               */
              private handleSearchAndProjectResponse(response: SearchResultsResource): void {
                this.paginationResponse = response;
            
                this.userprojects = response.results;
                this.projectsToDisplay = response.results;
                this.totalNrOfProjects = response.totalCount;
            
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
                              this.location.replaceState(`/user/projects`, queryString);
                              this.updateSEOTags();
                              this.onInternalQueryChange();
                            }
                          }
                      ));
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
            
              private processQueryParams() {
                this.route.queryParams.subscribe(({query, categories: selectedCategories, sortOption, pagination}) => {
                  if (query !== 'null' && query !== 'undefined') {
                    this.searchControl.setValue(query);
                  }
            
                  if (selectedCategories) {
                    selectedCategories = JSON.parse(selectedCategories);
                    if (selectedCategories.count > 0) {
                      this.categories = this.categories?.map(category => {
                        return {
                          ...category,
                          selected: selectedCategories.contains(category.id)
                        };
                      });
                    }
                  }
            
                  if (sortOption) {
                    this.currentSortOptions = sortOption;
                    this.sortOptionControl.setValue(this.sortSelectOptions.find(option => option.value === sortOption));
                  }
            
                  if (pagination) {
                    const parsed = this.paginationDropDownOptions.find(option =>
                        option.amountOnPage === parseInt(pagination, 10));
            
                    this.paginationOptionControl.setValue(parsed ? parsed : 12);
                    this.amountOfProjectsOnSinglePage = parsed ? parsed.amountOnPage : 12;
                  }
            
                  this.onInternalQueryChange();
                });
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