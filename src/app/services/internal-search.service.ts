import { InternalSearchQuery } from './../models/resources/internal-search-query';
import { Injectable } from "@angular/core";
import { SearchResults } from '../models/domain/search-results';
import { API_CONFIG } from '../config/api-config';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

/**
 * Service to communicate with the InteralSearchEndpoint of the API.
 */
@Injectable({
  providedIn: "root",
})
export class InternalSearchService {
  constructor(private http: HttpClient) {
  }

  /**
   * Method to get the SearchResults for projects based on an InternalSearchQuery.
   * @param internalSearchQuery the query to search the projects with.
   */
  get(internalSearchQuery: InternalSearchQuery): Observable<SearchResults> {
    return this.http.get<SearchResults>(`${API_CONFIG.url}${API_CONFIG.internalSearchRoute}/${internalSearchQuery.query}`);
  }

}
