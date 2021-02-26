import { Component, OnInit } from '@angular/core';
import { WizardService } from 'src/app/services/wizard.service';

@Component({
  selector: 'app-pick-flow-page',
  templateUrl: './pick-flow-page.component.html',
  styleUrls: ['./pick-flow-page.component.scss']
})
export class PickFlowPageComponent implements OnInit {

  constructor(private wizardService: WizardService) { }

  ngOnInit(): void {
  }

  buttonClicked(event: MouseEvent, type) {
    this.wizardService.selectFlow(type);
  }

}
