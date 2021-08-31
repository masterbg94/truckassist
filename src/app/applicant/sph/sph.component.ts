import { takeUntil } from 'rxjs/operators';
import { ApplicantReviewService } from './../service/applicant-review.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SignaturePad } from 'angular2-signaturepad';
import { Subject } from 'rxjs';
import { SharedService } from 'src/app/core/services/shared.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { ApplicantStore } from '../service/applicant.service';

@Component({
  selector: 'app-sph',
  templateUrl: './sph.component.html',
  styleUrls: ['./sph.component.scss'],
})
export class SphComponent implements OnInit {

  sphForm: FormGroup;

  user: any = null;

  isReadAndUnderstood = false;
  isAuthPreviousEmployer = false;

  showSignature = false;

  modalActive = false;

  // Company review
  companyReview?: any = [];
  isCompanyReview?: any;

  private destroy$: Subject<void> = new Subject<void>();

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
    private shared: SharedService,
    private storeApplicant: ApplicantStore,
    private reviewApplicant: ApplicantReviewService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.storeApplicant.reviewCompany
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      this.isCompanyReview = data;
    });

    this.InitForm();
    this.reloadData(JSON.parse(sessionStorage.getItem('SPH')));
    this.user = this.storeApplicant.getForm('personalInfo');
    if (this.user !== null) {
      this.user.birthday = this.storeApplicant.convertKendoDate(new Date(this.user.birthday));
    }
    this.photoUrl();

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
    } else {
      this.companyReview = this.reviewApplicant.companyReviewStepSPH;
    }
  }

  private InitForm() {
    this.sphForm = new FormGroup({
      isReadAndUnderstood: new FormControl(false, Validators.requiredTrue),
      isAuthPreviousEmployer: new FormControl(false, Validators.requiredTrue),
      signature: new FormControl(null),
    });
  }

  // Load User's signature
  photoUrl() {
    if (JSON.parse(sessionStorage.getItem('authorization')).signature !== null) {
      this.showSignature = true;
      this.sphForm
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
    this.sphForm.get('signature').patchValue(null);
    this.isSignature = true;
    this.isCorrectSignature();
  }


  openModal() {
    this.modalActive = true;
    document.body.style.overflow = 'hidden';
  }

  onModalDeactivate($event) {
    this.modalActive = false;
  }

  onSubmit() {
    if (!this.isCompanyReview) {
      if (!this.shared.markInvalid(this.sphForm)) {
        return false;
      }
      if (this.isCorrectSignature()) {
        this.notification.warning('Please add your signature ', 'Warning');
        return false;
      }
      // If user change signature
      if (this.requiredSignature !== null) {
        const auth = JSON.parse(sessionStorage.getItem('authorization'));
        auth.signature = this.requiredSignature;
        this.storeApplicant.saveForm(10, auth, 'authorization');
      }

      this.storeApplicant.saveForm(14, this.sphForm.value, 'SPH');
    } else {
      this.isAllCorrectly(true);
    }
    this.router.navigate(['applicant/hos-rules']);
    this.storeApplicant.isDoneSPH.emit('yes');
  }

  reloadData(data: any) {
    if (data != null) {
      this.sphForm.patchValue({
        isReadAndUnderstood: data.isReadAndUnderstood,
        isAuthPreviousEmployer: data.isAuthPreviousEmployer,
        signature: data.signature,
      });
      this.isReadAndUnderstood = true;
      this.isAuthPreviousEmployer = true;
    }
  }

  drawComplete() {
    this.requiredSignature = this.signaturePad.toDataURL('image/png', 0.5);
    if (this.requiredSignature == '') {
      this.clear();
      this.sphForm.get('signature').patchValue('');
    } else {
      if (this.requiredSignature.length > 7000) {
        setTimeout(() => {
          this.isSignature = false;
          this.isCorrectSignature();
          this.sphForm.get('signature').patchValue(this.requiredSignature);
        }, 900);
      } else {
        setTimeout(() => {
          this.isSignature = true;
          this.isCorrectSignature();
          this.sphForm.get('signature').patchValue(this.requiredSignature);
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
    this.sphForm.get('signature').patchValue(null);
    this.isSignature = true;
    this.isCorrectSignature();
  }

  undo() {
    const data = this.signaturePad.toData();
    const data2 = this.signaturePad.toDataURL('image/png', 0.5);

    if (data2.length < 10000 || data.length <= 1) {
      this.isSignature = true;
      this.isCorrectSignature();
      this.sphForm.get('signature').patchValue(null);
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
    this.reviewApplicant.reviewStepSPH.next(true);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
