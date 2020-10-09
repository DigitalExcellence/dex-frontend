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

const fs = require('fs');
// Configure Angular `environment.ts` file path
const target = 'environment.prod.ts';
const targetPath = `./src/environments/${target}`;
// Load node modules
const colors = require('colors');
require('dotenv').load();
// `environment.ts` file structure
const envConfigFile = `export const environment = {
   production: true,
   apiUrl: '${process.env.API_URL}',
   frontendUrl: '${process.env.FRONTEND_URL}',
   identityCallbackUrl: '${process.env.ID_CALLBACK_URL}',
   identityServerUrl: '${process.env.IDS_URL}',
   identityClientId: '${process.env.ID_CLIENT_ID}',
   identityRedirectUri: '${process.env.ID_REDIRECT_URI}',
   identityLogoutRedirectUri: '${process.env.ID_LOGOUT_REDIRECT_URI}',
   identitySilentRedirectUri: '${process.env.ID_SILENT_REDIRECT_URI}',
   sentryDsnUrl: '${process.env.SENTRY_DSN_URL}'
  };
`;
console.log(colors.magenta(`The file ${target} will be written with the following content: \n`));
console.log(colors.grey(envConfigFile));
fs.writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(colors.magenta(`Angular ${target} file generated correctly at ${targetPath} \n`));
  }
});
