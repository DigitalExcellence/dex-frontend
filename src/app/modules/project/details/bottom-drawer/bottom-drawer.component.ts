import { scopes } from '../../../../models/domain/scopes';
import { AuthService } from '../../../../services/auth.service';
import { HighlightByProjectIdService } from '../../../../services/highlightid.service';

import { Component, Input, OnInit } from '@angular/core';
import { Project } from 'src/app/models/domain/project';
import { User } from 'src/app/models/domain/user';

@Component({
  selector: 'app-bottom-drawer',
  templateUrl: './bottom-drawer.component.html',
  styleUrls: ['./bottom-drawer.component.scss']
})
export class BottomDrawerComponent implements OnInit {
  @Input() project: Project;
  @Input() activeTab: string;
  public currentUser: User;

  public isProjectHighlighted = false;

  public displayCallToActionButton = true;
  public displayEmbedButton = false;

  constructor(private authService: AuthService,
              private highlightByProjectIdService: HighlightByProjectIdService) { }

  ngOnInit(): void {
    this.determineDisplayEmbedButton();
    this.determineDisplayCallToActionButton();

    this.currentUser = this.authService.getCurrentBackendUser();

    if (this.authService.currentBackendUserHasScope(scopes.HighlightRead)) {
      this.highlightByProjectIdService.getHighlightsByProjectId(this.project.id)
          .subscribe(highlights => {
            if (highlights == null) {
              return;
            }
            if (highlights.length > 0) {
              this.isProjectHighlighted = true;
            }
          });
    }
  }

  public onClickCallToActionButton(url: string) {
    if (!url.match(/^https?:\/\//i)) {
      url = 'http://' + url;
    }

    window.open(url, '_blank');
  }

  /**
   * Method to set the tab to the active tab from the params
   */
  public setActiveTab(newActiveTab): void {
    this.activeTab = newActiveTab;
  }

  /**
   * Method to display the project's call to action button based on whether or not the project has a set call to action.
   */
  private determineDisplayCallToActionButton(): void {
    if (this.project && this.project.callToActions?.length > 0) {
      this.displayCallToActionButton = true;
    } else {
      this.displayCallToActionButton = false;
    }
  }

  /**
   * Method to display the embed button based on the current user and the project user.
   * If the user either has the EmbedWrite scope or is the creator of the project
   * @param project The project to check if the current user is the owner.
   */
  private determineDisplayEmbedButton(): void {
    if (this.authService.currentBackendUserHasScope(scopes.EmbedWrite)) {
      this.displayEmbedButton = true;
      return;
    }

    if (this.currentUser == null || this.project == null || this.project.user == null) {
      this.displayEmbedButton = false;
      return;
    }
    this.displayEmbedButton = this.project.user.id === this.currentUser.id;
  }
}
