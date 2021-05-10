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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from 'src/app/config/api-config';
import { UploadFile } from 'src/app/models/domain/uploadFile';

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
