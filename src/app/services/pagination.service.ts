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
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { mergeMap } from 'rxjs/operators';
import { API_CONFIG } from 'src/app/config/api-config';
import { from, Observable } from 'rxjs';
import { SearchResultsResource } from 'src/app/models/resources/search-results';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  protected http: HttpClient;
  protected readonly url: string = API_CONFIG.url + API_CONFIG.projectRoute;

  constructor(http: HttpClient, private authService: AuthService) {
    this.http = http;
  }

  // public getProjectsPaginated(page: number, amountOnPage: number): Observable<Pagination> {
  //   return this.http.get<Pagination>(`${this.url}` + '?page=' + `${page}` + '&amountOnPage=' + `${amountOnPage}`);
  // }

  public getProjectsPaginated(internalSearchQuery: InternalSearchQuery): Observable<SearchResultsResource> {
    // return this.http.get<SearchResultsResource>(`${API_CONFIG.url}${API_CONFIG.internalSearchRoute}/${internalSearchQuery?.query}'`);
    let url = this.url;
    let params = '';
    for (const key of Object.keys(internalSearchQuery)) {
      if (internalSearchQuery[key] == null) {
        continue;
      }

      if (params === '') {
        params += `${key}=${internalSearchQuery[key]}`;
        continue;
      }
      params += `&${key}=${internalSearchQuery[key]}`;
    }

    if (params !== '') {
      url += `?${params}`;
    }

    return this.http.get<SearchResultsResource>(url)
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
