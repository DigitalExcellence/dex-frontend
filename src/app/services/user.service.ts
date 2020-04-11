import { Injectable } from '@angular/core';
import { HttpBaseService } from './http-base.service';
import { User } from '../models/domain/user';
import { UserAdd } from '../models/resources/user-add';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../config/api-config';

@Injectable({
  providedIn: 'root'
})
export class UserService extends HttpBaseService<User, UserAdd, User> {

  constructor(http: HttpClient) {
    super(http, API_CONFIG.url + API_CONFIG.userRoute);
  }
}
