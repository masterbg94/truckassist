import { takeUntil } from 'rxjs/operators';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, forkJoin, Subscription, Subject} from 'rxjs';
import { dateFormat, dollarFormat, numberWithCommas } from 'src/app/core/helpers/formating';
import { LoadTabledata } from 'src/app/core/model/load';
import { DeletedItem } from 'src/app/core/model/shared/enums';
import { UserState } from 'src/app/core/model/user';
import { AppLoadService } from 'src/app/core/services/app-load.service';
import { ClonerService } from 'src/app/core/services/cloner-service';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { MaintenanceService } from 'src/app/core/services/maintenance.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { DriverImportComponent } from 'src/app/driver/driver-import/driver-import.component';
import { NotificationService } from 'src/app/services/notification-service.service';
import {
  TableColumnDefinition,
  TableData,
  TableOptions,
  TableSubject,
} from 'src/app/shared/truckassist-table/models/truckassist-table';
import {
  getExtendedLoadColumnDefinition,
  getLoadColumnDefinition,
} from 'src/assets/utils/settings/load-columns';
import { ManageLoadComponent } from '../manage-load/manage-load.component';

import * as AppConst from './../../const';

@Component({
  selector: 'app-load-table',
  templateUrl: './load-table.component.html',
})
export class LoadTableComponent implements OnInit, OnDestroy {
  @Input() inputData: any;
  public tableOptions: TableOptions;
  private tableSubject: BehaviorSubject<TableSubject> = new BehaviorSubject(null);
  public customerColumns: TableColumnDefinition[] = [];
  public extendedColumns: TableColumnDefinition[] = [];
  public loadingItems = true;
  public selectedTab = 'active';
  public loadTable = '';
  private subscriptions: Subscription[] = [];
  public allLoadsData: LoadTabledata[] = [];
  public allLoads: LoadTabledata[] = [];
  public pendingLoadsData: LoadTabledata[] = [];
  public activeLoadsData: LoadTabledata[] = [];
  public closedLoadsData: LoadTabledata[] = [];

  
  loadStatuses = AppConst.LOAD_STATUS;

  pendingLoadYears: number[] = [];
  activeLoadYears: number[] = [];
  closedLoadYears: number[] = [];
  allLoadYears: number[] = [];
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private loadService: AppLoadService,
    private customModalService: CustomModalService,
    private toastr: ToastrService,
    private shared: SharedService,
    private changeRef: ChangeDetectorRef,
    private elementRef: ElementRef,
    private maintenanceService: MaintenanceService,
    private clonerService: ClonerService,
    private spinner: SpinnerService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {

    this.shared.emitDeleteAction
    .pipe(takeUntil(this.destroy$))
    .subscribe((resp: any) => {
      this.deleteLoad(resp.data.id);
    });

    this.loadService.editedLoad
    .pipe(takeUntil(this.destroy$))
    .subscribe((load: LoadTabledata) => {
      if (load && load.mileage) {
        load.mileage = load.mileage ? numberWithCommas(load.mileage, false) : '';
        load.pickupDateTime = load.pickupDateTime ? dateFormat(load.pickupDateTime) : '';
        load.deliveryDateTime = load.deliveryDateTime ? dateFormat(load.deliveryDateTime) : '';
        load.total = load.total ? '$' + numberWithCommas(load.total, false) : load.total;
      }
      let index = this.allLoadsData.findIndex((d) => d.id === load.id);
      if (index !== -1) {
        this.allLoadsData[index] = load;
      }

      index = this.pendingLoadsData.findIndex((d) => d.id === load.id);
      if (index !== -1) {
        this.pendingLoadsData[index] = load;
      }

      index = this.activeLoadsData.findIndex((d) => d.id === load.id);
      if (index !== -1) {
        this.activeLoadsData[index] = load;
      }

      index = this.closedLoadsData.findIndex((d) => d.id === load.id);
      if (index !== -1) {
        this.closedLoadsData[index] = load;
      }

      this.sendLoadData();
    });

    this.initTableOptions();
    this.getLoadData();
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(target) {
    const clickedInside = this.elementRef.nativeElement.contains(target);

    if (!clickedInside && this.maintenanceService.loadChange) {
      let count = 0;
      const interval = setInterval(() => {
        this.getLoadData();
        count++;
        if (count === 1) {
          clearInterval(interval);
        }
      }, 200);
      this.maintenanceService.newShopOrEdit = false;
      this.maintenanceService.loadChange = false;
    }
  }

  private initTableOptions(): void {
    this.tableOptions = {
      disabledMutedStyle: true,
      data: this.tableSubject,
      toolbarActions: {
        hideImport: false,
        hideExport: false,
        hideLockUnlock: false,
        hideAddNew: false,
        hideColumns: false,
        hideCompress: false,
        hideEmail: true,
        hideShopType: false,
        showFilter: true,
        hideLabel: true,
        hideSwitch: true,
        showTotalCounter: true,
        showDateFilter: true,
        hideSelectNumber: true,
        showLabelStatusFilter: true
      },
      config: {
        showSort: true,
        sortBy: '',
        sortDirection: '',
        disabledColumns: [0],
        minWidth: 60,
        dateFilterField: 'pickupDateTime',
      },
      mainActions: [
        {
          title: 'Edit',
          name: 'edit-load',
        },
      ],
      deleteAction: {
        title: 'Delete',
        name: 'delete',
        type: 'load',
        text: 'Are you sure you want to delete load(s)?',
      }
    };
    this.changeRef.detectChanges();
  }

  getRatesFromLoad(load) {
    if (load.rates) {
      const routesInfo = load.rates.reduce(
        (routesNumb, item) => {
          if (item.Title == 'baseRate') { routesNumb.baseRate = dollarFormat(item.Rate); } else if (item.Title == 'adjusted') { routesNumb.adjusted = dollarFormat(item.Rate); } else if (item.Title == 'advanced') { routesNumb.advanced = dollarFormat(item.Rate); } else if (item.Title == 'revised') { routesNumb.revised = dollarFormat(item.Rate); } else if (item.Title != 'revised') {
            routesNumb.additional = routesNumb.additional + item.Rate;
 }
          return routesNumb;
        },
        { baseRate: 0, adjusted: 0, advanced: 0, additional: 0, revised: 0 }
      );
      return routesInfo;
    }
    return { baseRate: 0, adjusted: 0, advanced: 0, additional: 0, revised: 0 };
  }

  getLoadData() {
    const load$ = this.loadService.getLoadData();
      forkJoin([load$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ([load]: [any]) => {
          const allLoads = load.allLoads ? load.allLoads : [];
          console.log(allLoads);
          this.allLoads = this.clonerService.deepClone<LoadTabledata[]>(allLoads);
          this.allLoadsData = allLoads.map((load) => {
            if (load) {
              const ratesInfo = this.getRatesFromLoad(load);
              ratesInfo.additional = dollarFormat(ratesInfo.additional);
              Object.assign(load, ratesInfo);
              load.mileage = load.mileage ? numberWithCommas(load.mileage, false) : '';
              load.pickupDateTime = load.pickupDateTime ? dateFormat(load.pickupDateTime) : '';
              load.deliveryDateTime = load.deliveryDateTime
                ? dateFormat(load.deliveryDateTime)
                : '';
              load.total = load.total ? '$' + numberWithCommas(load.total, false) : null;
              load.stops = load.deliveryCount + load.pickupCount;

              if (load.pickupDateTime) {
                const year = moment(load.pickupDateTime).year();

                if (this.allLoadYears.indexOf(year) === -1) {
                  this.allLoadYears.push(year);
                }
              }
            }
            return load;
          });
          const pendingLoads = load.pendingLoads ? load.pendingLoads : [];
          this.pendingLoadsData = pendingLoads.map((load) => {
            if (load) {
              const ratesInfo = this.getRatesFromLoad(load);
              ratesInfo.additional = dollarFormat(ratesInfo.additional);
              Object.assign(load, ratesInfo);
              load.mileage = load.mileage ? numberWithCommas(load.mileage, false) : '';
              load.pickupDateTime = load.pickupDateTime ? dateFormat(load.pickupDateTime) : '';
              load.deliveryDateTime = load.deliveryDateTime
                ? dateFormat(load.deliveryDateTime)
                : '';
              load.total = load.total ? '$' + numberWithCommas(load.total, false) : null;
              load.stops = load.deliveryCount + load.pickupCount;
              if (load.pickupDateTime) {
                const year = moment(load.pickupDateTime).year();

                if (this.pendingLoadYears.indexOf(year) === -1) {
                  this.pendingLoadYears.push(year);
                }
              }
            }
            return load;
          });
          const activeLoads = load.activeLoads ? load.activeLoads : [];
          this.activeLoadsData = activeLoads.map((load) => {
            if (load) {
              const ratesInfo = this.getRatesFromLoad(load);
              ratesInfo.additional = dollarFormat(ratesInfo.additional);
              Object.assign(load, ratesInfo);
              load.mileage = load.mileage ? numberWithCommas(load.mileage, false) : '';
              load.pickupDateTime = load.pickupDateTime ? dateFormat(load.pickupDateTime) : '';
              load.deliveryDateTime = load.deliveryDateTime
                ? dateFormat(load.deliveryDateTime)
                : '';
              load.total = load.total ? '$' + numberWithCommas(load.total, false) : null;
              load.stops = load.deliveryCount + load.pickupCount;
              if (load.pickupDateTime) {
                const year = moment(load.pickupDateTime).year();

                if (this.activeLoadYears.indexOf(year) === -1) {
                  this.activeLoadYears.push(year);
                }
              }
            }
            return load;
          });
          const closedLoads = load.closedLoads ? load.closedLoads : [];
          this.closedLoadsData = closedLoads.map((load) => {
            if (load && load.mileage) {
              const ratesInfo = this.getRatesFromLoad(load);
              ratesInfo.additional = dollarFormat(ratesInfo.additional);
              Object.assign(load, ratesInfo);
              load.mileage = load.mileage ? numberWithCommas(load.mileage, false) : '';
              load.pickupDateTime = load.pickupDateTime ? dateFormat(load.pickupDateTime) : '';
              load.deliveryDateTime = load.deliveryDateTime
                ? dateFormat(load.deliveryDateTime)
                : '';
              load.total = load.total ? '$' + numberWithCommas(load.total, false) : null;
              load.stops = load.deliveryCount + load.pickupCount;
              if (load.pickupDateTime) {
                const year = moment(load.pickupDateTime).year();

                if (this.closedLoadYears.indexOf(year) === -1) {
                  this.closedLoadYears.push(year);
                }
              }
            }
            return load;
          });
          this.sendLoadData();
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  private getGridColumns(stateName: string, resetColumns: boolean): TableColumnDefinition[] {
    const userState: UserState = JSON.parse(localStorage.getItem(stateName + '_user_columns_state'));
    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      return getLoadColumnDefinition();
    }
  }

  private getExtendedGridColumns(stateName: string, resetColumns: boolean): TableColumnDefinition[] {
    const userState: UserState = JSON.parse(localStorage.getItem(stateName + '_user_columns_state'));
    if (userState && userState.extendedTableColumns.length && !resetColumns) {
      return userState.extendedTableColumns;
    } else {
      return getExtendedLoadColumnDefinition();
    }
  }


  private sendLoadData(resetColumns?: boolean): void {
    const data: TableData[] = [
      {
        title: 'Pending',
        field: 'pending',
        data: this.pendingLoadsData.map((rs) => {
          if (rs.total) {
            rs.total = rs.total ? rs.total.toString().replace('$NaN', '') : rs.total;
          }
          rs.status = this.loadStatuses.find((ls) => ls.id === rs.statusId)?.name;
          return rs;
        }),
        extended: false,
        filterYears: this.pendingLoadYears,
        gridNameTitle: 'Load',
        stateName: 'loads',
        gridColumns: this.getGridColumns('loads', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('loads', resetColumns),
      },
      {
        title: 'Active',
        field: 'active',
        data: this.activeLoadsData.map((rs) => {
          if (rs.total) {
            rs.total = rs.total ? rs.total.toString().replace('$NaN', '') : rs.total;
          }
          rs.status = this.loadStatuses.find((ls) => ls.id === rs.statusId)?.name;
          return rs;
        }),
        extended: false,
        filterYears: this.activeLoadYears,
        gridNameTitle: 'Load',
        stateName: 'loads',
        gridColumns: this.getGridColumns('loads', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('loads', resetColumns),
      },
      {
        title: 'Closed',
        field: 'inactive',
        data: this.closedLoadsData.map((rs) => {
          if (rs.total) {
            rs.total = rs.total ? rs.total.toString().replace('$NaN', '') : rs.total;
          }
          rs.status = this.loadStatuses.find((ls) => ls.id === rs.statusId).name;
          return rs;
        }),
        extended: false,
        filterYears: this.closedLoadYears,
        gridNameTitle: 'Load',
        stateName: 'loads',
        gridColumns: this.getGridColumns('loads', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('loads', resetColumns),
      },
      {
        title: 'All',
        field: null,
        data: this.allLoadsData.map((rs) => {
          if (rs.total) {
            rs.total = rs.total ? rs.total.toString().replace('$NaN', '') : rs.total;
          }
          rs.status = this.loadStatuses.find((ls) => ls.id === rs.statusId)?.name;
          return rs;
        }),
        extended: false,
        filterYears: this.allLoadYears,
        gridNameTitle: 'Load',
        stateName: 'loads',
        gridColumns: this.getGridColumns('loads', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('loads', resetColumns),
      },
    ];
    this.tableSubject.next({ tableData: data, check: true });
  }

  public callAction(action: any): void {
    if (this.allLoads.length && action.id) {
      const load = this.allLoads.find((t) => t.id === action.id);
      if (load) {
        action.load = this.clonerService.deepClone<LoadTabledata>(load);
      }
    }
    if (action.type === 'import-event') {
      this.callImport();
    } else if (action.type === 'insert-event') {
      this.onNewLoad();
    } else if (action.type === 'init-columns-event') {
      this.sendLoadData(true);
    } else if (action.type === 'delete') {
      this.deleteLoad(action.id);
    } else if (action.type === 'edit-load') {
      this.onEditLoad(action.id);
    } else if (action.type === 'save-note-event') {
      this.saveNote(action);
    } else if (action.type === 'change-status-event') {
      this.changeLoadStatus(action);
    }
  }

  private changeLoadStatus(data) {
    this.spinner.show(true);
    this.loadService
    .updateLoadStatus(JSON.stringify({ statusId: data.status }), data.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      () => {
        this.notification.success('Load Status has been updated.', 'Success:');
        this.spinner.show(false);
      },
      () => {
        this.shared.handleServerError();
      }
    );
  }

  private saveNote(data: any) {
    const saveData: LoadTabledata = this.clonerService.deepClone<LoadTabledata>(data.load);
    saveData.note = data.value;

    this.spinner.show(true);
    this.loadService.updateLoad(saveData, saveData.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      () => {
        this.notification.success('Load Note has been updated.', 'Success:');
        this.spinner.show(false);
      },
      () => {
        this.shared.handleServerError();
      }
    );
  }

  onNewLoad() {
    const data = {
      type: 'new',
      id: null,
    };
    this.customModalService.openModal(ManageLoadComponent, { data }, null, { size: 'xxl' });
  }

  onEditLoad(id: number) {
    const data = {
      type: 'edit',
      id,
    };
    this.customModalService.openModal(ManageLoadComponent, { data }, null, { size: 'xxl' });
  }

  /* Single delete */
  public deleteLoad(id: number) {
    this.loadService.deleteLoad(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe((res) => {
      console.log(res);
    });
    /* console.log(id);
    console.log(this.activeLoadsData); */
    let count = 0;
    const interval = setInterval(() => {
      this.getLoadData();
      count++;
      if (count === 1) {
        clearInterval(interval);
      }
    }, 200);
  }

  public callImport(): void {
    this.customModalService.openModal(DriverImportComponent);
  }

  /* Multiple Delete */
  public callDelete(loadsDelete: DeletedItem[]): void {
    for (const load of loadsDelete) {
      this.loadService.deleteLoad(load.id).subscribe();
    }
    this.toastr.success(`Loads successfully deleted.`, 'Success');

    let count = 0;
    const interval = setInterval(() => {
      this.getLoadData();
      count++;
      if (count === 1) {
        clearInterval(interval);
      }
    }, 200);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.destroy$.next();
    this.destroy$.complete();
  }
}
