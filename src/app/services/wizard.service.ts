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
  private selectedFlow: Array<WizardPage>;
  private currentWizardPage: WizardPage;

  constructor(
      private http: HttpClient,
      private router: Router) { }

  /**
   * This function fetches all the available external sources
   */
  public fetchExternalSources(): Observable<Array<ExternalSource>> {
    return this.http.get<Array<ExternalSource>>(this.url);
  }

  /**
   * Can be used to pick an external source
   * @param {ExternalSource} selectedSource - The selected source
   */
  public selectExternalSource(selectedSource: ExternalSource): void {
    this.selectedSource = selectedSource;
    this.selectedFlow = undefined;
    this.goToNextStep();
  }

  /**
   * This function can be used to select the public or private flow
   * @param {string} selectedFlow - The selected flow (private/public)
   */
  public selectFlow(selectedFlow: string): void {
    // Reset position in flow so we know for sure that we begin at the first page
    // When a user changes flow in the middle of the flow.
    this.currentWizardPage = undefined;
    if (selectedFlow.toLowerCase() === 'public') {
      this.selectedFlow = this.publicFlow;
      this.goToNextStep();
    } else if (selectedFlow.toLowerCase() === 'private') {
      this.selectedFlow = this.privateFlow;
      this.goToNextStep();
    } else {
      throw new Error('Invalid flow type');
    }
  }

  /**
   * This function determines the next step in the wizard flow
   */
  public goToNextStep(): void {
    if (!this.selectedFlow) {
      this.determineFlow();
    } else {
      this.determineNextPage();
    }
  }

  private determineFlow(): void {
    // There is no flow selected yet, check which options we have
    // Make sure there are wizard pages
    if (this.selectedSource?.wizardPages.length > 0) {
      this.publicFlow = this.selectedSource.wizardPages.filter(s => s.authFlow === false).sort((s1, s2) => s1.orderIndex - s2.orderIndex);
      this.privateFlow = this.selectedSource.wizardPages.filter(s => s.authFlow === true).sort((s1, s2) => s1.orderIndex - s2.orderIndex);

      if (this.publicFlow.length === 0 && this.privateFlow.length > 0) {
        // There only is a private flow
        this.selectedFlow = this.privateFlow;
        this.goToNextStep();
      } else if (this.publicFlow.length > 0 && this.privateFlow.length === 0) {
        // There is only a public flow
        this.selectedFlow = this.publicFlow;
      } else {
        // Both flows are present
        this.router.navigate(['project', 'add', 'external', 'pickflow']);
      }
    }
  }

  private determineNextPage(): void {
    let nextIndex = this.currentWizardPage?.orderIndex || 0;
    if (nextIndex <= this.selectedFlow.length) {
      this.currentWizardPage = this.selectedFlow[nextIndex];
      this.router.navigate(['project', 'add', 'external', this.currentWizardPage.name.toLowerCase()],);
    } else {
      console.info('No steps left');
    }
  }
}
