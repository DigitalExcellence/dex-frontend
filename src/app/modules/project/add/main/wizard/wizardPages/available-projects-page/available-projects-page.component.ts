import { Component, Input, OnInit } from '@angular/core';
import { Project } from 'src/app/models/domain/project';
import { WizardService } from 'src/app/services/wizard.service';

@Component({
  selector: 'app-available-projects-page',
  templateUrl: './available-projects-page.component.html',
  styleUrls: ['./available-projects-page.component.scss']
})
export class AvailableProjectsPageComponent implements OnInit {
  @Input() userProjects: Array<Project>;

  constructor(private wizardService: WizardService) { }

  ngOnInit(): void {
  }

  projectClicked(project: Project) {
    this.wizardService.selectProject(project);
  }
}
