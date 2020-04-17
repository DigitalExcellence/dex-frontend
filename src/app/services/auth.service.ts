import { Injectable } from "@angular/core";
import { UserManager, UserManagerSettings, User } from "oidc-client";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { catchError } from "rxjs/internal/operators/catchError";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  // Observable navItem source
  private _authNavStatusSource: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);
  // Observable navItem stream
  authNavStatus$ = this._authNavStatusSource.asObservable();

  private manager: UserManager = new UserManager(getClientSettings());
  private user: User | null;

  constructor(private http: HttpClient) {
    this.manager.getUser().then((user) => {
      this.user = user;
      this._authNavStatusSource.next(this.isAuthenticated());
    });
  }

  public login() {
    return this.manager.signinRedirect();
  }

  public async completeAuthentication() {
    this.user = await this.manager.signinRedirectCallback();
    this._authNavStatusSource.next(this.isAuthenticated());
  }

  private isAuthenticated(): boolean {
    return this.user != null && !this.user.expired;
  }

  public get authorizationHeaderValue(): string {
    return `${this.user.token_type} ${this.user.access_token}`;
  }

  public get name(): string {
    return this.user != null ? this.user.profile.name : "";
  }

  public async signout() {
    await this.manager.signoutRedirect();
  }
}
// TODO: Convert this to valuables from config / environment file
export function getClientSettings(): UserManagerSettings {
  return {
    authority: "https://localhost:5005",
    client_id: "dex-frontend",
    redirect_uri: "http://localhost:4200/auth-callback",
    post_logout_redirect_uri: "http://localhost:4200/",
    response_type: "id_token token",
    scope:
      "openid ProjectRead ProjectWrite UserRead UserWrite HighlightRead HighlightWrite",
    filterProtocolClaims: true,
    loadUserInfo: true,
    automaticSilentRenew: true,
    silent_redirect_uri: "http://localhost:4200/silent-refresh.html",
  };
}
