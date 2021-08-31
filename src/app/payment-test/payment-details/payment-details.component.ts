import { takeUntil } from 'rxjs/operators';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomModalService } from '../../core/services/custom-modal.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankData } from '../../core/model/driver';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedService } from '../../core/services/shared.service';
import { AppSharedService } from '../../core/services/app-shared.service';
import { ProcessingModalComponent } from '../processing-modal/processing-modal.component';
import { Address } from '../../core/model/address';
import { NotificationService } from '../../services/notification-service.service';
import { Subject } from 'rxjs';
import { MetaDataService } from 'src/app/core/services/metadata.service';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss'],
})
export class PaymentDetailsComponent implements OnInit {
  @ViewChild('addressInput') addressInput: ElementRef;
  paymentDetailForm: FormGroup;
  bankData: BankData[];
  saveBilling: boolean;
  authorize: boolean;

  bankSearchItems = 0;
  options = {
    componentRestrictions: { country: ['US', 'CA'] },
  };
  isValidAddress = false;
  address: Address;
  newBankVisible = false;
  public bankInfoRequired: boolean;
  newBank = '';
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private modalService: CustomModalService,
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private sharedService: AppSharedService,
    private metaDataService: MetaDataService,
    private shared: SharedService,
    private notification: NotificationService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.getBanks(false);
  }

  createForm() {
    this.paymentDetailForm = this.formBuilder.group({
      companyName: ['', Validators.required],
      phone: [''],
      email: [''],
      address: ['', Validators.required],
      addressUnit: ['', Validators.required],
      bank: ['', Validators.required],
      accountNumber: ['', Validators.required],
      routingNumber: ['', Validators.required],
      saveBilling: [''],
      authorize: [''],
    });
    this.requiredBankInfo(false);
  }

  closeModal() {
    this.activeModal.close();
  }

  onBankKeyPress(event: any) {
    if (event.charCode == 13) {
      this.saveNewBank();
    }
  }

  getBanks(loadNewBank: boolean) {
    this.sharedService.getBankList()
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (result: BankData[]) => {
        result.push({
          bankLogo: null,
          bankLogoWide: null,
          bankName: 'Add new',
          companyId: null,
          id: 0,
        });
        result.sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0));
        this.bankData = result;
        if (loadNewBank) {
          this.paymentDetailForm.controls.bank.setValue(result[result.length - 1]);
        }
      },
      (error: HttpErrorResponse) => {
        this.shared.handleError(error);
      }
    );
  }

  saveNewBank() {
    const data = {
      domain: 'bank',
      key: 'name',
      value: this.newBank,
      protected: 0,
    };

    this.metaDataService.createMetadata(data)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (resp: any) => {
        this.closeNewBank();
        this.getBanks(true);
      },
      (error: any) => {
        this.shared.handleServerError();
      }
    );
  }

  public onBankChange(event: any) {
    this.requiredBankInfo(event !== undefined ? true : false);
    if (event !== undefined && event.id == 0) {
      this.paymentDetailForm.controls.bank.reset();
      this.newBankVisible = true;
      setTimeout(() => {
        document.getElementById('newBank').focus();
      }, 250);
    }
  }

  closeNewBank() {
    this.newBankVisible = false;
    this.newBank = '';
  }

  public requiredBankInfo(state: boolean) {
    if (state) {
      this.paymentDetailForm.controls.accountNumber.enable();
      this.paymentDetailForm.controls.routingNumber.enable();
      this.paymentDetailForm.controls.accountNumber.setValidators(Validators.required);
      this.paymentDetailForm.controls.routingNumber.setValidators(Validators.required);
      this.bankInfoRequired = true;
    } else {
      this.paymentDetailForm.controls.accountNumber.reset();
      this.paymentDetailForm.controls.routingNumber.reset();
      this.paymentDetailForm.controls.accountNumber.disable();
      this.paymentDetailForm.controls.routingNumber.disable();
      this.paymentDetailForm.controls.accountNumber.clearValidators();
      this.paymentDetailForm.controls.routingNumber.clearValidators();
      this.bankInfoRequired = false;
    }
    this.paymentDetailForm.controls.routingNumber.updateValueAndValidity();
    this.paymentDetailForm.controls.accountNumber.updateValueAndValidity();
  }

  deleteBank(id: number) {
    this.metaDataService.deleteBank(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (resp: any) => {
        this.getBanks(false);
      },
      (error: HttpErrorResponse) => {
        this.shared.handleError(error);
      }
    );
    setTimeout(() => {
      this.paymentDetailForm.controls.bank.reset();
    });
  }

  submitPayment() {
    console.log('submitPayment', this.paymentDetailForm.getRawValue());
    if (this.isValidAddress == false) {
      this.notification.warning('Address needs to be valid.', 'Warning:');
      this.addressInput.nativeElement.focus();
      return;
    }
    this.closeModal();
    if (this.paymentDetailForm.valid) {
      const data = this.paymentDetailForm.getRawValue();
      this.modalService.openModal(ProcessingModalComponent, { data }, null, { size: 'small' });
    }
  }

  saveBillingToggle() {
    this.saveBilling != this.saveBilling;
  }

  authorizeToggle() {
    this.authorize != this.authorize;
  }

  customSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.bankName.toLocaleLowerCase().indexOf(term) > -1 || item.id === 0;
  }

  onSearch(event: any) {
    this.bankSearchItems = event.items.length;
  }

  onClose(event: any) {
    this.bankSearchItems = 0;
  }

  manageInputValidation(formElement: any) {
    return this.shared.manageInputValidation(formElement);
  }

  public handleAddressChange(address: any) {
    this.isValidAddress = true;
    this.address = this.shared.selectAddress(this.paymentDetailForm, address);
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
