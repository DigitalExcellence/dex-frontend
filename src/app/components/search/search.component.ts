import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UploadFile } from 'src/app/models/domain/uploadFile';
import { AutoCompleteSearchResult } from 'src/app/models/resources/autocomplete-search-result';
import { FileRetrieverService } from 'src/app/services/file-retriever.service';
import { SearchService } from './../../services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  public searchControl: FormControl;
  public searchResults : AutoCompleteSearchResult[] = [];

  constructor(
    private router: Router,
    private fileRetrieverService: FileRetrieverService,
    private searchService: SearchService) {
    this.searchControl = new FormControl('');
  }

  ngOnInit(): void {
  }

  /**
   * Method that checks if the enter key is pressed
   * @param event event that contains the key that's pressed
   */
  public async onChangeFunction(event): Promise<void> {
    this.searchResults = await this.searchService.getAutocompletedSearchResults(event.target.value);
    this.searchResults = this.searchResults.slice(0, 5);
    if (event.code === 'Enter') {
      this.onClickSearch();
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
    name = name.split(' ').join('-');
    this.router.navigate([`/project/details/${id}-${name}`]);
  }


  /**
   * Method that validates the input, and based on the outcome
   * routes to the overview page with/without queryparameters
   */
  private validateSearchInput(): void {
    if (this.searchControl.value !== '' && this.searchControl.value.replace(/\s/g, '').length) {
      this.router.navigate(['/project/overview'], { queryParams: { query: this.searchControl.value } });
    } else {
      this.router.navigate(['/project/overview']);
    }
  }
  
  /**
   * Method to get the url of the icon of the project. This is retrieved
   * from the file retriever service
   */
   public getIconUrl(file: UploadFile): SafeUrl {
    return this.fileRetrieverService.getIconUrl(file);
  }

}

