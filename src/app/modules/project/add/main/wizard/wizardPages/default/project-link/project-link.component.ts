import { Component, OnInit } from '@angular/core';
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

  public projectLoading = false;
  public formSubmitted = false;
  public link = new FormControl('');
  public selectedSource = this.wizardService.selectedSource;
  public isDynamicPage: boolean;

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
      if (this.step.id === 2) {
        this.projectLoading = true;
        this.wizardService.fetchProjectFromExternalSource(this.link.value).subscribe(() => {
          this.projectLoading = false;
          super.onClickNext();
        });
      } else {
        this.formSubmitted = true;
        this.wizardService.updateProject({...this.project, uri: this.link.value});
        super.onClickNext();
        // TODO: Check if the project was created successfully, else enable the button again
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
