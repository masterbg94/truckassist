import { takeUntil } from 'rxjs/operators';
import { ApplicantReviewService } from './../../service/applicant-review.service';
import { ApplicantOpenService } from './../../service/applicant-open.service';
import { ApplicantStore } from './../../service/applicant.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { EndorsementData, RestrictionData } from 'src/app/core/model/driver';
import { MetaData } from 'src/app/core/model/shared/enums';
import { SharedService } from 'src/app/core/services/shared.service';
import { checkSelectedText, pasteCheck } from 'src/assets/utils/methods-global';
import { ILicence } from '../../model/licence.mode';
import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-step-three',
  templateUrl: './step-three.component.html',
  styleUrls: ['./step-three.component.scss'],
})
export class StepThreeComponent implements OnInit {

  constructor(
    private shared: SharedService,
    private openApplicant: ApplicantOpenService,
    private storeApplicant: ApplicantStore,
    private reviewApplicant: ApplicantReviewService
  ) {}
  cdlInformation: FormGroup;
  displayForm3 = true;

  classData: MetaData[];
  countryData: MetaData[];
  stateData: MetaData[];
  restrictionData: RestrictionData[];
  endorsementData: EndorsementData[];

  licences: ILicence[] = [];
  licenceEdit = null;
  countLicence = 0;
  isPreviousLicenceExist = -1;
  modeLicence = [
    {
      value: 'normal',
    },
  ];
  // DropDown Modal logic Truck
  openDropDeleteDialogLicence = [
    {
      value: false,
    },
  ];

  isSuspended = false;
  disableAddExist = true;

  format: FormatSettings = environment.dateFormat;

  private destroy$: Subject<void> = new Subject<void>();

  // Companyreview
  companyReview?: any = [];
  isCompanyReview?: any;
  isSomeFalseReview?: any[] = []; // treba da se sacuva na back-u

  dinamicLicence = false;
  dinamicLicenceIndex = -1;

  numOfSpaces = 0;
  public formatType = /^[!@#$%^&()_+\=\[\]{};':"\\|,.<>\/?]*$/;

  public numOfSpaces2 = 0;

  ngOnInit(): void {
    this.storeApplicant.reviewCompany
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => (this.isCompanyReview = data));

    this.InitForm();
    this.getLicenseData();
    this.reloadData(JSON.parse(sessionStorage.getItem('cdlInformation'))); // back in else condition
    if (this.isCompanyReview) {
      this.companyReview = this.reviewApplicant.companyReviewStepThree;

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
      // Load data from sessionStorage

      // Subscribe licence from step5 to edit
      this.storeApplicant.licence$
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        if (val) {
          this.displayForm3 = true;
          this.cdlInformation.patchValue({
            licence: val.name,
            country: val.country,
            state: val.state,
            categoryClass: val.class,
            expDate: new Date(
              JSON.parse(sessionStorage.getItem('cdlInformation'))[val.id].expDate
            ),
            endorsments: val.endorsments,
            restrictions: val.restrictions,
            denidedSuspended: val.denided,
            explainDenidedSuspended: val.explainDenided,
          });
          this.isPreviousLicenceExist = val.id;
          this.disableAddExist = false;
          this.modeLicence[val.id].value = 'edit';

          if (this.licences[val.id].denided == 'yes') {
            this.isSuspended = true;
            this.cdlInformation.get('explainDenidedSuspended').setValidators(Validators.required);
          } else {
            this.isSuspended = false;
            this.cdlInformation.get('explainDenidedSuspended').clearValidators();
            this.cdlInformation.get('explainDenidedSuspended').reset();
          }

          if (!this.shared.markInvalid(this.cdlInformation)) {
            return false;
          }
        }
      });

      this.displayForm3 =
        JSON.parse(sessionStorage.getItem('displayForm3')) != undefined &&
        this.licences.length > 0 &&
        this.cdlInformation.get('licence').value === null
          ? JSON.parse(sessionStorage.getItem('displayForm3'))
          : true;

      // Listen for form validation
      this.cdlInformation.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        this.onFormValidation(val);
      });
    }
  }

  private InitForm() {
    (this.cdlInformation = new FormGroup({
      licence: new FormControl(null, Validators.required),
      country: new FormControl(null, Validators.required),
      state: new FormControl(null, Validators.required),
      categoryClass: new FormControl(null, Validators.required),
      expDate: new FormControl(null, Validators.required),
      endorsments: new FormControl(null),
      restrictions: new FormControl(null),
      denidedSuspended: new FormControl(null, Validators.required),
      explainDenidedSuspended: new FormControl(null),
    })),
      setTimeout(() => {
        this.transformInputData();
      });
  }

  reloadData(data: any) {
    if (data != null) {
      for (let i = 0; i < data.length; i++) {
        this.openDropDeleteDialogLicence.push({
          value: false,
        });
        this.modeLicence.push({
          value: 'normal',
        });
        this.licences[i] = data[i];
        this.licences[i].expDate = new Date(this.licences[i].expDate);
        this.countLicence = this.licences.length;
      }
    }
  }

  hideForm() {
    this.displayForm3 = false;
    this.cdlInformation.get('licence').clearValidators();
    this.cdlInformation.get('licence').reset();
    this.cdlInformation.get('country').clearValidators();
    this.cdlInformation.get('country').reset();
    this.cdlInformation.get('state').clearValidators();
    this.cdlInformation.get('state').reset();
    this.cdlInformation.get('categoryClass').clearValidators();
    this.cdlInformation.get('categoryClass').reset();
    this.cdlInformation.get('expDate').clearValidators();
    this.cdlInformation.get('expDate').reset();
    this.cdlInformation.get('denidedSuspended').clearValidators();
    this.cdlInformation.get('denidedSuspended').reset();

    for (let i = 0; i < this.modeLicence.length; i++) {
      this.modeLicence[i] = {
        value: 'normal',
      };
    }
  }

  showFormLicence() {
    this.displayForm3 = true;
    this.cdlInformation.get('licence').setValidators(Validators.required);
    this.cdlInformation.get('country').setValidators(Validators.required);
    this.cdlInformation.get('state').setValidators(Validators.required);
    this.cdlInformation.get('categoryClass').setValidators(Validators.required);
    this.cdlInformation.get('expDate').setValidators(Validators.required);
    this.cdlInformation.get('denidedSuspended').setValidators(Validators.required);
  }

  onSubmit() {
    if (!this.isCompanyReview) {
      if (this.displayForm3 == true) {
        this.cdlInformation.get('denidedSuspended').setValidators(Validators.required);
        this.cdlInformation.get('denidedSuspended').updateValueAndValidity();
        if (!this.shared.markInvalid(this.cdlInformation)) {
          return false;
        }
        if (this.cdlInformation.get('licence').value !== null) {
          if (this.isPreviousLicenceExist != -1) {
            this.licences[this.isPreviousLicenceExist] = {
              id: this.isPreviousLicenceExist,
              name: this.cdlInformation.get('licence').value,
              country: this.cdlInformation.get('country').value,
              state: this.cdlInformation.get('state').value,
              class: this.cdlInformation.get('categoryClass').value,
              expDate: this.cdlInformation.get('expDate').value,
              modifiedDate: this.storeApplicant.convertKendoDate(
                this.cdlInformation.get('expDate').value
              ),
              endorsments: this.cdlInformation.get('endorsments').value,
              restrictions: this.cdlInformation.get('restrictions').value,
              denided: this.cdlInformation.get('denidedSuspended').value,
              explainDenided: this.cdlInformation.get('explainDenidedSuspended').value,
            };
            this.isPreviousLicenceExist = -1;
          } else {
            let existIndex = -1;
            for (let i = 0; i < this.licences.length; i++) {
              if (this.licences[i].name === this.cdlInformation.get('licence').value) {
                existIndex = i;
                this.disableAddExist = true;
              }
            }

            if (existIndex != -1) {
              this.licences[existIndex] = {
                id: existIndex,
                name: this.cdlInformation.get('licence').value,
                country: this.cdlInformation.get('country').value,
                state: this.cdlInformation.get('state').value,
                class: this.cdlInformation.get('categoryClass').value,
                expDate: this.cdlInformation.get('expDate').value,
                modifiedDate: this.storeApplicant.convertKendoDate(
                  this.cdlInformation.get('expDate').value
                ),
                endorsments: this.cdlInformation.get('endorsments').value,
                restrictions: this.cdlInformation.get('restrictions').value,
                denided: this.cdlInformation.get('denidedSuspended').value,
                explainDenided: this.cdlInformation.get('explainDenidedSuspended').value,
              };
              this.cdlInformation.reset();
            } else {
              this.licences.push({
                id: this.licences.length >= 1 ? this.licences.length : this.countLicence,
                name: this.cdlInformation.get('licence').value,
                country: this.cdlInformation.get('country').value,
                state: this.cdlInformation.get('state').value,
                class: this.cdlInformation.get('categoryClass').value,
                expDate: this.cdlInformation.get('expDate').value,
                modifiedDate: this.storeApplicant.convertKendoDate(
                  this.cdlInformation.get('expDate').value
                ),
                endorsments: this.cdlInformation.get('endorsments').value,
                restrictions: this.cdlInformation.get('restrictions').value,
                denided: this.cdlInformation.get('denidedSuspended').value,
                explainDenided: this.cdlInformation.get('explainDenidedSuspended').value,
              });
              this.countLicence++;
              this.cdlInformation.reset();
              this.displayForm3 = false;
            }
          }
        }
        this.displayForm3 = false;
      }
      if (this.licences.length < 1) {
        if (!this.shared.markInvalid(this.cdlInformation)) {
          return false;
        }
      }
      // Emit licences
      this.storeApplicant.saveForm(2, this.licences, 'cdlInformation');
      // Hide form on submit
      sessionStorage.setItem('displayForm3', JSON.stringify(false));
      this.displayForm3 = false;
      this.cdlInformation.reset();
    } else {
      if (this.isSomeFalseReview.length === 0) {
        this.reviewApplicant.reviewStepThree.next(true);
        this.isAllCorrectly(true);
      } else {
        this.reviewApplicant.reviewStepThree.next(false);
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
    this.storeApplicant.stepForward.emit(4);
  }

  stepBack() {
    this.storeApplicant.stepBackward.emit(2);
  }

  // Feedback review
  feedbackReview(data) {
    const index = this.isSomeFalseReview.findIndex((item) => item.id === data.id);
    if (data.isTrue) {
      this.reviewApplicant.reviewStepThree.next(data);
    } else {
      this.isSomeFalseReview.push(data);
      this.reviewApplicant.reviewStepThree.next(data);
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
    this.reviewApplicant.reviewStepThree.next(true);
  }

  // Methods for Licences
  deleteLicence(index: number) {
    this.licences.splice(index, 1);
    this.modeLicence.splice(index, 1);
    this.openDropDeleteDialogLicence.splice(index, 1);
    this.countLicence--;

    this.licences.forEach((el, i) => (el.id = i));

    this.storeApplicant.saveForm(2, this.licences, 'cdlInformation');
    this.cdlInformation.reset();

    if (this.licences.length < 1) {
      this.displayForm3 = true;
      this.cdlInformation.get('licence').setValidators(Validators.required);
      this.cdlInformation.get('country').setValidators(Validators.required);
      this.cdlInformation.get('state').setValidators(Validators.required);
      this.cdlInformation.get('categoryClass').setValidators(Validators.required);
      this.cdlInformation.get('expDate').setValidators(Validators.required);
      this.cdlInformation.get('denidedSuspended').setValidators(Validators.required);
      this.isSuspended = false;
    }
  }

  onSelectDeleteLicence(canDelete: boolean, indk?: number) {
    this.openDropDeleteDialogLicence[indk].value = false;
    if (canDelete) {
      this.deleteLicence(indk);
    }
  }

  isDeleteActiveLicence(indk: number) {
    this.openDropDeleteDialogLicence[indk].value = true;
    for (let i = 0; i < this.openDropDeleteDialogLicence.length; i++) {
      if (i != indk) {
        this.openDropDeleteDialogLicence[i].value = false;
      }
    }
  }

  addLicence() {
    this.cdlInformation.get('denidedSuspended').clearValidators();
    this.cdlInformation.get('denidedSuspended').updateValueAndValidity();
    if (!this.shared.markInvalid(this.cdlInformation)) {
      return false;
    }

    let existIndex = -1;
    for (let i = 0; i < this.licences.length; i++) {
      if (this.licences[i].name === this.cdlInformation.get('licence').value) {
        existIndex = i;
        this.disableAddExist = true;
      }
    }

    if (existIndex != -1) {
      this.licences[existIndex] = {
        id: existIndex,
        name: this.cdlInformation.get('licence').value,
        country: this.cdlInformation.get('country').value,
        state: this.cdlInformation.get('state').value,
        class: this.cdlInformation.get('categoryClass').value,
        expDate: this.cdlInformation.get('expDate').value,
        modifiedDate: this.storeApplicant.convertKendoDate(
          this.cdlInformation.get('expDate').value
        ),
        endorsments: this.cdlInformation.get('endorsments').value,
        restrictions: this.cdlInformation.get('restrictions').value,
        denided: this.cdlInformation.get('denidedSuspended').value,
        explainDenided: this.cdlInformation.get('explainDenidedSuspended').value,
      };
      this.modeLicence[existIndex].value = 'normal';
    } else {
      this.licences.push({
        id: this.licences.length >= 1 ? this.licences.length : this.countLicence,
        name: this.cdlInformation.get('licence').value,
        country: this.cdlInformation.get('country').value,
        state: this.cdlInformation.get('state').value,
        class: this.cdlInformation.get('categoryClass').value,
        expDate: this.cdlInformation.get('expDate').value,
        modifiedDate: this.storeApplicant.convertKendoDate(
          this.cdlInformation.get('expDate').value
        ),
        endorsments: this.cdlInformation.get('endorsments').value,
        restrictions: this.cdlInformation.get('restrictions').value,
        denided: this.cdlInformation.get('denidedSuspended').value,
        explainDenided: this.cdlInformation.get('explainDenidedSuspended').value,
      });
      this.countLicence++;
      this.modeLicence.push({
        value: 'normal',
      });
      this.openDropDeleteDialogLicence.push({
        value: false,
      });
    }
    this.storeApplicant.saveForm(2, this.licences, 'cdlInformation');

    this.storeApplicant.getLicence(this.licences);

    this.cdlInformation.reset();

    this.isSuspended = false;
  }
  editLicence(index: number) {
    if (this.modeLicence[index].value == 'normal') {
      this.dinamicLicenceIndex = index;
      this.isSuspended = false;
      this.dinamicLicence = true;
      this.displayForm3 = true;
      this.cdlInformation.patchValue({
        licence: this.licences[index].name,
        country: JSON.parse(sessionStorage.getItem('cdlInformation'))[index].country,
        state: JSON.parse(sessionStorage.getItem('cdlInformation'))[index].state,
        categoryClass: JSON.parse(sessionStorage.getItem('cdlInformation'))[index].class,
        expDate: this.licences[index].expDate,
        endorsments: this.licences[index].endorsments,
        restrictions: this.licences[index].restrictions,
        denidedSuspended:
          this.licences[index].denided != null ? this.licences[index].denided : 'no',
        explainDenidedSuspended: this.licences[index].explainDenided,
      });
      if (this.licences[index].denided == 'yes') {
        this.isSuspended = true;
        this.cdlInformation.get('explainDenidedSuspended').setValidators(Validators.required);
      } else {
        this.isSuspended = false;
        this.cdlInformation.get('explainDenidedSuspended').clearValidators();
        this.cdlInformation.get('explainDenidedSuspended').reset();
      }
      if (!this.shared.markInvalid(this.cdlInformation)) {
        return false;
      }
    } else if (this.modeLicence[index].value === 'edit') {
      this.dinamicLicenceIndex = -1;
      this.isSuspended = false;
      if (!this.shared.markInvalid(this.cdlInformation)) {
        return false;
      }
      this.dinamicLicence = false;
      this.licences[index] = {
        id: index,
        name: this.cdlInformation.get('licence').value,
        country: this.cdlInformation.get('country').value,
        state: this.cdlInformation.get('state').value,
        class: this.cdlInformation.get('categoryClass').value,
        expDate: this.cdlInformation.get('expDate').value,
        modifiedDate: this.storeApplicant.convertKendoDate(
          this.cdlInformation.get('expDate').value
        ),
        endorsments: this.cdlInformation.get('endorsments').value,
        restrictions: this.cdlInformation.get('restrictions').value,
        denided: this.cdlInformation.get('denidedSuspended').value,
        explainDenided: this.cdlInformation.get('explainDenidedSuspended').value,
      };
      this.storeApplicant.saveForm(2, this.licences, 'cdlInformation');
      this.cdlInformation.reset();
    }
    this.modeLicence[index].value === 'normal'
      ? (this.modeLicence[index].value = 'edit')
      : (this.modeLicence[index].value = 'normal');
    for (let i = 0; i < this.modeLicence.length; i++) {
      if (i != index) {
        this.modeLicence[i].value = 'normal';
      }
    }
  }

  denidedSuspended(value) {
    if (value === 'yes') {
      this.isSuspended = true;
      this.cdlInformation.get('explainDenidedSuspended').enable();
      this.cdlInformation.get('explainDenidedSuspended').setValidators(Validators.required);
    } else {
      this.isSuspended = false;
      this.cdlInformation.get('explainDenidedSuspended').patchValue(null);
      this.clearValidate(this.cdlInformation.get('explainDenidedSuspended'));
      this.cdlInformation.get('explainDenidedSuspended').reset();
      this.cdlInformation.get('explainDenidedSuspended').disable();
    }
  }

  getLicenseData() {
    const classes$ = this.openApplicant.getMetaDataByDomainKey('driver', 'class');
    const countries$ = this.openApplicant.getMetaDataByDomainKey('driver', 'country');
    const restrictions$ = this.openApplicant.getRestriction();
    const endorsments$ = this.openApplicant.getEndorsement();

    forkJoin([classes$, countries$, restrictions$, endorsments$])
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      ([classes, countries, restrictions, endorsments]: [
        MetaData[],
        MetaData[],
        RestrictionData[],
        EndorsementData[]
      ]) => {
        this.classData = classes;
        this.countryData = countries;
        this.restrictionData = restrictions;
        this.endorsementData = endorsments;
      },
      (error: HttpErrorResponse) => {
        this.shared.handleError(error);
      }
    );
  }

  getStatesLicense(country: any) {
    if (country && country.value) {
      this.openApplicant.getJSON(country.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((states: MetaData[]) => {
        this.cdlInformation.get('state').reset();
        this.cdlInformation.get('state').enable();
        this.stateData = states;
      });
    } else {
      this.cdlInformation.get('state').reset();
      this.cdlInformation.get('state').disable();
    }
  }

  onPaste(event: any, inputID: string, limitedCaracters?: number, index?: number) {
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
    if (inputID == 'denided') {
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
        true,
        false,
        false,
        limitedCaracters
      );
    }

    this.cdlInformation.controls[inputID].patchValue(
      (document.getElementById(inputID) as HTMLInputElement).value
    );
  }

  transformInputData() {
    const data = {
      explainDenidedSuspended: 'capitalize',
      licence: 'upper',
    };
    this.shared.handleInputValues(this.cdlInformation, data);
  }

  clearValidate(form: AbstractControl) {
    form.clearValidators();
    form.updateValueAndValidity();
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

  onLicenseNumberTyping(event) {
    let k;
    k = event.charCode;
    if (k == 32) {
      this.numOfSpaces++;
    } else {
      this.numOfSpaces = 0;
    }

    if (this.numOfSpaces < 2) {
      return (
        k == 8 ||
        k == 32 ||
        (k >= 65 && k <= 90) ||
        (k >= 97 && k <= 122) ||
        (k >= 48 && k <= 57) ||
        k == 45 ||
        k == 42
      );
    } else {
      event.preventDefault();
    }
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
    this.destroy$.next();
    this.destroy$.complete();
    this.displayForm3 = false;
  }
}
