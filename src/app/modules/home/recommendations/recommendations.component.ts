/*
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
 */

import { Component, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { finalize } from 'rxjs/operators';
import { Project } from 'src/app/models/domain/project';
import { AuthService } from 'src/app/services/auth.service';
import { FileRetrieverService } from 'src/app/services/file-retriever.service';
import { RecommendationService } from 'src/app/services/recommendation.service';
import { ProjectDetailModalUtility } from 'src/app/utils/project-detail-modal.util';

@Component({
  selector: 'app-recommended-project-cards',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss'],
})
export class RecommendationCardsComponent implements OnInit {

  public isAuthenticated: boolean;

  /**
   * Array to receive and store the projects from the api.
   */
  public recommendations: Project[] = [];

  /**
   * Boolean to determine whether the component is loading the information from the api.
   */
  public recommendationsLoading = true;

  constructor(private recommendationService: RecommendationService,
    private fileRetrieverService: FileRetrieverService,
    private modalUtility: ProjectDetailModalUtility,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.authNavStatus$.subscribe((status) => {
      this.isAuthenticated = status;
      if (status) {
        this.recommendationService.getRecommendations(8)
          .pipe(finalize(() => (this.recommendationsLoading = false)))
          .subscribe((result) => {
            this.recommendations = result;
          });
      }
    });
  }

  /**
* Triggers on project click in the list.
* @param id project id.
* @param name project name
*/
  public onClickRecommendedProject(id: number, name: string): void {
    name = name.split(' ').join('-');
    this.modalUtility.openProjectModal(id, name, '/home');
  }

  /**
   * Method to get the url of the icon of the project. This is retrieved
   * from the file retriever service
   */
  public getIconUrl(project: Project): SafeUrl {
    return this.fileRetrieverService.getIconUrl(project.projectIcon);
  }


}