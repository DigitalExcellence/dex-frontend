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

import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { resolve } from 'dns';
import { API_CONFIG } from '../config/api-config';
import { ELASTIC_CONFIG } from '../config/elastic-config';

/**
 * Service to communicate with ElasticSearch.
 */
@Injectable({
    providedIn: 'root',
})
export class SearchService {

    private readonly elasticUrl = `${ELASTIC_CONFIG.url}/`;
    private readonly apiUrl = `${API_CONFIG.url}${API_CONFIG.internalSearchRoute}/`;
    private previousRequest;

    constructor(private http: HttpClient) {

    }

    private credentials = btoa("elastic:changeme");

    getAutocompletedSearchResults(searchQuery) {
        if (this.previousRequest != null) {
            this.previousRequest.unsubscribe();
        }

        var body = {
            "query": {
                "match": {
                    "ProjectName": {
                        "query": searchQuery
                    }
                }
            }
        }
        var options = {
            headers: {
                "Authorization": "Basic " + this.credentials,
                "Content-Type": "application/json"
            }
        }

        this.previousRequest = this.http.post(this.elasticUrl + "projectkeywords5/_search", body, options).subscribe(response => {
            console.log(response)
        })
    }

    getAllSearchResults() {

    }



}