import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApplicantReviewService } from './../../service/applicant-review.service';
import { SharedService } from './../../../core/services/shared.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { SignaturePad } from 'angular2-signaturepad';
import { ApplicantStore } from '../../service/applicant.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationService } from 'src/app/services/notification-service.service';

@Component({
  selector: 'app-step-eleven',
  templateUrl: './step-eleven.component.html',
  styleUrls: ['./step-eleven.component.scss'],
})
export class StepElevenComponent implements OnInit {

  constructor(
    private storeApplicant: ApplicantStore,
    private shared: SharedService,
    private sanitizer: DomSanitizer,
    private notification: NotificationService,
    private reviewApplicant: ApplicantReviewService
  ) {}
  authorization: FormGroup;

  authorizeComp: any;
  authorizeCarr: any;
  eventEmploy: any;
  certif: any;

  // Company review
  companyReview?: any = [];
  isCompanyReview?: any;
  isSomeFalseReview?: any[] = []; // treba da se sacuva na back-u

  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  public options: Object = {};
  private requiredSignature = '';
  isSignature = true;
  public signaturePadOptions = {
    minWidth: 0.6,
    canvasWidth: 660,
    canvasHeight: 200,
    backgroundColor: '#6C6C6C',
    penColor: 'white',
  };

  private destroy$: Subject<void> = new Subject<void>();

  showSignature = false;

  req: any;

  // Load User's signature
  photoUrl() {
    if (JSON.parse(sessionStorage.getItem('authorization')).signature !== null) {
      this.showSignature = true;
      this.authorization
        .get('signature')
        .patchValue(JSON.parse(sessionStorage.getItem('authorization')).signature);
      this.isSignature = false;
      this.isCorrectSignature();
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        JSON.parse(sessionStorage.getItem('authorization')).signature
      );
    }
  }
  editSinature() {
    this.showSignature = false;
  }

  ngOnInit(): void {
    this.storeApplicant.reviewCompany
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      this.isCompanyReview = data;
    });

    if (this.isCompanyReview) {
      this.companyReview = this.reviewApplicant.companyReviewStepEleven;
    }

    this.InitForm();
    this.reloadData(JSON.parse(sessionStorage.getItem('authorization')));
    if (window.screen.width <= 414) {
      // 768px portrait
      this.signaturePadOptions = {
        minWidth: 0.6,
        canvasWidth: 350,
        canvasHeight: 200,
        backgroundColor: '#6C6C6C',
        penColor: 'white',
      };
    }
  }

  private InitForm() {
    this.authorization = new FormGroup({
      authorizeCompany: new FormControl(false, Validators.requiredTrue),
      authorizeCarrier: new FormControl(false, Validators.requiredTrue),
      eventEmployment: new FormControl(false, Validators.requiredTrue),
      certificies: new FormControl(false, Validators.requiredTrue),
      signature: new FormControl(null),
    });
  }

  reloadData(data: any) {
    if (data != null) {
      this.authorization.patchValue({
        authorizeCompany: data.authorizeCompany,
        authorizeCarrier: data.authorizeCarrier,
        eventEmployment: data.eventEmployment,
        certificies: data.certificies,
        signature: data.signature,
      });
      this.photoUrl();
    }
  }

  onSubmit() {
    if (!this.isCompanyReview) {
      if (!this.shared.markInvalid(this.authorization)) {
        return false;
      }
      if (this.isCorrectSignature()) {
        this.notification.warning('Please add your  signature ', 'Warning');
        return false;
      }
      this.storeApplicant.saveForm(10, this.authorization.value, 'authorization');
    } else {
      if (this.isSomeFalseReview.length === 0) {
        this.reviewApplicant.reviewStepEleven.next(true);
        this.isAllCorrectly(true);
      } else {
        this.reviewApplicant.reviewStepEleven.next(false);
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

    this.storeApplicant.stepForward.emit(12);
  }

  stepBack() {
    this.storeApplicant.stepBackward.emit(10);
  }
  drawComplete() {
    this.requiredSignature = this.signaturePad.toDataURL('image/svg+xml', 0.5);
    this.req = this.signaturePad.toDataURL('image/png', 0.5);

    if (this.requiredSignature == '') {
      this.clear();
      this.authorization.get('signature').patchValue('');
    } else {
      if (this.requiredSignature.length > 7000) {
        setTimeout(() => {
          this.isSignature = false;
          this.isCorrectSignature();
          this.authorization.get('signature').patchValue(this.requiredSignature);
        }, 900);
      } else {
        setTimeout(() => {
          this.isSignature = true;
          this.isCorrectSignature();
          this.authorization.get('signature').patchValue(this.requiredSignature);
        }, 900);
      }
    }
  }

  drawStart() {}

  isCorrectSignature() {
    return this.isSignature == true;
  }

  clear() {
    this.signaturePad.clear();
    this.authorization.get('signature').patchValue(null);
    this.isSignature = true;
    this.isCorrectSignature();
  }

  undo() {
    const data = this.signaturePad.toData();
    const data2 = this.signaturePad.toDataURL('image/svg+xml', 0.5);

    if (data2.length < 10000 || data.length <= 1) {
      this.isSignature = true;
      this.isCorrectSignature();
      this.authorization.get('signature').patchValue(null);
    } else {
      this.isSignature = false;
      this.isCorrectSignature();
    }
    if (data) {
      data.pop();
      this.signaturePad.fromData(data);
    }
  }

  clearValidate(form: AbstractControl) {
    form.clearValidators();
    form.updateValueAndValidity();
  }

   // Feedback review
   feedbackReview(data) {
    const index = this.isSomeFalseReview.findIndex((item) => item.id === data.id);
    if (data.isTrue) {
      this.reviewApplicant.reviewStepEleven.next(data);
    } else {
      this.isSomeFalseReview.push(data);
      this.reviewApplicant.reviewStepEleven.next(data);
    }
    if (index !== -1 && data.isTrue) {
      this.isSomeFalseReview.splice(index, 1);
    }
  }

  isAllCorrectly($event) {
    this.reviewApplicant.reviewStepEleven.next(true);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
