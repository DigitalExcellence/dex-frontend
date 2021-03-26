import { Component, Input, OnInit } from '@angular/core';
import { Project } from 'src/app/models/domain/project';
import { WizardService } from 'src/app/services/wizard.service';
import { WizardStepBaseComponent } from 'src/app/modules/project/add/main/wizard/wizardPages/wizard-step-base/wizard-step-base.component';

@Component({
  selector: 'app-available-projects-page',
  templateUrl: './available-projects-page.component.html',
  styleUrls: ['./available-projects-page.component.scss']
})
export class AvailableProjectsPageComponent extends WizardStepBaseComponent implements OnInit {
  @Input() userProjects: Array<Project>;

  constructor(private wizardService: WizardService) { super(); }

  ngOnInit(): void {
  }

  projectClicked(project: Project) {
    this.wizardService.selectProject(project);
  }
}
