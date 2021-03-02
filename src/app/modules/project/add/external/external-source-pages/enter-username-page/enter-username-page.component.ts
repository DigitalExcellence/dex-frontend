import { Component, OnInit } from '@angular/core';
import { WizardService } from 'src/app/services/wizard.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../../../../../models/domain/project';

@Component({
  selector: 'app-enter-username-page',
  templateUrl: './enter-username-page.component.html',
  styleUrls: ['./enter-username-page.component.scss']
})
export class EnterUsernamePageComponent implements OnInit {

  public usernameControl = new FormControl('');
  public userProjects: Array<Project>;
  private externalSourceGuid: string;

  constructor(private wizardService: WizardService,
              private router: Router,
              private route: ActivatedRoute) { }

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
