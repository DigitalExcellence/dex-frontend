import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SafeUrl } from '@angular/platform-browser';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Highlight } from 'src/app/models/domain/highlight';
import { Project } from 'src/app/models/domain/project';
import { FileRetrieverService } from 'src/app/services/file-retriever.service';
import { HighlightService } from 'src/app/services/highlight.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { DetailsComponent } from 'src/app/modules/project/details/details.component';
import { SEOService } from 'src/app/services/seo.service';
import { Location } from '@angular/common';


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

  private modalRef: BsModalRef;
  private modalSubscriptions: Subscription[] = [];

  constructor(private router: Router,
              private projectService: HighlightService,
              private fileRetrieverService: FileRetrieverService,
              private modalService: BsModalService,
              private location: Location,
              private seoService: SEOService) { }


  ngOnInit(): void {
    this.projectService
        .getAll()
        .pipe(finalize(() => (this.highlightsLoading = false)))
        .subscribe((result) => {
          this.highlights = this.pickRandomHighlights(result, 3);
        });
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
    name = name.split(' ').join('-');

    this.createProjectModal(id);
    this.location.replaceState(`/project/details/${id}-${name}`);
  }

  /**
   * Method to open the modal for a projects detail
   * @param projectId the id of the project that should be shown.
   * @param activeTab Define the active tab
   */
  private createProjectModal(projectId: number, activeTab: string = 'description') {
    const initialState = {
      projectId: projectId,
      activeTab: activeTab
    };

    if (projectId) {
      this.modalRef = this.modalService.show(DetailsComponent, {animated: true, initialState});
      this.modalRef.setClass('project-modal');

      // Go back to home page after the modal is closed
      this.modalSubscriptions.push(
          this.modalService.onHide.subscribe(() => {
                if (this.location.path().startsWith('/project/details')) {
                  this.location.replaceState('/home');
                  this.updateSEOTags();
                }
              }
          ));
    }
  }

  /**
   * Methods to update the title and description through the SEO service
   */
  private updateSEOTags() {
    // Updates meta and title tags
    this.seoService.updateTitle('Digital Excellence');
    this.seoService.updateDescription('Dex homepage');
  }
}
