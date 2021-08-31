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

@Component({
  selector: 'app-app-company-office-edit',
  templateUrl: './app-company-office-edit.component.html',
  styleUrls: ['./app-company-office-edit.component.scss']
})
export class AppCompanyOfficeEditComponent implements OnInit, OnDestroy {

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
  @ViewChild('note') note: ElementRef;
  @ViewChild('addressInput') addressInput: ElementRef;
  @Input() inputData: any;

  officeForm: FormGroup;
  modalTitle: string;
  subscription: Subscription[] = [];
  options = {
    componentRestrictions: { country: ['US', 'CA'] },
  };
  newItem = false;
  address: Address;
  isValidAddress = false;
  showNote = false;
  textRows = 1;
  loaded = false;

  public fomratType = /^[!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]*$/;

  ngOnInit() {
    this.newItem = this.inputData.id == -1 ? true : false;
    if (this.newItem) {
      this.modalTitle = 'New office';
      this.loaded = true;
    } else {
      this.setForm();
      this.modalTitle = 'Edit office';
    }
    this.shared.emitCloseModal.subscribe(() => {
      this.activeModal.close();
    });

    setTimeout(() => {
      this.transformInputData();
    });
  }

  private transformInputData() {
    const data = {
      name: 'upper',
      email: 'lower',
      address_unit: 'upper',
    };

    this.shared.handleInputValues(this.officeForm, data);
  }

  createForm() {
    this.officeForm = this.formBuilder.group({
      id: uuidv4(),
      phone: [null],
      email: [
        '',
        [Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)],
      ],
      address: ['', Validators.required],
      address_unit: [''],
      note: [''],
    });
  }

  setForm() {
    this.loaded = true;
    const formData = this.shared.getItemById(this.inputData.company.doc.offices, this.inputData.id);
    this.officeForm.patchValue({
      id: formData.id,
      phone: formData.phone,
      email: formData.email,
      address: formData.address.address,
      address_unit: formData.address_unit,
      note: formData.note !== null ? formData.note.replace(/<\/?[^>]+(>|$)/g, '') : '',
    });

    this.address = formData.address;
    if (this.address.address !== '') {
      this.isValidAddress = true;
    }

    if (formData.note && formData.note.length > 0) {
      this.showNote = true;
      this.handleHeight(formData.note);
    }
    this.shared.touchFormFields(this.officeForm);
  }

  handleHeight(val: string) {
    const lines = val.split(/\r|\r\n|\n/);
    const count = lines.length;
    this.textRows = count >= 4 ? 4 : count;
  }

  updateOffice() {
    if (!this.shared.markInvalid(this.officeForm)) {
      return false;
    }

    if (this.isValidAddress == false) {
      this.notification.warning('Address needs to be valid.', 'Warning:');
      this.addressInput.nativeElement.focus();
      return;
    }

    const office = this.officeForm.value;
    office.address = this.address;

    const { category } = this.inputData.company;
    if (this.inputData.id !== -1) {
      if (category == 'company') {
        // EDIT COMPANY OFFICE /////////////////////////////////////////////////
        const index = this.inputData.company.doc.offices.findIndex(
          (i) => i.id === this.inputData.id
        );
        this.inputData.company.doc.offices[index] = office;
        const saveData = this.inputData.company;
        this.shared.saveCompany(saveData);
        this.sharedService.emitTab.emit(0);
        ////////////////////////////////////////////////////////////////////////
      } else {
        // EDIT DIVISION OFFICE ////////////////////////////////////////////////
        const index = this.inputData.company.doc.offices.findIndex(
          (i) => i.id === this.inputData.id
        );
        this.inputData.company.doc.offices[index] = office;
        const saveData = this.inputData.company;
        this.shared.saveDivisionCompany(saveData, this.inputData.company.id);
        this.sharedService.emitTab.emit(1);
        ////////////////////////////////////////////////////////////////////////
      }
    } else {
      if (category == 'company') {
        // NEW COMPANY OFFICE //////////////////////////////////////////////////
        this.inputData.company.doc.offices.push(office);
        const saveData = this.inputData.company;
        this.shared.saveCompany(saveData);
        this.sharedService.emitTab.emit(0);
        ////////////////////////////////////////////////////////////////////////
      } else if (category == 'division') {
        // NEW DIVISION OFFICE /////////////////////////////////////////////////
        this.inputData.company.doc.offices.push(office);
        const saveData = this.inputData.company;
        this.shared.saveDivisionCompany(saveData, this.inputData.company.id);
        this.sharedService.emitTab.emit(1);
        ////////////////////////////////////////////////////////////////////////
      }
    }
  }

  public handleAddressChange(address: any) {
    this.isValidAddress = true;
    this.address = this.shared.selectAddress(this.officeForm, address);
  }

  addressKeyDown(event: any) {
    this.isValidAddress = false;
    this.address = null;
  }

  closeOfficeEditModal() {
    this.activeModal.close();
  }

  keyDownFunction(event: any) {
    if (event.keyCode == 13 && event.target.localName !== 'textarea') {
      this.updateOffice();
    }
  }

  openNote() {
    if (this.showNote === true) {
      this.showNote = false;
    } else {
      this.showNote = true;
      setTimeout(() => {
        this.note.nativeElement.focus();
      }, 250);
    }
  }
  onPaste(event: any, inputID: string, limitCarakters?: number, index?: number) {
    event.preventDefault();
    (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
      event.clipboardData.getData('Text'),
      this.fomratType,
      false
    );
  }
  
  onEmailTyping(event) {
    return emailChack(event);
  }

  onUnitTyping(event) {
    let k;
    k = event.charCode;
    console.log(k);
    return (k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57);
  }

  ngOnDestroy() {
    this.subscription.forEach((subscription) => subscription.unsubscribe());
  }

  manageInputValidation(formElement: any) {
    return this.shared.manageInputValidation(formElement);
  }
}
