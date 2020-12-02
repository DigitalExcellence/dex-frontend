import { Component, Input, OnInit } from '@angular/core';
import { Collaborator } from 'src/app/models/domain/collaborator';
import { environment } from 'src/environments/environment';

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

  public isProduction(): boolean {
    return !environment.production;
  }

}
