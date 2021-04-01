import { Component, OnInit } from '@angular/core';
import { WizardStepBaseComponent } from 'src/app/modules/project/add/main/wizard/wizardPages/wizard-step-base/wizard-step-base.component';
import { FormControl } from '@angular/forms';
import * as showdown from 'showdown';
import { QuillUtils } from 'src/app/utils/quill.utils';

@Component({
  selector: 'app-project-description',
  templateUrl: './project-description.component.html',
  styleUrls: ['./project-description.component.scss', '../../shared-wizard-styles.scss']
})
export class ProjectDescriptionComponent extends WizardStepBaseComponent implements OnInit {

  constructor() {
    super();
  }

  public modulesConfiguration = QuillUtils.getDefaultModulesConfiguration();
  public shortDescription = new FormControl('');
  public longDescription = new FormControl('');

  ngOnInit(): void {
    this.step.project.subscribe(project => {
      if (project.shortDescription) {
        this.shortDescription.setValue(project.shortDescription);
      }
      if (project.description) {
        const converter = new showdown.Converter(
            {
              literalMidWordUnderscores: true
            }
        );
        project.description = converter.makeHtml(project.description);

        this.longDescription.setValue(project.description);
      }

      this.shortDescription.valueChanges.subscribe(value => {
        project.shortDescription = value;
      });
      this.longDescription.valueChanges.subscribe(value => {
        project.description = value;
      });
    });
  }

  public onClickNext() {
    this.step.project.subscribe(project => {
      this.step.updateProject({
        shortDescription: this.shortDescription.value,
        description: this.longDescription.value,
        ...project
      });
    });
    super.onClickNext();
  }

}
