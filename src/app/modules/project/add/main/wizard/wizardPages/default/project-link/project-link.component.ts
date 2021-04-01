import { Component, OnInit } from '@angular/core';
import { WizardStepBaseComponent } from 'src/app/modules/project/add/main/wizard/wizardPages/wizard-step-base/wizard-step-base.component';
import { FormControl } from '@angular/forms';
import { WizardService } from 'src/app/services/wizard.service';
import { SafeUrl } from '@angular/platform-browser';
import { FileRetrieverService } from 'src/app/services/file-retriever.service';

@Component({
  selector: 'app-project-link',
  templateUrl: './project-link.component.html',
  styleUrls: ['./project-link.component.scss', '../../shared-wizard-styles.scss']
})
export class ProjectLinkComponent extends WizardStepBaseComponent implements OnInit {

  public link = new FormControl('');
  public projectLoading = false;
  public selectedSource = this.wizardService.selectedSource;

  constructor(private wizardService: WizardService,
              private fileRetrieverService: FileRetrieverService) {
    super();
  }

  public ngOnInit(): void {
    // This page can be loaded dynamically so project is not always present
    this.projectLoading = false;
    this.step.project?.subscribe(project => {
      if (project.uri) {
        this.link.setValue(project.uri);
      }
    });

    console.log(this.selectedSource.title);
  }

  public onClickNext() {
    if (this.link.valid) {
      if (this.step.id === 2) {
        this.projectLoading = true;
        this.wizardService.fetchProjectFromExternalSource(this.link.value).subscribe(() => {
          this.projectLoading = false;
          super.onClickNext();
        });
      } else {
        this.step.project.subscribe(project => {
          this.step.updateProject({uri: this.link.value, ...project});
        });
        super.onClickNext();
      }
    }
  }

  /**
   * Method to get the url of the icon of the project. This is retrieved
   * from the file retriever service
   */
  public getIconUrl(project): SafeUrl {
    return this.fileRetrieverService.getIconUrl(project.projectIcon);
  }
}
