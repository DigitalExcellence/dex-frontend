import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/domain/project';
import { ProjectService } from 'src/app/services/project.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/models/domain/user';
import { Router } from '@angular/router';
import { Collaborator } from 'src/app/models/domain/collaborator';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  public projects: Project[];

  constructor(
    private router: Router,
    private projectService: ProjectService) { }

  ngOnInit(): void {
    this.projectService.getAll().subscribe(result => {
      this.projects = result;
    }, (error: HttpErrorResponse) => {
      if (error.status !== 404) {
        console.log('Could not retrieve the projects');
      }
    });
  }

  public onProjectClick(id: number): void {
    this.router.navigate([`/project/details/${id}`]);
  }
}
