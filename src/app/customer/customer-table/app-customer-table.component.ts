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
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, forkJoin, Subject } from 'rxjs';
import { formatPhoneNumber, numberWithCommas } from 'src/app/core/helpers/formating';
import { Comments } from 'src/app/core/model/comment';
import {
  Customer,
  CustomerReiting,
  Customers,
  Shipper,
  ShipperReiting,
  Shippers,
} from 'src/app/core/model/customer';
import { DeletedItem } from 'src/app/core/model/shared/enums';
import { UserState } from 'src/app/core/model/user';
import { AppCustomerService } from 'src/app/core/services/app-customer.service';
import { AppSharedService } from 'src/app/core/services/app-shared.service';
import { ClonerService } from 'src/app/core/services/cloner-service';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
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
  getBrokerColumnDefinition,
  getExtendedBrokerColumnDefinition,
  getExtendedShipperColumnDefinition,
  getShipperColumnDefinition,
} from 'src/assets/utils/settings/customer-columns';
import { CustomerManageComponent } from '../customer-manage/customer-manage.component';
import { ShipperManageComponent } from '../shipper-manage/shipper-manage.component';

@Component({
  selector: 'app-customer-table',
  templateUrl: './app-customer-table.component.html',
})
export class CustomerTableComponent implements OnInit, OnDestroy {
  @Input() inputData: any;
  public tableOptions: TableOptions;
  private tableSubject: BehaviorSubject<TableSubject> = new BehaviorSubject(null);
  public customerColumns: TableColumnDefinition[] = [];
  public extendedColumns: TableColumnDefinition[] = [];
  public loadingItems = true;
  public selectedTab = 'active';
  public customerTable = '';
  private destroy$: Subject<void> = new Subject<void>();
  private brokers: Customer[] = [];
  private banBrokers: Customer[] = [];
  private dnuBrokers: Customer[] = [];
  private shippers: Shipper[] = [];
  public customerReiting: CustomerReiting[] = [];
  public shipperReitng: ShipperReiting[] = [];
  private customerAndShiperComments: Comments[] = [];
  public reloadBrokers = true;
  customerOptions: any = [
    {
      title: 'Move to DNU',
      reverseTitle: 'Remove from DNU',
      name: 'move-to-dnu',
      type: 'dnu',
    },
    {
      title: 'Move to ban list',
      reverseTitle: 'Remove from ban list',
      name: 'move-to-ban-list',
      type: 'ban',
    },
  ];

  constructor(
    private customerService: AppCustomerService,
    private customModalService: CustomModalService,
    private toastr: ToastrService,
    private shared: SharedService,
    private changeRef: ChangeDetectorRef,
    private elementRef: ElementRef,
    private reveiwServise: AppSharedService,
    private clonerService: ClonerService,
    private spinner: SpinnerService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.customerService.updateShipperSubject
    .pipe(takeUntil(this.destroy$))
    .subscribe((shipper: Shipper) => {
      const index = this.shippers.findIndex((d) => d.id === shipper.id);
      if (index !== -1) {
        this.shippers[index] = shipper;
      }
      this.sendCustomerData();
    });

    this.customerService.updateCustomerSubject
    .pipe(takeUntil(this.destroy$))
    .subscribe((broker: Customer) => {
      const index = this.brokers.findIndex((d) => d.id === broker.id);
      if (index !== -1) {
        this.brokers[index] = broker;
        if (!broker.ban) {
          const ban_index = this.dnuBrokers.findIndex((d) => d.id === broker.id);
          this.banBrokers.splice(ban_index, 1);
        } else if (broker.ban == 1) { this.banBrokers.splice(index, 0, broker); }
        if (!broker.dnu) {
          const dnu_index = this.dnuBrokers.findIndex((d) => d.id === broker.id);
          this.dnuBrokers.splice(dnu_index, 1);
        } else if (broker.dnu == 1) { this.dnuBrokers.splice(index, 0, broker); }
      }
      this.sendCustomerData();
    });

    this.initTableOptions();
    this.getCustomerData();
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(target) {
    const clickedInside = this.elementRef.nativeElement.contains(target);

    if (!clickedInside && this.customerService.customerEdited) {
      let count = 0;
      const interval = setInterval(() => {
        this.getCustomerData();
        count++;
        if (count === 1) {
          clearInterval(interval);
        }
      }, 200);
      this.customerService.customerEdited = false;
    }
    if (!clickedInside && this.customerService.shipperEdited) {
      let count = 0;
      const interval = setInterval(() => {
        this.getCustomerData();
        count++;
        if (count === 1) {
          clearInterval(interval);
        }
      }, 200);
      this.customerService.shipperEdited = false;
    }
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: any) {
    let count = 0;
    const x = event.keyCode;
    if (x === 13) {
      const interval = setInterval(() => {
        if (this.customerService.customerEdited) {
          this.getCustomerData();
          this.customerService.customerEdited = false;
        }

        count++;
        if (count === 1) {
          clearInterval(interval);
        }
      }, 200);
    }
  }

  private initTableOptions(): void {
    this.tableOptions = {
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
        hideShopType: false,
        showCustomerFilter: this.selectedTab === 'active',
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
          title: 'Edit',
          name: 'edit-cutomer-or-shipper',
        },
      ],
      customerActions: this.selectedTab === 'active' ? this.customerOptions : null,
      deleteAction: {
        title: 'Delete',
        name: 'delete',
        type: 'customer',
        text:
          this.selectedTab === 'active'
            ? 'Are you sure you want to delete customer(s)?'
            : 'Are you sure you want to delete shipper(s)?',
      },
    };
    this.changeRef.detectChanges();
  }

  getCustomerData() {
    const brokers$ = this.customerService.getCustomers();
    const shipper$ = this.customerService.getShipper();
    forkJoin([brokers$, shipper$])
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      ([customers, shippers]: [Customers, Shippers]) => {
        this.brokers = customers.activeBrokers.map((broker: Customer) => {
          if (broker.doc && broker.doc.phone) {
            broker.doc.phone = broker.doc.phone ? formatPhoneNumber(broker.doc.phone) : '';
          }
          if (broker.doc && broker.doc.dbaName) {
            broker.name = broker.doc.dbaName ? broker.doc.dbaName : broker.name;
          }

          broker.total = broker.total
            ? '$' + numberWithCommas(broker.total.toString().replace('$', ''), false)
            : null;
          return broker;
        });

        console.log(this.brokers);

        this.banBrokers = customers.banBrokers.map((broker) => {
          if (broker.doc && broker.doc.phone) {
            broker.doc.phone = broker.doc.phone ? formatPhoneNumber(broker.doc.phone) : '';
          }
          if (broker.doc && broker.doc.dbaName) {
            broker.name = broker.doc.dbaName ? broker.doc.dbaName : broker.name;
          }
          broker.total = broker.total
            ? '$' + numberWithCommas(broker.total.toString().replace('$', ''), false)
            : null;
          return broker;
        });

        this.dnuBrokers = customers.dnuBrokers.map((broker) => {
          if (broker.doc && broker.doc.phone) {
            broker.doc.phone = broker.doc.phone ? formatPhoneNumber(broker.doc.phone) : '';
          }
          if (broker.doc && broker.doc.dbaName) {
            broker.name = broker.doc.dbaName ? broker.doc.dbaName : broker.name;
          }
          broker.total = broker.total
            ? '$' + numberWithCommas(broker.total.toString().replace('$', ''), false)
            : null;
          return broker;
        });
        this.shippers = shippers.data.map((shipper) => {
          if (shipper.doc && shipper.doc.phone) {
            shipper.doc.phone = shipper.doc.phone ? formatPhoneNumber(shipper.doc.phone) : '';
          }
          shipper.total = shipper.total
            ? '$' + numberWithCommas(shipper.total.toString().replace('$', ''), false)
            : null;
          return shipper;
        });
        this.sendCustomerData();
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
      return stateName === 'brokers' ? getBrokerColumnDefinition() : getShipperColumnDefinition();
    }
  }

  private getExtendedGridColumns(stateName: string, resetColumns: boolean): TableColumnDefinition[] {
    const userState: UserState = JSON.parse(localStorage.getItem(stateName + '_user_columns_state'));
    if (userState && userState.extendedTableColumns.length && !resetColumns) {
      return userState.extendedTableColumns;
    } else {
      return stateName === 'brokers' ? getExtendedBrokerColumnDefinition() : getExtendedShipperColumnDefinition();
    }
  }

  private sendCustomerData(resetColumns?: boolean): void {
    const data: TableData[] = [
      {
        title: 'Broker',
        field: 'active',
        data: this.brokers,
        extended: false,
        isCustomer: true,
        filterData: {
          dnu: this.dnuBrokers,
          ban: this.banBrokers,
        },
        gridNameTitle: 'Broker',
        stateName: 'brokers',
        gridColumns: this.getGridColumns('brokers', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('brokers', resetColumns),
      },
      {
        title: 'Shipper',
        field: 'inactive',
        data: this.shippers,
        extended: false,
        isCustomer: true,
        gridNameTitle: 'Shipper',
        stateName: 'shippers',
        gridColumns: this.getGridColumns('shippers', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('shippers', resetColumns),
      },
    ];
    this.tableSubject.next({ tableData: data, check: true });
  }

  public callAction(action: any): void {
    if (this.brokers.length && action.id) {
      const broker = this.brokers.find((t) => t.id === action.id);
      if (broker) {
        action.customer = this.clonerService.deepClone<Customer>(broker);
      }
    }

    if (this.shippers.length && action.id) {
      const shipper = this.shippers.find((t) => t.id === action.id);
      if (shipper) {
        action.customer = this.clonerService.deepClone<Shipper>(shipper);
      }
    }

    if (action.type === 'import-event') {
      this.callImport();
    } else if (action.type === 'insert-event') {
      if (this.selectedTab === 'active') {
        this.onAddCustomer();
      } else {
        this.onAddShipper();
      }
    } else if (action.type === 'init-columns-event') {
      this.sendCustomerData(true);
    } else if (action.type === 'edit-cutomer-or-shipper') {
      this.editCustomerOrShipper(action.id);
    } else if (action.type === 'delete') {
      this.deleteCustomerOrShipper(action.id);
    } else if (action.type === 'save-note-event') {
      this.saveNote(action);
    } else if (action.type === 'move-to-ban-list' || action.type === 'move-to-dnu') {
      this.editCustomerOrShipperBanList(action, action.type);
    }
  }

  public editCustomerOrShipperBanList(data: any, type: string) {
    const saveData: Customer = this.clonerService.deepClone<Customer>(data.customer);
    if (type == 'move-to-ban-list') {
      saveData.ban = saveData.ban ? 0 : 1;
      saveData.dnu = 0;
    } else {
      saveData.ban = 0;
      saveData.dnu = saveData.dnu ? 0 : 1;
    }

    this.spinner.show(true);
    this.customerService.updateCustomer(saveData, saveData.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (customer: any) => {
        this.notification.success('Broker has been updated.', 'Success:');
        this.spinner.show(false);
      },
      () => {
        this.shared.handleServerError();
      }
    );
  }

  private saveNote(data: any) {
    if (this.selectedTab === 'active') {
      const saveData: Customer = this.clonerService.deepClone<Customer>(data.customer);
      saveData.doc.note = data.value;

      this.spinner.show(true);
      this.customerService.updateCustomer(saveData, saveData.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.notification.success('Broker Note has been updated.', 'Success:');
          this.spinner.show(false);
        },
        () => {
          this.shared.handleServerError();
        }
      );
    } else {
      const saveData: Shipper = this.clonerService.deepClone<Shipper>(data.customer);
      saveData.doc.note = data.value;

      this.spinner.show(true);
      this.customerService.updateShipper(saveData, saveData.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.notification.success('Shipper Note has been updated.', 'Success:');
          this.spinner.show(false);
        },
        () => {
          this.shared.handleServerError();
        }
      );
    }
  }

  public editCustomerOrShipper(id: number) {
    if (this.selectedTab === 'active') {
      this.customerService.getCustomerById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (customer: any) => {
          const data = {
            type: 'edit',
            customer,
            id,
          };
          this.customModalService.openModal(CustomerManageComponent, { data }, null, {
            size: 'small',
          });
        },
        () => {
          this.shared.handleServerError();
        }
      );
    } else {
      this.customerService.getShipperById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (shipper: any) => {
          const data = {
            type: 'edit',
            shipper,
            id,
          };
          this.customModalService.openModal(ShipperManageComponent, { data }, null, {
            size: 'small',
          });
        },
        () => {
          this.shared.handleServerError();
        }
      );
    }
  }

  /* Single delete of customer or shipper */
  public deleteCustomerOrShipper(id: number) {
    if (this.selectedTab === 'active') {
      this.deleteCustomer(id);

      for (let i = 0; i < this.customerReiting.length; i++) {
        if (this.customerReiting[i].customerId === id) {
          this.deleteCustomerReiting(this.customerReiting[i].id);
        }
      }

      this.toastr.success('Customer deleted', ' ');
    } else {
      this.deleteShipper(id);

      for (let i = 0; i < this.shipperReitng.length; i++) {
        if (this.shipperReitng[i].shipperId === id) {
          this.deleteShipperReiting(this.shipperReitng[i].id);
        }
      }

      this.toastr.success('Shipper deleted', ' ');
    }

    let count = 0;
    const interval = setInterval(() => {
      this.getCustomerData();
      count++;
      if (count === 1) {
        clearInterval(interval);
      }
    }, 200);
  }

  public onAddCustomer() {
    const data = {
      type: 'new',
      id: null,
    };
    this.customModalService.openModal(CustomerManageComponent, { data }, null, { size: 'small' });
    console.log(this.customerReiting);
  }

  public onAddShipper() {
    const data = {
      type: 'new',
      id: null,
    };
    this.customModalService.openModal(ShipperManageComponent, { data }, null, {
      size: 'small',
    });
  }

  public callImport(): void {
    this.customModalService.openModal(DriverImportComponent);
  }

  /* Multiple Delete */
  public callDelete(customersDelete: DeletedItem[]): void {
    let countOfDeleted = 0;
    if (this.selectedTab === 'active') {
      for (let i = 0; i < customersDelete.length; i++) {
        this.deleteCustomer(customersDelete[i].id);
        countOfDeleted++;
      }

      for (let i = 0; i < customersDelete.length; i++) {
        for (let j = 0; j < this.customerReiting.length; j++) {
          if (this.customerReiting[j].customerId === customersDelete[i].id) {
            this.deleteCustomerReiting(this.customerReiting[i].id);
          }
        }
      }

      if (customersDelete.length === countOfDeleted) {
        this.toastr.success('Customers deleted', ' ');
      } else {
        this.toastr.error(`Could not be deleted.`, 'Error:');
      }
    } else {
      for (let i = 0; i < customersDelete.length; i++) {
        this.deleteShipper(customersDelete[i].id);
        countOfDeleted++;
      }

      for (let i = 0; i < customersDelete.length; i++) {
        for (let j = 0; j < this.shipperReitng.length; j++) {
          if (this.shipperReitng[j].shipperId === customersDelete[i].id) {
            this.deleteShipperReiting(this.shipperReitng[i].id);
          }
        }
      }

      if (customersDelete.length === countOfDeleted) {
        this.toastr.success('Shippers deleted', ' ');
      } else {
        this.toastr.error(`Could not be deleted.`, 'Error:');
      }
    }

    countOfDeleted = 0;
    let count = 0;
    const interval = setInterval(() => {
      this.getCustomerData();
      count++;
      if (count === 1) {
        clearInterval(interval);
      }
    }, 200);
  }

  /* Shipper reting API */
  public createShipperReiting(data: any) {
    this.customerService.createShipperReiting(data)
    .pipe(takeUntil(this.destroy$))
    .subscribe();
  }

  public deleteShipperReiting(id: number) {
    this.customerService.deleteShipperReiting(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe();
  }

  /* Customer Reting API */
  public createCustomeRreiting(data: any) {
    this.customerService.createCustomerReiting(data)
    .pipe(takeUntil(this.destroy$))
    .subscribe();
  }

  public deleteCustomerReiting(id: number) {
    this.customerService.deleteCustomerReiting(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe();
  }

  public createCustomerShopReating(data: any) {
    this.customerService.createCustomerReiting(data)
    .pipe(takeUntil(this.destroy$))
    .subscribe((res) => {
      console.log(res);
    });
  }

  /* Customer and Shipper  API */

  public deleteCustomer(id: number) {
    this.customerService.deleteCustomer(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe();
  }

  public deleteShipper(id: number) {
    this.customerService.deleteShipper(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
