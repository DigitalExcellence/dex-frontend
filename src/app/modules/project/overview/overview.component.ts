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

import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { finalize, filter, debounceTime, distinctUntilChanged, tap } from "rxjs/operators";
import { Project } from "src/app/models/domain/project";
import { ProjectService } from "src/app/services/project.service";
import { SearchResults } from "src/app/models/domain/searchresults";
import { Subject, fromEvent, Observable, of } from "rxjs";
import { InternalSearchService } from "src/app/services/internal-search.service";

/**
 * Overview of all the projects
 */
@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.scss"],
})
export class OverviewComponent implements OnInit {
  /**
   * Array to receive and store the projects from the api.
   */
  public projects: Project[] = [];
  public project: Project;

  /**
   * Boolean to determine whether the component is loading the information from the api.
   */
  public projectsLoading = true;

  public results: SearchResults;
  // public searchTerm$ = new Subject<string>();

  constructor(private router: Router, private projectService: ProjectService, private internalSearchService: InternalSearchService) {
    this.results?.searchResults.forEach((search) => {
      this.project.id = search.id;
      this.project.name = search.name;
      this.project.shortDescription = search.shortDescription;
      this.project.updated = search.updated;
      this.project.created = search.created;
      this.projects.push(this.project);
    });
  }
  // ngAfterViewInit() {
  //   // server-side search
  //   fromEvent(this.input.nativeElement, "keyup")
  //     .pipe(
  //       filter(Boolean),
  //       debounceTime(150),
  //       distinctUntilChanged(),
  //       tap((text) => {
  //         console.log(this.input.nativeElement.value);
  //         this.internalSearchService.search(this.input.nativeElement.value).subscribe((results) => {
  //           this.results = results;
  //           this.results.searchResults.forEach((element) => {
  //             console.log(element.name);
  //           });
  //         });
  //       })
  //     )
  //     .subscribe();
  // }

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
            console.log("Could not retrieve the projects");
          }
        }
      );
  }

  public async onSearchQueryEnter(query: string) {
    console.log(query);
    let pizza: any;
    await this.internalSearchService.search(of(query)).subscribe((results) => {
      pizza = results;
      // console.log(this.results);
    });
    this.projects = [];
    console.log(pizza);
    pizza.searchResults.forEach((search) => {
      this.project.id = search.id;
      this.project.name = search.name;
      this.project.shortDescription = search.shortDescription;
      this.project.updated = search.updated;
      this.project.created = search.created;
      this.projects.push(this.project);
    });
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
