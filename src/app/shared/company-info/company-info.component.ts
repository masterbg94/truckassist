import { takeUntil } from 'rxjs/operators';
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  // ChangeDetectionStrategy,
  // ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { SharedService } from 'src/app/core/services/shared.service';
import * as AppConst from './../../const';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppBankAddComponent } from '../../shared/app-bank/app-bank-add/app-bank-add.component';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { AppSharedService } from 'src/app/core/services/app-shared.service';
import { ImageCropperComponent } from 'src/app/core/image-cropper/image-cropper.component';
import { NotificationService } from 'src/app/services/notification-service.service';
import { BankData } from 'src/app/core/model/driver';
import { Address } from 'src/app/core/model/address';
import { emailChack, pasteCheck } from 'src/assets/utils/methods-global';
import { MetaDataService } from 'src/app/core/services/metadata.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Options } from '@angular-slider/ngx-slider';
import { ManageCompany } from 'src/app/core/model/company';
import { ClonerService } from 'src/app/core/services/cloner-service';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyInfoComponent implements OnInit {
  @ViewChild('note') note: ElementRef;
  @ViewChild('addressInput') addressInput: ElementRef;
  @Input() inputData: any;
  companyForm: FormGroup;
  modalTitle;
  private destroy$: Subject<void> = new Subject<void>();
  bankInfoRequired: boolean;
  showNote = false;
  options = {
    componentRestrictions: { country: ['US', 'CA'] },
  };
  bankData: BankData[];
  textRows = 1;
  timeZones = AppConst.TIME_ZONES;
  currencies = AppConst.CURRENCIES;
  payPeriods = AppConst.PAY_PERIODS;
  days = AppConst.DAYS;
  address: Address;
  isValidAddress = false;

  showUploadZone = false;
  editLogoActive = false;
  invoicing: true;
  avatarError = false;
  selectedTab = 1;
  textTest = 'Enable auto invoicing';
  public fomratType = /^[!^()_\\[\]{};':"\\|<>\/?]*$/;
  public numOfSpaces = 0;

  newBank = '';
  newBankVisible = false;
  logoUrl = 'assets/img/logo-placeholder.svg';

  paymentTypes = [
    {
      id: 'mile',
      name: 'Per mile',
    },
    {
      id: 'commission',
      name: 'Commission',
    },
  ];

  driverSliderOptions: Options = {
    floor: 10,
    ceil: 50,
    step: 1,
  };

  sliderOptions: Options = {
    floor: 2,
    ceil: 25,
    step: 1,
  };

  bankSearchItems = 0;

  companyTabs = [
    {
      id: 1,
      name: 'Basic'
    },
    {
      id: 2,
      name: 'Additional'
    },
    {
      id: 3,
      name: 'Pay'
    }
  ];

  divisionTabs = [
    {
      id: 1,
      name: 'Basic'
    },
    {
      id: 2,
      name: 'Additional'
    }
  ];

  loaded = false;

  constructor(
    private spinner: SpinnerService,
    private sharedService: AppSharedService,
    private shared: SharedService,
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,
    private metaDataService: MetaDataService,
    private customModalService: CustomModalService,
    private notification: NotificationService, // private cd: ChangeDetectorRef
    private clonerService: ClonerService,
    private changeRef: ChangeDetectorRef
  ) {
    // this.cd.detach();
  }

  ngOnInit(): void {
    this.createForm();
    this.getBanks(false);

    /*
    if (!this.inputData.company.doc.additional.avatar.src) {
      this.editLogoActive = true;
    }
    */
  }

  createForm() {
    if (!this.inputData.createNew) {
      this.loaded = true;
      if (this.inputData.company.category === 'company') {
        this.createCompanyForm();
      } else {
        this.createDivisionCompanyForm();
      }

      if (this.inputData.company.doc?.additional.address?.address) {
        this.isValidAddress = true;
      }
      this.address = this.inputData.company.doc?.additional?.address;
      this.shared.touchFormFields(this.companyForm);

      if (
        this.inputData.company?.doc?.additional?.note &&
        this.inputData.company.doc.additional.note.length > 0
      ) {
        this.showNote = true;
        this.handleHeight(this.inputData.company.doc.additional.note);
      }
    } else {
      this.createDivisionCompanyForm();
    }

    setTimeout(() => {
      this.transformInputData();
    });

    if (this.inputData.company !== null) {
      if (this.inputData.company.doc.additional.bankData !== null) {
        this.requiredBankInfo(true);
      } else {
        this.requiredBankInfo(false);
      }
    } else {
      this.requiredBankInfo(false);
    }
  }

  private createCompanyForm() {
    // initialisation for company
    this.modalTitle = 'Company Info';
    this.companyForm = this.formBuilder.group({
      name: ['', Validators.required],
      taxNumber: [
        {
          value: '',
          disabled: !this.inputData.createNew && this.inputData.company?.taxNumber?.length > 0,
        },
        Validators.required,
      ],
      mcNumber: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(8)]],
      usDotNumber: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(8)]],
      phone: null,
      payPeriod: null,
      endingIn: null,
      paymentType: [null],
      emptyMiles: [null],
      loadedMiles: [null],
      commission: [2],
      commissionDriver: [10],
      email: '',
      address: '',
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
    this.populateCompanyForm();
  }

  private createDivisionCompanyForm() {
    this.loaded = true;
    this.modalTitle = 'Division Company Info';
    this.companyForm = this.formBuilder.group({
      name: ['', Validators.required],
      taxNumber: [
        {
          value: '',
          // disabled: !this.inputData.createNew && this.inputData.company?.taxNumber?.length > 0,
        },
        Validators.required,
      ],
      mcNumber: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(8)]],
      usDotNumber: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(8)]],
      phone: null,
      payPeriod: null,
      email: '',
      address: '',
      address_unit: '',
      irpNumber: [null, Validators.maxLength(10)],
      iftaNumber: [null, Validators.maxLength(14)],
      scacNumber: [null, Validators.maxLength(6)],
      ipassEzpass: [null, Validators.maxLength(11)],
      webUrl: '',
      fax: null,
      note: '',
      bank: null,
      accountNumber: [null, [Validators.minLength(4), Validators.maxLength(17)]],
      routingNumber: null,
      phoneDispatch: null,
      emailDispatch: '',
      phoneAccounting: null,
      emailAccounting: '',
      phoneSafety: null,
      emailSafety: '',
    });
    this.populateDivisionCompanyForm();
  }

  private populateCompanyForm() {
    // edit company form
    if (!this.inputData.createNew) {
      // console.log(this.inputData.company.doc.additional.paymentType.id);
      /* console.log(this.inputData.doc.additional); */
      this.companyForm.setValue({
        name:
          this.inputData && this.inputData.company && this.inputData.company.name
            ? this.inputData.company.name
            : '',
        taxNumber:
          this.inputData && this.inputData.company && this.inputData.company.taxNumber
            ? this.inputData.company.taxNumber
            : '',
        mcNumber:
          this.inputData &&
          this.inputData.company.doc.additional &&
          this.inputData.company.doc.additional.mcNumber
            ? this.inputData.company.doc.additional.mcNumber
            : '',
        usDotNumber:
          this.inputData &&
          this.inputData.company.doc.additional &&
          this.inputData.company.doc.additional.usDotNumber
            ? this.inputData.company.doc.additional.usDotNumber
            : '',
        phone:
          this.inputData &&
          this.inputData.company.doc.additional &&
          this.inputData.company.doc.additional.phone
            ? this.inputData.company.doc.additional.phone
            : '',
        payPeriod:
          this.inputData &&
          this.inputData.company.doc.additional &&
          this.inputData.company.doc.additional.payPeriod
            ? this.inputData.company.doc.additional.payPeriod
            : '',
        endingIn:
          this.inputData &&
          this.inputData.company.doc.additional &&
          this.inputData.company.doc.additional.endingIn
            ? this.inputData.company.doc.additional.endingIn
            : '',
        paymentType:
          this.inputData &&
          this.inputData.company.doc.additional &&
          this.inputData.company.doc.additional.paymentType
            ? this.inputData.company.doc.additional.paymentType
            : '',
        emptyMiles:
          this.inputData &&
          this.inputData.company.doc.additional &&
          this.inputData.company.doc.additional.emptyMiles
            ? this.inputData.company.doc.additional.emptyMiles
            : '',
        loadedMiles:
          this.inputData &&
          this.inputData.company.doc.additional &&
          this.inputData.company.doc.additional.loadedMiles
            ? this.inputData.company.doc.additional.loadedMiles
            : '',
        commission:
          this.inputData &&
          this.inputData.company.doc.additional &&
          this.inputData.company.doc.additional.commission
            ? this.inputData.company.doc.additional.commission
            : '',
        commissionDriver:
          this.inputData &&
          this.inputData.company.doc.additional &&
          this.inputData.company.doc.additional.commissionDriver
            ? this.inputData.company.doc.additional.commissionDriver
            : '',

        invoicing:
          this.inputData &&
          this.inputData.company.doc.additional &&
          this.inputData.company.doc.additional.invoicing
            ? this.inputData.company.doc.additional.invoicing
            : '',
        avatar:
          this.inputData &&
          this.inputData.company.doc.additional &&
          this.inputData.company.doc.additional.avatar
            ? this.inputData.company.doc.additional.avatar
            : '',

        email:
          this.inputData &&
          this.inputData.company.doc.additional &&
          this.inputData.company.doc.additional.email
            ? this.inputData.company.doc.additional.email
            : '',
        address:
          this.inputData.company.doc.additional.address !== undefined
            ? this.inputData.company.doc.additional.address.address
            : null,
        address_unit: this.inputData.company.doc.additional.addressUnit,
        irpNumber: this.inputData.company.doc.additional.irpNumber,
        iftaNumber: this.inputData.company.doc.additional.iftaNumber,
        scacNumber: this.inputData.company.doc.additional.scacNumber,
        ipassEzpass: this.inputData.company.doc.additional.ipassEzpass,
        timeZone: this.inputData.company.doc?.additional?.timeZone
          ? this.inputData.company.doc?.additional?.timeZone
          : '',
        webUrl: this.inputData.company.doc.additional.webUrl,
        fax: this.inputData.company.doc.additional.fax,
        note: this.inputData.company.doc.additional.note !== null ? this.inputData.company.doc.additional.note.replace(/<\/?[^>]+(>|$)/g, '') : '',
        bank: this.inputData.company.doc.additional.bankData,
        accountNumber: this.inputData.company.doc.additional.accountNumber,
        routingNumber: this.inputData.company.doc.additional.routingNumber,
        currency: this.inputData.company.doc.additional.currency,
        phoneDispatch: this.inputData.company.doc.additional.phoneDispatch,
        emailDispatch: this.inputData.company.doc.additional.emailDispatch,
        phoneAccounting: this.inputData.company.doc.additional.phoneAccounting,
        emailAccounting: this.inputData.company.doc.additional.emailAccounting,
        phoneSafety: this.inputData.company.doc.additional.phoneSafety,
        emailSafety: this.inputData.company.doc.additional.emailSafety,
        startLoadNumber: this.inputData.company.startLoadNumber,
      });
    }
  }

  private populateDivisionCompanyForm() {
    // edit division company form
    if (!this.inputData.createNew) {
      this.companyForm.setValue({
        name:
          this.inputData && this.inputData.company && this.inputData.company.name
            ? this.inputData.company.name
            : '',
        taxNumber:
          this.inputData && this.inputData.company && this.inputData.company.taxNumber
            ? this.inputData.company.taxNumber
            : '',
        mcNumber:
          this.inputData &&
          this.inputData.company.doc.additional &&
          this.inputData.company.doc.additional.mcNumber
            ? this.inputData.company.doc.additional.mcNumber
            : '',
        payPeriod:
          this.inputData &&
          this.inputData.company.doc.additional &&
          this.inputData.company.doc.additional.payPeriod
            ? this.inputData.company.doc.additional.payPeriod
            : '',
        usDotNumber:
          this.inputData &&
          this.inputData.company.doc.additional &&
          this.inputData.company.doc.additional.usDotNumber
            ? this.inputData.company.doc.additional.usDotNumber
            : '',
        phone:
          this.inputData &&
          this.inputData.company.doc.additional &&
          this.inputData.company.doc.additional.phone
            ? this.inputData.company.doc.additional.phone
            : '',
        email:
          this.inputData &&
          this.inputData.company.doc.additional &&
          this.inputData.company.doc.additional.email
            ? this.inputData.company.doc.additional.email
            : '',
        address:
          this.inputData.company.doc.additional.address !== undefined
            ? this.inputData.company.doc.additional.address.address
            : null,
        address_unit: this.inputData.company.doc.additional.addressUnit,
        irpNumber: this.inputData.company.doc.additional.irpNumber,
        iftaNumber: this.inputData.company.doc.additional.iftaNumber,
        scacNumber: this.inputData.company.doc.additional.scacNumber,
        ipassEzpass: this.inputData.company.doc.additional.ipassEzpass,
        webUrl: this.inputData.company.doc.additional.webUrl,
        fax: this.inputData.company.doc.additional.fax,
        note: this.inputData.company.doc.additional.note !== null ? this.inputData.company.doc.additional.note.replace(/<\/?[^>]+(>|$)/g, '') : '',
        bank: this.inputData.company.doc.additional.bankData,
        accountNumber: this.inputData.company.doc.additional.accountNumber,
        routingNumber: this.inputData.company.doc.additional.routingNumber,
        phoneDispatch: this.inputData.company.doc.additional.phoneDispatch,
        emailDispatch: this.inputData.company.doc.additional.emailDispatch,
        phoneAccounting: this.inputData.company.doc.additional.phoneAccounting,
        emailAccounting: this.inputData.company.doc.additional.emailAccounting,
        phoneSafety: this.inputData.company.doc.additional.phoneSafety,
        emailSafety: this.inputData.company.doc.additional.emailSafety,
      });
    } else {
      this.modalTitle = 'New Division Company';
    }
  }

  private transformInputData() {
    const data = {
      name: 'upper',
      email: 'lower',
      webUrl: 'lower',
      emailDispatch: 'lower',
      emailSafety: 'lower',
      emailAccounting: 'lower',
      address_unit: 'upper',
    };

    this.shared.handleInputValues(this.companyForm, data);
  }

  openBankModal() {
    this.customModalService.openModal(AppBankAddComponent);
  }

  handleHeight(val: string) {
    const lines = val.split(/\r|\r\n|\n/);
    const count = lines.length;
    this.textRows = count >= 4 ? 4 : count;
  }

  onBankChange(event: any) {
    this.requiredBankInfo(event !== undefined ? true : false);
    if (event !== undefined && event.id == 0) {
      this.companyForm.controls.bank.reset();
      this.newBankVisible = true;
      setTimeout(() => {
        document.getElementById('newBank').focus();
      }, 250);
    }
  }

  requiredBankInfo(state: boolean) {
    if (state) {
      this.companyForm.controls.accountNumber.enable();
      this.companyForm.controls.routingNumber.enable();
      this.companyForm.controls.accountNumber.setValidators(Validators.required);
      this.companyForm.controls.routingNumber.setValidators(Validators.required);
      this.bankInfoRequired = true;
    } else {
      this.companyForm.controls.accountNumber.reset();
      this.companyForm.controls.routingNumber.reset();
      this.companyForm.controls.accountNumber.disable();
      this.companyForm.controls.routingNumber.disable();
      this.companyForm.controls.accountNumber.clearValidators();
      this.companyForm.controls.routingNumber.clearValidators();
      this.bankInfoRequired = false;
    }
    this.companyForm.controls.routingNumber.updateValueAndValidity();
    this.companyForm.controls.accountNumber.updateValueAndValidity();
  }

  public handleAddressChange(address: any) {
    this.isValidAddress = true;
    this.address = this.shared.selectAddress(this.companyForm, address);
  }

  addressKeyDown(event: any) {
    this.isValidAddress = false;
    this.address = null;
  }

  updateGeneralInfo(callType?: string) {
    if (!this.shared.markInvalid(this.companyForm)) {
      return false;
    }

    if (!this.isValidAddress) {
      this.notification.warning('Address needs to be valid.', 'Warning:');
      this.addressInput.nativeElement.focus();
      return;
    }

    const data = this.companyForm.getRawValue();
    // alert(this.inputData.company.doc.additional.invoicing);
    // const invoicing = this.invoicing;
    const saveData = {
      id: !this.inputData.createNew ? this.inputData.company.id : null,
      name: data.name,
      parentId: !this.inputData.createNew
        ? this.inputData.company.parentId
        : this.inputData.company.id,
      category: !this.inputData.createNew ? this.inputData.company.category : 'division',
      startLoadNumber:
        this.inputData.company.category === 'company' ? data.startLoadNumber : undefined,
      taxNumber: data.taxNumber,
      doc: {
        additional: {
          mcNumber: data.mcNumber,
          usDotNumber: data.usDotNumber,
          phone: data.phone,
          payPeriod: data.payPeriod,
          endingIn: data.endingIn,
          paymentType: data.paymentType,
          emptyMiles: data.emptyMiles,
          loadedMiles: data.loadedMiles,
          commission: data.commission,
          commissionDriver: data.commissionDriver,
          email: data.email,
          address: this.address,
          addressUnit: data.address_unit,
          irpNumber: data.irpNumber,
          iftaNumber: data.iftaNumber,
          scacNumber: data.scacNumber,
          ipassEzpass: data.ipassEzpass,
          fax: data.fax,
          timeZone: data.timeZone,
          webUrl: data.webUrl,
          currency: data.currency,
          note: data.note,
          accountNumber: data.accountNumber,
          routingNumber: data.routingNumber,
          bankData: data.bank,
          phoneDispatch: data.phoneDispatch,
          emailDispatch: data.emailDispatch,
          phoneAccounting: data.phoneAccounting,
          emailAccounting: data.emailAccounting,
          phoneSafety: data.phoneSafety,
          emailSafety: data.emailSafety,
          invoicing: this.inputData.company.doc.additional.invoicing,
          avatar: this.inputData.company.doc.additional.avatar,
        },
        offices:
          !this.inputData.createNew &&
          this.inputData.company?.doc?.offices &&
          this.inputData.company.doc?.offices.length > 0
            ? this.inputData.company.doc?.offices
            : [],
        factoringCompany:
          !this.inputData.createNew &&
          this.inputData.company?.doc?.factoringCompany &&
          this.inputData.company.doc?.factoringCompany.length > 0
            ? this.inputData.company.doc?.factoringCompany
            : [],
      },
    };

    if (this.inputData.createNew) {
      this.spinner.show(true);
      this.sharedService.createCompany(saveData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result: any) => {
          this.spinner.show(false);
          this.notification.success('Division company created!', 'Success:');
          this.activeModal.close();
          this.sharedService.emitTab.emit(1);
        },
        (error: any) => {
          this.shared.handleServerError();
        }
      );
    } else {
      if (callType) {this.spinner.show(false); }
      if (this.inputData.company.category === 'company') {
        this.sharedService.updateCompany(saveData, this.inputData.company.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (result: any) => {
            localStorage.setItem('userCompany', JSON.stringify(result));
            this.spinner.show(false);
            // this.inputData.company.doc.additional.avatar = result.doc.additional.avatar;
            // this.notification.success(`Company ${saveData.name} updated!`, 'Success:');
            if (!callType) {
              this.notification.success(`Company ${saveData.name} updated!`, 'Success:');
            }
            if (!callType) {
              this.activeModal.close();
            } else if (callType === 'delete') {
              this.populateCompanyForm();
              this.editLogoActive = true;
              this.notification.success(`${saveData.name}'s avatar deleted`, 'Success:');
            } else {
              this.populateCompanyForm();
              this.editLogoActive = false;
              if (this.avatarError) {
                this.notification.success(` yoyoyoyo`, 'Success:');
              } else {
                this.notification.success(`${saveData.name}'s avatar updated`, 'Success:');
              }
            }
            this.sharedService.emitTab.emit(0);
          },
          (error: any) => {
            this.shared.handleServerError();
          }
        );
      } else if (this.inputData.company.category === 'division') {
        this.sharedService.updateCompany(saveData, this.inputData.company.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (result: any) => {
            this.spinner.show(false);
            this.notification.success(`Company ${saveData.name} updated!`, 'Success:');
            this.activeModal.close();
            this.sharedService.emitTab.emit(0);
          },
          (error: any) => {
            this.shared.handleServerError();
          }
        );
      }
    }
  }
  updatePaymentType() {}

  keyDownFunction(event: any) {
    if (
      event.keyCode === 13 &&
      event.target.localName !== 'textarea' &&
      event.path !== undefined &&
      event.path !== null &&
      event.path[3].className !== 'ng-select-container ng-has-value'
    ) {
      this.updateGeneralInfo();
    }
  }

  editSmallLogo() {
    this.customModalService.openModal(
      ImageCropperComponent,
      { type: AppConst.COMPANY_SMALL_LOGO },
      'upload-image-modal'
    );
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
          this.companyForm.controls.bank.setValue(result[result.length - 1]);
        }
      },
      (error: HttpErrorResponse) => {
        this.shared.handleError(error);
      }
    );
  }

  editLargeLogo() {
    this.customModalService.openModal(ImageCropperComponent, { type: AppConst.COMPANY_LARGE_LOGO });
  }

  openNote() {
    this.showNote = !this.showNote;
    if (this.showNote) {
      setTimeout(() => {
        this.note.nativeElement.focus();
      }, 250);
    }
  }

  tabChange(event: any) {
    this.selectedTab = event.id;
  }

  closeModal() {
    this.activeModal.close();
  }

  onPaste(event: any, inputID: string, limitCarakters?: number, index?: number) {
    // event.preventDefault();
    // if (
    //   inputID === 'email' ||
    //   inputID === 'emailDispatch' ||
    //   inputID === 'emailAccounting' ||
    //   inputID === 'emailSafety'
    // ) {
    //   alert('yo mail');
    //   this.fomratType = /^[!#$%^&*`()_+\-=\[\]{};':"\\|,<>\/?]*$/;
    //   (<HTMLInputElement>document.getElementById(inputID)).value += pasteCheck(
    //     event.clipboardData.getData('Text'),
    //     this.fomratType,
    //     false
    //   );
    // } else if (inputID === 'mcNumber' || inputID === 'usDotNumber' || inputID === 'accountNumber') {
    //   alert('yo number');
    //   this.fomratType = /^[!@#$%`^&*()_+\-=\[\]{};':"\\|,.<>\/?A-Za-z]*$/;
    //   (<HTMLInputElement>document.getElementById(inputID)).value += pasteCheck(
    //     event.clipboardData.getData('Text'),
    //     this.fomratType,
    //     false,
    //     false,
    //     false,
    //     limitCarakters
    //   );
    // } else {
    //   alert('yo');
    //   (<HTMLInputElement>document.getElementById(inputID)).value += pasteCheck(
    //     event.clipboardData.getData('Text'),
    //     this.fomratType,
    //     true
    //   );
    // }
  }

  onEmailTyping(event) {
    return emailChack(event);
  }

  onNameTyping(event) {
    let k;
    k = event.charCode;
    if (k === 32) {
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

  saveNewBank() {
    const data = {
      domain: 'bank',
      key: 'name',
      value: this.newBank,
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
      this.companyForm.controls.bank.reset();
    });
  }

  saveLogo(event: any) {}

  cancelLogo(event: any) {}

  public callSaveAvatar(event: any) {
    const newAvatar = event;

    // const saveData: any = this.clonerService.deepClone<any>(this.inputData.company);
    // saveData.doc.additional.avatar = {
    //   id: uuidv4(),
    //   src: newAvatar,
    // };
    this.inputData.company.doc.additional.avatar = {
      id: uuidv4(),
      src: newAvatar,
    };
    this.showUploadZone = false;
    // this.changeRef.detectChanges();
    this.updateGeneralInfo('saveImg');
  }

  // deleteLogo(event: any) {
  //   const newAvatar = event;
  //   this.inputData.company.doc.additional.avatar = {
  //     id: uuidv4(),
  //     src: null,
  //   };
  //   this.inputData.company.doc.additional.avatar = null;
  //   this.editLogoActive = true;

  //   this.updateGeneralInfo(true);
  // }

  public callCancel(event: any) {
    this.editLogoActive = true;
  }

  editLogo(): void {
    this.editLogoActive = true;
  }

  deleteLogo() {
    // this.editLogoActive = true;
    // this.inputData.company.doc.additional.avatar = null;
    this.inputData.company.doc.additional.avatar.id = null;
    this.inputData.company.doc.additional.avatar.src = null;
    this.companyForm.controls.avatar.value.src = null;
    this.companyForm.controls.avatar.setValue(null);
    this.updateGeneralInfo('delete');
    this.editLogoActive = true;
  }

  invoicingAuto(event) {
    this.inputData.company.doc.additional.invoicing = !this.inputData.company.doc.additional
      .invoicing;

    // alert(this.inputData.company.doc.additional.invoicing);
  }
  
  changePaymentType(event) {
    // alert(this.inputData.company.doc.additional.paymentType.id);
    this.inputData.company.doc.additional.paymentType.id = event.id;
    // alert(event.id);
    console.log('changePaymentType: ', event);
  }

  formatLabel(value: number) {
    if (value >= 2) {
      return value + '%';
    }
  }

  onUnitTyping(event) {
    let k;
    k = event.charCode;
    console.log(k);
    return (k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57);
  }

  customSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return ((item.bankName.toLocaleLowerCase().indexOf(term) > -1) || (item.id === 0));
  }

  manageInputValidation(formElement: any) {
    return this.shared.manageInputValidation(formElement);
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
