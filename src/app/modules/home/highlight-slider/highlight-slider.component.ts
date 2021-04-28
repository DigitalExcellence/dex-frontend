import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
          this.highlights = this.pickRandomHighlights(result, 3);
        });
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

  private pickRandomHighlights(highlights: Highlight[], amount: number) {
    return [...highlights].sort(() => 0.5 - Math.random()).slice(0, amount);
  }
}
