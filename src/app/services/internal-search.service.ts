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
import { InternalSearchQuery } from 'src/app/models/resources/internal-search-query';
import { Injectable } from '@angular/core';
import { SearchResultsResource } from 'src/app/models/resources/search-results';
import { API_CONFIG } from 'src/app/config/api-config';
import { from, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { mergeMap } from 'rxjs/operators';

/**
 * Service to communicate with the InteralSearchEndpoint of the API.
 */
@Injectable({
  providedIn: 'root',
})
export class InternalSearchService {

  private readonly url = `${API_CONFIG.url}${API_CONFIG.internalSearchRoute}/`;

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getSearchResultsPaginated(internalSearchQuery: InternalSearchQuery): Observable<SearchResultsResource> {
    let url = this.url + internalSearchQuery.query;
    let params = new HttpParams();
    for (const key of Object.keys(internalSearchQuery)) {
      if (internalSearchQuery[key] == null) {
        continue;
      }
      if (Array.isArray(internalSearchQuery[key])) {
        internalSearchQuery[key].forEach((item, index) => {
          params = params.append(key + '[' + index + ']', item);
        });
      } else {
        params = params.append(key, internalSearchQuery[key]);
      }
    }

    return this.http.get<SearchResultsResource>(url, {params})
        .pipe(
            mergeMap(result => from(
                this.addLikes(result)
            ))
        );
  }

  private addLikes(searchResult): Promise<SearchResultsResource> {
    return this.authService.getBackendUser()
        .then(currentUser => {
          searchResult.results.map(project => {
            project.likeCount = project.likes.length ? project.likes.length : 0;
            project.userHasLikedProject = project.likes.filter(like => like.userId === currentUser?.id).length > 0;
            return project;
          });
          return searchResult;
        });
  }
}
