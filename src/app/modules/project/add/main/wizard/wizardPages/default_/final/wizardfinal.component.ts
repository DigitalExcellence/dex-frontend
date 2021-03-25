import { Component, OnInit } from '@angular/core';
import { WizardStepBaseComponent } from '../../dynamic/wizard-step-base/wizard-step-base.component';

@Component({
  selector: 'app-final',
  templateUrl: './wizardfinal.component.html',
  styleUrls: ['./wizardfinal.component.scss']
})
export class FinalComponent extends WizardStepBaseComponent implements OnInit {

  constructor() { super(); }

  ngOnInit() {
  }


  onSubmit() {
    return false;
  }

}


