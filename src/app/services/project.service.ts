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

import { AuthService } from './auth.service';
import { HttpBaseService } from './http-base.service';

import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { API_CONFIG } from 'src/app/config/api-config';
import { CallToActionIconsConfig } from 'src/app/config/call-to-action-icons-config';
import { Project } from 'src/app/models/domain/project';
import { ProjectAdd } from 'src/app/models/resources/project-add';
import { ProjectUpdate } from 'src/app/models/resources/project-update';

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends HttpBaseService<Project, ProjectAdd, ProjectUpdate> {
  constructor(http: HttpClient, private authService: AuthService) {
    super(http, API_CONFIG.url + API_CONFIG.projectRoute);
  }

  public get(id: number): Observable<Project> {
    return super.get(id)
      .pipe(
        map(project => {
          return {
            ...project,
            callToActions: project.callToActions.length > 0 ?
              project.callToActions.map(cta => ({
                ...cta,
                iconName: CallToActionIconsConfig[cta.optionValue.toLowerCase()]
              })
              )
              : undefined
          };
        }),
        mergeMap(project =>
          from(this.addLikes(project))
        ));
  }

  public initiateTransferProjectOwnership(projectId: number, potentialNewOwnerUserEmail: string): Observable<any> {
    return this.http.post(`${this.url}/transfer/${projectId}`, '',
      {responseType: 'text', params: {potentialNewOwnerUserEmail: potentialNewOwnerUserEmail}}
    );
  }

  public processTransferProjectOwnership(transferGuid: string, isOwnerMail: boolean, acceptedRequest: boolean): Observable<any> {
    return this.http.get(`${this.url}/transfer/process/${transferGuid}/${isOwnerMail}/${acceptedRequest}`, {responseType: 'text', observe: 'response'});
  }

  public checkProjectHasTransferRequest(projectId: number): Observable<any> {
    return this.http.get(`${this.url}/transfer/check/${projectId}`);
  }

  public deleteTransferRequest(transferGuid: string): Observable<any> {
    return this.http.delete(`${this.url}/transfer/${transferGuid}`, {responseType: 'text'});
  }

  private addLikes(project: any): Promise<Project> {
    return this.authService.getBackendUser()
      .then(currentUser => {
        project.likeCount = project.likes?.length ? project.likes.length : 0;
        project.userHasLikedProject = project.likes.filter(like => like.userId === currentUser?.id).length > 0;
        return project;
      });
  }
}
