import { takeUntil } from 'rxjs/operators';
import { ApplicantReviewService } from './../service/applicant-review.service';
import { SharedService } from './../../core/services/shared.service';
import { Router } from '@angular/router';
import { ApplicantStore } from './../service/applicant.service';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ILicence } from '../model/licence.mode';
import { SignaturePad } from 'angular2-signaturepad';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationService } from 'src/app/services/notification-service.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-mvr-auth',
  templateUrl: './mvr-auth.component.html',
  styleUrls: ['./mvr-auth.component.scss'],
})
export class MvrAuthComponent implements OnInit {
  mvrAuth: FormGroup;

  showSignature = false;

  isReview = false;
  isDrivingRecord = false;
  isInfoTrue = false;
  isLicence = false;

  licences: ILicence[] = [];
  licenceDate: any;

  user: any = null;

  // Company review
  companyReview?: any = [];
  isCompanyReview?: any;

  private destroy$: Subject<void> = new Subject<void>();

  // Digital signature
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  public options: Object = {};
  private requiredSignature = null;
  isSignature = true;
  public signaturePadOptions: Object = {
    minWidth: 0.6,
    canvasWidth: 660,
    canvasHeight: 200,
    backgroundColor: '#6C6C6C',
    penColor: 'white',
  };

  constructor(
    private storeApplicant: ApplicantStore,
    private reviewApplicant: ApplicantReviewService,
    private router: Router,
    private shared: SharedService,
    private sanitizer: DomSanitizer,
    private notification: NotificationService
  ) {}

  // Load User's signature
  photoUrl() {
    if (JSON.parse(sessionStorage.getItem('authorization')).signature !== null) {
      this.showSignature = true;
      this.mvrAuth
        .get('signature')
        .patchValue(JSON.parse(sessionStorage.getItem('authorization')).signature);
      this.isSignature = false;
      this.isCorrectSignature();
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        JSON.parse(sessionStorage.getItem('authorization')).signature
      );
    }
  }

  editSignature() {
    this.showSignature = false;
    this.mvrAuth.get('signature').patchValue(null);
    this.isSignature = true;
    this.isCorrectSignature();
  }

  ngOnInit(): void {
    this.storeApplicant.reviewCompany
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      this.isCompanyReview = data;
    });

    this.InitForm();

    this.licences = this.storeApplicant.getForm('cdlInformation');
    this.user = this.storeApplicant.getForm('personalInfo');
    if (this.licences.length > 0) {
      if (this.licences.length > 1) {
        for (let i = 0; i < this.licences.length; i++) {
          this.licences[i].birthday = new Date(this.user.birthday);
        }
      }
    }

    if (this.isCompanyReview) {
      this.companyReview = this.reviewApplicant.companyReviewStepMVR;
    }

    this.photoUrl();
    this.reloadData(JSON.parse(sessionStorage.getItem('mvrAuth')));

    if (!this.isCompanyReview) {
      if (window.screen.width <= 376) {
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
  }

  private InitForm() {
    this.mvrAuth = new FormGroup({
      isMvrReview: new FormControl(false, Validators.requiredTrue),
      isAuthDrivingRecord: new FormControl(false, Validators.requiredTrue),
      isAllInfoTrue: new FormControl(false, Validators.requiredTrue),
      certifyLicence: new FormControl(false, Validators.requiredTrue),
      signature: new FormControl(null),
    });
  }

  reloadData(data: any) {
    if (data != null) {
      this.mvrAuth.patchValue({
        isMvrReview: data.isMvrReview,
        isAuthDrivingRecord: data.isAuthDrivingRecord,
        isAllInfoTrue: data.isAllInfoTrue,
        certifyLicence: data.certifyLicence,
        signature: data.signature,
      });
    }
  }

  onSubmit() {
    if (!this.isCompanyReview) {
      if (!this.shared.markInvalid(this.mvrAuth)) {
        return false;
      }

      if (this.isCorrectSignature()) {
        this.notification.warning('Please add your  signature ', 'Warning');
        return false;
      }

      // If user change signature
      if (this.requiredSignature !== null) {
        const auth = JSON.parse(sessionStorage.getItem('authorization'));
        auth.signature = this.requiredSignature;
        this.storeApplicant.saveForm(10, auth, 'authorization');
      }

      this.storeApplicant.saveForm(12, this.mvrAuth.value, 'mvrAuth');
    } else {
      this.isAllCorrectly(true);
    }
    this.router.navigate(['applicant/psp-authorization']);

    this.storeApplicant.isDoneMVR.emit('yes');
  }

  modificatedData(date: any) {
    return this.storeApplicant.convertKendoDate(new Date(date));
  }

  drawComplete() {
    this.requiredSignature = this.signaturePad.toDataURL('image/svg+xml', 0.5);
    if (this.requiredSignature == '') {
      this.clear();
      this.mvrAuth.get('signature').patchValue('');
    } else {
      if (this.requiredSignature.length > 7000) {
        setTimeout(() => {
          this.isSignature = false;
          this.isCorrectSignature();
          this.mvrAuth.get('signature').patchValue(this.requiredSignature);
        }, 900);
      } else {
        setTimeout(() => {
          this.isSignature = true;
          this.isCorrectSignature();
          this.mvrAuth.get('signature').patchValue(this.requiredSignature);
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
    this.mvrAuth.get('signature').patchValue(null);
    this.isSignature = true;
    this.isCorrectSignature();
  }

  undo() {
    const data = this.signaturePad.toData();
    const data2 = this.signaturePad.toDataURL('image/svg+xml', 0.5);

    if (data2.length < 10000 || data.length <= 1) {
      this.isSignature = true;
      this.isCorrectSignature();
      this.mvrAuth.get('signature').patchValue(null);
    } else {
      this.isSignature = false;
      this.isCorrectSignature();
    }
    if (data) {
      data.pop();
      this.signaturePad.fromData(data);
    }
  }

  // Company feeedback
  isAllCorrectly($event) {
    this.reviewApplicant.reviewStepMVR.next(true);
  }

  clearValidate(form: AbstractControl) {
    form.clearValidators();
    form.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
