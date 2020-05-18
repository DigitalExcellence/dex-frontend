import { InternalSearchQuery } from './../models/resources/internal-search-query';
import { Injectable } from "@angular/core";
import { SearchResults } from '../models/domain/search-results';
import { API_CONFIG } from '../config/api-config';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: "root",
})
export class InternalSearchService {
  constructor(private http: HttpClient) {
  }

  get(internalSearchQuery: InternalSearchQuery): Observable<SearchResults> {
    return this.http.get<SearchResults>(`${API_CONFIG.url}${API_CONFIG.internalSearchRoute}/${internalSearchQuery.query}`);
  }

}
