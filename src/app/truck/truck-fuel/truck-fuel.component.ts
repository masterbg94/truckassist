import { takeUntil } from 'rxjs/operators';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, forkJoin, Subject } from 'rxjs';
import { dateFormat } from 'src/app/core/helpers/formating';
import { DeletedItem } from 'src/app/core/model/shared/enums';
import { ManageMaintenance } from 'src/app/core/model/shared/maintenance';
import { UserState } from 'src/app/core/model/user';
import { AppSharedService } from 'src/app/core/services/app-shared.service';
import { AppTruckService } from 'src/app/core/services/app-truck.service';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { MaintenanceService } from 'src/app/core/services/maintenance.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { DriverImportComponent } from 'src/app/driver/driver-import/driver-import.component';
import { FuelManageComponent } from './../../accounting/fuel-manage/fuel-manage.component';
import {
  SwitchItem,
  TableColumnDefinition,
  TableData,
  TableOptions,
  TableSubject,
} from 'src/app/shared/truckassist-table/models/truckassist-table';
import { AppFuelService } from './../../core/services/app-fuel.service';
import { getExtendedTruckTrailerFuelColumnDefinition, getTruckTrailerFuelColumnDefinition } from 'src/assets/utils/settings/internal-columns/truck-trailer-fuel-columns';

@Component({
  selector: 'app-truck-fuel',
  templateUrl: './truck-fuel.component.html',
  styleUrls: ['./truck-fuel.component.scss'],
})
export class TruckFuelComponent implements OnInit {

  constructor(
    private maintenanceService: MaintenanceService,
    private truckService: AppTruckService,
    private customModalService: CustomModalService,
    private sharedRepairService: AppSharedService,
    private route: ActivatedRoute,
    public router: Router,
    private shared: SharedService,
    private changeRef: ChangeDetectorRef,
    private toastr: ToastrService,
    private fuelService: AppFuelService,
    private elementRef: ElementRef
  ) {
    this.route.params
    .pipe(takeUntil(this.destroy$))
    .subscribe((params) => {
      this.truckId = params.id;
    });
  }

  private destroy$: Subject<void> = new Subject<void>();
  public openUnitDrop: boolean;
  @Input() inputData: any;
  @Input() items: SwitchItem[];
  public tableOptions: TableOptions;
  private tableSubject: BehaviorSubject<TableSubject> = new BehaviorSubject(null);
  public truckTrailersColumns: TableColumnDefinition[] = [];
  public extendedColumns: TableColumnDefinition[] = [];
  public loadingItems = true;
  public repairTrucks: ManageMaintenance[] = [];
  public allRepairTrucks: ManageMaintenance[] = [];
  public truckId: number;
  public truckUnit: any;

  public trucks: any[] = [];

  ngOnInit(): void {
    this.shared.emitDeleteAction
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (resp: any) => {
        if ( resp.data.id ) { this.deleteFuel(resp.data.id); }
      }
    );

    this.fuelService.editedLoad
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (resp: any) => {
        this.getTruckTrailersData();
      }
    );

    this.initTableOptions();
    this.getTruckTrailersData();
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(target) {
    const clickedInside = this.elementRef.nativeElement.contains(target);

    if (!clickedInside && this.maintenanceService.newMaintenance) {
      let count = 0;
      const interval = setInterval(() => {
        this.getTruckTrailersData();
        count++;
        if (count === 1) {
          clearInterval(interval);
        }
      }, 200);
      this.maintenanceService.newMaintenance = false;
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
          name: 'edit',
        },
      ],
      deleteAction: {
        title: 'Delete',
        name: 'delete',
        type: 'truck-fuel',
        text: 'Are you sure you want to delete this fuel?',
      },
    };
    this.changeRef.detectChanges();
  }

  public deleteFuel(id) {
    this.fuelService.deleteFuel(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(res => {
      this.getTruckTrailersData();
    });
  }
  getTruckTrailersData() {
    /// const maintenance$ = this.maintenanceService.getMaintenance();
    const fuelslist$ = this.fuelService.getFuellist();
    const trucks$ = this.truckService.getTruckList();

    forkJoin([fuelslist$, trucks$])
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      ([fuelslist, trucks]: [any[], any]) => {
        this.trucks = trucks.allTrucks;
        this.trucks.filter((t) => {
          if (t.id == this.truckId) {
            this.truckUnit = t.truckNumber;
          }
        });
        this.repairTrucks = fuelslist
          .filter((r) => r.truckId == this.truckId)
          .map((item, index) => {
          item.transactionDate = dateFormat(item.transactionDate);
          const docCounts = item.doc.fuel.reduce((dataCount, items) => {
            if ( items.price ) { dataCount.priceTotal = dataCount.priceTotal + items.price; }
            if ( items.qty ) { dataCount.qtyTotal = dataCount.qtyTotal + items.qty; }
            return dataCount;
          }, { qtyTotal: 0, priceTotal: 0 });

          item.qtyTotal = docCounts.qtyTotal;
          item.priceTotal = docCounts.priceTotal;
          return item;
        });

        this.sendTruckTrailersData();
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
      return getTruckTrailerFuelColumnDefinition();
    }
  }

  private getExtendedGridColumns(stateName: string, resetColumns: boolean): TableColumnDefinition[] {
    const userState: UserState = JSON.parse(localStorage.getItem(stateName + '_user_columns_state'));
    if (userState && userState.extendedTableColumns.length && !resetColumns) {
      return userState.extendedTableColumns;
    } else {
      return getExtendedTruckTrailerFuelColumnDefinition();
    }
  }

  private sendTruckTrailersData(resetColumns?: boolean): void {
    const data: TableData[] = [
      {
        title: 'Active',
        field: 'active',
        data: this.repairTrucks,
        extended: false,
        detailsData: this.trucks,
        detailsUnit: this.truckUnit,
        showUnitSwitch: true,
        swichUnitData: this.trucks,
        type: 'trucks',
        keywordForSwich: 'truckNumber',
        gridNameTitle: 'Fuel',
        stateName: 'truck_fuel',
        gridColumns: this.getGridColumns('truck_fuel', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('truck_fuel', resetColumns),
        items: this.items
      },
    ];
    this.tableSubject.next({ tableData: data, check: true });
  }

  public callAction(action: any): void {
    console.log('Call ACTION');
    console.log(action);
    if (action.type === 'import-event') {
      this.callImport();
    } else if (action.type === 'insert-event') {
      this.onNewFuel();
    } else if (action.type === 'init-columns-event') {
      this.sendTruckTrailersData(true);
    } else if (action.type === 'edit') {
      this.onFuelEdit(action.id);
    }
  }

  onNewFuel() {
    const data = {
      type: 'new',
      id: null,
      truckId: this.truckId
    };
    this.customModalService.openModal(FuelManageComponent, { data }, null, { size: 'small' });
  }

  onFuelEdit(id: number) {
    const data = {
      type: 'edit',
      id,
    };
    this.customModalService.openModal(FuelManageComponent, { data }, null, { size: 'small' });
  }

  /* Multiple Delete */
  public deleteMultipleTruckRepair(truckRepairDelete: DeletedItem[]): void {
    for (let i = 0; i < truckRepairDelete.length; i++) {
      this.fuelService.deleteFuel(truckRepairDelete[i].id)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
    }
    this.toastr.success(`Fuel successfully deleted.`, ' ');
    let count = 0;
    const interval = setInterval(() => {
      this.getTruckTrailersData();
      count++;
      if (count === 1) {
        clearInterval(interval);
      }
    }, 200);
  }

  public callImport(): void {
    this.customModalService.openModal(DriverImportComponent);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
