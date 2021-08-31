import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { DateFormatter } from 'src/app/core/helpers/dateFormatter';
import { TrailerData, TrailerLease } from 'src/app/core/model/trailer';
import { AppTrailerService } from 'src/app/core/services/app-trailer.service';
import { ClonerService } from 'src/app/core/services/cloner-service';
import { SharedService } from 'src/app/core/services/shared.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { checkSelectedText, pasteCheck } from 'src/assets/utils/methods-global';
import { v4 as uuidv4 } from 'uuid';
import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import { StorageService } from 'src/app/core/services/storage.service';
import { FILE_TABLES } from 'src/app/const';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-trailer-lease-purchase-manage',
  templateUrl: './trailer-lease-purchase-manage.component.html',
  styleUrls: ['./trailer-lease-purchase-manage.component.scss'],
})
export class TrailerLeasePurchaseManageComponent implements OnInit, OnDestroy {

  constructor(
    private formBuilder: FormBuilder,
    private trailerService: AppTrailerService,
    private spinner: SpinnerService,
    private activeModal: NgbActiveModal,
    private storageService: StorageService,
    private shared: SharedService,
    private notification: NotificationService,
    private clonerService: ClonerService
  ) {
    this.createForm();
  }
  @Output() event = new EventEmitter<any>();
  @Input() inputData: any;
  private destroy$: Subject<void> = new Subject<void>();
  trailerLeaseForm: FormGroup;
  trailer: TrailerData = null;
  trailerLeaseData: TrailerLease[] = [];
  lease: TrailerLease = null;
  formData = new FormData();
  modalTitle: string;
  loaded = false;
  files = [];

  leaseData = [
    { id: 1, name: 'Lessor' },
    { id: 2, name: 'Purchase' },
  ];

  sellerData = [
    { id: 1, name: 'Seller' },
    { id: 2, name: 'Buyer' },
  ];

  format: FormatSettings = environment.dateFormat;
  attachments: any = [];

  public fomratType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?A-Za-z]*$/;
  public numOfSpaces = 0;

  ngOnInit() {
    this.modalTitle = this.inputData.data.trailer && this.inputData.data.prefix
      ? 'Unit # ' + this.inputData.data.trailer.trailerNumber + ' - '
      : '';
    this.modalTitle +=
      this.inputData.data.type === 'edit' ? 'Edit Lease - purchase' : 'New Lease - purchase';
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
    this.trailerLeaseForm = this.formBuilder.group({
      lessor: [null, Validators.required],
      seller: [null, Validators.required],
      date: ['', Validators.required],
      paymentAmount: ['', Validators.required],
      numberOfPayments: ['', Validators.required],
      downPayment: ['', Validators.required],
    });
  }

  public loadLeaseData(): void {
    this.trailer = this.inputData.data.trailer ? this.inputData.data.trailer : null;
    if (this.inputData.data.trailer && this.inputData.data.trailer.doc.trailerLeaseData) {
      this.trailerLeaseData = this.inputData.data.trailer.doc.trailerLeaseData;
      if (this.inputData.data.type === 'edit') {
        const lease = this.shared.getItemById(this.trailerLeaseData, this.inputData.data.id);
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

  public setLicenceData(lease: TrailerLease) {
    this.loaded = true;
    this.lease = lease;
    if (this.inputData.data.type === 'edit') {
      this.trailerLeaseForm.setValue({
        lessor: lease.lessor,
        seller: lease.seller,
        date: new Date(lease.date),
        paymentAmount: lease.paymentAmount,
        numberOfPayments: lease.numberOfPayments,
        downPayment: lease.downPayment,
      });
      this.shared.touchFormFields(this.trailerLeaseForm);
    }
  }

  closeModal() {
    this.activeModal.close();
  }

  saveLease(keepModal: boolean) {
    if (!this.shared.markInvalid(this.trailerLeaseForm)) {
      return false;
    }

    const lease: TrailerLease = {
      id: this.lease ? this.lease.id : uuidv4(),
      date: this.trailerLeaseForm.controls.date.value,
      seller: this.trailerLeaseForm.controls.seller.value,
      lessor: this.trailerLeaseForm.controls.lessor.value,
      paymentAmount: this.trailerLeaseForm.controls.paymentAmount.value,
      numberOfPayments: this.trailerLeaseForm.controls.numberOfPayments.value,
      downPayment: this.trailerLeaseForm.controls.downPayment.value,
      attachments: (this.lease && this.lease.attachments) ? this.lease.attachments : []
    };

    const saveData: TrailerData = this.clonerService.deepClone<TrailerData>(this.trailer);
    saveData.status = this.trailer.status ? 1 : 0;

    lease.date = DateFormatter.formatDate(lease.date.toString());

    const index = this.trailerLeaseData.findIndex((l) => l.id === lease.id);

    const tempData = this.trailerLeaseData;

    if (index !== -1) {
      tempData[index] = lease;
    } else {
      tempData.push(lease);
    }

    saveData.doc.trailerLeaseData = tempData;

    this.spinner.show(true);
    const newFiles = this.shared.getNewFiles(this.files);
    if (newFiles.length > 0) {
      this.storageService.uploadFiles(
        this.trailer.guid,
        FILE_TABLES.TRAILER,
        this.trailer.id,
        this.files,
        'lease-purchase',
        lease.id
      ).subscribe(
        (resp: any) => {
          resp.success.forEach(element => {
            lease.attachments.push(element);
          });
          this.notification.success(`Attachments successfully uploaded.`, ' ');
          this.trailerService.updateTrailerData(saveData, this.trailer.id)
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
      this.trailerService.updateTrailerData(saveData, this.trailer.id)
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
      this.saveLease(false);
    }
  }
   /* Form Validation on paste and word validation */
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
      true
    );

    this.trailerLeaseForm.controls[inputID].patchValue((document.getElementById(inputID) as HTMLInputElement).value);
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
