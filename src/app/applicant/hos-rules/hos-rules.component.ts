import { takeUntil } from 'rxjs/operators';
import { ApplicantReviewService } from './../service/applicant-review.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ApplicantStore } from './../service/applicant.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-hos-rules',
  templateUrl: './hos-rules.component.html',
  styleUrls: ['./hos-rules.component.scss'],
})
export class HosRulesComponent implements OnInit {
  hosRules: FormGroup;

  confrimHOSRules = false;

  // Company review
  companyReview?: any = [];
  isCompanyReview?: any;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private storeApplicant: ApplicantStore,
    private reviewApplicant: ApplicantReviewService,
    private shared: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.storeApplicant.reviewCompany
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      this.isCompanyReview = data;
    });

    if (this.isCompanyReview) {
      this.companyReview = this.reviewApplicant.companyReviewStepHOS;
    }

    this.InitForm();
    this.reloadData(JSON.parse(sessionStorage.getItem('hos-rules')));
  }

  private InitForm() {
    this.hosRules = new FormGroup({
      confrimHOSRules: new FormControl(false, Validators.requiredTrue),
    });
  }

  reloadData(data: any) {
    if (data != null) {
      this.hosRules.patchValue({
        confrimHOSRules: data.confrimHOSRules,
      });
    }
  }

  onSubmit() {
    if (!this.isCompanyReview) {
      if (!this.shared.markInvalid(this.hosRules)) {
        return false;
      }
      this.storeApplicant.saveForm(15, this.hosRules.value, 'hos-rules');
    } else {
      this.isAllCorrectly(true);
    }

    this.router.navigate(['applicant/ssn-card']);
    this.storeApplicant.isDoneHOS.emit('yes');
  }

  // Company feeedback
  isAllCorrectly($event) {
    this.reviewApplicant.reviewStepHOS.next(true);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
