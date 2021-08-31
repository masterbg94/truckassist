import { MvrMaintenanceComponent } from './../mvr-maintenance/mvr-maintenance.component';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { UserState } from 'src/app/core/model/user';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import {
  TableColumnDefinition,
  TableData,
  TableOptions,
  TableSubject,
} from 'src/app/shared/truckassist-table/models/truckassist-table';

import { getMvrColumns, getExtendedMvrColumns } from 'src/assets/utils/settings/mvr-columns';
import { DeletedItem } from 'src/app/core/model/shared/enums';

@Component({
  templateUrl: './mvr-table.component.html',
  styleUrls: ['./mvr-table.component.scss'],
})
export class MvrTableComponent implements OnInit, OnDestroy {
  public tableOptions: TableOptions;
  private tableSubject: BehaviorSubject<TableSubject> = new BehaviorSubject(null);
  public mvrColumns: TableColumnDefinition[] = [];
  public mvrExtendedColumns: TableColumnDefinition[] = [];
  public loadingItems = true;
  private destroy$: Subject<void> = new Subject<void>();

  private mvrData = [];
  private mvrDataPending = [];
  private mvrDataComplete = [];
  private mvrDataDeclined = [];

  constructor(
    private changeRef: ChangeDetectorRef,
    private customModalService: CustomModalService
  ) {}

  ngOnInit(): void {
    this.initTableOptions();
    this.getMvrData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  callDelete(item: DeletedItem[]) {
    // console.log(item);
  }

  callAction(data: any) {
    if (data.type === 'init-columns-event') {
      this.sendMvrData(true);
    } else if (data.type === 'insert-event') {
      this.callInsertEvent();
    }
  }

  callInsertEvent() {
    const data = {
      type: 'new',
      id: null,
    };
    this.customModalService.openModal(MvrMaintenanceComponent, { data }, null, { size: 'small' });
  }

  getMvrData() {
    const mvr$ = [
      {
        id: '219639',
        name: 'Hiro Nakamura',
        cdl: '123-45-6789',
        state: 'AL',
        orderedBy: 'Peter Parker',
        status: 'Declined',
        charge: '-$13.99',
        orderDate: '16/12/20 09:42 PM',
        completed: '',
      },
      {
        id: '219640',
        name: 'James Halpert',
        cdl: '658-12-8947',
        state: 'KY',
        orderedBy: 'Peter Parker',
        status: 'Pending',
        charge: '-$13.99',
        orderDate: '03/24/20 09:42 PM',
        completed: '',
      },
      {
        id: '219643',
        name: 'Tony Soprano',
        cdl: '658-12-8947',
        state: 'CA',
        orderedBy: 'Peter Parker',
        status: 'Declined',
        charge: '$13.99',
        orderDate: '03/24/20 09:42 PM',
        completed: '16/08/20 04:42 PM',
      },
      {
        id: '219644',
        name: 'Walter White',
        cdl: '658-12-8947',
        state: 'NM',
        orderedBy: 'Peter Parker',
        status: 'Complete',
        charge: '$13.99',
        orderDate: '03/24/20 09:42 PM',
        completed: '22/08/23 04:42 PM',
      },
      {
        id: '219645',
        name: 'Aleksandar Djordjevic',
        cdl: '658-12-8947',
        state: 'MS',
        orderedBy: 'Peter Parker',
        status: 'Declined',
        charge: '$0.00',
        orderDate: '03/24/20 09:42 PM',
        completed: '22/08/23 04:42 PM',
      },
    ];

    this.mvrData = mvr$;

    this.mvrDataPending = this.mvrData.filter((item) => item.status === 'Pending');
    this.mvrDataComplete = this.mvrData.filter((item) => item.status === 'Complete');
    this.mvrDataDeclined = this.mvrData.filter((item) => item.status === 'Declined');

    this.sendMvrData();
  }

  initTableOptions() {
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
        hideShopType: false,
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
      mainActions: [],
      deleteAction: {
        title: 'Delete',
        name: 'delete-mvr',
        type: 'mvr',
        text: 'Are you sure you want to delete mvr item?',
      },
    };
    this.changeRef.detectChanges();
  }

  private sendMvrData(resetColumns?: boolean): void {
    const data: TableData[] = [
      {
        title: 'Pending',
        field: 'active',
        data: this.mvrDataPending,
        extended: false,
        gridNameTitle: 'Pending',
        stateName: 'mvr',
        gridColumns: this.getGridColumns('mvr', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('mvr', resetColumns),
      },
      {
        title: 'Complete',
        field: 'inactive',
        data: this.mvrDataComplete,
        extended: false,
        gridNameTitle: 'Complete',
        stateName: 'mvr',
        gridColumns: this.getGridColumns('mvr', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('mvr', resetColumns),
      },
      {
        title: 'Declined',
        field: 'declined',
        data: this.mvrDataDeclined,
        extended: false,
        gridNameTitle: 'Declined',
        stateName: 'mvr',
        gridColumns: this.getGridColumns('mvr', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('mvr', resetColumns),
      },
      {
        title: 'All',
        field: 'all',
        data: this.mvrData,
        extended: false,
        gridNameTitle: 'All',
        stateName: 'mvr',
        gridColumns: this.getGridColumns('mvr', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('mvr', resetColumns),
      },
    ];
    this.tableSubject.next({ tableData: data, check: true });
  }

  private getGridColumns(stateName: string, resetColumns: boolean): TableColumnDefinition[] {
    const userState: UserState = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );
    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      return getMvrColumns();
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
      return getExtendedMvrColumns();
    }
  }
}
