import { Project } from '../../../../models/domain/project';
import { DetailsComponent } from '../../details/details.component';

import { Location } from '@angular/common';
import { AfterContentChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProjectDetailModalUtility } from 'src/app/utils/project-detail-modal.util';


@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit, AfterContentChecked {
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


  constructor(private modalUtility: ProjectDetailModalUtility,
              private changeDetector: ChangeDetectorRef) {
    this.searchControl = new FormControl('');
  }

  ngOnInit(): void {
    this.searchControl.valueChanges.subscribe((value) => this.searchInputChanged.emit(value));
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  /**
   * Checks whether there are any projects
   */
  public projectsEmpty(): boolean {
    return !this.filteredProjects || this.filteredProjects.length < 1;
  }

  public filtertTag(event) {
    console.log(event);
  }

  /**
   * Triggers on project click in the list.
   * @param event click event
   * @param project the project that was clicked
   */
  public onClickProject(event: Event, project: Project): void {
    this.projectClicked.emit(project);
    const projectId = project.id;
    const projectName = project.name;

    const clickedSection = event.target as Element;

    if (clickedSection.classList.contains('project-collaborators')) {
      this.modalUtility.openProjectModal(projectId, projectName, '/project/overview', 'collaborators');
    } else {
      this.modalUtility.openProjectModal(projectId, projectName, 'project/overview');
    }
    this.modalUtility.subscribeToLikes(projectId, this.filteredProjects);
  }
}

