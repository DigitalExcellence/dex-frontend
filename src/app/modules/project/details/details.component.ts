import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/domain/project';
import { User } from 'src/app/models/domain/user';
import { ProjectService } from 'src/app/services/project.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  public project: Project;

  constructor(
    private activedRoute: ActivatedRoute,
    private projectService: ProjectService) { }

  ngOnInit(): void {
    const routeId = this.activedRoute.snapshot.paramMap.get('id');
    if (!routeId) {
      return;
    }
    const id = Number(routeId);
    if (id < 1) {
      return;
    }

    this.projectService.get(id).subscribe(result => {
      this.project = result;
      console.log(this.project);
    }, (error: HttpErrorResponse) => {
      if (error.status !== 404) {
        console.log('Could not retrieve the project');
      }
    });
  }

}
