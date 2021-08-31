import { takeUntil } from 'rxjs/operators';
import { WysiwygService } from './../../core/services/app-wysiwyg.service';
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification-service.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { Subject, Subscription } from 'rxjs';
import { SharedService } from 'src/app/core/services/shared.service';
import { AppSharedService } from 'src/app/core/services/app-shared.service';
import { Address } from 'src/app/core/model/address';
import { v4 as uuidv4 } from 'uuid';
import { emailChack, pasteCheck } from 'src/assets/utils/methods-global';
import { Wysiwig } from '../../core/model/wysiwig';
import { CustomWysiwygEditorComponent } from '../custom-wysiwyg-editor/custom-wysiwyg-editor.component';

@Component({
  selector: 'app-app-company-factoring-edit',
  templateUrl: './app-company-factoring-edit.component.html',
  styleUrls: ['./app-company-factoring-edit.component.scss'],
})
export class AppCompanyFactoringEditComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(
    private formBuilder: FormBuilder,
    private sharedService: AppSharedService,
    private spinner: SpinnerService,
    private shared: SharedService,
    private activeModal: NgbActiveModal,
    private notification: NotificationService,
    private wysywygservice: WysiwygService,
  ) {
    this.createForm();
  }
  @ViewChild('note') note: ElementRef;
  @ViewChild('addressInput') addressInput: ElementRef;
  @ViewChild('editContainer') editContainer: ElementRef;
  @ViewChild(CustomWysiwygEditorComponent) cystomWysywygEditor: CustomWysiwygEditorComponent;
  @Input() inputData: any;
  factoringForm: FormGroup;
  // zipCodes = [];
  factoring: any;
  modalTitle: string;
  private destroy$: Subject<void> = new Subject<void>();
  newItem = false;
  options = {
    componentRestrictions: { country: ['US', 'CA'] },
  };
  textRows = 1;
  noticeValue: any = '';

  showNote = false;
  isValidAddress = false;
  address: Address;
  loaded = false;

  private closeSubscription: Subscription;
  selectedEditor: HTMLAnchorElement;
  range: any;

  wysiwigSettings: Wysiwig = {
    fontFamily: true,
    fontSize: true,
    colorPicker: true,
    textTransform: true,
    textAligment: true,
    textIndent: false,
    textLists: false
  };

  public fomratType = /^[!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]*$/;

  public numOfSpaces = 0;

  ngOnInit() {
    this.newItem = this.inputData.id == -1 ? true : false;
    this.modalTitle = this.newItem ? 'New factoring company' : 'Edit factoring company';
    if (!this.newItem) {
      this.setForm();
      this.loaded = true;
    }
    this.closeSubscription = this.shared.emitCloseModal
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      this.activeModal.close();
    });

    setTimeout(() => {
      this.transformInputData();
    });

    this.wysywygservice.updateField
    .pipe(takeUntil(this.destroy$))
    .subscribe(res => {
      const wisywygData = this.editContainer.nativeElement.innerHTML;
      this.factoringForm.patchValue({
        notice: wisywygData
      });
    });

    document.body.classList.add('factoring-modal');
  }

  ngAfterViewInit(): void {
    // const fontSizeText = (document.getElementsByClassName('k-input')[0].innerHTML =
    //   '&nbspFont size');
    // const fontFamilyText = (document.getElementsByClassName('k-input')[1].innerHTML =
    //   '&nbspFont family');
  }

  setForm() {
    this.loaded = true;
    const formData = this.shared.getItemById(
      this.inputData.company.doc.factoringCompany,
      this.inputData.id
    );
    this.factoringForm.patchValue({
      id: formData.id,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address.address,
      address_unit: formData.address_unit,
      note: formData.note !== null ? formData.note.replace(/<\/?[^>]+(>|$)/g, '') : '',
      notice: formData.notice,
    });

    this.noticeValue = formData.notice ? formData.notice : '';
    this.address = formData.address;
    if (formData.address.address !== '') {
      this.isValidAddress = true;
    }
    if (formData.note && formData.note.length > 0) {
      this.showNote = true;
      this.handleHeight(formData.note);
    }
    this.shared.touchFormFields(this.factoringForm);
  }

  createForm() {
    this.factoringForm = this.formBuilder.group({
      id: uuidv4(),
      name: ['', Validators.required],
      phone: [null, Validators.required],
      email: [
        '',
        [Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)],
      ],
      address: [''],
      address_unit: '',
      notice: [''],
      note: [''],
    });
  }

  public handleAddressChange(address: any) {
    this.isValidAddress = true;
    this.address = this.shared.selectAddress(this.factoringForm, address);
  }

  addressKeyDown(event: any) {
    this.isValidAddress = false;
    this.address = null;
  }

  updateFactoring() {
    if (!this.shared.markInvalid(this.factoringForm)) {
      return false;
    }

    if (this.isValidAddress == false) {
      this.notification.warning('Address needs to be valid.', 'Warning:');
      this.addressInput.nativeElement.focus();
      return;
    }

    const factoring = this.factoringForm.value;
    factoring.address = this.address;

    if (this.inputData.id !== -1) {
      if (this.inputData.company.category === 'company') {
        // EDIT COMPANY FACTORING //////////////////////////////////////////////
        const index = this.inputData.company.doc.factoringCompany.findIndex(
          (i) => i.id === this.inputData.id
        );
        this.inputData.company.doc.factoringCompany[index] = factoring;
        const saveData = this.inputData.company;
        this.shared.saveCompany(saveData);
        this.sharedService.emitTab.emit(0);
        ////////////////////////////////////////////////////////////////////////
      } else {
        // EDIT DIVISION FACTORING ////////////////////////////////////////////////
        const index = this.inputData.company.doc.factoringCompany.findIndex(
          (i) => i.id === this.inputData.id
        );
        this.inputData.company.doc.factoringCompany[index] = factoring;
        const saveData = this.inputData.company;
        this.shared.saveDivisionCompany(saveData, this.inputData.company.id);
        this.sharedService.emitTab.emit(1);
        ////////////////////////////////////////////////////////////////////////
      }
    } else {
      if (this.inputData.company.category === 'company') {
        // NEW COMPANY FACTORING ///////////////////////////////////////////////
        this.inputData.company.doc.factoringCompany.push(factoring);
        const saveData = this.inputData.company;
        this.shared.saveCompany(saveData);
        this.sharedService.emitTab.emit(0);
        ////////////////////////////////////////////////////////////////////////
      } else if (this.inputData.company.category === 'division') {
        // NEW DIVISION FACTORING //////////////////////////////////////////////
        this.inputData.company.doc.factoringCompany.push(factoring);
        const saveData = this.inputData.company;
        this.shared.saveDivisionCompany(saveData, this.inputData.company.id);
        this.sharedService.emitTab.emit(1);
        ////////////////////////////////////////////////////////////////////////
      }
    }
  }

  // getZip(event: any) {
  //   if (event.term && event.term.length >= 3) {
  //     // this.sharedService.getZipCodesList(event.term)
  //        .pipe(takeUntil(this.destroy$))
  //        .subscribe(
  //     //   (result: any) => {
  //     //     this.zipCodes = result.data;
  //     //   },
  //     //   (error: any) => {
  //     //     this.shared.handleServerError();
  //     //   }
  //     // );
  //   } else {
  //     this.zipCodes = [];
  //   }
  // }

  // clearList(event: any) {
  //   if (!event) {
  //     this.zipCodes = [];
  //   }
  // }

  closeFactoringEditModal() {
    this.activeModal.close();
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

  handleHeight(val: string) {
    const lines = val.split(/\r|\r\n|\n/);
    const count = lines.length;
    this.textRows = count >= 4 ? 4 : count;
  }

  keyDownFunction(event: any) {
    if (event.keyCode == 13 && event.target.localName !== 'textarea' && !event.target.contentEditable) {
      this.updateFactoring();
    }
  }

  private transformInputData() {
    const data = {
      name: 'upper',
      email: 'lower',
      address_unit: 'upper',
    };

    this.shared.handleInputValues(this.factoringForm, data);
  }
  onPaste(event: any, inputID: string, limitCarakters?: number, index?: number) {
    event.preventDefault();
    if ((inputID = 'name')) {
      this.fomratType = /^[!@#$%^&*()_+\=\[\]{};':"\\|<>\/?]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.fomratType,
        true,
        true,
        true
      );
    } else {
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.fomratType,
        false
      );
    }
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
        (k > 96 && k < 121) ||
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.closeSubscription.unsubscribe();
    document.body.classList.remove('factoring-modal');
  }

  manageInputValidation(formElement: any) {
    return this.shared.manageInputValidation(formElement);
  }

  updateNoteMain(e): void {
    this.cystomWysywygEditor.checkActiveItems();
    this.factoringForm.patchValue({
      notice: e.target.innerHTML,
    });
  }

  focusElement(e): void {
    setTimeout(() => {
      this.cystomWysywygEditor.checkActiveItems();
    }, 100);
    this.selectedEditor = e.target;
  }

  clickInsideContainer(): void {
    setTimeout(() => {
      this.cystomWysywygEditor.checkActiveItems();
    }, 100);
  }

  blurElement() {
    const selectionTaken = window.getSelection();
    if ( selectionTaken.rangeCount && selectionTaken.getRangeAt) {
      this.range = selectionTaken.getRangeAt(0);
    }
  }
}
