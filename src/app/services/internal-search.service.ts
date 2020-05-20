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
import { InternalSearchQuery } from './../models/resources/internal-search-query';
import { Injectable } from '@angular/core';
import { SearchResultsResource } from '../models/resources/search-results';
import { API_CONFIG } from '../config/api-config';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

/**
 * Service to communicate with the InteralSearchEndpoint of the API.
 */
@Injectable({
  providedIn: 'root',
})
export class InternalSearchService {
  constructor(private http: HttpClient) {
  }

  /**
   * Method to get the SearchResults for projects based on an InternalSearchQuery.
   * @param internalSearchQuery the query to search the projects with.
   */
  get(internalSearchQuery: InternalSearchQuery): Observable<SearchResultsResource> {
    return this.http.get<SearchResultsResource>(`${API_CONFIG.url}${API_CONFIG.internalSearchRoute}/${internalSearchQuery.query}`);
  }

}
