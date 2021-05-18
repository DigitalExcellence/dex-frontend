import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { UploadFile } from 'src/app/models/domain/uploadFile';
import { AutoCompleteSearchResult } from 'src/app/models/resources/autocomplete-search-result';
import { DetailsComponent } from 'src/app/modules/project/details/details.component';
import { FileRetrieverService } from 'src/app/services/file-retriever.service';
import { SearchService } from './../../services/search.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  public searchControl: FormControl;
  public searchResults : AutoCompleteSearchResult[] = [];

  private modalRef: BsModalRef;
  private modalSubscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private fileRetrieverService: FileRetrieverService,
    private searchService: SearchService,
    private location: Location,
    private modalService: BsModalService) {
    this.searchControl = new FormControl('')
    ;
  }

  ngOnInit(): void {
  }

  /**
   * Method that checks if the enter key is pressed
   * @param event event that contains the key that's pressed
   */
  public async onChangeFunction(event): Promise<void> {
    this.searchResults = await this.searchService.getAutocompletedSearchResults(event.target.value);
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
    this.searchResults = [];
    name = name.split(' ').join('-');

    this.createProjectModal(id);
    this.location.replaceState(`/project/details/${id}-${name}`);
  }

  private createProjectModal(projectId: number, activeTab: string = 'description') {
    const initialState = {
      projectId: projectId,
      activeTab: activeTab
    };

    if (projectId) {
      this.modalRef = this.modalService.show(DetailsComponent, {animated: true, initialState});
      this.modalRef.setClass('project-modal');

      // Go back to home page after the modal is closed
      this.modalSubscriptions.push(
          this.modalService.onHide.subscribe(() => {
                if (this.location.path().startsWith('/project/details')) {
                  this.location.replaceState('/home');
                }
              }
          ));
    }
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

