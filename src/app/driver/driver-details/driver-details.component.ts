import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, Subject, Subscription } from 'rxjs';
import { ManageCompany } from 'src/app/core/model/company';
import { OwnerData } from 'src/app/core/model/shared/owner';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import {
  HistoryData,
  TruckassistHistoryDataComponent,
} from 'src/app/shared/truckassist-history-data/truckassist-history-data.component';
import { formatAddress } from 'src/assets/utils/settings/formatting';
import { v4 as uuidv4 } from 'uuid';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ClonerService } from 'src/app/core/services/cloner-service';
import {
  AdditionalData,
  DriverData,
  DriverTabData,
  UpsertedLicenseData,
} from 'src/app/core/model/driver';
import { AppDriverService } from 'src/app/core/services/app-driver.service';
import { DriverManageComponent } from '../driver-manage/driver-manage.component';
import { DriverLicenseManageComponent } from '../driver-license/driver-license-manage/driver-license-manage.component';
import { formatPhoneNumber, formatSSNfield } from 'src/app/core/helpers/formating';
import { ClipboardService } from 'ngx-clipboard';
import { DriverDrugManageComponent } from '../driver-drug/driver-drug-manage/driver-drug-manage.component';
import { DriverMedicalManageComponent } from '../driver-medical/driver-medical-manage/driver-medical-manage.component';
import { DriverMvrManageComponent } from '../driver-mvr/driver-mvr-manage/driver-mvr-manage.component';
import { ToastrService } from 'ngx-toastr';
import { UpdatedData } from 'src/app/core/model/shared/enums';
import { SortPipe } from 'src/app/core/pipes/sort.pipe';
import { Store } from '@ngrx/store';
import { DriverState } from 'src/app/root-store/drivers-store/driver.reducer';
import * as driverActions from 'src/app/root-store/drivers-store/driver.actions';
import * as driverSelectors from 'src/app/root-store/drivers-store/driver.selectors';
import { takeUntil } from 'rxjs/operators';
import { cloneDeep } from 'lodash-es';

@Component({
  selector: 'app-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.scss'],
})
export class DriverDetailsComponent implements OnInit, OnDestroy {
  @ViewChild(TruckassistHistoryDataComponent)
  truckassistHistoryDataComponent: TruckassistHistoryDataComponent;
  @ViewChild('autoComplete') autoComplete;

  private destroy$: Subject<void> = new Subject<void>();
  public driverTabDate: DriverTabData = null;
  public driversLoading$: Observable<boolean>;

  loading = false;
  statusLoading = false;
  driverTabData: DriverTabData = null;
  driver: DriverData = null;
  owner: OwnerData = null;
  activityHistory: HistoryData[] = [];
  keyword = 'fullName';
  id: number;
  options: any = [];
  truckAutocompleteControl = new FormControl();
  showNote = false;
  noteChanged = false;
  textRows = 1;
  noteControl = new FormControl();
  userCompany: ManageCompany = null;
  enableAutoComplete = false;
  showUploadZone = false;
  additionalData: AdditionalData;
  copiedPhone = false;
  copiedEmail = false;
  copiedSSN = false;
  copiedDOB = false;
  avatarError = false;

  public dropdownOptions: any = {
    mainActions: [
      {
        title: 'Edit',
        name: 'edit-driver',
      },
    ],
    otherActions: [],
    deleteAction: {
      title: 'Delete',
      name: 'delete-item',
      type: 'driver',
      text: 'Are you sure you want to delete driver?',
    },
  };

  constructor(
    private customModalService: CustomModalService,
    public driverService: AppDriverService,
    private route: ActivatedRoute,
    private shared: SharedService,
    public router: Router,
    private spinner: SpinnerService,
    private notification: NotificationService,
    private datePipe: DatePipe,
    private clonerService: ClonerService,
    private clipboardService: ClipboardService,
    private toastr: ToastrService,
    private sortPipe: SortPipe,
    private driversStore: Store<DriverState>
  ) {

    this.route.params
    .pipe(takeUntil(this.destroy$))
    .subscribe((params) => {
      this.id = params.id;
    });
  }

  ngOnInit(): void {
    this.getUserCompany();
    this.getDrivers();
    this.getDriverData();

    this.driverService.updatedDriver
    .pipe(takeUntil(this.destroy$))
    .subscribe((driver: DriverData) => {
      this.avatarError = false;
      this.driver = driver;
      this.additionalData =
        this.driver && this.driver.doc && this.driver.doc.additionalData
          ? this.driver.doc.additionalData
          : null;
      this.activityHistory =
        driver && driver.doc && this.driver.doc.workData ? this.driver.doc.workData : [];
      this.truckassistHistoryDataComponent.loadData(this.activityHistory);
      this.createForm();
    });

    this.driverService.upsertedCDL
    .pipe(takeUntil(this.destroy$))
    .subscribe((upsertedLicenseData: UpsertedLicenseData) => {
      const tempData = this.driver.doc.licenseData;
      const lIndex = tempData.findIndex((l) => l.id === upsertedLicenseData.licenseData.id);

      if (lIndex !== -1) {
        tempData[lIndex] = upsertedLicenseData.licenseData;
      } else {
        tempData.push(upsertedLicenseData.licenseData);
      }

      this.driver.doc.licenseData = this.sortPipe.transform(tempData, 'endDate');
    });

    this.shared.emitDeleteAction
    .pipe(takeUntil(this.destroy$))
    .subscribe((resp: any) => {
      if (resp.data && resp.data.id && resp.data.type === 'delete-item') {
        this.deleteDriver(resp.data.id);
      }
    });
  }

  public editAvatar(): void {
    this.showUploadZone = true;
  }

  getUserCompany() {
    this.userCompany = JSON.parse(localStorage.getItem('userCompany'));
  }

  public getDrivers(): void {
    this.driversLoading$ = this.driversStore.select(driverSelectors.selectDriverDataLoading);
    this.driversStore
      .select(driverSelectors.selectDriverData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((driverTabData: DriverTabData) => {
        this.driverTabDate = cloneDeep(driverTabData);
        if (!driverTabData) {
          this.driversStore.dispatch(driverActions.loadDriverData());
        } else {
          this.driverTabData = driverTabData;
          this.enableAutoComplete = this.driverTabData.allDrivers.length > 1;
          this.options = this.driverTabData.allDrivers;
        }
      });
  }

  public getDriverData() {
    // const driverList$ = this.driverService.getDrivers();
    const driver$ = this.driverService.getDriverData(this.id, 'all');

    this.loading = true;

    forkJoin([driver$])
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      ([driver]: [DriverData]) => {
        this.driver = driver;
        this.additionalData =
          this.driver && this.driver.doc && this.driver.doc.additionalData
            ? this.driver.doc.additionalData
            : null;
        this.activityHistory =
          driver && driver.doc && this.driver.doc.workData ? this.driver.doc.workData : [];

        this.driver.fullName = `${this.driver.firstName + ' ' + this.driver.lastName}`;
        this.createForm();
        this.loading = false;
      },
      () => {
        this.shared.handleServerError();
      }
    );
  }

  public createForm() {
    this.noteControl.setValue(
      this.driver.doc.additionalData && this.driver.doc.additionalData.note
        ? this.driver.doc.additionalData.note
        : ''
    );

    if (this.noteControl.value.length) {
      this.handleHeight(this.noteControl.value);
      this.showNote = true;
    }

    if (this.driver.status) {
      this.noteControl.enable();
    } else {
      this.noteControl.disable();
    }
  }

  public openAction(data: any): void {
    if (data.type === 'edit-driver') {
      data.driver = this.driver;
      this.openDriverEdit(data.id);
    } else if (data.type === 'delete-item') {
      this.deleteDriver(data.id);
    }
  }

  private openDriverEdit(id: number) {
    const data = {
      type: 'edit',
      id,
    };
    this.customModalService.openModal(DriverManageComponent, { data }, null, { size: 'small' });
  }

  private deleteDriver(id: any) {
    this.spinner.show(true);
    this.driverService.deleteAllDrivers([{ id }])
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (response: UpdatedData) => {
        if (response.success.length === 1) {
          this.toastr.success('Driver has been deleted.', 'Success');
        } else if (response.success.length > 1) {
          this.toastr.success('Drivers have been deleted.', 'Success');
        }

        // failed drivers
        if (response.failure.length) {
          for (const id of response.failure) {
            this.toastr.warning(`Driver with Id: '${id}' hasn't been deleted.`, 'Warning');
          }
        }

        // not exist drivers
        if (response.notExist.length) {
          for (const id of response.notExist) {
            this.toastr.warning(`Driver with Id: '${id}' doesn't exist.`, 'Warning');
          }
        }
      },
      (error: HttpErrorResponse) => {
        this.shared.handleError(error);
      }
    );
  }

  changeStatus(id: any) {
    const saveData: DriverData = this.clonerService.deepClone<DriverData>(this.driver);
    saveData.status = this.driver.status ? 0 : 1;

    if (this.driver.status) {
      this.noteControl.enable();
    } else {
      this.noteControl.disable();
    }

    if (saveData.doc.workData.length) {
      if (saveData.status) {
        saveData.doc.workData.push({
          id: uuidv4(),
          startDate: new Date(),
          startDateShort: this.datePipe.transform(new Date(), 'shortDate'),
          endDate: null,
          endDateShort: null,
          header: saveData.doc.workData[saveData.doc.workData.length - 1].header,
        });
      } else {
        if (saveData.doc.workData.length) {
          saveData.doc.workData[saveData.doc.workData.length - 1].endDate = new Date();
          saveData.doc.workData[
            saveData.doc.workData.length - 1
          ].endDateShort = this.datePipe.transform(new Date(), 'shortDate');
        }
      }
    }

    this.spinner.show(true);
    this.statusLoading = true;
    this.driverService.updateDriverData(saveData, id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      () => {
        this.notification.success('Driver Status has been updated.', 'Success:');
        this.spinner.show(false);
        this.statusLoading = false;
      },
      () => {
        this.shared.handleServerError();
      }
    );
  }

  public updateDriverNote(newNote: string): void {
    const saveData: DriverData = this.clonerService.deepClone<DriverData>(this.driver);
    saveData.status = this.driver.status ? 1 : 0;
    saveData.doc.additionalData.note = newNote;
    this.driverService.updateDriverData(saveData, this.driver.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      () => {
        this.notification.success(`The Note has been updated.`, 'Success:');
      },
      (error: HttpErrorResponse) => {
        this.shared.handleError(error);
      }
    );
  }

  public saveHistoryData(event: any): void {
    const historyData: HistoryData[] = event.data;
    const index: number = event.index;
    const isStartDate: boolean = event.isStartDate;

    this.driver.doc.workData = historyData.map((wd) => {
      delete wd.editStartDate;
      delete wd.editEndDate;
      return wd;
    });

    const saveData: DriverData = this.clonerService.deepClone<DriverData>(this.driver);
    saveData.status = this.driver.status ? 1 : 0;

    if (
      saveData.doc.workData.length &&
      index === saveData.doc.workData.length - 1 &&
      !isStartDate
    ) {
      saveData.status = saveData.doc.workData[saveData.doc.workData.length - 1].endDate ? 0 : 1;
    }

    this.spinner.show(true);

    this.driverService.updateDriverData(saveData, this.driver.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      () => {
        if (isStartDate) {
          this.notification.success('Driver Start Date has been updated.', 'Success:');
        } else {
          this.notification.success('Driver End Date has been updated.', 'Success:');
        }
        this.spinner.show(false);
      },
      (error: HttpErrorResponse) => {
        this.shared.handleError(error);
      }
    );
  }

  public removeHistoryData(index: number): void {
    const tempData: HistoryData[] = Object.assign([], this.activityHistory);

    if (index !== -1) {
      tempData.splice(index, 1);
    }

    const saveData: DriverData = this.clonerService.deepClone<DriverData>(this.driver);
    saveData.status = tempData[tempData.length - 1].endDate ? 0 : 1;
    saveData.doc.workData = tempData;

    this.spinner.show(true);
    this.driverService.updateDriverData(saveData, this.driver.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      () => {
        this.notification.success('Driver History Item has been removed.', 'Success:');
        this.spinner.show(false);
      },
      (error: HttpErrorResponse) => {
        this.shared.handleError(error);
      }
    );
  }

  public printProfile() {
    return;
  }

  public formatAddress(address: string, unit: string, index: number) {
    return formatAddress(address, unit, index);
  }

  handleHeight(val: string) {
    const lines = val.split(/\r|\r\n|\n/);
    const count = lines.length;
    this.textRows = count >= 4 ? 4 : count;
  }

  public copy(event: any, element: string): void {
    event.stopPropagation();
    const additionalData = this.driver.doc.additionalData;
    if (element === 'phone') {
      this.clipboardService.copy(formatPhoneNumber(additionalData.phone));
      this.copiedPhone = true;
      setTimeout(() => {
        this.copiedPhone = false;
      }, 500);
    } else if (element === 'email') {
      this.clipboardService.copy(additionalData.email);
      this.copiedEmail = true;
      setTimeout(() => {
        this.copiedEmail = false;
      }, 500);
    } else if (element === 'ssn') {
      this.clipboardService.copy(formatSSNfield(this.driver.ssn.toString()));
      this.copiedSSN = true;
      setTimeout(() => {
        this.copiedSSN = false;
      }, 500);
    } else if (element === 'dob') {
      this.clipboardService.copy(additionalData.birthDateShort.toString());
      this.copiedDOB = true;
      setTimeout(() => {
        this.copiedDOB = false;
      }, 500);
    }
  }

  public callSaveAvatar(event: any) {
    const newAvatar = event;

    const saveData: DriverData = this.clonerService.deepClone<DriverData>(this.driver);
    saveData.doc.additionalData.avatar = {
      id: uuidv4(),
      src: newAvatar,
    };

    this.driverService.updateDriverData(saveData, this.driver.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      () => {
        this.notification.success(`Driver Avatar has been updated.`, 'Success:');
        this.showUploadZone = false;
      },
      (error: HttpErrorResponse) => {
        this.shared.handleError(error);
      }
    );
  }

  public callCancel(event: any) {
    this.showUploadZone = false;
  }

  public addNewLicence(): void {
    const data = {
      type: 'new',
      driver: this.driver,
      id: this.id,
    };
    this.customModalService.openModal(DriverLicenseManageComponent, { data }, null, {
      size: 'small',
    });
  }

  addNewDrug() {
    const data = {
      type: 'new',
      driver: this.driver,
      id: this.id,
    };
    this.customModalService.openModal(DriverDrugManageComponent, { data }, null, { size: 'small' });
  }

  addNewMedical() {
    const data = {
      type: 'new',
      driver: this.driver,
      id: this.id,
    };
    this.customModalService.openModal(DriverMedicalManageComponent, { data }, null, {
      size: 'small',
    });
  }

  addNewewMvr() {
    const data = {
      type: 'new',
      driver: this.driver,
      id: this.id,
    };
    this.customModalService.openModal(DriverMvrManageComponent, { data }, null, { size: 'small' });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
