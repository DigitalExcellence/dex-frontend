import { Injectable } from '@angular/core';
import { HttpBaseService } from './http-base.service';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../config/api-config';
import { ProjectCategory } from '../models/domain/projectCategory';
import { ProjectCategoryAdd } from '../models/resources/project-category-add';
import { ProjectCategoryUpdate } from '../models/resources/project-category-update';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends HttpBaseService<ProjectCategory, ProjectCategoryAdd, ProjectCategoryUpdate> {
  constructor(http: HttpClient) {
    super(http, API_CONFIG.url + API_CONFIG.categoryRoute);
  }
}
