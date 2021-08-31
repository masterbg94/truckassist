import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/notification-service.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/core/services/shared.service';
import { AppSharedService } from 'src/app/core/services/app-shared.service';
import { Address } from 'src/app/core/model/address';
import { v4 as uuidv4 } from 'uuid';
import { emailChack, pasteCheck } from 'src/assets/utils/methods-global';
import { TruckEffects } from 'src/app/root-store/trucks-store/trucks.effects';

@Component({
  selector: 'app-company-insurance-policy-edit',
  templateUrl: './company-insurance-policy-edit.component.html',
  styleUrls: ['./company-insurance-policy-edit.component.scss'],
})
export class CompanyInsurancePolicyEditComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private sharedService: AppSharedService,
    private shared: SharedService,
    private spinner: SpinnerService,
    private activeModal: NgbActiveModal,
    private notification: NotificationService
  ) {
    this.createForm();
  }
 
  @Input() inputData: any;
  modalTitle: string;
  subscription: Subscription[] = [];
  newItem = false;
  isValidAddress = false;
  textRows = 1;
  loaded = false;
  public fomratType = /^[!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]*$/;
  files = [];
  attachments: any = [];


  /* Office Variables */
  officeForm: FormGroup;

  /* Producer Details */
  openProductDetailsDropDown = true;
  @ViewChild('addressInput') addressInput: ElementRef;
  address: Address;
  optionsAddress = {
    componentRestrictions: { country: ['US', 'CA'] },
  };

  /* Policy Details */
  openPolicyDetailsDropDown = true;

  /* Note */
  showNote = false;
  @ViewChild('note') note: ElementRef;

  ngOnInit() {}

  /* Open Selected Modal */
  onOpenDropDown(dropName: string) {
    switch (dropName) {
      case 'Producer':
        this.openProductDetailsDropDown = !this.openProductDetailsDropDown;
      break;
      case 'Policy':
        this.openPolicyDetailsDropDown = !this.openPolicyDetailsDropDown;
      break;
    }
  }

  private transformInputData() {
    const data = {
      producer: 'upper',
      email: 'lower',
      addressUnit: 'upper',
    };

    this.shared.handleInputValues(this.officeForm, data);
  }

  createForm() {
    this.modalTitle = 'Add Insurance Policy';
    this.officeForm = this.formBuilder.group({
      producer: ['', Validators.required],
      phone: null,
      email: ['', Validators.email],
      address: '',
      addressUnit: '',
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],

      mcNumber: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(8)]],
      usDotNumber: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(8)]],
      payPeriod: null,
      endingIn: null,
      paymentType: [null],
      emptyMiles: [null],
      loadedMiles: [null],
      commission: [2],
      commissionDriver: [10],
      address_unit: '',
      startLoadNumber: ['', [Validators.required, Validators.maxLength(7)]],
      irpNumber: [null, Validators.maxLength(10)],
      iftaNumber: [null, Validators.maxLength(14)],
      scacNumber: [null, Validators.maxLength(6)],
      ipassEzpass: [null, Validators.maxLength(11)],
      timeZone: null,
      webUrl: '',
      fax: null,
      note: '',
      bank: null,
      accountNumber: [null, [Validators.minLength(4), Validators.maxLength(17)]],
      routingNumber: null,
      currency: null,
      phoneDispatch: null,
      emailDispatch: '',
      phoneAccounting: null,
      emailAccounting: '',
      phoneSafety: null,
      emailSafety: '',
      invoicing: [true],
      avatar: '',
    });


    this.transformInputData();
  }

  setForm() {}

  handleHeight(val: string) {}

  /* Save Office Data */
  saveOffice() {
    const officeData = this.officeForm.getRawValue();

    const saveData = {
      producer: officeData.producer,
      phone: officeData.phone,
      email: officeData.email,
      address: this.address,
      addressUnit: officeData.addressUnit,
    }

    console.log('Office Data To Save');
    console.log(saveData);
  }

  /* Get Address */
  public handleAddressChange(address: any) {
    this.address = this.shared.selectAddress(this.officeForm, address);
  }

  /* Set Files */
  setFiles(files: any) {
    this.files = files;
  }
  
  /* Open Dropdown */
  openNote() {
    this.showNote = !this.showNote;
    if (this.showNote) {
      setTimeout(() => {
        this.note.nativeElement.focus();
      }, 250);
    }
  }
  

  addressKeyDown(event: any) {}

  closeOfficeEditModal() {}

  keyDownFunction(event: any) {}

  /*   openNote() {} */

  onUnitTyping(event) {}

  manageInputValidation(formElement: any) {}

  ngOnDestroy() {}
}
