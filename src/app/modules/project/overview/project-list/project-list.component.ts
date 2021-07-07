import { Project } from '../../../../models/domain/project';
import { DetailsComponent } from '../../details/details.component';

import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  @Input() filteredProjects: Project[];
  @Input() projectsLoading: boolean;
  @Output() projectClicked = new EventEmitter<Project>();
  @Output() searchInputChanged = new EventEmitter<string>();
  @Output() modalClosed = new EventEmitter<null>();

  /**
   * FormControl for getting the input.
   */
  public searchControl: FormControl = null;

  /**
   * Determine whether we need to render a list or cart view
   */
  public showListView = false;

  /**
   * Store a reference to the modal and its subscriptions
   */
  private modalRef: BsModalRef;
  private modalSubscriptions: Subscription[] = [];

  constructor(private location: Location,
              private modalService: BsModalService) {
    this.searchControl = new FormControl('');
  }

  ngOnInit(): void {
    this.searchControl.valueChanges.subscribe((value) => this.searchInputChanged.emit(value));
  }

  /**
   * Checks whether there are any projects
   */
  public projectsEmpty(): boolean {
    return !this.filteredProjects || this.filteredProjects.length < 1;
  }

  /**
   * Triggers on project click in the list.
   * @param event click event
   * @param project the project that was clicked
   */
  public onClickProject(event: Event, project: Project): void {
    this.projectClicked.emit(project);
    const projectId = project.id;

    const clickedSection = event.target as Element;

    if (clickedSection.classList.contains('project-collaborators')) {
      this.createProjectModal(projectId, 'collaborators');
    } else {
      this.createProjectModal(projectId);
    }
  }

  /**
   * Method to open the modal for a projects detail
   * @param projectId the id of the project that should be shown.
   * @param activeTab Define the active tab
   */
  public createProjectModal(projectId: number, activeTab: string = 'description') {
    const initialState = {
      projectId: projectId,
      activeTab: activeTab
    };
    if (projectId) {
      this.modalRef = this.modalService.show(DetailsComponent, {animated: true, initialState});
      this.modalRef.setClass('project-modal');

      this.modalRef.content.onLike.subscribe(isLiked => {
        const projectIndexToUpdate = this.filteredProjects.findIndex(project => project.id === projectId);
        if (isLiked) {
          this.filteredProjects[projectIndexToUpdate].likeCount++;
          this.filteredProjects[projectIndexToUpdate].userHasLikedProject = true;
        } else {
          this.filteredProjects[projectIndexToUpdate].likeCount--;
          this.filteredProjects[projectIndexToUpdate].userHasLikedProject = false;
        }
      });

      // Go back to home page after the modal is closed
      this.modalSubscriptions.push(
          this.modalService.onHide.subscribe(() => {
            this.modalClosed.emit();
          })
      );
    }
  }
}
