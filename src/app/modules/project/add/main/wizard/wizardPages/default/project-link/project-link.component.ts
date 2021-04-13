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
import { Component, Input, OnInit } from '@angular/core';
import { WizardStepBaseComponent } from 'src/app/modules/project/add/main/wizard/wizardPages/wizard-step-base/wizard-step-base.component';
import { FormControl } from '@angular/forms';
import { WizardService } from 'src/app/services/wizard.service';
import { SafeUrl } from '@angular/platform-browser';
import { FileRetrieverService } from 'src/app/services/file-retriever.service';
import { ProjectAdd } from 'src/app/models/resources/project-add';

@Component({
  selector: 'app-project-link',
  templateUrl: './project-link.component.html',
  styleUrls: ['./project-link.component.scss', '../../shared-wizard-styles.scss']
})
export class ProjectLinkComponent extends WizardStepBaseComponent implements OnInit {
  @Input() formSubmitted: boolean;
  public projectLoading = false;
  public link = new FormControl('');
  public selectedSource = this.wizardService.getSelectedSource();
  public isDynamicPage: boolean;
  public errorMessage: string;

  /**
   * Hold a copy of the project temporarily to prevent the service from listening to every change
   */
  private project: ProjectAdd;

  constructor(private wizardService: WizardService,
              private fileRetrieverService: FileRetrieverService) {
    super();
  }

  public ngOnInit(): void {
    this.wizardService.getCurrentStep().subscribe(step => {
      // Id 2 is the id of the dynamic link page in the backend
      this.isDynamicPage = step.id === 2;
    });
    this.project = this.wizardService.builtProject;
    if (this.project.uri) {
      this.link.setValue(this.project.uri);
    }
  }

  /**
   * Method which triggers when the button to the next page is pressed
   */
  public onClickNext() {
    if (this.link.valid) {
      console.log(this.link.value, !this.validURL(this.link.value));
      if (!this.validURL(this.link.value)) {
        this.errorMessage = 'Invalid url';
        return;
      }
      if (this.step.id === 2) {
        this.projectLoading = true;
        this.wizardService.fetchProjectFromExternalSource(this.link.value).subscribe(() => {
          this.projectLoading = false;
          super.onClickNext();
        }, error => {
          this.projectLoading = false;
          this.errorMessage = error.error.title + ' Please make sure your url points to an repository';
        });
      } else {
        this.wizardService.updateProject({...this.project, uri: this.link.value});
        super.onClickNext();
      }
    }
  }

  /**
   * Check if the entered url is valid
   * @param url The url that needs to be checked
   */
  private validURL(url: string): boolean {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(url);
  }

  /**
   * Method to get the url of the icon of the project. This is retrieved
   * from the file retriever service
   */
  public getIconUrl(project): SafeUrl {
    return this.fileRetrieverService.getIconUrl(project.projectIcon);
  }
}
