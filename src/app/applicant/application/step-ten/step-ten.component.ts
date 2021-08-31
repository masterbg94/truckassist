import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApplicantReviewService } from './../../service/applicant-review.service';
import { ApplicantStore } from './../../service/applicant.service';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-step-ten',
  templateUrl: './step-ten.component.html',
  styleUrls: ['./step-ten.component.scss'],
})
export class StepTenComponent implements OnInit, OnDestroy {
  disclosureRelease: FormGroup;

  fairCreditReporting: any;
  drivingRecord: any;
  reservationParty: any;
  copyDrivingRecord: any;
  authorisedShell: any;
  adverseAction: any;
  cerifyUnderstand: any;

  // Company Review
  isCompanyReview?: any;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private storeApplicant: ApplicantStore,
    private shared: SharedService,
    private reviewApplicant: ApplicantReviewService
  ) {}

  ngOnInit(): void {
    this.storeApplicant.reviewCompany
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      this.isCompanyReview = data;
    });
    this.InitForm();
    this.reloadData(JSON.parse(sessionStorage.getItem('disclosureRelease')));
  }

  private InitForm() {
    this.disclosureRelease = new FormGroup({
      fairCreditReporting: new FormControl(null, Validators.required),
      drivingRecord: new FormControl(null, Validators.required),
      reservationParty: new FormControl(null, Validators.required),
      copyDrivingRecord: new FormControl(null, Validators.required),
      authorisedShell: new FormControl(null, Validators.required),
      adverseAction: new FormControl(null, Validators.required),
    });
  }

  reloadData(data: any) {
    if (data != null) {
      this.disclosureRelease.patchValue({
        fairCreditReporting: data.fairCreditReporting,
        drivingRecord: data.drivingRecord,
        reservationParty: data.reservationParty,
        copyDrivingRecord: data.copyDrivingRecord,
        authorisedShell: data.authorisedShell,
        adverseAction: data.adverseAction,
      });
      if (!this.shared.markInvalid(this.disclosureRelease)) {
        return false;
      }
    }
  }

  onSubmit() {
    if (!this.isCompanyReview) {
      if (!this.shared.markInvalid(this.disclosureRelease)) {
        return false;
      }
      this.storeApplicant.saveForm(9, this.disclosureRelease.value, 'disclosureRelease');
    } else {
      this.isAllCorrectly(true);
    }

    this.storeApplicant.stepForward.emit(11);
  }

  stepBack() {
    this.storeApplicant.stepBackward.emit(9);
  }

  isAllCorrectly($event) {
    this.reviewApplicant.reviewStepTen.next(true);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
