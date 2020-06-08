import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api-config';
import { Observable } from 'rxjs';
import { Pagination } from '../models/domain/pagination';

@Injectable({
    providedIn: 'root'
  })
  export class PaginationService {
    protected http: HttpClient;
    protected readonly url: string = API_CONFIG.url + API_CONFIG.projectRoute;

    constructor(http: HttpClient) {
      this.http = http;
    }
    public getProjectsPaginated(page: number, amountOnPage: number): Observable<Pagination> {
      return this.http.get<Pagination>(`${this.url}` + '?page=' + `${page}` + '&amountOnPage=' + `${amountOnPage}`);
    }
  }
