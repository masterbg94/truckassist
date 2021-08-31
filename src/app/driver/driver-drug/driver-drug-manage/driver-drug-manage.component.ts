import { takeUntil } from 'rxjs/operators';
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { NotificationService } from 'src/app/services/notification-service.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppDriverService } from 'src/app/core/services/app-driver.service';
import { TestData, DriverData } from 'src/app/core/model/driver';
import { MetaDataService } from 'src/app/core/services/metadata.service';
import { MetaData } from 'src/app/core/model/shared/enums';
import { HttpErrorResponse } from '@angular/common/http';
import { ClonerService } from 'src/app/core/services/cloner-service';
import { StorageService } from 'src/app/core/services/storage.service';
import { FILE_TABLES } from 'src/app/const';

@Component({
  selector: 'app-driver-drug-manage',
  templateUrl: './driver-drug-manage.component.html',
  styleUrls: ['./driver-drug-manage.component.scss'],
})
export class DriverDrugManageComponent implements OnInit, OnDestroy {
  @Input() inputData: any;
  @ViewChild('note') note: ElementRef;
  private destroy$: Subject<void> = new Subject<void>();
  modalTitle: string;
  attachments: any = [];

  test: TestData = null;
  testData: TestData[] = [];

  types: MetaData[] = [
    {
      domain: 'driver',
      value: 'Drug',
      key: 'drugReason',
    },
    {
      domain: 'driver',
      value: 'Alcohol',
      key: 'alcoholReason',
    },
  ];

  reasons: MetaData[] = [];

  loading = true;
  driver: DriverData = null;

  testForm: FormGroup;
  showNote = false;
  textRows = 1;
  loaded = false;

  files = [];

  constructor(
    private formBuilder: FormBuilder,
    private driverService: AppDriverService,
    private activeModal: NgbActiveModal,
    private notification: NotificationService,
    private shared: SharedService,
    private spinner: SpinnerService,
    private metadataService: MetaDataService,
    private storageService: StorageService,
    private clonerService: ClonerService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.modalTitle =
      this.inputData.data.driver && this.inputData.data.prefix
        ? this.inputData.data.driver.fullName + ' - '
        : '';
    this.modalTitle += this.inputData.data.type === 'edit' ? 'Edit Test' : 'New Test';
    if (this.inputData.data.type == 'new') { this.loaded = true; }
    this.loadTestData();

    this.shared.emitDeleteFiles
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (files: any) => {
        if (files.success) {
          const removedFile = files.success[0];
          this.test.attachments = this.test.attachments.filter((file: any) => file.fileItemGuid !== removedFile.guid);
          this.manageTest(true);
        }
      }
    );
  }

  loadTestData() {
    this.driver = this.inputData.data.driver ? this.inputData.data.driver : null;
    if (this.inputData.data.driver && this.inputData.data.driver.doc.testData) {
      this.testData = this.inputData.data.driver.doc.testData;
      if (this.inputData.data.type === 'edit') {
        const test = this.testData
          ? this.testData.find((l) => l.id === this.inputData.data.testId)
          : null;
        this.attachments = test.attachments;
        this.setTestData(test);
      } else {
        this.setTestData(null);
      }
    } else {
      this.setTestData(null);
    }
  }

  createForm() {
    this.testForm = this.formBuilder.group({
      testingDate: [null, Validators.required],
      reason: [null, Validators.required],
      testType: [null, Validators.required],
      note: [''],
    });
  }

  closeModal() {
    this.activeModal.close();
  }

  setTestData(test: TestData) {
    this.test = test;
    if (this.test) {
      this.testForm.controls.testingDate.setValue(new Date(test.testingDate));
      this.testForm.controls.reason.setValue(test.reason);
      this.testForm.controls.testType.setValue(test.type);
      this.getReasons(test.type);
      this.testForm.controls.note.setValue((test.note !== null) ? (test.note.replace(/<\/?[^>]+(>|$)/g, ''))  : '');
      if (test.note.length > 0) {
        this.handleHeight((test.note !== null) ? (test.note.replace(/<\/?[^>]+(>|$)/g, ''))  : '');
        this.showNote = true;
      }
      this.shared.touchFormFields(this.testForm);
    } else {
      this.testForm.controls.testingDate.setValue(null);
      this.testForm.controls.testType.setValue(null);
      this.testForm.controls.reason.setValue(null);
      this.testForm.controls.note.setValue('');
    }

    if (!this.testForm.controls.testType.value) {
      this.testForm.controls.reason.disable();
    }

    this.loading = false;
  }

  manageTest(keepModal: boolean) {
    if (!this.shared.markInvalid(this.testForm)) {
      return false;
    }

    const test: TestData = {
      id: this.test ? this.test.id : uuidv4(),
      reason: this.testForm.controls.reason.value,
      type: this.testForm.controls.testType.value,
      testingDate: this.testForm.controls.testingDate.value,
      note: this.testForm.controls.note.value,
      attachments: (this.test && this.test.attachments) ? this.test.attachments : []
    };

    const saveData: DriverData = this.clonerService.deepClone<DriverData>(this.driver);
    const index = this.testData.findIndex((l) => l.id === test.id);
    const tempData = this.testData;

    if (index !== -1) {
      tempData[index] = test;
    } else {
      tempData.push(test);
    }

    saveData.doc.testData = tempData;
    saveData.owner = undefined;
    saveData.driverUser = undefined;
    saveData.driverUserId = undefined;
    this.spinner.show(true);

    const newFiles = this.shared.getNewFiles(this.files);
    if (newFiles.length > 0) {
      this.storageService.uploadFiles(
        this.driver.guid,
        FILE_TABLES.DRIVER,
        this.driver.id,
        this.files,
        'drug-alcohol',
        test.id
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp: any) => {
          resp.success.forEach(element => {
            test.attachments.push(element);
          });
          this.notification.success(`Attachments successfully uploaded.`, ' ');
          this.driverService.updateDriverData(saveData, this.driver.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (result: any) => {
              if (this.inputData.data.type === 'edit') {
                this.notification.success('Test has been updated.', 'Success:');
              } else {
                this.notification.success('Test has been added.', 'Success:');
              }
              if (!keepModal) {
                this.resetModalData();
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
      this.driverService.updateDriverData(saveData, this.driver.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result: any) => {
          if (this.inputData.data.type === 'edit') {
            this.notification.success('Test has been updated.', 'Success:');
          } else {
            this.notification.success('Test has been added.', 'Success:');
          }
          if (!keepModal) {
            this.resetModalData();
          }
          this.spinner.show(false);
        },
        (error: HttpErrorResponse) => {
          this.shared.handleError(error);
        }
      );
    }
  }

  resetModalData() {
    this.testForm.reset();
    this.testForm.controls.reason.setValue(null);
    this.testForm.controls.testType.setValue(null);
    this.testForm.controls.testingDate.setValue('');
    this.closeModal();
  }

  setFiles(files: any) {
    this.files = files;
  }

  keyDownFunction(event: any) {
    if (
      event.keyCode === 13 &&
      event.target.localName !== 'textarea' &&
      event.path !== undefined &&
      event.path !== null &&
      event.path[3].className !== 'ng-select-container ng-has-value'
    ) {
      this.manageTest(false);
    }
  }

  getReasons(selectedType: MetaData, reset?: boolean) {
    this.reasons = [];
    if (selectedType) {
      this.spinner.show(true);
      this.metadataService.getMetaDataByDomainKey(selectedType.domain, selectedType.key)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (metadata: MetaData[]) => {
          this.reasons = metadata;
          this.loaded = true;
          if (reset) {
            this.testForm.controls.reason.reset();
            this.testForm.controls.reason.enable();
          }
          this.spinner.show(false);
        },
        (error: HttpErrorResponse) => {
          this.shared.handleError(error);
        }
      );
    } else {
      this.testForm.controls.reason.reset();
      this.testForm.controls.reason.disable();
    }
  }

  openNote() {
    if (this.showNote === true) {
      this.showNote = false;
      this.testForm.get('note').setValue('');
    } else {
      this.showNote = true;
      setTimeout(() => {
        this.note.nativeElement.focus();
      }, 250);
    }
  }

  handleHeight(val: string) {
    const lines = val.split(/\r|\r\n|\n/);
    const count = lines.length;
    this.textRows = count >= 4 ? 4 : count;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
