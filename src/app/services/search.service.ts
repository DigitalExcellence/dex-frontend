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
import { Observable } from 'rxjs';
import { API_CONFIG } from 'src/app/config/api-config';
import { AutoCompleteSearchResult } from 'src/app/models/resources/autocomplete-search-result';

/**
 * Service to retrieve autocompleted project suggestions based on typed.
 */
@Injectable({
  providedIn: 'root',
})
export class SearchService {

  protected readonly url = API_CONFIG.url + API_CONFIG.autoCompleteRoute;

  constructor(private http: HttpClient) {}

  public getAutocompletedSearchResults(searchQuery): Observable<Array<AutoCompleteSearchResult>> {
    return this.http.get<Array<AutoCompleteSearchResult>>(this.url, {params: {query: searchQuery}});
  }

}
