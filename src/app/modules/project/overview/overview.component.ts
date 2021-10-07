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
import { FilterMenuComponent } from './filter-menu/filter-menu.component';
import { ProjectListComponent } from './project-list/project-list.component';

import { Location } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/models/domain/project';
import { CategoryService } from 'src/app/services/category.service';
import { InternalSearchService } from 'src/app/services/internal-search.service';
import { PaginationService } from 'src/app/services/pagination.service';
import { ProjectService } from 'src/app/services/project.service';
import { SEOService } from 'src/app/services/seo.service';
import { ProjectDetailModalUtility } from 'src/app/utils/project-detail-modal.util';
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
  @ViewChild(FilterMenuComponent) filterMenu!: FilterMenuComponent;
  @ViewChild(ProjectListComponent) projectList!: ProjectListComponent;

  /**
   * FormControl for getting the input.
   */
  public searchControl: FormControl = null;
  public sortOptionControl: FormControl = null;

  public showPaginationFooter = true;

  public displaySearchElements = false;
  public currentPage = 1;

  /**
   * Parameters for keeping track of the current internalSearch query values.
   */
  public currentSearchInput: string;

  public filteredProjects: Project[];
  public totalAmountOfProjects = 0;
  public projectsLoading = true;
  public amountOfProjectsOnSinglePage = 12;

  /**
    * Object to keep track of a modal that was opened trough the url
    */
  private urlOpenedModal = { state: false, projectId: null };

  constructor(
    private router: Router,
    private paginationService: PaginationService,
    private internalSearchService: InternalSearchService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private seoService: SEOService,
    private location: Location,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private modalUtility: ProjectDetailModalUtility,
    private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.updateSEOTags();

    // Code below is executed when a project is updated (for example on edit component)
    // find the updated project in de database and replace it in the overview
    this.projectService.projectUpdated$.subscribe(updatedProjectId => {
      const projectIndexToUpdate = this.filteredProjects.findIndex(project => project.id === updatedProjectId);
      this.projectService.get(updatedProjectId).subscribe(updatedProject => {
          this.filteredProjects.splice(projectIndexToUpdate, 1, updatedProject);
        });
    });
  }

  ngAfterViewInit(): void {
    this.route.params.subscribe(params => {
      const projectId = +params.id?.split('-')[0];

      // We need the 1ms timeout to make sure the components are rendered, I don't know why angular doesn't do this but whatever
      setTimeout(() => {
        this.amountOfProjectsOnSinglePage = this.filterMenu.amountOfProjectsOnSinglePage;

        // Methods below are executed when an ID has been provided in the URL
        if (projectId) {
          this.modalUtility.openProjectModal(projectId, '', '/project/overview');
          // object to handle check for like-subscribe in filteredProjectsChanged()
          this.urlOpenedModal = { state: true, projectId: projectId };
        }
      }, 1);
    });
  }

  /**
   * Method that sets the new page when the user clicks
   * @param page The page that was selected
   */
  public pageChanged(page: number): void {
    this.currentPage = page;

    this.filterMenu.onPaginationChange();
  }

  public filteredProjectsChanged(result): void {
    this.filteredProjects = result.projects;
    this.totalAmountOfProjects = result.totalAmount;
    this.showPaginationFooter = result.totalAmount > this.filterMenu.amountOfProjectsOnSinglePage;
    // if a modal was opened trough the url, check if like-subscribe is needed
    if (this.urlOpenedModal.state) {
      this.filteredProjects.forEach(project => {
        if (project.id === this.urlOpenedModal.projectId) {
          this.modalUtility.subscribeToLikes(this.urlOpenedModal.projectId, this.filteredProjects);
        }
      });
    }
  }

  public searchInputChanged(searchInput: string) {
    this.filterMenu.onSearchInputValueChange(searchInput);
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

  public modalClosed() {
    this.updateSEOTags();
    this.filterMenu.modalClosed();
  }

  /**
   * Method to display the tags based on the environment variable.
   * Tags should be hidden in production for now until further implementation is finished.
   */
  public displayTags(): boolean {
    return !environment.production;
  }

  projectsLoadingChanged(state: boolean) {
    this.projectsLoading = state;
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
