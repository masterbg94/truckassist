import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApplicantReviewService } from './../../service/applicant-review.service';
import { ApplicantStore } from './../../service/applicant.service';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-step-nine',
  templateUrl: './step-nine.component.html',
  styleUrls: ['./step-nine.component.scss'],
})
export class StepNineComponent implements OnInit, OnDestroy {
  driverRight: FormGroup;

  isCheckdriverRight: any;

  // Company review
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
    .subscribe((data) => (this.isCompanyReview = data));

    this.InitForm();
    this.reloadData(JSON.parse(sessionStorage.getItem('driverRight')));
  }

  private InitForm() {
    this.driverRight = new FormGroup({
      isCheckdriverRights: new FormControl(false, Validators.requiredTrue),
    });
  }

  reloadData(data: any) {
    if (data != null) {
      this.driverRight.get('isCheckdriverRights').patchValue(true);
      this.isCheckdriverRight = true;
      if (!this.shared.markInvalid(this.driverRight)) {
        return false;
      }
    }
  }

  onSubmit() {
    if (!this.isCompanyReview) {
      if (!this.shared.markInvalid(this.driverRight)) {
        return false;
      }
      this.storeApplicant.saveForm(8, this.driverRight.value, 'driverRight');
    } else {
      this.isAllCorrectly(true);
    }

    this.storeApplicant.stepForward.emit(10);
  }

  stepBack() {
    this.storeApplicant.stepBackward.emit(8);
  }

  isAllCorrectly(event) {
    this.reviewApplicant.reviewStepNine.next(true);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
