import { Project } from 'src/app/models/domain/project';
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../config/api-config";
import { HttpBaseService } from "./http-base.service";
import { EmbeddedProject } from './../models/domain/embedded-project';

import { EmbeddedProjectResource } from './../models/resources/embedded-project-resource';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmbedService extends HttpBaseService<EmbeddedProject,EmbeddedProjectResource,null> {

  constructor(http: HttpClient) {
    super(http, API_CONFIG.url + API_CONFIG.embeddedProjectRoute);
  }
  public getEmbed(id: string): Observable<Project> {
    return this.http.get<Project>(`${API_CONFIG.url + API_CONFIG.embeddedProjectRoute}/${id}`);
  }
  
}
