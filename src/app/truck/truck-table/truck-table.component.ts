import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription, Subject, BehaviorSubject, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {
  TableOptions,
  TableColumnDefinition,
  TableData,
  TableSubject,
} from '../../shared/truckassist-table/models/truckassist-table';
import { UserState } from 'src/app/core/model/user';
import { SharedService } from 'src/app/core/services/shared.service';
import { TruckData, TruckTabData } from 'src/app/core/model/truck';
import { AppTruckService } from 'src/app/core/services/app-truck.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { TruckManageComponent } from '../truck-manage/truck-manage.component';
import { TruckImportComponent } from '../truck-import/truck-import.component';
import {
  getExtendedTruckColumnDefinition,
  getTruckColumnDefinition,
} from 'src/assets/utils/settings/truck-columns';
import { TruckLicenseManageComponent } from '../truck-licence/truck-license-manage/truck-license-manage.component';
import { TruckInspectionManageComponent } from '../truck-inspection/truck-inspection-manage/truck-inspection-manage.component';
import { DeletedItem, UpdatedData } from 'src/app/core/model/shared/enums';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SortPipe } from 'src/app/core/pipes/sort.pipe';
import { ClonerService } from 'src/app/core/services/cloner-service';
import { v4 as uuidv4 } from 'uuid';
import { DatePipe } from '@angular/common';
import { delay, takeUntil } from 'rxjs/operators';

import { TruckState } from 'src/app/root-store/trucks-store/trucks.reducer';
import * as trucksActions from 'src/app/root-store/trucks-store/trucks.actions';
import * as trucksSelectors from 'src/app/root-store/trucks-store/trucks.selectors';
import { Store } from '@ngrx/store';

import { cloneDeep } from 'lodash-es';

@Component({
  templateUrl: './truck-table.component.html',
  styleUrls: ['./truck-table.component.scss'],
})
export class TruckTableComponent implements OnInit, OnDestroy {
  @Input() inputData: any;

  private destroy$: Subject<void> = new Subject<void>();

  public truckTabData: TruckTabData = null;
  public trucksLoading$: Observable<boolean>;

  public tableOptions: TableOptions;
  private tableSubject: BehaviorSubject<TableSubject> = new BehaviorSubject(null);
  public truckColumns: TableColumnDefinition[] = [];
  public extendedColumns: TableColumnDefinition[] = [];
  public loadingItems = true;

  constructor(
    private truckService: AppTruckService,
    private customModalService: CustomModalService,
    private shared: SharedService,
    private notification: NotificationService,
    private spinner: SpinnerService,
    private toastr: ToastrService,
    private sortPipe: SortPipe,
    private clonerService: ClonerService,
    private datePipe: DatePipe,
    private cdRef: ChangeDetectorRef,
    private trucksStore: Store<TruckState>
  ) {}

  ngOnInit(): void {
    this.truckService.addedTruck.pipe(takeUntil(this.destroy$)).subscribe((truck: TruckData) => {
      truck.animationType = 'new-item';
      this.truckTabData.allTrucks.push(truck);
      this.truckTabData.activeTrucks.push(truck);
      this.sendTruckData();
      this.shared.emitAddItemAnimationAction.next(truck.id);
      this.loadingItems = false;
    });

    //   this.truckService.updateItemAction.pipe(delay(500), takeUntil(this.destroy$)).subscribe((success: any[]) => {
    //     let checkActive = true;

    //     for (const id of success) {
    //       let index = this.truckTabData.allTrucks.findIndex((d) => d.id === id);
    //       if (index !== -1) {
    //         this.truckTabData.allTrucks[index].status = this.truckTabData.allTrucks[index]
    //           .status
    //           ? 0
    //           : 1;
    //         // check active trucks
    //         index = this.truckTabData.inactiveTrucks.findIndex((d) => d.id === id);
    //         if (index !== -1) {
    //           this.truckTabData.inactiveTrucks.splice(index, 1);
    //           checkActive = false;
    //         }
    //         // check inactive trucks
    //         index = this.truckTabData.inactiveTrucks.findIndex((d) => d.id === id);
    //         if (index !== -1) {
    //           this.truckTabData.inactiveTrucks.splice(index, 1);
    //           checkActive = true;
    //         }
    //       }
    //     }

    //     if (checkActive) {
    //       this.truckTabData.activeTrucks = this.truckTabData.allTrucks.filter(
    //         (d) => d.status === 1
    //       );
    //     } else {
    //       this.truckTabData.inactiveTrucks = this.truckTabData.allTrucks.filter(
    //         (d) => d.status === 0
    //       );
    //     }

    //     this.sendTruckData();
    //     this.loadingItems = false;
    //   })

    //   this.truckService.updatedStatuses.pipe(takeUntil(this.destroy$)).subscribe((updatedItems: UpdatedData) => {
    //     if (updatedItems.success && updatedItems.success.length) {

    //       for (const id of updatedItems.success) {
    //         let index = this.truckTabData.allTrucks.findIndex((t) => t.id === id);

    //         if (index !== -1) {
    //           this.truckTabData.allTrucks[index].animationType = "update-item";
    //           // check active trucks
    //           index = this.truckTabData.activeTrucks.findIndex((d) => d.id === id);
    //           if (index !== -1) {
    //             this.truckTabData.activeTrucks[index].animationType = "update-item";
    //           }
    //           // check inactive trucks
    //           index = this.truckTabData.inactiveTrucks.findIndex((d) => d.id === id);
    //           if (index !== -1) {
    //             this.truckTabData.inactiveTrucks[index].animationType = "update-item";
    //           }
    //         }
    //       }

    //       this.sendTruckData();
    //     }

    //     this.shared.emitUpdateStatusAnimationAction.next(updatedItems.success);
    //     this.truckService.updateItemAction.next(updatedItems.success);
    //   })

    this.truckService.updateItemAction
      .pipe(delay(500), takeUntil(this.destroy$))
      .subscribe((success: any[]) => {
        for (const id of success) {
          let index = this.truckTabData.allTrucks.findIndex((d) => d.id === id);
          if (index !== -1) {
            this.truckTabData.allTrucks[index].status = this.truckTabData.allTrucks[index].status
              ? 0
              : 1;
            // check active trucks
            index = this.truckTabData.activeTrucks.findIndex((d) => d.id === id);
            if (index !== -1) {
              this.truckTabData.activeTrucks.splice(index, 1);
            }
            // check inactive trucks
            index = this.truckTabData.inactiveTrucks.findIndex((d) => d.id === id);
            if (index !== -1) {
              this.truckTabData.inactiveTrucks.splice(index, 1);
            }
          }
        }

        this.truckTabData.activeTrucks = this.truckTabData.allTrucks.filter((d) => d.status === 1);

        this.truckTabData.inactiveTrucks = this.truckTabData.allTrucks.filter(
          (d) => d.status === 0
        );

        this.sendTruckData();
        this.loadingItems = false;
      });

    this.truckService.updatedStatuses
      .pipe(takeUntil(this.destroy$))
      .subscribe((updatedItems: UpdatedData) => {
        if (updatedItems.success && updatedItems.success.length) {
          for (const id of updatedItems.success) {
            let index = this.truckTabData.allTrucks.findIndex((t) => t.id === id);

            if (index !== -1) {
              this.truckTabData.allTrucks[index].animationType = 'update-item';
              // check active trucks
              index = this.truckTabData.activeTrucks.findIndex((d) => d.id === id);
              if (index !== -1) {
                this.truckTabData.activeTrucks[index].animationType = 'update-item';
              }
              // check inactive trucks
              index = this.truckTabData.inactiveTrucks.findIndex((d) => d.id === id);
              if (index !== -1) {
                this.truckTabData.inactiveTrucks[index].animationType = 'update-item';
              }
            }
          }

          this.sendTruckData();
        }

        this.shared.emitUpdateStatusAnimationAction.next(updatedItems.success);
        this.truckService.updateItemAction.next(updatedItems.success);
      });

    this.truckService.updatedTruck.pipe(takeUntil(this.destroy$)).subscribe((truck: TruckData) => {
      let index = this.truckTabData.allTrucks.findIndex((d) => d.id === truck.id);
      const tempStatus = this.clonerService.deepClone<number>(
        this.truckTabData.allTrucks[index].status
      );

      if (index !== -1) {
        this.truckTabData.allTrucks[index] = truck;

        if (tempStatus !== truck.status) {
          // check active trucks
          index = this.truckTabData.activeTrucks.findIndex((d) => d.id === truck.id);
          if (index !== -1) {
            this.truckTabData.activeTrucks.splice(index, 1);
          }
          // check inactive trucks
          index = this.truckTabData.inactiveTrucks.findIndex((d) => d.id === truck.id);
          if (index !== -1) {
            this.truckTabData.inactiveTrucks.splice(index, 1);
          }
        }
      }

      this.truckTabData.activeTrucks = this.truckTabData.allTrucks.filter((d) => d.status === 1);

      this.truckTabData.inactiveTrucks = this.truckTabData.allTrucks.filter((d) => d.status === 0);

      this.sendTruckData();
      this.loadingItems = false;
    });

    this.truckService.deleteItemAction
      .pipe(delay(500), takeUntil(this.destroy$))
      .subscribe((success: any[]) => {
        let checkActive = true;

        for (const id of success) {
          let index = this.truckTabData.allTrucks.findIndex((t) => t.id === id);

          if (index !== -1) {
            this.truckTabData.allTrucks.splice(index, 1);
            // check active trucks
            index = this.truckTabData.activeTrucks.findIndex((d) => d.id === id);
            if (index !== -1) {
              this.truckTabData.activeTrucks.splice(index, 1);
              checkActive = false;
            }
            // check inactive trucks
            index = this.truckTabData.inactiveTrucks.findIndex((d) => d.id === id);
            if (index !== -1) {
              this.truckTabData.inactiveTrucks.splice(index, 1);
              checkActive = true;
            }
          }
        }

        if (checkActive) {
          this.truckTabData.activeTrucks = this.truckTabData.allTrucks.filter(
            (d) => d.status === 1
          );
        } else {
          this.truckTabData.inactiveTrucks = this.truckTabData.allTrucks.filter(
            (d) => d.status === 0
          );
        }

        this.sendTruckData();
        this.loadingItems = false;
      });

    this.truckService.deletedTrucks
      .pipe(takeUntil(this.destroy$))
      .subscribe((dupdatedItems: UpdatedData) => {
        if (dupdatedItems.success && dupdatedItems.success.length) {
          for (const id of dupdatedItems.success) {
            let index = this.truckTabData.allTrucks.findIndex((t) => t.id === id);

            if (index !== -1) {
              this.truckTabData.allTrucks[index].animationType = 'delete-item';
              // check active trucks
              index = this.truckTabData.activeTrucks.findIndex((d) => d.id === id);
              if (index !== -1) {
                this.truckTabData.activeTrucks[index].animationType = 'delete-item';
              }
              // check inactive trucks
              index = this.truckTabData.inactiveTrucks.findIndex((d) => d.id === id);
              if (index !== -1) {
                this.truckTabData.inactiveTrucks[index].animationType = 'delete-item';
              }
            }
          }

          this.sendTruckData();
        }

        this.shared.emitDeleteItemAnimationAction.next(dupdatedItems.success);
        this.truckService.deleteItemAction.next(dupdatedItems.success);
      });

    this.shared.emitDeleteAction.pipe(takeUntil(this.destroy$)).subscribe((resp: any) => {
      this.callDelete([{ id: resp.data.id }]);
    });

    this.initTableOptions();
    this.getTrucks();
  }

  private initTableOptions(): void {
    this.tableOptions = {
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
          title: 'Edit Truck',
          name: 'edit-truck',
        },
      ],
      otherActions: [
        {
          title: 'Add Registration',
          name: 'add-registration',
        },
        {
          title: 'Add Inspection',
          name: 'add-inspection',
        },
        {
          title: 'Add Repair',
          name: 'add-repair',
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
        type: 'truck',
        text: 'Are you sure you want to delete truck(s)?',
      },
      export: true,
    };
  }

  public getTrucks(): void {
    this.trucksLoading$ = this.trucksStore.select(trucksSelectors.selectTruckDataLoading);
    this.trucksStore
      .select(trucksSelectors.selectTruckData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((truckTabData) => {
        this.truckTabData = cloneDeep(truckTabData);
        if (!truckTabData) {
          this.trucksStore.dispatch(trucksActions.loadTruckData());
        } else {
          this.sendTruckData();
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
      return getTruckColumnDefinition();
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
      return getExtendedTruckColumnDefinition();
    }
  }

  private sendTruckData(resetColumns?: boolean): void {
    const data: TableData[] = [
      {
        title: 'Active',
        field: 'active',
        data: this.truckTabData.activeTrucks
          ? this.truckTabData.activeTrucks.map((truck) => {
              truck.commission =
                truck.companyOwned || truck.divisionFlag
                  ? undefined
                  : truck.commission.toString().includes('%')
                  ? truck.commission
                  : truck.commission + '%';
              truck.doc.inspectionData = this.sortPipe.transform(
                truck.doc.inspectionData,
                'startDate'
              );
              truck.doc.licenseData = this.sortPipe.transform(truck.doc.licenseData, 'endDate');
              truck.doc.titleData = this.sortPipe.transform(truck.doc.titleData, 'startDate');
              truck.doc.truckLeaseData = this.sortPipe.transform(truck.doc.truckLeaseData, 'date');
              return truck;
            })
          : [],
        extended: false,
        gridNameTitle: 'Truck',
        stateName: 'trucks',
        gridColumns: this.getGridColumns('trucks', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('trucks', resetColumns),
      },
      {
        title: 'Inactive',
        field: 'inactive',
        data: this.truckTabData.inactiveTrucks ? this.truckTabData.inactiveTrucks.map((truck) => {
          truck.commission =
            truck.companyOwned || truck.divisionFlag
              ? undefined
              : truck.commission.toString().includes('%')
              ? truck.commission
              : truck.commission + '%';
          truck.doc.inspectionData = this.sortPipe.transform(
            truck.doc.inspectionData,
            'startDate'
          );
          truck.doc.licenseData = this.sortPipe.transform(truck.doc.licenseData, 'endDate');
          truck.doc.titleData = this.sortPipe.transform(truck.doc.titleData, 'startDate');
          truck.doc.truckLeaseData = this.sortPipe.transform(truck.doc.truckLeaseData, 'date');
          return truck;
        }) : [],
        extended: false,
        gridNameTitle: 'Truck',
        stateName: 'trucks',
        gridColumns: this.getGridColumns('trucks', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('trucks', resetColumns),
      },
      {
        title: 'All',
        field: null,
        data: this.truckTabData.allTrucks ? this.truckTabData.allTrucks.map((truck) => {
          truck.commission =
            truck.companyOwned || truck.divisionFlag
              ? undefined
              : truck.commission.toString().includes('%')
              ? truck.commission
              : truck.commission + '%';
          truck.doc.inspectionData = this.sortPipe.transform(
            truck.doc.inspectionData,
            'startDate'
          );
          truck.doc.licenseData = this.sortPipe.transform(truck.doc.licenseData, 'endDate');
          truck.doc.titleData = this.sortPipe.transform(truck.doc.titleData, 'startDate');
          truck.doc.truckLeaseData = this.sortPipe.transform(truck.doc.truckLeaseData, 'date');
          return truck;
        }) : [],
        extended: false,
        gridNameTitle: 'Truck',
        stateName: 'trucks',
        gridColumns: this.getGridColumns('trucks', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('trucks', resetColumns),
      },
    ];
    this.tableSubject.next({ tableData: data, check: true });
  }

  public callAction(action: any): void {
    if (this.truckTabData.allTrucks.length && action.id) {
      const truck = this.truckTabData.allTrucks.find((t) => t.id === action.id);
      if (truck) {
        action.truck = this.clonerService.deepClone<TruckData>(truck);
        action.truck.commission = action.truck?.commission
          ? Number(action.truck.commission.toString().replace('%', ''))
          : 0;
      }
    }
    if (action.type === 'edit-truck') {
      this.openTruckQuickEdit(action.id);
    } else if (action.type === 'import-event') {
      this.callImport();
    } else if (action.type === 'insert-event') {
      this.callInsert();
    } else if (action.type === 'add-repair') {
      this.addNewMainenance(action);
    } else if (action.type === 'add-registration') {
      this.addNewLicense(action);
    } else if (action.type === 'add-inspection') {
      this.addNewInspection(action);
    } else if (action.type === 'status-event') {
      this.callStatus(action);
    } else if (action.type === 'init-columns-event') {
      this.sendTruckData(true);
    } else if (action.type === 'delete-item') {
      this.deleteTruck(action.id);
    } else if (action.type === 'save-note-event') {
      this.saveNote(action);
    } else if (action.type === 'activate-item') {
      action.selection = [{ id: action.id }];
      this.callStatus(action);
    }
  }

  private saveNote(data: any) {
    const saveData: TruckData = this.clonerService.deepClone<TruckData>(data.truck);
    saveData.doc.additionalData.note = data.value;

    this.spinner.show(true);
    this.truckService
      .updateTruckData(saveData, saveData.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.notification.success('Truck Note has been updated.', 'Success:');
          this.spinner.show(false);
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  private deleteTruck(id: any) {
    this.spinner.show(true);
    this.truckService
      .deleteAllTrucks([{ id }])
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: UpdatedData) => {
          if (response.success.length === 1) {
            this.toastr.success('Truck has been deleted.', 'Success');
          } else if (response.success.length > 1) {
            this.toastr.success('Trucks have been deleted.', 'Success');
          }

          // failed trucks
          if (response.failure.length) {
            for (const id of response.failure) {
              this.toastr.warning(`Truck with Id: '${id}' hasn't been deleted.`, 'Warning');
            }
          }

          // not exist trucks
          if (response.notExist.length) {
            for (const id of response.notExist) {
              this.toastr.warning(`Truck with Id: '${id}' doesn't exist.`, 'Warning');
            }
          }
        },
        (error: HttpErrorResponse) => {
          this.shared.handleError(error);
        }
      );
  }

  openTruckQuickEdit(id: any) {
    this.truckService
      .editTrucks(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (truck: TruckData) => {
          const data = {
            type: 'edit',
            truck,
            id,
          };
          this.customModalService.openModal(TruckManageComponent, { data }, null, {
            size: 'small',
          });
        },
        (error: any) => {
          this.shared.handleServerError();
        }
      );
  }

  public openQuickEdit(id: any): void {
    const data = {
      type: 'edit',
      id,
    };
    this.customModalService.openModal(TruckManageComponent, { data }, null, { size: 'small' });
  }

  public addNewLicense(action: any): void {
    const data = {
      type: 'new',
      truck: action.truck,
      prefix: true,
    };
    this.customModalService.openModal(TruckLicenseManageComponent, { data }, null, {
      size: 'small',
    });
  }

  addNewInspection(action: any) {
    const data = {
      type: 'new',
      truck: action.truck,
      prefix: true,
    };
    this.customModalService.openModal(TruckInspectionManageComponent, { data }, null, {
      size: 'small',
    });
  }

  addNewMainenance(action: any) {
    const data = {
      type: 'new',
      truck: action.truck,
      prefix: true,
    };
    this.notification.warning('WIP: In progress');
  }

  public callImport(): void {
    this.customModalService.openModal(TruckImportComponent);
  }

  public callInsert(): void {
    const data = {
      type: 'new',
      id: null,
    };
    this.customModalService.openModal(TruckManageComponent, { data }, null, { size: 'small' });
  }

  public callDelete(event: any): void {
    this.truckService
      .deleteAllTrucks(event)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: UpdatedData) => {
          if (response.success.length === 1) {
            this.toastr.success('Truck has been deleted.', 'Success');
          } else if (response.success.length > 1) {
            this.toastr.success('Trucks have been deleted.', 'Success');
          }

          // failed trucks
          if (response.failure.length) {
            for (const id of response.failure) {
              if (event.tab === 'inactive') {
                this.toastr.warning(`Truck with Id: '${id}' hasn't been deleted.`, 'Warning');
              } else {
                this.toastr.warning(`Truck with Id: '${id}' hasn't been deleted.`, 'Warning');
              }
            }
          }

          // not exist trucks
          if (response.notExist.length) {
            for (const id of response.notExist) {
              this.toastr.warning(`Truck with Id: '${id}' doesn't exist.`, 'Warning');
            }
          }
        },
        (error: HttpErrorResponse) => {
          this.shared.handleError(error);
        }
      );
  }

  public callStatus(event: any): void {
    this.truckService
      .changeTruckStatuses(event.selection)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: UpdatedData) => {
          if (event.tab === 'active' && response.success.length === 1) {
            this.toastr.success('Truck has been deactivated.', 'Success');
          } else if (event.tab === 'active' && response.success.length > 1) {
            this.toastr.success('Trucks have been deactivated.', 'Success');
          } else if (event.tab === 'inactive' && response.success.length === 1) {
            this.toastr.success('Truck has been activated.', 'Success');
          } else if (event.tab === 'inactive' && response.success.length > 1) {
            this.toastr.success('Trucks have been activated.', 'Success');
          }

          // failed trucks
          if (response.failure.length) {
            for (const id of response.failure) {
              if (event.tab === 'inactive') {
                this.toastr.warning(`Truck with Id: '${id}' hasn't been activated.`, 'Warning');
              } else {
                this.toastr.warning(`Truck with Id: '${id}' hasn't been deactivated.`, 'Warning');
              }
            }
          }

          // not exist trucks
          if (response.notExist.length) {
            for (const id of response.notExist) {
              this.toastr.warning(`Truck with Id: '${id}' doesn't exist.`, 'Warning');
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
