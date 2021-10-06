import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ModalDeleteGenericComponent } from 'src/app/components/modals/modal-delete-generic/modal-delete-generic.component';
import { ModalInformationGenericComponent } from 'src/app/components/modals/modal-information-generic/modal-information-generic.component';
import { ModalPotentialNewOwnerUserEmailConfirmationComponent } from 'src/app/components/modals/modal-potential-new-owner-user-email-confirmation/modal-potential-new-owner-user-email-confirmation.component';
import { ModalPotentialNewOwnerUserEmailComponent } from 'src/app/components/modals/modal-potential-new-owner-user-email/modal-potential-new-owner-user-email.component';
import { Highlight } from 'src/app/models/domain/highlight';
import { Project } from 'src/app/models/domain/project';
import { scopes } from 'src/app/models/domain/scopes';
import { User } from 'src/app/models/domain/user';
import { AlertConfig } from 'src/app/models/internal/alert-config';
import { AlertType } from 'src/app/models/internal/alert-type';
import { HighlightAdd } from 'src/app/models/resources/highlight-add';
import { HighlightUpdate } from 'src/app/models/resources/highlight-update';
import { HighlightsModalComponent } from 'src/app/modules/project/highlights-modal/highlights-modal.component';
import { HighlightFormResult, ModalHighlightFormComponent } from 'src/app/modules/project/modal-highlight-form/modal-highlight-form.component';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { HighlightService } from 'src/app/services/highlight.service';
import { HighlightByProjectIdService } from 'src/app/services/highlightid.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-settings-dropdown',
  templateUrl: './settings-dropdown.component.html',
  styleUrls: ['./settings-dropdown.component.scss']
})
export class SettingsDropdownComponent implements OnInit {
  @Input() project: Project;
  @Input() currentUser: User;
  @Output() projectHighlighted = new EventEmitter<boolean>();
  @Output() editButtonClicked = new EventEmitter<boolean>();

  public displayEditButton = false;
  public displayDeleteProjectButton = false;
  public displayHighlightButton = false;
  public displayTransferProjectOwnershipButton = false;

  public potentialNewOwnerUserEmail = '';
  private transferGuid: string = null;


  constructor(private projectService: ProjectService,
              private authService: AuthService,
              private highlightService: HighlightService,
              private modalService: BsModalService,
              private alertService: AlertService,
              private highlightByProjectIdService: HighlightByProjectIdService,
              private router: Router) { }

  ngOnInit(): void {
    this.determineDisplayEditAndDeleteProjectButton();
    this.determineDisplayHighlightButton();
  }

  /**
   * Method to close the modal and redirect to a different page
   * @param url the url to redirect to
   */
  public closeModalAndRedirect(url: string) {
    this.hideModalAndRemoveClass();
    this.router.navigate([url]);
  }

  /**
   * Highlight a project by calling the API
   * When Indeterminate checkbox is checked start date and end date fields are disabled and will be null,
   * resulting in an infinite highlight.
   */
  public onClickHighlightButton(canGoBack?: boolean): void {
    if (this.project == null || this.project.id === 0) {
      const alertConfig: AlertConfig = {
        type: AlertType.danger,
        preMessage: 'Project could not be highlighted',
        mainMessage: 'Project id could not be found',
        dismissible: true,
        autoDismiss: true,
        timeout: this.alertService.defaultTimeout
      };
      this.alertService.pushAlert(alertConfig);
      return;
    }

    const modalRef = this.modalService.show(ModalHighlightFormComponent, {initialState: {canGoBack}});

    modalRef.content.confirm
        .pipe(
            switchMap((highlightFormResult: HighlightFormResult) => {
              // Use result of confirm subscription to call the api.
              const highlightAddResource: HighlightAdd = {
                projectId: this.project.id,
                startDate: highlightFormResult.startDate,
                description: highlightFormResult.description,
                endDate: highlightFormResult.endDate,
                imageId: highlightFormResult.imageId
              };

              if (highlightFormResult.indeterminate) {
                highlightAddResource.startDate = null;
                highlightAddResource.endDate = null;
              }

              return this.highlightService.post(highlightAddResource);
            })
        )
        .subscribe(() => {
          const alertConfig: AlertConfig = {
            type: AlertType.success,
            mainMessage: 'Project was successfully highlighted',
            dismissible: true,
            autoDismiss: true,
            timeout: this.alertService.defaultTimeout
          };
          this.alertService.pushAlert(alertConfig);
          this.projectHighlighted.emit(true);
        });

    modalRef.content.goBack.subscribe(() => {
      this.onClickEditHighlightButton();
    });
  }

  /**
   * Method to first open a modal to select project highlight to edit and then the highlight modal form
   */
  public onClickEditHighlightButton(): void {
    this.highlightByProjectIdService
        .getHighlightsByProjectId(this.project.id)
        .subscribe(
            highlights => this.handleHighlightResponse(highlights),
            err => {
              if (err.status === 404) {
                this.onClickHighlightButton(false);
              }
            }
        );
  }

  /**
   * Method which triggers when the delete project button is clicked.
   * Displays the remove modal.
   * Removes the project if modal returned true to confirm the delete.
   */
  public onClickRemoveProject(): void {
    const modalOptions: ModalOptions = {
      initialState: {
        titleText: 'Delete project',
        mainText: `Are you sure you want to delete the project, ${this.project.name}?`,
      }
    };
    // Display modal
    const modalRef = this.modalService.show(ModalDeleteGenericComponent, modalOptions);
    // Map observable back to original type
    const modalRefRemove = modalRef.content.remove;

    // Subscribe to remove event.
    // Call the project remove service if true was returned.
    modalRefRemove.pipe(
        switchMap(deleteProject => {
          if (deleteProject) {
            return this.projectService.delete(this.project.id);
          }
          return EMPTY;
        })
    ).subscribe(() => {
      this.alertService.pushAlert({
        mainMessage: 'Removal of project was successful',
        timeout: this.alertService.defaultTimeout,
        dismissible: true,
        autoDismiss: true,
        type: AlertType.success
      });
      this.modalService.hide(1);
      this.router.navigate(['project/overview']);
    });
  }

  /**
   * Method triggered on transfer ownership button pressed.
   * Opens modal depending on if the project has a existing transfer request.
   */
  public onClickTransferOwnership() {
    this.projectService.checkProjectHasTransferRequest(this.project.id).subscribe(guid => {
      this.transferGuid = guid;
      this.showTransferRequestStatusModal();
    }, () => {
      this.showPotentialNewOwnerUserEmailModal();
    });
  }

  /**
   * Method for showing the potential new owner user email modal.
   */
  private showPotentialNewOwnerUserEmailModal() {
    const modalRefEmail = this.modalService.show(ModalPotentialNewOwnerUserEmailComponent);
    modalRefEmail.content.potentialNewOwnerUserEmailEvent.subscribe((potentialNewOwnerUserEmail: string) => {
      this.potentialNewOwnerUserEmail = potentialNewOwnerUserEmail;
      this.showPotentialNewOwnerUserEmailConfirmationModal();
    });
  }

  /**
   * Method for showing the project ownership transfer request status with
   * possibility to cancel this request.
   */
  private showTransferRequestStatusModal() {
    const modalOptions: ModalOptions = {
      initialState: {
        titleText: 'Transfer ownership request',
        mainText: `Your transfer ownership request for this project is waiting for acceptence or denial.`,
        ctaButtonText: 'Cancel request',
        secondaryButtonText: 'Go back'
      }
    };
    const informationRefModal = this.modalService.show(ModalInformationGenericComponent, modalOptions);
    informationRefModal.content.cta.subscribe(() => {
      this.showDeleteTransferRequestModal();
    });
  }

  /**
   * Method for showing the potential new owner user email confirmation modal.
   */
  private showDeleteTransferRequestModal() {
    const modalOptions: ModalOptions = {
      initialState: {
        titleText: 'Cancel transfer request',
        mainText: `Are you sure you want to cancel the transfer request for this project, ${this.project.name}?`,
      }
    };
    const deleteRefModal = this.modalService.show(ModalDeleteGenericComponent, modalOptions);
    deleteRefModal.content.remove.subscribe(() => {
      this.projectService.deleteTransferRequest(this.transferGuid).subscribe(() => {
        const alertConfig: AlertConfig = {
          type: AlertType.success,
          preMessage: '',
          mainMessage: 'Transfer ownership request canceled',
          dismissible: true,
          autoDismiss: true,
          timeout: 10000
        };
        this.alertService.pushAlert(alertConfig);
      });
    });
  }

  /**
   * Method for asking user to confirm filled in potential new owner user email.
   */
  private showPotentialNewOwnerUserEmailConfirmationModal() {
    const email = this.potentialNewOwnerUserEmail;
    const modalRefEmailConfirm = this.modalService.show(ModalPotentialNewOwnerUserEmailConfirmationComponent, {initialState: {email}});
    modalRefEmailConfirm.content.didConfirmEvent.subscribe(() => {
      this.projectService.initiateTransferProjectOwnership(this.project.id, this.potentialNewOwnerUserEmail).subscribe(() => {
        const alertConfig: AlertConfig = {
          type: AlertType.success,
          preMessage: '',
          mainMessage: 'Transfer ownership request confirmation has been sent to your email inbox',
          dismissible: true,
          autoDismiss: true,
          timeout: 10000
        };
        this.alertService.pushAlert(alertConfig);
      }, () => {
        const alertConfig: AlertConfig = {
          type: AlertType.danger,
          preMessage: '',
          mainMessage: 'Email not sent, make sure you fill in the right email',
          dismissible: true,
          autoDismiss: true,
          timeout: 10000
        };
        this.alertService.pushAlert(alertConfig);
      });
    });
  }

  /**
   * Method to display the edit project button based on the current user and the project user.
   * If the user either has the ProjectWrite scope or is the creator of the project
   */
  private determineDisplayEditAndDeleteProjectButton(): void {
    if (this.currentUser == null || this.project == null || this.project.user == null) {
      this.displayEditButton = false;
      this.displayDeleteProjectButton = false;
      this.displayTransferProjectOwnershipButton = false;
      return;
    }
    if (this.project.user.id === this.currentUser.id ||
        this.authService.currentBackendUserHasScope(scopes.AdminProjectWrite)) {
      this.displayEditButton = true;
      this.displayDeleteProjectButton = true;
      this.displayTransferProjectOwnershipButton = true;
    }
  }

  /**
   * This method will hide the active modal and remove the
   * according class.
   */
  private hideModalAndRemoveClass(): void {
    this.modalService.hide(1);
    document.getElementsByTagName('body')[0].classList.remove('modal-open');
  }

  /**
   * Method to display the highlight buttons based on the current user.
   * If the user either has the HighlightWrite scope.
   */
  private determineDisplayHighlightButton(): void {
    if (this.authService.currentBackendUserHasScope(scopes.HighlightWrite)) {
      this.displayHighlightButton = true;
      return;
    }
    this.displayHighlightButton = false;
  }

  /**
   * Method for opening the highlight-modal-form
   * @param highlights the array of highlights to be displayed in the modals
   */
  private handleHighlightResponse(highlights: Highlight[]) {
    const options = {initialState: {highlights}, class: 'modal-lg highlight-modal'};
    const highlightsModalComponentRef = this.modalService.show(HighlightsModalComponent, options);

    highlightsModalComponentRef.content.selectHighlightToEdit.subscribe(highlight => {
      const formModalRef = this.modalService.show(ModalHighlightFormComponent, {initialState: {highlight, canGoBack: true}});

      formModalRef.setClass('highlight-form-modal');
      formModalRef.content.confirm.pipe(
          switchMap((highlightFormResult: HighlightFormResult) => {
            const highlightAddResource: HighlightUpdate = {
              projectId: this.project.id,
              startDate: highlightFormResult.startDate,
              description: highlightFormResult.description,
              endDate: highlightFormResult.endDate,
              imageId: highlightFormResult.imageId
            };

            if (highlightFormResult.indeterminate) {
              highlightAddResource.startDate = null;
              highlightAddResource.endDate = null;
            }

            return this.highlightService.put(highlight.id, highlightAddResource);
          })
      ).subscribe(() => {
        const alertConfig: AlertConfig = {
          type: AlertType.success,
          mainMessage: 'Highlight was successfully updated',
          dismissible: true,
          autoDismiss: true,
          timeout: this.alertService.defaultTimeout
        };
        this.alertService.pushAlert(alertConfig);
        this.projectHighlighted.emit(true);
      });

      formModalRef.content.goBack.subscribe(() => {
        this.onClickEditHighlightButton();
      });
    });

    highlightsModalComponentRef.content.selectAddHighlight.subscribe(() => {
      this.onClickHighlightButton(true);
    });
  }

  /*
  * method to handle the edit-bottn being clicked
  */
  public onEditButtonClicked() {
    this.editButtonClicked.emit(true);
  }

}
