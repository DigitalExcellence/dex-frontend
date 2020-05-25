import { Project } from 'src/app/models/domain/project';
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../config/api-config";
import { EmbeddedProject } from 'src/app/models/domain/embedded-project';
import { EmbeddedProjectResource } from 'src/app/models/resources/embedded-project-resource';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmbedService {
  protected http: HttpClient;
  protected readonly url: string = API_CONFIG.url + API_CONFIG.embeddedProjectRoute;

  constructor(http: HttpClient) {
    this.http = http;
  }
  public getEmbed(id: string): Observable<Project> {
    return this.http.get<Project>(`${API_CONFIG.url + API_CONFIG.embeddedProjectRoute}/${id}`);
  }
  public post(object: EmbeddedProjectResource): Observable<EmbeddedProject> {
    return this.http.post<EmbeddedProject>(`${this.url}`, object);
  }
}
