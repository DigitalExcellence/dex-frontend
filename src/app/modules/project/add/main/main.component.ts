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

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AlertConfig } from 'src/app/models/internal/alert-config';
import { AlertType } from 'src/app/models/internal/alert-type';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { SEOService } from 'src/app/services/seo.service';
import { WizardService } from 'src/app/services/wizard.service';
import { ExternalSource } from 'src/app/models/domain/external-source';
import { SafeUrl } from '@angular/platform-browser';
import { FileRetrieverService } from 'src/app/services/file-retriever.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { WizardComponent } from './wizard/wizard.component';

/**
 * Component to import projects from external sources
 */
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit {
  /**
   * ExternalSources available to import your projects from
   */
  public externalSources = new Array<ExternalSource>();
  /**
   * Holds if the external sources are loaded or not
   */
  public sourcesLoading = true;
  /**
   * Holds if the user is authenticated
   */
  public isAuthenticated: boolean;
  /**
   * Reference to the wizard modal
   */
  private modalRef: BsModalRef;

  constructor(
      private router: Router,
      private alertService: AlertService,
      private authService: AuthService,
      private seoService: SEOService,
      private wizardService: WizardService,
      private fileRetrieverService: FileRetrieverService,
      private modalService: BsModalService
  ) {
    // Whenever the route is changed, close the modal
    this.router.events
        .subscribe((val) => {
          this.modalRef?.hide();
        });
  }

  ngOnInit(): void {
    // Check if the user is logged in
    this.authService.authNavStatus$.subscribe((status) => {
      this.isAuthenticated = status;
    });
    // Get all the external sources
    this.wizardService.fetchExternalSources().subscribe(externalSources => {
      this.externalSources = externalSources;
      this.sourcesLoading = false;
    });

    // Updates meta and title tags
    this.seoService.updateDescription('Create a new project in DeX');
    this.seoService.updateTitle('Add new project');
  }

  /**
   * Method to get the url of the icon of the project. This is retrieved
   * from the file retriever service
   */
  public getIconUrl(icon): SafeUrl {
    return this.fileRetrieverService.getIconUrl(icon);
  }

  /**
   * Method which is triggered by any of the add from external datasource buttons
   */
  public externalSourceClick(event: MouseEvent, selectedSource: ExternalSource) {
    if (selectedSource.isVisible) {
      if (this.checkIfLoggedInAndReturnAlert()) {
        this.wizardService.resetService();
        this.wizardService.selectExternalSource(selectedSource);
        this.wizardService.goToNextStep();
        this.createWizardModal();
      }
    } else {
      const alertConfig: AlertConfig = {
        type: AlertType.danger,
        preMessage: 'External source not available.',
        mainMessage: 'This external source is either in development or temporarily disabled.',
        dismissible: true,
        autoDismiss: true,
        timeout: 1000,
      };
      this.alertService.pushAlert(alertConfig);
    }
  }

  /**
   * Methods which is triggered by the 'add project manually' button
   */
  public manualClick() {
    if (this.checkIfLoggedInAndReturnAlert()) {
      this.wizardService.resetService();
      this.wizardService.goToNextStep();
      this.createWizardModal();
    }
  }

  /**
   * Methods which creates the wizard modal
   */
  private createWizardModal() {
    this.modalRef = this.modalService.show(WizardComponent, {animated: true});
    this.modalRef.setClass('wizard-modal');
  }

  /**
   * Check if the user is logged in, if not, return alert
   */
  private checkIfLoggedInAndReturnAlert(): boolean {
    if (!this.isAuthenticated) {
      const alertConfig: AlertConfig = {
        type: AlertType.danger,
        preMessage: 'You\'re not logged in!',
        mainMessage: 'You can only add a project when you\'re logged in.',
        dismissible: true,
        autoDismiss: true,
        timeout: 1000,
      };
      this.alertService.pushAlert(alertConfig);
    }
    return this.isAuthenticated;
  }
}
