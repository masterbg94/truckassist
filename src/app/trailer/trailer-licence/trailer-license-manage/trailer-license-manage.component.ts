import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subject } from 'rxjs';
import { DateFormatter } from 'src/app/core/helpers/dateFormatter';
import { TrailerData, TrailerLicense } from 'src/app/core/model/trailer';
import { AppTrailerService } from 'src/app/core/services/app-trailer.service';
import { ClonerService } from 'src/app/core/services/cloner-service';
import { SharedService } from 'src/app/core/services/shared.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { checkSelectedText, pasteCheck } from 'src/assets/utils/methods-global';
import { StorageService } from 'src/app/core/services/storage.service';
import { v4 as uuidv4 } from 'uuid';
import { FILE_TABLES } from 'src/app/const';

import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-trailer-license-manage',
  templateUrl: './trailer-license-manage.component.html',
  styleUrls: ['./trailer-license-manage.component.scss'],
})
export class TrailerLicenseManageComponent implements OnInit, OnDestroy {

  constructor(
    private formBuilder: FormBuilder,
    private trailerService: AppTrailerService,
    private spinner: SpinnerService,
    private activeModal: NgbActiveModal,
    private shared: SharedService,
    private storageService: StorageService,
    private notification: NotificationService,
    private clonerService: ClonerService
  ) {
    this.createForm();
  }
  @Output() event = new EventEmitter<any>();
  @Input() inputData: any;
  private destroy$: Subject<void> = new Subject<void>();
  licenseForm: FormGroup;
  trailer: TrailerData = null;
  licenseData: TrailerLicense[] = [];
  license: TrailerLicense = null;
  formData = new FormData();
  modalTitle: string;
  loaded = false;
  format: FormatSettings = environment.dateFormat;
  files = [];
  attachments: any = [];
  public fomratType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;

  ngOnInit() {
    this.modalTitle = this.inputData.data.trailer && this.inputData.data.prefix
      ? 'Unit # ' + this.inputData.data.trailer.trailerNumber + ' - '
      : '';
    this.modalTitle +=
      this.inputData.data.type === 'edit' ? 'Edit Registration' : 'New Registration';
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
      startDate: [null, Validators.required],
      licensePlate: [null, Validators.required],
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
    this.trailer = this.inputData.data.trailer ? this.inputData.data.trailer : null;
    if (this.inputData.data.trailer && this.inputData.data.trailer.doc.licenseData) {
      this.licenseData = this.inputData.data.trailer.doc.licenseData;
      if (this.inputData.data.type === 'edit') {
        const license = this.shared.getItemById(this.licenseData, this.inputData.data.id);
        this.license = license;
        this.attachments = license.attachments;
        this.setLicenceData(license);
        this.shared.touchFormFields(this.licenseForm);
      } else {
        this.setLicenceData(null);
      }
    } else {
      this.setLicenceData(null);
    }
  }

  public setLicenceData(license: TrailerLicense) {
    this.loaded = true;
    this.license = license;
    if (this.inputData.data.type === 'edit') {
      this.licenseForm.setValue({
        startDate: new Date(license.startDate),
        licensePlate: license.licensePlate,
      });
    }
  }

  closeModal() {
    this.activeModal.close();
  }

  saveLicense(keepModal: boolean) {
    if (!this.shared.markInvalid(this.licenseForm)) {
      return false;
    }

    const license: TrailerLicense = {
      id: this.license ? this.license.id : uuidv4(),
      startDate: this.licenseForm.controls.startDate.value,
      licensePlate: this.licenseForm.controls.licensePlate.value,
      attachments:
        this.license && this.license.attachments ? this.license.attachments : [],
    };

    const saveData: TrailerData = this.clonerService.deepClone<TrailerData>(this.trailer);
    saveData.status = this.trailer.status ? 1 : 0;

    license.startDate = DateFormatter.formatDate(license.startDate.toString());

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
      this.storageService
        .uploadFiles(
          this.trailer.guid,
          FILE_TABLES.TRAILER,
          this.trailer.id,
          this.files,
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
            this.trailerService.updateTrailerData(saveData, this.trailer.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
              (resp1: any) => {
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
              (error1: HttpErrorResponse) => {
                this.shared.handleError(error1);
              }
            );
          },
          (error: HttpErrorResponse) => {
            this.shared.handleError(error);
          }
        );
    } else {
      this.trailerService.updateTrailerData(saveData, this.trailer.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp: any) => {
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
    return (k > 64 && k < 91) || (k > 96 && k < 121) || (k >= 48 && k <= 57) || k == 8 || k == 32;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
