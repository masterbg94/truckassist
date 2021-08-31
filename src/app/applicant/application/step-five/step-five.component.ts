import { takeUntil } from 'rxjs/operators';
import { ApplicantStore } from './../../service/applicant.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/core/services/shared.service';
import * as AppConst from 'src/app/const';
import { ILicence } from '../../model/licence.mode';
import { checkSelectedText, pasteCheck } from 'src/assets/utils/methods-global';
import { IViolation } from '../../model/violation.model';
import { Subject } from 'rxjs';
import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import { environment } from 'src/environments/environment';
import moment from 'moment';
import { ApplicantReviewService } from '../../service/applicant-review.service';

@Component({
  selector: 'app-step-five',
  templateUrl: './step-five.component.html',
  styleUrls: ['./step-five.component.scss'],
})
export class StepFiveComponent implements OnInit {

  constructor(
    private shared: SharedService,
    private storeApplicant: ApplicantStore,
    private reviewApplicant: ApplicantReviewService
  ) {}
  traffic: FormGroup;
  displayForm5 = true;

  isCollateral: any;
  isOnlyOneLicence: any;
  isCompleteList: any;
  noTrafficViolations: any;

  truckList = AppConst.TRUCK_LIST_APPLICANTS;
  licences: ILicence[] = [];

  violations: IViolation[] = [];
  countViolation = 0;
  modeViolation = [
    {
      value: 'normal',
    },
  ];

  openDropDeleteDialogViolation = [
    {
      value: false,
    },
  ];

  // Company review
  companyReview?: any =  this.reviewApplicant.companyReviewStepFive;
  isCompanyReview?: any;
  isSomeFalseReview?: any[] = []; // treba da se sacuva na back-u

  public options = {
    componentRestrictions: { country: ['US', 'CA'] },
  };

  public maxDate = new Date(moment().format('YYYY-MM-DD'));
  format: FormatSettings = environment.dateFormat;
  disableAddExist = true;

  private destroy$: Subject<void> = new Subject<void>();

  address: any;
  isValidAddress = false;

  public numOfSpaces2 = 0;

  public formatType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]*$/;
  public numOfSpaces = 0;

  ngOnInit(): void {
    this.storeApplicant.reviewCompany
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => (this.isCompanyReview = data));

    this.licences = this.storeApplicant.getForm('cdlInformation');

    this.InitForm();
    this.reloadData(JSON.parse(sessionStorage.getItem('traffic')));
    if (!this.isCompanyReview) {
      this.traffic.statusChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((val) => {
        this.onFormValidation(val);
      });

      // Load state for hide/show form
      this.displayForm5 =
        JSON.parse(sessionStorage.getItem('displayForm5')) != undefined && this.violations.length > 0
          ? JSON.parse(sessionStorage.getItem('displayForm5'))
          : true;
    } else {
      this.companyReview = this.reviewApplicant.companyReviewStepFive;
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
  }

  private InitForm() {
    (this.traffic = new FormGroup({
      noTrafficViolations: new FormControl(false),
      isCollateral: new FormControl(false, Validators.requiredTrue),
      isOnlyOneLicence: new FormControl(false, Validators.requiredTrue),
      dateViolation: new FormControl(null, Validators.required),
      vehicleType: new FormControl(null, Validators.required),
      location: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      isCompleteList: new FormControl(false, Validators.requiredTrue),
    })),
      setTimeout(() => {
        this.transformInputData();
      });
  }

  isTrafficViolations() {
    if (this.traffic.get('noTrafficViolations').value) {
      this.traffic.get('dateViolation').reset();
      this.traffic.get('dateViolation').enable();
      this.traffic.get('vehicleType').reset();
      this.traffic.get('vehicleType').enable();
      this.traffic.get('location').reset();
      this.traffic.get('location').enable();
      this.traffic.get('description').reset();
      this.traffic.get('description').enable();
      this.traffic.get('description').reset();
      this.traffic.get('isCompleteList').enable();
    } else {
      this.traffic.get('dateViolation').reset();
      this.traffic.get('dateViolation').disable();
      this.traffic.get('vehicleType').reset();
      this.traffic.get('vehicleType').disable();
      this.traffic.get('location').reset();
      this.traffic.get('location').disable();
      this.traffic.get('description').reset();
      this.traffic.get('description').disable();
      this.traffic.get('description').reset();
      this.traffic.get('isCompleteList').disable();
      this.traffic.get('isCompleteList').patchValue(null);
      this.storeApplicant.saveForm(4, this.violations, 'traffic');
    }
  }

  hideForm() {
    this.displayForm5 = false;
    this.traffic.get('dateViolation').reset();
    this.traffic.get('dateViolation').clearValidators();
    this.traffic.get('vehicleType').reset();
    this.traffic.get('vehicleType').clearValidators();
    this.traffic.get('location').reset();
    this.traffic.get('location').clearValidators();
    this.traffic.get('description').reset();
    this.traffic.get('description').clearValidators();

    for (let i = 0; i < this.modeViolation.length; i++) {
      this.modeViolation[i] = {
        value: 'normal',
      };
    }
  }

  showForm() {
    this.displayForm5 = true;
    this.traffic.get('dateViolation').setValidators(Validators.required);
    this.traffic.get('vehicleType').setValidators(Validators.required);
    this.traffic.get('location').setValidators(Validators.required);
    this.traffic.get('description').setValidators(Validators.required);
  }

  licencesStep3(event) {
    this.licences = event;
  }

  onSubmit() {
    if (!this.isCompanyReview) {
      if (!this.noTrafficViolations) {
        if (this.displayForm5 === true) {
          if (!this.shared.markInvalid(this.traffic)) {
            return false;
          }
          // Check if load exist or add new
          let existIndex = -1;
          for (let i = 0; i < this.violations.length; i++) {
            if (this.violations[i].date === this.traffic.get('dateViolation').value) {
              existIndex = i;
              this.disableAddExist = true;
            }
          }
          if (existIndex != -1) {
            this.violations[existIndex] = {
              id: existIndex,
              date: this.traffic.get('dateViolation').value,
              dateModified: this.storeApplicant.convertKendoDate(
                this.traffic.get('dateViolation').value
              ),
              vehicleType: this.traffic.get('vehicleType').value,
              location: this.traffic.get('location').value,
              description: this.traffic.get('description').value,
            };
            this.traffic.reset();
          } else {
            this.violations.push({
              id: this.violations.length >= 1 ? this.violations.length : this.countViolation,
              isCollateral: this.traffic.get('isCollateral').value,
              isOnlyOneLicence: this.traffic.get('isOnlyOneLicence').value,
              date: this.traffic.get('dateViolation').value,
              dateModified: this.storeApplicant.convertKendoDate(
                this.traffic.get('dateViolation').value
              ),
              vehicleType: this.traffic.get('vehicleType').value,
              location: this.traffic.get('location').value,
              description: this.traffic.get('description').value,
              isCompleteList: this.traffic.get('isCompleteList').value,
            });
            this.countViolation++;
            this.traffic.get('dateViolation').reset();
            this.traffic.get('vehicleType').reset();
            this.traffic.get('location').reset();
            this.traffic.get('description').reset();
            this.displayForm5 = false;
          }
          this.displayForm5 = false;
        }
        if (this.violations.length < 1) {
          if (!this.shared.markInvalid(this.traffic)) {
            return false;
          }
        }
        this.storeApplicant.saveForm(4, this.violations, 'traffic');
        sessionStorage.setItem('displayForm5', JSON.stringify(this.displayForm5));
      } else {
        if (!this.shared.markInvalid(this.traffic)) {
          return false;
        }
        this.storeApplicant.saveForm(4, this.traffic.value, 'traffic');
      }
    } else {
      if (this.isSomeFalseReview.length === 0) {
        this.reviewApplicant.reviewStepFive.next(true);
        this.isAllCorrectly(true);
      } else {
        this.reviewApplicant.reviewStepFive.next(false);
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

    this.storeApplicant.stepForward.emit(6);
  }

  stepBack() {
    this.storeApplicant.stepBackward.emit(4);
  }

  reloadData(data: any) {
    if (data.noTrafficViolations !== null && data.noTrafficViolations !== undefined) {
      this.noTrafficViolations = true;
      this.isTrafficViolations();
      this.traffic.get('isCollateral').patchValue(this.isCollateral);
      this.traffic.get('isOnlyOneLicence').patchValue(this.isOnlyOneLicence);
    }
    if (data != null) {
      for (let i = 0; i < data.length; i++) {
        this.openDropDeleteDialogViolation.push({
          value: false,
        });
        this.modeViolation[i] = {
          value: 'normal',
        };
        this.violations[i] = data[i];
        this.violations[i].date = new Date(this.violations[i].date);
      }
      this.isCollateral = true;
      this.isOnlyOneLicence = true;
      this.isCompleteList = true;
      this.traffic.get('isCollateral').patchValue(this.isCollateral);
      this.traffic.get('isOnlyOneLicence').patchValue(this.isOnlyOneLicence);
      this.traffic.get('isCompleteList').patchValue(this.isCompleteList);

      this.countViolation = this.violations.length;
    }
  }

  addViolation() {
    if (!this.shared.markInvalid(this.traffic)) {
      return false;
    }

    let existIndex = -1;
    for (let i = 0; i < this.violations.length; i++) {
      if (this.violations[i].date === this.traffic.get('dateViolation').value) {
        existIndex = i;
        this.disableAddExist = true;
      }
    }
    if (existIndex != -1) {
      this.violations[existIndex] = {
        id: existIndex,
        date: this.traffic.get('dateViolation').value,
        dateModified: this.storeApplicant.convertKendoDate(this.traffic.get('dateViolation').value),
        vehicleType: this.traffic.get('vehicleType').value,
        location: this.traffic.get('location').value,
        description: this.traffic.get('description').value,
      };
      this.modeViolation[existIndex].value = 'normal';
    } else {
      this.violations.push({
        id: this.violations.length >= 1 ? this.violations.length : this.countViolation,
        isCollateral: this.traffic.get('isCollateral').value,
        isOnlyOneLicence: this.traffic.get('isOnlyOneLicence').value,
        date: this.traffic.get('dateViolation').value,
        dateModified: this.storeApplicant.convertKendoDate(this.traffic.get('dateViolation').value),
        vehicleType: this.traffic.get('vehicleType').value,
        location: this.traffic.get('location').value,
        description: this.traffic.get('description').value,
        isCompleteList: this.traffic.get('isCompleteList').value,
      });
      this.countViolation++;
      this.modeViolation.push({
        value: 'normal',
      });
      this.openDropDeleteDialogViolation.push({
        value: false,
      });
    }

    this.storeApplicant.saveForm(4, this.violations, 'traffic');

    this.traffic.get('dateViolation').reset();
    this.traffic.get('vehicleType').reset();
    this.traffic.get('location').reset();
    this.traffic.get('description').reset();
  }

  deleteViolation(index: number) {
    this.violations.splice(index, 1);
    this.openDropDeleteDialogViolation.splice(index, 1);
    this.modeViolation.splice(index, 1);
    this.countViolation--;

    this.violations.forEach((el, i) => (el.id = i));
    this.storeApplicant.saveForm(4, this.violations, 'traffic');

    this.traffic.get('dateViolation').reset();
    this.traffic.get('vehicleType').reset();
    this.traffic.get('location').reset();
    this.traffic.get('description').reset();

    if (this.violations.length < 1) {
      this.traffic.get('dateViolation').setValidators(Validators.required);
      this.traffic.get('vehicleType').setValidators(Validators.required);
      this.traffic.get('location').setValidators(Validators.required);
      this.traffic.get('description').setValidators(Validators.required);
      this.displayForm5 = true;
    }
  }

  onSelectDeleteViolation(canDelete: boolean, indk?: number) {
    this.openDropDeleteDialogViolation[indk].value = false;
    if (canDelete) {
      this.deleteViolation(indk);
    }
  }

  isDeleteActiveViolation(indk: number) {
    this.openDropDeleteDialogViolation[indk].value = true;
    for (let i = 0; i < this.openDropDeleteDialogViolation.length; i++) {
      if (i != indk) {
        this.openDropDeleteDialogViolation[i].value = false;
      }
    }
  }

  editViolation(index: number) {
    if (this.modeViolation[index].value === 'normal') {
      this.displayForm5 = true;
      this.traffic.patchValue({
        dateViolation: this.violations[index].date,
        vehicleType: this.violations[index].vehicleType,
        location: this.violations[index].location,
        description: this.violations[index].description,
      });
      this.shared.touchFormFields(this.traffic);
    } else if (this.modeViolation[index].value === 'edit') {
      if (!this.shared.markInvalid(this.traffic)) {
        return false;
      }

      this.violations[index] = {
        id: index,
        isCollateral: this.traffic.get('isCollateral').value,
        isOnlyOneLicence: this.traffic.get('isOnlyOneLicence').value,
        date: this.traffic.get('dateViolation').value,
        dateModified: this.storeApplicant.convertKendoDate(this.traffic.get('dateViolation').value),
        vehicleType: this.traffic.get('vehicleType').value,
        location: this.traffic.get('location').value,
        description: this.traffic.get('description').value,
        isCompleteList: this.traffic.get('isCompleteList').value,
      };

      this.storeApplicant.saveForm(4, this.violations, 'traffic');

      this.traffic.get('dateViolation').reset();
      this.traffic.get('vehicleType').reset();
      this.traffic.get('location').reset();
      this.traffic.get('description').reset();
    }
    this.modeViolation[index].value === 'normal'
      ? (this.modeViolation[index].value = 'edit')
      : (this.modeViolation[index].value = 'normal');

    for (let i = 0; i < this.modeViolation.length; i++) {
      if (i != index) {
        this.modeViolation[i].value = 'normal';
      }
    }
    if (this.modeViolation[index].value === 'edit') {
      this.disableAddExist = true;
    }
  }

  // Send licence to step3 for edit
  editLicenceOnStep3(licence: any) {
    this.storeApplicant.stepBackward.emit(3);
    this.storeApplicant.getLicence(licence);
  }

  // Feedback review
  feedbackReview(data) {
    const index = this.isSomeFalseReview.findIndex((item) => item.id === data.id);
    if (data.isTrue) {
      this.reviewApplicant.reviewStepFive.next(data);
    } else {
      this.isSomeFalseReview.push(data);
      this.reviewApplicant.reviewStepFive.next(data);
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
    this.reviewApplicant.reviewStepFive.next(true);
  }

  private transformInputData() {
    const data = {
      description: 'capitalize',
      location: 'capitalize',
    };
    this.shared.handleInputValues(this.traffic, data);
  }
  public handleAddressChange(address: any) {
    this.isValidAddress = true;
    this.address = this.shared.selectAddress(this.traffic, address);

    this.traffic.get('location').patchValue(this.address.address);
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
  onPaste(event: any, inputID: string, limitedCuracters?: number, index?: number) {
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
    (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
      event.clipboardData.getData('Text'),
      this.formatType,
      false,
      false,
      false,
      limitedCuracters
    );
    if (inputID == 'description') {
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType
      );
    }
    this.traffic.controls[inputID].patchValue(
      (document.getElementById(inputID) as HTMLInputElement).value
    );
  }

  manageInputValidation(formElement: any) {
    return this.shared.manageInputValidation(formElement);
  }

  onFormValidation(validity: string) {
    switch (validity) {
      case 'VALID':
        // do 'form valid' action
        this.disableAddExist = false;
        break;
      case 'INVALID':
        // do 'form invalid' action
        this.disableAddExist = true;
        break;
    }
  }

  ngOnDestroy() {
    if (this.displayForm5 == true) {
      this.destroy$.next();
      this.destroy$.complete();
    }
  }
}
