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
  public selectedExternalSource: ExternalSource;
  public isAuthenticated: boolean;
  modalRef: BsModalRef;
  constructor(
      private router: Router,
      private alertService: AlertService,
      private authService: AuthService,
      private seoService: SEOService,
      private wizardService: WizardService,
      private fileRetrieverService: FileRetrieverService,
      private modalService: BsModalService
  ) { }

  ngOnInit(): void {

    this.authService.authNavStatus$.subscribe((status) => {
      this.isAuthenticated = status;
    });

    this.wizardService.fetchExternalSources().subscribe(externalSources => {
      this.externalSources = externalSources;
    });

    // Updates meta and title tags
    this.seoService.updateDescription('Create a new project in DeX');
    this.seoService.updateTitle('Add new project');
  }

  /**
   * Method to get the url of the icon of the project. This is retrieved
   * from the file retriever service
   */
  public getIconUrl(project): SafeUrl {
    return this.fileRetrieverService.getIconUrl(project.projectIcon);
  }

  /**
   * Handle the click when the user chooses an external source.
   */
  public externalSourceClick(event: MouseEvent, selectedSource: ExternalSource) {
    if (this.checkIfLoggedInAndReturnAlert()) {
      this.wizardService.resetService();
      this.wizardService.selectExternalSource(selectedSource);
      this.wizardService.goToNextStep();
      this.createWizardModal();
    }
  }

  public manualClick() {
    if (this.checkIfLoggedInAndReturnAlert()) {
      this.wizardService.resetService();
      this.wizardService.selectManualSource();
      this.wizardService.goToNextStep();
      this.createWizardModal();
    }
  }

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
        timeout: this.alertService.defaultTimeout,
      };
      this.alertService.pushAlert(alertConfig);
    }
    return this.isAuthenticated;
  }
}
