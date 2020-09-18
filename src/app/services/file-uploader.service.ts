import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api-config';

@Injectable({
  providedIn: 'root'
})
export class FileUploaderService {
  protected readonly url: string = API_CONFIG.url + API_CONFIG.uploadFileRoute;

  constructor(
    private http: HttpClient) { }

  public uploadFile(formdata: FormData): Observable<any> {
    return this.http.post<string>(this.url, formdata, {
      reportProgress: true,
      observe: 'events'
    })
  }
}
