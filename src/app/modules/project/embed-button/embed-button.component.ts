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

import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EmbeddedProject} from 'src/app/models/domain/embedded-project';
import {EmbedService} from 'src/app/services/embed.service';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-embed-button',
  templateUrl: './embed-button.component.html',
  styleUrls: ['./embed-button.component.scss']
})
/**
 * Button that generates an embedded project and creates an iframe example link
 */
export class EmbedButtonComponent implements OnInit {
  @Input() private projectId: number;
  public embeddedProject: EmbeddedProject;
  public frontendUrl = environment.frontendUrl;

  constructor(private activedRoute: ActivatedRoute, private embedService: EmbedService) { }

  ngOnInit(): void {}

  public onClickGenerateEmbed(): void {
    this.embedService.post({projectId: this.projectId})
      .subscribe(
        (result) => {
          this.embeddedProject = result;
        }
      );
  }
}
