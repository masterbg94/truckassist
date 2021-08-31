import { DatePipe, formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';
import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FILE_TABLES } from 'src/app/const';
import { Address } from 'src/app/core/model/address';
import { AppDriverService } from 'src/app/core/services/app-driver.service';
import { AppTrailerService } from 'src/app/core/services/app-trailer.service';
import { AppTruckService } from 'src/app/core/services/app-truck.service';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { SafetyService } from 'src/app/core/services/safety.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { DriverManageComponent } from 'src/app/driver/driver-manage/driver-manage.component';
import { NotificationService } from 'src/app/services/notification-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-violation-manage',
  templateUrl: './violation-manage.component.html',
  styleUrls: ['./violation-manage.component.scss'],
  providers: [DatePipe],
})
export class ViolationManageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('note') note: ElementRef;
  @Input() inputData: any;
  toggle = false;
  works: any = {};
  violationForm: FormGroup;
  lang = 'en';
  private destroy$: Subject<void> = new Subject<void>();
  showNote = false;
  textRows = 1;
  modalTitle: string;
  driversData: any[];

  soleActive = true;
  selectedTab = 1;
  focusObj = [];
  public driverName: any;

  options = {
    componentRestrictions: { country: ['US', 'CA'] },
  };
  switchData: any = [
    {
      id: 'yes',
      name: 'Yes',
      checked: false,
    },
    {
      id: 'no',
      name: 'No',
      checked: false,
    },
  ];
  tabs = [
    {
      id: 1,
      name: 'Basic',
    },
    {
      id: 2,
      name: 'Additional',
    },
  ];

  address: Address = null;

  format: FormatSettings = environment.dateFormat;
  loaded = false;
  driverSearchItems = 0;
  truckSearchItems = 0;

  public fomratType: any;
  public numOfSpaces = 0;
  newVisible = false;
  violationCodeSelected = false;
  violationSearchItems = 0;
  newViolationCode = {
    id: 0,
    code: '',
    description: '',
    oos: false,
    sw: null,
    type: null,
    icon: '',
  };
  newCitation = {
    id: 0,
    citationNumber: '',
    description: '',
    cost: null,
  };
  violationSearchData = [
    {
      id: 0,
      code: 'Add New Violation',
      icon: null,
      description: null,
      type: 0,
      oos: false,
    },
    {
      id: 1,
      code: '392.2RR',
      icon: '/assets/img/svgs/table/violation-vl1.svg',
      description: 'State/Local Laws - Speeding 6-10 miles per hour over speed limitation aaaa',
      type: 1,
      oos: false,
      sw: 4,
    },
    {
      id: 2,
      code: '392.2SLLS2',
      icon: '/assets/img/svgs/table/violation-vl4.svg',
      description: 'Allowing or requiring a driver to use a hand-held motor vehicle while haaa',
      type: 2,
      oos: false,
      sw: 3,
    },
    {
      id: 3,
      code: '392.2SLLSWZ',
      icon: '/assets/img/svgs/table/violation-vl3.svg',
      description: 'Using a hand-held mobile telephone while operating Hazardus Materiaxxxxxx',
      type: 1,
      oos: false,
      sw: 10,
    },
  ];
  unitTypes = [
    {
      icon: 'assets/img/svgs/table/violation-vl1.svg',
      title: 'Unsafe Driving',
    },
    {
      icon: 'assets/img/svgs/table/violation-vl2.svg',
      title: 'Crash Indicator',
    },
    {
      icon: 'assets/img/svgs/table/violation-vl3.svg',
      title: 'Hours of Service Compliance',
    },
    {
      icon: 'assets/img/svgs/table/violation-vl4.svg',
      title: 'Vehicle Maintenance',
    },
    {
      icon: 'assets/img/svgs/table/violation-vl5.svg',
      title: 'Controlled Substances and Alcohol',
    },
    {
      icon: 'assets/img/svgs/table/violation-vl6.svg',
      title: 'Hazardous Materials Compliance',
    },
    {
      icon: 'assets/img/svgs/table/violation-vl7.svg',
      title: 'Driver Fitness',
    },
  ];
  oosClicked = false;
  newViolationCodeData;
  tempViolationData = [];
  tempCitationData = [];
  @ViewChild('ngSelectViolationCode') ngSelectViolationCode: NgSelectComponent;
  @ViewChild('typePopover') typePopover: NgbPopover;
  trailerTabData: any[];

  violationUnitData = [
    {
      id: 1,
      name: 'Driver',
    },
    {
      id: 2,
      name: 'Truck',
    },
    {
      id: 3,
      name: 'Trailer',
    },
  ];
  specialChecks = [
    {
      id: 1,
      name: 'Alc/Cont. Sub. Check',
      check: false,
    },
    {
      id: 2,
      name: 'Cond. by Local Juris.',
      check: false,
    },
    {
      id: 3,
      name: 'Size & Weight Enf.',
      check: false,
    },
    {
      id: 4,
      name: 'eScreen Inspection',
      check: false,
    },
    {
      id: 5,
      name: 'Traffic Enforcement',
      check: false,
    },
    {
      id: 6,
      name: 'PASA Cond. Insp.',
      check: false,
    },
    {
      id: 7,
      name: 'Drug Interd. Search',
      check: false,
    },
    {
      id: 8,
      name: 'Border Enf. Insp.',
      check: false,
    },
    {
      id: 9,
      name: 'Post Crash Insp.',
      check: false,
    },
    {
      id: 10,
      name: 'PBBT Inspection',
      check: false,
    },
  ];
  severityWeightSum = 0;
  citationCostSum = 0;
  newViolationCodeUnitTypeIcon = 'assets/img/violation-danger.svg';
  violationLVL = [
    {
      id: 1,
      name: 'I - Observation',
    },
    {
      id: 2,
      name: 'II - Walk Around',
    },
    {
      id: 3,
      name: 'III - Full Inspection',
    },
  ];
  files: any = [];
  attachments: any = [];
  trucks: any;
  violationEditData: any;

  constructor(
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,
    private shared: SharedService,
    private customModalService: CustomModalService,
    private truckService: AppTruckService,
    private driverService: AppDriverService,
    private trailerService: AppTrailerService,
    private safetyService: SafetyService,
    private notification: NotificationService,
    private storageService: StorageService,
    private spinner: SpinnerService
  ) {}
  ngOnInit() {
    this.getDrivers();
    this.getTrucks();
    this.getTrailers();

    this.createForm();
    if (this.inputData.data.type === 'edit') {
      this.modalTitle = 'Edit Violation';
      this.getViolationData(this.inputData.data);
    } else if (this.inputData.data.type === 'new') {
      this.loaded = true;
      this.modalTitle = 'Add Violation';
    }

    this.shared.emitDeleteFiles.pipe(takeUntil(this.destroy$)).subscribe((files: any) => {
      if (files.success) {
        const removedFile = files.success[0];
        this.violationEditData.doc.attachments = this.violationEditData.doc.attachments.filter(
          (file: any) => file.fileItemGuid !== removedFile.guid
        );
        this.saveViolation(true);
      }
    });
  }

  getViolationData(data: any) {
    this.safetyService
      .getViolationById(data.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp: any) => {
          this.violationEditData = resp;
          this.setForm();
        },
        (error: HttpErrorResponse) => {
          this.shared.handleError(error);
        }
      );
  }

  setForm() {
    this.attachments =
      this.violationEditData.doc && this.violationEditData.doc.attachments
        ? this.violationEditData.doc.attachments
        : [];
    this.violationForm.patchValue({
      driverName: this.violationEditData.driverId,
      truck: this.violationEditData.truckId,
      trailer: this.violationEditData.trailerId,
      reportNumber: this.violationEditData.report,
      state: this.violationEditData.state,
      date: this.violationEditData.eventDate,
      time: this.violationEditData.eventTime,
      lvl: this.violationEditData.lvl,
      note:
        this.violationEditData.note !== null
          ? this.violationEditData.note.replace(/<\/?[^>]+(>|$)/g, '')
          : '',
      policeDepartment: this.violationEditData.police_dept,
      policeAddress: this.violationEditData.police_address,
      policePhone: this.violationEditData.police_phone,
      policeFax: this.violationEditData.police_fax,
      highway: this.violationEditData.highway,
      location: this.violationEditData.location,
      customer: this.violationEditData.customer || '',
      origin: this.violationEditData.origin,
      destination: this.violationEditData.destination,
      cargo: this.violationEditData.cargo,
      hazmat: this.violationEditData.hazmat,
      bol: this.violationEditData.bol,
    });
    this.violationEditData.hazmat
      ? (this.switchData[0].checked = true)
      : (this.switchData[1].checked = true);
    this.tempCitationData = this.violationEditData.citations
      ? this.violationEditData.citations
      : [];
    this.tempViolationData = this.violationEditData.categories
      ? this.violationEditData.categories
      : [];
    this.shared.touchFormFields(this.violationForm);
    this.loaded = true;
  }

  ngAfterViewInit() {}

  setFiles(files: any) {
    this.files = files;
  }

  createForm() {
    this.violationForm = this.formBuilder.group({
      driverName: [null, Validators.required],
      truck: [null, Validators.required],
      trailer: [null],
      reportNumber: [null],
      state: [null, Validators.required],
      date: [null, Validators.required],
      time: [null],
      lvl: [null, Validators.required],
      note: [null],
      policeDepartment: [null],
      policeAddress: [null],
      policePhone: [null],
      policeFax: [null],
      highway: [null],
      location: [null],
      customer: [null],
      origin: [null],
      destination: [null],
      cargo: [null],
      hazmat: [null],
      bol: [null],
    });
    setTimeout(() => {
      this.transformInputData();
    });
  }

  editNewCitation(i, citation) {
    this.newCitation = citation;
    this.removeCitation(i, citation.cost);
  }

  addNewCitation() {
    const data = Object.assign({}, this.newCitation);
    this.tempCitationData.push(data);
    this.sumCitations();
    this.closeNewCitation();
  }

  sumCitations() {
    let sum = 0;
    this.tempCitationData.forEach((element) => {
      sum += element.cost;
    });
    this.citationCostSum = sum;
  }

  removeCitation(i, cost) {
    this.citationCostSum -= cost;
    if (i !== -1) {
      this.tempCitationData.splice(i, 1);
    }
  }

  closeNewCitation() {
    this.newCitation = {
      id: 0,
      citationNumber: '',
      description: '',
      cost: null,
    };
  }

  removeItem(index) {
    const items = this.violationForm.get('violationsData') as FormArray;
    items.removeAt(index);
  }

  get violationsFormGroup() {
    return this.violationForm.get('violationsData') as FormArray;
  }

  private transformInputData() {
    const data = {
      driverName: 'capitalize',
      truck: 'capitalize',
      businessName: 'upper',
      email: 'lower',
      addressUnit: 'upper',
    };

    this.shared.handleInputValues(this.violationForm, data);
  }

  customSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.code.toLocaleLowerCase().indexOf(term) > -1 || item.id === 0;
  }
  onSearch(event: any) {
    this.violationSearchItems = event.items.length;
  }
  onClose() {
    this.violationSearchItems = 0;
  }
  onDriverChange(event: any) {
    this.newViolationCodeData = null;
    if (event !== undefined) {
      this.newViolationCodeData = event;
      this.violationCodeSelected = true;
      if (event.id === 0) {
        this.newVisible = true;
        setTimeout(() => {
          document.getElementById('newViolationCode').focus();
        }, 250);
      }
    } else {
      this.violationCodeSelected = false;
    }
  }

  trackByFn(index, item) {
    return item.myCustomIndex;
  }

  closeNewViolationCode() {
    this.newVisible = false;
    this.oosClicked = false;
    this.violationCodeSelected = false;
    this.newViolationCodeUnitTypeIcon = 'assets/img/violation-danger.svg';
    this.newViolationCode = {
      id: 0,
      code: '',
      description: '',
      oos: false,
      sw: null,
      type: null,
      icon: '',
    };
  }

  closeOOS() {
    this.violationCodeSelected = false;
    this.oosClicked = false;
    this.newViolationCodeData = null;
    this.ngSelectViolationCode.handleClearClick();
    this.onClose();
  }

  saveNewViolationCode() {
    const data = Object.assign({}, this.newViolationCode);
    data.oos = this.oosClicked;
    this.tempViolationData.push(data);
    this.sumViolations();
    this.closeNewViolationCode();
  }

  sumViolations() {
    let sum = 0;
    this.tempViolationData.forEach((element) => {
      sum += element.sw;
      if (element.oos) {
        sum += 2;
      }
    });
    this.severityWeightSum = sum;
  }

  pushNewViolationCode() {
    const data = Object.assign({}, this.newViolationCodeData);
    data.oos = this.oosClicked;
    this.tempViolationData.push(data);
    this.sumViolations();
    this.closeOOS();
  }

  removeViolationDataItemInArray(i, violation) {
    this.severityWeightSum -= violation.sw;
    if (violation.oos) {
      this.severityWeightSum -= 2;
    }
    if (i !== -1) {
      this.tempViolationData.splice(i, 1);
    }
  }

  editViolationDataItemInArray(i, violation) {
    this.newVisible = true;
    this.oosClicked = violation.oos;
    this.newViolationCodeUnitTypeIcon = violation.icon;
    this.newViolationCode = violation;
    this.removeViolationDataItemInArray(i, violation);
  }

  setUnitType(icon) {
    this.newViolationCodeUnitTypeIcon = icon;
    this.newViolationCode.icon = icon;
  }

  isRequiredField(formField: any) {
    if (!formField.validator) {
      return false;
    }

    const validator = formField.validator({} as AbstractControl);
    return validator && validator.required;
  }

  public tabChange(event: any) {
    this.selectedTab = event.id;
  }

  saveViolation(keepModal: boolean) {
    const violationFormData = Object.assign({}, this.violationForm.value);
    violationFormData.specialChecks = this.specialChecks;
    if (this.tempCitationData) {
      violationFormData.citationData = this.tempCitationData?.map((item) => {
        return {
          violationId: item.id,
          code: item.code,
          description: item.description,
          total: item.cost,
        };
      });
    }
    if (this.tempCitationData) {
      violationFormData.violationData = this.tempViolationData?.map((item) => {
        return {
          violationId: item.id,
          code: item.code,
          description: item.description,
          sw: item.sw,
          swPlus: item.oos ? 2 : 0,
          driverFlag: item.type === 1 ? 1 : 0,
          truckFlag: item.type === 2 ? 1 : 0,
          trailerFlag: item.type === 3 ? 1 : 0,
        };
      });
    }
    const saveViolationData = {
      report: violationFormData.reportNumber,
      driverId: violationFormData.driverName,
      truckId: violationFormData.truck,
      trailerId: violationFormData.trailer,
      eventDate: new Date(violationFormData.date),
      eventTime: formatDate(violationFormData.time, 'HH:mm:ss', 'en-US'),
      categories: violationFormData.violationData,
      citations: violationFormData.citationData,
      lvl: violationFormData.lvl,
      policeDept: violationFormData.policeDepartment,
      policeAddress: violationFormData.policeAddress,
      policePhone: violationFormData.policePhone,
      policeFax: violationFormData.policeFax,
      highway: violationFormData.highway,
      location: violationFormData.location,
      state: violationFormData.state,
      origin: violationFormData.origin,
      destination: violationFormData.destination,
      cargo: violationFormData.cargo,
      hazmat: violationFormData.hazmat ? 1 : 0,
      bol: violationFormData.bol,
      note: violationFormData.note,
      doc: {
        attachments:
          this.inputData.data.type === 'new'
            ? []
            : this.violationEditData?.doc?.attachments
            ? this.violationEditData?.doc?.attachments
            : [],
      },
    };
    console.log(saveViolationData);

    if (this.inputData.data.type === 'new') {
      this.safetyService
        .createViolation(saveViolationData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (resp: any) => {
            const newFiles = this.shared.getNewFiles(this.files);
            if (newFiles.length > 0) {
              this.notification.success(`Violation added.`, ' ');
              this.storageService
                .uploadFiles(resp.guid, FILE_TABLES.VIOLATION, resp.id, this.files)
                .pipe(takeUntil(this.destroy$))
                .subscribe(
                  (resp1: any) => {
                    if (!keepModal) {
                      this.closeViolationEdit();
                    }
                    this.spinner.show(false);
                    if (resp1.success.length > 0) {
                      resp1.success.forEach((element) => {
                        saveViolationData.doc.attachments.push(element);
                      });
                      this.notification.success(`Attachments successfully uploaded.`, ' ');
                      this.safetyService
                        .updateViolation(saveViolationData, resp.id)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe(
                          () => {
                            this.notification.success(`Violation updated.`, ' ');
                            if (!keepModal) {
                              this.closeViolationEdit();
                            }
                            this.spinner.show(false);
                          },
                          (error: HttpErrorResponse) => {
                            this.shared.handleError(error);
                          }
                        );
                    } else {
                      if (!keepModal) {
                        this.closeViolationEdit();
                      }
                      this.spinner.show(false);
                    }
                  },
                  (error: HttpErrorResponse) => {
                    this.shared.handleError(error);
                  }
                );
            } else {
              if (!keepModal) {
                this.closeViolationEdit();
              }
              this.spinner.show(false);
            }
          },
          (error: HttpErrorResponse) => {
            this.shared.handleError(error);
          }
        );
    } else if (this.inputData.data.type === 'edit') {
      const newFiles = this.shared.getNewFiles(this.files);
      if (newFiles.length > 0) {
        this.storageService
          .uploadFiles(
            this.violationEditData.guid,
            FILE_TABLES.VIOLATION,
            this.violationEditData.id,
            this.files
          )
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (resp1: any) => {
              if (!keepModal) {
                this.closeViolationEdit();
              }
              this.spinner.show(false);
              if (resp1.success.length > 0) {
                resp1.success.forEach((element) => {
                  saveViolationData.doc.attachments.push(element);
                });
                this.notification.success(`Attachments successfully uploaded.`, ' ');
                this.safetyService
                  .updateViolation(saveViolationData, this.violationEditData.id)
                  .pipe(takeUntil(this.destroy$))
                  .subscribe(
                    (resp: any) => {
                      this.notification.success(`Violation updated.`, ' ');
                      if (!keepModal) {
                        this.closeViolationEdit();
                      }
                      this.spinner.show(false);
                    },
                    (error: HttpErrorResponse) => {
                      this.shared.handleError(error);
                    }
                  );
              } else {
                if (!keepModal) {
                  this.closeViolationEdit();
                }
                this.spinner.show(false);
              }
            },
            (error: HttpErrorResponse) => {
              this.shared.handleError(error);
            }
          );
      } else {
        this.safetyService
          .updateViolation(saveViolationData, this.violationEditData.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (resp: any) => {
              this.notification.success(`Violation updated.`, ' ');
              if (!keepModal) {
                this.closeViolationEdit();
              }
              this.spinner.show(false);
            },
            (error: HttpErrorResponse) => {
              this.shared.handleError(error);
            }
          );
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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

  closeViolationEdit() {
    this.activeModal.close();
  }

  switchHazmat(data: any) {
    if (data !== undefined && data[0] !== undefined) {
      if (data[0].name === 'Yes' && data[0].checked === true) {
        this.violationForm.get('hazmat').patchValue(true);
      } else {
        this.violationForm.get('hazmat').patchValue(false);
      }
    }
  }

  public handleAddressChange(address: any, i) {
    this.address = this.shared.selectAddress(this.violationForm, address);
    switch (i) {
      case 1:
        this.violationForm.get('state').patchValue(this.address.address);
        break;
      case 2:
        this.violationForm.get('policeAddress').patchValue(this.address.address);
        break;
      case 3:
        this.violationForm.get('location').patchValue(this.address.address);
        break;
      case 4:
        this.violationForm.get('origin').patchValue(this.address.address);
        break;
      case 5:
        this.violationForm.get('destination').patchValue(this.address.address);
        break;

      default:
        break;
    }
  }

  checkSpecialCheck(i) {
    this.specialChecks[i].check = !this.specialChecks[i].check;
  }

  keyDownFunction(event: any) {
    if (
      event.keyCode === 13 &&
      event.target.localName !== 'textarea' &&
      event.path !== undefined &&
      event.path !== null &&
      event.path[3].className !== 'ng-select-container ng-has-value' &&
      !this.newVisible
    ) {
      this.saveViolation(false);
    }
  }

  onNameTyping(event) {
    let k;
    k = event.charCode;
    if (k === 32) {
      this.numOfSpaces++;
    } else {
      this.numOfSpaces = 0;
    }

    if (this.numOfSpaces < 2) {
      return (
        (k > 64 && k < 91) ||
        (k > 96 && k < 123) ||
        k === 8 ||
        k === 32 ||
        (k >= 48 && k <= 57) ||
        k === 46 ||
        k === 44 ||
        k === 45
      );
    } else {
      event.preventDefault();
    }
  }

  onCheckBackSpace(event) {
    if (event.keyCode === 8) {
      this.numOfSpaces = 0;
    }
  }

  manageInputValidation(formElement: any) {
    return this.shared.manageInputValidation(formElement);
  }

  getTrucks() {
    this.truckService
      .getTruckList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result: any) => {
          this.trucks = result.allTrucks;
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  getTrailers() {
    this.trailerService
      .getTrailers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (trailerTabData: any) => {
          this.trailerTabData = trailerTabData.allTrailers;
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  getDrivers() {
    this.driverService
      .getDriverSelect()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (driverTabDate: any[]) => {
          this.driversData = driverTabDate;
          this.driversData.splice(0, 0, {
            driverName: 'Add New',
            id: 0,
          });
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  selectDriver(event: any) {
    if (event) {
      if (event.id === 0) {
        this.openDriverModal();
        this.violationForm.controls.driverName.reset();
        return;
      }
    }
  }

  openDriverModal() {
    const data = {
      type: 'new',
      id: null,
    };
    this.customModalService.openModal(DriverManageComponent, { data }, null, { size: 'small' });
  }

  customSearchDriver(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.driverName.toLocaleLowerCase().indexOf(term) > -1 || item.id === 0;
  }

  onSearchDriver(event: any) {
    this.driverSearchItems = event.items.length;
  }

  onCloseDriver(event: any) {
    this.driverSearchItems = 0;
  }
  customSearchTruck(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.truckNumber.toLocaleLowerCase().indexOf(term) > -1 || item.id === 0;
  }

  onSearchTruck(event: any) {
    this.truckSearchItems = event.items.length;
  }

  onCloseTruck(event: any) {
    this.truckSearchItems = 0;
  }
}
