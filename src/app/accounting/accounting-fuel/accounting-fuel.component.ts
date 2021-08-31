import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserState } from 'src/app/core/model/user';
import { Subscription, Subject, BehaviorSubject, forkJoin } from 'rxjs';
import {
  getExtendedTruckTrailerFuelColumnDefinition,
  getTruckTrailerFuelColumnDefinition,
} from 'src/assets/utils/settings/internal-columns/truck-trailer-fuel-columns';
import { MaintenanceService } from 'src/app/core/services/maintenance.service';
import { AppTruckService } from 'src/app/core/services/app-truck.service';
import { ManageMaintenance } from 'src/app/core/model/shared/maintenance';
import { AppSharedService } from 'src/app/core/services/app-shared.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { dateFormat, dollarFormat, timeFormat } from 'src/app/core/helpers/formating';
import { NotificationService } from 'src/app/services/notification-service.service';
import { FuelManageComponent } from './../fuel-manage/fuel-manage.component';
import { AppFuelService } from './../../core/services/app-fuel.service';
import {
  TableOptions,
  TableColumnDefinition,
  TableData,
  TableSubject,
} from '../../shared/truckassist-table/models/truckassist-table';
import {
  getAccountingFuelColumnDefinition,
  getExtendedAccountingFuelColumnDefinition,
} from 'src/assets/utils/settings/accounting-fuel-columns';
@Component({
  selector: 'app-accounting-fuel',
  templateUrl: './accounting-fuel.component.html',
  styleUrls: ['./accounting-fuel.component.scss'],
})
export class AccountingFuelComponent implements OnInit {
  constructor(
    private changeRef: ChangeDetectorRef,
    private maintenanceService: MaintenanceService,
    private truckService: AppTruckService,
    private shared: SharedService,
    private customModalService: CustomModalService,
    private notification: NotificationService,
    private fuelService: AppFuelService,
    private router: Router
  ) {}
  public tableOptions: TableOptions;
  public truckTrailersColumns: TableColumnDefinition[] = [];
  private tableSubject: BehaviorSubject<TableSubject> = new BehaviorSubject(null);
  public fuelData = [];
  public allRepairTrucks: ManageMaintenance[] = [];
  public truckId: number;
  public truckUnit: any;

  public trucks: any[] = [];
  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.getFuelData();
    this.initTableOptions();

    /* Wait For Delete */
    this.shared.emitDeleteAction.pipe(takeUntil(this.destroy$)).subscribe((resp: any) => {
      if (resp.data.id) {
        this.deleteFuel(resp.data.id);
      }
    });

    /* Wait For Delete */
    this.fuelService.editedLoad.pipe(takeUntil(this.destroy$)).subscribe((resp: any) => {
      this.getFuelData();
    });
  }

  /* Set Table Options */
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
        hideCompress: true,
        hideLabel: true,
        hideSelectNumber: true,
        hideSwitchView: true,
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
        type: 'fuel',
        text: 'Are you sure you want to delete fuel(s)?',
      },
    };
    this.changeRef.detectChanges();
  }

  /* Send Data To Table */
  private sendAccountingFuelData(resetColumns?: boolean): void {
    const data: TableData[] = [
      {
        title: 'Fuel',
        field: 'active',
        data: this.fuelData,
        extended: false,
        hideLength: false,
        gridNameTitle: 'Fuel',
        stateName: 'fuels',
        gridColumns: this.getGridColumns('fuel', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('fuel', resetColumns),
      },
    ];
    this.tableSubject.next({ tableData: data, check: true });
  }

  /* Get Grid Columns*/
  private getGridColumns(stateName: string, resetColumns: boolean): TableColumnDefinition[] {
    const userState: UserState = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );
    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      return getAccountingFuelColumnDefinition();
    }
  }

  /* Get Extended Grid Columns*/
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
      return getExtendedAccountingFuelColumnDefinition();
    }
  }

  /* Get Fuel Data */
  getFuelData() {
    this.fuelService
      .getFuellist()
      .pipe(takeUntil(this.destroy$))
      .subscribe(  
        (res: any) => {
          console.log('Fuel Data');
          console.log(res)

          this.fuelData = [];
          res.map((item) => {
            this.setFuelData(item);
          });

          this.sendAccountingFuelData();

          console.log('Fuel Data');
          console.log(this.fuelData);
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  /* Set Fuel Data */
  setFuelData(item: any) {
    let docCounts;

    /* Get qtyTotal And  priceTotal*/
    item && item.fuelItems
      ? (docCounts = item.fuelItems.reduce(
          (dataCount, items) => {
            if (items.qty) {
              dataCount.qtyTotal = dataCount.qtyTotal + items.qty;
            }
            return dataCount;
          },
          { qtyTotal: 0 }
        ))
      : (docCounts = { qtyTotal: 0 });


    /* Fill fuelData Object For Tabel */
    this.fuelData.push({
      api: item.api,
      apiTransactionId: item.apiTransactionId,
      avatar: item.avatar,
      companyId: item.companyId,
      companyName: item.companyName,
      createdAt: item.createdAt,
      doc: item.doc,
      driverFullName: item.driverFullName,
      driverId: item.driverId,
      fuelItems: item.fuelItems,
      guid: item.guid,
      id: item.id,
      invoice: item.invoice,
      location: item.location,
      longitude: item.longitude,
      name: item.name ? item.name : 'No Data',
      supplierId: item.supplierId,
      supplierName: item.supplierName,
      timezoneOffset: item.timezoneOffset,
      total: item.total,
      cardNumber: item.cardNumber ? item.cardNumber : 'No Date',
      transactionDate: item.transactionDate
        ? dateFormat(item.transactionDate)
        : dateFormat(new Date()),
      transactionTime: item.transactionDate
        ? timeFormat(new Date(item.transactionDate))
        : timeFormat(new Date()),
      truckId: item.truckId,
      truckNumber: item.truckNumber,
      updatedAt: item.updatedAt,
      qtyTotal: docCounts.qtyTotal.toFixed(2),
      priceTotal: item.total,
    });
  }

  /* Tabel Actions */
  public callAction(action: any): void {
    if (action.type === 'insert-event') {
      this.addNewFuel(action.id);
    } else if (action.type === 'edit') {
      this.openEditFuelItem(action.id);
    } else if (action.type === 'init-columns-event') {
      this.sendAccountingFuelData(true);
    }
  }

  /* Add New Fuel */
  addNewFuel(id: any) {
    const data = {
      type: 'new',
      id: null,
    };
    this.customModalService.openModal(FuelManageComponent, { data }, null, { size: 'small' });
  }

  /* Edit Fuel Item */
  openEditFuelItem(id: any) {
    const data = {
      type: 'edit',
      id,
    };
    this.customModalService.openModal(FuelManageComponent, { data }, null, { size: 'small' });
  }

  /* Delete Action From Tabel */
  public callDeleteAction(fuelsForDelete: any[]): void {
    for (const fuelId of fuelsForDelete) {
      this.deleteFuel(fuelId.id);
    }
    this.notification.success('Fuels successfully deleted.', 'Success:');
  }

  /* Delete Fuel Item */
  public deleteFuel(id) {
    this.fuelService.deleteFuel(id).subscribe(() => {
      this.getFuelData();
    });
  }

  /* Destroy Component On Exit */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
