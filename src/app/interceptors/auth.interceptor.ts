import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public auth: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.auth.isAuthenticated) {
      request = request.clone({
        setHeaders: {
          Authorization: `${this.auth.authorizationHeaderValue}`,
        },
      });
    }
    return next.handle(request).pipe(
      map((event: any) => {
        if (event instanceof HttpErrorResponse) {
          if (event.status === 401) {
            this.router.navigate(["/account/login"]);
          }
        }
        return event;
      })
    );
  }
}
