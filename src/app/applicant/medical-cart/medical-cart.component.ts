import { takeUntil } from 'rxjs/operators';
import { ApplicantReviewService } from './../service/applicant-review.service';
import { Router } from '@angular/router';
import { SharedService } from './../../core/services/shared.service';
import { ApplicantStore } from './../service/applicant.service';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import { environment } from 'src/environments/environment';
import { MedicalData } from 'src/app/core/model/driver';
import { v4 as uuidv4 } from 'uuid';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-medical-cart',
  templateUrl: './medical-cart.component.html',
  styleUrls: ['./medical-cart.component.scss'],
})
export class MedicalCartComponent implements OnInit {
  medicalForm: FormGroup;

  medical: any[] = [];
  files: File[] = [];
  clearFiles = false;
  attachments: any[] = [];

  format: FormatSettings = environment.dateFormat;

  // Company review
  companyReview?: any[] = this.reviewApplicant.companyReviewStepMedical;
  isCompanyReview?: any;
  isSomeFalseReview?: any[] = []; // treba da se sacuva na back-u

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

    this.InitForm();
    // this.reloadData(JSON.parse(sessionStorage.getItem('medical-cert')));
  }

  private InitForm() {
    this.medicalForm = new FormGroup({
      issueDate: new FormControl(null, Validators.required),
      expDate: new FormControl(null, Validators.required),
      medicalFiles: new FormControl(null),
    });
  }

  addMedicalFiles(files: any) {
    this.medicalForm.get('medicalFiles').patchValue(files[files.length - 1]);
  }

  reloadData(data: any) {
    if (data != null) {
      this.medicalForm.patchValue({
        issueDate: new Date(data.issueDate),
        expDate: new Date(data.expDate),
        medicalFiles: data.medicalFiles,
      });
    }
  }

  onSubmit() {
    if (!this.isCompanyReview) {
      if (!this.shared.markInvalid(this.medicalForm)) {
        return false;
      }
      this.addMedicalFiles(this.medical);
      this.storeApplicant.saveForm(11, this.medicalForm.value, 'medical-cert');
    } else {
      if (this.isSomeFalseReview.length === 0) {
        this.reviewApplicant.reviewStepMedical.next(true);
        this.isAllCorrectly(true);
      } else {
        this.reviewApplicant.reviewStepMedical.next(false);
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

    this.router.navigate(['applicant/mvr-authorization']);
    this.storeApplicant.isDoneMEdical.emit('yes');
  }

  receiveMessage($event: any) {
    this.files = $event;
    this.tobase64Handler($event).then((files: any) => {
      this.setFiles(files);
    });
  }

  setFiles(files: any) {
    this.medical.push(files);
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
      this.reviewApplicant.reviewStepMedical.next(data);
    } else {
      this.isSomeFalseReview.push(data);
      this.reviewApplicant.reviewStepMedical.next(data);
    }
    if (index !== -1 && data.isTrue) {
      this.isSomeFalseReview.splice(index, 1);
    }
  }

  isAllCorrectly($event) {
    this.reviewApplicant.reviewStepMedical.next(true);
    this.router.navigate(['applicant/mvr-authorization']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
