import { takeUntil } from 'rxjs/operators';
import { ApplicantReviewService } from './../service/applicant-review.service';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ApplicantStore } from '../service/applicant.service';
import { routerAnimation } from '../animation/applicants.animation';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss'],
  animations: [routerAnimation('routeAnimation')],
})
export class ApplicationComponent implements OnInit {
  step = 1;
  isAgreement = false;

  reviewCompanyInvalid: any[] = [];
  isReviewStepOne: boolean = null;
  isReviewStepTwo: boolean = null;
  isReviewStepThree: boolean = null;
  isReviewStepFour: boolean = null;
  isReviewStepFive: boolean = null;
  isReviewStepSix: boolean = null;
  isReviewStepSeven: boolean = null;
  isReviewStepEight: boolean = null;
  isReviewStepNine: boolean = null;
  isReviewStepTen: boolean = null;
  isReviewStepEleven: boolean = null;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private storeApplicant: ApplicantStore,
    private reviewApplicant: ApplicantReviewService,
    private actRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.storeApplicant.stepForward
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      this.step = data ? data : 1;
      this.storeApplicant.saveStepCounter(data);
      this.router.navigate([`${data}`], { relativeTo: this.actRoute });
    });

    this.storeApplicant.stepBackward
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      this.step = data ? data : 1;
      this.storeApplicant.saveStepCounter(data);
      this.router.navigate([`${data}`], { relativeTo: this.actRoute });
    });

    // Get saved step
    if (this.storeApplicant.getStepCounter() != 1) {
      this.step = this.storeApplicant.getStepCounter();
      this.router.navigate([`${this.step}`], { relativeTo: this.actRoute });
    }

    // Is review
    this.reviewApplicant.reviewStepOne
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      if (Object.keys(data).length !== 0) {

        if (!data.isTrue) {
          const id = this.reviewCompanyInvalid.findIndex((review) => review.id === data.id);
          if (id === -1) {
            this.reviewCompanyInvalid.push(data);
            this.isReviewStepOne = data.isTrue;
          }
        }

        if (this.reviewCompanyInvalid.length !== 0) {
          const id = this.reviewCompanyInvalid.findIndex((review) => review.id === data.id);

          if (id !== -1 && data.isTrue) {
            this.reviewCompanyInvalid.splice(id, 1);
          }
        }

        if (this.reviewCompanyInvalid.length === 0) {
          this.isReviewStepOne = true;
        }
      }

      if (data === true) {
        this.isReviewStepOne = true;
      } else if ((data = false)) {
        this.isReviewStepOne = false;
      }
    });

    this.reviewApplicant.reviewStepTwo
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      if (Object.keys(data).length !== 0) {
        if (!data.isTrue) {
          const id = this.reviewCompanyInvalid.findIndex((review) => review.id === data.id);
          if (id === -1) {
            this.reviewCompanyInvalid.push(data);
            this.isReviewStepTwo = data.isTrue;
          }
        }
        if (this.reviewCompanyInvalid.length !== 0) {
          const id = this.reviewCompanyInvalid.findIndex((review) => review.id === data.id);

          if (id !== -1 && data.isTrue) {
            this.reviewCompanyInvalid.splice(id, 1);
          }
        }
        if (this.reviewCompanyInvalid.length === 0) {
          this.isReviewStepTwo = true;
        }
      }

      if (data === true) {
        this.isReviewStepTwo = true;
      } else if ((data = false)) {
        this.isReviewStepTwo = false;
      }
    });

    this.reviewApplicant.reviewStepThree
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      if (Object.keys(data).length !== 0) {
        if (!data.isTrue) {
          const id = this.reviewCompanyInvalid.findIndex((review) => review.id === data.id);
          if (id === -1) {
            this.reviewCompanyInvalid.push(data);
            this.isReviewStepThree = data.isTrue;
          }
        }
        if (this.reviewCompanyInvalid.length !== 0) {
          const id = this.reviewCompanyInvalid.findIndex((review) => review.id === data.id);

          if (id !== -1 && data.isTrue) {
            this.reviewCompanyInvalid.splice(id, 1);
          }
        }
        if (this.reviewCompanyInvalid.length === 0) {
          this.isReviewStepThree = true;
        }
      }

      if (data === true) {
        this.isReviewStepThree = true;
      } else if ((data = false)) {
        this.isReviewStepThree = false;
      }
    });

    this.reviewApplicant.reviewStepFour
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      if (Object.keys(data).length !== 0) {
        if (!data.isTrue) {
          const id = this.reviewCompanyInvalid.findIndex((review) => review.id === data.id);
          if (id === -1) {
            this.reviewCompanyInvalid.push(data);
            this.isReviewStepFour = data.isTrue;
          }
        }
        if (this.reviewCompanyInvalid.length !== 0) {
          const id = this.reviewCompanyInvalid.findIndex((review) => review.id === data.id);

          if (id !== -1 && data.isTrue) {
            this.reviewCompanyInvalid.splice(id, 1);
          }
        }
        if (this.reviewCompanyInvalid.length === 0) {
          this.isReviewStepFour = true;
        }
      }

      if (data === true) {
        this.isReviewStepFour = true;
      } else if ((data = false)) {
        this.isReviewStepFour = false;
      }
    });

    this.reviewApplicant.reviewStepFive
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      if (Object.keys(data).length !== 0) {
        if (!data.isTrue) {
          const id = this.reviewCompanyInvalid.findIndex((review) => review.id === data.id);
          if (id === -1) {
            this.reviewCompanyInvalid.push(data);
            this.isReviewStepFive = data.isTrue;
          }
        }
        if (this.reviewCompanyInvalid.length !== 0) {
          const id = this.reviewCompanyInvalid.findIndex((review) => review.id === data.id);

          if (id !== -1 && data.isTrue) {
            this.reviewCompanyInvalid.splice(id, 1);
          }
        }
        if (this.reviewCompanyInvalid.length === 0) {
          this.isReviewStepFive = true;
        }
      }

      if (data === true) {
        this.isReviewStepFive = true;
      } else if ((data = false)) {
        this.isReviewStepFive = false;
      }
    });

    this.reviewApplicant.reviewStepSix
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      if (Object.keys(data).length !== 0) {
        if (!data.isTrue) {
          const id = this.reviewCompanyInvalid.findIndex((review) => review.id === data.id);
          if (id === -1) {
            this.reviewCompanyInvalid.push(data);
            this.isReviewStepSix = data.isTrue;
          }
        }
        if (this.reviewCompanyInvalid.length !== 0) {
          const id = this.reviewCompanyInvalid.findIndex((review) => review.id === data.id);

          if (id !== -1 && data.isTrue) {
            this.reviewCompanyInvalid.splice(id, 1);
          }
        }
        if (this.reviewCompanyInvalid.length === 0) {
          this.isReviewStepSix = true;
        }
      }

      if (data === true) {
        this.isReviewStepSix = true;
      } else if ((data = false)) {
        this.isReviewStepSix = false;
      }
    });

    this.reviewApplicant.reviewStepSeven
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      if (Object.keys(data).length !== 0) {
        if (!data.isTrue) {
          const id = this.reviewCompanyInvalid.findIndex((review) => review.id === data.id);
          if (id === -1) {
            this.reviewCompanyInvalid.push(data);
            this.isReviewStepSeven = data.isTrue;
          }
        }
        if (this.reviewCompanyInvalid.length !== 0) {
          const id = this.reviewCompanyInvalid.findIndex((review) => review.id === data.id);

          if (id !== -1 && data.isTrue) {
            this.reviewCompanyInvalid.splice(id, 1);
          }
        }
        if (this.reviewCompanyInvalid.length === 0) {
          this.isReviewStepSeven = true;
        }
      }

      if (data === true) {
        this.isReviewStepSeven = true;
      } else if ((data = false)) {
        this.isReviewStepSeven = false;
      }
    });

    this.reviewApplicant.reviewStepEight
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      if (Object.keys(data).length !== 0) {
        if (!data.isTrue) {
          const id = this.reviewCompanyInvalid.findIndex((review) => review.id === data.id);
          if (id === -1) {
            this.reviewCompanyInvalid.push(data);
            this.isReviewStepEight = data.isTrue;
          }
        }
        if (this.reviewCompanyInvalid.length !== 0) {
          const id = this.reviewCompanyInvalid.findIndex((review) => review.id === data.id);

          if (id !== -1 && data.isTrue) {
            this.reviewCompanyInvalid.splice(id, 1);
          }
        }
        if (this.reviewCompanyInvalid.length === 0) {
          this.isReviewStepEight = true;
        }
      }

      if (data === true) {
        this.isReviewStepEight = true;
      } else if ((data = false)) {
        this.isReviewStepEight = false;
      }
    });

    this.reviewApplicant.reviewStepNine
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      if (Object.keys(data).length !== 0) {
        if (!data.isTrue) {
          const id = this.reviewCompanyInvalid.findIndex((review) => review.id === data.id);
          if (id === -1) {
            this.reviewCompanyInvalid.push(data);
            this.isReviewStepNine = data.isTrue;
          }
        }
        if (this.reviewCompanyInvalid.length !== 0) {
          const id = this.reviewCompanyInvalid.findIndex((review) => review.id === data.id);

          if (id !== -1 && data.isTrue) {
            this.reviewCompanyInvalid.splice(id, 1);
          }
        }
        if (this.reviewCompanyInvalid.length === 0) {
          this.isReviewStepNine = true;
        }
      }

      if (data === true) {
        this.isReviewStepNine = true;
      } else if ((data = false)) {
        this.isReviewStepNine = false;
      }
    });

    this.reviewApplicant.reviewStepTen
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      if (Object.keys(data).length !== 0) {
        if (!data.isTrue) {
          const id = this.reviewCompanyInvalid.findIndex((review) => review.id === data.id);
          if (id === -1) {
            this.reviewCompanyInvalid.push(data);
            this.isReviewStepTen = data.isTrue;
          }
        }
        if (this.reviewCompanyInvalid.length !== 0) {
          const id = this.reviewCompanyInvalid.findIndex((review) => review.id === data.id);

          if (id !== -1 && data.isTrue) {
            this.reviewCompanyInvalid.splice(id, 1);
          }
        }
        if (this.reviewCompanyInvalid.length === 0) {
          this.isReviewStepTen = true;
        }
      }

      if (data === true) {
        this.isReviewStepTen = true;
      } else if ((data = false)) {
        this.isReviewStepTen = false;
      }
    });

    this.reviewApplicant.reviewStepEleven
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      if (Object.keys(data).length !== 0) {
        if (!data.isTrue) {
          const id = this.reviewCompanyInvalid.findIndex((review) => review.id === data.id);
          if (id === -1) {
            this.reviewCompanyInvalid.push(data);
            this.isReviewStepEleven = data.isTrue;
          }
        }
        if (this.reviewCompanyInvalid.length !== 0) {
          const id = this.reviewCompanyInvalid.findIndex((review) => review.id === data.id);

          if (id !== -1 && data.isTrue) {
            this.reviewCompanyInvalid.splice(id, 1);
          }
        }
        if (this.reviewCompanyInvalid.length === 0) {
          this.isReviewStepEleven = true;
        }
      }

      if (data === true) {
        this.isReviewStepEleven = true;
      } else if ((data = false)) {
        this.isReviewStepEleven = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getDepth(outlet) {
    return outlet.activatedRouteData.depth;
  }
}
