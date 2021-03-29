import { Component, OnInit, ViewChild } from '@angular/core';
import { WizardStepBaseComponent } from 'src/app/modules/project/add/main/wizard/wizardPages/wizard-step-base/wizard-step-base.component';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';

@Component({
  selector: 'app-project-icon',
  templateUrl: './project-icon.component.html',
  styleUrls: ['./project-icon.component.scss', '../../shared-wizard-styles.scss']
})
export class ProjectIconComponent extends WizardStepBaseComponent implements OnInit {
  public acceptedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
  public acceptMultiple = false;
  @ViewChild(FileUploaderComponent) fileUploader: FileUploaderComponent;

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (this.step.file) {
      this.fileUploader.setFiles([this.step.file]);
    }
  }

  onClickNext() {
    this.fileUploader.uploadFiles().subscribe(files => {
      if (files[0]) {
        this.step.project.fileId = files[0].id;
      }
    });
    super.onClickNext();
  }
}
