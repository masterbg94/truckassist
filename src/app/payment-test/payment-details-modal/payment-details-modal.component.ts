import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/core/services/shared.service';
import { AppBankAddComponent } from 'src/app/shared/app-bank/app-bank-add/app-bank-add.component';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { BankData, DriverData } from 'src/app/core/model/driver';
import { AppSharedService } from 'src/app/core/services/app-shared.service';
import { Subject } from 'rxjs';
import { MetaDataService } from 'src/app/core/services/metadata.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-payment-details-modal',
  templateUrl: './payment-details-modal.component.html',
  styleUrls: ['./payment-details-modal.component.scss'],
})
export class PaymentDetailsModalComponent implements OnInit {
  @Input() inputData: any;
  paymentDetailsForm: FormGroup;
  bankData: BankData[];
  bankInfoRequired: boolean;
  private destroy$: Subject<void> = new Subject<void>();
  driver: DriverData;
  modalTitle: string;
  headerFirst = '';
  markedTitle = '';
  markedData = '';
  textUnderlogoFirst = '';
  textUnderlogoSecond = '';
  headerSecond = '';
  buttonText = '';
  headerthird = '';
  checkedSecond = '';
  checkedFirst = '';
  formSubmitted = false;
  options = {
    componentRestrictions: { country: ['US', 'CA'] },
  };

  newBank = '';
  newBankVisible = false;

  bankSearchItems = 0;

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private shared: SharedService,
    private metaDataService: MetaDataService,
    private customModalService: CustomModalService,
    private sharedService: AppSharedService
  ) {}

  ngOnInit() {
    this.loadInitData();
    this.createForm();
    this.getBanks(false);
  }

  loadInitData(): void {
    this.headerFirst = this.inputData.data.headerFirst;
    this.markedTitle = this.inputData.data.markedTitle;
    this.markedData = this.inputData.data.markedData;
    this.textUnderlogoFirst = this.inputData.data.textUnderlogoFirst;
    this.textUnderlogoSecond = this.inputData.data.textUnderlogoSecond;
    this.headerSecond = this.inputData.data.headerSecond;
    this.buttonText = this.inputData.data.buttonText;
    this.headerthird = this.inputData.data.headerthird;
    this.checkedSecond = this.inputData.data.checkedSecond;
    this.checkedFirst = this.inputData.data.checkedFirst;
    document.getElementById('trackAssist').innerHTML = this.checkedSecond;
  }

  createForm() {
    this.paymentDetailsForm = this.formBuilder.group({
      name: ['', Validators.required],
      phoneNumber: [''],
      email: [''],
      address: [''],
      addressUnit: [''],
      accountNumber: ['', Validators.required],
      routingNumber: ['', Validators.required],
      bankData: [null],
    });
    // this.requiredBankInfo(false);
  }
  saveData() {
    if (this.paymentDetailsForm.invalid) {
      this.shared.markInvalid(this.paymentDetailsForm);
      return;
    }
    const data = {
      name: this.paymentDetailsForm.controls.name.value,
      phone: this.paymentDetailsForm.controls.phoneNumber.value,
      email: this.paymentDetailsForm.controls.email.value,
      address: this.paymentDetailsForm.controls.address.value,
      addressUnit: this.paymentDetailsForm.controls.addressUnit.value,
      bankData: this.paymentDetailsForm.controls.bankData.value,
      accountNumber: this.paymentDetailsForm.controls.accountNumber.value,
      routingNumber: this.paymentDetailsForm.controls.routingNumber.value,
    };

    console.log(
      data.name,
      data.phone,
      data.email,
      data.address,
      data.addressUnit,
      data.bankData,
      data.accountNumber,
      data.routingNumber
    );
  }

  keyDownFunction(event: any) {
    if (event.keyCode === 13) {
      // TODO: kad se klikne na enter
      // ovde se poziva metoda koja ce ti cuvati podatke kao kad se klikne na save dugme
      this.saveData();
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
          id: 0
        });
        result.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
        this.bankData = result;
        if (loadNewBank) {
          this.paymentDetailsForm.controls.bankData.setValue(result[result.length - 1]);
        }
      },
      (error: HttpErrorResponse) => {
        this.shared.handleError(error);
      }
    );
  }

  openBankModal() {
    this.customModalService.openModal(AppBankAddComponent, null, null, { size: 'small' });
  }
  closeModal() {
    this.activeModal.close();
  }

  saveNewBank() {
    const data = {
      domain: 'bank',
      key: 'name',
      value: this.newBank,
      protected: 0
    };

    this.metaDataService.createMetadata(data)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (resp: any) => {
        this.closeNewBank();
        this.getBanks(true);
      },
      (error: HttpErrorResponse) => {
        this.shared.handleError(error);
      }
    );
  }

  closeNewBank() {
    this.newBankVisible = false;
    this.newBank = '';
  }

  onBankKeyPress(event: any) {
    if (event.charCode == 13) {
      this.saveNewBank();
    }
  }

  onBankChange(event: any) {
    this.requiredBankInfo(event !== undefined ? true : false);
    if (event !== undefined && event.id == 0) {
      this.paymentDetailsForm.controls.bankData.reset();
      this.newBankVisible = true;
      setTimeout(() => {
        document.getElementById('newBank').focus();
      }, 250);
    }
  }

  requiredBankInfo(state: boolean) {
    if (state) {
      this.paymentDetailsForm.controls.accountNumber.enable();
      this.paymentDetailsForm.controls.routingNumber.enable();
      this.paymentDetailsForm.controls.accountNumber.setValidators(Validators.required);
      this.paymentDetailsForm.controls.routingNumber.setValidators([
        Validators.required,
        Validators.minLength(9)
      ]);
      this.bankInfoRequired = true;
    } else {
      this.paymentDetailsForm.controls.accountNumber.reset();
      this.paymentDetailsForm.controls.routingNumber.reset();
      this.paymentDetailsForm.controls.accountNumber.disable();
      this.paymentDetailsForm.controls.routingNumber.disable();
      this.paymentDetailsForm.controls.accountNumber.clearValidators();
      this.paymentDetailsForm.controls.routingNumber.clearValidators();
      this.bankInfoRequired = false;
    }
    this.paymentDetailsForm.controls.routingNumber.updateValueAndValidity();
    this.paymentDetailsForm.controls.accountNumber.updateValueAndValidity();
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
      this.paymentDetailsForm.controls.bankData.reset();
    });
  }

  manageInputValidation(formElement: any) {
    return this.shared.manageInputValidation(formElement);
  }

  changeBillingInfo() {

  }

  changeAchConfirmation() {

  }

  customSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return ((item.bankName.toLocaleLowerCase().indexOf(term) > -1) || (item.id === 0));
  }

  onSearch(event: any) {
    this.bankSearchItems = event.items.length;
  }

  onClose(event: any) {
    this.bankSearchItems = 0;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
