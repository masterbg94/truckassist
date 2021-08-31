import { takeUntil } from 'rxjs/operators';
import { UserState } from 'src/app/core/model/user';
import { AppSharedService } from 'src/app/core/services/app-shared.service';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { MaintenanceService } from 'src/app/core/services/maintenance.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { DriverImportComponent } from 'src/app/driver/driver-import/driver-import.component';
import { RepairShopManageComponent } from 'src/app/shared/app-repair-shop/repair-shop-manage/repair-shop-manage.component';
import {
  TableColumnDefinition,
  TableData,
  TableOptions,
  TableSubject,
} from 'src/app/shared/truckassist-table/models/truckassist-table';
import {
  getExtendedRepairsShopColumnDefinition,
  getExtendedRepairTrailerColumnDefinition,
  getExtendedRepairTrailerPMColumnDefinition,
  getExtendedRepairTruckColumnDefinition,
  getExtendedRepairTruckPMColumnDefinition,
  getRepairsShopColumnDefinition,
  getRepairTrailerColumnDefinition,
  getRepairTrailerPMColumnDefinition,
  getRepairTruckColumnDefinition,
  getRepairTruckPMColumnDefinition,
} from 'src/assets/utils/settings/repair-columns';
import { MaintenanceManageComponent } from '../maintenance-manage/maintenance-manage.component';

import { Comments } from '../../core/model/comment';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { BehaviorSubject, forkJoin, Subscription, Subject } from 'rxjs';
import { ManageMaintenance, TruckTrailerMaintenance } from 'src/app/core/model/shared/maintenance';
import {
  ManageRepairShop,
  RepairShopRatingList,
  RepairShops,
} from 'src/app/core/model/shared/repairShop';
import { ToastrService } from 'ngx-toastr';
import {
  dateFormat,
  dollarFormat,
  formatPhoneNumber,
  numberWithCommas,
} from 'src/app/core/helpers/formating';
import { DeletedItem } from 'src/app/core/model/shared/enums';
import moment from 'moment';
import { ClonerService } from 'src/app/core/services/cloner-service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { NotificationService } from 'src/app/services/notification-service.service';

@Component({
  selector: 'app-repairs-table',
  templateUrl: './repairs-table.component.html',
})
export class RepairsTableComponent implements OnInit, OnDestroy {
  @Input() inputData: any;
  tableOptions: TableOptions;
  tableSubject: BehaviorSubject<TableSubject> = new BehaviorSubject(null);
  repairColumns: TableColumnDefinition[] = [];
  extendedColumns: TableColumnDefinition[] = [];
  repairTrucks: ManageMaintenance[] = [];
  repairTrailers: ManageMaintenance[] = [];
  repairShops: ManageRepairShop[] = [];
  repairShopsCopy: ManageRepairShop[] = [];
  repairShopsTyps: ManageRepairShop[] = [];
  repairShopRatingList: RepairShopRatingList[] = [];
  shopReveiw: Comments[] = [];

  private destroy$: Subject<void> = new Subject<void>();
  loadingItems = true;
  selectedTab = 'active';
  repairTable = '';
  types = [
    { option: 'Truck', active: false },
    { option: 'Trailer', active: false },
    { option: 'Mobile', active: false },
    { option: 'Shop', active: false },
    { option: 'Towing', active: false },
    { option: 'Parts', active: false },
    { option: 'Tire', active: false },
    { option: 'Dealer', active: false },
  ];
  typesSelected = [];
  shopRating: RepairShopRatingList[] = [];
  listShop: any[] = [];
  subscriptions: Subscription[] = [];
  repairTabSelected = false;

  repairTruckFilterYears: number[] = [];
  repairTrailerFilterYears: number[] = [];
  shopCount: number;
  hideTable: boolean;
  tableShopDate: TableData;
  isPmTable: boolean;

  constructor(
    private customModalService: CustomModalService,
    private toastr: ToastrService,
    private shared: SharedService,
    private sharedRepairService: AppSharedService,
    private maintenanceService: MaintenanceService,
    private changeRef: ChangeDetectorRef,
    private elementRef: ElementRef,
    private clonerService: ClonerService,
    private spinner: SpinnerService,
    private sharedService: AppSharedService,
    private notification: NotificationService,
    private maintenanceServise: MaintenanceService
  ) {}

  ngOnInit(): void {
    if (this.maintenanceService.tabShop) {
      this.selectedTab = null;
    }

    this.shared.emitDeleteAction.pipe(takeUntil(this.destroy$)).subscribe((resp: any) => {
      if (this.selectedTab === 'active') {
        this.onDeleteTruckOrTrailer(resp.data.id);
      } else if (this.selectedTab === 'inactive') {
        this.onDeleteTruckOrTrailer(resp.data.id);
      } else {
        this.onDeleteShop(resp.data.id);
      }
    });

    this.sharedService.updateMaintenanceSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: ManageMaintenance) => {
        if (data.category == 'truck') {
          const index = this.repairTrucks.findIndex((rt) => rt.id === data.id);
          if (index !== -1) {
            this.repairTrucks[index] = data;
          }
        }

        if (data.category == 'trailer') {
          const index = this.repairTrailers.findIndex((rt) => rt.id === data.id);
          if (index !== -1) {
            this.repairTrailers[index] = data;
          }
        }

        this.sendRepairData();
        this.loadingItems = false;
      });

    this.sharedService.updatedRepairShopData
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        const index = this.repairShops.findIndex((rt) => rt.id === data.id);
        if (index !== -1) {
          this.repairShops[index] = data;
        }
        this.sendRepairData();
        this.loadingItems = false;
      });

    let isFirstLoad = true;
    this.maintenanceServise.currentShop.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (!isFirstLoad) {
        let isEdit: boolean;
        for (const shop of this.repairShops) {
          if (shop.id === res.id) {
            shop.doc = res.doc;
            shop.name = res.name;
            isEdit = true;
            break;
          }
        }
        if (!isEdit) {
          this.repairShops.push(res);
        }

        this.sendRepairData();
      }
      isFirstLoad = false;
    });

    this.maintenanceServise.currentDeletedShop
      .pipe(takeUntil(this.destroy$))
      .subscribe((shopData: any) => {
       if(shopData && shopData.check){
        const index = this.repairShops.findIndex((shop) => shop.id === shopData.data.id);
        if (index !== -1) {
          this.repairShops.splice(index, 1);
        }
        this.sendRepairData();
        this.loadingItems = false;
       }
      });

    this.initTableOptions();
    this.getRepairData();
  }

  @HostListener('document:click', ['$event.target'])
  onClick(target) {
    const clickedInside = this.elementRef.nativeElement.contains(target);

    if (!clickedInside && this.maintenanceService.newMaintenance) {
      const interval = setInterval(() => {
        this.getRepairData();
        clearInterval(interval);
      }, 200);
      this.maintenanceService.newMaintenance = false;
    }
    if (!clickedInside && this.maintenanceService.newShopOrEdit) {
      
      const interval = setInterval(() => {
        this.getRepairShopData();
        clearInterval(interval);
      }, 200);
      this.maintenanceService.newShopOrEdit = false;
      this.maintenanceService.reloadAddRepair = true;
    }
  }

  initTableOptions(): void {
    let mainAc = [];
    if (this.selectedTab === 'active') {
      mainAc = [
        {
          title: 'Edit',
          name: 'edit-truck-repier',
        },
      ];
    } else if (this.selectedTab === 'inactive') {
      mainAc = [
        {
          title: 'Edit',
          name: 'edit-trailer-repier',
        },
      ];
    } else if (!this.selectedTab) {
      mainAc = [
        {
          title: 'Edit',
          name: 'edit-repier-shop',
        },
      ];
    }
    this.tableOptions = {
      selectedTab: 'active',
      disabledMutedStyle: true,
      data: this.tableSubject,
      useAdditionalFeatures: true,
      toolbarActions: {
        hideImport: false,
        hideExport: false,
        hideLockUnlock: false,
        hideAddNew: false,
        hideColumns: false,
        hideCompress: false,
        hideEmail: true,
        hideShopType: !this.selectedTab ? true : false,
        hideLabel: true,
        hideSwitch: true,
        showTotalCounter: this.selectedTab ? true : false,
        showDateFilter: this.selectedTab ? true : false,
        hideSelectNumber: true,
      },
      config: {
        showSort: true,
        sortBy: '',
        sortDirection: '',
        disabledColumns: [0],
        minWidth: 60,
        dateFilterField: 'maintenanceDate',
      },
      mainActions: mainAc,
      deleteAction: {
        title: 'Delete',
        name: 'delete-repair',
        type: !this.selectedTab ? 'repair-shop' : 'repair',
        text: !this.selectedTab
          ? 'Are you sure you want to delete repair shop(s)?'
          : 'Are you sure you want to delete repair(s)',
      },
    };
    this.changeRef.detectChanges();
  }

  getRepairData() {
    const maintenance$ = this.maintenanceService.getMaintenance();
    const repairShops$ = this.sharedRepairService.getRepairShops();

    forkJoin([maintenance$, repairShops$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ([maintenance, repairShops]: [TruckTrailerMaintenance, RepairShops]) => {
          this.repairShopDataCollecting(repairShops);
          this.repairTrucks = maintenance.maintenanceTruckList
            .filter((r) => r.category === 'truck')
            .map((truck) => {
              if (truck.doc && truck.doc.millage) {
                truck.doc.millage = truck.doc.millage
                  ? numberWithCommas(truck.doc.millage, false)
                  : '';
              }
              if (truck && truck.maintenanceDate) {
                truck.maintenanceDate = truck.maintenanceDate
                  ? dateFormat(truck.maintenanceDate)
                  : '';
              }

              if (truck.doc.items) {
                truck.doc.items.map((t) => {
                  t.price = t.price
                    ? '$' + numberWithCommas(t.price.toString().replace('$', ''), false)
                    : 0;
                  t.price = t.price.toString().replace('$NaN', '');
                });
              }

              if (truck.maintenanceDate) {
                const year = moment(truck.maintenanceDate).year();

                if (this.repairTruckFilterYears.indexOf(year) === -1) {
                  this.repairTruckFilterYears.push(year);
                }
              }

              truck.doc.total = truck.doc.total
                ? '$' + this.numberWithCommas(truck.doc.total.toString().replace('$', ''), false)
                : null;

              return truck;
            });

          this.repairTrailers = maintenance.maintenanceTrailerList
            .filter((r) => r.category === 'trailer')
            .map((trailer) => {
              if (trailer.doc && trailer.doc.millage) {
                trailer.doc.millage = trailer.doc.millage
                  ? numberWithCommas(trailer.doc.millage, false)
                  : '';
              }
              if (trailer && trailer.maintenanceDate) {
                trailer.maintenanceDate = trailer.maintenanceDate
                  ? dateFormat(trailer.maintenanceDate)
                  : '';
              }

              if (trailer.doc.items) {
                trailer.doc.items.map((t) => {
                  t.price = t.price
                    ? '$' + numberWithCommas(t.price.toString().replace('$', ''), false)
                    : 0;
                  t.price = t.price.toString().replace('$NaN', '');
                });
              }

              if (trailer.maintenanceDate) {
                const year = moment(trailer.maintenanceDate).year();

                if (this.repairTrailerFilterYears.indexOf(year) === -1) {
                  this.repairTrailerFilterYears.push(year);
                }
              }

              trailer.doc.total = trailer.doc.total
                ? '$' + this.numberWithCommas(trailer.doc.total.toString().replace('$', ''), false)
                : null;

              return trailer;
            });
          this.sendRepairData();
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  private numberWithCommas(x: any, formatedValue: boolean) {
    return formatedValue
      ? '$' +
          Number(x.replace(',', ''))
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      : Number(x)
          .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  getTruckUnits(): any[] {
    const newArray = [];
    for (const truck of this.repairTrucks) {
      if (newArray.findIndex((t) => t.id === truck.doc.unit) === -1) {
        newArray.push({ id: truck.doc.unit });
      }
    }
    return newArray;
  }

  getTrailerUnits(): any[] {
    const newArray = [];
    for (const trailer of this.repairTrailers) {
      if (newArray.findIndex((t) => t.id === trailer.doc.unit) === -1) {
        newArray.push({ id: trailer.doc.unit });
      }
    }
    return newArray;
  }

  private getGridColumns(stateName: string, resetColumns: boolean): TableColumnDefinition[] {
    const userState: UserState = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );
    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      if (stateName === 'repair_trucks') {
        return getRepairTruckColumnDefinition();
      } else if (stateName === 'repair_trailers') {
        return getRepairTrailerColumnDefinition();
      } else if (stateName === 'repair_trucks_pm') {
        return getRepairTruckPMColumnDefinition();
      } else if (stateName === 'repair_trailers_pm') {
        return getRepairTrailerPMColumnDefinition();
      } else if (stateName === 'repair_shops') {
        return getRepairsShopColumnDefinition();
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
      if (stateName === 'repair_trucks') {
        return getExtendedRepairTruckColumnDefinition();
        /* return getExtendedRepairTruckPMColumnDefinition(); */
      } else if (stateName === 'repair_trailers') {
        /*  return getExtendedRepairTrailerColumnDefinition(); */
        return getExtendedRepairTrailerPMColumnDefinition();
      } else if (stateName === 'repair_shops') {
        return getExtendedRepairsShopColumnDefinition();
      }
    }
  }

  sendRepairData(resetColumns?: boolean): void {
    const data: TableData[] = [
      {
        title: 'Truck',
        field: 'active',
        data: this.repairTrucks.map((rs) => {
          if (rs.doc?.total) {
            rs.description = rs.doc.items.map(x => x.item?.trim()).join('<span class="description-dot"></span>');
            rs.doc.total = rs.doc.total
              ? rs.doc.total.toString().replace('$NaN', '')
              : rs.doc.total;
          }
          return rs;
        }),
        tabFilters: this.getTruckUnits(),
        extended: false,
        filterYears: this.repairTruckFilterYears,
        selectTab: true,
        gridNameTitle: 'Truck',
        stateName: this.isPmTable ? 'repair_trucks_pm' : 'repair_trucks',
        gridColumns: this.getGridColumns(
          this.isPmTable ? 'repair_trucks_pm' : 'repair_trucks',
          resetColumns
        ),
        extendedGridColumns: this.getExtendedGridColumns('repair_trucks', resetColumns),
      },
      {
        title: 'Trailer',
        field: 'inactive',
        data: this.repairTrailers.map((rs) => {
          if (rs.doc?.total) {
            rs.description = rs.doc.items.map(x => x.item?.trim()).join('<span class="description-dot"></span>');
            rs.doc.total = rs.doc.total
              ? rs.doc.total.toString().replace('$NaN', '')
              : rs.doc.total;
          }
          return rs;
        }),
        tabFilters: this.getTrailerUnits(),
        extended: false,
        filterYears: this.repairTrailerFilterYears,
        selectTab: true,
        gridNameTitle: 'Trailer',
        stateName: this.isPmTable ? 'repair_trailers_pm' : 'repair_trailers',
        gridColumns: this.getGridColumns(
          this.isPmTable ? 'repair_trailers_pm' : 'repair_trailers',
          resetColumns
        ),
        extendedGridColumns: this.getExtendedGridColumns('repair_trailers', resetColumns),
      },
      {
        title: 'Shop',
        field: null,
        data: this.repairShops.map((shop) => {
          if (shop.doc && shop.doc.phone) {
            shop.doc.phone = shop.doc.phone ? formatPhoneNumber(shop.doc.phone) : '';
          }
          if (shop.total) {
            shop.total = shop.total
              ? this.numberWithCommas(shop.total.toString().replace('$', ''), true)
              : shop.total;
          }
          return shop;
        }),
        extended: false,
        checkPinned: true,
        numberOfShops: this.shopCount,
        gridNameTitle: 'Shop',
        stateName: 'repair_shops',
        gridColumns: this.getGridColumns('repair_shops', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('repair_shops', resetColumns),
      },
    ];
    this.tableSubject.next({ tableData: data, check: true });
  }

  callAction(data: any): void {
    if (this.selectedTab === 'active') {
      const repairTruck = this.repairTrucks.find((t) => t.id === data.id);
      data.data = repairTruck ? repairTruck : null;
    } else if (this.selectedTab === 'inactive') {
      const repairTrailer = this.repairTrailers.find((t) => t.id === data.id);
      data.data = repairTrailer ? repairTrailer : null;
    } else if (!this.selectedTab) {
      const repairShop = this.repairShops.find((t) => t.id === data.id);
      data.data = repairShop ? repairShop : null;
    }

    if (data.type === 'edit-repier-shop') {
      this.openEditShop(data.id);
    } else if (data.type === 'import-event') {
      this.callImport();
    } else if (data.type === 'insert-event') {
      if (!data.tab) {
        this.onNewShop();
      } else {
        if (data.tab === 'active') {
          this.onAddRepair('truck');
        } else {
          this.onAddRepair('trailer');
        }
      }
    } else if (data.type === 'init-columns-event') {
      this.sendRepairData(true);
    } else if (data.type === 'edit-truck-repier') {
      this.editTruckOrTrailer(data.id, 'truck');
    } else if (data.type === 'edit-trailer-repier') {
      this.editTruckOrTrailer(data.id, 'trailer');
    } else if (data.type === 'delete-repair') {
      if (this.selectedTab === 'active') {
        this.onDeleteTruckOrTrailer(data.id);
      } else if (this.selectedTab === 'inactive') {
        this.onDeleteTruckOrTrailer(data.id);
      } else {
        this.onDeleteShop(data.id);
      }
    } else if (data.type === 'save-note-event') {
      if (this.repairTable === 'Shop') {
        this.saveShopNote(data);
      } else {
        this.saveMaintenanceNote(data);
      }
    }
  }

  private saveShopNote(data: any) {
    const saveData: any = this.clonerService.deepClone<any>(data.data);

    if (!saveData.doc.additionalData) {
      saveData.doc.additionalData = {
        note: '',
      };
    }

    saveData.doc.additionalData.note = data.value;  

    this.spinner.show(true);
    this.sharedService
      .updateRepairShop(saveData, data.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp: any) => {
          this.spinner.show(false);
          this.notification.success('Repair Shop Note has been updated.', 'Success:');
        },
        (error: any) => {
          this.shared.handleServerError();
        }
      );
  }

  private saveMaintenanceNote(data: any) {
    const saveData: ManageMaintenance = this.clonerService.deepClone<ManageMaintenance>(data.data);

    if (!saveData.doc.additionalData) {
      saveData.doc.additionalData = {
        note: '',
      };
    }

    saveData.doc.additionalData.note = data.value;

    this.spinner.show(true);
    this.sharedService
      .updateMaintennace(data.id, saveData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp: any) => {
          this.spinner.show(false);
          this.notification.success('Repair Note has been updated.', 'Success:');
        },
        (error: any) => {
          this.shared.handleServerError();
        }
      );
  }

  onNewShop(): void {
    const data = {
      type: 'new',
    };
    this.customModalService.openModal(RepairShopManageComponent, { data }, null, { size: 'small' });
  }

  openEditShop(id: any): void {
    this.sharedRepairService.getRepairShop(id).subscribe(
      (shop: any) => {
        const data = {
          type: 'edit',
          shop,
          id,
        };
        this.customModalService.openModal(RepairShopManageComponent, { data }, null, {
          size: 'small',
        });
      },
      () => {
        this.shared.handleServerError();
      }
    );
  }

  onDeleteShop(id?: any) {
    let index: number;
    for (let i = 0; i < this.repairShops.length; i++) {
      if (this.repairShops[i].id === id) {
        index = i;
      }
    }
    if (this.repairShops[index].repairCount === 0) {
      this.sharedRepairService.deleteRepairShop(id).subscribe(() => {
        this.toastr.success(`Repair Shop successfully deleted.`, ' ');
      });

      /* Proverava dal ima reting ako nema da ne ulazi */
      for (let j = 0; j < this.repairShopRatingList.length; j++) {
        if (id == this.repairShopRatingList[j]?.repairShopId) {
          this.sharedRepairService
            .deleteRepairShopRating(this.repairShopRatingList[j].id)
            .subscribe();
        }
      }
      const interval = setInterval(() => {
        this.getRepairData();
        /* this.getAllRepairShopsRating(); */
        clearInterval(interval);
      }, 200);
    } else {
      this.toastr.error(
        this.repairShops[index].name + ` has orders, it can't be deleted.`,
        'Error:'
      );
    }
  }

  onAddRepair(vehicle: string) {
    const data = {
      type: 'new',
      vehicle,
    };
    this.customModalService.openModal(MaintenanceManageComponent, { data });
  }

  /* Edit Truck Or Trailer */
  editTruckOrTrailer(id?: any, vehicle?: string) {
    this.sharedRepairService.editMaintennace(id).subscribe(
      (maintenance: ManageMaintenance) => {
        const data = {
          id,
          type: 'edit',
          maintenance,
          vehicle,
        };
        this.customModalService.openModal(MaintenanceManageComponent, { data });
      },
      () => {
        this.shared.handleServerError();
      }
    );
  }
  /* Delete Truck Or Trailer */
  onDeleteTruckOrTrailer(id?: any) {
    this.sharedRepairService.deleteMaintenanceV2(id).subscribe(() => {
      this.toastr.success(`Repair successfully deleted.`, ' ');
    });

    const interval = setInterval(() => {
      this.getRepairData();
      clearInterval(interval);
    }, 200);
  }

  callImport(): void {
    this.customModalService.openModal(DriverImportComponent);
  }

  /* Multiple Delete */
  callDelete(repairsForDelete: DeletedItem[]): void {
    let countOfDeleted = 0;
    if (this.selectedTab === 'active' || this.selectedTab === 'inactive') {
      for (let i = 0; i < repairsForDelete.length; i++) {
        this.sharedRepairService.deleteMaintenanceV2(repairsForDelete[i].id).subscribe();
      }
      this.toastr.success(`Repairs successfully deleted.`, ' ');

      const interval = setInterval(() => {
        this.getRepairData();
        clearInterval(interval);
      }, 200);
    } else {
      for (let i = 0; i < repairsForDelete.length; i++) {
        for (let j = 0; j < this.repairShopRatingList.length; j++) {
          if (repairsForDelete[i].id == this.repairShopRatingList[j]?.repairShopId) {
            countOfDeleted++;
            this.sharedRepairService
              .deleteRepairShopRating(this.repairShopRatingList[j].id)
              .subscribe();
          }
        }
      }

      for (let i = 0; i < repairsForDelete.length; i++) {
        for (const shop of this.repairShops) {
          if (shop.id === repairsForDelete[i].id && shop.repairCount === 0) {
            this.sharedRepairService.deleteRepairShop(repairsForDelete[i].id).subscribe(() => {
              this.toastr.success(`Repair Shops successfully deleted.`, ` `);
            });
          }
          if (shop.repairCount !== 0 && shop.id === repairsForDelete[i].id) {
            this.toastr.error(shop.name + ` has orders, it can't be deleted.`, ` `);
          }
        }
      }

      const interval = setInterval(() => {
        this.getRepairData();
        clearInterval(interval);
      }, 200);
    }
  }

  /* TODO: UKLONI */
  onTypeSelect(event: number) {
    /* this.types[event].active = !this.types[event].active;
    this.typesSelected = [];
    for (let i = 0; i < this.types.length; i++) {
      if (this.types[i].active) {
        this.typesSelected.push({
          type: this.types[i].option,
          active: this.types[i].active,
        });
      }
    }
    if (this.typesSelected.length) {
      this.repairShops = this.repairShopsCopy;
      this.repairShopsTyps = [];
      let count = 0;
      for (let i = 0; i < this.repairShops.length; i++) {
        for (let j = 0; j < this.repairShops[i].doc?.types?.length; j++) {
          for (let k = 0; k < this.typesSelected.length; k++) {
            if (
              this.typesSelected[k].type === this.repairShops[i].doc.types[j].name &&
              this.repairShops[i].doc.types[j].checked
            ) {
              count++;
            }
          }
        }
        if (count === this.typesSelected.length) {
          this.repairShopsTyps.push(this.repairShops[i]);
        }
        count = 0;
      }
      this.repairShops = this.repairShopsTyps;

      for (let i = 0; i < this.repairShops?.length; i++) {
        for (let j = i + 1; j < this.repairShops?.length; j++) {
          if (this.repairShops[i].pinned === 0 && this.repairShops[j].pinned === 1) {
            const pom = this.repairShops[i];
            this.repairShops[i] = this.repairShops[j];
            this.repairShops[j] = pom;
          }
        }
      }
      this.sendRepairData();
    } else {
      this.repairShops = this.repairShopsCopy;
      this.sendRepairData();
    } */
  }

  /* TODO: UKLONI */
  onDeselectedTyps() {
    this.repairShops = this.repairShopsCopy;
    this.sendRepairData();
    for (const type of this.types) {
      type.active = false;
    }
  }

  onPin(shopData: any) {
    if (shopData.shop.pinned === 0) {
      this.toastr.success('Shop Pinned', ' ');
      this.pinShop(shopData.shop.id, {
        pinned: 1,
      });
    } else {
      this.toastr.success('Shop UnPinned', ' ');
      this.pinShop(shopData.shop.id, {
        pinned: 0,
      });
    }

    for (const shop of this.repairShops) {
      if (shop.id === shopData.shop.id) {
        if (shop.pinned === 0) {
          shop.pinned = 1;
        } else {
          shop.pinned = 0;
        }
      }
    }
    this.listShop = [];

    const interval = setInterval(() => {
      this.repairShops = this.getSortedShops();
      this.sendRepairData();
      clearInterval(interval);
    }, 200);
  }

  /* For Collecting Shops Data  */
  repairShopDataCollecting(repairShops: RepairShops) {
    this.listShop = [];
    this.shopCount = repairShops.count;
    this.repairShops = repairShops.data;
    // .map((shop) => {
    //   if (shop.doc && shop.doc.phone) {
    //     shop.doc.phone = shop.doc.phone ? formatPhoneNumber(shop.doc.phone) : '';
    //   }
    //   return shop;
    // });

    /* Sort shop who are pinned */
    this.repairShops = this.getSortedShops();
    this.repairShopsCopy = this.repairShops;
  }

  getRepairShopData() {
    const repairShops$ = this.sharedRepairService.getRepairShops();
    forkJoin([repairShops$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ([repairShops]: [RepairShops]) => {
          this.repairShopDataCollecting(repairShops);
          this.sendRepairData();
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  getSortedShops() {
    for (let i = 0; i < this.repairShops.length; i++) {
      this.listShop.push({
        shop: this.repairShops[i],
      });
    }

    for (let i = 0; i < this.listShop.length; i++) {
      for (let j = 0; j < this.listShop.length; j++) {
        if (this.listShop[i].shop.pinned === 1 && this.listShop[j].shop.pinned === 0) {
          const pom: any = this.listShop[i];
          this.listShop[i] = this.listShop[j];
          this.listShop[j] = pom;
        }
      }
    }
    for (let i = 0; i < this.listShop.length; i++) {
      this.repairShops[i] = this.listShop[i].shop;
    }

    return this.repairShops;
  }

  onShopDataReceive(shopData: TableData) {
    this.tableShopDate = shopData;
    /*  this.hideTable = true; */
  }

  onSwitchTabelView(viewMode: boolean) {
    this.isPmTable = viewMode;
    this.sendRepairData();
  }

  /* Api methods */
  deleteComment(id: number) {
    this.sharedRepairService.deleteComment(id).subscribe();
  }

  editComment(id: number, data: any) {
    this.sharedRepairService.updateComment(id, data).subscribe();
  }

  createReveiw(data) {
    this.sharedRepairService.createComment(data).subscribe();
  }

  pinShop(id: number, data: any) {
    this.sharedRepairService.pinRepairShop(id, data).subscribe();
  }

  createRepairShopReating(data: any) {
    this.sharedRepairService.createRepairShopRating(data).subscribe();
  }

  updateRepairShopReating(data: any, id: number) {
    this.sharedRepairService.updateRepairShopRating(data, id).subscribe();
  }

  updateRepairShop(data: any, id: number) {
    this.sharedRepairService.updateRepairShop(data, id).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
