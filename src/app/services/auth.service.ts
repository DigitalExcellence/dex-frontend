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

import { UserService } from './user.service';

import { Injectable } from '@angular/core';
import { User, UserManager, UserManagerSettings } from 'oidc-client';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { User as BackendUser } from 'src/app/models/domain/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // Observable containing the logged in user.
  public $user = new BehaviorSubject<BackendUser>(null);

  // Observable navItem source
  private _authNavStatusSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // Observable navItem stream
  authNavStatus$: Observable<boolean> = this._authNavStatusSource.asObservable();

  private manager: UserManager;
  private user: User | null;
  private backenduser: BackendUser | null;

  constructor(
    private userService: UserService
  ) {
    this.manager = new UserManager(getClientSettings());

    this.manager.getUser().then((user) => {
      this.user = user;

      // Only fetch the user details when the manager knows the user and the user is not expired.
      if (this.isAuthenticated()) {
        this.getBackendUser().then((backendUser) => {
          this.backenduser = backendUser;
          this.$user.next(backendUser);
        });
      }

      this._authNavStatusSource.next(this.isAuthenticated());
    });
  }

  /**
   * Logins user in via the UserManager.
   * @param providerSchema optionalSchema to provide in the query params.
   */
  public login(providerSchema?: string): Promise<void> {
    if (providerSchema != null) {
      this.manager.settings.extraQueryParams = { 'provider': providerSchema };
    }
    return this.manager.signinRedirect();
  }

  /**
   * Method to complete authentication.
   */
  public async completeAuthentication() {
    this.user = await this.manager.signinRedirectCallback();
    this.backenduser = await this.getBackendUser();
    this.$user.next(this.backenduser);
    this._authNavStatusSource.next(this.isAuthenticated());
  }

  /**
   * Gets the backend user.
   * @returns the backend user.
   */
  public async getBackendUser(): Promise<BackendUser> {
    // If the user is null then the user is not signed in so we cannot request the user from the backend.
    if (this.user === null) {
      return;
    }
    return this.userService.getCurrentUser().toPromise();
  }

  /**
   * Gets the current backend user model.
   * @Returns Backend user model.
   */
  public getCurrentBackendUser(): BackendUser {
    if (this.backenduser == null) {
      this.getBackendUser().then(result => {
        this.backenduser = result;
        return this.backenduser;
      });
    }
    return this.backenduser;
  }

  /**
   * Checks if the current user has the given scope.
   * @Returns true if user has the scope.
   */
  public currentBackendUserHasScope(scope: string): boolean {
    const user = this.getCurrentBackendUser();
    if (user?.role === undefined) {
      return false;
    }
    return user.role.scopes.some(s => s.scope === scope);
  }

  /**
   * Determines whether user is authenticated.
   * @returns true if authenticated.
   */
  public isAuthenticated(): boolean {
    return this.user != null && !this.user.expired;
  }

  /**
   * Gets the authorization header value.
   */
  public get authorizationHeaderValue(): string {
    if (this) {
      return `${this.user.token_type} ${this.user.access_token}`;
    }
  }

  /**
   * Gets the name of the user.
   */
  public get name(): string {
    if (this.user == null) {
      return '';
    } else {
      return this.user.profile.name;
    }
  }

  /**
   * Methods to signout the current user.
   * @returns Signout promise.
   */
  public async signout(): Promise<void> {
    await this.manager.signoutRedirect();
  }
}

/**
 * Gets client settings.
 * @returns client settings.
 */
export function getClientSettings(): UserManagerSettings {
  return {
    authority: environment.identityServerUrl,
    client_id: environment.identityClientId,
    redirect_uri: environment.identityRedirectUri,
    post_logout_redirect_uri: environment.identityLogoutRedirectUri,
    response_type: 'code',
    scope: 'openid profile email dex-api offline_access',
    filterProtocolClaims: true,
    loadUserInfo: true,
    automaticSilentRenew: true,
    silent_redirect_uri: environment.identitySilentRedirectUri
  };
}
