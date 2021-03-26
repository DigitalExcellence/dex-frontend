import { Component, OnInit } from '@angular/core';
import { WizardService } from 'src/app/services/wizard.service';
import { WizardStepBaseComponent } from 'src/app/modules/project/add/main/wizard/wizardPages/wizard-step-base/wizard-step-base.component';

@Component({
  selector: 'app-pick-flow-page',
  templateUrl: './pick-flow-page.component.html',
  styleUrls: ['./pick-flow-page.component.scss']
})
export class PickFlowPageComponent extends WizardStepBaseComponent implements OnInit {

  constructor(private wizardService: WizardService) { super(); }

  ngOnInit(): void {
  }

  buttonClicked(event: MouseEvent, type) {
    this.wizardService.selectFlow(type);
  }

}
