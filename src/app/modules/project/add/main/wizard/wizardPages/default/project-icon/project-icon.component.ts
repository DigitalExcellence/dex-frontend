import { Component, OnInit, ViewChild } from '@angular/core';
import { WizardStepBaseComponent } from 'src/app/modules/project/add/main/wizard/wizardPages/wizard-step-base/wizard-step-base.component';
import { FileUploaderComponent } from 'src/app/components/file-uploader/file-uploader.component';
import { ProjectAdd } from 'src/app/models/resources/project-add';
import { WizardService } from 'src/app/services/wizard.service';

@Component({
  selector: 'app-project-icon',
  templateUrl: './project-icon.component.html',
  styleUrls: ['./project-icon.component.scss', '../../shared-wizard-styles.scss']
})
export class ProjectIconComponent extends WizardStepBaseComponent implements OnInit {
  public acceptedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
  public acceptMultiple = false;
  @ViewChild(FileUploaderComponent) fileUploader: FileUploaderComponent;

  private project: ProjectAdd;

  constructor(private wizardService: WizardService) {
    super();
  }

  ngOnInit(): void {
    // TODO: Implement loading added images
    this.project = this.wizardService.builtProject;
  }

  onClickNext() {
    if (this.fileUploader.files.length > 0) {
      this.fileUploader.uploadFiles().subscribe(files => {
        if (files[0]) {
          this.wizardService.updateProject({...this.project, fileId: files[0].id});
        }
        super.onClickNext();
      });
    } else {
      super.onClickNext();
    }
  }
}
