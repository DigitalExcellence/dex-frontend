import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/domain/user';
import { AlertConfig } from 'src/app/models/internal/alert-config';
import { AlertType } from 'src/app/models/internal/alert-type';
import { UserEditResource } from 'src/app/models/resources/user-edit';
import { AlertService } from 'src/app/services/alert.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit, OnChanges {

  @Input() user: User;

  public editProfileForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertService
  ) {
    this.editProfileForm = this.formBuilder.group({
      name: [null, Validators.required],
      email: [null, Validators.required],
      profileUrl: [null, Validators.required],
    });
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.user) {
      // Map the user to a new object to only extract the form related properties.
      const formUser = {
        name: this.user.name,
        email: this.user.email.toLowerCase(),
        profileUrl: this.user.profileUrl
      };
      this.editProfileForm.setValue(formUser);
    }
  }

  /**
   * Method which triggers when the submit button gets pressed;
   */
  public onClickSubmit(): void {
    const alertConfig: AlertConfig = {
      type: AlertType.success,
      mainMessage: 'User was succesfully updated',
      dismissible: true,
      timeout: this.alertService.defaultTimeout
    };
    this.alertService.pushAlert(alertConfig);
    if (this.editProfileForm.invalid) {
      return;
    }
    const userEditResource: UserEditResource = {
      ...this.editProfileForm.value,
      profileUrl: this.user.profileUrl
    };

    this.userService
      .put(this.user.id, userEditResource)
      .subscribe(() => {
        const alertConfig: AlertConfig = {
          type: AlertType.success,
          mainMessage: 'User was succesfully updated',
          dismissible: true,
          timeout: this.alertService.defaultTimeout
        };
        this.alertService.pushAlert(alertConfig);
      }, () => {
        const alertConfig: AlertConfig = {
          type: AlertType.danger,
          mainMessage: 'User could not be updated',
          dismissible: true,
          timeout: this.alertService.defaultTimeout
        };
        this.alertService.pushAlert(alertConfig);
      });
  }

}
