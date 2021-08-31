import { takeUntil } from 'rxjs/operators';
import { ApplicantReviewService } from './../../service/applicant-review.service';
import { ApplicantStore } from './../../service/applicant.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
import { SharedService } from 'src/app/core/services/shared.service';
import { checkSelectedText, pasteCheck } from 'src/assets/utils/methods-global';
import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import { environment } from 'src/environments/environment';
import { IEducation } from '../../model/education.model';
import moment from 'moment';
import { NotificationService } from 'src/app/services/notification-service.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-step-six',
  templateUrl: './step-six.component.html',
  styleUrls: ['./step-six.component.scss'],
})
export class StepSixComponent implements OnInit {

  constructor(
    private shared: SharedService,
    private storeApplicant: ApplicantStore,
    private notification: NotificationService,
    private reviewApplicant: ApplicantReviewService
  ) {}

  get gradesArray(): FormArray {
    return this.education.get('grade') as FormArray;
  }

  get collegeArray(): FormArray {
    return this.education.get('college') as FormArray;
  }

  get getEmergency(): FormArray {
    return this.education.get('emergency') as FormArray;
  }
  education: FormGroup;

  educationData: IEducation;
  grade: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  gradeMobile = false;
  college: string[] = ['1', '2', '3', '4'];

  checkGrade: any = null;
  checkCollege: any = null;

  isSpecialTraining = false;
  isOtherTraining = false;
  isUnablePerformFunction = false;

  driveBefore = false;

  emergencyContact: string[] = ['second', 'third'];
  emergencyCounter = 0;
  disableEmeregency = false;

  // DropDown Modal logic Emmergency
  openDropDeleteDialogEmmergency = [
    {
      value: false,
    },
  ];

  format: FormatSettings = environment.dateFormat;
  public maxDate = new Date(moment().format('YYYY-MM-DD'));

  // Company review
  companyReview?: any = [];
  isCompanyReview?: any;
  isSomeFalseReview?: any[] = []; // treba da se sacuva na back-u

  private destroy$: Subject<void> = new Subject<void>();

  public numOfSpaces2 = 0;

  public formatType: any;
  public numOfSpaces = 0;

  ngOnInit(): void {
    this.storeApplicant.reviewCompany
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => (this.isCompanyReview = data));

    this.InitForm();
    this.reloadData(JSON.parse(sessionStorage.getItem('education')));
    if (window.screen.width <= 414) {
      this.gradeMobile = true;
    }
    if (!this.isCompanyReview) {
    } else {
      this.companyReview = this.reviewApplicant.companyReviewStepSix;
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
    (this.education = new FormGroup({
      grade: this.addGrades(),
      college: this.addCollege(),
      specialTraining: new FormControl(null, Validators.required),
      explainSPTraining: new FormControl(null),
      otherTraining: new FormControl(null, Validators.required),
      explainOTHTraining: new FormControl(null),
      fullKnowledgeFederalMotoCarrier: new FormControl(null, Validators.required),
      driveBefore: new FormControl(null, Validators.required),
      whenDate: new FormControl(null),
      reasonUnablePerform: new FormControl(null, Validators.required),
      explainReason: new FormControl(null),
      emergency: new FormArray([
        new FormGroup({
          emergencyName: new FormControl(null, Validators.required),
          emergencyPhone: new FormControl(null, Validators.required),
          relationship: new FormControl(null, Validators.required),
        }),
      ]),
    })),
      setTimeout(() => {
        this.transformInputData();
      });
  }

  reloadData(data: any) {
    if (data != null) {
      this.education.patchValue({
        specialTraining: data.isSpecialTraining,
        explainSPTraining: null,
        otherTraining: data.isOtherTraining,
        explainOTHTraining: null,
        fullKnowledgeFederalMotoCarrier: data.federalMotoCarrier,
        driveBefore: data.driverBeforeInThisCompany,
        whenDate: null,
        reasonUnablePerform: data.reasonUnablePerform,
        explainReason: data.explainReasonUPerform,
      });
      for (let i = 0; i < data.emergencyContact.length; i++) {
        this.getEmergency.at(i).patchValue({
          emergencyName: data.emergencyContact[i].emergencyName,
          emergencyPhone: data.emergencyContact[i].emergencyPhone,
          relationship: data.emergencyContact[i].relationship,
        });
        if (i < data.emergencyContact.length - 1) {
          this.addEmergency();
        }
      }
      if (data.isSpecialTraining == 'yes') {
        this.isSpecialTraining = true;
        this.education.get('explainSPTraining').patchValue(data.explainSpecialTraining);
      }

      if (data.isOtherTraining == 'yes') {
        this.isOtherTraining = true;
        this.education.get('explainOTHTraining').patchValue(data.explainOtherTraining);
      }

      if (data.reasonUnablePerform == 'yes') {
        this.isUnablePerformFunction = true;
        this.education.get('reasonUnablePerform').patchValue(data.reasonUnablePerform);
      }

      if (data.driverBeforeInThisCompany == 'yes') {
        this.education.get('whenDate').patchValue(new Date(data.dateOfDriving));
        this.driveBefore = true;
      }
      if (data.grade != null) {
        for (let i = 0; i < data.length; i++) {
          this.gradesArray.controls[i].patchValue(true);
        }
        this.checkGrade = data.grade;
        this.onCheckedGrade(this.checkGrade, true);
      }
      if (data.college != null) {
        for (let i = 0; i < data.length; i++) {
          this.collegeArray.controls[i].patchValue(true);
        }
        this.checkCollege = data.college;
        this.onCheckedCollege(this.checkCollege, true);
      }
      if (!this.shared.markInvalid(this.education)) {
        return false;
      }
    }
  }

  onSubmit() {
    if (!this.isCompanyReview) {
      if (!this.shared.markInvalid(this.education)) {
        return false;
      }

      this.educationData = {
        grade: this.checkCollege !== null ? 12 : this.checkGrade ? this.checkGrade : null,
        college: this.checkCollege != null ? this.checkCollege : null,
        isSpecialTraining: this.education.get('specialTraining').value,
        explainSpecialTraining: this.education.get('explainSPTraining').value,
        isOtherTraining: this.education.get('otherTraining').value,
        explainOtherTraining: this.education.get('explainOTHTraining').value,
        federalMotoCarrier: this.education.get('fullKnowledgeFederalMotoCarrier').value,
        driverBeforeInThisCompany: this.education.get('driveBefore').value,
        dateOfDriving: this.education.get('whenDate').value,
        reasonUnablePerform: this.education.get('reasonUnablePerform').value,
        explainReasonUPerform: this.education.get('explainReason').value,
        emergencyContact: [],
      };
      for (let i = 0; i < this.getEmergency.length; i++) {
        this.educationData.emergencyContact[i] = {
          emergencyName: this.getEmergency.at(i).get('emergencyName').value,
          emergencyPhone: this.getEmergency.at(i).get('emergencyPhone').value,
          relationship: this.getEmergency.at(i).get('relationship').value,
        };
      }
      this.storeApplicant.saveForm(5, this.educationData, 'education');
    } else {
      if (this.isSomeFalseReview.length === 0) {
        this.reviewApplicant.reviewStepSix.next(true);
        this.isAllCorrectly(true);
      } else {
        this.reviewApplicant.reviewStepSix.next(false);
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

    this.storeApplicant.stepForward.emit(7);
  }

  stepBack() {
    this.storeApplicant.stepBackward.emit(5);
  }

  addGrades() {
    const arr = this.grade.map(() => {
      return new FormControl(false);
    });
    return new FormArray(arr);
  }

  onCheckedGrade(data: any, isChecked: boolean) {
    this.checkGrade = data + 1;

    if (isChecked) {
      for (let i = 0; i < data; i++) {
        this.gradesArray.controls[i].patchValue(true);
      }
    } else {
      this.gradesArray.controls[data].patchValue(true);

      const current = data + 1;

      for (let i = current; i < this.grade.length; i++) {
        this.gradesArray.controls[i].patchValue(false);
      }
      for (let i = 0; i < this.college.length; i++) {
        this.collegeArray.controls[i].patchValue(false);
      }
      this.checkCollege = null;
    }
  }

  addCollege() {
    const arr = this.college.map(() => {
      return new FormControl(false);
    });
    return new FormArray(arr);
  }

  onCheckedCollege(data: number, isChecked: boolean) {
    this.checkCollege = data + 1;
    let counter = 0;
    if (isChecked) {
      for (let i = 0; i < data; i++) {
        this.collegeArray.controls[i].patchValue(true);
      }
      while (counter <= 11) {
        this.gradesArray.controls[counter].patchValue(true);
        counter++;
      }
    } else {
      this.collegeArray.controls[data].patchValue(true);
      const current = data + 1;
      for (let i = current; i < this.college.length; i++) {
        this.collegeArray.controls[i].patchValue(false);
      }
      while (counter <= 11) {
        this.gradesArray.controls[counter].patchValue(true);
        counter++;
      }
    }
  }

  questionsWithExplanation(value: any, formControlAction: any, formControl: any) {
    if (value == 'yes') {
      switch (formControlAction) {
        case 'specialTraining':
          this.isSpecialTraining = true;
          break;
        case 'otherTraining':
          this.isOtherTraining = true;
          break;
        case 'driveBefore':
          this.driveBefore = true;
          break;
        case 'reasonUnablePerform':
          this.isUnablePerformFunction = true;
          break;
        default:
          break;
      }

      this.education.get(formControl).reset();
      this.education.get(formControl).enable();
      this.education.get(formControl).setValidators(Validators.required);
    } else {
      switch (formControlAction) {
        case 'specialTraining':
          this.isSpecialTraining = false;
          break;
        case 'otherTraining':
          this.isOtherTraining = false;
          break;
        case 'driveBefore':
          this.driveBefore = false;
          break;
        case 'reasonUnablePerform':
          this.isUnablePerformFunction = false;
          break;
        default:
          break;
      }

      this.clearValidate(this.education.get(formControl));
      this.education.get(formControl).patchValue(null);
      this.education.get(formControl).disable();
    }
  }

  addEmergency() {
    if (this.getEmergency.invalid) {
      this.notification.warning('Please fill all required fields on emergency.', 'Warning:');
      return false;
    }
    this.getEmergency.push(
      new FormGroup({
        emergencyName: new FormControl(null, Validators.required),
        emergencyPhone: new FormControl(null, Validators.required),
        relationship: new FormControl(null, Validators.required),
      })
    );

    this.emergencyCounter++;
    this.openDropDeleteDialogEmmergency.push({
      value: false,
    });
  }

  deleteEmergency(index: number) {
    this.getEmergency.removeAt(index);
    this.emergencyCounter--;
  }

  onSelectOptionEmergency(canDelete: boolean, indk?: number) {
    this.openDropDeleteDialogEmmergency[indk].value = false;
    if (canDelete) {
      this.deleteEmergency(indk);
    }
  }

  isDeleteActiveEmergency(indk: number) {
    this.openDropDeleteDialogEmmergency[indk].value = true;
    for (let i = 0; i < this.openDropDeleteDialogEmmergency.length; i++) {
      if (i != indk) {
        this.openDropDeleteDialogEmmergency[i].value = false;
      }
    }
  }

  // Feedback review
  feedbackReview(data) {
    const index = this.isSomeFalseReview.findIndex((item) => item.id === data.id);
    if (data.isTrue) {
      this.reviewApplicant.reviewStepSix.next(data);
    } else {
      this.isSomeFalseReview.push(data);
      this.reviewApplicant.reviewStepSix.next(data);
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
    this.reviewApplicant.reviewStepSix.next(true);
  }

  manageInputValidation(formElement: any) {
    return this.shared.manageInputValidation(formElement);
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

  clearValidate(form: AbstractControl) {
    form.clearValidators();
    form.updateValueAndValidity();
  }

  private transformInputData() {
    const data = {
      explainSPTraining: 'capitalize',
      explainOTHTraining: 'capitalize',
      explainReason: 'capitalize',
    };
    this.shared.handleInputValues(this.education, data);
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

    this.formatType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]*$/;
    event.preventDefault();
    (document.getElementById(inputID + index) as HTMLInputElement).value += pasteCheck(
      event.clipboardData.getData('Text'),
      this.formatType,
      false,
      false,
      false,
      limitedCuracters
    );

    if (inputID + index === '\'emergencyName\' + index' || inputID === '\'relationship\' + index') {
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        false,
        false,
        false
      );
    }
    if (inputID === '\'emergencyName\' + index') {
      this.getEmergency
        .at(index)
        .get('\'emergencyName\' + index')
        .patchValue((document.getElementById(inputID) as HTMLInputElement).value);
    }
    if (inputID === '\'relationship\' + index') {
      this.getEmergency
        .at(index)
        .get('\'relationship\' + index')
        .patchValue((document.getElementById(inputID) as HTMLInputElement).value);
    }
    this.getEmergency
      .at(index)
      .get(inputID)
      .patchValue((document.getElementById(inputID + index) as HTMLInputElement).value);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
