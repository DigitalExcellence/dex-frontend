import { Component, Input, OnInit } from '@angular/core';
import { Collaborator } from 'src/app/models/domain/collaborator';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-collaborator',
  templateUrl: './collaborator.component.html',
  styleUrls: ['./collaborator.component.scss']
})
export class CollaboratorComponent implements OnInit {

  @Input() collaborator: Collaborator;

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Method that is called when a user clicks the follow button on a collaborator
   * This functionality is not implemented YET
   */
  public onFollowClick(projectId: number) {
    // TODO: Implement this function when following users is added to the backend
  }

  /**
   * Check whether the the application is running in production mode
   * So we can hide the items that are not implemented yet
   */
  public isProduction(): boolean {
    return !environment.production;
  }

}
