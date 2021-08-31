import { takeUntil } from 'rxjs/operators';
import { ApplicantReviewService } from './../service/applicant-review.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicantStore } from '../service/applicant.service';
import { Subject } from 'rxjs';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-ssn-card',
  templateUrl: './ssn-card.component.html',
  styleUrls: ['./ssn-card.component.scss'],
})
export class SsnCardComponent implements OnInit {
  ssnCard: FormGroup;

  files: File[] = [];
  clearFiles = false;
  ssn: any[] = [];
  attachments: any[] = [];

  // Company review
  companyReview?: any[] = this.reviewApplicant.companyReviewStepSSN;
  isCompanyReview?: any;
  isSomeFalseReview?: any[] = []; // treba da se sacuva na back-u

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private storeApplicant: ApplicantStore,
    private router: Router,
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
    this.reloadData(JSON.parse(sessionStorage.getItem('ssnCard')));
  }

  private InitForm() {
    this.ssnCard = new FormGroup({
      ssn: new FormControl(null, Validators.required),
    });
  }

  addSSNFiles(files: any) {
    this.ssnCard.get('ssn').patchValue(files[files.length - 1]);
  }

  reloadData(data: any) {
    if (data != null) {
      this.ssnCard.patchValue({
        ssn: data.ssn,
      });
    }
  }

  onSubmit() {

    if (!this.isCompanyReview) {
      // storeApplicant.saveForm implement
    } else {
      if (this.isSomeFalseReview.length === 0) {
        this.reviewApplicant.reviewStepSSN.next(true);
        this.isAllCorrectly(true);
      } else {
        this.reviewApplicant.reviewStepSSN.next(false);
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
    this.storeApplicant.saveForm(16, this.ssnCard.value, 'ssnCard');

    this.storeApplicant.isDoneSSNcard.emit('yes');
    this.router.navigate(['applicant/cdl-card']);
  }

  receiveMessage($event: any) {
    this.files = $event;
    this.tobase64Handler($event).then((files: any) => {
      this.setFiles(files);
    });
  }

  setFiles(files: any) {
    this.ssn.push(files);
  }

  toBase64(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () =>
        resolve({
          fileName: file.name,
          base64Content: reader.result.toString().split(',')[1],
        });
      reader.onerror = (error) => reject(error);
    });
  }

  async tobase64Handler(files: any) {
    const filePromises = [];
    files.forEach((file: File) => {
      filePromises.push(this.toBase64(file));
    });
    const allFiles = await Promise.all(filePromises);
    return allFiles;
  }

  // Feedback review
  feedbackReview(data) {
    const index = this.isSomeFalseReview.findIndex((item) => item.id === data.id);
    if (data.isTrue) {
      this.reviewApplicant.reviewStepSSN.next(data);
    } else {
      this.isSomeFalseReview.push(data);
      this.reviewApplicant.reviewStepSSN.next(data);
    }
    if (index !== -1 && data.isTrue) {
      this.isSomeFalseReview.splice(index, 1);
    }
  }

  isAllCorrectly($event) {
    this.reviewApplicant.reviewStepSSN.next(true);
    this.router.navigate(['applicant/mvr-authorization']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
