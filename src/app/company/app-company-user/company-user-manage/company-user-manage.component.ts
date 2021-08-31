import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppUserService } from 'src/app/core/services/app-user.service';
import { Subject } from 'rxjs';
import { SharedService } from 'src/app/core/services/shared.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { Address } from 'src/app/core/model/address';
import * as AppConst from './../../../const';
import { checkSelectedText, emailChack, pasteCheck } from 'src/assets/utils/methods-global';

@Component({
  selector: 'app-company-user-managere',
  templateUrl: './company-user-manage.component.html',
  styleUrls: ['./company-user-manage.component.scss'],
})
export class CompanyUserManageComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,
    private userService: AppUserService,
    private spinner: SpinnerService,
    private notification: NotificationService,
    private shared: SharedService
  ) {}
  @Input() inputData: any;
  @ViewChild('addressInput') addressInput: ElementRef;
  public usersForm: FormGroup;
  public userTypes = AppConst.USER_TYPES;
  private destroy$: Subject<void> = new Subject<void>();
  public passwordType = 'text';
  public options = {
    componentRestrictions: { country: ['US', 'CA'] },
  };
  public modalTitle: string;
  isValidAddress = false;
  address: Address;
  public disableUserType = false;
  loading = false;

  public fomratType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;

  ngOnInit() {
    if (this.inputData.data.type === 'new') {
      this.modalTitle = 'New user';
      this.loading = true;
      this.createNewForm();
    } else if (this.inputData.data.type === 'edit') {
      this.modalTitle = 'Edit user';
      this.createEditForm();
      this.setForm();
    }
    setTimeout(() => {
      this.transformInputData();
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.passwordType = 'password';
    }, 500);
  }

  /**
   * Create edit form function
   */
  public createEditForm() {
    this.usersForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [
        '',
        [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)],
      ],
      phone: [''],
      address: [''],
      addressUnit: '',
      userType: [undefined, Validators.required],
      enabled: [true, Validators.required],
    });
  }

  /**
   * Create new form function
   */
  public createNewForm() {
    this.usersForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [
        '',
        [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)],
      ],
      phone: [''],
      address: this.address,
      addressUnit: '',
      userType: [undefined, Validators.required],
      enabled: [true],
    });
  }

  private transformInputData() {
    const data = {
      firstName: 'capitalize',
      lastName: 'capitalize',
      email: 'lower',
      addressUnit: 'upper',
    };

    this.shared.handleInputValues(this.usersForm, data);
  }

  /**
   * Set form function
   */
  public setForm() {
    this.loading = true;
    console.log(this.inputData);
    this.disableUserType = this.inputData.data.user.userType === 'company_owner' || this.inputData.data.user.baseUserType === 'company_owner';

    this.usersForm.setValue({
      firstName: this.handleUserName(this.inputData.data.user.userFullName, true),
      lastName: this.handleUserName(this.inputData.data.user.userFullName, false),
      email: this.inputData.data.user.email,
      phone: this.inputData.data.user.doc.phone ? this.inputData.data.user.doc.phone : '',
      address: this.inputData.data.user.doc.address
        ? this.inputData.data.user.doc.address.address
        : '',
      addressUnit: this.inputData.data.user.doc.addressUnit
        ? this.inputData.data.user.doc.addressUnit
        : '',
      userType: this.inputData.data.user.doc.userType
        ? this.inputData.data.user.doc.userType
        : null,
      enabled: this.inputData.data.user.status,
    });
    if (
      Object.keys(this.inputData.data.user.doc).length > 0 &&
      this.inputData.data.user.doc.address?.address !== ''
    ) {
      this.address = this.inputData.data.user.doc.address;
      this.isValidAddress = true;
    }
    this.shared.touchFormFields(this.usersForm);
  }

  handleUserName(userFullName: string, isFirstName: boolean) {
    let count = 0;
    let newValue = '';
    if (isFirstName) {
      for (const nameCharacter of userFullName) {
        if (nameCharacter === ' ') {
          count++;
        }
        if (!count) {
          newValue += nameCharacter;
        }
      }
      return newValue;
    } else {
      for (const nameCharacter of userFullName) {
        if (count) {
          newValue += nameCharacter;
        }
        if (nameCharacter === ' ') {
          count++;
        }
      }
      return newValue;
    }
  }

  public handleAddressChange(address: any) {
    this.isValidAddress = true;
    this.address = this.shared.selectAddress(this.usersForm, address);
  }

  addressKeyDown(event: any) {
    this.isValidAddress = false;
    this.address = null;
  }

  /**
   * Key down function
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
      this.saveUser();
    }
  }

  /**
   * Close modal function
   */
  public closeModal() {
    this.activeModal.close();
  }

  /**
   * Save user function
   */
  public saveUser() {
    this.userService.reloadUserTabel = true;
    if (!this.shared.markInvalid(this.usersForm)) {
      return false;
    }

    const user = this.usersForm.value;

    if (this.inputData.data.type === 'new') {
      const saveDataNew = {
        email: user.email,
        userType: user.userType.name.toLowerCase(),
        firstName: user.firstName,
        lastName: user.lastName,
        doc: {
          address: this.address,
          addressUnit: user.addressUnit,
          userType: user.userType,
          phone: user.phone,
        },
      };

      this.userService.createUser(saveDataNew)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.usersForm.reset();
          this.notification.success('User added successfully.', 'Success:');
          this.spinner.show(false);
          this.closeModal();
        },
        () => {
          this.shared.handleServerError();
        }
      );
    } else if (this.inputData.data.type === 'edit') {
      const saveDataEdit = {
        email: user.email,
        userType: user.userType.name.toLowerCase(),
        firstName: user.firstName,
        lastName: user.lastName,
        doc: {
          address: this.address,
          addressUnit: user.addressUnit,
          userType: user.userType,
          phone: user.phone,
        },
      };

      this.userService.updateUser(this.inputData.data.user.id, saveDataEdit)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.usersForm.reset();
          this.notification.success('User changed successfully.', 'Success:');
          this.spinner.show(false);
          console.log(res);
          this.closeModal();
        },
        () => {
          this.shared.handleServerError();
        }
      );
    }
  }

  onEmailTyping(event) {
    return emailChack(event);
  }
  onPaste(event: any, inputID: string, index?: number) {
    event.preventDefault();

    if (index !== undefined) {
      (document.getElementById(inputID + index) as HTMLInputElement).value = checkSelectedText(
        inputID,
        index
      );
    } else {
      (document.getElementById(inputID) as HTMLInputElement).value = checkSelectedText(
        inputID,
        index
      );
    }

    if (inputID === 'firstName' || inputID === 'lastName') {
      this.fomratType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.fomratType,
        false
      );
    } else if (inputID === 'email') {
      this.fomratType = /^[!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.fomratType,
        false
      );
    }

    this.usersForm.controls[inputID].patchValue(
      (document.getElementById(inputID) as HTMLInputElement).value
    );
  }

  onNameTyping(event) {
    let k;
    k = event.charCode;
    console.log(k);
    return (k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32;
  }

  manageInputValidation(formElement: any) {
    return this.shared.manageInputValidation(formElement);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
