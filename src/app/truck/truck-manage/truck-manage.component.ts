import { takeUntil } from 'rxjs/operators';
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppTruckService } from 'src/app/core/services/app-truck.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { AppSharedService } from 'src/app/core/services/app-shared.service';
import { MetaData } from 'src/app/core/model/shared/enums';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/core/services/shared.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { forkJoin } from 'rxjs';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { OwnerManageComponent } from 'src/app/owners/owner-manage/owner-manage.component';
import { v4 as uuidv4 } from 'uuid';
import { MetaDataService } from 'src/app/core/services/metadata.service';
import { OwnerData } from 'src/app/core/model/shared/owner';
import * as AppConst from 'src/app/const';
import { Vin } from 'src/app/core/model/vin';
import { Subject } from 'rxjs';
import { TruckData, TruckOwner } from 'src/app/core/model/truck';
import { ManageCompany } from 'src/app/core/model/company';
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { checkSelectedText, pasteCheck } from 'src/assets/utils/methods-global';
import { tabSwitchModalIn, tabSwitchModalOut } from '../../core/helpers/animations';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-truck-manage',
  templateUrl: './truck-manage.component.html',
  styleUrls: ['./truck-manage.component.scss'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TruckManageComponent implements OnInit, OnDestroy {

  constructor(
    private metadataService: MetaDataService,
    private shared: SharedService,
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private ownerService: AppSharedService,
    private spinner: SpinnerService,
    private truckService: AppTruckService,
    private customModalService: CustomModalService,
    private notification: NotificationService,
    private datePipe: DatePipe,
    private cdref: ChangeDetectorRef
  ) {}
  @ViewChild('note') note: ElementRef;
  @ViewChild('t2') t2: any;
  @Input() inputData: any;
  modalTitle = '';
  tireSizes: MetaData[] = [];
  truckMakers: any[] = [];
  truckTypes: any[] = [];
  truckEngines: MetaData[] = [];
  owners: TruckOwner[] = [];
  colors: MetaData[] = [];
  companyOwnedStateControl = true;
  truckForm: FormGroup;
  truck: TruckData;
  selectedTab = 1;
  isVinLoading = false;
  showNote = false;
  textRows = 1;
  selectedColor = '';
  selectedTruckType = '';

  private destroy$: Subject<void> = new Subject<void>();

  userCompany: ManageCompany = null;
  division = 0;
  sliderOptions: Options = {
    floor: 2,
    ceil: 25,
    step: 0.5
  };

  ownerSearchItems = 0;

  tabs = [
    {
      id: 1,
      name: 'Basic'
    },
    {
      id: 2,
      name: 'Additional'
    },
  ];
  loaded = false;

  public fomratType = /^[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/? ]*$/;

  public numOfSpaces = 0;

  ngOnInit() {
    this.getUserCompany();
    this.getTruckData();
    this.createForm();

    this.ownerService.newOwner
    .pipe(takeUntil(this.destroy$))
    .subscribe((owner: OwnerData) => {
      this.owners.push({
        id: owner.id,
        divisionFlag: owner.divisionFlag,
        ownerName: owner.ownerName,
        ownerType: owner.ownerType,
      });
      this.owners = this.owners.slice(0);
      this.owners = this.owners.sort((owner) => {
        if (owner.divisionFlag > owner.divisionFlag) {
          return 1;
        }

        if (owner.divisionFlag < owner.divisionFlag) {
          return -1;
        }

        return 0;
      });
    });
  }

  getUserCompany() {
    this.userCompany = JSON.parse(localStorage.getItem('userCompany'));
  }

  onColorChange(event: any) {
    if (event !== undefined) {
      if (event.key !== undefined) {
        if (this.selectedColor !== '') {
          document.getElementById('colors-dropdown').classList.remove(this.selectedColor);
        }
        document
          .getElementById('colors-dropdown')
          .classList.add(event.key.replace(' ', '-').toLowerCase());
        this.selectedColor = event.key.replace(' ', '-').toLowerCase();
      } else {
        if (this.selectedColor !== '') {
          document.getElementById('colors-dropdown').classList.remove(this.selectedColor);
        }
        document
          .getElementById('colors-dropdown')
          .classList.add(event.replace(' ', '-').toLowerCase());
        this.selectedColor = event.replace(' ', '-').toLowerCase();
      }
    } else {
      document.getElementById('colors-dropdown').classList.remove(this.selectedColor);
      this.selectedColor = '';
    }
  }

  onTruckTypeChange(event: any) {
    if (event !== undefined) {
      if (this.selectedTruckType !== '') {
        document.getElementById('truck-type-dropdown').classList.remove(this.selectedTruckType);
      }
      document.getElementById('truck-type-dropdown').classList.add(event.class);
      this.selectedTruckType = event.class;
    } else {
      document.getElementById('truck-type-dropdown').classList.remove(this.selectedTruckType);
      this.selectedTruckType = event;
    }
  }

  getTruckData() {
    const tireSizes$ = this.metadataService.getMetaDataByDomainKey('tire', 'size');
    const truckEngines$ = this.metadataService.getMetaDataByDomainKey('truck', 'engine');
    const owners$ = this.truckService.getOwners();
    const truckColors$ = this.metadataService.getColorList();

    forkJoin([tireSizes$, truckEngines$, owners$, truckColors$])
    .pipe(takeUntil(this.destroy$))
    .subscribe(
    ([tireSizes, truckEngines, owners, truckColors]: [
      MetaData[],
      MetaData[],
      TruckOwner[],
      MetaData[]
    ]) => {
      this.tireSizes = tireSizes;
      this.truckMakers = AppConst.TRUCK_MAKERS;
      this.truckTypes = AppConst.TRUCK_LIST;
      this.truckEngines = truckEngines;
      this.owners = owners.sort((owner) => {
        if (owner.divisionFlag > owner.divisionFlag) {
          return 1;
        }

        if (owner.divisionFlag < owner.divisionFlag) {
          return -1;
        }

        return 0;
      });
      this.owners.unshift({
        divisionFlag: 0,
        id: 0,
        ownerName: 'Add new',
        ownerType: null,
      });
      this.colors = truckColors;

      if (this.inputData.data.type === 'edit') {
        this.modalTitle = 'Edit Truck';
        this.truck = this.inputData.data.truck;
        this.companyOwnedStateControl = (this.truck && this.truck.companyOwned === 1) ? true : false;
        const additionalData =
          this.truck && this.truck.doc && this.truck.doc.additionalData
            ? this.truck.doc.additionalData
            : null;

        const owner = this.owners.find((o) => o.id === this.truck.ownerId);
        this.division = owner ? owner.divisionFlag : 0;
        this.loaded = true;
        this.truckForm.setValue({
          truckNumber: this.truck && this.truck.truckNumber ? this.truck.truckNumber : null,
          type: additionalData && additionalData.type ? additionalData.type : null,
          color: additionalData && additionalData.color ? additionalData.color : null,
          make: additionalData && additionalData.make ? additionalData.make : null,
          model: additionalData && additionalData.model ? additionalData.model : null,
          vin: this.truck && this.truck.vin ? this.truck.vin.toUpperCase() : null,
          note: additionalData.note !== null ? additionalData.note.replace(/<\/?[^>]+(>|$)/g, '') : '',
          owner: owner ? owner : null,
          commission:
            this.truck && this.truck.commission && !this.division
              ? this.truck.commission
              : null,
          mileage: additionalData && additionalData.mileage ? additionalData.mileage : null,
          ipasEzpass:
            additionalData && additionalData.ipasEzpass ? additionalData.ipasEzpass : null,
          axises: additionalData && additionalData.axises ? additionalData.axises : null,
          year: additionalData && additionalData.year ? additionalData.year : null,
          status: this.truck && this.truck.status !== null ? this.truck.status : null,
          insurancePolicyNumber:
            additionalData && additionalData.insurancePolicyNumber
              ? additionalData.insurancePolicyNumber
              : null,
          emptyWeight:
            additionalData && additionalData.emptyWeight ? additionalData.emptyWeight : null,
          engine: additionalData && additionalData.engine ? additionalData.engine : null,
          companyOwned: this.truck && this.truck.companyOwned ? this.truck.companyOwned : null,
          tireSize: additionalData && additionalData.tireSize ? additionalData.tireSize : null,
        });

        if (additionalData && additionalData.note && additionalData.note.length > 0) {
          this.showNote = true;
          this.handleHeight(this.truck.doc.additionalData.note);
        }
        this.shared.touchFormFields(this.truckForm);
      } else if (this.inputData.data.type === 'new') {
        this.loaded = true;
        this.modalTitle = 'Add Truck';
        this.companyOwnedStateControl = true;
      }

      if (this.companyOwnedStateControl) {
        this.truckForm.controls.commission.setValue(0);
        this.truckForm.controls.owner.setValue(null);
        this.truckForm.controls.owner.setValidators(null);
      } else {
        this.truckForm.controls.commission.setValue(
          this.division ? 0 : this.truckForm.controls.commission.value
        );
        this.truckForm.controls.commission.setValidators(
          this.division ? null : Validators.required
        );
      }

      this.truckForm.controls.commission.updateValueAndValidity();
      this.truckForm.controls.owner.updateValueAndValidity();

      if (this.truck !== undefined) {
        setTimeout(() => {
          this.onColorChange(
            this.truck.doc.additionalData.color !== null
              ? this.truck.doc.additionalData.color.key
              : undefined
          );
          this.onTruckTypeChange(
            this.truck.doc.additionalData.type.class !== undefined
              ? this.truck.doc.additionalData.type
              : undefined
          );
        }, 500);
      }
    },
    (error: HttpErrorResponse) => {
      this.shared.handleError(error);
    }
  );
  }

  formatLabel(value: number) {
    if (value >= 2) {
      return value + '%';
    }
  }

  keyDownFunction(event: any) {
    if (
      event.keyCode === 13 &&
      event.target.localName !== 'textarea' &&
      event.path !== undefined &&
      event.path !== null &&
      event.path[3].className !== 'ng-select-container ng-has-value'
    ) {
      this.saveTruck();
    }
  }

  createForm() {
    this.truckForm = this.formBuilder.group({
      truckNumber: ['', Validators.required],
      type: [null, Validators.required],
      color: [null],
      make: [null, Validators.required],
      model: [''],
      vin: ['', Validators.required],
      note: [''],
      owner: [null],
      commission: [0],
      mileage: [null],
      ipasEzpass: [null],
      axises: ['', Validators.maxLength(1)],
      year: ['', Validators.required],
      status: [true, Validators.required],
      insurancePolicyNumber: [''],
      emptyWeight: [null],
      engine: [null],
      companyOwned: [true],
      tireSize: [null],
    });
    this.transformInputData();
  }

  private transformInputData() {
    const data = {
      model: 'upper',
      vin: 'upper',
      truckNumber: 'upper',
    };
    this.shared.handleInputValues(this.truckForm, data);
  }

  saveTruck() {
    if (!this.shared.markInvalid(this.truckForm)) {
      return false;
    }
    const truck = this.truckForm.value;

    if (this.inputData.data.type === 'edit') {
      const saveData: TruckData = {
        companyOwned: this.companyOwnedStateControl ? 1 : 0,
        ownerId:
          (this.companyOwnedStateControl && this.userCompany)
            ? this.userCompany.id
            : truck.owner
            ? truck.owner.id
            : null,
        truckNumber: truck.truckNumber,
        divisionFlag: truck.owner && truck.owner.divisionFlag ? truck.owner.divisionFlag : 0,
        vin: truck.vin,
        commission: truck.commission,
        status: truck.status ? 1 : 0,
        doc: {
          additionalData: {
            axises: truck.axises,
            color: truck.color,
            emptyWeight: truck.emptyWeight,
            engine: truck.engine,
            insurancePolicyNumber: truck.insurancePolicyNumber,
            make: truck.make,
            mileage: truck.mileage,
            ipasEzpass: truck.ipasEzpass,
            model: truck.model,
            note: truck.note,
            tireSize: truck.tireSize,
            type: truck.type,
            year: truck.year,
          },
          licenseData:
            this.truck && this.truck.doc && this.truck.doc.licenseData
              ? this.truck.doc.licenseData
              : [],
          inspectionData:
            this.truck && this.truck.doc && this.truck.doc.inspectionData
              ? this.truck.doc.inspectionData
              : [],
          titleData:
            this.truck && this.truck.doc && this.truck.doc.titleData
              ? this.truck.doc.titleData
              : [],
          truckLeaseData:
            this.truck && this.truck.doc && this.truck.doc.truckLeaseData
              ? this.truck.doc.truckLeaseData
              : [],
          activityHistory:
            this.truck && this.truck && this.truck.doc.activityHistory
              ? this.truck.doc.activityHistory
              : [],
        },
      };

      if (saveData.doc.activityHistory.length) {
        saveData.doc.activityHistory[saveData.doc.activityHistory.length - 1].endDate = new Date();
        saveData.doc.activityHistory[
          saveData.doc.activityHistory.length - 1
        ].endDateShort = this.datePipe.transform(new Date(), 'shortDate');

        saveData.doc.activityHistory.push({
          id: uuidv4(),
          startDate: new Date(),
          startDateShort: this.datePipe.transform(new Date(), 'shortDate'),
          endDate: null,
          endDateShort: null,
          header:
            (this.companyOwnedStateControl && this.userCompany)
              ? this.userCompany.name
              : truck.owner
              ? truck.owner.ownerName
              : null,
          ownerId:
            (this.companyOwnedStateControl && this.userCompany)
              ? this.userCompany.id
              : truck.owner
              ? truck.owner.id
              : null,
        });
      }

      this.spinner.show(true);
      this.truckService.updateTruckData(saveData, this.truck.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (truckData) => {
          this.notification.success('Truck has been updated.', 'Success:');
          this.truck = truckData;
          this.closeModal();
          this.spinner.show(false);
        },
        (error: HttpErrorResponse) => {

          console.log(error);
          console.log("ERROR");
          this.shared.handleError(error);
        }
      );
    } else if (this.inputData.data.type === 'new') {
      const saveData: TruckData = {
        companyOwned: this.companyOwnedStateControl ? 1 : 0,
        ownerId:
          (this.companyOwnedStateControl && this.userCompany)
            ? this.userCompany.id
            : truck.owner
            ? truck.owner.id
            : null,
        divisionFlag: truck.owner && truck.owner.divisionFlag ? truck.owner.divisionFlag : 0,
        truckNumber: truck.truckNumber,
        vin: truck.vin,
        commission: truck.commission,
        status: truck.status ? 1 : 0,
        doc: {
          additionalData: {
            axises: truck.axises,
            color: truck.color,
            emptyWeight: truck.emptyWeight,
            engine: truck.engine,
            insurancePolicyNumber: truck.insurancePolicyNumber,
            make: truck.make,
            mileage: truck.mileage,
            ipasEzpass: truck.ipasEzpass,
            model: truck.model,
            note: truck.note,
            tireSize: truck.tireSize,
            type: truck.type,
            year: truck.year,
          },
          licenseData: [],
          inspectionData: [],
          titleData: [],
          truckLeaseData: [],
          activityHistory: [],
        },
      };

      saveData.doc.activityHistory.push({
        id: uuidv4(),
        startDate: new Date(),
        startDateShort: this.datePipe.transform(new Date(), 'shortDate'),
        endDate: null,
        endDateShort: null,
        header:
          (this.companyOwnedStateControl && this.userCompany)
            ? this.userCompany.name
            : truck.owner
            ? truck.owner.ownerName
            : null,
        ownerId:
          (this.companyOwnedStateControl && this.userCompany)
            ? this.userCompany.id
            : truck.owner
            ? truck.owner.id
            : null,
      });

      this.spinner.show(true);
      this.truckService.addTruck(saveData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.notification.success('Truck has been added.', 'Success:');
          this.closeModal();
          this.companyOwnedStateControl = false;
          this.spinner.show(false);
        },
        (error: HttpErrorResponse) => {
          this.shared.handleError(error);
        }
      );
    }
  }

  vinAutoComplete(event: any) {
    if (event.target.value.length === 17) {
      this.spinner.showInputLoading(true);
      this.isVinLoading = true;
        this.truckService.getVinData(event.target.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (result: Vin[]) => {
            const vinData = result && result.length ? result[0] : null;
            if (vinData) {
              const makeData = this.truckMakers.find((element) =>
                vinData.Make.toLowerCase().includes(element.name.toLowerCase())
              );
              if (makeData) {
                this.truckForm.controls.make.setValue(makeData.name);
                this.truckForm.controls.year.setValue(vinData.ModelYear);
              }
            }
            this.spinner.showInputLoading(false);
            this.isVinLoading = false;
          },
          () => {
            this.spinner.showInputLoading(false);
          }
        );
    }
  }

  changeOwner(event) {
    this.division = event.divisionFlag;
    if (event.id == 0) {
      this.openTruckOwnerModal();
      this.truckForm.controls.owner.reset();
    } else {
      this.truckForm.controls.commission.setValue(this.division ? 0 : 12);
      this.truckForm.controls.commission.setValidators(this.division ? null : Validators.required);
      this.truckForm.controls.commission.updateValueAndValidity();
    }
  }

  handleHeight(val: string) {
    const lines = val.split(/\r|\r\n|\n/);
    const count = lines.length;
    this.textRows = count >= 4 ? 4 : count;
  }

  companyOwned() {
    if (this.companyOwnedStateControl) {
      this.truckForm.controls.commission.setValue(0);
      this.truckForm.controls.owner.setValue(null);
      this.truckForm.controls.owner.setValidators(null);
    } else {
      this.truckForm.controls.commission.setValue(12);
      this.truckForm.controls.commission.setValidators(Validators.required);
      this.truckForm.controls.owner.setValidators(Validators.required);
    }
    this.truckForm.controls.commission.updateValueAndValidity();
    this.truckForm.controls.owner.updateValueAndValidity();
  }

  checkYear(event: any) {
    if (event) {
      const yearLength = event.length;
      if (yearLength === 1 && event !== '1') {
        if (event !== '2') {
          this.truckForm.get('year').setValue('');
        }
      }
    }
  }

  openNote() {
    if (this.showNote === true) {
      this.showNote = false;
    } else {
      this.showNote = true;
      setTimeout(() => {
        this.note.nativeElement.focus();
      });
    }
  }

  openTruckOwnerModal() {
    const data = {
      type: 'new',
      id: null,
    };
    this.customModalService.openModal(OwnerManageComponent, { data }, null, {
      size: 'small',
    });
  }

  closeModal() {
    this.activeModal.close();
  }

  tabChange(event: any) {
    this.selectedTab = event.id;
  }
  onPaste(event: any, inputID: string, caracterLimit?: number, index?: number) {
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

    let notDefult = false;
    if (inputID === 'trailerNumber') {
      this.fomratType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ]*$/;
    } else if (inputID === 'vin') {
      this.fomratType = /^[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/? ]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.fomratType,
        true,
        false,
        false,
        caracterLimit
      );
      notDefult = true;
    } else if (inputID === 'ipasEzpass') {
      this.fomratType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?A-Za-z ]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.fomratType,
        false,
        false,
        false,
        caracterLimit
      );
      notDefult = true;
    } else {
      this.fomratType = /^[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/? ]*$/;
    }
    if (!notDefult) {
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.fomratType,
        true,
        false,
        false,
        caracterLimit
      );
    }

    this.truckForm.controls[inputID].patchValue(
      (document.getElementById(inputID) as HTMLInputElement).value
    );
  }

  onVinTyping(event: any) {
    /* var k = event.charCode; */
    const k = event.keyCode;
    return (k > 64 && k < 91) || (k > 96 && k < 123) || (k >= 48 && k <= 57);
  }

  onUnitTyping(event) {
    let k;
    k = event.charCode;
    console.log(k);
    return (k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57);
  }
  
  onModelTyping(event) {
    let k;
    k = event.charCode;
    console.log(k)
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
        k == 45
      );
    } else {
      event.preventDefault();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  customSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return ((item.ownerName.toLocaleLowerCase().indexOf(term) > -1) || (item.id === 0));
  }

  onSearch(event: any) {
    this.ownerSearchItems = event.items.length;
  }

  onClose(event: any) {
    this.ownerSearchItems = 0;
  }

}
