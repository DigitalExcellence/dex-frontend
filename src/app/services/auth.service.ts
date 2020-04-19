import { Injectable } from "@angular/core";
import { UserManager, UserManagerSettings, User } from "oidc-client";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  // Observable navItem source
  private _authNavStatusSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // Observable navItem stream
  authNavStatus$: Observable<boolean> = this._authNavStatusSource.asObservable();

  private manager: UserManager = new UserManager(getClientSettings());
  private user: User | null;

  constructor() {
    this.manager.getUser().then((user) => {
      this.user = user;
      this._authNavStatusSource.next(this.isAuthenticated());
    });
  }

  public login(): Promise<void> {
    return this.manager.signinRedirect();
  }

  public async completeAuthentication() {
    this.user = await this.manager.signinRedirectCallback();
    this._authNavStatusSource.next(this.isAuthenticated());
  }

  public isAuthenticated(): boolean {
    return this.user != null && !this.user.expired;
  }

  public get authorizationHeaderValue(): string {
    if (this) return `${this.user.token_type} ${this.user.access_token}`;
  }

  public get name(): string {
    if (this.user == null) {
      return "";
    } else {
      return this.user.profile.name;
    }
  }

  public async signout(): Promise<void> {
    await this.manager.signoutRedirect();
  }
}

export function getClientSettings(): UserManagerSettings {
  return {
    authority: environment.identityServerUrl,
    client_id: environment.identityClientId,
    redirect_uri: environment.identityRedirectUri,
    post_logout_redirect_uri: environment.identityLogoutRedirectUri,
    response_type: "id_token token",
    scope: "openid profile ProjectRead ProjectWrite UserRead UserWrite HighlightRead HighlightWrite",
    filterProtocolClaims: true,
    loadUserInfo: true,
    automaticSilentRenew: true,
    silent_redirect_uri: environment.identitySilentRedirectUri,
  };
}
