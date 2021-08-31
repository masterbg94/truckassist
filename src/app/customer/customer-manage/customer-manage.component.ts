import { Component, Input, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification-service.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { AppSharedService } from 'src/app/core/services/app-shared.service';
import { AppCustomerService } from 'src/app/core/services/app-customer.service';
import { v4 as uuidv4 } from 'uuid';
import { Address } from 'src/app/core/model/address';
import { checkSelectedText, emailChack, pasteCheck } from 'src/assets/utils/methods-global';

@Component({
  selector: 'app-customer-manage',
  templateUrl: './customer-manage.component.html',
  styleUrls: ['./customer-manage.component.scss'],
})
export class CustomerManageComponent implements OnInit, OnDestroy {

  constructor(
    private formBuilder: FormBuilder,
    private sharedService: AppSharedService,
    private customerService: AppCustomerService,
    private notification: NotificationService,
    private spinner: SpinnerService,
    private shared: SharedService,
    private activeModal: NgbActiveModal,
    private elementRef: ElementRef
  ) {
    this.createForm();
  }

  get contactPersonsFormGroup() {
    return this.customerForm.get('contactPersons') as FormArray;
  }
  @Input() inputData: any;
  customerForm: FormGroup;
  contactPersonsList: FormArray;
  brokerCustomer = 'Broker';
  openBillingAddress = false;
  checkStatus = true;
  mcVisible = true;
  zipCodes: [];
  subscription: Subscription[] = [];
  options = {
    componentRestrictions: { country: ['US', 'CA'] },
  };
  optionsPoBox = {
    types: ['(cities)'],
    componentRestrictions: { country: ['US', 'CA'] },
  };
  modalTitle: string;
  address: Address;
  isValidAddress: boolean;

  addressTab = 'Physical Address';
  bilingAddressTab = 'Physical Address';
  addressPlaceHolder = 'Address, City, State Zip';
  billingPlaceHolder = 'Address, City, State Zip';
  customerEditData: any;
  customerSwitchOptions = [
    {
      data: [
        { name: 'Physical Address', checked: true, id: 1, inputName: 'address' },
        { name: 'PO Box', checked: false, id: 2, inputName: 'address' },
      ],
    },
    {
      data: [
        { name: 'Physical Address', checked: true, id: 1, inputName: 'bilingAddress' },
        { name: 'PO Box', checked: false, id: 2, inputName: 'bilingAddress' },
      ],
    },
  ];
  addressInput: string;
  poBox: string;
  bilingAddress: string;
  poBoxBiling: string;
  loaded = false;

  /* Form Validation on paste and word validation */
  isBusiness = true;
  firstWords: boolean;
  numOfSpaces = 0;
  fomratType = /^[!^()_\\[\]{};':"\\|<>\/?]*$/;

  ngOnInit() {
    if (this.inputData.data.type == 'new') {
      this.modalTitle = 'New Broker';
      this.loaded = true;
    } else if (this.inputData.data.type == 'edit') {
      this.modalTitle = 'Edit Broker';
      this.setForm(this.inputData.data.customer);
    }
  }

  /* @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: any) {
    let x = event.keyCode;
  } */
  tabChange(tabs: any) {
    for (const tab of tabs) {
      if (tab.checked && tab.inputName === 'address') {
        if (tab.name === 'PO Box') {
          this.addressInput = '';
          this.poBox = '';
          this.addressPlaceHolder = 'City, State Zip';
          if (this.customerEditData && this.customerEditData.doc.pobox) {
            this.addressInput = this.customerEditData.doc.address.address;
            this.poBox = this.customerEditData.doc.pobox;
          }
        } else {
          this.addressPlaceHolder = 'Address, City, State Zip';
          this.addressInput = '';
          if (this.customerEditData && !this.customerEditData.doc.pobox) {
            this.addressInput = this.customerEditData.doc.address.address;
            this.poBox = '';
          }
        }
        this.customerForm.patchValue({
          address: this.addressInput,
          poBox: this.poBox,
        });
        this.addressTab = tab.name;
      } else if (tab.checked && tab.inputName === 'bilingAddress') {
        if (tab.name === 'PO Box') {
          this.bilingAddress = '';
          this.poBoxBiling = '';
          this.billingPlaceHolder = 'City, State Zip';
          if (this.customerEditData && this.customerEditData.doc.poBoxBilling) {
            this.bilingAddress = this.customerEditData.doc.billingAddress;
            this.poBoxBiling = this.customerEditData.doc.poBoxBilling;
          }
        } else {
          this.billingPlaceHolder = 'Address, City, State Zip';
          this.bilingAddress = '';
          if (this.customerEditData && !this.customerEditData.doc.poBoxBilling) {
            this.bilingAddress = this.customerEditData.doc.billingAddress;
            this.poBoxBiling = '';
          }
        }
        this.customerForm.patchValue({
          billingAddress: this.bilingAddress,
          poBoxBilling: this.poBoxBiling,
        });
        this.bilingAddressTab = tab.name;
      }
    }
  }

  setForm(data: any) {
    this.customerEditData = data;
    if (data.mcNumber !== '') {
      this.mcVisible = true;
      this.checkStatus = true;
      this.brokerCustomer = 'Broker';
    } else {
      this.mcVisible = false;
      this.checkStatus = false;
      this.brokerCustomer = 'Regular customer';
    }
    if (data.doc.billingAddress) {
      this.openBillingAddress = true;
    } else {
      this.openBillingAddress = false;
    }
    this.customerForm.setControl('contactPersons', this.setContactPersons(data.doc.contactPersons));

    if (data.doc.pobox && data.doc.pobox !== '') {
      this.customerSwitchOptions[0].data[0].checked = false;
      this.customerSwitchOptions[0].data[1].checked = true;
      this.addressTab = 'PO Box';
    }
    if (data.doc.poBoxBilling && data.doc.poBoxBilling !== '') {
      this.customerSwitchOptions[1].data[0].checked = false;
      this.customerSwitchOptions[1].data[1].checked = true;
      this.bilingAddressTab = 'PO Box';
    }

    this.customerForm.patchValue({
      name: data.name,
      dbaName: data.doc.dbaName,
      address: data.doc.address.address,
      addressUnit: data.doc.addressUnit,
      poBox: data.doc.pobox,
      phone: data.doc.phone,
      email: data.doc.email,
      billingContactCheck: this.openBillingAddress,
      billingAddress: data.doc.billingAddress,
      poBoxBilling: data.doc.poBoxBilling,
      billingAddressUnit: data.doc.billingAddressUnit,
      mcNumber: data.mcNumber,
    });

    this.address = data.doc.address;
    this.loaded = true;
    this.shared.touchFormFields(this.customerForm);
  }
  setContactPersons(contact: any): FormArray {
    const formArray = new FormArray([]);
    if (contact) {
      contact.forEach((person: any) => {
        formArray.push(
          this.formBuilder.group({
            id: person.id,
            contactName: person.contactName,
            contactPhone: person.contactPhone,
            contactEmail: person.contactEmail,
          })
        );
      });
    }
    this.contactPersonsList = formArray;
    return formArray;
  }

  handleAddressChange(address: any) {
    this.isValidAddress = true;
    this.address = this.shared.selectAddress(this.customerForm, address);
  }

  addressKeyDown(event: any) {
    this.isValidAddress = false;
    this.address = null;
  }

  handleBillingAddressChange(address: any) {
    this.customerForm.get('billingAddress').setValue(address.formatted_address);
  }

  getStatus() {
    this.checkStatus = !this.checkStatus;
    if (!this.checkStatus) {
      this.mcVisible = false;
      this.brokerCustomer = 'Regular customer';
    } else {
      this.mcVisible = true;
      this.brokerCustomer = 'Broker';
    }
  }

  billingAddress(event: any) {
   
    if (event) {
      setTimeout(() => {
        this.openBillingAddress = true;
        this.customerForm.get('billingAddress').reset();
        this.customerForm.get('billingAddressUnit').reset();
        this.customerForm.get('billingAddressUnit').setValue('');
      });
    } else {
      setTimeout(() => {
        this.openBillingAddress = false;
        this.customerForm.get('billingAddress').reset();
        this.customerForm.get('billingAddressUnit').reset();
        this.customerForm.get('billingAddressUnit').setValue('');
      });
    }
  }

  createForm() {
    this.customerForm = this.formBuilder.group({
      name: [null, Validators.required],
      dbaName: [null],
      mcNumber: [''],
      /* phone: [null, Validators.required], */
      phone: [null],
      email: ['', Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)],
      address: [null, Validators.required],
      addressUnit: [null],
      poBox: [null],
      billingContactCheck: [false],
      billingAddress: [null],
      poBoxBilling: [null],
      billingAddressUnit: [''],
      emailBilling: [null],
      phoneBilling: [null],
      contactPersons: this.formBuilder.array([]),
    });
    this.contactPersonsList = this.customerForm.get('contactPersons') as FormArray;
    setTimeout(() => {
      this.transformInputData();
    });
  }

  private transformInputData() {
    const data = {
      name: 'upper',
      email: 'lower',
      addressUnit: 'upper',
      dbaName: 'upper',
    };

    this.shared.handleInputValues(this.customerForm, data);
  }

  createContactPerson() {
    const fb = this.formBuilder.group({
      id: uuidv4(),
      contactName: [null],
      contactEmail: ['', Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)],
      contactPhone: [null],
    });

    const data = {
      contactEmail: 'lower',
    };

    this.shared.handleInputValues(fb, data);
    return fb;
  }

  addNewContactPerson() {
    if (this.contactPersonsList.controls.length < 2) {
      this.contactPersonsList.push(this.createContactPerson());
    }
  }

  removeContact(index) {
    this.contactPersonsList.removeAt(index);
  }

  updateCustomer() {
    this.customerService.customerEdited = true;
    if (!this.shared.markInvalid(this.customerForm)) {
      return false;
    }
    const customer = this.customerForm.value;
    const saveDate = {
      name: customer.name,
      mcNumber: customer.mcNumber,
      hasBillingContact: customer.billingContactCheck ? 1 : 0,
      doc: {
        dbaName: customer.dbaName,
        phone: customer.phone,
        email: customer.email,
        address: this.address,
        pobox: customer.poBox,
        addressUnit: customer.addressUnit,
        billingAddress: customer.billingAddress,
        poBoxBilling: customer.poBoxBilling,
        billingAddressUnit: customer.billingAddressUnit,
        contactPersons: this.contactPersonsList.getRawValue(),
      },
    };

    this.spinner.show(true);

    if (this.inputData.data.type == 'new') {
      this.customerService.addCustomer(saveDate).subscribe(
        (resp: any) => {
          this.notification.success(`Customer ${saveDate.name} added.`, ' ');
          this.closeCustomerEdit();
        },
        (error: any) => {
          this.shared.handleServerError();
        }
      );
    } else if (this.inputData.data.type == 'edit') {
      this.customerService.updateCustomer(saveDate, this.inputData.data.id).subscribe(
        (resp: any) => {
          this.notification.success(`Customer ${saveDate.name} updated.`, ' ');
          this.closeCustomerEdit();
        },
        (error: any) => {
          this.shared.handleServerError();
        }
      );
    }
  }

  keyDownFunction(event: any) {
    if (event.keyCode == 13 && event.target.localName !== 'textarea') {
      this.updateCustomer();
    }
  }

  clearList(event: any) {
    if (!event) {
      this.zipCodes = [];
    }
  }

  closeCustomerEdit() {
    this.activeModal.close();
  }
  onPaste(event: any, inputID: string, limitCarakters?: number, index?: number) {
    event.preventDefault();

    if (index !== undefined) {
      (document.getElementById(inputID + index) as HTMLInputElement).value = checkSelectedText(
        inputID,
        index
      );
    } else {
      (document.getElementById(inputID) as HTMLInputElement).value = checkSelectedText(
        inputID,
        index
      );
    }

    this.numOfSpaces = 0;

    if (index !== undefined) {
      if (inputID === 'contactEmail') {
        this.fomratType = /^[!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]*$/;
        (document.getElementById(inputID + index) as HTMLInputElement).value += pasteCheck(
          event.clipboardData.getData('Text'),
          this.fomratType,
          false
        );
      } else {
        this.fomratType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]*$/;
        (document.getElementById(inputID + index) as HTMLInputElement).value += pasteCheck(
          event.clipboardData.getData('Text'),
          this.fomratType,
          true
        );
      }
    } else if (inputID === 'email') {
      this.fomratType = /^[!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.fomratType,
        false
      );
    } else if (inputID === 'mcNumber') {
      this.fomratType = /^[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.fomratType,
        false,
        false,
        false,
        limitCarakters
      );
    } else {
      if ((document.getElementById(inputID) as HTMLInputElement).value !== '') {
        this.firstWords = false;
      } else {
        this.firstWords = true;
      }
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.fomratType,
        true,
        this.isBusiness,
        this.firstWords
      );
    }

    if (inputID === 'name') {
      this.customerForm.controls[inputID].patchValue(
        (document.getElementById(inputID) as HTMLInputElement).value
      );
    }
  }

  onNameTyping(event) {
    let k;
    k = event.charCode;
    if (k == 32) {
      this.numOfSpaces++;
    } else {
      this.numOfSpaces = 0;
    }
    if ((document.getElementById('name') as HTMLInputElement).value === '') {
      if (
        event.key === '*' ||
        event.key === '=' ||
        event.key === '+' ||
        event.key === '#' ||
        event.key === '%' ||
        event.key === ' '
      ) {
        event.preventDefault();
      }
    }
    if (this.numOfSpaces < 2) {
      return (
        (k > 64 && k < 91) ||
        (k > 96 && k <= 121) ||
        (k >= 48 && k <= 57) ||
        k == 8 ||
        k == 32 ||
        (k >= 42 && k <= 46) ||
        k === 64 ||
        k === 61 ||
        (k >= 35 && k <= 38)
      );
    } else {
      event.preventDefault();
    }
  }

  onPoBoxBillingTyping(event) {
    let k;
    k = event.charCode;
    if (k == 32) {
      this.numOfSpaces++;
    } else {
      this.numOfSpaces = 0;
    }

    if (this.numOfSpaces < 2) {
      return (
        (k > 64 && k < 91) ||
        (k > 96 && k < 123) ||
        k == 8 ||
        k == 32 ||
        (k >= 48 && k <= 57) ||
        k === 46 ||
        k === 45
      );
    } else {
      event.preventDefault();
    }
  }

  onContactNameTyping(event) {
    let k;
    k = event.charCode;
    if (k == 32) {
      this.numOfSpaces++;
    } else {
      this.numOfSpaces = 0;
    }
    if (this.numOfSpaces < 2) {
      return (k > 64 && k < 91) || (k > 96 && k < 123) || k == 32;
    } else {
      event.preventDefault();
    }
  }

  onCheckBackSpace(event) {
    if (event.keyCode === 8) {
      this.numOfSpaces = 0;
    }
  }

  onEmailTyping(event) {
    return emailChack(event);
  }

  ngOnDestroy() {
    this.subscription.forEach((subscription) => subscription.unsubscribe());
  }

  manageInputValidation(formElement: any) {
    return this.shared.manageInputValidation(formElement);
  }
}
