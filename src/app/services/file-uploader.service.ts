import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api-config';
import { UploadFile } from '../models/domain/uploadFile';
import { Error } from 'tslint/lib/error';

@Injectable({
  providedIn: 'root'
})
export class FileUploaderService {
  protected readonly url: string = API_CONFIG.url + API_CONFIG.uploadFileRoute;

  constructor(
    private http: HttpClient) { }

  private static buildFormData(file): FormData {
    // Build a form data object and add the fileData
    const formData = new FormData();
    formData.append('File', file);
    return formData;
  }

  public uploadFile(file: UploadFile): Observable<any> {
    const formData: FormData = FileUploaderService.buildFormData(file);
    return this.http.post(this.url, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
