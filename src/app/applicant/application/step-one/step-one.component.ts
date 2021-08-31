import { takeUntil } from 'rxjs/operators';
import { ApplicantStore } from './../../service/applicant.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Subject, Observable, from } from 'rxjs';
import { SharedService } from 'src/app/core/services/shared.service';
import { checkSelectedText, emailChack, pasteCheck } from 'src/assets/utils/methods-global';
import { createTriggerForm, createTriggerAddress } from '../../animation/applicants.animation';
import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import { environment } from 'src/environments/environment';
import moment from 'moment';
import { ApplicantOpenService } from '../../service/applicant-open.service';
import { ApplicantReviewService } from '../../service/applicant-review.service';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss'],
  animations: [createTriggerForm('animateForm'), createTriggerAddress('animateAddress')],
})
export class StepOneComponent implements OnInit {

  constructor(
    private shared: SharedService,
    private openApplicant: ApplicantOpenService,
    private storeApplicant: ApplicantStore,
    private reviewApplicant: ApplicantReviewService
  ) {}

  get getAddress(): FormArray {
    return this.personalInfo.get('previousAddresses') as FormArray;
  }
  personalInfo: FormGroup;

  // State for previous addresses and entering form
  state = 'out';
  stateForm: string;

  isAgreement = true;
  hasOtherName = false;
  hasfelony = false;
  hasMisdemeanor = false;
  hasDUIDWIOVI = false;

  // Bank
  newBank = '';
  newBankVisible = false;
  bankInfoRequired: boolean;
  bankSearchItems = 0;
  bankData: any[];

  // Deleting DropDown OpenClose for address
  openDropDeleteDialogAddress = [
    {
      value: false,
    },
  ];

  // Company review
  companyReview?: any = [];
  isCompanyReview = false;
  isSomeFalseReview?: any[] = []; // treba da se sacuva na back-u

  public options = {
    componentRestrictions: { country: ['US', 'CA'] },
  };

  // Kedno date
  format: FormatSettings = environment.dateFormat;
  maxYear: Date = new Date(moment().subtract(18, 'year').format('YYYY-MM-DD'));

  private destroy$: Subject<void> = new Subject<void>();

  // Methods for address input to save right value

  address: any;
  isValidAddress = false;

  // Methods for manipulation with user input

  public formatType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]*$/;
  public numOfSpaces = 0;

  public numOfSpaces2 = 0;

  ngOnInit(): void {
    this.isAgreement == true ? (this.stateForm = 'in') : (this.stateForm = 'out');
    this.InitForm();
    this.getBanks(false);

      this.storeApplicant.reviewCompany
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => (this.isCompanyReview = data));

    if (this.isCompanyReview) {
      // Hard Code disable routing and accounting, old addresses
      this.personalInfo.get('routingNumber').disable();
      this.personalInfo.get('accountNumber').disable();
      if (this.getAddress.length > 0) {
        for (let i = 0; i < this.getAddress.length; i++) {
          this.getAddress.at(i).get('oldAddress').disable();
          this.getAddress.at(i).get('oldUnit').disable();
        }
      }
      this.companyReview = this.reviewApplicant.companyReviewStepOne;
      this.reviewApplicant.singleItemReview
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        Object.keys(data).forEach((item) => {
          Object.entries(this.companyReview).forEach(([key]) => {
            Object.entries(this.companyReview[key]).forEach(([key2]) => {
              if (item === key2) {
                Object.values(data).forEach((value) => {
                  this.companyReview[key][key2] = value;
                });
              }
            });
          });
        });
      });
    } else {
      // Load data from session storage
      if (this.storeApplicant.getForm('personalInfo')) {
        this.reloadData(this.storeApplicant.getForm('personalInfo'));
      }
    }
    this.reloadData(this.storeApplicant.getForm('personalInfo'));
  }

  private InitForm() {
    this.personalInfo = new FormGroup({
      isAgreement: new FormControl(false, Validators.requiredTrue),
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      birthday: new FormControl(null, Validators.required),
      personalPhone: new FormControl(null, Validators.required),
      email: new FormControl(null, [
        Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
        Validators.required,
      ]),
      address: new FormControl(null, Validators.required),
      addressUnit: new FormControl(null),
      ssn: new FormControl(null, Validators.required),
      bankData: new FormControl(null),
      accountNumber: new FormControl(null, [Validators.minLength(4), Validators.maxLength(17)]),
      routingNumber: new FormControl(null),
      legalWork: new FormControl(null, Validators.required),
      anotherName: new FormControl(null, Validators.required),
      explainAnotherName: new FormControl(null),
      inMilitary: new FormControl(null, Validators.required),
      felony: new FormControl(null, Validators.required),
      explainFelony: new FormControl(null),
      misdemeanor: new FormControl(null, Validators.required),
      explainMisdemeanor: new FormControl(null),
      drunkDriving: new FormControl(null, Validators.required),
      explainDrunkDriving: new FormControl(null),
      previousAddresses: new FormArray([]),
    });
    this.requiredBankInfo(false);
    setTimeout(() => {
      this.transformInputData();
    });
  }

  onSubmit() {
    if (this.isCompanyReview) {
      if (this.isSomeFalseReview.length === 0) {
        this.isAllCorrectly(true);
        this.reviewApplicant.reviewStepOne.next(true);
      } else {
        this.reviewApplicant.reviewStepOne.next(false);
        for (const item of this.companyReview) {
          item.isTrue = true;
        }
        for (const item1 of this.isSomeFalseReview) {
          for (const item2 of this.companyReview) {
            if (item1.id === item2.id) {
              item2.isTrue = false;
            }
          }
        }
      }
    } else {
      if (!this.shared.markInvalid(this.personalInfo)) {
        return false;
      }
      this.storeApplicant.saveForm(0, this.personalInfo.value, 'personalInfo');
    }
    this.storeApplicant.stepForward.emit(2);
  }

  // Load data from session storage
  private reloadData(data: any) {
    if (data != null) {
      this.isAgreement = true;

      this.personalInfo.patchValue({
        isAgreement: data.isAgreement,
        firstName: data.firstName,
        lastName: data.lastName,
        birthday: new Date(data.birthday),
        personalPhone: data.personalPhone,
        email: data.email,
        address: data.address,
        addressUnit: data.addressUnit,
        ssn: data.ssn,
        bankData: data.bankData ? data.bankData : null,
        accountNumber: data.accountNumber ? data.accountNumber : null,
        routingNumber: data.routingNumber ? data.routingNumber : null,
        legalWork: data.legalWork,
        anotherName: data.anotherName,
        explainAnotherName: data.explainAnotherName ? data.explainAnotherName : null,
        inMilitary: data.inMilitary,
        felony: data.felony,
        explainFelony: data.explainFelony ? data.explainFelony : null,
        misdemeanor: data.misdemeanor,
        explainMisdemeanor: data.explainMisdemeanor ? data.explainMisdemeanor : null,
        drunkDriving: data.drunkDriving,
        explainDrunkDriving: data.explainDrunkDriving ? data.explainDrunkDriving : null,
        previousAddresses: [],
      });

      if (data.previousAddresses.length != 0 && data.previousAddresses != null) {
        this.state = 'in';
        for (let i = 0; i < data.previousAddresses.length; i++) {
          this.addAddress();
          this.getAddress.at(i).patchValue({
            oldAddress: data.previousAddresses[i].oldAddress,
            oldUnit: data.previousAddresses[i].oldUnit,
          });
        }
      } else {
        this.getAddress.controls = [];
      }

      if (data.anotherName == 'yes') {
        this.hasOtherName = true;
      }
      if (data.felony == 'yes') {
        this.hasfelony = true;
      }
      if (data.misdemeanor == 'yes') {
        this.hasMisdemeanor = true;
      }
      if (data.drunkDriving == 'yes') {
        this.hasDUIDWIOVI = true;
      }

      if (!this.shared.markInvalid(this.personalInfo)) {
        return false;
      }

      if (this.personalInfo.get('accountNumber').value != null) {
        this.personalInfo.get('accountNumber').enable();
        this.bankInfoRequired = true;
      }
      if (this.personalInfo.get('routingNumber').value != null) {
        this.personalInfo.get('routingNumber').enable();
        this.bankInfoRequired = true;
      }
    }
  }

  // Method for animatiting
  ToggleState(): void {
    if (this.isCompanyReview) {
      return;
    }
    this.state == 'out' ? (this.state = 'in') : (this.state = 'out');
    this.state == 'in' ? this.addAddress() : this.deleteAllAddress();
  }

  addAddress() {
    if (this.getAddress.invalid) {
      return;
    }
    if (this.getAddress.length < 5) {
      this.getAddress.push(
        new FormGroup({
          oldAddress: new FormControl(null, Validators.required),
          oldUnit: new FormControl(null),
        })
      );
    }
    this.openDropDeleteDialogAddress.push({
      value: false,
    });
  }

  deleteAddress(index: number) {
    this.getAddress.removeAt(index);
    this.getAddress.length < 1 ? (this.state = 'out') : '';
  }

  deleteAllAddress() {
    this.getAddress.controls = [];
    this.deleteAddress(0);
  }

  onDeleteCurrentAddress(canDelete: boolean, indk?: number) {
    this.openDropDeleteDialogAddress[indk].value = false;
    if (canDelete) {
      this.deleteAddress(indk);
    }
  }

  isDeleteCurrentAddress(indk: number) {
    this.openDropDeleteDialogAddress[indk].value = true;
    for (let i = 0; i < this.openDropDeleteDialogAddress.length; i++) {
      if (i != indk) {
        this.openDropDeleteDialogAddress[i].value = false;
      }
    }
  }

  questionsWithExplanation(value: any, formControlAction: any, formControl: any) {
    if (value == 'yes') {
      switch (formControlAction) {
        case 'anotherName':
          this.hasOtherName = true;
          break;
        case 'drunkDriving':
          this.hasDUIDWIOVI = true;
          break;
        case 'felony':
          this.hasfelony = true;
          break;
        case 'misdemeanor':
          this.hasMisdemeanor = true;
          break;
        default:
          break;
      }

      this.personalInfo.get(formControl).reset();
      this.personalInfo.get(formControl).enable();
      this.personalInfo.get(formControl).setValidators(Validators.required);
    } else {
      switch (formControlAction) {
        case 'anotherName':
          this.hasOtherName = false;
          break;
        case 'drunkDriving':
          this.hasDUIDWIOVI = false;
          break;
        case 'felony':
          this.hasfelony = false;
          break;
        case 'misdemeanor':
          this.hasMisdemeanor = false;
          break;
        default:
          break;
      }

      this.clearValidate(this.personalInfo.get(formControl));
      this.personalInfo.get(formControl).patchValue(null);
      this.personalInfo.get(formControl).disable();
    }
  }

  // Methods for banks
  getBanks(loadNewBank: boolean) {
    this.openApplicant.getBankList()
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (result: any[]) => {
        result.push({
          bankLogo: null,
          bankLogoWide: null,
          bankName: 'Add new',
          companyId: null,
          id: 0,
        });
        result.sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0));
        this.bankData = result;
        if (loadNewBank) {
          this.personalInfo.controls.bankData.patchValue(result[result.length - 1]);
        }
      },
      (error: HttpErrorResponse) => {
        this.shared.handleError(error);
      }
    );
  }

  onBankChange(event: any) {
    this.requiredBankInfo(event !== undefined ? true : false);
    if (event !== undefined && event.id === 0) {
      this.personalInfo.get('bankData').reset();
      this.newBankVisible = true;
      setTimeout(() => {
        document.getElementById('newBank').focus();
      }, 250);
    }
  }

  requiredBankInfo(state: boolean) {
    if (state) {
      this.personalInfo.get('accountNumber').enable();
      this.personalInfo.get('routingNumber').enable();
      this.personalInfo.get('accountNumber').setValidators(Validators.required);
      this.personalInfo
        .get('routingNumber')
        .setValidators([Validators.required, Validators.minLength(9)]);
      this.bankInfoRequired = true;
    } else {
      this.personalInfo.get('accountNumber').reset();
      this.personalInfo.get('routingNumber').reset();
      this.personalInfo.get('accountNumber').disable();
      this.personalInfo.get('routingNumber').disable();
      this.personalInfo.get('accountNumber').clearValidators();
      this.personalInfo.get('routingNumber').clearValidators();
      this.personalInfo.get('routingNumber').setValidators(Validators.required);
      this.bankInfoRequired = false;
    }
    this.personalInfo.get('routingNumber').updateValueAndValidity();
    this.personalInfo.get('accountNumber').updateValueAndValidity();
  }

  saveNewBank() {
    const data = {
      domain: 'bank',
      key: 'name',
      value: this.newBank,
      protected: 0,
    };

    this.openApplicant.createMetadata(data)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (resp: any) => {
        this.closeNewBank();
        this.getBanks(true);
      },
      (error: HttpErrorResponse) => {
        this.shared.handleError(error);
      }
    );
  }

  closeNewBank() {
    this.newBankVisible = false;
    this.newBank = '';
  }

  onBankKeyPress(event: any) {
    if (event.charCode == 13) {
      this.saveNewBank();
    }
  }

  customSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.bankName.toLocaleLowerCase().indexOf(term) > -1 || item.id === 0;
  }

  onSearch(event: any) {
    this.bankSearchItems = event.items.length;
  }

  onClose(event: any) {
    this.bankSearchItems = 0;
  }

  deleteBank(id: number) {
    this.openApplicant.deleteBank(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (resp: any) => {
        this.getBanks(false);
      },
      (error: HttpErrorResponse) => {
        this.shared.handleError(error);
      }
    );
    setTimeout(() => {
      this.personalInfo.get('bankData').reset();
    });
  }

  // Feedback review

  // main buttons
  feedbackReview(data) {
    const index = this.isSomeFalseReview.findIndex((item) => item.id === data.id);
    if (data.isTrue) {
      this.reviewApplicant.reviewStepOne.next(data);
    } else {
      this.isSomeFalseReview.push(data);
      this.reviewApplicant.reviewStepOne.next(data);
    }

    if (index !== -1 && data.isTrue) {
      this.isSomeFalseReview.splice(index, 1);
    }
  }

  isAllCorrectly(event) {
    const reviews = this.companyReview;
    if (event) {
      for (const review of reviews) {
        Object.entries(review).forEach(([key]) => {
          if (key === 'id') {
            return;
          } else if (key === 'reviewerExplanation') {
            review[key] = '';
            return;
          } else if (key === 'isTrue') {
            review[key] = true;
          }
          Object.entries(review[key]).forEach(([key2]) => {
            review[key][key2] = true;
          });
        });
      }
    }
    this.companyReview = reviews;
    this.reviewApplicant.reviewStepOne.next(true);
  }
  public handleAddressChange(address: any) {
    this.isValidAddress = true;
    this.address = this.shared.selectAddress(this.personalInfo, address);

    this.personalInfo.get('address').patchValue(this.address.address);
  }

  public handleAddressChange2(address: any, index: number) {
    this.isValidAddress = true;
    this.address = this.shared.selectAddress(this.personalInfo, address);
    this.getAddress.at(index).get('oldAddress').patchValue(this.address.address);
  }
  onPaste(event: any, inputID: string, index?: number) {
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

    this.numOfSpaces = 0;

    event.preventDefault();
    if (inputID === 'ssn') {
      this.formatType = /^[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?A-Za-z]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        false
      );
    } else if (inputID === 'email') {
      this.formatType = /^[!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        false
      );
    } else if (inputID === 'accountNumber' || inputID === 'routingNumber') {
      this.formatType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?A-Za-z]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        false
      );
    } else if (
      inputID === 'explainAnotherName' ||
      inputID === 'explainFelony' ||
      inputID === 'explainMisdemeanor' ||
      inputID === 'explainDrunkDriving'
    ) {
      this.formatType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        false
      );
    } else {
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        false
      );
    }

    this.personalInfo.controls[inputID].patchValue(
      (document.getElementById(inputID) as HTMLInputElement).value
    );
  }

  onEmailTyping(event) {
    return emailChack(event);
  }
  onDescriptionTyping(event) {
    let k;
    k = event.charCode;
    if (k == 32) {
      this.numOfSpaces2++;
    } else {
      this.numOfSpaces2 = 0;
    }
    if (this.numOfSpaces2 < 2) {
      return (
        (k > 64 && k < 91) ||
        (k > 96 && k < 123) ||
        k == 8 ||
        k == 32 ||
        (k >= 48 && k <= 57) ||
        k == 45
      );
    } else {
      event.preventDefault();
    }
  }

  manageInputValidation(formElement: any) {
    return this.shared.manageInputValidation(formElement);
  }

  private transformInputData() {
    const data = {
      firstName: 'capitalize',
      lastName: 'capitalize',
      email: 'lower',
      addressUnit: 'upper',
      explainDrunkDriving: 'capitalize',
      explainMisdemeanor: 'capitalize',
      explainFelony: 'capitalize',
      explainAnotherName: 'capitalize',
    };
    this.shared.handleInputValues(this.personalInfo, data);
  }

  clearValidate(form: AbstractControl) {
    form.clearValidators();
    form.updateValueAndValidity();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
