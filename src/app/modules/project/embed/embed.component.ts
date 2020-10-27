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
import { EmbedService } from 'src/app/services/embed.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'src/app/models/domain/project';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { RESOURCE_CONFIG } from 'src/app/config/resource-config';

/**
 * Overview of a single project
 */
@Component({
  selector: 'app-embed',
  templateUrl: './embed.component.html',
  styleUrls: ['./embed.component.scss']
})
export class EmbedComponent implements OnInit {

  /**
   * Variable to store the project which is retrieved from the api
   */
  public project: Project;

  constructor(
    private activedRoute: ActivatedRoute,
    private embedService: EmbedService,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    const routeId = this.activedRoute.snapshot.paramMap.get('id');
    if (!routeId) {
      return;
    }
    // check if the routeid is in a valid guid format.
    const regexp = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$', 'i');
    if (regexp.test(routeId) === false) {
      return;
    }

    this.embedService.getEmbed(routeId).subscribe(
      (result) => {
        this.project = result;
      }
    );
  }

    /**
   * Method to get the url of the icon of the project. This urls can be the local
   * image for a default or a specified icon stored on the server.
   */
  public getIconUrl(): SafeUrl {
    if (this.project.projectIcon != null) {
    return this.sanitizer.bypassSecurityTrustUrl(RESOURCE_CONFIG.url + this.project.projectIcon.path);
    }
    return 'assets/images/code.svg';
  }
}
