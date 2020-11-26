import { Component, Input, OnInit } from '@angular/core';
import { Project } from 'src/app/models/domain/project';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  @Input() showListView: boolean;
  @Input() project: Project;

  constructor() { }

  ngOnInit(): void {
    console.log(this.project)
  }


}
