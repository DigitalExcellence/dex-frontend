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

import { environment } from 'src/environments/environment';

export interface ApiConfig {
  embeddedProjectRoute: string;
  url: string;
  userRoute: string;
  projectRoute: string;
  highlightRoute: string;
  internalSearchRoute: string;
  externalSearchRoute: string;
  autoCompleteRoute: string;
  dataSourceRoute: string;
  wizardRoute: string;
  wizardPageRoute: string;
  callToActionOptionRoute: string;
  uploadFileRoute: string;
  projectLikes: string;
  projectComment: string;
  projectCommentLike: string;
  projectComments: string;
  categoryRoute: string;
}

export const API_CONFIG: ApiConfig = {
  url: `${environment.apiUrl}/api/`,
  userRoute: 'user',
  projectRoute: 'project',
  highlightRoute: 'highlight',
  internalSearchRoute: 'search/internal',
  externalSearchRoute: 'search/external',
  autoCompleteRoute: 'project/search/autocomplete',
  embeddedProjectRoute: 'embed',
  dataSourceRoute: 'dataSource',
  wizardRoute: 'wizard',
  callToActionOptionRoute: 'callToActionOption',
  wizardPageRoute: 'wizardpage',
  uploadFileRoute: 'file',
  projectLikes: 'project/like',
  projectComment: 'project/comment',
  projectCommentLike: 'project/comment/like',
  projectComments: 'project/comments',
  categoryRoute: 'category'
};

