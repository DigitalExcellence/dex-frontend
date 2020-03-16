import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

/**
 * Base Service which other services can implement to gain all standard API CRUD functionality.
 */
export abstract class HttpBaseService<T, TPost, TUpdate> {
  constructor(
    protected http: HttpClient,
    protected readonly url: string) { }

  public getAll(): Observable<T[]> {
    return this.http.get<T[]>(`${this.url}`);
  }

  public get(id: number): Observable<T> {
    return this.http.get<T>(`${this.url}/${id}`);
  }

  public post(object: TPost): Observable<T> {
    return this.http.post<T>(`${this.url}`, object);
  }

  public put(object: TUpdate): Observable<{}> {
    return this.http.put<T>(`${this.url}`, object);
  }

  public delete(id: number): Observable<{}> {
    return this.http.delete(`${this.url}/${id}`);
  }

}