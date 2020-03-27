import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/domain/project';
import { ProjectService } from 'src/app/services/project.service';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

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
  public loading = true;

  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
    this.projectService.getAll()
      .pipe(finalize(() => this.loading = false))
      .subscribe(result => {
        this.projects = result;
      }, (error: HttpErrorResponse) => {
        if (error.status !== 404) {
          console.log('Could not retrieve the projects');
        }
      });
  }

  public projectsEmpty(): boolean {
    return this.projects.length < 1;
  }

}
