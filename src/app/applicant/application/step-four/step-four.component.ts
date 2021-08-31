import { takeUntil } from 'rxjs/operators';
import { ApplicantReviewService } from './../../service/applicant-review.service';
import { ApplicantStore } from './../../service/applicant.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { SharedService } from 'src/app/core/services/shared.service';
import { checkSelectedText, pasteCheck } from 'src/assets/utils/methods-global';
import { IAccident } from '../../model/accident.model';
import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import { environment } from 'src/environments/environment';
import moment from 'moment';

@Component({
  selector: 'app-step-four',
  templateUrl: './step-four.component.html',
  styleUrls: ['./step-four.component.scss'],
})
export class StepFourComponent implements OnInit {

  constructor(
    private shared: SharedService,
    private storeApplicant: ApplicantStore,
    private reviewApplicant: ApplicantReviewService
  ) {}
  accident: FormGroup;
  displayForm4 = true;

  accidents = {
    fatalityCount: 0,
    injuriesCount: 0,
  };
  listOfAccident: IAccident[] = [];
  countAccident = 0;
  modeAccident = [
    {
      value: 'normal',
    },
  ];

  // DropDown Modal logic Employer
  openDropDeleteDialogAccident = [
    {
      value: false,
    },
  ];

  disableAddNextAccident = false;
  noAccident = false;

  format: FormatSettings = environment.dateFormat;
  months: string[] = this.storeApplicant.months;
  public maxDate = new Date(moment().format('YYYY-MM-DD'));

  // Company Review
  companyReview?: any = [];
  isCompanyReview?: any;
  isSomeFalseReview?: any[] = []; // treba da se sacuva na back-u

  public options = {
    componentRestrictions: { country: ['US', 'CA'] },
  };

  private destroy$: Subject<void> = new Subject<void>();

  address: any;
  isValidAddress = false;

  public numOfSpaces2 = 0;

  public formatType: any;
  public numOfSpaces = 0;

  ngOnInit(): void {
    this.storeApplicant.reviewCompany
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => (this.isCompanyReview = data));

    this.reloadData(JSON.parse(sessionStorage.getItem('accident')));
    this.InitForm();
    if (!this.isCompanyReview) {

      this.displayForm4 =
        JSON.parse(sessionStorage.getItem('displayForm4')) != undefined &&
        this.listOfAccident.length > 0 &&
        this.accident.get('dateAccident').value === null
          ? JSON.parse(sessionStorage.getItem('displayForm4'))
          : true;
    } else {
      this.companyReview = this.reviewApplicant.companyReviewStepFour;
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
    (this.accident = new FormGroup({
      noAccident: new FormControl(false),
      location: new FormControl(null, Validators.required),
      dateAccident: new FormControl(null, Validators.required),
      fatalitiesAccident: new FormControl(null, Validators.required),
      injuriesAccident: new FormControl(null, Validators.required),
      descriptionAccident: new FormControl(null, Validators.required),
      hazmatSpill: new FormControl(null, Validators.required),
    })),
      setTimeout(() => {
        this.transformInputData();
      });
  }

  reloadData(data: any) {
    if (data != null) {
      if (data.noAccident) {
        this.noAccident = true;
      } else {
        for (let i = 0; i < data.length; i++) {
          this.openDropDeleteDialogAccident.push({
            value: false,
          });
          this.modeAccident[i] = {
            value: 'normal',
          };
          this.listOfAccident.push({
            id: data[i].id,
            location: data[i].location,
            date: new Date(data[i].date),
            modifiedDate: this.storeApplicant.convertKendoDate(new Date(data[i].date)),
            fatalities: data[i].fatalities,
            injuries: data[i].injuries,
            description: data[i].description,
            hazmatSpill: data[i].hazmatSpill,
          });
        }
        this.countAccident = this.listOfAccident.length;
      }
    }
  }

  hideForm() {
    this.displayForm4 = false;
    this.accident.get('location').reset();
    this.accident.get('location').clearValidators();
    this.accident.get('dateAccident').reset();
    this.accident.get('dateAccident').clearValidators();
    this.accident.get('fatalitiesAccident').reset();
    this.accident.get('fatalitiesAccident').clearValidators();
    this.accident.get('injuriesAccident').reset();
    this.accident.get('injuriesAccident').clearValidators();
    this.accident.get('descriptionAccident').reset();
    this.accident.get('descriptionAccident').clearValidators();
    this.accident.get('hazmatSpill').reset();
    this.accident.get('hazmatSpill').clearValidators();

    for (let i = 0; i < this.modeAccident.length; i++) {
      this.modeAccident[i] = {
        value: 'normal',
      };
    }
  }

  showForm() {
    this.accident.reset();
    this.accidents = {
      fatalityCount: 0,
      injuriesCount: 0,
    };
    this.displayForm4 = true;
    this.accident.get('location').setValidators(Validators.required);
    this.accident.get('dateAccident').setValidators(Validators.required);
    this.accident.get('fatalitiesAccident').setValidators(Validators.required);
    this.accident.get('injuriesAccident').setValidators(Validators.required);
    this.accident.get('descriptionAccident').setValidators(Validators.required);
    this.accident.get('hazmatSpill').setValidators(Validators.required);
  }

  onSubmit() {
    if (!this.isCompanyReview) {
      if (!this.noAccident) {
        if (this.displayForm4 === true) {
          if (!this.shared.markInvalid(this.accident)) {
            return false;
          }
          // Check if load exist or add new
          let existIndex = -1;
          for (let i = 0; i < this.listOfAccident.length; i++) {
            if (this.listOfAccident[i].date === this.accident.get('dateAccident').value) {
              existIndex = i;
            }
          }

          if (existIndex != -1) {
            this.listOfAccident[existIndex] = {
              id: existIndex,
              location: this.accident.get('location').value,
              date: this.accident.get('dateAccident').value,
              modifiedDate: this.storeApplicant.convertKendoDate(
                new Date(this.accident.get('dateAccident').value)
              ),
              fatalities: this.accident.get('fatalitiesAccident').value,
              injuries: this.accident.get('injuriesAccident').value,
              description: this.accident.get('descriptionAccident').value,
              hazmatSpill: this.accident.get('hazmatSpill').value,
            };
            this.accident.reset();
          } else {
            this.listOfAccident.push({
              id: this.listOfAccident.length >= 1 ? this.listOfAccident.length : this.countAccident,
              location: this.accident.get('location').value,
              date: this.accident.get('dateAccident').value,
              modifiedDate: this.storeApplicant.convertKendoDate(
                new Date(this.accident.get('dateAccident').value)
              ),
              fatalities: this.accident.get('fatalitiesAccident').value,
              injuries: this.accident.get('injuriesAccident').value,
              description: this.accident.get('descriptionAccident').value,
              hazmatSpill: this.accident.get('hazmatSpill').value,
            });
            this.countAccident++;
            this.accident.reset();
            this.displayForm4 = false;
          }
          this.displayForm4 = false;
        }
        if (this.listOfAccident.length < 1) {
          if (!this.shared.markInvalid(this.accident)) {
            return false;
          }
        }
        this.storeApplicant.saveForm(3, this.listOfAccident, 'accident');
        sessionStorage.setItem('displayForm4', JSON.stringify(this.displayForm4));
      } else {
        this.storeApplicant.saveForm(3, this.accident.value, 'accident');
      }
    } else {
      if (this.isSomeFalseReview.length === 0) {
        this.reviewApplicant.reviewStepFour.next(true);
        this.isAllCorrectly(true);
      } else {
        this.reviewApplicant.reviewStepFour.next(false);
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

    this.storeApplicant.stepForward.emit(5);
  }

  stepBack() {
    this.storeApplicant.stepBackward.emit(3);
  }

  HasAccident() {
    if (this.accident.get('noAccident').value) {
      this.accident.get('location').reset();
      this.accident.get('location').enable();
      this.accident.get('dateAccident').reset();
      this.accident.get('dateAccident').enable();
      this.accident.get('fatalitiesAccident').reset();
      this.accident.get('fatalitiesAccident').enable();
      this.accident.get('injuriesAccident').reset();
      this.accident.get('injuriesAccident').enable();
      this.accident.get('descriptionAccident').reset();
      this.accident.get('descriptionAccident').enable();
      this.accident.get('hazmatSpill').reset();
      this.accident.get('hazmatSpill').enable();
      this.displayForm4 = true;
    } else {
      this.accident.get('location').reset();
      this.accident.get('location').disable();
      this.accident.get('dateAccident').reset();
      this.accident.get('dateAccident').disable();
      this.accident.get('fatalitiesAccident').reset();
      this.accident.get('fatalitiesAccident').disable();
      this.accident.get('injuriesAccident').reset();
      this.accident.get('injuriesAccident').disable();
      this.accident.get('descriptionAccident').reset();
      this.accident.get('descriptionAccident').disable();
      this.accident.get('hazmatSpill').reset();
      this.accident.get('hazmatSpill').disable();
      this.listOfAccident = [];
      this.storeApplicant.saveForm(3, this.listOfAccident, 'accident');
      this.displayForm4 = false;
    }
  }

  addAccident() {
    if (!this.shared.markInvalid(this.accident)) {
      return false;
    }

    // Check if load exist or add new
    let existIndex = -1;
    for (let i = 0; i < this.listOfAccident.length; i++) {
      if (this.listOfAccident[i].date === this.accident.get('dateAccident').value) {
        existIndex = i;
      }
    }

    if (existIndex != -1) {
      this.listOfAccident[existIndex] = {
        id: existIndex,
        location: this.accident.get('location').value,
        date: this.accident.get('dateAccident').value,
        modifiedDate: this.storeApplicant.convertKendoDate(
          new Date(this.accident.get('dateAccident').value)
        ),
        fatalities: this.accident.get('fatalitiesAccident').value,
        injuries: this.accident.get('injuriesAccident').value,
        description: this.accident.get('descriptionAccident').value,
        hazmatSpill: this.accident.get('hazmatSpill').value,
      };
      this.modeAccident[existIndex].value = 'normal';
    } else {
      this.listOfAccident.push({
        id: this.listOfAccident.length >= 1 ? this.listOfAccident.length : this.countAccident,
        location: this.accident.get('location').value,
        date: this.accident.get('dateAccident').value,
        modifiedDate: this.storeApplicant.convertKendoDate(
          new Date(this.accident.get('dateAccident').value)
        ),
        fatalities: this.accident.get('fatalitiesAccident').value,
        injuries: this.accident.get('injuriesAccident').value,
        description: this.accident.get('descriptionAccident').value,
        hazmatSpill: this.accident.get('hazmatSpill').value,
      });
      this.countAccident++;
      this.modeAccident.push({
        value: 'normal',
      });
      this.openDropDeleteDialogAccident.push({
        value: false,
      });
    }

    this.storeApplicant.saveForm(3, this.listOfAccident, 'accident');
    this.accident.reset();
    this.accidents = {
      fatalityCount: 0,
      injuriesCount: 0,
    };
  }

  onSelectDeleteAccident(canDelete: boolean, indk?: number) {
    this.openDropDeleteDialogAccident[indk].value = false;
    if (canDelete) {
      this.deleteAccident(indk);
    }
  }

  isDeleteActiveAccident(indk: number) {
    this.openDropDeleteDialogAccident[indk].value = true;
    for (let i = 0; i < this.openDropDeleteDialogAccident.length; i++) {
      if (i != indk) {
        this.openDropDeleteDialogAccident[i].value = false;
      }
    }
  }

  deleteAccident(index: number) {
    this.listOfAccident.splice(index, 1);
    this.modeAccident.splice(index, 1);
    this.openDropDeleteDialogAccident.splice(index, 1);
    this.countAccident--;
    this.listOfAccident.forEach((el, i) => (el.id = i));
    this.storeApplicant.saveForm(2, this.listOfAccident, 'accident');
    this.accident.reset();
    this.accidents = {
      fatalityCount: 0,
      injuriesCount: 0,
    };
  }

  editAccident(index: number) {
    if (this.modeAccident[index].value === 'normal') {
      this.displayForm4 = true;
      this.accident.patchValue({
        location: this.listOfAccident[index].location,
        dateAccident: this.listOfAccident[index].date,
        fatalitiesAccident: this.listOfAccident[index].fatalities,
        injuriesAccident: this.listOfAccident[index].injuries,
        descriptionAccident: this.listOfAccident[index].description,
        hazmatSpill: this.listOfAccident[index].hazmatSpill,
      });
      this.accidents = {
        fatalityCount: this.listOfAccident[index].injuries,
        injuriesCount: this.listOfAccident[index].fatalities,
      };
      if (!this.shared.markInvalid(this.accident)) {
        return false;
      }
    } else if (this.modeAccident[index].value === 'edit') {
      if (!this.shared.markInvalid(this.accident)) {
        return false;
      }
      this.listOfAccident[index] = {
        id: index,
        location: this.accident.get('location').value,
        date: this.accident.get('dateAccident').value,
        modifiedDate: this.storeApplicant.convertKendoDate(
          new Date(this.accident.get('dateAccident').value)
        ),
        fatalities: this.accident.get('fatalitiesAccident').value,
        injuries: this.accident.get('injuriesAccident').value,
        description: this.accident.get('descriptionAccident').value,
        hazmatSpill: this.accident.get('hazmatSpill').value,
      };
      this.storeApplicant.saveForm(2, this.listOfAccident, 'accident');
      this.accident.reset();
      this.accidents = {
        fatalityCount: 0,
        injuriesCount: 0,
      };
    }
    this.modeAccident[index].value === 'normal'
      ? (this.modeAccident[index].value = 'edit')
      : (this.modeAccident[index].value = 'normal');
    for (let i = 0; i < this.modeAccident.length; i++) {
      if (i != index) {
        this.modeAccident[i].value = 'normal';
      }
    }
  }

  // Feedback review
  feedbackReview(data) {
    const index = this.isSomeFalseReview.findIndex((item) => item.id === data.id);
    if (data.isTrue) {
      this.reviewApplicant.reviewStepFour.next(data);
    } else {
      this.isSomeFalseReview.push(data);
      this.reviewApplicant.reviewStepFour.next(data);
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
    this.reviewApplicant.reviewStepFour.next(true);
  }

  onCountFatality(isUp: boolean) {
    if (isUp) {
      this.accidents.fatalityCount++;
    } else {
      if (this.accidents.fatalityCount) {
        this.accidents.fatalityCount--;
      }
    }
  }

  onCountInjuries(isUp: boolean) {
    if (isUp) {
      this.accidents.injuriesCount++;
    } else {
      if (this.accidents.injuriesCount) {
        this.accidents.injuriesCount--;
      }
    }
  }

  private transformInputData() {
    const data = {
      descriptionAccident: 'capitalize',
    };
    this.shared.handleInputValues(this.accident, data);
  }
  public handleAddressChange(address: any) {
    this.isValidAddress = true;
    this.address = this.shared.selectAddress(this.accident, address);

    this.accident.get('location').patchValue(this.address.address);
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
    (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
      event.clipboardData.getData('Text'),
      this.formatType,
      false,
      false,
      false,
      limitedCuracters
    );

    (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
      event.clipboardData.getData('Text'),
      this.formatType,
      false
    );

    this.accident.controls[inputID].patchValue(
      (document.getElementById(inputID) as HTMLInputElement).value
    );
  }

  ngOnDestroy() {
    this.displayForm4 = false;
    this.destroy$.next();
    this.destroy$.complete();
  }
}
