import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchService } from './../../services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  public searchControl: FormControl;

  constructor(
    private router: Router,
    private searchService: SearchService) {
    this.searchControl = new FormControl('');
  }

  ngOnInit(): void {
  }

  /**
   * Method that checks if the enter key is pressed
   * @param event event that contains the key that's pressed
   */
  public onChangeFunction(event): void {
    this.searchService.getAutocompletedSearchResults(event.target.value);

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

}
