import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { BehaviorSubject, Subject, Subscription, Observable } from 'rxjs';
import {
  TableOptions,
  TableColumnDefinition,
  TableData,
  TableSubject,
} from 'src/app/shared/truckassist-table/models/truckassist-table';
import { AppDriverService } from 'src/app/core/services/app-driver.service';
import { DriverLicenseManageComponent } from '../driver-license/driver-license-manage/driver-license-manage.component';
import { DriverDrugManageComponent } from '../driver-drug/driver-drug-manage/driver-drug-manage.component';
import { DriverMedicalManageComponent } from '../driver-medical/driver-medical-manage/driver-medical-manage.component';
import { DriverMvrManageComponent } from '../driver-mvr/driver-mvr-manage/driver-mvr-manage.component';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { DriverManageComponent } from '../driver-manage/driver-manage.component';
import { DriverImportComponent } from '../driver-import/driver-import.component';
import { UserState } from 'src/app/core/model/user';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/core/services/shared.service';
import { UpdatedData } from 'src/app/core/model/shared/enums';
import { formatPhoneNumber, formatSSNfield } from 'src/app/core/helpers/formating';
import {
  getDriverColumnsDefinition,
  getExtendedDriverTableColumnsDefinition,
} from 'src/assets/utils/settings/driver-columns';
import { HttpErrorResponse } from '@angular/common/http';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { SortPipe } from 'src/app/core/pipes/sort.pipe';
import { ClonerService } from 'src/app/core/services/cloner-service';
import { v4 as uuidv4 } from 'uuid';
import { DatePipe } from '@angular/common';
import { NotificationService } from 'src/app/services/notification-service.service';
import { delay, takeUntil } from 'rxjs/operators';

import { cloneDeep } from 'lodash-es';

import {
  DriverData,
  DriverTabData,
  LicenseData,
  UpsertedLicenseData,
} from 'src/app/core/model/driver';
import { DriverState } from 'src/app/root-store/drivers-store/driver.reducer';
import * as driverActions from 'src/app/root-store/drivers-store/driver.actions';
import * as driverSelectors from 'src/app/root-store/drivers-store/driver.selectors';
import { Store } from '@ngrx/store';
import { getApplicantColumnsDefinition } from 'src/assets/utils/settings/applicant-columns';

@Component({
  selector: 'app-driver-table',
  templateUrl: './driver-table.component.html',
  styleUrls: ['./driver-table.component.scss'],
})
export class DriverTableComponent implements OnInit, OnDestroy {
  @Input() inputData: any;
  private destroy$: Subject<void> = new Subject<void>();

  public driverTabData: DriverTabData = null;
  public driversLoading$: Observable<boolean>;

  public tableOptions: TableOptions;
  private tableSubject: BehaviorSubject<TableSubject> = new BehaviorSubject(null);
  public gridColumns: TableColumnDefinition[] = [];
  public extendedGridColumns: TableColumnDefinition[] = [];
  public loadingItems = true;

  constructor(
    private driverService: AppDriverService,
    private customModalService: CustomModalService,
    private toastr: ToastrService,
    private shared: SharedService,
    private spinner: SpinnerService,
    private sortPipe: SortPipe,
    private clonerService: ClonerService,
    private notification: NotificationService,
    private driversStore: Store<DriverState>
  ) {}

  ngOnInit(): void {
    this.driverService.addedDriver
      .pipe(takeUntil(this.destroy$))
      .subscribe((driver: DriverData) => {
        driver.animationType = 'new-item';
        this.driverTabData.allDrivers.push(driver);
        this.driverTabData.activeDrivers.push(driver);
        this.sendDriverData();
        this.shared.emitAddItemAnimationAction.next(driver.id);
        this.loadingItems = false;
      });

    this.driverService.updateItemAction
      .pipe(delay(500))
      .pipe(takeUntil(this.destroy$))
      .subscribe((success: any[]) => {
        for (const id of success) {
          let index = this.driverTabData.allDrivers.findIndex((d) => d.id === id);
          if (index !== -1) {
            this.driverTabData.allDrivers[index].status = this.driverTabData.allDrivers[index]
              .status
              ? 0
              : 1;
            // check active drivers
            index = this.driverTabData.activeDrivers.findIndex((d) => d.id === id);
            if (index !== -1) {
              this.driverTabData.activeDrivers.splice(index, 1);
            }
            // check inactive drivers
            index = this.driverTabData.inactiveDrivers.findIndex((d) => d.id === id);
            if (index !== -1) {
              this.driverTabData.inactiveDrivers.splice(index, 1);
            }
          }
        }

        this.driverTabData.activeDrivers = this.driverTabData.allDrivers.filter(
          (d) => d.status === 1
        );

        this.driverTabData.inactiveDrivers = this.driverTabData.allDrivers.filter(
          (d) => d.status === 0
        );

        this.sendDriverData();
        this.loadingItems = false;
      });

    this.driverService.updatedStatuses
      .pipe(takeUntil(this.destroy$))
      .subscribe((updatedItems: UpdatedData) => {
        if (updatedItems.success && updatedItems.success.length) {
          for (const id of updatedItems.success) {
            let index = this.driverTabData.allDrivers.findIndex((t) => t.id === id);

            if (index !== -1) {
              this.driverTabData.allDrivers[index].animationType = 'update-item';
              // check active drivers
              index = this.driverTabData.activeDrivers.findIndex((d) => d.id === id);
              if (index !== -1) {
                this.driverTabData.activeDrivers[index].animationType = 'update-item';
              }
              // check inactive drivers
              index = this.driverTabData.inactiveDrivers.findIndex((d) => d.id === id);
              if (index !== -1) {
                this.driverTabData.inactiveDrivers[index].animationType = 'update-item';
              }
            }
          }

          this.sendDriverData();
        }

        this.shared.emitUpdateStatusAnimationAction.next(updatedItems.success);
        this.driverService.updateItemAction.next(updatedItems.success);
      });

    this.driverService.updatedDriver
      .pipe(takeUntil(this.destroy$))
      .subscribe((driver: DriverData) => {
        let index = this.driverTabData.allDrivers.findIndex((d) => d.id === driver.id);
        const tempStatus = this.clonerService.deepClone<number>(
          this.driverTabData.allDrivers[index].status
        );

        if (index !== -1) {
          this.driverTabData.allDrivers[index] = driver;
          if (tempStatus !== driver.status) {
            // check active drivers
            index = this.driverTabData.activeDrivers.findIndex((d) => d.id === driver.id);
            if (index !== -1) {
              this.driverTabData.activeDrivers.splice(index, 1);
            }
            // check inactive drivers
            index = this.driverTabData.inactiveDrivers.findIndex((d) => d.id === driver.id);
            if (index !== -1) {
              this.driverTabData.inactiveDrivers.splice(index, 1);
            }
          }
        }

        this.driverTabData.activeDrivers = this.driverTabData.allDrivers.filter(
          (d) => d.status === 1
        );
        this.driverTabData.inactiveDrivers = this.driverTabData.allDrivers.filter(
          (d) => d.status === 0
        );

        this.sendDriverData();
        this.loadingItems = false;
      });

    // this.driverService.upsertedCDL
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((upsertedLicenseData: UpsertedLicenseData) => {
    //     const index = this.driverTabData.allDrivers.findIndex(
    //       (d) => d.id === upsertedLicenseData.driverId
    //     );

    //     if (index !== -1) {
    //       const tempData = this.driverTabData.allDrivers[index].doc.licenseData;
    //       const lIndex = tempData.findIndex((l) => l.id === upsertedLicenseData.licenseData.id);

    //       if (lIndex !== -1) {
    //         tempData[lIndex] = upsertedLicenseData.licenseData;
    //       } else {
    //         tempData.push(upsertedLicenseData.licenseData);
    //       }

    //       this.driverTabData.allDrivers[index].doc.licenseData = this.sortPipe.transform(
    //         tempData,
    //         'endDate'
    //       );
    //     }

    //     this.driverTabData.activeDrivers = this.driverTabData.allDrivers.filter(
    //       (d) => d.status === 1
    //     );
    //     this.driverTabData.inactiveDrivers = this.driverTabData.allDrivers.filter(
    //       (d) => d.status === 0
    //     );

    //     this.sendDriverData();
    //     this.loadingItems = false;
    //   });

    this.driverService.deleteItemAction.pipe(delay(500)).subscribe((success: any[]) => {
      for (const id of success) {
        let index = this.driverTabData.allDrivers.findIndex((t) => t.id === id);

        if (index !== -1) {
          this.driverTabData.allDrivers.splice(index, 1);
          // check active drivers
          index = this.driverTabData.activeDrivers.findIndex((d) => d.id === id);
          if (index !== -1) {
            this.driverTabData.activeDrivers.splice(index, 1);
          }
          // check inactive drivers
          index = this.driverTabData.inactiveDrivers.findIndex((d) => d.id === id);
          if (index !== -1) {
            this.driverTabData.inactiveDrivers.splice(index, 1);
          }
        }
      }

      this.driverTabData.activeDrivers = this.driverTabData.allDrivers.filter(
        (d) => d.status === 1
      );

      this.driverTabData.inactiveDrivers = this.driverTabData.allDrivers.filter(
        (d) => d.status === 0
      );

      this.sendDriverData();
      this.loadingItems = false;
    });

    this.driverService.deletedDrivers
      .pipe(takeUntil(this.destroy$))
      .subscribe((dupdatedItems: UpdatedData) => {
        if (dupdatedItems.success && dupdatedItems.success.length) {
          for (const id of dupdatedItems.success) {
            let index = this.driverTabData.allDrivers.findIndex((t) => t.id === id);

            if (index !== -1) {
              this.driverTabData.allDrivers[index].animationType = 'delete-item';
              // check active drivers
              index = this.driverTabData.activeDrivers.findIndex((d) => d.id === id);
              if (index !== -1) {
                this.driverTabData.activeDrivers[index].animationType = 'delete-item';
              }
              // check inactive drivers
              index = this.driverTabData.inactiveDrivers.findIndex((d) => d.id === id);
              if (index !== -1) {
                this.driverTabData.inactiveDrivers[index].animationType = 'delete-item';
              }
            }
          }

          this.sendDriverData();
        }

        this.shared.emitDeleteItemAnimationAction.next(dupdatedItems.success);
        this.driverService.deleteItemAction.next(dupdatedItems.success);
      });

    this.shared.emitDeleteAction.pipe(takeUntil(this.destroy$)).subscribe((resp: any) => {
      this.callDelete(resp.data.id);
    });

    this.initTableOptions();
    this.getDrivers();
  }

  private initTableOptions(): void {
    this.tableOptions = {
      disabledMutedStyle: null,
      data: this.tableSubject,
      toolbarActions: {
        hideImport: false,
        hideExport: false,
        hideLockUnlock: false,
        hideAddNew: false,
        hideColumns: false,
        hideCompress: false,
        hideLabel: true,
        hideSelectNumber: true,
      },
      config: {
        showSort: true,
        sortBy: '',
        sortDirection: '',
        disabledColumns: [0],
        minWidth: 60,
      },
      mainActions: [
        {
          title: 'Edit Driver',
          name: 'edit-driver',
        },
      ],
      otherActions: [
        {
          title: 'Add CDL',
          name: 'new-licence',
        },
        {
          title: 'Add Medical',
          name: 'new-medical',
        },
        {
          title: 'Add MVR',
          name: 'new-mvr',
        },
        {
          title: 'Add Test',
          name: 'new-drug',
        },
      ],
      activateAction: {
        title: 'Activate',
        reverseTitle: 'Deactivate',
        name: 'activate-item',
      },
      deleteAction: {
        title: 'Delete',
        name: 'delete-item',
        type: 'driver',
        text: 'Are you sure you want to delete driver(s)?',
      },
      export: true,
    };
  }

  public getDrivers(): void {
    this.driversLoading$ = this.driversStore.select(driverSelectors.selectDriverDataLoading);
    this.driversStore
      .select(driverSelectors.selectDriverData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((driverTabData) => {
        this.driverTabData = cloneDeep(driverTabData);
        if (!driverTabData) {
          this.driversStore.dispatch(driverActions.loadDriverData());
        } else {
          this.sendDriverData();
        }
      });
  }

  private getGridColumns(stateName: string, resetColumns: boolean): TableColumnDefinition[] {
    const userState: UserState = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );
    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      if (stateName === 'applicants') {
        return getApplicantColumnsDefinition();
      } else {
        return getDriverColumnsDefinition();
      }
    }
  }

  private getExtendedGridColumns(
    stateName: string,
    resetColumns: boolean
  ): TableColumnDefinition[] {
    const userState: UserState = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );
    if (userState && userState.extendedTableColumns.length && !resetColumns) {
      return userState.extendedTableColumns;
    } else {
      if (stateName === 'applicants') {
        // TODO: add extended applicant columns definition
        return getApplicantColumnsDefinition();
      } else {
        return getExtendedDriverTableColumnsDefinition();
      }
    }
  }

  private sendDriverData(resetColumns?: boolean): void {
    const data: TableData[] = [
      {
        title: 'Applicants',
        field: 'applicants',
        data: [
          {
            name: 'Novak Djokovic',
            dob: '01/01/2021',
            phone: '(111) 111-1111',
            email: 'test@email.com',
            app: 10,
            mvr: 10,
            psp: 10,
            sph: 10,
            ssn: 9,
            medical: [{
              endDate: "2025-01-10T06:00:00Z",
              id: "092f34ad-9bfe-4a75-b391-f488cd05b283",
              startDate: "2021-01-12T06:00:00Z",
            }],
            cdl: [{
              endDate: "2025-01-02T06:00:00Z",
              id: "092f34ad-9bfe-4a75-b391-f488cd05b284",
              startDate: "2021-01-12T06:00:00Z",
            }],
            rev: 1,
            note: '',
            files: [],
          },
          {
            name: 'Rafael Nadal',
            dob: '01/01/2021',
            phone: '(111) 111-1111',
            email: 'test@email.com',
            app: 10,
            mvr: 10,
            psp: 10,
            sph: null,
            ssn: 0,
            medical: [{
              endDate: "2021-01-10T06:00:00Z",
              id: "092f34ad-9bfe-4a75-b391-f488cd05b283",
              startDate: "2020-01-12T06:00:00Z",
            }],
            cdl: [{
              endDate: "2021-01-02T06:00:00Z",
              id: "092f34ad-9bfe-4a75-b391-f488cd05b284",
              startDate: "2020-01-12T06:00:00Z",
            }],
            rev: 0,
            note: '',
            files: [],
          },
          {
            name: 'Roger Federer',
            dob: '01/01/2021',
            phone: '(111) 111-1111',
            email: 'test@email.com',
            app: 10,
            mvr: 10,
            psp: 10,
            sph: 1,
            ssn: 0,
            medical: [{
              endDate: "2020-02-10T06:00:00Z",
              id: "092f34ad-9bfe-4a75-b391-f488cd05b283",
              startDate: "2020-01-04T06:00:00Z",
            }],
            cdl: [{
              endDate: "2020-01-12T06:00:00Z",
              id: "092f34ad-9bfe-4a75-b391-f488cd05b284",
              startDate: "2020-01-05T06:00:00Z",
            }],
            rev: 1,
            note: '',
            files: [],
          }
        ],
        extended: true,
        gridNameTitle: 'Applicant',
        stateName: 'applicants',
        gridColumns: this.getGridColumns('applicants', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('applicants', resetColumns),
      },
      {
        title: 'Active',
        field: 'active',
        data:
          this.driverTabData && this.driverTabData.activeDrivers
            ? this.driverTabData.activeDrivers
            : [],
        extended: false,
        gridNameTitle: 'Driver',
        stateName: 'drivers',
        gridColumns: this.getGridColumns('drivers', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('drivers', resetColumns),
      },
      {
        title: 'Inactive',
        field: 'inactive',
        data:
          this.driverTabData && this.driverTabData.inactiveDrivers
            ? this.driverTabData.inactiveDrivers
            : [],
        extended: false,
        gridNameTitle: 'Driver',
        stateName: 'drivers',
        gridColumns: this.getGridColumns('drivers', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('drivers', resetColumns),
      },
      {
        title: 'All',
        field: null,
        data:
          this.driverTabData && this.driverTabData.allDrivers ? this.driverTabData.allDrivers : [],
        extended: false,
        gridNameTitle: 'Driver',
        stateName: 'drivers',
        gridColumns: this.getGridColumns('drivers', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('drivers', resetColumns),
      },
    ];
    this.tableSubject.next({ tableData: data, check: true });
  }

  public callAction(data: any): void {
    if (this.driverTabData && this.driverTabData.allDrivers.length && data.id) {
      const driver = this.driverTabData.allDrivers.find((t) => t.id === data.id);
      data.driver = driver ? driver : null;
      data.prefix = true;
    }
    if (data.type === 'edit-driver') {
      this.openQuickEdit(data.id);
    } else if (data.type === 'new-licence') {
      this.newLicence(data);
    } else if (data.type === 'new-medical') {
      this.newMedical(data);
    } else if (data.type === 'new-mvr') {
      this.newMvr(data);
    } else if (data.type === 'new-drug') {
      this.newDrug(data);
    } else if (data.type === 'status-event') {
      this.callStatus(data);
    } else if (data.type === 'import-event') {
      this.callImport();
    } else if (data.type === 'insert-event') {
      this.callInsert();
    } else if (data.type === 'init-columns-event') {
      this.sendDriverData(true);
    } else if (data.type === 'activate-item') {
      data.selection = [{ id: data.id }];
      this.callStatus(data);
    } else if (data.type === 'delete-item') {
      this.deleteDriver(data.id);
    } else if (data.type === 'save-note-event') {
      this.saveNote(data);
    }
  }

  private saveNote(data: any) {
    const saveData: DriverData = this.clonerService.deepClone<DriverData>(data.driver);
    saveData.ssn = saveData.ssn.toString().split('-').join('');
    saveData.doc.additionalData.note = data.value;

    this.spinner.show(true);
    this.driverService
      .updateDriverData(saveData, saveData.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.notification.success('Driver Note has been updated.', 'Success:');
          this.spinner.show(false);
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  private deleteDriver(id: any) {
    this.spinner.show(true);
    this.driverService
      .deleteAllDrivers([{ id }])
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

  public openQuickEdit(id: any): void {
    const data = {
      type: 'edit',
      id,
    };
    this.customModalService.openModal(DriverManageComponent, { data }, null, { size: 'small' });
  }

  public newLicence(data: any): void {
    data.type = 'new';
    this.customModalService.openModal(DriverLicenseManageComponent, { data }, null, {
      size: 'small',
    });
  }

  public newDrug(data: any): void {
    data.type = 'new';
    this.customModalService.openModal(DriverDrugManageComponent, { data }, null, {
      size: 'small',
    });
  }

  public newMedical(data: any): void {
    data.type = 'new';
    this.customModalService.openModal(DriverMedicalManageComponent, { data }, null, {
      size: 'small',
    });
  }

  public newMvr(data: any): void {
    data.type = 'new';
    this.customModalService.openModal(DriverMvrManageComponent, { data }, null, { size: 'small' });
  }

  public callImport(): void {
    this.customModalService.openModal(DriverImportComponent);
  }

  public callInsert(): void {
    const data = {
      type: 'new',
      id: null,
    };
    this.customModalService.openModal(DriverManageComponent, { data }, null, { size: 'small' });
  }

  public callDelete(id: number): void {
    this.driverService
      .deleteAllDrivers([{ id }])
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

  public callStatus(event: any): void {
    this.driverService
      .changeDriverStatuses(event.selection)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: UpdatedData) => {
          if (event.tab === 'active' && response.success.length === 1) {
            this.toastr.success('Driver has been deactivated.', 'Success');
          } else if (event.tab === 'active' && response.success.length > 1) {
            this.toastr.success('Drivers have been deactivated.', 'Success');
          } else if (event.tab === 'inactive' && response.success.length === 1) {
            this.toastr.success('Driver has been activated.', 'Success');
          } else if (event.tab === 'inactive' && response.success.length > 1) {
            this.toastr.success('Drivers have been activated.', 'Success');
          }

          // failed drivers
          if (response.failure.length) {
            for (const id of response.failure) {
              if (event.tab === 'inactive') {
                this.toastr.warning(`Driver with Id: '${id}' hasn't been activated.`, 'Warning');
              } else {
                this.toastr.warning(`Driver with Id: '${id}' hasn't been deactivated.`, 'Warning');
              }
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
