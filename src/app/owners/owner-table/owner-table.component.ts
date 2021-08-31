import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, Input, HostListener, ElementRef } from '@angular/core';

import { BehaviorSubject, forkJoin, Subject } from 'rxjs';
import {
  TableOptions,
  TableColumnDefinition,
  TableData,
  TableSubject,
} from 'src/app/shared/truckassist-table/models/truckassist-table';
import { AppSharedService } from '../../core/services/app-shared.service';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { OwnerManageComponent } from '../owner-manage/owner-manage.component';
import { OwnerData, OwnerTabData } from 'src/app/core/model/shared/owner';
import { getExtendedOwnerColumnDefinition, getOwnerColumnDefinition } from 'src/assets/utils/settings/owner-columns';
import { DeletedItem } from 'src/app/core/model/shared/enums';
import {
  companyTaxNumberFormat,
  formatPhoneNumber,
  proprietorTaxNumberFormat,
} from 'src/app/core/helpers/formating';
import { UserState } from 'src/app/core/model/user';
import { ClonerService } from 'src/app/core/services/cloner-service';
import { SpinnerService } from 'src/app/core/services/spinner.service';

@Component({
  selector: 'app-owners-table',
  templateUrl: './owner-table.component.html',
})
export class OwnersTableComponent implements OnInit, OnDestroy {
  @Input() inputData: any;
  public tableOptions: TableOptions;
  private tableSubject: BehaviorSubject<TableSubject> = new BehaviorSubject(null);
  public ownerColumns: TableColumnDefinition[] = [];
  public extendedColumns: TableColumnDefinition[] = [];
  private owners: OwnerTabData = null;
  private activeOwners: OwnerData[] = [];
  private inactiveOwners: OwnerData[] = [];
  private allOwners: OwnerData[] = [];
  public loadingItems = true;
  public mySelection: number[] = [];
  private destroy$: Subject<void> = new Subject<void>();
  public deleteType = '';
  public selectedTab = 'active';

  constructor(
    private ownerService: AppSharedService,
    private customModalService: CustomModalService,
    private shared: SharedService,
    private notification: NotificationService,
    private elementRef: ElementRef,
    private sharedService: AppSharedService,
    private clonerService: ClonerService,
    private spinner: SpinnerService,
  ) {}

  ngOnInit(): void {
    this.shared.emitDeleteAction
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (resp: any) => {
        this.deleteOwner(resp.data.id);
      }
    );

    this.sharedService.updateOwnerData
    .pipe(takeUntil(this.destroy$))
    .subscribe((owner: OwnerData) => {
      const activeOwnerIndex = this.activeOwners.findIndex((d) => d.id === owner.id);

      if (activeOwnerIndex !== -1) {
        this.activeOwners[activeOwnerIndex] = owner;
      }

      const inactiveOwnerIndex = this.inactiveOwners.findIndex((d) => d.id === owner.id);

      if (inactiveOwnerIndex !== -1) {
        this.inactiveOwners[inactiveOwnerIndex] = owner;
      }

      const allOwnerIndex = this.allOwners.findIndex((d) => d.id === owner.id);

      if (allOwnerIndex !== -1) {
        this.allOwners[allOwnerIndex] = owner;
      }

      this.sendOwnerData();
      this.loadingItems = false;
    });

    this.initTableOptions();
    this.getOwners();
  }

  /* For owner reload after edit or add */
  @HostListener('document:click', ['$event.target'])
  public onClick(target) {
    const clickedInside = this.elementRef.nativeElement.contains(target);

    if (!clickedInside && this.ownerService.reloadOwner) {
      let count = 0;
      const interval = setInterval(() => {
        this.getOwners();
        count++;
        if (count === 1) {
          clearInterval(interval);
        }
      }, 200);
      this.ownerService.reloadOwner = false;
    }
  }

  private initTableOptions(): void {
    this.tableOptions = {
      data: this.tableSubject,
      toolbarActions: {
        hideLockUnlock: false,
        hideImport: false,
        hideEmail: true,
        hideLabel: true,
        hideSwitch: true,
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
          name: 'edit-owner',
        },
      ],
      deleteAction: {
        title: 'Delete',
        name: 'delete-owner',
        type: 'owner',
        text: 'Are you sure you want to delete owner(s)?',
      },
      type: 'owner',
      class: 'owner-card'
    };
  }

  public getOwners(): void {
    const owners$ = this.ownerService.getOwners();
    forkJoin([owners$])
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      ([owners]: [OwnerTabData]) => {
        this.inactiveOwners = owners.inactiveOwners.map((owner) => {
          if (owner.doc?.additionalData && owner.doc?.additionalData?.phone) {
            owner.doc.additionalData.phone = owner.doc.additionalData.phone
              ? formatPhoneNumber(owner.doc.additionalData.phone)
              : '';
          }
          if (owner.taxNumber) {
            if (owner.category === 'Proprietor') {
              owner.taxNumber = owner.taxNumber ? proprietorTaxNumberFormat(owner.taxNumber) : '';
            } else {
              owner.taxNumber = owner.taxNumber ? companyTaxNumberFormat(owner.taxNumber) : '';
            }
          }
          return owner;
        });

        this.allOwners = owners.allOwners.map((owner) => {
          if (owner?.doc?.additionalData && owner.doc?.additionalData?.phone) {
            owner.doc.additionalData.phone = owner.doc.additionalData.phone
              ? formatPhoneNumber(owner.doc.additionalData.phone)
              : '';
          }
          if (owner.taxNumber) {
            if (owner.category === 'Proprietor') {
              owner.taxNumber = owner.taxNumber ? proprietorTaxNumberFormat(owner.taxNumber) : '';
            } else {
              owner.taxNumber = owner.taxNumber ? companyTaxNumberFormat(owner.taxNumber) : '';
            }
          }
          return owner;
        });

        this.activeOwners = owners.activeOwners.map((owner) => {
          if (owner?.doc?.additionalData && owner?.doc?.additionalData?.phone) {
            owner.doc.additionalData.phone = owner.doc.additionalData.phone
              ? formatPhoneNumber(owner.doc.additionalData.phone)
              : '';
          }
          if (owner.taxNumber) {
            if (owner.category === 'Proprietor') {
              owner.taxNumber = owner.taxNumber ? proprietorTaxNumberFormat(owner.taxNumber) : '';
            } else {
              owner.taxNumber = owner.taxNumber ? companyTaxNumberFormat(owner.taxNumber) : '';
            }
          }
          return owner;
        });
        this.sendOwnerData();
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
      return getOwnerColumnDefinition();
    }
  }

  private getExtendedGridColumns(stateName: string, resetColumns: boolean): TableColumnDefinition[] {
    const userState: UserState = JSON.parse(localStorage.getItem(stateName + '_user_columns_state'));
    if (userState && userState.extendedTableColumns.length && !resetColumns) {
      return userState.extendedTableColumns;
    } else {
      return getExtendedOwnerColumnDefinition();
    }
  }

  private sendOwnerData(resetColumns?: boolean): void {
    const data: TableData[] = [
      {
        title: 'Active',
        field: 'active',
        data: this.activeOwners,
        extended: false,
        gridNameTitle: 'Owner',
        stateName: 'owners',
        gridColumns: this.getGridColumns('owners', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('owners', resetColumns),
      },
      {
        title: 'Inactive',
        field: 'inactive',
        data: this.inactiveOwners,
        extended: false,
        gridNameTitle: 'Owner',
        stateName: 'owners',
        gridColumns: this.getGridColumns('owners', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('owners', resetColumns),
      },
      {
        title: 'All',
        field: null,
        data: this.allOwners,
        extended: false,
        gridNameTitle: 'Owner',
        stateName: 'owners',
        gridColumns: this.getGridColumns('owners', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('owners', resetColumns),
      },
    ];
    this.tableSubject.next({ tableData: data, check: true });
    this.loadingItems = false;
  }

  public callAction(action: any): void {
    if (this.allOwners && this.allOwners.length && action.id) {
      const owner = this.allOwners.find((t) => t.id === action.id);
      action.owner = owner ? owner : null;
    }
    if (action.type === 'insert-event') {
      this.addNewOwner();
      console.log(this.owners);
    } else if (action.type === 'edit-owner') {
      this.editOwner(action.id);
    } else if (action.type === 'delete-owner') {
      this.deleteOwner(action.id);
    } else if (action.type === 'import-event') {
      this.callImport();
    } else if (action.type === 'card-view') {
      this.toggleTableView();
    } else if (action.type === 'init-columns-event') {
      this.sendOwnerData(true);
    } else if (action.type === 'save-note-event') {
      this.saveNote(action);
    }
  }

  private saveNote(data: any) {
    const saveData: OwnerData = this.clonerService.deepClone<OwnerData>(data.owner);

    if (!saveData.doc.additionalData) {
      saveData.doc.additionalData = {
        note: '',
      };
    }
    saveData.doc.additionalData.note = data.value;

    this.spinner.show(true);
    this.sharedService.updateOwner(saveData, saveData.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (resp: any) => {
        this.notification.success(`Owner Note has been updated.`, 'Success:');
        this.spinner.show(false);
      },
      (error: any) => {
        this.shared.handleServerError();
      }
    );
  }

  public toggleTableView() {
    this.ownerService.emitViewChange.emit(true);
  }

  public callImport(): void {}

  public editOwner(id: number) {
    console.log(id);
    const data = {
      type: 'edit',
      id,
    };
    this.customModalService.openModal(OwnerManageComponent, { data }, null, { size: 'small' });
  }

  public deleteOwner(id) {
    this.ownerService.deleteOwner(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      () => {
        this.notification.success('Owner successfully deleted.', 'Success:');
        this.shared.emitOwnerDelete.emit(true);
      },
      () => {
        this.shared.handleServerError();
      }
    );

    let count = 0;
    const interval = setInterval(() => {
      this.getOwners();
      count++;
      if (count === 1) {
        clearInterval(interval);
      }
    }, 200);
  }

  public addNewOwner() {
    const data = {
      type: 'new',
      id: null,
    };
    this.customModalService.openModal(OwnerManageComponent, { data }, null, { size: 'small' });
  }

  public callDelete(ownersForDeletion: DeletedItem[]): void {
    for (const owner of ownersForDeletion) {
      this.ownerService.deleteOwner(owner.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.shared.emitOwnerDelete.emit(true);
        },
        () => {
          this.shared.handleServerError();
        }
      );
    }

    let count = 0;
    const interval = setInterval(() => {
      this.getOwners();
      count++;
      if (count === 1) {
        clearInterval(interval);
      }
    }, 200);

    this.notification.success('Owners successfully deleted.', 'Success:');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
