import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SafeUrl } from '@angular/platform-browser';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Highlight } from 'src/app/models/domain/highlight';
import { FileRetrieverService } from 'src/app/services/file-retriever.service';
import { HighlightService } from 'src/app/services/highlight.service';
import { ProjectDetailModalUtility } from 'src/app/utils/project-detail-modal.util';

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

  public currentHighlightIndex: number = 0;

  /**
   * Boolean to determine whether the component is loading the information from the api.
   */
  public highlightsLoading = true;
  public animationPaused: boolean = false;

  constructor(private router: Router,
              private projectService: HighlightService,
              private fileRetrieverService: FileRetrieverService,
              private projectDetailModalUtility: ProjectDetailModalUtility) { }


  ngOnInit(): void {
    this.projectService
        .getAll()
        .pipe(finalize(() => (this.highlightsLoading = false)))
        .subscribe((result) => {
          this.highlights = this.pickRandomHighlights(result, 6);
        });
  }

  /**
   * Method to get the url of the icon of the project. This is retrieved
   * from the file retriever service
   */
  public getIconUrl(id: number): SafeUrl {
    const foundProject = this.highlights.find(highlight => highlight.project.id === id)?.project;
    return this.fileRetrieverService.getIconUrl(foundProject.projectIcon);
  }

  public viewAllProjects() {

    this.router.navigate(['project/overview']);
  }

  public viewAddProject() {
    this.router.navigate(['project/add/']);
  }

  private pickRandomHighlights(highlights: Highlight[], amount: number) {
    return [...highlights].sort(() => 0.5 - Math.random()).slice(0, amount);
  }

  /**
   * Triggers on project click in the list.
   * @param id project id.
   * @param name project name
   */
  public onClickHighlightedProject(id: number, name: string): void {
    this.projectDetailModalUtility.openProjectModal(id, name, '/home');
  }

  public getHighlightImageByUrl(highlight: Highlight) {
    return this.fileRetrieverService.getIconUrl(highlight.image);
  }

  public setCurrentHighlight($event: number) {
    this.currentHighlightIndex = $event;
  }

  public setActiveSlide(index: number) {
    this.animationPaused = true;
    this.currentHighlightIndex = index;
  }

  public continueSlides(event) {
    //this is the original element the event handler was assigned to
    let e = event.toElement || event.relatedTarget;
    if (e.parentNode == this || e == this) {
      return;
    }
    this.animationPaused = false;
  }
}
