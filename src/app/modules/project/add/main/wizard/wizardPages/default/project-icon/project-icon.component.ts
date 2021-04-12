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
import { Component, OnInit, ViewChild } from '@angular/core';
import { WizardStepBaseComponent } from 'src/app/modules/project/add/main/wizard/wizardPages/wizard-step-base/wizard-step-base.component';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';
import { ProjectAdd } from 'src/app/models/resources/project-add';
import { WizardService } from 'src/app/services/wizard.service';
import { SafeUrl } from '@angular/platform-browser';
import { FileRetrieverService } from 'src/app/services/file-retriever.service';

@Component({
  selector: 'app-project-icon',
  templateUrl: './project-icon.component.html',
  styleUrls: ['./project-icon.component.scss', '../../shared-wizard-styles.scss']
})
export class ProjectIconComponent extends WizardStepBaseComponent implements OnInit {
  @ViewChild(FileUploaderComponent) fileUploader: FileUploaderComponent;

  /**
   * File uploader variables
   */
  public acceptedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
  public acceptMultiple = false;

  /**
   * Hold a copy of the project temporarily to prevent the service from listening to every change
   */
  private project: ProjectAdd;

  constructor(private wizardService: WizardService,
              private fileRetrieverService: FileRetrieverService) {
    super();
  }

  ngOnInit(): void {
    // TODO: Implement loading added images. This will probably require some backend implementation first
    this.project = this.wizardService.builtProject;
  }

  /**
   * Method which triggers when the button to the next page is pressed
   */
  public onClickNext(): void {
    if (this.fileUploader.files.length > 0) {
      this.fileUploader.uploadFiles().subscribe(files => {
        if (files[0]) {
          this.wizardService.updateProject({...this.project, fileId: files[0].id});
          this.wizardService.uploadFile = files[0];
        }
        super.onClickNext();
      });
    } else {
      super.onClickNext();
    }
  }

  /**
   * Method that triggers when the upload image button is clicked on mobile
   */
  public mobileUploadButtonClick(): void {
    document.querySelector('input').click();
  }

  /**
   * Method that determines which preview to use for the project icon
   */
  getProjectIcon(): SafeUrl {
    if (this.fileUploader?.files[0]) {
      return this.fileUploader.files[0].preview;
    }
    return this.fileRetrieverService.getIconUrl(this.wizardService.uploadFile);
  }
}
