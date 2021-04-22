import { Component, OnInit, ViewChild } from '@angular/core';
import { WizardStepBaseComponent } from '../../wizard-step-base/wizard-step-base.component';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';
import { ProjectAdd } from 'src/app/models/resources/project-add';
import { WizardService } from 'src/app/services/wizard.service';
import { FileRetrieverService } from 'src/app/services/file-retriever.service';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-project-images',
  templateUrl: './project-images.component.html',
  styleUrls: ['./project-images.component.scss', '../../shared-wizard-styles.scss']
})
export class ProjectImagesComponent extends WizardStepBaseComponent implements OnInit {
  @ViewChild(FileUploaderComponent) fileUploader: FileUploaderComponent;

  /**
   * File uploader variables
   */
  public acceptedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
  public acceptMultiple = true;

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
        if (files) {
          this.wizardService.updateProject({...this.project, projectImageIds: files.map(file => file.id)});
          this.wizardService.projectImages = files;
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
  public getProjectImages(): SafeUrl[] {
    if (this.fileUploader?.files) {
      return this.fileUploader.files.map(file => file.preview);
    }
    //return this.fileRetrieverService.getIconUrl(this.wizardService.uploadFile);
  }
}
