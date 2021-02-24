import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api-config';
import { HttpClient } from '@angular/common/http';
import { ExternalSource } from '../models/domain/external-source';
import { Observable } from 'rxjs';
import { WizardPage } from '../models/domain/wizard-page';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WizardService {
  protected readonly url = API_CONFIG.url + API_CONFIG.dataSourceRoute;

  private selectedSource: ExternalSource;
  private publicFlow: Array<WizardPage>;
  private privateFlow: Array<WizardPage>;
  private currentPageId = 0;

  constructor(
      private http: HttpClient,
      private router: Router) { }

  public fetchExternalSources(): Observable<Array<ExternalSource>> {
    return this.http.get<Array<ExternalSource>>(this.url);
  }

  public selectExternalSource(selectedSource: ExternalSource): void {
    this.selectedSource = selectedSource;
    this.goToNextStep();
  }

  public goToNextStep(): void {
    // Check where we are in the flow
    if (this.currentPageId === 0) {
      // Make sure there are wizard pages
      if (this.selectedSource?.wizardPages.length > 0) {
        // Determine which flows are present
        this.publicFlow = this.selectedSource.wizardPages.filter(s => s.authFlow === false);
        this.privateFlow = this.selectedSource.wizardPages.filter(s => s.authFlow === true);
        if (this.publicFlow.length === 0 && this.privateFlow.length > 0) {
          // There is only a private flow

        } else if (this.publicFlow.length > 0 && this.privateFlow.length === 0) {
          // There is only a public flow
        } else {
          // Both flows are present
          this.currentPageId = 1;
          this.router.navigate(['/1']);
        }
      }
    }
  }
}
