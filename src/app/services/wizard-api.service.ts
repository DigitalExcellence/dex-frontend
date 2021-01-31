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
import { HttpClient, HttpParams } from '@angular/common/http';
import { GenericWizard } from './interfaces/generic-wizard';
import { Injectable } from '@angular/core';
import { API_CONFIG } from 'src/app/config/api-config';
import { Observable } from 'rxjs';
import { MappedProject } from 'src/app/models/internal/mapped-project';

/**
 * Service to fetch a repo from api.
 * Used for sources which can only be fetches from api instead of the frontend.
 */
@Injectable({
  providedIn: 'root'
})
export class WizardApiService implements GenericWizard {

  private readonly url = `${API_CONFIG.url}${API_CONFIG.wizardRoute}`;

  constructor(
    private httpClient: HttpClient
  ) { }

  public fetchProjectDetails(uri: string): Observable<MappedProject> {
    const queryParams = new HttpParams().set('sourceUri', uri);
    return this.httpClient.get<MappedProject>(this.url, { params: queryParams });
  }
}
