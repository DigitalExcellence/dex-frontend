import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { Highlight } from "src/app/models/domain/hightlight";
import { HighlightService } from "src/app/services/highlight.service";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  /**
   * Array to receive and store the projects from the api.
   */
  public highlights: Highlight[] = [];

  /**
   * Boolean to determine whether the component is loading the information from the api.
   */
  public projectsLoading = true;
  constructor(private router: Router, private projectService: HighlightService) {}

  ngOnInit(): void {
    this.projectService
      .getAll()
      .pipe(finalize(() => (this.projectsLoading = false)))
      .subscribe(
        (result) => {
          this.highlights = result;
          console.log(this.highlights);
        },
        (error: HttpErrorResponse) => {
          if (error.status !== 404) {
            console.log("Could not retrieve the highlights");
          }
        }
      );
  }
}
