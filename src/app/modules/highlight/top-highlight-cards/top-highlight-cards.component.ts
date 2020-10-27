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
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Highlight } from 'src/app/models/domain/hightlight';
import { Project } from 'src/app/models/domain/project';
import { HighlightService } from 'src/app/services/highlight.service';
import { RESOURCE_CONFIG } from 'src/app/config/resource-config';

@Component({
  selector: 'app-top-highlight-cards',
  templateUrl: './top-highlight-cards.component.html',
  styleUrls: ['./top-highlight-cards.component.scss'],
})
export class TopHighlightCardsComponent implements OnInit {
  /**
   * Array to receive and store the projects from the api.
   */
  public highlights: Highlight[] = [];

  /**
   * Boolean to determine whether the component is loading the information from the api.
   */
  public highlightsLoading = true;
  constructor(private router: Router,
    private projectService: HighlightService,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.projectService
      .getAll()
      .pipe(finalize(() => (this.highlightsLoading = false)))
      .subscribe((result) => {
        this.highlights = this.generateSampleSizeOf(result, 3);
      });
  }

  private generateSampleSizeOf(population: string | any[], k: number) {
    /*
        Chooses k unique random elements from a population sequence or set.

        Returns a new list containing elements from the population while
        leaving the original population unchanged.  The resulting list is
        in selection order so that all sub-slices will also be valid random
        samples.  This allows raffle winners (the sample) to be partitioned
        into grand prize and second place winners (the subslices).

        Members of the population need not be hashable or unique.  If the
        population contains repeats, then each occurrence is a possible
        selection in the sample.
    */

    if (!Array.isArray(population)) {
      throw new TypeError('Population must be an array.');
    }
    const n: number = population.length;
    if (k < 0) {
      throw new RangeError('Sample larger than population or is negative');
    }
    if (k >= n) {
      k = n;
    }
    const result = new Array(k);
    let setsize = 21; // size of a small set minus size of an empty list

    if (k > 5) {
      setsize += Math.pow(4, Math.ceil(Math.log(k * 3)));
    }

    if (n <= setsize) {
      // An n-length list is smaller than a k-length set
      const pool: any[] = population.slice();
      for (let i = 0; i < k; i++) {
        // invariant:  non-selected at [0,n-i)
        let j: number = Math.floor(Math.random() * (n - i));
        if (!j) {
          j = 0;
        }
        result[i] = pool[j];
        pool[j] = pool[n - i - 1]; // move non-selected item into vacancy
      }
    } else {
      const selected = new Set();
      for (let i = 0; i < k; i++) {
        let j: number = Math.floor((Math.random() * n));
        if (!j) {
          j = 0;
        }
        while (selected.has(j)) {
          j = Math.floor((Math.random() * n));
          if (!j) {
            j = 0;
          }
        }
        selected.add(j);
        result[i] = population[j];
      }
    }

    return result;
  }

    /**
   * Triggers on project click in the list.
   * @param id project id.
   * @param name project name
   */
  public onClickHighlightedProject(id: number, name: string): void {
    name = name.split(' ').join('-');
    this.router.navigate([`/project/details/${id}-${name}`]);
  }

  /**
   * Method to get the url of the icon of the project. This urls can be the local
   * image for a default or a specified icon stored on the server.
   */
  public getIconUrl(id: number): SafeUrl {
    let selectedProject: Project = this.highlights.find(highlight => highlight.projectId == id).project;
    if (selectedProject.projectIcon != null) {
      return this.sanitizer.bypassSecurityTrustUrl(RESOURCE_CONFIG.url + selectedProject.projectIcon.path);
    }
    return 'assets/images/code.svg';
  }
}
