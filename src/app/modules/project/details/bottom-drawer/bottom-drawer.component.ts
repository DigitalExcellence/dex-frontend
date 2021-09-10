import { Project } from '../../../../models/domain/project';
import { scopes } from '../../../../models/domain/scopes';
import { User } from '../../../../models/domain/user';
import { AlertConfig } from '../../../../models/internal/alert-config';
import { AlertType } from '../../../../models/internal/alert-type';
import { AlertService } from '../../../../services/alert.service';
import { AuthService } from '../../../../services/auth.service';
import { HighlightByProjectIdService } from '../../../../services/highlightid.service';

import { Component, Input, OnInit } from '@angular/core';

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

  public copyButtonText = 'Share project url';

  constructor(private authService: AuthService,
              private highlightByProjectIdService: HighlightByProjectIdService,
              private alertService: AlertService) { }

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
      url = 'https://' + url;
    }

    window.open(url, '_blank');
  }

  /**
   * Method to set the tab to the active tab from the params.
   */
  public setActiveTab(newActiveTab): void {
    this.activeTab = newActiveTab;
  }

  /**
   * Method for copying the current URL to the user's clipboard.
   * Shows a success alert if succeeded.
   */
  public copyUrlToClipboard(): void {
    navigator.clipboard.writeText(window.location.href).then(() => {
      const alertConfig: AlertConfig = {
        type: AlertType.success,
        preMessage: '',
        mainMessage: 'Project url copied to clipboard',
        dismissible: true,
        autoDismiss: true,
        timeout: 2000,
      };
      this.alertService.pushAlert(alertConfig);
    }, () => {
      this.copyText = 'Try again';
    });
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
   * If the user either has the EmbedWrite scope or is the creator of the project.
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
