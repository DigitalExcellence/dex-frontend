import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/domain/project';
import { ProjectService } from 'src/app/services/project.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/models/domain/user';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  public projects: Project[];

  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
    this.projects = [];
    const tempUser: User = {
      id: 1,
      profileUrl: '',
      username: 'Kasper Hämäläinen'
    };

    const project: Project = {
      id: 0,
      name: 'FEEL THE SPARK - GLOW 2018',
      shortDescription: 'Etiam rhoncus maecenas tempus tellus eget condimentum rhoncus.',
      description: 'Etiam rhoncus maecenas tempus tellus eget condimentum rhoncus.',
      createdDate: new Date('2018-11-20'),
      url: '',
      user: tempUser,
      contributors: null
    };
    for (let index = 0; index < 10; index++) {
      project.id++;
      this.projects.push(project);
    }

    // this.projectService.getAll().subscribe(result => {
    //   this.projects = result;
    // }, (error: HttpErrorResponse) => {
    //   if (error.status !== 404) {
    //     console.log('Could not retrieve the projects');
    //   }
    // });
  }

}
