import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
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

import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, debounceTime } from 'rxjs/operators';
import { Project } from 'src/app/models/domain/project';
import { ProjectService } from 'src/app/services/project.service';
import { FormControl } from '@angular/forms';
import { InternalSearchService } from 'src/app/services/internal-search.service';
import { InternalSearchQuery } from 'src/app/models/resources/internal-search-query';

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

  /**
   * Boolean to determine whether the component is loading the information from the api.
   */
  public projectsLoading = true;

  /**
   * FormControl for getting the input.
   */
  public searchControl: FormControl = null;

  private searchSubject = new BehaviorSubject<InternalSearchQuery>(null);

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private internalSearchService: InternalSearchService) {
    this.searchControl = new FormControl('');
  }

  ngOnInit(): void {
    this.projectService
      .getAll()
      .pipe(finalize(() => (this.projectsLoading = false)))
      .subscribe(
        (result) => {
          this.projects = result;
          this.projectsToDisplay = result;
        },
        (error: HttpErrorResponse) => {
          if (error.status !== 404) {
            console.log('Could not retrieve the projects');
          }
        }
      );

    // Subscribe to search subject to debounce the input and afterwards searchAndFilter.
    this.searchSubject
      .pipe(
        debounceTime(500)
      )
      .subscribe((searchQuery) => {
        this.searchAndFilterProjects(searchQuery);
      });
  }

  /**
   * Method which triggers when the serach input receives a key up.
   * Updates the search subject with the query.
   * @param $event the event containing the info of the keyboard press.
   */
  public onSearchInput($event: KeyboardEvent): void {
    const controlValue: string = this.searchControl.value;
    if (controlValue == null || controlValue === '') {
      // No search value present, display the default project list.
      this.projectsToDisplay = this.projects;
      return;
    }

    const searchQuery: InternalSearchQuery = {
      query: controlValue
    };
    this.searchSubject.next(searchQuery);
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
  public onProjectClick(id: number): void {
    this.router.navigate([`/project/details/${id}`]);
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

    this.internalSearchService.get(query).subscribe(result => {
      const foundProjects = result.results;
      if (foundProjects == null || this.projects == null) {
        return;
      }

      const filteredProjects = this.projects.filter(project => {
        return foundProjects.map(foundProject => foundProject.id).includes(project.id);
      });
      this.projectsToDisplay = filteredProjects;
    });
  }

}
