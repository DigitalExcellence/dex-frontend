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
import { API_CONFIG } from '../config/api-config';
import { AutoCompleteSearchResult } from '../models/resources/autocomplete-search-result';

/**
 * Service to retrieve autocompleted project suggestions based on typed.
 */
@Injectable({
  providedIn: 'root',
})
export class SearchService {

  protected readonly url = API_CONFIG.url + API_CONFIG.autoCompleteRoute;

  private previousRequest = null;

  constructor(private http: HttpClient) {}

  async getAutocompletedSearchResults(searchQuery) {
    let results: AutoCompleteSearchResult[] = [];

    if (searchQuery.length > 1) {
      if (this.previousRequest != null) {
        this.previousRequest.unsubscribe();
      }

      this.previousRequest = this.http.get<Array<AutoCompleteSearchResult>>(this.url, {params: {query: searchQuery}})
          .subscribe(response => {
            response.forEach(element => {
              results.push({
                id: element.id,
                name: element.name,
                projectIcon: element.projectIcon
              })
            });
          });
      await this.previousRequest;
    }
    return results;
  }

}
