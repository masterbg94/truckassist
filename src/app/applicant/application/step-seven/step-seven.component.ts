import { takeUntil } from 'rxjs/operators';
import { ApplicantReviewService } from './../../service/applicant-review.service';
import { Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import moment from 'moment';
import { Subject } from 'rxjs';
import { SharedService } from 'src/app/core/services/shared.service';
import { checkSelectedText, pasteCheck } from 'src/assets/utils/methods-global';
import { environment } from 'src/environments/environment';
import { ApplicantStore } from '../../service/applicant.service';

@Component({
  selector: 'app-step-seven',
  templateUrl: './step-seven.component.html',
  styleUrls: ['./step-seven.component.scss'],
})
export class StepSevenComponent implements OnInit {

  constructor(
    private shared: SharedService,
    private storeApplicant: ApplicantStore,
    private reviewApplicant: ApplicantReviewService
  ) {}
  daysHOS: FormGroup;

  arrayOfDate: any[] = [];
  day1: number;
  day2: number;
  day3: number;
  day4: number;
  day5: number;
  day6: number;
  day7: number;
  sumDays = 0;

  certifyKnowledge: any;
  cerifyUnderstand: any;
  workForAnotherEmploye = false;
  IntendworkForAnotherEmploye = false;

  format: FormatSettings = environment.dateFormat;
  public maxDate = new Date(moment().format('YYYY-MM-DD'));
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

  public formatType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]*$/;
  public numOfSpaces = 0;

  public numOfSpaces2 = 0;

  ngOnInit(): void {
    this.storeApplicant.reviewCompany
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => (this.isCompanyReview = data));

    this.InitForm();
    this.week();
    this.reloadData(JSON.parse(sessionStorage.getItem('7daysHOS')));

    if (!this.isCompanyReview) {
    } else {
      this.companyReview = this.reviewApplicant.companyReviewStepSeven;
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
    this.daysHOS = new FormGroup({
      sumHour: new FormControl(null, Validators.required),
      firstDay: new FormControl(null, Validators.required),
      secondDay: new FormControl(null, Validators.required),
      thirdDay: new FormControl(null, Validators.required),
      fourthDay: new FormControl(null, Validators.required),
      fifthDay: new FormControl(null, Validators.required),
      sixthDay: new FormControl(null, Validators.required),
      seventhDay: new FormControl(null, Validators.required),
      certifyKnowledge: new FormControl(null, Validators.required),
      cerifyUnderstand: new FormControl(null, Validators.required),
      dateHOS: new FormControl(null, Validators.required),
      cityState: new FormControl(null, Validators.required),
      workForAnotherEmpl: new FormControl(null, Validators.required),
      explainWorkAnotherEmpl: new FormControl(null),
      intendToWorkForAnotherEmpl: new FormControl(null, Validators.required),
      explainIntendWorkAnotherEmpl: new FormControl(null),
    });
    setTimeout(() => {
      this.transformInputData();
    });
  }

  reloadData(data: any) {
    if (data != null) {
      this.daysHOS.patchValue({
        sumHour: data.sumHour,
        firstDay: data.firstDay,
        secondDay: data.secondDay,
        thirdDay: data.thirdDay,
        fourthDay: data.fourthDay,
        fifthDay: data.fifthDay,
        sixthDay: data.sixthDay,
        seventhDay: data.seventhDay,
        certifyKnowledge: data.certifyKnowledge,
        cerifyUnderstand: data.cerifyUnderstand,
        dateHOS: new Date(data.dateHOS),
        cityState: data.cityState,
        workForAnotherEmpl: data.workForAnotherEmpl,
        explainWorkAnotherEmpl: data.explainWorkAnotherEmpl,
        intendToWorkForAnotherEmpl: data.intendToWorkForAnotherEmpl,
        explainIntendWorkAnotherEmpl: data.explainIntendWorkAnotherEmpl,
      });
      if (data.workForAnotherEmpl == 'yes') {
        this.workForAnotherEmploye = true;
      }
      if (data.intendToWorkForAnotherEmpl == 'yes') {
        this.IntendworkForAnotherEmploye = true;
      }
      this.day1 = data.firstDay != null ? data.firstDay : 0;
      this.day2 = data.secondDay != null ? data.secondDay : 0;
      this.day3 = data.thirdDay != null ? data.thirdDay : 0;
      this.day4 = data.fourthDay != null ? data.fourthDay : 0;
      this.day5 = data.fifthDay != null ? data.fifthDay : 0;
      this.day6 = data.sixthDay != null ? data.sixthDay : 0;
      this.day7 = data.seventhDay != null ? data.seventhDay : 0;

      if (!this.shared.markInvalid(this.daysHOS)) {
        return false;
      }
    }
  }

  onSubmit() {
    if (!this.isCompanyReview) {
      if (!this.shared.markInvalid(this.daysHOS)) {
        return false;
      }
      this.storeApplicant.saveForm(6, this.daysHOS.value, '7daysHOS');
    } else {
      if (this.isSomeFalseReview.length === 0) {
        this.reviewApplicant.reviewStepSeven.next(true);
        this.isAllCorrectly(true);
      } else {
        this.reviewApplicant.reviewStepSeven.next(false);
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
    this.storeApplicant.stepForward.emit(8);
  }

  stepBack() {
    this.storeApplicant.stepBackward.emit(6);
  }

  week() {
    const startWeek = moment().subtract(6, 'day');
    const endWeek = moment();
    let day = startWeek;
    while (day <= endWeek) {
      this.arrayOfDate.push(day.format('MM/DD/YY'));
      day = day.clone().add(1, 'd');
    }
  }

  sumHOS() {
    this.day1 <= 14
      ? this.daysHOS.get('firstDay').patchValue(this.day1)
      : this.daysHOS.get('firstDay').patchValue(null);
    this.day2 <= 14
      ? this.daysHOS.get('secondDay').patchValue(this.day2)
      : this.daysHOS.get('secondDay').patchValue(null);
    this.day3 <= 14
      ? this.daysHOS.get('thirdDay').patchValue(this.day3)
      : this.daysHOS.get('thirdDay').patchValue(null);
    this.day4 <= 14
      ? this.daysHOS.get('fourthDay').patchValue(this.day4)
      : this.daysHOS.get('fourthDay').patchValue(null);
    this.day5 <= 14
      ? this.daysHOS.get('fifthDay').patchValue(this.day5)
      : this.daysHOS.get('fifthDay').patchValue(null);
    this.day6 <= 14
      ? this.daysHOS.get('sixthDay').patchValue(this.day6)
      : this.daysHOS.get('sixthDay').patchValue(null);
    this.day7 <= 14
      ? this.daysHOS.get('seventhDay').patchValue(this.day7)
      : this.daysHOS.get('seventhDay').patchValue(null);

    this.sumDays =
      this.day1 + this.day2 + this.day3 + this.day4 + this.day5 + this.day6 + this.day7;
    this.daysHOS.get('sumHour').setValue(this.sumDays);
    this.daysHOS.get('sumHour').patchValue(this.sumDays);
    this.clearValidate(this.daysHOS.get('sumHour'));
  }
  public handleAddressChange(address: any) {
    this.isValidAddress = true;
    this.address = this.shared.selectAddress(this.daysHOS, address);

    this.daysHOS.get('cityState').patchValue(this.address.address);
  }

  questionsWithExplanation(value: any, formControlAction: any, formControl: any) {
    if (value == 'yes') {
      switch (formControlAction) {
        case 'workForAnotherEmpl':
          this.workForAnotherEmploye = true;
          break;
        case 'intendToWorkForAnotherEmpl':
          this.IntendworkForAnotherEmploye = true;
          break;
        default:
          break;
      }
      this.daysHOS.get(formControl).reset();
      this.daysHOS.get(formControl).enable();
      this.daysHOS.get(formControl).setValidators(Validators.required);
    } else {
      switch (formControlAction) {
        case 'workForAnotherEmpl':
          this.workForAnotherEmploye = false;
          break;
        case 'intendToWorkForAnotherEmpl':
          this.IntendworkForAnotherEmploye = false;
          break;
        default:
          break;
      }

      this.clearValidate(this.daysHOS.get(formControl));
      this.daysHOS.get(formControl).patchValue(null);
      this.daysHOS.get(formControl).disable();
    }
  }

  disableArrowDown(day, event) {
    if (day == 0 && event.code === 'ArrowDown') {
      event.preventDefault();
    }
  }

  // Feedback review
  feedbackReview(data) {
    const index = this.isSomeFalseReview.findIndex((item) => item.id === data.id);
    if (data.isTrue) {
      this.reviewApplicant.reviewStepSeven.next(data);
    } else {
      this.isSomeFalseReview.push(data);
      this.reviewApplicant.reviewStepSeven.next(data);
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
  /* Form Validation on paste and word validation */
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
    if (inputID === 'explainWorkAnotherEmpl' || inputID === 'explainIntendWorkAnotherEmpl') {
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

  private transformInputData() {
    const data = {
      explainWorkAnotherEmpl: 'capitalize',
      explainIntendWorkAnotherEmpl: 'capitalize',
    };
    this.shared.handleInputValues(this.daysHOS, data);
  }

  clearValidate(form: AbstractControl) {
    form.clearValidators();
    form.updateValueAndValidity();
  }

  manageInputValidation(formElement: any) {
    return this.shared.manageInputValidation(formElement);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
