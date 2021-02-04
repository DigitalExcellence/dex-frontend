/*
 *
 *  Digital Excellence Copyright (C) 2020 Brend Smits
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU Lesser General Public License as published
 *   by the Free Software Foundation version 3 of the License.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty
 *   of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *   See the GNU Lesser General Public License for more details.
 *
 *   You can find a copy of the GNU Lesser General Public License
 *   along with this program, in the LICENSE.md file in the root project directory.
 *   If not, see https://www.gnu.org/licenses/lgpl-3.0.txt
 *
 */

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
