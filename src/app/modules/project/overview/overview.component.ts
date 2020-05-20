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
import { finalize } from 'rxjs/operators';
import { Project } from 'src/app/models/domain/project';
import { ProjectService } from 'src/app/services/project.service';

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

  /**
   * Boolean to determine whether the component is loading the information from the api.
   */
  public projectsLoading = true;

  constructor(private router: Router, private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService
      .getAll()
      .pipe(finalize(() => (this.projectsLoading = false)))
      .subscribe(
        (result) => {
          this.projects = result;
        },
        (error: HttpErrorResponse) => {
          if (error.status !== 404) {
            console.log('Could not retrieve the projects');
          }
        }
      );
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
}
