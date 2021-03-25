import { Component, OnInit } from '@angular/core';
import { WizardService } from 'src/app/services/wizard.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/models/domain/project';
import { WizardStepBaseComponent } from 'src/app/modules/project/add/main/wizard/wizardPages/dynamic/wizard-step-base/wizard-step-base.component';

@Component({
  selector: 'app-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.scss']
})
export class UsernameComponent extends WizardStepBaseComponent implements OnInit {

  public usernameControl = new FormControl('');
  public userProjects: Array<Project>;
  private externalSourceGuid: string;

  constructor(private wizardService: WizardService,
              private router: Router,
              private route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.externalSourceGuid = params['externalSource'];
    });
  }

  public fetchProjects(): void {
    if (this.usernameControl.value) {
      this.wizardService.fetchProjectsFromExternalSource(this.externalSourceGuid, this.usernameControl.value).subscribe(projects => {
        if (projects.length > 0) {
          this.userProjects = projects;
          console.log(projects);
        } else {
          console.error('No projects');
        }
      });
    }
  }

}
