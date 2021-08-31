import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { AppUserService } from '../../services/app-user.service';
import { SpinnerService } from '../../services/spinner.service';
import { UserProfile } from '../../model/user-profile';
import { ClonerService } from '../../services/cloner-service';
import { EditProfileImageComponent } from 'src/app/shared/edit-profile-image/edit-profile-image.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  @ViewChild(EditProfileImageComponent) editProfileImageComponent: EditProfileImageComponent;
  @Input() inputData: UserProfile;
  public changePasswordForm: FormGroup;
  public profileForm: FormGroup;
  componentLoaded = false;
  selectedTab = 1;

  tabs = [
    {
      id: 1,
      name: 'Basic'
    },
    {
      id: 2,
      name: 'Additional'
    },
  ];

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private spinner: SpinnerService,
    private notification: NotificationService,
    private userService: AppUserService,
    private shared: SharedService,
    private clonerService: ClonerService
  ) {}

  private transformInputData() {
    const data = {
      addressUnit: 'upper',
    };

    this.shared.handleInputValues(this.profileForm, data);
  }

  ngOnInit(): void {
    this.createForm();
    this.setForm();
    setTimeout(() => {
      this.componentLoaded = true;
    }, 2000);

    setTimeout(() => {
      this.transformInputData();
    });
  }

  private createForm() {
    this.profileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: '',
      email: [
        '',
        [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)],
      ],
      password: [undefined],
      confirmPassword: [undefined],
      avatar: [null],
    });
  }

  private setForm() {
    this.profileForm.controls.firstName.setValue(this.inputData.firstName);
    this.profileForm.controls.lastName.setValue(this.inputData.lastName);
    this.profileForm.controls.phone.setValue(this.inputData.doc.phone);
    this.profileForm.controls.email.setValue(this.inputData.email);
    this.profileForm.controls.avatar.setValue(
      this.inputData &&
        this.inputData.doc &&
        this.inputData.doc.avatar
        ? this.inputData.doc.avatar
        : null
    );
    this.shared.touchFormFields(this.profileForm);
  }

  /**
   * Close modal function
   */
  public closeModal() {
    this.activeModal.close();
  }

  /**
   * Keydown function
   *
   * @param event Any
   */
  public keyDownFunction(event: any) {
    if (
      event.keyCode === 13 &&
      event.target.localName !== 'textarea' &&
      event.path !== undefined &&
      event.path !== null &&
      event.path[3].className !== 'ng-select-container ng-has-value'
    ) {
      this.changePassword();
    }
  }

  /**
   * Change password function
   */
  public changePassword() {
    if (!this.shared.markInvalid(this.profileForm)) {
      return false;
    }

    if (
      this.profileForm.controls.password.value !== undefined &&
      this.profileForm.controls.confirmPassword.value !== undefined
    ) {
      if (
        this.profileForm.controls.password.value !== this.profileForm.controls.confirmPassword.value
      ) {
        this.notification.warning('Confirm password field is incorrect.', 'Warning:');
        return;
      }
    }

    const saveData: UserProfile = this.clonerService.deepClone<UserProfile>(this.inputData);
    saveData.password =
      this.profileForm.controls.password.value !== null &&
      this.profileForm.controls.password.value !== ''
        ? this.profileForm.controls.password.value
        : undefined;
    saveData.firstName = this.profileForm.controls.firstName.value;
    saveData.lastName = this.profileForm.controls.lastName.value;
    saveData.doc.phone = this.profileForm.controls.phone.value;
    saveData.doc.avatar = this.profileForm.controls.avatar.value
      ? this.profileForm.controls.avatar.value
      : null;

    this.userService.updateUser(this.inputData.id, saveData).subscribe(
      (resp: any) => {
        this.notification.success('Profile has been updated.', 'Success:');
        this.closeModal();
      },
      (error: any) => {
        this.shared.handleServerError();
      }
    );
  }

  private getAvatarUUID(): number {
    return this.inputData && this.inputData.doc && this.inputData.doc.avatar && this.inputData.doc.avatar.id ? this.inputData.doc.avatar.id : uuidv4();
  }

  public callSaveAvatar(event: any) {
    const avatar = {
      id: this.getAvatarUUID(),
      src: event,
    };

    this.profileForm.controls.avatar.setValue(avatar);
    this.inputData.doc.avatar = avatar;
    this.changePassword();
  }

  public saveData() {
    this.editProfileImageComponent.saveImage();
  }

  public tabChange(ev: any) {
    this.selectedTab = ev.id;
  }

  manageInputValidation(formElement: any) {
    return this.shared.manageInputValidation(formElement);
  }
}
