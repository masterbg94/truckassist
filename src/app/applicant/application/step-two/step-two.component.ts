import { takeUntil } from 'rxjs/operators';
import { ApplicantReviewService } from './../../service/applicant-review.service';
import { ApplicantOpenService } from './../../service/applicant-open.service';
import { ApplicantStore } from './../../service/applicant.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MetaData } from 'src/app/core/model/shared/enums';
import * as AppConst from 'src/app/const';
import { checkSelectedText, emailChack, pasteCheck } from 'src/assets/utils/methods-global';
import { SharedService } from 'src/app/core/services/shared.service';
import { forkJoin, Subject } from 'rxjs';
import { IEmployer } from '../../model/employer.model';
import { IReason } from '../../model/reason.model';
import { HttpErrorResponse } from '@angular/common/http';
import moment from 'moment';
import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import { environment } from 'src/environments/environment';
import { NotificationService } from 'src/app/services/notification-service.service';

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss'],
})
export class StepTwoComponent implements OnInit {

  constructor(
    private shared: SharedService,
    private storeApplicant: ApplicantStore,
    private openApplicant: ApplicantOpenService,
    private reviewApplicant: ApplicantReviewService,
    private notification: NotificationService
  ) {}

  get truckType(): FormArray {
    return this.workExperience.get('type') as FormArray;
  }
  workExperience: FormGroup;
  displayForm2 = true;

  employers: IEmployer[] = [];
  countEmploye = 0;
  indexOfOldEmployer = 0;
  modeEmployer = [
    {
      value: 'normal',
    },
  ];
  clearTimeoutEmployer: any;
  newEmploye: IEmployer = null;
  stateOfNewEmploye: number;
  counterNewEmployer = 0;
  modeNewEmployer = {
    value: 'normal',
  };

  // DropDown Modal logic Employer
  openDropDeleteDialogEmployer = [
    {
      value: false,
    },
  ];

  selectReason = {
    id: 0,
    name: '',
  };

  stateReason: IReason[] = this.storeApplicant.stateReason;

  hasDrivingPosition = false;
  isCheckedPosition: 'checked' | 'unchecked' = 'unchecked';

  truckList = AppConst.TRUCK_LIST_APPLICANTS;
  truckListModificated: any;
  trailerList = AppConst.TRAILER_LIST;
  trailerLength: MetaData[] = [];

  disableAdd: boolean;
  disableTruck: boolean;

  blockTrailer = [
    {
      value: false,
    },
  ];

  blockLength = [
    {
      value: false,
    },
  ];
  // DropDown Modal logic Truck
  openDropDeleteDialogTruck = [
    {
      value: false,
    },
  ];

  disableCheckNotExperience = false;
  haveExperience = false;

  stateOfEmployer: string[] = this.storeApplicant.stateOfEmployer;

  public options = {
    componentRestrictions: { country: ['US', 'CA'] },
  };

  listenForEmail = false;

  // Kendo manipulation date
  public currentDate: Date = null;
  public maxDate = new Date(moment().format('YYYY-MM-DD'));
  public maxValue: Date = null;
  format: FormatSettings = environment.dateFormat;

  // Company review
  isCompanyReview = false;
  companyReview?: any = [];
  isSomeFalseReview?: any[] = []; // treba da se sacuva na back-u

  private destroy$: Subject<void> = new Subject<void>();

  experience = 0;

  // Manipulation user input

  public numOfSpaces = 0;
  public isEmployer = true;
  public firstWords: boolean;
  isBusiness = true;
  formatType = /^[!^()_\\[\]{};':"\\|<>\/?]*$/;

  public numOfSpaces2 = 0;

  address: any;
  isValidAddress = false;

  ngOnInit(): void {
    this.storeApplicant.reviewCompany
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => (this.isCompanyReview = data));

    this.InitForm();
    this.getTrucksBus();
    this.getTrailerData();

    if (!this.isCompanyReview) {
      // Listen form validation
      this.workExperience.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        this.onFormValidation(val);
      });

      // Listen for validation Truck
      this.truckType.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => this.onTruckValidation(val));

      // Listen for email validation
      this.workExperience.get('empEmail').valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        if (val != null) {
          this.workExperience
            .get('empEmail')
            .setValidators([Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]);
          this.listenForEmail = true;
        }
      });

      this.reloadData(this.storeApplicant.getForm('workExperience'));

      this.displayForm2 =
        JSON.parse(sessionStorage.getItem('displayForm2')) != null && this.employers.length > 0
          ? JSON.parse(sessionStorage.getItem('displayForm2'))
          : true;
    } else {
      this.hasDrivingPosition = true;
      this.isCheckedPosition = 'checked';
      this.getChecked();
      this.addTruck();
      this.companyReview = this.reviewApplicant.companyReviewStepTwo;
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

    this.reloadData(this.storeApplicant.getForm('workExperience'));
  }

  private InitForm() {
    (this.workExperience = new FormGroup({
      employerName: new FormControl(null, Validators.required),
      jobDescription: new FormControl(null, Validators.required),
      fromDate: new FormControl(null, Validators.required),
      toDate: new FormControl(null, Validators.required),
      empPhone: new FormControl(null, Validators.required),
      empEmail: new FormControl(
        null,
        Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
      ),
      empAddress: new FormControl(null, Validators.required),
      empUnit: new FormControl(null),
      type: new FormArray([]),
      cfrPart: new FormControl(null),
      fmCSA: new FormControl(null),
      reason: new FormControl(null, Validators.required),
      accountForPeriod: new FormControl(null),
      haveExperience: new FormControl(false),
    })),
      setTimeout(() => {
        this.transformInputData();
      });
  }

  reloadData(data: any) {
    if (data != null) {
      if (data.haveExperience === false || data.haveExperience == null) {
        for (let i = 0; i < data.length; i++) {
          this.openDropDeleteDialogEmployer.push({
            value: false,
          });
          this.modeEmployer.push({
            value: 'normal',
          });
          this.employers[i] = data[i];
          this.employers[i].fromDate = new Date(this.employers[i].fromDate);
          this.employers[i].toDate = new Date(this.employers[i].toDate);
          this.reasonSelect(this.employers[i].reason);
          this.countEmploye = this.employers.length;
          this.maxDate = new Date(this.employers[i].fromDate);
        }
      } else {
        this.workExperience.get('haveExperience').patchValue(data.haveExperience);
        this.haveExperience = true;
        this.displayForm2 = false;
      }
    }
  }

  hideForm() {
    this.disableAdd = false;
    this.displayForm2 = false;

    for (let i = 0; i < this.modeEmployer.length; i++) {
      this.modeEmployer[i].value = 'normal';
    }
    this.countEmploye = this.employers.length;
    this.workExperience.reset();
  }

  showForm() {
    this.displayForm2 = true;
    this.workExperience.get('employerName').setValidators(Validators.required);
    this.workExperience.get('jobDescription').setValidators(Validators.required);
    this.workExperience.get('fromDate').reset();
    this.workExperience.get('fromDate').setValidators(Validators.required);
    this.workExperience.get('toDate').reset();
    this.workExperience.get('toDate').setValidators(Validators.required);
    this.workExperience.get('empPhone').setValidators(Validators.required);
    this.workExperience
      .get('empEmail')
      .setValidators(Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/));
    this.workExperience.get('empAddress').setValidators(Validators.required);
    this.workExperience.get('reason').setValidators(Validators.required);
  }

  onSubmit() {
    if (!this.isCompanyReview) {
      if (this.displayForm2 === true) {
        if (this.haveExperience) {
          this.storeApplicant.saveForm(1, this.workExperience.value, 'workExperience');
        } else {
          if (!this.shared.markInvalid(this.workExperience)) {
            return false;
          }
          // Check if user has 3 years minimum...
          this.experience === 0
            ? (this.experience +=
                (this.workExperience.get('toDate').value -
                  this.workExperience.get('fromDate').value) /
                3600 /
                (24 * 1000))
            : this.workExperience.get('toDate').value !== null &&
              this.workExperience.get('fromDate').value !== null
            ? (this.experience +=
                (this.workExperience.get('toDate').value -
                  this.workExperience.get('fromDate').value) /
                3600 /
                (24 * 1000))
            : this.experience;

          if (this.experience < 1095) {
            this.notification.warning('Minimum 3 years of experience required...', 'Warning: ');
            return false;
          }

          const indk = this.employers.findIndex(
            (x) => x.employerName === this.workExperience.get('employerName').value
          );
          // Find if employe exist in array
          if (indk == -1) {
            const id = this.employers.length > 1 ? this.employers.length : this.countEmploye;
            this.employers.push({
              id,
              concatPrint: '',
              employerName: this.workExperience.get('employerName').value,
              jobDescription: this.workExperience.get('jobDescription').value,
              fromDate: this.workExperience.get('fromDate').value,
              toDate: this.workExperience.get('toDate').value,
              phone: this.workExperience.get('empPhone').value,
              email: this.workExperience.get('empEmail').value,
              address: this.workExperience.get('empAddress').value,
              unit: this.workExperience.get('empUnit').value,
              type: [],
              cfr: this.workExperience.get('cfrPart').value,
              fmcsa: this.workExperience.get('fmCSA').value,
              reason: {
                id: this.selectReason.id,
                name: this.selectReason.name,
              },
              account: this.workExperience.get('accountForPeriod').value,
            });

            this.employers[id].type = this.truckType.value;
            this.employers[id].concatPrint =
              this.employers[id].employerName +
              ' ' +
              this.storeApplicant.convertKendoDate(this.workExperience.get('fromDate').value) +
              ' - ' +
              this.storeApplicant.convertKendoDate(this.workExperience.get('toDate').value);
            this.countEmploye++;

            this.modeEmployer.push({
              value: 'normal',
            });
          } else {
            this.employers[indk] = {
              id: indk,
              concatPrint: '',
              employerName: this.workExperience.get('employerName').value,
              jobDescription: this.workExperience.get('jobDescription').value,
              fromDate: this.workExperience.get('fromDate').value,
              toDate: this.workExperience.get('toDate').value,
              phone: this.workExperience.get('empPhone').value,
              email: this.workExperience.get('empEmail').value,
              address: this.workExperience.get('empAddress').value,
              unit: this.workExperience.get('empUnit').value,
              type: [],
              cfr: this.workExperience.get('cfrPart').value,
              fmcsa: this.workExperience.get('fmCSA').value,
              reason: {
                id: this.selectReason.id,
                name: this.selectReason.name,
              },
              account: this.workExperience.get('accountForPeriod').value,
            };
            this.employers[this.countEmploye].type = this.truckType.value;
            this.employers[this.countEmploye].concatPrint =
              this.employers[this.countEmploye].employerName +
              ' ' +
              this.storeApplicant.convertKendoDate(this.workExperience.get('fromDate').value) +
              ' - ' +
              this.storeApplicant.convertKendoDate(this.workExperience.get('toDate').value);
          }

          this.employers.forEach((el, i) => (el.id = i));
          this.storeApplicant.saveForm(1, this.employers, 'workExperience');
        }
      }
      this.displayForm2 = false;
      sessionStorage.setItem('displayForm2', JSON.stringify(this.displayForm2));
    } else {
      if (this.isSomeFalseReview.length === 0) {
        this.reviewApplicant.reviewStepTwo.next(true);
        this.isAllCorrectly(true);
      } else {
        this.reviewApplicant.reviewStepTwo.next(false);
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
    this.storeApplicant.stepForward.emit(3);
  }

  stepBack() {
    this.storeApplicant.stepBackward.emit(1);
  }

  getChecked() {
    return this.isCheckedPosition === 'checked';
  }

  driverPosition(event) {
    event.preventDefault();
    if (this.isCheckedPosition === 'unchecked' && !this.haveExperience) {
      this.hasDrivingPosition = true;
      this.isCheckedPosition = 'checked';
      this.addTruck();
      this.workExperience.get('cfrPart').reset();
      this.workExperience.get('cfrPart').setValidators(Validators.required);
      this.workExperience.get('fmCSA').setValidators(Validators.required);
      this.workExperience.get('fmCSA').reset();
    } else if (this.isCheckedPosition === 'checked' && !this.haveExperience) {
      this.deleteAllTruck();
      this.hasDrivingPosition = false;
      this.isCheckedPosition = 'unchecked';
      this.clearValidate(this.workExperience.get('fmCSA'));
      this.clearValidate(this.workExperience.get('cfrPart'));
    }
  }

  // Feedback review
  feedbackReview(data) {
    const index = this.isSomeFalseReview.findIndex((item) => item.id === data.id);
    if (data.isTrue) {
      this.reviewApplicant.reviewStepTwo.next(data);
    } else {
      this.isSomeFalseReview.push(data);
      this.reviewApplicant.reviewStepTwo.next(data);
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
    this.reviewApplicant.reviewStepTwo.next(true);
  }

  addTruck() {
    if (this.truckType.length < 12) {
      this.truckType.push(
        new FormGroup({
          truckType: new FormControl(null, Validators.required),
          trailerType: new FormControl(null, Validators.required),
          truckLength: new FormControl(null, Validators.required),
        })
      );
    }

    this.openDropDeleteDialogTruck.push({
      value: false,
    });

    this.blockTrailer.push({
      value: false,
    });

    this.blockLength.push({
      value: false,
    });

    this.truckType
    .at(this.truckType.length - 1)
    .get('truckType')
    .valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe((val) => {
      if (val.name === 'Box Truck' || val.name === 'Cargo Van' || val.name === 'Tow Truck') {
        this.truckType
          .at(this.truckType.length - 1)
          .get('trailerType')
          .reset();

        this.truckType
          .at(this.truckType.length - 1)
          .get('trailerType')
          .disable();
        this.truckType
          .at(this.truckType.length - 1)
          .get('truckLength')
          .reset();
        this.truckType
          .at(this.truckType.length - 1)
          .get('truckLength')
          .disable();

        this.clearValidate(this.truckType.at(this.truckType.length - 1).get('trailerType'));
        this.clearValidate(this.truckType.at(this.truckType.length - 1).get('truckLength'));
        this.blockTrailer[this.truckType.length - 1].value = true;
        this.blockLength[this.truckType.length - 1].value = true;
      } else if (val.name === 'Car Hauler') {
        this.truckType
          .at(this.truckType.length - 1)
          .get('trailerType')
          .reset();

        this.truckType
          .at(this.truckType.length - 1)
          .get('trailerType')
          .patchValue('Car Hauler');
        this.clearValidate(this.truckType.at(this.truckType.length - 1).get('trailerType'));

        this.truckType
          .at(this.truckType.length - 1)
          .get('truckLength')
          .reset();
        this.truckType
          .at(this.truckType.length - 1)
          .get('truckLength')
          .enable();
        this.truckType
          .at(this.truckType.length - 1)
          .get('truckLength')
          .setValidators(Validators.required);

        this.blockTrailer[this.truckType.length - 1].value = true;
        this.blockLength[this.truckType.length - 1].value = false;
      } else if (val.name === 'Bus') {
        this.truckType
          .at(this.truckType.length - 1)
          .get('trailerType')
          .reset();

        this.truckType
          .at(this.truckType.length - 1)
          .get('trailerType')
          .disable();
        this.truckType
          .at(this.truckType.length - 1)
          .get('truckLength')
          .reset();
        this.truckType
          .at(this.truckType.length - 1)
          .get('truckLength')
          .setValidators(Validators.required);

        this.clearValidate(this.truckType.at(this.truckType.length - 1).get('trailerType'));

        this.blockTrailer[this.truckType.length - 1].value = true;
        this.blockLength[this.truckType.length - 1].value = false;
      } else {
        this.blockTrailer[this.truckType.length - 1].value = false;
        this.blockLength[this.truckType.length - 1].value = false;
        this.truckType
          .at(this.truckType.length - 1)
          .get('trailerType')
          .reset();
        this.truckType
          .at(this.truckType.length - 1)
          .get('trailerType')
          .enable();
        this.truckType
          .at(this.truckType.length - 1)
          .get('trailerType')
          .setValidators(Validators.required);

        this.truckType
          .at(this.truckType.length - 1)
          .get('truckLength')
          .reset();
        this.truckType
          .at(this.truckType.length - 1)
          .get('truckLength')
          .enable();
        this.truckType
          .at(this.truckType.length - 1)
          .get('truckLength')
          .setValidators(Validators.required);
      }
    });
  }

  deleteTruck(index: number) {
    this.truckType.removeAt(index);
  }

  deleteAllTruck() {
    this.truckType.controls = [];
    this.deleteTruck(0);
  }

  onDeleteOptionTruck(canDelete: boolean, indk?: number) {
    this.openDropDeleteDialogTruck[indk].value = false;
    if (canDelete) {
      this.deleteTruck(indk);
    }
  }

  isDeleteActiveTruck(indk: number) {
    this.openDropDeleteDialogTruck[indk].value = true;
    for (let i = 0; i < this.openDropDeleteDialogTruck.length; i++) {
      if (i != indk) {
        this.openDropDeleteDialogTruck[i].value = false;
      }
    }
  }

  getTrailerData() {
    const trailerLengths$ = this.openApplicant.getMetaDataByDomainKey('trailer', 'length');
    forkJoin([trailerLengths$])
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      ([trailerLengths]: [MetaData[]]) => {
        this.trailerLength = trailerLengths;
      },
      (error: HttpErrorResponse) => {
        this.shared.handleError(error);
      }
    );
  }

  reasonSelect(value) {
    this.selectReason.id = value.id;
    this.selectReason.name = value.name;
  }
  addEmployer() {
    if (!this.isCompanyReview) {
      if (!this.shared.markInvalid(this.workExperience)) {
        return false;
      }

      const id = this.employers.length > 1 ? this.employers.length : this.countEmploye;
      this.employers.push({
        id,
        concatPrint: '',
        employerName: this.workExperience.get('employerName').value,
        jobDescription: this.workExperience.get('jobDescription').value,
        fromDate: this.workExperience.get('fromDate').value,
        toDate: this.workExperience.get('toDate').value,
        phone: this.workExperience.get('empPhone').value,
        email: this.workExperience.get('empEmail').value,
        address: this.workExperience.get('empAddress').value,
        unit: this.workExperience.get('empUnit').value,
        type: [],
        cfr: this.workExperience.get('cfrPart').value,
        fmcsa: this.workExperience.get('fmCSA').value,
        reason: {
          id: this.selectReason.id,
          name: this.selectReason.name,
        },
        account: this.workExperience.get('accountForPeriod').value,
      });
      this.employers[id].type = this.truckType.value;
      this.employers[id].concatPrint =
        this.employers[id].employerName +
        ' ' +
        this.storeApplicant.convertKendoDate(this.workExperience.get('fromDate').value) +
        ' - ' +
        this.storeApplicant.convertKendoDate(this.workExperience.get('toDate').value);
      this.countEmploye++;

      this.modeEmployer.push({
        value: 'normal',
      });

      this.openDropDeleteDialogEmployer.push({
        value: false,
      });

      if (this.employers.length < 1) {
        this.disableCheckNotExperience = false;
      } else {
        this.disableCheckNotExperience = true;
      }
      this.experience +=
        (this.workExperience.get('toDate').value - this.workExperience.get('fromDate').value) /
        3600 /
        (24 * 1000);
      this.employers.forEach((el, i) => (el.id = i));
      // Validate max date
      this.maxDate = this.currentDate;
      this.storeApplicant.saveForm(1, this.employers, 'workExperience');
      this.restartForm();
    }
  }

  viewEmployer(index: number) {
    this.indexOfOldEmployer = index;

    if (this.modeEmployer[index].value == 'normal') {
      // ******************* Previous employer  && *******************
      if (this.counterNewEmployer < 1 && this.workExperience.get('employerName').value != null) {
        let isTrue = false;
        for (let i = 0; i < this.employers.length; i++) {
          if (this.employers[i].employerName === this.workExperience.get('employerName').value) {
            isTrue = true;
          }
        }

        if (isTrue === false) {
          this.counterNewEmployer++;

          this.stateOfNewEmploye = this.employers.length;

          this.newEmploye = {
            id: this.counterNewEmployer,
            concatPrint: '',
            employerName: this.workExperience.get('employerName').value,
            jobDescription: this.workExperience.get('jobDescription').value,
            fromDate: this.workExperience.get('fromDate').value,
            toDate: this.workExperience.get('toDate').value,
            phone: this.workExperience.get('empPhone').value,
            email: this.workExperience.get('empEmail').value,
            address: this.workExperience.get('empAddress').value,
            unit: this.workExperience.get('empUnit').value,
            type: [],
            cfr: this.workExperience.get('cfrPart').value,
            fmcsa: this.workExperience.get('fmCSA').value,
            reason: {
              id: this.selectReason.id,
              name: this.selectReason.name,
            },
            account: this.workExperience.get('accountForPeriod').value,
          };
          this.newEmploye.type = this.truckType.value;
          this.newEmploye.concatPrint =
            this.newEmploye.employerName +
            ' ' +
            this.storeApplicant.convertKendoDate(this.workExperience.get('fromDate').value) +
            ' - ' +
            this.storeApplicant.convertKendoDate(this.workExperience.get('toDate').value);
          this.maxDate = this.employers[index].toDate;
        }
      }
      this.restartForm();
      this.displayForm2 = true;
      this.countEmploye = index;
      this.disableAdd = true;
      this.maxDate = this.employers[index].toDate;
      if (this.displayForm2 === true) {
        if (this.clearTimeoutEmployer) {
          clearTimeout(this.clearTimeoutEmployer);
        }

        this.clearTimeoutEmployer = setTimeout(() => {
          this.workExperience.patchValue({
            employerName: this.employers[index].employerName,
            jobDescription: this.employers[index].jobDescription,
            fromDate: this.employers[index].fromDate,
            toDate: this.employers[index].toDate,
            empPhone: this.employers[index].phone,
            empEmail: this.employers[index].email,
            empAddress: this.employers[index].address,
            empUnit: this.employers[index].unit,
            cfrPart: this.employers[index].cfr,
            fmCSA: this.employers[index].fmcsa,
            reason: {
              id: this.employers[index].reason.id,
              name: this.employers[index].reason.name,
            },
            accountForPeriod: this.employers[index].account,
          });

          if (this.employers[index].type.length > 0) {
            this.isCheckedPosition = 'checked';
            this.hasDrivingPosition = true;
            this.getChecked();

            for (let i = 0; i < this.employers[index].type.length; i++) {
              this.addTruck();
              this.truckType
                .at(i)
                .get('truckType')
                .patchValue(this.employers[index].type[i].truckType);
              this.truckType
                .at(i)
                .get('trailerType')
                .patchValue(this.employers[index].type[i].trailerType);
              this.truckType
                .at(i)
                .get('truckLength')
                .patchValue(this.employers[index].type[i].truckLength);
            }
          } else {
            this.isCheckedPosition = 'unchecked';
            this.hasDrivingPosition = false;
            this.getChecked();
          }
          this.shared.touchFormFields(this.workExperience);
        }, 5);
      }

      this.shared.touchFormFields(this.workExperience);
    } else if (this.modeEmployer[index].value == 'edit') {
      if (!this.shared.markInvalid(this.workExperience)) {
        return false;
      }

      this.countEmploye = index;

      this.employers[index] = {
        id: index,
        concatPrint: '',
        employerName: this.workExperience.get('employerName').value,
        jobDescription: this.workExperience.get('jobDescription').value,
        fromDate: this.workExperience.get('fromDate').value,
        toDate: this.workExperience.get('toDate').value,
        phone: this.workExperience.get('empPhone').value,
        email: this.workExperience.get('empEmail').value,
        address: this.workExperience.get('empAddress').value,
        unit: this.workExperience.get('empUnit').value,
        type: [],
        cfr: this.workExperience.get('cfrPart').value,
        fmcsa: this.workExperience.get('fmCSA').value,
        reason: {
          id: this.selectReason.id,
          name: this.selectReason.name,
        },
        account: this.workExperience.get('accountForPeriod').value,
      };

      this.employers[index].type = this.truckType.value;
      this.employers[index].concatPrint =
        this.employers[index].employerName +
        ' ' +
        this.storeApplicant.convertKendoDate(this.workExperience.get('fromDate').value) +
        ' - ' +
        this.storeApplicant.convertKendoDate(this.workExperience.get('toDate').value);

      this.storeApplicant.saveForm(1, this.employers, 'workExperience');
      this.restartForm();
      clearTimeout(this.clearTimeoutEmployer);
      this.countEmploye = this.employers.length;
      this.maxDate = this.employers[index].fromDate;
    }

    // Change state
    this.modeEmployer[index].value == 'normal'
      ? (this.modeEmployer[index].value = 'edit')
      : (this.modeEmployer[index].value = 'normal');

    for (let i = 0; i < this.employers.length; i++) {
      if (i != index) {
        this.modeEmployer[i].value = 'normal';
      }
    }
  }

  deleteEmployer(index: number) {
    const toDate = this.employers[index].toDate;
    const fromDate = this.employers[index].fromDate;
    this.employers.splice(index, 1);
    this.modeEmployer.splice(index, 1);
    this.openDropDeleteDialogEmployer.splice(index, 1);

    if (this.employers.length >= 1) {
      this.employers.forEach((el, i) => (el.id = i));
    }

    if (this.employers.length < 1) {
      this.disableCheckNotExperience = false;
    }

    if (this.employers.length != 0) {
      this.maxDate = this.employers[this.employers.length - 1].fromDate;
      this.experience -= (toDate - fromDate) / 3600 / (24 * 1000);
    } else {
      this.maxDate = new Date(moment().format('YYYY-MM-DD'));
      this.experience = 0;
    }
    this.countEmploye--;
    this.storeApplicant.saveForm(1, this.employers, 'workExperience');
    this.restartForm();

    if (this.employers.length < 1) {
      this.showForm();
    }
  }

  onSelectOptionEmployer(canDelete: boolean, indk?: number) {
    this.openDropDeleteDialogEmployer[indk].value = false;
    if (canDelete) {
      this.deleteEmployer(indk);
    }
  }

  isDeleteActiveEmployer(indk: number) {
    this.openDropDeleteDialogEmployer[indk].value = true;
    for (let i = 0; i < this.openDropDeleteDialogEmployer.length; i++) {
      if (i != indk) {
        this.openDropDeleteDialogEmployer[i].value = false;
      }
    }
  }

  viewNewEmployer() {
    this.counterNewEmployer = 0;
    this.restartForm();
    this.countEmploye = this.stateOfNewEmploye;
    this.workExperience.patchValue({
      employerName: this.newEmploye.employerName,
      jobDescription: this.newEmploye.jobDescription,
      fromDate: this.newEmploye.fromDate,
      toDate: this.newEmploye.toDate,
      empPhone: this.newEmploye.phone,
      empEmail: this.newEmploye.email,
      empAddress: this.newEmploye.address,
      empUnit: this.newEmploye.unit,
      cfrPart: this.newEmploye.cfr,
      fmCSA: this.newEmploye.fmcsa,
      reason: {
        id: this.newEmploye.reason.id,
        name: this.newEmploye.reason.name,
      },
      accountForPeriod: this.newEmploye.account,
    });

    if (this.newEmploye.type.length > 0) {
      this.isCheckedPosition = 'checked';
      this.hasDrivingPosition = true;
      this.getChecked();

      for (let i = 0; i < this.newEmploye.type.length; i++) {
        this.addTruck();
        this.truckType.at(i).get('truckType').patchValue(this.newEmploye.type[i].truckType);
        this.truckType.at(i).get('trailerType').patchValue(this.newEmploye.type[i].trailerType);
        this.truckType.at(i).get('truckLength').patchValue(this.newEmploye.type[i].truckLength);
      }
    } else {
      this.isCheckedPosition = 'unchecked';
      this.hasDrivingPosition = false;
      this.getChecked();
    }
    this.disableAdd = false;
    this.modeEmployer[this.indexOfOldEmployer].value = 'normal';
    this.shared.touchFormFields(this.workExperience);
    if (!this.shared.markInvalid(this.workExperience)) {
      return false;
    }
  }

  deleteNewEmployer() {
    this.newEmploye = null;
    this.counterNewEmployer = 0;
    this.disableAdd = false;
  }

  restartForm() {
    this.isCheckedPosition = 'unchecked';
    this.hasDrivingPosition = false;
    this.getChecked();
    this.deleteAllTruck();
    this.clearValidate(this.workExperience.get('fmCSA'));
    this.clearValidate(this.workExperience.get('cfrPart'));

    this.workExperience.reset();
  }

  // Check for experience
  haventExperience() {
    if (!this.disableCheckNotExperience) {
      if (this.workExperience.get('haveExperience').value) {
        this.disableAdd = false; // for ngClass expression
        this.displayForm2 = true;
        this.workExperience.get('employerName').enable();
        this.workExperience.get('jobDescription').enable();
        this.workExperience.get('fromDate').enable();
        this.workExperience.get('toDate').enable();
        this.workExperience.get('empPhone').enable();
        this.workExperience.get('empEmail').enable();
        this.workExperience.get('empAddress').enable();
        this.workExperience.get('empUnit').enable();
        this.workExperience.get('reason').enable();
        this.workExperience.get('accountForPeriod').enable();
      } else {
        this.workExperience.reset();
        this.workExperience.get('employerName').disable();
        this.workExperience.get('jobDescription').disable();
        this.workExperience.get('fromDate').disable();
        this.workExperience.get('toDate').disable();
        this.workExperience.get('empPhone').disable();
        this.workExperience.get('empEmail').disable();
        this.workExperience.get('empAddress').disable();
        this.workExperience.get('empUnit').disable();
        this.workExperience.get('reason').disable();
        this.workExperience.get('accountForPeriod').disable();
        this.workExperience.get('type').disable();
        this.workExperience.get('cfrPart').disable();
        this.workExperience.get('fmCSA').disable();
        this.isCheckedPosition = 'unchecked';
        this.hasDrivingPosition = false;
        this.getChecked();
        this.deleteAllTruck();
      }
      this.workExperience.invalid;
    } else {
      this.workExperience.valid;
    }
  }

  getTrucksBus() {
    this.truckListModificated = this.truckList.filter(
      (x) => x.class != 'personalvehicle-icon' && x.class != 'motorcycle-icon'
    );
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

    if (inputID === 'empEmail') {
      this.formatType = /^[!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        false
      );
    } else if (inputID === 'desc' || inputID === 'accountPeriod') {
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
    this.workExperience.controls[inputID].patchValue(
      (document.getElementById(inputID) as HTMLInputElement).value
    );
  }

  transformInputData() {
    const data = {
      employerName: 'upper',
      jobDescription: 'capitalize',
      accountForPeriod: 'capitalize',
    };
    this.shared.handleInputValues(this.workExperience, data);
  }

  clearValidate(form: AbstractControl) {
    form.clearValidators();
    form.updateValueAndValidity();
  }

  capitalizeLetter(word) {
    if (!word) {
      return word;
    }
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }

  onCheckBackSpace(event) {
    if (event.keyCode === 8) {
      this.numOfSpaces = 0;
    }
  }

  onEmailTyping(event) {
    return emailChack(event);
  }

  onNameTyping(event) {
    let k;
    k = event.charCode;
    if (k == 32) {
      this.numOfSpaces++;
    } else {
      this.numOfSpaces = 0;
    }
    if ((document.getElementById('employerName') as HTMLInputElement).value === '') {
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

  manageInputEmail(formElement: any) {
    if (this.listenForEmail === true) { return this.shared.manageInputValidation(formElement); } else { return null; }
  }
  public handleAddressChange(address: any) {
    this.isValidAddress = true;
    this.address = this.shared.selectAddress(this.workExperience, address);

    this.workExperience.get('empAddress').patchValue(this.address.address);
  }

  onTruckValidation(validity: string) {
    switch (validity) {
      case 'VALID':
        // do 'form valid' action
        this.disableTruck = false;
        break;
      case 'INVALID':
        // do 'form invalid' action
        this.disableTruck = true;
        break;
    }
  }

  onFormValidation(validity: string) {
    switch (validity) {
      case 'VALID':
        // do 'form valid' action
        this.disableAdd = false;
        break;
      case 'INVALID':
        // do 'form invalid' action
        this.disableAdd = true;
        break;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
