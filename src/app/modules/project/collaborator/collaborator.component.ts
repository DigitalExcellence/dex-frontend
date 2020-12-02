import { Component, Input, OnInit } from '@angular/core';
import { Collaborator } from '../../../models/domain/collaborator';

@Component({
  selector: 'app-collaborator',
  templateUrl: './collaborator.component.html',
  styleUrls: ['./collaborator.component.scss']
})
export class CollaboratorComponent implements OnInit {

  @Input() collaborator:Collaborator

  constructor() { }

  ngOnInit(): void {
  }

  public onFollowClick(projectId:number) {

  }

}
