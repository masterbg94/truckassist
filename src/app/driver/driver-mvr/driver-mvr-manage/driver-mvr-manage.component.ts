import { takeUntil } from 'rxjs/operators';
import { Component, Input, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppDriverService } from 'src/app/core/services/app-driver.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { SharedService } from 'src/app/core/services/shared.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DateFormatter } from '../../../core/helpers/dateFormatter';
import { DriverData, MvrData } from 'src/app/core/model/driver';
import { HttpErrorResponse } from '@angular/common/http';
import { ClonerService } from 'src/app/core/services/cloner-service';

import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import { environment } from 'src/environments/environment';

import { StorageService } from 'src/app/core/services/storage.service';
import { FILE_TABLES } from 'src/app/const';

const moment = require('moment/moment');

@Component({
  selector: 'app-driver-mvr-manage',
  templateUrl: './driver-mvr-manage.component.html',
  styleUrls: ['./driver-mvr-manage.component.scss']
})
export class DriverMvrManageComponent implements OnInit, OnDestroy {
  @Input() inputData: any;
  mvrForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  mvr: MvrData = null;
  mvrData: MvrData[] = [];
  modalTitle: string;
  driver: DriverData = null;

  format: FormatSettings = environment.dateFormat;
  files = [];
  attachments: any = [];
  loaded = false;

  constructor(
    private formBuilder: FormBuilder,
    private driverService: AppDriverService,
    private notification: NotificationService,
    private activeModal: NgbActiveModal,
    private shared: SharedService,
    private spinner: SpinnerService,
    private storageService: StorageService,
    private clonerService: ClonerService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.modalTitle = this.inputData.data.driver && this.inputData.data.prefix ? this.inputData.data.driver.fullName + ' - ' : '';
    this.modalTitle += this.inputData.data.type === 'edit' ? 'Edit MVR' : 'New MVR';
    this.loadMvrData();

    this.shared.emitDeleteFiles
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (files: any) => {
        if (files.success) {
          const removedFile = files.success[0];
          this.mvr.attachments = this.mvr.attachments.filter((file: any) => file.fileItemGuid !== removedFile.guid);
          this.saveMedical(true);
        }
      }
    );
  }

  createForm() {
    this.mvrForm = this.formBuilder.group({
      startDate: [null, Validators.required]
    });
  }

  closeModal() {
    this.activeModal.close();
  }

  loadMvrData() {
    this.driver = this.inputData.data.driver ? this.inputData.data.driver : null;
    if (this.inputData.data.driver && this.inputData.data.driver.doc.mvrData) {
      this.mvrData = this.inputData.data.driver.doc.mvrData;

      if (this.inputData.data.type === 'edit') {
        const mvr = this.mvrData
          ? this.mvrData.find((l) => l.id === this.inputData.data.id)
          : null;
        this.attachments = mvr.attachments;

        this.setMvrData(mvr);
      } else {
        this.setMvrData(null);
      }
    } else {
      this.setMvrData(null);
    }
  }

  setMvrData(mvr: MvrData) {
    this.loaded = true;
    this.mvr = mvr;
    if (mvr) {
      this.mvrForm.controls.startDate.setValue(new Date(mvr.startDate));
      this.shared.touchFormFields(this.mvrForm);
    } else {
      this.mvrForm.controls.startDate.setValue('');
    }
  }

  setFiles(files: any) {
    this.files = files;
  }

  saveMedical(keepModal: boolean) {
    if (!this.shared.markInvalid(this.mvrForm)) { return false; }

    const mvr: MvrData = {
      id: this.mvr ? this.mvr.id : uuidv4(),
      startDate: this.mvrForm.controls.startDate.value,
      attachments: (this.mvr && this.mvr.attachments) ? this.mvr.attachments : []
    };

    mvr.startDate = DateFormatter.formatDate(mvr.startDate.toString());

    const saveData: DriverData = this.clonerService.deepClone<DriverData>(this.driver);
    const index = this.mvrData.findIndex((l) => l.id === mvr.id);

    const tempData = this.mvrData;

    if (index !== -1) {
      tempData[index] = mvr;
    } else {
      tempData.push(mvr);
    }

    saveData.doc.mvrData = tempData;

    this.spinner.show(true);

    const newFiles = this.shared.getNewFiles(this.files);
    if (newFiles.length > 0) {
      this.storageService.uploadFiles(
        this.driver.guid,
        FILE_TABLES.DRIVER,
        this.driver.id,
        this.files,
        'mvr',
        mvr.id
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp: any) => {
          resp.success.forEach(element => {
            mvr.attachments.push(element);
          });
          this.notification.success(`Attachments successfully uploaded.`, ' ');
          this.driverService.updateDriverData(saveData, this.inputData.data.driver.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            () => {
              if (this.inputData.data.type === 'edit') {
                this.notification.success(`Mvr has been updated.`, 'Success:');
              } else {
                this.notification.success(`Mvr has been added.`, 'Success:');
                this.mvrForm.reset();
                this.mvrForm.controls.startDate.setValue('');
              }
              if (!keepModal) {
                this.closeModal();
              }
              this.spinner.show(false);
            },
            (error: HttpErrorResponse) => {
              this.shared.handleError(error);
            }
          );
        },
        (error: HttpErrorResponse) => {
          this.shared.handleError(error);
        }
      );
    } else {
      this.driverService.updateDriverData(saveData, this.inputData.data.driver.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          if (this.inputData.data.type === 'edit') {
            this.notification.success(`Mvr has been updated.`, 'Success:');
          } else {
            this.notification.success(`Mvr has been added.`, 'Success:');
            this.mvrForm.reset();
            this.mvrForm.controls.startDate.setValue('');
          }
          if (!keepModal) {
            this.closeModal();
          }
          this.spinner.show(false);
        },
        (error: HttpErrorResponse) => {
          this.shared.handleError(error);
        }
      );
    }

  }

  keyDownFunction(event: any) {
    if (
      event.keyCode === 13 &&
      event.target.localName !== 'textarea' &&
      event.path !== undefined &&
      event.path !== null &&
      event.path[3].className !== 'ng-select-container ng-has-value'
    ) {
      this.saveMedical(false);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
