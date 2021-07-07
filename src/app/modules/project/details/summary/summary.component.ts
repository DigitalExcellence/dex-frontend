import { Component, Input } from '@angular/core';
import { Project } from 'src/app/models/domain/project';
import { Subject } from 'rxjs';
import { AlertConfig } from 'src/app/models/internal/alert-config';
import { AlertType } from 'src/app/models/internal/alert-type';
import { LikeService } from 'src/app/services/like.service';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from '../../../../services/auth.service';
import { environment } from '../../../../../environments/environment';
import { UploadFile } from '../../../../models/domain/uploadFile';
import { SafeUrl } from '@angular/platform-browser';
import { FileRetrieverService } from '../../../../services/file-retriever.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent {
  @Input() project: Project;
  @Input() onLike: Subject<boolean>;
  @Input() animationTriggered: boolean;

  constructor(
      private likeService: LikeService,
      private alertService: AlertService,
      private authService: AuthService,
      private fileRetrieverService: FileRetrieverService) { }

  /**
   * Method to handle the click of the like button
   * It will either like or unlike the project
   */
  public likeClicked(): void {
    if (this.authService.isAuthenticated()) {
      if (!this.project.userHasLikedProject) {
        this.likeService.likeProject(this.project.id);
        this.project.likeCount++;
        this.animationTriggered = true;
        // We add this so we can update the overview page when the modal is closed
        this.onLike.next(true);
      } else {
        this.likeService.removeLike(this.project.id);
        this.project.likeCount--;
        this.animationTriggered = true;
        // We add this so we can update the overview page when the modal is closed
        this.onLike.next(false);
      }
      this.project.userHasLikedProject = !this.project.userHasLikedProject;
    } else {
      // User is not logged in
      const alertConfig: AlertConfig = {
        type: AlertType.warning,
        mainMessage: 'You need to be logged in to like a project',
        dismissible: true,
        autoDismiss: true,
        timeout: this.alertService.defaultTimeout
      };
      this.alertService.pushAlert(alertConfig);
    }
  }

  /**
   * Method to get the url of the icon of the project. This is retrieved
   * from the file retriever service.
   */
  public getIconUrl(file: UploadFile): SafeUrl {
    return this.fileRetrieverService.getIconUrl(file);
  }

  /**
   * Method to display the tags based on the environment variable.
   * Tags should be hidden in production for now until further implementation is finished.
   */
  public isProduction(): boolean {
    return environment.production;
  }
}
