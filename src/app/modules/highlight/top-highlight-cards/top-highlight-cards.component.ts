import { Component, OnInit } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { finalize } from "rxjs/internal/operators/finalize";
import { HighlightService } from "src/app/services/highlight.service";
import { Router } from "@angular/router";
import { Highlight } from "src/app/models/domain/hightlight";

@Component({
  selector: "app-top-highlight-cards",
  templateUrl: "./top-highlight-cards.component.html",
  styleUrls: ["./top-highlight-cards.component.scss"],
})
export class TopHighlightCardsComponent implements OnInit {
  /**
   * Array to receive and store the projects from the api.
   */
  public highlights: Highlight[] = [];

  /**
   * Boolean to determine whether the component is loading the information from the api.
   */
  public highlightsLoading: boolean = true;
  constructor(private router: Router, private projectService: HighlightService) {}

  ngOnInit(): void {
    this.projectService
      .getAll()
      .pipe(finalize(() => (this.highlightsLoading = false)))
      .subscribe(
        (result) => {
          this.highlights = this.generateSampleSizeOf(result, 3);
        },
        (error: HttpErrorResponse) => {
          if (error.status !== 404) {
            console.log("Could not retrieve the highlights");
          }
        }
      );
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

    if (!Array.isArray(population)) throw new TypeError("Population must be an array.");
    var n: number = population.length;
    if (k < 0 || k > n) throw new RangeError("Sample larger than population or is negative");

    var result = new Array(k);
    var setsize: number = 21; // size of a small set minus size of an empty list

    if (k > 5) setsize += Math.pow(4, Math.ceil(Math.log(k * 3)));

    if (n <= setsize) {
      // An n-length list is smaller than a k-length set
      var pool: any[] = population.slice();
      for (var i = 0; i < k; i++) {
        // invariant:  non-selected at [0,n-i)
        var j: number = (Math.random() * (n - i)) | 0;
        result[i] = pool[j];
        pool[j] = pool[n - i - 1]; // move non-selected item into vacancy
      }
    } else {
      var selected = new Set();
      for (var i = 0; i < k; i++) {
        var j: number = (Math.random() * n) | 0;
        while (selected.has(j)) {
          j = (Math.random() * n) | 0;
        }
        selected.add(j);
        result[i] = population[j];
      }
    }

    return result;
  }
}
