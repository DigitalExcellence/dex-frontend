import { Component, OnInit } from '@angular/core';
import { WizardPage } from 'src/app/models/domain/wizard-page';
import { Observable } from 'rxjs';
import { WizardService } from 'src/app/services/wizard.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit {
  currentStep: Observable<WizardPage>;

  constructor(
      private wizardService: WizardService,
      private router: Router) { }

  ngOnInit(): void {
    if (!this.wizardService.serviceIsValid()) {
      this.router.navigate(['project', 'add']);
    }
    this.currentStep = this.wizardService.getCurrentStep();
    this.wizardService.getSteps().subscribe(items => console.log(items));
  }

  public onNextStep() {
    if (!this.wizardService.isLastStep()) {
      this.wizardService.moveToNextStep();
    } else {
      this.onSubmit();
    }
  }

  public onSubmit(): void {
    this.router.navigate(['/complete']);
  }
}
