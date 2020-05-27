/*
 *  Digital Excellence Copyright (C) 2020
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
import { EmbeddedProject } from 'src/app/models/domain/embedded-project';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-embed-button',
  templateUrl: './embed-button.component.html',
  styleUrls: ['./embed-button.component.scss']
})
/**
 * Button that generates an embedded project and creates an iframe example link
 */
export class EmbedButtonComponent implements OnInit {
  public embeddedProject: EmbeddedProject;
  public frontendUrl = environment.frontendUrl;
  private projectId: number;

  constructor(private activedRoute: ActivatedRoute, private EmbedService: EmbedService) { }

  ngOnInit(): void {
    const routeId = this.activedRoute.snapshot.paramMap.get("id");
    if (!routeId) {
      return;
    }
    const id = Number(routeId);
    if (id < 1) {
      return;
    }
    this.projectId = id;
  }

  public onClickGenerateEmbed(): void{
    this.EmbedService.post({projectId:this.projectId})
      .subscribe(
        (result) => {
          this.embeddedProject = result;
        }
      );
  }
}
