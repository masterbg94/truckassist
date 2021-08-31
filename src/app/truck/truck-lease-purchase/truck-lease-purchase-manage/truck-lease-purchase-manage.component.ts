import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { DateFormatter } from 'src/app/core/helpers/dateFormatter';
import { TruckData, TruckLease } from 'src/app/core/model/truck';
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
  selector: 'app-truck-lease-purchase-manage',
  templateUrl: './truck-lease-purchase-manage.component.html',
  styleUrls: ['./truck-lease-purchase-manage.component.scss'],
})
export class TruckLeasePurchaseManageComponent implements OnInit, OnDestroy {

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
  truckLeaseForm: FormGroup;
  truck: TruckData = null;
  truckLeaseData: TruckLease[] = [];
  lease: TruckLease = null;
  formData = new FormData();
  modalTitle: string;
  loaded = false;
  files = [];
  attachments: any = [];

  leaseData = [
    { id: 1, name: 'Lessor' },
    { id: 2, name: 'Purchase' },
  ];

  sellerData = [
    { id: 1, name: 'Seller' },
    { id: 2, name: 'Buyer' },
  ];

  format: FormatSettings = environment.dateFormat;

  public fomratType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?A-Za-z]*$/;
  public numOfSpaces = 0;

  ngOnInit() {
    this.modalTitle = this.inputData.data.truck && this.inputData.data.prefix
      ? 'Unit # ' + this.inputData.data.truck.truckNumber + ' - '
      : '';
    this.modalTitle +=
      this.inputData.data.type === 'edit' ? 'Edit lease - purchase' : 'New lease - purchase';

    this.loadLeaseData();

    this.shared.emitDeleteFiles
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (files: any) => {
        if (files.success) {
          const removedFile = files.success[0];
          this.lease.attachments = this.lease.attachments.filter((file: any) => file.fileItemGuid !== removedFile.guid);
          this.saveLease(true);
        }
      }
    );
  }

  createForm() {
    this.truckLeaseForm = this.formBuilder.group({
      lessor: [null, Validators.required],
      seller: [null, Validators.required],
      date: ['', Validators.required],
      paymentAmount: ['', Validators.required],
      numberOfPayments: ['', Validators.required],
      downPayment: ['', Validators.required],
    });
  }

  public loadLeaseData(): void {
    this.truck = this.inputData.data.truck ? this.inputData.data.truck : null;
    if (this.inputData.data.truck && this.inputData.data.truck.doc.truckLeaseData) {
      this.truckLeaseData = this.inputData.data.truck.doc.truckLeaseData;
      if (this.inputData.data.type === 'edit') {
        const lease = this.shared.getItemById(this.truckLeaseData, this.inputData.data.id);
        this.lease = lease;
        this.attachments = lease.attachments;
        this.setLicenceData(lease);
      } else {
        this.setLicenceData(null);
      }
    } else {
      this.setLicenceData(null);
    }
  }

  public setLicenceData(lease: TruckLease) {
    this.loaded = true;
    this.lease = lease;
    if (this.inputData.data.type === 'edit') {
      this.truckLeaseForm.setValue({
        lessor: lease.lessor,
        seller: lease.seller,
        date: new Date(lease.date),
        paymentAmount: lease.paymentAmount,
        numberOfPayments: lease.numberOfPayments,
        downPayment: lease.downPayment,
      });
      this.shared.touchFormFields(this.truckLeaseForm);
    }
  }

  setFiles(files: any) {
    this.files = files;
  }

  closeModal() {
    this.activeModal.close();
  }

  saveLease(keepModal: boolean) {
    if (!this.shared.markInvalid(this.truckLeaseForm)) {
      return false;
    }

    const lease: TruckLease = {
      id: this.lease ? this.lease.id : uuidv4(),
      date: this.truckLeaseForm.controls.date.value,
      seller: this.truckLeaseForm.controls.seller.value,
      lessor: this.truckLeaseForm.controls.lessor.value,
      paymentAmount: this.truckLeaseForm.controls.paymentAmount.value,
      numberOfPayments: this.truckLeaseForm.controls.numberOfPayments.value,
      downPayment: this.truckLeaseForm.controls.downPayment.value,
      attachments: (this.lease && this.lease.attachments) ? this.lease.attachments : []
    };

    const saveData: TruckData = this.clonerService.deepClone<TruckData>(this.truck);
    saveData.status = this.truck.status ? 1 : 0;

    lease.date = DateFormatter.formatDate(lease.date.toString());

    const index = this.truckLeaseData.findIndex((l) => l.id === lease.id);

    const tempData = this.truckLeaseData;

    if (index !== -1) {
      tempData[index] = lease;
    } else {
      tempData.push(lease);
    }

    saveData.doc.truckLeaseData = tempData;

    this.spinner.show(true);

    const newFiles = this.shared.getNewFiles(this.files);
    if (newFiles.length > 0) {
      this.storageService.uploadFiles(
        this.truck.guid,
        FILE_TABLES.TRUCK,
        this.truck.id,
        this.files,
        'lease-purchase',
        lease.id
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp: any) => {
          resp.success.forEach(element => {
            lease.attachments.push(element);
          });
          this.notification.success(`Attachments successfully uploaded.`, ' ');
          this.truckService.updateTruckData(saveData, this.truck.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            () => {
              if (this.inputData.data.type === 'new') {
                this.notification.success('Lease has been added.', 'Success:');
              } else {
                this.notification.success('Lease has been updated.', 'Success:');
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
            this.notification.success('Lease has been added.', 'Success:');
          } else {
            this.notification.success('Lease has been updated.', 'Success:');
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
      this.saveLease(false);
    }
  }
  /* Form Validation on paste and word validation */
  onPaste(event: any, inputID: string, index?: number) {
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
      true
    );

    this.truckLeaseForm.controls[inputID].patchValue((document.getElementById(inputID) as HTMLInputElement).value);
  }

  onInputTyping(event) {
    let k;
    k = event.charCode;
    if (k == 32) {
      this.numOfSpaces++;
    } else {
      this.numOfSpaces = 0;
    }
    if (this.numOfSpaces < 2) {
      return k == 8 || k == 32 || (k >= 48 && k <= 57);
    } else {
      event.preventDefault();
    }
  }

  onCheckBackSpace(event) {
    if (event.keyCode === 8) {
      this.numOfSpaces = 0;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
