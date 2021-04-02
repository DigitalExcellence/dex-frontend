import { Component, OnInit } from '@angular/core';
import { WizardStepBaseComponent } from 'src/app/modules/project/add/main/wizard/wizardPages/wizard-step-base/wizard-step-base.component';
import { FormControl } from '@angular/forms';
import * as showdown from 'showdown';
import { QuillUtils } from 'src/app/utils/quill.utils';
import { ProjectAdd } from 'src/app/models/resources/project-add';
import { WizardService } from 'src/app/services/wizard.service';

@Component({
  selector: 'app-project-description',
  templateUrl: './project-description.component.html',
  styleUrls: ['./project-description.component.scss', '../../shared-wizard-styles.scss']
})

export class ProjectDescriptionComponent extends WizardStepBaseComponent implements OnInit {

  /**
   * Configuration for the quill editor
   */
  public modulesConfiguration = QuillUtils.getDefaultModulesConfiguration();
  /**
   * Form fields variables
   */
  public shortDescription = new FormControl('');
  public longDescription = new FormControl('');
  private project: ProjectAdd;

  constructor(private wizardService: WizardService) {
    super();
  }

  ngOnInit(): void {
    this.project = this.wizardService.builtProject;
    if (this.project.shortDescription) {
      this.shortDescription.setValue(this.project.shortDescription);
    }
    if (this.project.description) {
      const converter = new showdown.Converter(
          {
            literalMidWordUnderscores: true
          }
      );
      this.project.description = converter.makeHtml(this.project.description);

      this.longDescription.setValue(this.project.description);
    }
  };

  /**
   * Function that handles the next-page button
   */
  public onClickNext() {
    this.wizardService.updateProject({
      ...this.project,
      shortDescription: this.shortDescription.value,
      description: this.longDescription.value
    });
    super.onClickNext();
  }

}
