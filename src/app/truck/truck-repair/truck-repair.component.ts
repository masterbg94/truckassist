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
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, forkJoin, Subject } from 'rxjs';
import { dateFormat, dollarFormat, numberWithCommas } from 'src/app/core/helpers/formating';
import { DeletedItem } from 'src/app/core/model/shared/enums';
import { ManageMaintenance, TruckTrailerMaintenance } from 'src/app/core/model/shared/maintenance';
import { UserState } from 'src/app/core/model/user';
import { AppSharedService } from 'src/app/core/services/app-shared.service';
import { AppTruckService } from 'src/app/core/services/app-truck.service';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { MaintenanceService } from 'src/app/core/services/maintenance.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { DriverImportComponent } from 'src/app/driver/driver-import/driver-import.component';
import { MaintenanceManageComponent } from 'src/app/repairs/maintenance-manage/maintenance-manage.component';
import {
  SwitchItem,
  TableColumnDefinition,
  TableData,
  TableOptions,
  TableSubject,
} from 'src/app/shared/truckassist-table/models/truckassist-table';
import { getExtendedTruckTrailerRepairColumnDefinition, getTruckTrailerRepairColumnDefinition } from 'src/assets/utils/settings/internal-columns/truck-trailer-repair-columns';


@Component({
  selector: 'app-truck-repair',
  templateUrl: './truck-repair.component.html',
  styleUrls: ['./truck-repair.component.scss'],
})
export class TruckRepairComponent implements OnInit, OnDestroy {

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
  public truckTrailersTable = '';
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
        this.deleteTruckRepair(resp.data.id);
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
        hideTabs: true
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
        type: 'truck-repair',
        text: 'Are you sure you want to delete this repair?',
      },
    };
    this.changeRef.detectChanges();
  }
  getTruckTrailersData() {
    const maintenance$ = this.maintenanceService.getMaintenance();
    const trucks$ = this.truckService.getTruckList();
    forkJoin([maintenance$, trucks$])
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      ([maintenance, trucks]: [TruckTrailerMaintenance, any]) => {
        this.trucks = trucks.allTrucks;
        this.repairTrucks = maintenance.maintenanceTruckList
          .filter((r) => r.truckId == this.truckId)
          .map((truck) => {
            if (truck.doc && truck.doc.millage) {
              truck.doc.millage = truck.doc.millage ? numberWithCommas(truck.doc.millage, false) : '';
            }
            if (truck.maintenanceDate) {
              truck.maintenanceDate = truck.maintenanceDate ? dateFormat(truck.maintenanceDate) : '';
            }
            if (truck.doc && truck.doc.total) {
              truck.doc.total = truck.doc.total ? numberWithCommas(truck.doc.total, false) : '';
            }
            if (truck.doc.items) {
              truck.doc.items.map((t) => {
                t.price = t.price ? dollarFormat(t.price, true) : 0;
              });
            }
            return truck;
          });

        console.log(this.repairTrucks);
        /* this.allRepairTrucks = maintenance.maintenanceTruckList.filter((r) => r.category == 'truck'); */
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
      return getTruckTrailerRepairColumnDefinition();
    }
  }

  private getExtendedGridColumns(stateName: string, resetColumns: boolean): TableColumnDefinition[] {
    const userState: UserState = JSON.parse(localStorage.getItem(stateName + '_user_columns_state'));
    if (userState && userState.extendedTableColumns.length && !resetColumns) {
      return userState.extendedTableColumns;
    } else {
      return getExtendedTruckTrailerRepairColumnDefinition();
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
        gridNameTitle: 'Repair',
        stateName: 'truck_repair',
        gridColumns: this.getGridColumns('truck_repair', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('truck_repair', resetColumns),
        items: this.items
      }
    ];
    this.tableSubject.next({ tableData: data, check: true });
  }

  public callAction(action: any): void {
    if (action.type === 'import-event') {
      this.callImport();
    } else if (action.type === 'insert-event') {
      this.onNewRepair();
      console.log(this.repairTrucks);
    }  else if (action.type === 'init-columns-event') {
      this.sendTruckTrailersData(true);
    } else if (action.type === 'delete') {
      this.deleteTruckRepair(action.id);
    } else if (action.type === 'edit') {
      this.onEditTruckRepair(action.id);
    }
  }

  onNewRepair() {
    const data = {
      type: 'new',
      vehicle: 'truck',
      inputData: this.repairTrucks,
      useSetUnitForm: true,
    };
    this.customModalService.openModal(MaintenanceManageComponent, { data });
  }

  onEditTruckRepair(id: number) {
    this.sharedRepairService.editMaintennace(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (maintenance: ManageMaintenance) => {
        const data = {
          id,
          type: 'edit',
          maintenance,
          vehicle: 'truck',
        };
        this.customModalService.openModal(MaintenanceManageComponent, { data });
      },
      () => {
        this.shared.handleServerError();
      }
    );
  }
  public deleteTruckRepair(id: number) {
    this.sharedRepairService.deleteMaintenanceV2(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      this.toastr.success(`Repair successfully deleted.`, ' ');
    });

    let count = 0;
    const interval = setInterval(() => {
      this.getTruckTrailersData();
      count++;
      if (count === 1) {
        clearInterval(interval);
      }
    }, 200);
  }

  /* Multiple Delete */
  public deleteMultipleTruckRepair(truckRepairDelete: DeletedItem[]): void {
    for (let i = 0; i < truckRepairDelete.length; i++) {
      this.sharedRepairService.deleteMaintenanceV2(truckRepairDelete[i].id)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
    }
    this.toastr.success(`Repairs successfully deleted.`, ' ');
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
