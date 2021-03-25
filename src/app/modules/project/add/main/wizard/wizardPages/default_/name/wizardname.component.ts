import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/models/domain/project';
import { WizardStepBaseComponent } from '../../dynamic/wizard-step-base/wizard-step-base.component';

@Component({
  selector: 'app-name',
  templateUrl: './wizardname.component.html',
  styleUrls: ['./wizardname.component.scss']
})

export class ProjectNameComponentOld extends WizardStepBaseComponent implements OnInit {

  public project: Project;
  public linkForm: FormControl;
  private subscription: Subscription;

  constructor() {
    super();
    this.linkForm = new FormControl('');
  }

  ngOnInit() {

  }

  onClickNextButton() {
    this.project.name = this.linkForm.value;
  }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onSubmit() {
        return false;
    }

}
