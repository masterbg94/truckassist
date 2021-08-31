import { takeUntil } from 'rxjs/operators';
import { ApplicantReviewService } from './../service/applicant-review.service';
import { SharedService } from './../../core/services/shared.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { SignaturePad } from 'angular2-signaturepad';
import { ApplicantStore } from './../service/applicant.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationService } from 'src/app/services/notification-service.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-psp-auth',
  templateUrl: './psp-auth.component.html',
  styleUrls: ['./psp-auth.component.scss'],
})
export class PspAuthComponent implements OnInit {
  pspAuth: FormGroup;

  confirmRead = false;
  authJD = false;
  fmcsaConstractor = false;
  pspReport = false;
  disclosureBackground = false;

  showSignature = false;

  user: any = null;

  // Company review
  companyReview?: any = [];
  isCompanyReview?: any;

  private destroy$: Subject<void> = new Subject<void>();

  // Digital Signature
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
    private shared: SharedService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private notification: NotificationService
  ) {}

  // Load User's signature
  photoUrl() {
    if (JSON.parse(sessionStorage.getItem('authorization')).signature !== null) {
      this.showSignature = true;
      this.pspAuth
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
    this.pspAuth.get('signature').patchValue(null);
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
    this.reloadData(JSON.parse(sessionStorage.getItem('pspAuth')));

    this.user = this.storeApplicant.getForm('personalInfo');
    if (this.user !== null) {
      this.user.birthday = this.storeApplicant.convertKendoDate(new Date(this.user.birthday));
    }
    this.photoUrl();

    if (this.isCompanyReview) {
      this.companyReview = this.reviewApplicant.companyReviewStepPSP;
    }

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
    this.pspAuth = new FormGroup({
      confirmationRead: new FormControl(false, Validators.requiredTrue),
      authorizeJDFREIGHT: new FormControl(false, Validators.requiredTrue),
      prospectiveEmployerFMCSA: new FormControl(false, Validators.requiredTrue),
      myPSPreport: new FormControl(false, Validators.requiredTrue),
      disclosureRBR: new FormControl(false, Validators.requiredTrue),
      signature: new FormControl(null),
    });
  }

  reloadData(data: any) {
    if (data != null) {
      this.pspAuth.patchValue({
        confirmationRead: data.confirmationRead,
        authorizeJDFREIGHT: data.authorizeJDFREIGHT,
        prospectiveEmployerFMCSA: data.prospectiveEmployerFMCSA,
        myPSPreport: data.myPSPreport,
        disclosureRBR: data.disclosureRBR,
        signature: data.signature,
      });
    }
  }

  onSubmit() {
    if (!this.isCompanyReview) {
      if (!this.shared.markInvalid(this.pspAuth)) {
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
      this.storeApplicant.saveForm(13, this.pspAuth.value, 'pspAuth');
    } else {
      this.isAllCorrectly(true);
    }

    this.router.navigate(['applicant/sph']);
    this.storeApplicant.isDonePSP.emit('yes');
  }

  drawComplete() {
    this.requiredSignature = this.signaturePad.toDataURL('image/svg+xml', 0.5);
    if (this.requiredSignature == '') {
      this.clear();
      this.pspAuth.get('signature').patchValue('');
    } else {
      if (this.requiredSignature.length > 7000) {
        setTimeout(() => {
          this.isSignature = false;
          this.isCorrectSignature();
          this.pspAuth.get('signature').patchValue(this.requiredSignature);
        }, 900);
      } else {
        setTimeout(() => {
          this.isSignature = true;
          this.isCorrectSignature();
          this.pspAuth.get('signature').patchValue(this.requiredSignature);
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
    this.pspAuth.get('signature').patchValue(null);
    this.isSignature = true;
    this.isCorrectSignature();
  }

  undo() {
    const data = this.signaturePad.toData();
    const data2 = this.signaturePad.toDataURL('image/svg+xml', 0.5);

    if (data2.length < 10000 || data.length <= 1) {
      this.isSignature = true;
      this.isCorrectSignature();
      this.pspAuth.get('signature').patchValue(null);
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

  // Company feeedback
  isAllCorrectly($event) {
    this.reviewApplicant.reviewStepPSP.next(true);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
