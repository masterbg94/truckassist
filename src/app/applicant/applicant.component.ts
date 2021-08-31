import { takeUntil } from 'rxjs/operators';
import { ApplicantReviewService } from './service/applicant-review.service';
import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import moment from 'moment';
import { ICompany } from './model/company.model';
import { ApplicantStore } from './service/applicant.service';
import { Subject } from 'rxjs';
import { navAnimation } from './animation/applicants.animation';

@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  styleUrls: ['./applicant.component.scss'],
  animations: [navAnimation('navAnimation')],
})
export class ApplicantComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private storeApplicant: ApplicantStore,
    private reviewApplicant: ApplicantReviewService
  ) {}
  appDate = moment().format('MM/DD/YY');

  // Applicant
  applicantDone: string = null;
  medicalDone: string = null;
  mvrDone: string = null;
  pspDone: string = null;
  sphDone: string = null;
  hosDone: string = null;
  ssnDone: string = null;
  cdlDone: string = null;

  // Reviewer
  isMedicalReviewer: any = null;
  isMVRReviewer: any = null;
  isPSPReviewer: any = null;
  isSPHReviewer: any = null;
  isHOSReviewer: any = null;
  isSSNReviewer: any = null;
  isCDLReviewer: any = null;

  company: ICompany[] = [
    {
      name: 'JD FREIGHT INC',
      usdot: 245326,
      phoneContact: '(621) 321-2232',
      location: {
        street: '4747 Research Forest Dr # 185',
        city: 'The Woodlands',
        postalCode: 'TX 77381',
        country: 'USA 1',
      },
    },
  ];

  // Review
  isReviewer?: any;

  private destroy$: Subject<void> = new Subject<void>();

  // For mobile view
  openNavbar = false;

  ngOnInit(): void {
    this.storeApplicant.isDoneApplicant
    .pipe(takeUntil(this.destroy$))
    .subscribe((val: any) => {
      this.applicantDone = val;
      sessionStorage.setItem('applicantDone', this.applicantDone);
      sessionStorage.setItem('step', '11');
    });

    this.storeApplicant.isDoneMEdical
    .pipe(takeUntil(this.destroy$))
    .subscribe((val: any) => {
      this.medicalDone = val;
      sessionStorage.setItem('medicalDone', this.medicalDone);
    });

    this.storeApplicant.isDoneMVR
    .pipe(takeUntil(this.destroy$))
    .subscribe((val: any) => {
      this.mvrDone = val;
      sessionStorage.setItem('mvrDone', this.mvrDone);
    });

    this.storeApplicant.isDonePSP
    .pipe(takeUntil(this.destroy$))
    .subscribe((val: any) => {
      this.pspDone = val;
      sessionStorage.setItem('pspDone', this.pspDone);
    });

    this.storeApplicant.isDoneSPH
    .pipe(takeUntil(this.destroy$))
    .subscribe((val: any) => {
      this.sphDone = val;
      sessionStorage.setItem('sphDone', this.sphDone);
    });

    this.storeApplicant.isDoneHOS
    .pipe(takeUntil(this.destroy$))
    .subscribe((val: any) => {
      this.hosDone = val;
      sessionStorage.setItem('hosDone', this.hosDone);
    });

    this.storeApplicant.isDoneSSNcard
    .pipe(takeUntil(this.destroy$))
    .subscribe((val: any) => {
      this.ssnDone = val;
      sessionStorage.setItem('ssnDone', this.ssnDone);
    });

    this.storeApplicant.isDoneCDLcard
    .pipe(takeUntil(this.destroy$))
    .subscribe((val: any) => {
      this.ssnDone = val;
      sessionStorage.setItem('cdlDone', this.ssnDone);
    });

    sessionStorage.getItem('applicantDone') == 'yes'
      ? (this.applicantDone = 'yes')
      : (this.applicantDone = null);
    sessionStorage.getItem('medicalDone') == 'yes'
      ? (this.medicalDone = 'yes')
      : (this.medicalDone = null);

    sessionStorage.getItem('mvrDone') == 'yes' ? (this.mvrDone = 'yes') : (this.mvrDone = null);
    sessionStorage.getItem('pspDone') == 'yes' ? (this.pspDone = 'yes') : (this.pspDone = null);
    sessionStorage.getItem('sphDone') == 'yes' ? (this.sphDone = 'yes') : (this.sphDone = null);
    sessionStorage.getItem('hosDone') == 'yes' ? (this.hosDone = 'yes') : (this.hosDone = null);
    sessionStorage.getItem('ssnDone') == 'yes' ? (this.ssnDone = 'yes') : (this.ssnDone = null);
    sessionStorage.getItem('cdlDone') == 'yes' ? (this.cdlDone = 'yes') : (this.cdlDone = null);

    document.body.classList.add('applicant-page');

    if (localStorage.getItem('currentUser')) {
      this.storeApplicant.reviewCompany.next(true);
    } else {
      this.storeApplicant.reviewCompany.next(false);
    }

    // Reviewer code
    if (localStorage.getItem('currentUser') !== null) {
      this.reviewApplicant.reviewStepMedical
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.isMedicalReviewer = data;
      });

      this.reviewApplicant.reviewStepMVR
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.isMVRReviewer = data;
      });

      this.reviewApplicant.reviewStepPSP
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.isPSPReviewer = data;
      });


      this.reviewApplicant.reviewStepSPH
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.isSPHReviewer = data;
      });

      this.reviewApplicant.reviewStepHOS
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.isHOSReviewer = data;
      });

      this.reviewApplicant.reviewStepSSN
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.isSSNReviewer = data;
      });
      
      this.reviewApplicant.reviewStepCDL
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.isCDLReviewer = data;
      });
    }
  }

  // Because route stop being active, when switch on child route
  public isActive(url: string): boolean {
    return this.router.url.includes(`${url}`);
  }
  wrapNavbar() {
    this.openNavbar = !this.openNavbar;
  }

  // Outlet
  getDepth(outlet) {
    return outlet.activatedRouteData.depth;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    document.body.classList.remove('applicant-page');
  }
}
