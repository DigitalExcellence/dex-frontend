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
import { ELASTIC_CONFIG } from '../config/elastic-config';
import { ElasticSearchResults } from './../models/resources/elasticsearch-results';

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

    private credentials = btoa(`${ELASTIC_CONFIG.username}:${ELASTIC_CONFIG.password}`);

    async getAutocompletedSearchResults(searchQuery) {
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

        var tempresults: ElasticSearchResults[] = [];

        this.previousRequest = this.http.post(this.elasticUrl + ELASTIC_CONFIG.searchurl, body, options).subscribe(response => {
            response["hits"]["hits"].forEach(element => {
                console.log()
                tempresults.push({
                    id: element._id,
                    projectName: element._source.ProjectName,
                    description: element._source.Description,
                    created: element._source.Created
                })
            });
        })
        await this.previousRequest;
        return tempresults;
    }

    getAllSearchResults() {

    }



}