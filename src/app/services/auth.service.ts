/*
 *
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
 *
 */

import { Injectable } from "@angular/core";
import { User, UserManager, UserManagerSettings } from "oidc-client";
import { User as BackendUser } from "src/app/models/domain/user";
import { Observable } from "rxjs";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "src/app/config/api-config";
import { Role } from "src/app/models/domain/role";

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
  private Backenduser: BackendUser | null;

  protected http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;

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
    this.Backenduser = await this.getBackendUser();
    this._authNavStatusSource.next(this.isAuthenticated());
  }

  public async getBackendUser(): Promise<BackendUser>{
      return this.http.get<BackendUser>(`${API_CONFIG.url}User`).toPromise();
  }
  public getCurrentRole(): Role{
    if(this.Backenduser == null){
      return null;
    }
    return this.Backenduser.role;
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
    scope: "openid profile email dex-api",
    filterProtocolClaims: true,
    loadUserInfo: true,
    automaticSilentRenew: true,
    silent_redirect_uri: environment.identitySilentRedirectUri,
  };
}
