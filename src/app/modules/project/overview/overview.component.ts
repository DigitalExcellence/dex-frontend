import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/domain/project';
import { ProjectService } from 'src/app/services/project.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/models/domain/user';
import { Router } from '@angular/router';
import { Collaborator } from 'src/app/models/domain/collaborator';
import { finalize } from 'rxjs/operators';

/**
 * Overview of all the projects
 */
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  /**
   * Array to receive and store the projects from the api.
   */
  public projects: Project[] = [];

  /**
   * Boolean to determine whether the component is loading the information from the api.
   */
  public projectsLoading = true;

  constructor(
    private router: Router,
    private projectService: ProjectService) { }

  ngOnInit(): void {
    this.projectService.getAll()
      .pipe(finalize(() => this.projectsLoading = false))
      .subscribe(result => {
        this.projects = result;
      }, (error: HttpErrorResponse) => {
        if (error.status !== 404) {
          console.log('Could not retrieve the projects');
        }
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
