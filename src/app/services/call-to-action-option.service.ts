/*
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
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api-config';
import { CallToActionOption } from '../models/domain/call-to-action-option';
import { CallToActionOptionAdd } from '../models/resources/calltoaction-add';
import { CallToActionOptionUpdate } from '../models/resources/calltoaction-update';
import { HttpBaseService } from './http-base.service';

@Injectable({
  providedIn: 'root'
})
export class CallToActionOptionService extends HttpBaseService<CallToActionOption, CallToActionOptionAdd, CallToActionOptionUpdate> {
    constructor(http: HttpClient) {
      super(http, API_CONFIG.url + API_CONFIG.callToActionOptionRoute);
    }
  }
