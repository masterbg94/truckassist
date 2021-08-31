import { takeUntil } from 'rxjs/operators';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, forkJoin, Subject } from 'rxjs';
import { dateFormat, dollarFormat, numberWithCommas } from 'src/app/core/helpers/formating';
import { LoadTabledata } from 'src/app/core/model/load';
import { DeletedItem } from 'src/app/core/model/shared/enums';
import { ManageMaintenance } from 'src/app/core/model/shared/maintenance';
import { UserState } from 'src/app/core/model/user';
import { AppLoadService } from 'src/app/core/services/app-load.service';
import { AppTruckService } from 'src/app/core/services/app-truck.service';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { MaintenanceService } from 'src/app/core/services/maintenance.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { DriverImportComponent } from 'src/app/driver/driver-import/driver-import.component';
import { ManageLoadComponent } from 'src/app/load/manage-load/manage-load.component';
import {
  SwitchItem,
  TableColumnDefinition,
  TableData,
  TableOptions,
  TableSubject,
} from 'src/app/shared/truckassist-table/models/truckassist-table';
import { getExtendedTruckTrailerLoadColumnDefinition, getTruckTrailerLoadColumnDefinition } from 'src/assets/utils/settings/internal-columns/truck-trailer-load-columns';

@Component({
  selector: 'app-truck-load',
  templateUrl: './truck-load.component.html',
  styleUrls: ['./truck-load.component.scss'],
})
export class TruckLoadComponent implements OnInit {

  constructor(
    private loadService: AppLoadService,
    private customModalService: CustomModalService,
    private toastr: ToastrService,
    private shared: SharedService,
    private changeRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private elementRef: ElementRef,
    private maintenanceService: MaintenanceService,
    private truckService: AppTruckService
  ) {
    this.route.params
    .pipe(takeUntil(this.destroy$))
    .subscribe((params) => {
      this.truckId = params.id;
    });
  }
  @Input() inputData: any;
  @Input() items: SwitchItem[];
  public tableOptions: TableOptions;
  private tableSubject: BehaviorSubject<TableSubject> = new BehaviorSubject(null);
  public customerColumns: TableColumnDefinition[] = [];
  public extendedColumns: TableColumnDefinition[] = [];
  public loadingItems = true;
  public selectedTab = 'active';
  public customerTable = '';
  private destroy$: Subject<void> = new Subject<void>();
  public allLoadsData: LoadTabledata[] = [];
  public pendingLoadsData: LoadTabledata[] = [];
  public activeLoadsData: LoadTabledata[] = [];
  public closedLoadsData: LoadTabledata[] = [];
  public allInOnLoadsData: LoadTabledata[] = [];
  public truckId: number | string;
  public load: any[] = [];
  public trucks: [] = [];

  ngOnInit(): void {
    this.shared.emitDeleteAction
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (resp: any) => {
        this.deleteLoad(resp.data.id);
      }
    );

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
      useAdditionalFeatures: true,
      toolbarActions: {
        hideImport: true,
        hideExport: true,
        hideColumns: true,
        hideEmail: true,
        hideSwitch: true,
        hideLabel: true,
        hideSelectNumber: true,
        hideTabs: true,
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
          title: 'Edit',
          name: 'edit-load',
        },
      ],
      deleteAction: {
        title: 'Delete',
        name: 'delete',
        type: 'truck-load',
        text: 'Are you sure you want to delete this load?',
      },
    };
    this.changeRef.detectChanges();
  }
  getLoadData() {
    const load$ = this.loadService.getLoadData();
    const trucks$ = this.truckService.getTruckList();
    forkJoin([load$, trucks$])
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      ([load, trucks]: [any, any]) => {
        this.allInOnLoadsData = [];
        this.trucks = trucks.allTrucks;
        this.load = load;
        const allLoads = load.allLoads ? load.allLoads : [];
        this.allLoadsData = allLoads
          .filter((l) => l.truckId == this.truckId)
          .map((load) => {
            if (load && load.mileage) {
              load.mileage = load.mileage ? numberWithCommas(load.mileage, false) : '';
              load.pickupDateTime = load.pickupDateTime ? dateFormat(load.pickupDateTime) : '';
              load.deliveryDateTime = load.deliveryDateTime
                ? dateFormat(load.deliveryDateTime)
                : '';
              load.total = load.total ? numberWithCommas(load.total, false) : load.total;
            }
            return load;
          });
        const pendingLoads = load.pendingLoads ? load.pendingLoads : [];
        this.pendingLoadsData = pendingLoads
          .filter((l) => l.truckId == this.truckId)
          .map((load) => {
            if (load && load.mileage) {
              load.mileage = load.mileage ? numberWithCommas(load.mileage, false) : '';
              load.pickupDateTime = load.pickupDateTime ? dateFormat(load.pickupDateTime) : '';
              load.deliveryDateTime = load.deliveryDateTime
                ? dateFormat(load.deliveryDateTime)
                : '';
              load.total = load.total ? numberWithCommas(load.total, false) : load.total;
            }
            return load;
          });
        const activeLoads = load.activeLoads ? load.activeLoads : [];
        this.activeLoadsData = activeLoads
          .filter((l) => l.truckId == this.truckId)
          .map((load) => {
            if (load && load.mileage) {
              load.mileage = load.mileage ? numberWithCommas(load.mileage, false) : '';
              load.pickupDateTime = load.pickupDateTime ? dateFormat(load.pickupDateTime) : '';
              load.deliveryDateTime = load.deliveryDateTime
                ? dateFormat(load.deliveryDateTime)
                : '';
              load.total = load.total ? numberWithCommas(load.total, false) : load.total;
            }
            return load;
          });
        const closedLoads = load.closedLoads ? load.closedLoads : [];
        this.closedLoadsData = closedLoads
          .filter((l) => l.truckId == this.truckId)
          .map((load) => {
            if (load && load.mileage) {
              load.mileage = load.mileage ? numberWithCommas(load.mileage, false) : '';
              load.pickupDateTime = load.pickupDateTime ? dateFormat(load.pickupDateTime) : '';
              load.deliveryDateTime = load.deliveryDateTime
                ? dateFormat(load.deliveryDateTime)
                : '';
              load.total = load.total ? numberWithCommas(load.total, false) : load.total;
            }
            return load;
          });

        for (const all of this.allLoadsData) {
          this.allInOnLoadsData.push(all);
        }
        for (const all of this.activeLoadsData) {
          this.allInOnLoadsData.push(all);
        }
        for (const all of this.closedLoadsData) {
          this.allInOnLoadsData.push(all);
        }
        for (const all of this.pendingLoadsData) {
          this.allInOnLoadsData.push(all);
        }
        /* For removal duplicate */
        for (let i = 0; i < this.allInOnLoadsData.length; i++) {
          for (let j = i + 1; j < this.allInOnLoadsData.length; j++) {
            if (this.allInOnLoadsData[i].id === this.allInOnLoadsData[j].id) {
              this.allInOnLoadsData.splice(j, 1);
            }
          }
        }
        this.sendTruckLoadData();
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
      return getTruckTrailerLoadColumnDefinition();
    }
  }

  private getExtendedGridColumns(stateName: string, resetColumns: boolean): TableColumnDefinition[] {
    const userState: UserState = JSON.parse(localStorage.getItem(stateName + '_user_columns_state'));
    if (userState && userState.extendedTableColumns.length && !resetColumns) {
      return userState.extendedTableColumns;
    } else {
      return getExtendedTruckTrailerLoadColumnDefinition();
    }
  }

  private sendTruckLoadData(resetColumns?: boolean): void {
    const data: TableData[] = [
      {
        title: 'Active',
        field: 'active',
        data: this.allInOnLoadsData,
        extended: false,
        showUnitSwitch: true,
        swichUnitData: this.trucks,
        type: 'trucks',
        keywordForSwich: 'truckNumber',
        gridNameTitle: 'Load',
        stateName: 'truck_load',
        gridColumns: this.getGridColumns('applicants', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('applicants', resetColumns),
        items: this.items
      },
    ];
    this.tableSubject.next({ tableData: data, check: true });
  }

  public callAction(action: any): void {
    if (action.type === 'import-event') {
      this.callImport();
    } else if (action.type === 'insert-event') {
      this.onNewLoad();
      /* console.log(this.allInOnLoadsData); */
    } else if (action.type === 'init-columns-event') {
      this.sendTruckLoadData(true);
    } else if (action.type === 'delete') {
      this.deleteLoad(action.id);
    } else if (action.type === 'edit-load') {
      this.onEditLoad(action.id);
    }
  }

  onNewLoad() {
    const data = {
      type: 'new',
      id: this.truckId,
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
      this.loadService.deleteLoad(load.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
    }
    this.toastr.success(`Loads successfully deleted.`, ' ');

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
    this.destroy$.next();
    this.destroy$.complete();
  }
}
