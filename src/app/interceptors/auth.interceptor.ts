import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

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
