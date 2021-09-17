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

import { Component, HostListener, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Project } from 'src/app/models/domain/project';
import { UploadFile } from 'src/app/models/domain/uploadFile';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { FileRetrieverService } from 'src/app/services/file-retriever.service';
import { HighlightService } from 'src/app/services/highlight.service';
import { HighlightByProjectIdService } from 'src/app/services/highlightid.service';
import { ProjectService } from 'src/app/services/project.service';
import { SEOService } from 'src/app/services/seo.service';

/**
 * Overview of a single project
 */
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailsComponent implements OnInit {
  @Input() projectId: number;
  @Input() activeTab = 'description';

  /**
   * Variable to store the project which is retrieved from the api.
   */
  public project: Project;

  /**
   * Property to indicate whether the project is loading.
   */
  public projectLoading = true;

  /**
   * Property for storing the invalidId if an invalid project id was entered.
   */
  public invalidId: string;

  /**
   * Return whether the project was liked or not to the overview page.
   */
  public onLike: Subject<boolean>;

  /**
   * Boolean to trigger animation only after first click and not on page load.
   */
  public animationTriggered = false;

  // Boolean to check if editMode is activated;
  public editMode = false;

  constructor(
    private projectService: ProjectService,
    private authService: AuthService,
    private highlightService: HighlightService,
    private modalService: BsModalService,
    private alertService: AlertService,
    private highlightByProjectIdService: HighlightByProjectIdService,
    private router: Router,
    private seoService: SEOService,
    private fileRetrieverService: FileRetrieverService,
  ) {
    this.onLike = new Subject<boolean>();
  }

  ngOnInit(): void {
    if (Number.isNaN(this.projectId) || this.projectId < 1) {
      this.invalidId = this.projectId.toString();
      return;
    }

    this.projectService.get(this.projectId)
      .pipe(
        finalize(() => this.projectLoading = false)
      )
      .subscribe(
        (result) => {
          this.project = result;
          const desc = (this.project.shortDescription) ? this.project.shortDescription : this.project.description;

          // Updates meta and title tags
          this.seoService.updateDescription(desc);
          this.seoService.updateTitle(this.project.name);
        }
      );
  }

  /**
   * The pop state event is fired when the active history entry
   * changes while the user navigates the session history. Whenever
   * the user navigates to another route, this function will hide
   * the active modal.
   * @param event that will be received when history entry changes.
   */
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.hideModalAndRemoveClass();
  }

  /**
   * Method to get the url of the icon of the project. This is retrieved
   * from the file retriever service.
   */
  public getIconUrl(file: UploadFile): SafeUrl {
    return this.fileRetrieverService.getIconUrl(file);
  }

  /**
   * This method will hide the active modal and remove the
   * according class.
   */
  private hideModalAndRemoveClass(): void {
    this.modalService.hide(1);
    document.getElementsByTagName('body')[0].classList.remove('modal-open');
  }
}
