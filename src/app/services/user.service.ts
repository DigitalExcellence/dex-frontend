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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONFIG } from 'src/app/config/api-config';
import { User } from 'src/app/models/domain/user';
import { UserAdd } from 'src/app/models/resources/user-add';
import { HttpBaseService } from './http-base.service';
import { from, Observable } from 'rxjs';
import { Project } from 'src/app/models/domain/project';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService extends HttpBaseService<User, UserAdd, User> {

  constructor(http: HttpClient) {
    super(http, API_CONFIG.url + API_CONFIG.userRoute);
  }

  public getCurrentUser(): Observable<User> {
    return this.http.get<User>(this.url);
  }

  public getProjectsFromUser(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.url}/projects`)
        .pipe(
        mergeMap(result => from(
            this.addLikes(result)
        ))
    );
  }

  private addLikes(projects): Promise<Project[]> {
    return new Promise(resolve => {
      this.getCurrentUser().subscribe(currentUser => {
        projects.map(project => {
          project.likeCount = project.likes.length ? project.likes.length : 0;
          project.userHasLikedProject = project.likes.filter(like => like.userId === currentUser?.id).length > 0;
          return project;
        });
        resolve(projects);
      });
    });
  }
}
