import { takeUntil } from 'rxjs/operators';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppTrailerService } from 'src/app/core/services/app-trailer.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { AppSharedService } from 'src/app/core/services/app-shared.service';
import { MetaData } from 'src/app/core/model/shared/enums';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/core/services/shared.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { forkJoin, Subject } from 'rxjs';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { OwnerManageComponent } from 'src/app/owners/owner-manage/owner-manage.component';
import { v4 as uuidv4 } from 'uuid';
import { MetaDataService } from 'src/app/core/services/metadata.service';
import { OwnerData } from 'src/app/core/model/shared/owner';
import * as AppConst from 'src/app/const';
import { Vin } from 'src/app/core/model/vin';
import {
  MakeData,
  ReeferUnitData,
  TrailerData,
  TrailerOwner,
  TypeData,
} from 'src/app/core/model/trailer';
import { ManageCompany } from 'src/app/core/model/company';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { checkSelectedText, pasteCheck } from 'src/assets/utils/methods-global';
import { tabSwitchModalIn, tabSwitchModalOut } from '../../core/helpers/animations';

@Component({
  selector: 'app-trailer-manage',
  templateUrl: './trailer-manage.component.html',
  styleUrls: ['./trailer-manage.component.scss'],
  providers: [DatePipe]
})
export class TrailerManageComponent implements OnInit, OnDestroy {

  constructor(
    private metadataService: MetaDataService,
    private shared: SharedService,
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private ownerService: AppSharedService,
    private spinner: SpinnerService,
    private trailerService: AppTrailerService,
    private customModalService: CustomModalService,
    private notification: NotificationService,
    private datePipe: DatePipe
  ) {}

  get f() {
    return this.trailerForm.controls;
  }
  @ViewChild('note') note: ElementRef;
  @Input() inputData: any;
  private destroy$: Subject<void> = new Subject<void>();
  loading = false;
  modalTitle = '';
  tireSizes: MetaData[] = [];
  trailerLength: MetaData[] = [];
  trailerMakers: MakeData[] = [];
  trailerTypes: TypeData[] = [];
  owners: TrailerOwner[] = [];
  colors: MetaData[] = [];
  companyOwnedStateControl = true;
  trailerForm: FormGroup;
  trailer: TrailerData;
  selectedTab = 1;
  isVinLoading = false;
  rangeStart: string | number = 12;
  showNote = false;
  textRows = 1;
  userCompany: ManageCompany = null;
  reeferUnits: ReeferUnitData[] = [];
  selectedColor = '';

  newColor = '';

  selectedTrailerType = '';

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
    this.getTrailerData();
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

  getTrailerData() {
    const tireSizes$ = this.metadataService.getMetaDataByDomainKey('tire', 'size');
    const trailerLengths$ = this.metadataService.getMetaDataByDomainKey('trailer', 'length');
    const owners$ = this.trailerService.getOwners();
    const trailerColors$ = this.metadataService.getColorList();
    this.loading = true;

    forkJoin([tireSizes$, trailerLengths$, owners$, trailerColors$])
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      ([tireSizes, trailerLengths, owners, trailerColors]: [
        MetaData[],
        MetaData[],
        TrailerOwner[],
        MetaData[]
      ]) => {
        this.tireSizes = tireSizes;
        this.trailerLength = trailerLengths;
        this.trailerMakers = AppConst.TRAILER_MAKERS;
        this.trailerTypes = AppConst.TRAILER_LIST;
        this.reeferUnits = AppConst.REEFERUNITS;
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
        this.colors = trailerColors;

        if (this.inputData.data.type === 'edit') {
          this.modalTitle = 'Edit Trailer';
          this.trailer = this.inputData.data.trailer;
          this.companyOwnedStateControl = (this.trailer && this.trailer.companyOwned === 1) ? true : false;

          const additionalData =
            this.trailer && this.trailer.doc && this.trailer.doc.additionalData
              ? this.trailer.doc.additionalData
              : null;

          const owner = this.owners.find((o) => o.id === this.trailer.ownerId);
          this.loaded = true;
          this.trailerForm.setValue({
            trailerNumber:
              this.trailer && this.trailer.trailerNumber ? this.trailer.trailerNumber : null,
            type: additionalData && additionalData.type ? additionalData.type : null,
            color: additionalData && additionalData.color ? additionalData.color : null,
            make: additionalData && additionalData.make ? additionalData.make : null,
            model: additionalData && additionalData.model ? additionalData.model : null,
            vin: this.trailer && this.trailer.vin ? this.trailer.vin.toUpperCase() : null,
            note: additionalData.note !== null ? additionalData.note.replace(/<\/?[^>]+(>|$)/g, '') : '',
            owner: owner ? owner : null,
            axises: additionalData && additionalData.axises ? additionalData.axises : null,
            year: additionalData && additionalData.year ? additionalData.year : null,
            status: this.trailer && this.trailer.status !== null ? this.trailer.status : null,
            companyOwned:
              this.trailer && this.trailer.companyOwned ? this.trailer.companyOwned : null,
            tireSize: additionalData && additionalData.tireSize ? additionalData.tireSize : null,
            length: additionalData && additionalData.length ? additionalData.length : null,
            reeferUnit:
              additionalData && additionalData.reeferUnit ? additionalData.reeferUnit : null,
          });

          if (additionalData && additionalData.note && additionalData.note.length > 0) {
            this.showNote = true;
            this.handleHeight(this.trailer.doc.additionalData.note);
          }
        } else if (this.inputData.data.type === 'new') {
          this.modalTitle = 'Add Trailer';
          this.companyOwnedStateControl = true;
          this.loaded = true;
        }

        if (this.companyOwnedStateControl) {
          this.trailerForm.controls.owner.setValue(null);
          this.trailerForm.controls.owner.setValidators(null);
        } else {
          this.trailerForm.controls.owner.setValidators(Validators.required);
        }
        this.trailerForm.controls.owner.updateValueAndValidity();

        this.loading = false;

        if (this.trailer !== undefined) {
          setTimeout(() => {
            this.onColorChange(this.trailer.doc.additionalData.color !== null ? this.trailer.doc.additionalData.color.key : undefined);
            this.onTrailerTypeChange(this.trailer.doc.additionalData.type.class !== undefined ? this.trailer.doc.additionalData.type : undefined);
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
      this.saveTrailer();
    }
  }

  changeOwner(event) {
    if (event.id == 0) {
      this.openTrailerOwnerModal();
      this.trailerForm.controls.owner.reset();
    }
  }

  createForm() {
    this.trailerForm = this.formBuilder.group({
      trailerNumber: ['', Validators.required],
      make: [null, Validators.required],
      model: [''],
      type: [null, Validators.required],
      year: [null, Validators.required],
      owner: [null],
      note: [''],
      status: [true],
      axises: ['', Validators.maxLength(1)],
      tireSize: [null],
      color: [null],
      length: [null],
      vin: ['', Validators.required],
      companyOwned: [true],
      reeferUnit: [null],
    });
    this.transformInputData();
  }

  private transformInputData() {
    const data = {
      model: 'upper',
      trailerNumber: 'upper',
    };
    this.shared.handleInputValues(this.trailerForm, data);
  }

  saveTrailer() {
    if (!this.shared.markInvalid(this.trailerForm)) {
      return false;
    }
    const trailer = this.trailerForm.value;

    if (this.inputData.data.type === 'edit') {
      const saveData: TrailerData = {
        companyOwned: this.companyOwnedStateControl ? 1 : 0,
        ownerId:
          (this.companyOwnedStateControl && this.userCompany)
            ? this.userCompany.id
            : trailer.owner.id,
        divisionFlag: trailer.owner && trailer.owner.divisionFlag ? trailer.owner.divisionFlag : 0,
        trailerNumber: trailer.trailerNumber,
        vin: trailer.vin.toUpperCase(),
        status: trailer.status ? 1 : 0,
        year: trailer.year,
        doc: {
          additionalData: {
            axises: trailer.axises,
            color: trailer.color,
            make: trailer.make,
            model: trailer.model,
            note: trailer.note,
            tireSize: trailer.tireSize,
            length: trailer.length,
            type: trailer.type,
            year: trailer.year,
          },
          licenseData:
            this.trailer && this.trailer.doc && this.trailer.doc.licenseData
              ? this.trailer.doc.licenseData
              : [],
          inspectionData:
            this.trailer && this.trailer.doc && this.trailer.doc.inspectionData
              ? this.trailer.doc.inspectionData
              : [],
          titleData:
            this.trailer && this.trailer.doc && this.trailer.doc.titleData
              ? this.trailer.doc.titleData
              : [],
          trailerLeaseData:
            this.trailer && this.trailer.doc && this.trailer.doc.trailerLeaseData
              ? this.trailer.doc.trailerLeaseData
              : [],
          activityHistory:
            this.trailer && this.trailer && this.trailer.doc.activityHistory
              ? this.trailer.doc.activityHistory
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
              : trailer.owner.ownerName,
          ownerId:
            (this.companyOwnedStateControl && this.userCompany)
              ? this.userCompany.id
              : trailer.owner.id,
        });
      }

      this.spinner.show(true);
      this.trailerService.updateTrailerData(saveData, this.trailer.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (trailerData) => {
          this.notification.success('Trailer has been updated.', 'Success:');
          this.trailer = trailerData;
          this.closeModal();
          this.spinner.show(false);
        },
        (error: HttpErrorResponse) => {
          this.shared.handleError(error);
        }
      );
      this.shared.touchFormFields(this.trailerForm);
    } else if (this.inputData.data.type === 'new') {
      const saveData: TrailerData = {
        companyOwned: this.companyOwnedStateControl ? 1 : 0,
        ownerId:
          (this.companyOwnedStateControl && this.userCompany)
            ? this.userCompany.id
            : trailer.owner.id,
        divisionFlag: trailer.owner && trailer.owner.divisionFlag ? trailer.owner.divisionFlag : 0,
        trailerNumber: trailer.trailerNumber,
        vin: trailer.vin.toUpperCase(),
        status: trailer.status ? 1 : 0,
        year: trailer.year,
        doc: {
          additionalData: {
            axises: trailer.axises,
            color: trailer.color,
            make: trailer.make,
            model: trailer.model,
            note: trailer.note,
            tireSize: trailer.tireSize,
            length: trailer.length,
            type: trailer.type,
            year: trailer.year,
          },
          licenseData: [],
          inspectionData: [],
          titleData: [],
          trailerLeaseData: [],
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
            : trailer.owner.ownerName,
        ownerId:
          (this.companyOwnedStateControl && this.userCompany)
            ? this.userCompany.id
            : trailer.owner.id,
      });

      this.spinner.show(true);
      this.trailerService.addTrailer(saveData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.notification.success('Trailer has been added.', 'Success:');
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
      this.trailerService.getVinData(event.target.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result: Vin[]) => {
          const vinData = result && result.length ? result[0] : null;
          if (vinData) {
            const makeData = this.trailerMakers.find((element) =>
              vinData.Make.toLowerCase().includes(element.name.toLowerCase())
            );
            if (makeData) {
              this.trailerForm.controls.make.setValue(makeData.name);
              this.trailerForm.controls.year.setValue(vinData.ModelYear);
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

  handleHeight(val: string) {
    const lines = val.split(/\r|\r\n|\n/);
    const count = lines.length;
    this.textRows = count >= 4 ? 4 : count;
  }
  companyOwned() {
    if (this.companyOwnedStateControl) {
      this.trailerForm.controls.owner.setValue(null);
      this.trailerForm.controls.owner.setValidators(null);
    } else {
      this.trailerForm.controls.owner.setValidators(Validators.required);
    }
    this.trailerForm.controls.owner.updateValueAndValidity();
  }

  checkYear(event: any) {
    if (event) {
      const yearLength = event.length;
      if (yearLength === 1 && event !== '1') {
        if (event !== '2') {
          this.trailerForm.get('year').setValue('');
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
      }, 250);
    }
  }

  openTrailerOwnerModal() {
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

    this.trailerForm.controls[inputID].patchValue(
      (document.getElementById(inputID) as HTMLInputElement).value
    );
  }

  onVinTyping(event: any) {
    const k = event.charCode;
    return (k > 64 && k <= 91) || (k >= 96 && k <= 123) || (k >= 48 && k <= 57);
  }

  onUnitTyping(event) {
    let k;
    k = event.charCode;
    return (k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57);
  }
  onModelTyping(event) {
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

  onTrailerTypeChange(event: any) {
    if (event !== undefined) {
      if (this.selectedTrailerType !== '') {
        document.getElementById('trailer-type-dropdown').classList.remove(this.selectedTrailerType);
      }
      document.getElementById('trailer-type-dropdown').classList.add(event.class);
      this.selectedTrailerType = event.class;
    } else {
      document.getElementById('trailer-type-dropdown').classList.remove(this.selectedTrailerType);
      this.selectedTrailerType = event;
    }
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
