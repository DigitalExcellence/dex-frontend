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

import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

/**
 * Base Service which other services can implement to gain all standard API CRUD functionality.
 */
export abstract class HttpBaseService<T, TPost, TUpdate> {
  constructor(protected http: HttpClient, protected readonly url: string) {}

  public getAll(): Observable<T[]> {
    return this.http.get<T[]>(`${this.url}`);
  }

  public get(id: number): Observable<T> {
    return this.http.get<T>(`${this.url}/${id}`);
  }

  public post(object: TPost): Observable<T> {
    return this.http.post<T>(`${this.url}`, object);
  }

  public put(id: number, object: TUpdate): Observable<{}> {
    return this.http.put<T>(`${this.url}/${id}`, object);
  }

  public delete(id: number): Observable<{}> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
