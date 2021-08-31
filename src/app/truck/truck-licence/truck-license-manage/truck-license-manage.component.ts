import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subject } from 'rxjs';
import { DateFormatter } from 'src/app/core/helpers/dateFormatter';
import { TruckData, TruckLicense } from 'src/app/core/model/truck';
import { AppTruckService } from 'src/app/core/services/app-truck.service';
import { ClonerService } from 'src/app/core/services/cloner-service';
import { SharedService } from 'src/app/core/services/shared.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { checkSelectedText, pasteCheck } from 'src/assets/utils/methods-global';
import { StorageService } from 'src/app/core/services/storage.service';
import { FILE_TABLES } from 'src/app/const';
import { v4 as uuidv4 } from 'uuid';

import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-truck-license-manage',
  templateUrl: './truck-license-manage.component.html',
  styleUrls: ['./truck-license-manage.component.scss'],
})
export class TruckLicenseManageComponent implements OnInit, OnDestroy {

  constructor(
    private formBuilder: FormBuilder,
    private truckService: AppTruckService,
    private spinner: SpinnerService,
    private activeModal: NgbActiveModal,
    private shared: SharedService,
    private notification: NotificationService,
    private storageService: StorageService,
    private clonerService: ClonerService
  ) {
    this.createForm();
  }
  @Output() event = new EventEmitter<any>();
  @Input() inputData: any;
  private destroy$: Subject<void> = new Subject<void>();
  licenseForm: FormGroup;
  truck: TruckData = null;
  licenseData: TruckLicense[] = [];
  license: TruckLicense = null;
  formData = new FormData();
  modalTitle: string;
  loaded = false;
  format: FormatSettings = environment.dateFormat;
  public numOfSpaces = 0;
  files = [];
  attachments: any = [];

  public fomratType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;

  ngOnInit() {
    this.modalTitle = this.inputData.data.truck && this.inputData.data.prefix
      ? 'Unit # ' + this.inputData.data.truck.truckNumber + ' - '
      : '';
    this.modalTitle +=
      this.inputData.data.type === 'edit' ? 'Edit registration' : 'New registration';
    this.loadLicenseData();

    this.shared.emitDeleteFiles
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (files: any) => {
        if (files.success) {
          const removedFile = files.success[0];
          this.license.attachments = this.license.attachments.filter((file: any) => file.fileItemGuid !== removedFile.guid);
          this.saveLicense(true);
        }
      }
    );
  }

  createForm() {
    this.licenseForm = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      licensePlate: ['', Validators.required],
    });
    setTimeout(() => {
      this.transformInputData();
    });
  }

  private transformInputData() {
    const data = {
      licensePlate: 'upper',
    };
    this.shared.handleInputValues(this.licenseForm, data);
  }

  public loadLicenseData(): void {
    this.truck = this.inputData.data.truck ? this.inputData.data.truck : null;
    if (this.inputData.data.truck && this.inputData.data.truck.doc.licenseData) {
      this.licenseData = this.inputData.data.truck.doc.licenseData;
      if (this.inputData.data.type === 'edit') {
        const license = this.shared.getItemById(this.licenseData, this.inputData.data.id);
        this.license = license;
        this.attachments = license.attachments;
        this.setLicenceData(license);
      } else {
        this.setLicenceData(null);
      }
    } else {
      this.setLicenceData(null);
    }
  }

  public setLicenceData(license: TruckLicense) {
    this.loaded = true;
    this.license = license;
    if (this.inputData.data.type === 'edit') {
      this.licenseForm.setValue({
        startDate: new Date(license.startDate),
        endDate: new Date(license.endDate),
        licensePlate: license.licensePlate,
      });
      this.shared.touchFormFields(this.licenseForm);
    }
  }

  closeModal() {
    this.activeModal.close();
  }

  saveLicense(keepModal: boolean) {
    if (!this.shared.markInvalid(this.licenseForm)) {
      return false;
    }

    const license: TruckLicense = {
      id: this.license ? this.license.id : uuidv4(),
      startDate: this.licenseForm.controls.startDate.value,
      endDate: this.licenseForm.controls.endDate.value,
      licensePlate: this.licenseForm.controls.licensePlate.value,
      attachments: (this.license && this.license.attachments) ? this.license.attachments : []
    };
    const saveData: TruckData = this.clonerService.deepClone<TruckData>(this.truck);
    saveData.status = this.truck.status ? 1 : 0;
    license.startDate = DateFormatter.formatDate(license.startDate.toString());
    license.endDate = DateFormatter.formatDate(license.endDate.toString());

    const index = this.licenseData.findIndex((l) => l.id === license.id);

    const tempData = this.licenseData;

    if (index !== -1) {
      tempData[index] = license;
    } else {
      tempData.push(license);
    }

    saveData.doc.licenseData = tempData;
    this.spinner.show(true);
    const newFiles = this.shared.getNewFiles(this.files);
    if (newFiles.length > 0) {
      this.storageService.uploadFiles(
        this.truck.guid,
        FILE_TABLES.TRUCK,
        this.truck.id,
        newFiles,
        'license',
        license.id
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp: any) => {
          resp.success.forEach(element => {
            license.attachments.push(element);
          });

          this.notification.success(`Attachments successfully uploaded.`, ' ');
          this.truckService.updateTruckData(saveData, this.truck.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            () => {
              if (this.inputData.data.type === 'new') {
                this.notification.success('License has been added.', 'Success:');
              } else {
                this.notification.success('License has been updated.', 'Success:');
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
      this.truckService.updateTruckData(saveData, this.truck.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          if (this.inputData.data.type === 'new') {
            this.notification.success('License has been added.', 'Success:');
          } else {
            this.notification.success('License has been updated.', 'Success:');
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
      this.saveLicense(false);
    }
  }
  onPaste(event: any, inputID: string, limitOfCuructers?: number, index?: number) {
    event.preventDefault();

    if (index !== undefined) {
      (document.getElementById(inputID + index) as HTMLInputElement).value  = checkSelectedText(inputID, index);
    } else {
       (document.getElementById(inputID) as HTMLInputElement).value = checkSelectedText(inputID, index);
    }

    this.numOfSpaces = 0;

    (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
      event.clipboardData.getData('Text'),
      this.fomratType,
      true,
      false,
      false,
      limitOfCuructers
    );
    this.licenseForm.controls[inputID].patchValue((document.getElementById(inputID) as HTMLInputElement).value);
  }

  onAccountLicensePlateTyping(event) {
    let k;
    k = event.charCode;
    if (k == 32) {
      this.numOfSpaces++;
    } else {
      this.numOfSpaces = 0;
    }
    if (this.numOfSpaces < 2) {
      return (k > 64 && k < 91) || (k > 96 && k < 121) || (k >= 48 && k <= 57) || k == 8 || k == 32;
    } else {
      event.preventDefault();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
