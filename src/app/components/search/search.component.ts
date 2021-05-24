import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UploadFile } from 'src/app/models/domain/uploadFile';
import { AutoCompleteSearchResult } from 'src/app/models/resources/autocomplete-search-result';
import { FileRetrieverService } from 'src/app/services/file-retriever.service';
import { SearchService } from 'src/app/services/search.service';
import { ProjectDetailModalUtility } from 'src/app/utils/project-detail-modal.util';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  public searchControl: FormControl;
  public searchResults: AutoCompleteSearchResult[] = [];

  constructor(
      private router: Router,
      private fileRetrieverService: FileRetrieverService,
      private searchService: SearchService,
      private projectDetailModalUtility: ProjectDetailModalUtility) {
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
   * @param projectName
   */
  public setMatchedToBold(projectName) {
    const name = projectName.toUpperCase();
    const query = this.searchControl.value.toUpperCase();
    const position = name.indexOf(query);
    if (!query || position === -1) {
      return projectName; // no part was matched
    }
    const length = query.length;
    return [{
      text: projectName.substr(0, position)
    }, {
      text: projectName.substr(position, length),
      bold: true
    }, {
      text: projectName.substr(position + length)
    }];
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

