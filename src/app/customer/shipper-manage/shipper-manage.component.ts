import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification-service.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Shipper, ManageShipper } from 'src/app/core/model/customer';
import { AppCustomerService } from 'src/app/core/services/app-customer.service';
import { AppSharedService } from 'src/app/core/services/app-shared.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { Address } from 'src/app/core/model/address';
import { checkSelectedText, emailChack, pasteCheck } from 'src/assets/utils/methods-global';

@Component({
  selector: 'app-shipper-manage',
  templateUrl: './shipper-manage.component.html',
  styleUrls: ['./shipper-manage.component.scss']
})
export class ShipperManageComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private customerService: AppCustomerService,
    private sharedService: AppSharedService,
    private notification: NotificationService,
    private shared: SharedService,
    private spinner: SpinnerService,
    private activeModal: NgbActiveModal
  ) {
    this.createForm();
  }

  get contactPersonsFormGroup() {
    return this.shipperForm.get('contactPersons') as FormArray;
  }
  @ViewChild('placesRef') placesRef: GooglePlaceDirective;
  @ViewChild('addressInput') addressInput: ElementRef;
  @Input() inputData: any;
  isValidAddress = false;
  shipperForm: FormGroup;
  contactPersonsList: FormArray;
  subscription: Subscription[] = [];
  options = {
    componentRestrictions: { country: ['US', 'CA'] },
  };
  modalTitle: any;
  address: Address;
  loaded = false;
  public isBusiness = true;
  public firstWords: boolean;
  public fomratType: any;
  public numOfSpaces = 0;

  ngOnInit() {
    if (this.inputData.data.type == 'new') {
      this.modalTitle = 'New Shipper/Consignee';
      this.loaded = true;
    } else if (this.inputData.data.type == 'edit') {
      this.setForm(this.inputData.data.shipper);
      this.modalTitle = 'Edit Shipper/Consignee';
    }
  }

  onSpecialChar(event) {
    let k;
    k = event.charCode;
    return (k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32;
  }

  setForm(data: ManageShipper) {
    if (data.doc.address !== null && data.doc.address.address !== '') {
      this.isValidAddress = true;
    }
    this.shipperForm.patchValue({
      name: data.name,
      status: data.status,
      phone: data.doc.phone,
      address: data.doc.address.address,
      addressUnit: data.doc.addressUnit,
      email: data.doc.email,
      appointments: data.doc.appointments,
      receivingHours: data.doc.receivingHours,
    });
    this.loaded = true;
    this.address = data.doc.address;
    this.shipperForm.setControl('contactPersons', this.setContactPersons(data.doc.contactPersons));
    this.shared.touchFormFields(this.shipperForm);
  }

  setContactPersons(contact: any): FormArray {
    const formArray = new FormArray([]);
    if (contact) {
      contact.forEach((person: any) => {
        formArray.push(
          this.formBuilder.group({
            id: person.id,
            name: person.name,
            phone: person.phone,
            email: person.email,
          })
        );
      });
    }
    this.contactPersonsList = formArray;
    return formArray;
  }

  addNewContactPerson() {
    if (this.contactPersonsList.controls.length < 2) {
      this.contactPersonsList.push(this.createContactPerson());
    }
  }

  removeContact(index: any) {
    this.contactPersonsList.removeAt(index);
  }

  manageShipper() {
    this.customerService.shipperEdited = true;
    if (!this.shared.markInvalid(this.shipperForm)) {
      return false;
    }
    if (this.isValidAddress == false) {
      this.notification.warning('Address needs to be valid.', 'Warning:');
      this.addressInput.nativeElement.focus();
      return;
    }
    const shipper = this.shipperForm.value;

    const saveData = {
      name: shipper.name,
      status: shipper.status ? 1 : 0,
      doc: {
        address: this.address,
        addressUnit: shipper.addressUnit,
        phone: shipper.phone,
        email: shipper.email,
        receivingHours: shipper.receivingHours,
        appointments: shipper.appointments ? 1 : 0,
        contactPersons: this.contactPersonsList.getRawValue(),
      },
    };

    this.spinner.show(true);

    if (this.inputData.data.type == 'new') {
      this.customerService.addShipper(saveData).subscribe(
        (resp: any) => {
          this.closeShipperEdit();
          this.notification.success(`Shipper ${saveData.name} added successfully.`, 'Success:');
          this.shared.emitShipperChange.emit();
        },
        (error: any) => {
          this.shared.handleServerError();
        }
      );
    } else if (this.inputData.data.type == 'edit') {
      this.customerService.updateShipper(saveData, this.inputData.data.id).subscribe(
        (resp: any) => {
          this.closeShipperEdit();
          this.notification.success(`Shipper ${saveData.name} updated successfully.`, 'Success:');
        },
        (error: any) => {
          this.shared.handleServerError();
        }
      );
    }
  }

  createForm() {
    this.shipperForm = this.formBuilder.group({
      name: [null, Validators.required],
      status: [1],
      phone: [null],
      address: [null, Validators.required],
      addressUnit: '',
      /*  Validators.required, */
      email: ['', Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)],
      appointments: [1],
      receivingHours: [''],
      contactPersons: this.formBuilder.array([]),
    });
    this.contactPersonsList = this.shipperForm.get('contactPersons') as FormArray;
    setTimeout(() => {
      this.transformInputData();
    });
  }

  private transformInputData() {
    const data = {
      name: 'upper',
      email: 'lower',
      addressUnit: 'upper',
    };

    this.shared.handleInputValues(this.shipperForm, data);
  }

  createContactPerson() {
    const fb = this.formBuilder.group({
      name: [''],
      email: ['', Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)],
      phone: [''],
    });
    const data = {
      email: 'lower',
    };
    this.shared.handleInputValues(fb, data);
    return fb;
  }

  closeShipperEdit() {
    this.shared.emitShipperClose.emit();
    this.activeModal.close();
  }

  public handleAddressChange(address: any) {
    this.isValidAddress = true;
    this.address = this.shared.selectAddress(this.shipperForm, address);
  }

  addressKeyDown(event: any) {
    this.isValidAddress = false;
    this.address = null;
  }

  keyDownFunction(event: any) {
    if (event.keyCode == 13 && event.target.localName !== 'textarea') {
      this.manageShipper();
    }
  }

  retriveAddressComponents(addressArray: any, type: string, name: string) {
    const res = addressArray.find((addressComponents) => addressComponents.types[0] === type);
    if (res !== undefined) {
      return res[name];
    } else {
      return '';
    }
  }
  /* Form Validation on paste and word validation */
  onPaste(event: any, inputID: string, index?: number) {

    if (index !== undefined) {
      (document.getElementById(inputID + index) as HTMLInputElement).value  = checkSelectedText(inputID, index);
    } else {
       (document.getElementById(inputID) as HTMLInputElement).value = checkSelectedText(inputID, index);
    }

    this.numOfSpaces = 0;

    this.fomratType = /^[!@#$%^&*()_+\=\[\]{};':"\\|<>\/?]*$/;
    event.preventDefault();
    if (index !== undefined) {
      if (inputID === 'email') {
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
    } else if (inputID === 'name') {
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.fomratType,
        true,
        this.isBusiness,
        this.firstWords
      );
    } else {
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.fomratType,
        true
      );
    }

    if (inputID === 'name') {
      this.shipperForm.controls[inputID].patchValue((document.getElementById(inputID) as HTMLInputElement).value);
    }
  }

  onBusinessName(event) {
    let k;
    k = event.charCode;
    if (k == 32) {
      this.numOfSpaces++;
    } else {
      this.numOfSpaces = 0;
    }
    /* For first input restriction */
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
  onNameTyping(event) {
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
        k == 46 ||
        k == 44 ||
        k == 45
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
