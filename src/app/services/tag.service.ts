import { HttpBaseService } from './http-base.service';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONFIG } from 'src/app/config/api-config';
import { ProjectTag } from 'src/app/models/domain/projectTag';
import { ProjectTagAdd } from 'src/app/models/resources/project-tag-add';
import { ProjectTagUpdate } from 'src/app/models/resources/project-tag-update';

@Injectable({
  providedIn: 'root'
})
export class TagService extends HttpBaseService<ProjectTag, ProjectTagAdd, ProjectTagUpdate> {
  constructor(http: HttpClient) {
    super(http, API_CONFIG.url + API_CONFIG.tagRoute);
  }
}
