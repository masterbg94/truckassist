import { takeUntil } from 'rxjs/operators';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IReason } from '../../model/reason.model';
import { ApplicantStore } from '../../service/applicant.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import { environment } from 'src/environments/environment';
import { checkSelectedText, emailChack, pasteCheck } from 'src/assets/utils/methods-global';
import { Subject } from 'rxjs';
import * as AppConst from 'src/app/const';

@Component({
  selector: 'app-sph-reviewer',
  templateUrl: './sph-reviewer.component.html',
  styleUrls: ['./sph-reviewer.component.scss'],
})
export class SphReviewerComponent implements OnInit {

  constructor(
    private shared: SharedService,
    private storeApplicant: ApplicantStore
  ) {}

  sphReviewForm: FormGroup;

  // Modal
  @Input() modalActive = false;
  @Output() modalDeactivate = new EventEmitter<any>();

  disableAddNextAccident = false;
  workForYourCompany = false;
  driveForYourCompany = false;
  noSafetyPerformance = false;
  isDOTtesting = false;

  stateReason: IReason[] = this.storeApplicant.stateReason;
  selectReason = {
    id: 0,
    name: '',
  };

  accidents = {
    fatalityCount: 0,
    injuriesCount: 0,
  };

  public optionsAddress = {
    componentRestrictions: { country: ['US', 'CA'] },
  };

  format: FormatSettings = environment.dateFormat;

  user: any = null;

  truckList = AppConst.TRUCK_LIST_APPLICANTS;
  trailerList = AppConst.TRAILER_LIST;

  // companyReview
  isCompanyReview = false;

  private destroy$: Subject<void> = new Subject<void>();

  address: any;
  isValidAddress = false;

  public numOfSpaces = 0;
  public isEmployer = true;
  public firstWords: boolean;
  isBusiness = true;
  formatType = /^[!^()_\\[\]{};':"\\|<>\/?]*$/;

  public numOfSpaces2 = 0;

  ngOnInit() {
    this.initForm();
    this.user = this.storeApplicant.getForm('personalInfo');
    if (this.user !== null) {
      this.user.birthday = this.storeApplicant.convertKendoDate(new Date(this.user.birthday));
    }

    this.storeApplicant.reviewCompany
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => (this.isCompanyReview = data));


    if (!this.isCompanyReview) {
      this.sphReviewForm.disable();
    }
  }

  private initForm() {
    this.sphReviewForm = new FormGroup({
      // SPH
      previousEmployer: new FormControl(null),
      previousEmpPhone: new FormControl(null),
      previousEmpEmail: new FormControl(null),
      previousEmpAddress: new FormControl(null),
      previousEmpUnit: new FormControl(null),

      // Accident
      workForYourCompany: new FormControl(null),
      workFromDate: new FormControl(null),
      workToDate: new FormControl(null),
      driveForYourCompany: new FormControl(null),
      vehicleType: new FormControl(null),
      trailerType: new FormControl(null),

      reason: new FormControl(null),
      consideredForEmployment: new FormControl(null),
      noSafetyPerformance: new FormControl(false),
      date: new FormControl(null),
      location: new FormControl(null),
      description: new FormControl(null),
      fatalitiesAccident: new FormControl(null),
      injuriesAccident: new FormControl(null),
      hazmatSpill: new FormControl(null),
      isDOTtesting: new FormControl(false),

      // Drug & Alcohol testing history
      fromDateEmployment: new FormControl(null),
      toDateEmployment: new FormControl(null),
      hasAlchocolTest: new FormControl(null),
      testedForSubstances: new FormControl(null),
      isRefusedToTesting: new FormControl(null),
      isCommittedOtherViolations: new FormControl(null),
      hasViolatedDOTdrugAlchocol: new FormControl(null),
      drugFromDate: new FormControl(null),
      drugToDate: new FormControl(null),
      nameOfSAP: new FormControl(null),
      phoneOfSAP: new FormControl(null),
      addressOfSAP: new FormControl(null),
      addressUnitOfSAP: new FormControl(null),
      completedASPRehabilitation: new FormControl(null),
    });
  }

  onSubmit() {
    console.log(this.sphReviewForm);
  }

  questionsWithExplanation(value: any) {
    if (value === 'yes') {
      this.workForYourCompany = true;
    } else {
      this.workForYourCompany = false;
    }
  }
  questionsWithExplanation2(value: any) {
    if (value === 'yes') {
      this.driveForYourCompany = true;
    } else {
      this.driveForYourCompany = false;
    }
  }

  reasonSelect(value) {
    this.selectReason.id = value.id;
    this.selectReason.name = value.name;
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

  addAccident() {}


  closeModal() {
    this.modalDeactivate.emit(false);
    document.body.style.overflow = 'auto';
    this.onSubmit();
  }

  clearValidate(form: AbstractControl) {
    form.clearValidators();
    form.updateValueAndValidity();
  }
  public handleAddressChange(address: any) {
    this.isValidAddress = true;
    this.address = this.shared.selectAddress(this.sphReviewForm, address);

    this.sphReviewForm.get('previousEmpAddress').patchValue(this.address.address);
  }

  onEmailTyping(event) {
    return emailChack(event);
  }

  manageInputValidation(formElement: any) {
    return this.shared.manageInputValidation(formElement);
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

    if (inputID === 'previousEmpEmail') {
      this.formatType = /^[!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        false
      );
    } else if (inputID === 'explainWorkForCompany' || inputID === 'explainDrivenForCompany') {
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
    this.sphReviewForm.controls[inputID].patchValue(
      (document.getElementById(inputID) as HTMLInputElement).value
    );
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

  onNameTyping(event) {
    let k;
    k = event.charCode;
    if (k == 32) {
      this.numOfSpaces++;
    } else {
      this.numOfSpaces = 0;
    }
    if ((document.getElementById('previousEmployer') as HTMLInputElement).value === '') {
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
    if ((document.getElementById('nameOfSAP') as HTMLInputElement).value === '') {
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
