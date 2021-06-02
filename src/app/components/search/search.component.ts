import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UploadFile } from 'src/app/models/domain/uploadFile';
import { AutoCompleteSearchResult } from 'src/app/models/resources/autocomplete-search-result';
import { FileRetrieverService } from 'src/app/services/file-retriever.service';
import { SearchService } from 'src/app/services/search.service';
import { ProjectDetailModalUtility } from 'src/app/utils/project-detail-modal.util';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchComponent {

  public searchControl: FormControl;
  public searchResults: AutoCompleteSearchResult[] = [];

  constructor(
      private router: Router,
      private fileRetrieverService: FileRetrieverService,
      private searchService: SearchService,
      private projectDetailModalUtility: ProjectDetailModalUtility,
      private sanitizer: DomSanitizer) {
    this.searchControl = new FormControl('');
  }

  /**
   * Method that checks if the enter key is pressed
   * @param event event that contains the key that's pressed
   */
  public onChangeFunction(event): void {
    if (event.code === 'Enter') {
      this.onClickSearch();
    } else {
      this.searchService.getAutocompletedSearchResults(event.target.value).subscribe(results => {
        this.searchResults = results;
      });
    }
  }

  /**
   * Called when the user clicks the search icon in the search bar
   */
  public onClickSearch(): void {
    this.validateSearchInput();
  }

  /**
   * Called when the user click on one of the search results
   **/
  public onClickProject(id: number, name: string): void {
    this.projectDetailModalUtility.openProjectModal(id, name, '/home');
    this.searchResults = [];
  }

  /**
   * Method to get the url of the icon of the project. This is retrieved
   * from the file retriever service
   */
  public getIconUrl(file: UploadFile): SafeUrl {
    return this.fileRetrieverService.getIconUrl(file);
  }

  /**
   * Method that will split the name into a part that was matched in the query and a part that was not.
   */
  public setMatchedToBold(projectName) {
    const query = this.searchControl.value;
    if (!query) {
      return projectName; // no part was matched
    }

    // These terms will be ignored by the regular expressions
    const matched = ['<span>', '</span>'];

    // We want to check if any words in the query match so they can be seperated
    query.split(' ')
        .filter(part => part) // Make sure the part is not just whitespace
        .forEach(part => {
          projectName = projectName
              .replace(
                  new RegExp(part, 'gi'),
                  (match) => {
                    if (!matched.some(m => m.includes(match))) {    // Check if the 'part' was already handled
                      matched.push(match.toLowerCase());            // Push the match to the matched array so it won't be checked again
                      return `<span class="bold">${match}</span>`;  // Highlight the matched part
                    }
                    return match;
                  });
        });
    return projectName;
  }

  /**
   * Method that validates the input, and based on the outcome
   * routes to the overview page with/without queryparameters
   */
  private validateSearchInput(): void {
    if (this.searchControl.value !== '' && this.searchControl.value.replace(/\s/g, '').length) {
      this.router.navigate(['/project/overview'], {queryParams: {query: this.searchControl.value}});
    } else {
      this.router.navigate(['/project/overview']);
    }
  }

}

