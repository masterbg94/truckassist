import { takeUntil } from 'rxjs/operators';
import { ApplicantReviewService } from './../../service/applicant-review.service';
import { ApplicantStore } from './../../service/applicant.service';
import { Component, OnInit} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/core/services/shared.service';
import { checkSelectedText, pasteCheck } from 'src/assets/utils/methods-global';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-step-eight',
  templateUrl: './step-eight.component.html',
  styleUrls: ['./step-eight.component.scss'],
})
export class StepEightComponent implements OnInit {

  constructor(private shared: SharedService, private storeApplicant: ApplicantStore, private reviewApplicant: ApplicantReviewService) {}
  drugAlchocol: FormGroup;

  step8YesNo = false;

  public options = {
    componentRestrictions: { country: ['US', 'CA'] },
  };

   // Company review
   companyReview?: any = [];
   isCompanyReview?: any;
   isSomeFalseReview?: any[] = []; // treba da se sacuva na back-u

   private destroy$: Subject<void> = new Subject<void>();

  address: any;
  isValidAddress = false;

  public numOfSpaces = 0;
  public isEmployer = true;
  public firstWords: boolean;
  isBusiness = true;
  formatType = /^[!^()_\\[\]{};':"\\|<>\/?]*$/;

  ngOnInit(): void {

    this.storeApplicant.reviewCompany
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => (this.isCompanyReview = data));

    if (this.isCompanyReview) {
      this.companyReview = this.reviewApplicant.companyReviewStepEight;
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
    }

    this.InitForm();
    this.reloadData(JSON.parse(sessionStorage.getItem('drugAlcohol')));
  }

  private InitForm() {
    (this.drugAlchocol = new FormGroup({
      isTestTwoYears: new FormControl(null, Validators.required),
      motorCarrier: new FormControl(null),
      motorPhone: new FormControl(null),
      addressMotor: new FormControl(null),
      addressMotorUnit: new FormControl(null),
      nameSAP: new FormControl(null),
      SAPhone2: new FormControl(null),
      addressSAP2: new FormControl(null),
      addressSAP2Unit: new FormControl(null),
      isCertify: new FormControl(null),
    })),
      setTimeout(() => {
        this.transformInputData();
      });
  }
  reloadData(data: any) {
    if (data != null) {
      if (data.isTestTwoYears == 'yes') {
        this.step8YesNo = true;
        this.drugAlchocol.patchValue({
          isTestTwoYears: data.isTestTwoYears,
          motorCarrier: data.motorCarrier,
          motorPhone: data.motorPhone,
          addressMotor: data.addressMotor,
          addressMotorUnit: data.addressMotorUnit,
          nameSAP: data.nameSAP,
          SAPhone2: data.SAPhone2,
          addressSAP2: data.addressSAP2,
          addressSAP2Unit: data.addressSAP2Unit,
          isCertify: data.isCertify,
        });
        if (!this.shared.markInvalid(this.drugAlchocol)) {
          return false;
        }
      } else {
        this.drugAlchocol.get('isTestTwoYears').patchValue(data.isTestTwoYears);
      }
    }
  }

  onSubmit() {
    if (!this.isCompanyReview) {
      if (!this.shared.markInvalid(this.drugAlchocol)) {
        return false;
      }
      this.storeApplicant.saveForm(7, this.drugAlchocol.value, 'drugAlcohol');
    } else {
      if (this.isSomeFalseReview.length === 0) {
        this.reviewApplicant.reviewStepEight.next(true);
        this.isAllCorrectly(true);
      } else {
        this.reviewApplicant.reviewStepEight.next(false);
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
    }
    this.storeApplicant.stepForward.emit(9);
  }

  stepBack() {
    this.storeApplicant.stepForward.emit(7);
  }

  // Feedback review
  feedbackReview(data) {
    const index = this.isSomeFalseReview.findIndex((item) => item.id === data.id);
    if (data.isTrue) {
      this.reviewApplicant.reviewStepEight.next(data);
    } else {
      this.isSomeFalseReview.push(data);
      this.reviewApplicant.reviewStepEight.next(data);
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
    this.reviewApplicant.reviewStepEight.next(true);
  }

  onItemChange(value) {
    if (value == 'yes') {
      this.step8YesNo = true;
      this.drugAlchocol.get('motorCarrier').setValidators(Validators.required);
      this.drugAlchocol.get('motorPhone').setValidators(Validators.required);
      this.drugAlchocol.get('addressMotor').setValidators(Validators.required);
      this.drugAlchocol.get('nameSAP').setValidators(Validators.required);
      this.drugAlchocol.get('SAPhone2').setValidators(Validators.required);
      this.drugAlchocol.get('addressSAP2').setValidators(Validators.required);
      this.drugAlchocol.get('isCertify').setValidators(Validators.required);
      this.drugAlchocol.get('motorCarrier').enable();
      this.drugAlchocol.get('motorPhone').enable();
      this.drugAlchocol.get('addressMotor').enable();
      this.drugAlchocol.get('addressMotorUnit').enable();
      this.drugAlchocol.get('nameSAP').enable();
      this.drugAlchocol.get('SAPhone2').enable();
      this.drugAlchocol.get('addressSAP2').enable();
      this.drugAlchocol.get('addressSAP2Unit').enable();
      this.drugAlchocol.get('isCertify').enable();
    } else {
      this.step8YesNo = false;
      this.clearValidate(this.drugAlchocol.get('motorCarrier'));
      this.clearValidate(this.drugAlchocol.get('motorPhone'));
      this.clearValidate(this.drugAlchocol.get('addressMotor'));
      this.clearValidate(this.drugAlchocol.get('nameSAP'));
      this.clearValidate(this.drugAlchocol.get('SAPhone2'));
      this.clearValidate(this.drugAlchocol.get('addressSAP2'));
      this.clearValidate(this.drugAlchocol.get('isCertify'));
      this.drugAlchocol.get('motorCarrier').disable();
      this.drugAlchocol.get('motorPhone').disable();
      this.drugAlchocol.get('addressMotor').disable();
      this.drugAlchocol.get('addressMotorUnit').disable();
      this.drugAlchocol.get('nameSAP').disable();
      this.drugAlchocol.get('SAPhone2').disable();
      this.drugAlchocol.get('addressSAP2').disable();
      this.drugAlchocol.get('addressSAP2Unit').disable();
      this.drugAlchocol.get('isCertify').disable();
    }
  }

  clearValidate(form: AbstractControl) {
    form.clearValidators();
    form.updateValueAndValidity();
  }
  public handleAddressChange(address: any) {
    this.isValidAddress = true;
    this.address = this.shared.selectAddress(this.drugAlchocol, address);

    this.drugAlchocol.get('addressMotor').patchValue(this.address.address);
  }

  public handleAddressChange2(address: any) {
    this.isValidAddress = true;
    this.address = this.shared.selectAddress(this.drugAlchocol, address);
    this.drugAlchocol.get('addressSAP2').patchValue(this.address.address);
  }

  private transformInputData() {
    const data = {
      motorCarrier: 'upper',
      nameSAP: 'upper',
    };
    this.shared.handleInputValues(this.drugAlchocol, data);
  }
  onPaste(event: any, inputID: string, limitCarakters?: number, index?: number) {
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

    this.numOfSpaces = 0;

    if (inputID === 'desc') {
      this.formatType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        false
      );
    } else {
      if ((document.getElementById(inputID) as HTMLInputElement).value !== '') {
        this.firstWords = false;
      } else {
        this.firstWords = true;
      }
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        true,
        this.isBusiness,
        this.firstWords
      );
    }
    this.drugAlchocol.controls[inputID].patchValue(
      (document.getElementById(inputID) as HTMLInputElement).value
    );
  }

  onNameTyping(event) {
    let k;
    k = event.charCode;
    if (k == 32) {
      this.numOfSpaces++;
    } else {
      this.numOfSpaces = 0;
    }
    if (
      (document.getElementById('motorCarrier') as HTMLInputElement).value === '' ||
      (document.getElementById('nameSAP') as HTMLInputElement).value === ''
    ) {
      if (
        event.key === '*' ||
        event.key === '=' ||
        event.key === '+' ||
        event.key === '#' ||
        event.key === '%' ||
        event.key === ' ' ||
        event.key === '/'
      ) {
        event.preventDefault();
      }
    }
    if (this.numOfSpaces < 2) {
      return (
        (k > 64 && k < 91) ||
        (k > 96 && k <= 121) ||
        (k >= 48 && k <= 57) ||
        k == 8 ||
        k == 32 ||
        (k >= 42 && k <= 46) ||
        k === 64 ||
        k === 61 ||
        (k >= 35 && k <= 38)
      );
    } else {
      event.preventDefault();
    }
  }

  onCheckBackSpace(event) {
    if (event.keyCode === 8) {
      this.numOfSpaces = 0;
    }
  }

  manageInputValidation(formElement: any) {
    return this.shared.manageInputValidation(formElement);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
