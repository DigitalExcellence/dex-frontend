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
import { Project } from 'src/app/models/domain/project';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from 'src/app/config/api-config';
import { EmbeddedProject } from 'src/app/models/domain/embedded-project';
import { EmbeddedProjectResource } from 'src/app/models/resources/embedded-project-resource';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmbedService {
  protected http: HttpClient;
  protected readonly url: string = API_CONFIG.url + API_CONFIG.embeddedProjectRoute;

  constructor(http: HttpClient) {
    this.http = http;
  }
  public getEmbed(id: string): Observable<Project> {
    return this.http.get<Project>(`${API_CONFIG.url + API_CONFIG.embeddedProjectRoute}/${id}`);
  }
  public post(object: EmbeddedProjectResource): Observable<EmbeddedProject> {
    return this.http.post<EmbeddedProject>(`${this.url}`, object);
  }
}
