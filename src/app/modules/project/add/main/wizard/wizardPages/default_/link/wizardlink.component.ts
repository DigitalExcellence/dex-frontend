import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/models/domain/project';
import { WizardStepBaseComponent } from 'src/app/modules/project/add/main/wizard/wizardPages/dynamic/wizard-step-base/wizard-step-base.component';


@Component({
  selector: 'app-link',
  templateUrl: './wizardlink.component.html',
  styleUrls: ['./wizardlink.component.scss']
})

export class LinkComponent extends WizardStepBaseComponent implements OnInit {

  project: Project;
  subscription: Subscription;
  linkForm: FormControl;

  constructor() {
    super();
    this.linkForm = new FormControl('');
  }

  ngOnInit() {

  }

  onClickNextButton() {
    this.project.uri = this.linkForm.value;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

