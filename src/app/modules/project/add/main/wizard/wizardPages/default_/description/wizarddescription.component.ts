import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/models/domain/project';
import { WizardStepBaseComponent } from '../../wizard-step-base/wizard-step-base.component';

@Component({
  selector: 'app-description',
  templateUrl: './wizarddescription.component.html',
  styleUrls: ['./wizarddescription.component.scss']
})
export class DescriptionComponent extends WizardStepBaseComponent implements OnInit {
  project: Project;
  subscription: Subscription;
  linkForm: FormControl;
  linkForm2: FormControl;

  constructor() {
    super();
    this.linkForm = new FormControl('');
    this.linkForm2 = new FormControl('');
  }

  ngOnInit() {

  }

  onClickNextButton() {
    this.project.shortDescription = this.linkForm.value;
        this.project.description = this.linkForm2.value;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }


    onSubmit() {
        return false;
    }

}
