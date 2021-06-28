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
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RESOURCE_CONFIG } from 'src/app/config/resource-config';
import { UploadFile } from 'src/app/models/domain/uploadFile';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from 'src/app/config/api-config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileRetrieverService {
  protected readonly url: string = API_CONFIG.url + API_CONFIG.uploadFileRoute;

  constructor(
      private sanitizer: DomSanitizer,
      private http: HttpClient
  ) {}

  /**
   * Method to get the url of the icon of the project. This urls can be the local
   * image for a default or a specified icon stored on the server.
   * @param file retrieving the icon url of the specified file.
   */
  public getIconUrl(file: UploadFile): SafeUrl {
    if (file != null) {
      return this.sanitizer.sanitize(4, RESOURCE_CONFIG.url + file.path);
    }
    return 'assets/images/placeholder.png';
  }

  public getIconById(fileId: number): Observable<UploadFile> {
    return this.http.get<UploadFile>(`${this.url}/${fileId}`);
  }
}
