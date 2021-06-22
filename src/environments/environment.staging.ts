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

export const environment = {
  production: true,
  identityServerUrl: 'https://identity.staging.dex.software/',
  apiUrl: 'https://api.staging.dex.software/',
  frontendUrl: 'https://staging.dex.software/',
  identityCallbackUrl: 'https://staging.dex.software/',
  identityClientId: 'dex-frontend',
  identityRedirectUri: 'https://identity.staging.dex.software/auth-callback',
  identityLogoutRedirectUri: 'https://staging.dex.software/',
  identitySilentRedirectUri: 'https://staging.dex.software/auth-callback',
  // This should be empty because it will only be used in production.
  sentryDsnUrl: ''

};
