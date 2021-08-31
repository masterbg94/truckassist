import { IftaTableOptions } from './../../accounting/models/accounting-table';
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
import { dateFormat, dollarFormat, numberWithCommas } from 'src/app/core/helpers/formating';
import { DeletedItem } from 'src/app/core/model/shared/enums';
import { ManageMaintenance } from 'src/app/core/model/shared/maintenance';
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
import { getExtendedTruckTrailerIftaColumnDefinition, getTruckTrailerIftaColumnDefinition } from 'src/assets/utils/settings/internal-columns/truck-trailer-ifta-columns';

@Component({
  selector: 'app-truck-ifta',
  templateUrl: './truck-ifta.component.html',
  styleUrls: ['./truck-ifta.component.scss'],
})
export class TruckIftaComponent implements OnInit {

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
  public iftaTableOptions: IftaTableOptions;
  private tableSubject: BehaviorSubject<TableSubject> = new BehaviorSubject(null);
  private iftaSubject: BehaviorSubject<any> = new BehaviorSubject(null);
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
        this.deleteTruckRepair(resp.data.id);
      }
    );

    this.initTableOptions();
    this.initIftaOptions();
    this.getTruckTrailersData();
    this.getIftaData();
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

  private initIftaOptions(): void{
    this.iftaTableOptions = {
      data: this.iftaSubject,
      config: {
        showHeader: false
      }
    }

    this.changeRef.detectChanges();
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
        type: 'truck-ifta',
        text: 'Are you sure you want to delete this IFTA?',
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
      ([maintenance, trucks]: [ManageMaintenance[], any]) => {
        this.trucks = trucks.allTrucks;
        this.trucks.filter((t) => {
          if (t.id == this.truckId) {
            this.truckUnit = t.truckNumber;
          }
        });
        // this.repairTrucks = maintenance
        //   .filter((r) => r.truckId == this.truckId)
        //   .map((truck) => {
        //     if (truck.doc && truck.doc.millage) {
        //       truck.doc.millage = truck.doc.millage ? numberWithCommas(truck.doc.millage, false) : '';
        //     }
        //     if (truck.createdAt) {
        //       truck.createdAt = truck.createdAt ? dateFormat(truck.createdAt) : '';
        //     }
        //     if (truck.doc && truck.doc.total) {
        //       truck.doc.total = truck.doc.total ? numberWithCommas(truck.doc.total, false) : '';
        //     }
        //     return truck;
        //   });
        // this.allRepairTrucks = maintenance.filter((r) => r.category == 'truck');
        this.sendTruckTrailersData();
      },
      () => {
        this.shared.handleServerError();
      }
    );
  }

  public getIftaData(){
    this.sendIftaData();
  }

  private getGridColumns(stateName: string, resetColumns: boolean): TableColumnDefinition[] {
    const userState: UserState = JSON.parse(localStorage.getItem(stateName + '_user_columns_state'));
    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      return getTruckTrailerIftaColumnDefinition();
    }
  }

  private getExtendedGridColumns(stateName: string, resetColumns: boolean): TableColumnDefinition[] {
    const userState: UserState = JSON.parse(localStorage.getItem(stateName + '_user_columns_state'));
    if (userState && userState.extendedTableColumns.length && !resetColumns) {
      return userState.extendedTableColumns;
    } else {
      return getExtendedTruckTrailerIftaColumnDefinition();
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
        gridNameTitle: 'IFTA',
        stateName: 'truck_ifta',
        gridColumns: [],
        extendedGridColumns: [],
        items: this.items
      },
    ];
    this.tableSubject.next({ tableData: data, check: true });
  }

  private sendIftaData():void{
    const data: any = {
      usaStates: [
        {
          state: "AL"
        },
        {
          state: "AK"
        },
        {
          state: "AS"
        },
        {
          state: "AZ"
        },
        {
          state: "AR"
        },
        {
          state: "CA"
        },
        {
          state: "CO"
        },
        {
          state: "CT"
        },
        {
          state: "DE"
        },
        {
          state: "DC"
        },
        {
          state: "FM"
        },
        {
          state: "FL"
        },
        {
          state: "GA"
        },
        {
          state: "GU"
        },
        {
          state: "HI"
        },
        {
          state: "ID"
        },
        {
          state: "IL"
        },
        {
          state: "IN"
        },
        {
          state: "IA"
        },
        {
          state: "KS"
        },
        {
          state: "KY"
        },
        {
          state: "LA"
        },
        {
          state: "ME"
        },
        {
          state: "MH"
        },
        {
          state: "MD"
        },
        {
          state: "MA"
        },
        {
          state: "MI"
        },
        {
          state: "MN"
        },
        {
          state: "MS"
        },
        {
          state: "MO"
        },
        {
          state: "MT"
        },
        {
          state: "NE"
        },
        {
          state: "NV"
        },
        {
          state: "NH"
        },
        {
          state: "NJ"
        },
        {
          state: "NM"
        },
        {
          state: "NY"
        },
        {
          state: "NC"
        },
        {
          state: "ND"
        },
        {
          state: "MP"
        },
        {
          state: "OH"
        },
        {
          state: "OK"
        },
        {
          state: "OR"
        },
        {
          state: "PW"
        },
        {
          state: "PA"
        },
        {
          state: "PR"
        },
        {
          state: "RI"
        },
        {
          state: "SC"
        },
        {
          state: "SD"
        },
        {
          state: "TN"
        },
        {
          state: "SD"
        },
        {
          state: "TN"
        },
        {
          state: "TX"
        },
        {
          state: "UT"
        },
        {
          state: "VT"
        },
        {
          state: "VI"
        },
        {
          state: "VA"
        },
        {
          state: "WA"
        },
        {
          state: "WV"
        },
        {
          state: "WI"
        },
        {
          state: "WY"
        }
      ], 
      stopsList: [
        {
          type: "start",
          location: "Gary, IN 30055",
          date: 1625659486
        },
        {
          type: "unknown",
          location: "Chicago, IL 65005",
          date: 1625659486,
          leg: 60.6,
          miles: 60.6
        },
        {
          type: "delivery",
          location: "Chicago, IL 65005",
          date: 1625659486,
          leg: 60.6,
          miles: 60.6
        },
        {
          type: "pickup",
          location: "Chicago, IL 65005",
          date: 1625659486,
          leg: 60.6,
          miles: 60.6
        },
        {
          type: "delivery",
          location: "Chicago, IL 65005",
          date: 1625659486,
          leg: 60.6,
          miles: 60.6
        },
        {
          type: "delivery",
          location: "Chicago, IL 65005",
          date: 1625659486,
          leg: 60.6,
          miles: 60.6
        },
        {
          type: "delivery",
          location: "Chicago, IL 65005",
          date: 1625659486,
          leg: 60.6,
          miles: 60.6
        },
        {
          type: "pickup",
          location: "Chicago, IL 65005",
          date: 1625659486,
          leg: 60.6,
          miles: 60.6
        },
        {
          type: "pickup",
          location: "Chicago, IL 65005",
          date: 1625659486,
          leg: 60.6,
          miles: 60.6
        },
        {
          type: "unknown",
          location: "Chicago, IL 65005",
          date: 1625659486,
          leg: 60.6,
          miles: 60.6
        },
        {
          type: "delivery",
          location: "Chicago, IL 65005",
          date: 1625659486,
          leg: 60.6,
          miles: 60.6
        },
        {
          type: "pickup",
          location: "Chicago, IL 65005",
          date: 1625659486,
          leg: 60.6,
          miles: 60.6
        },
        {
          type: "unknown",
          location: "Chicago, IL 65005",
          date: 1625659486,
          leg: 60.6,
          miles: 60.6
        },
        {
          type: "delivery",
          location: "Chicago, IL 65005",
          date: 1625659486,
          leg: 60.6,
          miles: 60.6
        },
        {
          type: "delivery",
          location: "Chicago, IL 65005",
          date: 1625659486,
          leg: 60.6,
          miles: 60.6
        },
        {
          type: "pickup",
          location: "Chicago, IL 65005",
          date: 1625659486,
          leg: 60.6,
          miles: 60.6
        },
        {
          type: "delivery",
          location: "Chicago, IL 65005",
          date: 1625659486,
          leg: 60.6,
          miles: 60.6
        },
        {
          type: "delivery",
          location: "Chicago, IL 65005",
          date: 1625659486,
          leg: 60.6,
          miles: 60.6
        },
        {
          type: "pickup",
          location: "Chicago, IL 65005",
          date: 1625659486,
          leg: 60.6,
          miles: 60.6
        },
        {
          type: "delivery",
          location: "Chicago, IL 65005",
          date: 1625659486,
          leg: 60.6,
          miles: 60.6
        },
        {
          type: "pickup",
          location: "Chicago, IL 65005",
          date: 1625659486,
          leg: 60.6,
          miles: 60.6
        },
        {
          type: "delivery",
          location: "Chicago, IL 65005",
          date: 1625659486,
          leg: 60.6,
          miles: 60.6
        },
        {
          type: "delivery",
          location: "Chicago, IL 65005",
          date: 1625659486,
          leg: 60.6,
          miles: 60.6
        },
        {
          type: "delivery",
          location: "Chicago, IL 65005",
          date: 1625659486,
          leg: 60.6,
          miles: 60.6
        },
        {
          type: "delivery",
          location: "Chicago, IL 65005",
          date: 1625659486,
          leg: 60.6,
          miles: 60.6
        },
        {
          type: "delivery",
          location: "Chicago, IL 65005",
          date: 1625659486,
          leg: 60.6,
          miles: 60.6
        },
        {
          type: "delivery",
          location: "Chicago, IL 65005",
          date: 1625659486,
          leg: 60.6,
          miles: 60.6
        },
        {
          type: "delivery",
          location: "Chicago, IL 65005",
          date: 1625659486,
          leg: 60.6,
          miles: 60.6
        },
        {
          type: "delivery",
          location: "Chicago, IL 65005",
          date: 1625659486,
          leg: 60.6,
          miles: 60.6
        },
        {
          type: "delivery",
          location: "Chicago, IL 65005",
          date: 1625659486,
          leg: 60.6,
          miles: 60.6
        },
        {
          type: "delivery",
          location: "Chicago, IL 65005",
          date: 1625659486,
          leg: 60.6,
          miles: 60.6
        }
      ]
    };
    this.iftaSubject.next(data);
  }

  public callAction(action: any): void {
    if (action.type === 'import-event') {
      this.callImport();
    } else if (action.type === 'insert-event') {
      /* this.onNewRepair(); */
    } else if (action.type === 'init-columns-event') {
      this.sendTruckTrailersData(true);
    } else if (action.type === 'delete') {
      /* this.deleteTruckRepair(action.id); */
    } else if (action.type === 'edit') {
      /* this.onEditTruckRepair(action.id); */
    }
  }

  onNewRepair() {
    const data = {
      type: 'new',
      vehicle: 'truck',
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
      this.toastr.success(`IFTA successfully deleted.`, ' ');
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
    this.toastr.success(`IFTA successfully deleted.`, ' ');
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
