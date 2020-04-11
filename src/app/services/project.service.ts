import { Injectable } from '@angular/core';
import { HttpBaseService } from './http-base.service';
import { Project } from '../models/domain/project';
import { ProjectUpdate } from '../models/resources/project-update';
import { ProjectAdd } from '../models/resources/project-add';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../config/api-config';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends HttpBaseService<Project, ProjectAdd, ProjectUpdate> {

  constructor(http: HttpClient) {
    super(http, API_CONFIG.url + API_CONFIG.projectRoute);
  }
}
