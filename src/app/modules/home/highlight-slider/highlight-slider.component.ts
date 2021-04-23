import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SafeUrl } from '@angular/platform-browser';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Highlight } from 'src/app/models/domain/highlight';
import { Project } from 'src/app/models/domain/project';
import { FileRetrieverService } from 'src/app/services/file-retriever.service';
import { HighlightService } from 'src/app/services/highlight.service';


@Component({
  selector: 'app-highlight-slider',
  templateUrl: './highlight-slider.component.html',
  styleUrls: ['./highlight-slider.component.scss']
})
export class HighlightSliderComponent implements OnInit {

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
             private fileRetrieverService: FileRetrieverService) { }


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
   * Method to get the url of the icon of the project. This is retrieved
   * from the file retriever service
   */
  public getIconUrl(id: number): SafeUrl {
    const foundProject: Project = this.highlights.find(highlight => highlight.projectId === id).project;
    return this.fileRetrieverService.getIconUrl(foundProject.projectIcon);
  }

  public viewAllProjects() {
    if (this.router.url === '/project/overview') {
      location.reload();
    } else {
      this.router.navigate(['project/overview']);
    }
  }

  public viewAddProject() {
    if (this.router.url === '/project/add/source') {
      location.reload();
    } else {
      this.router.navigate(['project/add/source']);
    }
  }

}
