import { DeletedItem } from 'src/app/core/model/shared/enums';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import {
  TableColumnDefinition,
  TableData,
  TableOptions,
  TableSubject,
} from 'src/app/shared/truckassist-table/models/truckassist-table';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { Tax2290MaintenanceComponent } from '../tax2290-maintenance/tax2290-maintenance.component';
import { UserState } from 'src/app/core/model/user';
import {
  get2290Columns,
  get2290ActiveColumns,
  get2290FinishedColumns,
  get2290ExtendedColumns,
  get2290ActiveExtendedColumns,
  get2290FinishedExtendedColumns,
} from 'src/assets/utils/settings/2290-columns';

@Component({
  selector: 'app-tax2290-table',
  templateUrl: './tax2290-table.component.html',
  styleUrls: ['./tax2290-table.component.scss'],
})
export class Tax2290TableComponent implements OnInit, OnDestroy {
  public tableOptions: TableOptions;
  private tableSubject: BehaviorSubject<TableSubject> = new BehaviorSubject(null);
  public _2290Columns: TableColumnDefinition[] = [];
  public _2290ExtendedColumns: TableColumnDefinition[] = [];
  public loadingItems = true;
  private destroy$: Subject<void> = new Subject<void>();

  private _2290 = [];
  private _2290Active = [];
  private _2290Finished = [];

  constructor(
    private changeRef: ChangeDetectorRef,
    private customModalService: CustomModalService
  ) {}

  ngOnInit(): void {
    this.initTableOptions();
    this.get2290Data();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  callDelete(item: DeletedItem[]) {}

  callAction(data) {
    if (data.type === 'init-columns-event') {
      this.send2290Data(true);
    } else if (data.type === 'insert-event') {
      this.callInsertEvent();
    }
  }

  callInsertEvent() {
    const data = {
      type: 'new',
      id: null,
    };
    this.customModalService.openModal(Tax2290MaintenanceComponent, { data }, null, {
      size: 'small',
    });
  }

  get2290Data() {
    const _2290 = [
      {
        id: '219639',
        company: 'IVS Freight Inc.',
        taxSeason: '2019 - 2020 HVUT Return',
        vins: '2',
        tax: '$321.67',
        fillingFee: '$975.00',
        eFilled: '16/12/20 09:42 PM',
        status: 'Incomplete',
        summary: 'Summary',
        schedule: 'Schedule',
        finish: 'Finish'
      },
      {
        id: '219640',
        company: 'IVS Freight Inc.',
        taxSeason: '2019 - 2020 HVUT Return',
        vins: '3',
        tax: '$2321.67',
        fillingFee: '$975.00',
        eFilled: '16/12/20 09:42 PM',
        status: 'Complete',
        summary: 'Summary',
        schedule: 'Schedule',
        finish: 'Finish'
      },
      {
        id: '219641',
        company: 'IVS Freight Inc.',
        taxSeason: '2019 - 2020 HVUT Return',
        vins: '78',
        tax: '$1321.67',
        fillingFee: '$975.00',
        eFilled: '16/12/20 09:42 PM',
        status: 'Pending',
        summary: 'Summary',
        schedule: 'Schedule',
        finish: 'Finish'
      },
      {
        id: '219642',
        company: 'IVS Freight Inc.',
        taxSeason: '2019 - 2020 HVUT Return',
        vins: '15',
        tax: '$121.67',
        fillingFee: '$975.00',
        eFilled: '16/12/20 09:42 PM',
        status: 'Incomplete',
        summary: 'Summary',
        schedule: 'Schedule',
        finish: 'Finish'
      },
      {
        id: '219674',
        company: 'IVS Freight Inc.',
        taxSeason: '2019 - 2020 HVUT Return',
        vins: '9',
        tax: '$221.67',
        fillingFee: '$975.00',
        eFilled: '16/12/20 09:42 PM',
        status: 'Complete',
        summary: 'Summary',
        schedule: 'Schedule',
        finish: 'Finish'
      },
      {
        id: '219686',
        company: 'IVS Freight Inc.',
        taxSeason: '2019 - 2020 HVUT Return',
        vins: '9',
        tax: '$221.67',
        fillingFee: '$975.00',
        eFilled: '16/12/20 09:42 PM',
        status: 'Complete',
        summary: 'Summary',
        schedule: 'Schedule',
        finish: 'Finish'
      },
      {
        id: '219676',
        company: 'IVS Freight Inc.',
        taxSeason: '2019 - 2020 HVUT Return',
        vins: '9',
        tax: '$221.67',
        fillingFee: '$975.00',
        eFilled: '16/12/20 09:42 PM',
        status: 'Complete',
        summary: 'Summary',
        schedule: 'Schedule',
        finish: '',
      },
      {
        id: '219666',
        company: 'IVS Freight Inc.',
        taxSeason: '2019 - 2020 HVUT Return',
        vins: '9',
        tax: '$221.67',
        fillingFee: '$975.00',
        eFilled: '16/12/20 09:42 PM',
        status: 'Complete',
        summary: 'Summary',
        schedule: 'Schedule',
        finish: ''
      }
    ]

    this._2290 = _2290;
    this._2290Finished = this._2290.filter(i => i.finish.toLowerCase() === 'finish')
    this._2290Active = this._2290.filter(i => i.finish.toLowerCase() !== 'finish')
    this.send2290Data();
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
        name: 'delete-2290',
        type: 'mvr',
        text: 'Are you sure you want to delete 2290 item?',
      },
    };
    this.changeRef.detectChanges();
  }

  private send2290Data(resetColumns?: boolean): void {
    const data: TableData[] = [
      {
        title: '2290',
        field: null,
        data: this._2290,
        extended: false,
        gridNameTitle: '2290',
        stateName: '2290',
        gridColumns: this.getGridColumns('2290', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('2290', resetColumns),
      },
      {
        title: 'Active',
        field: 'inactive',
        data: this._2290Active,
        extended: false,
        gridNameTitle: 'Active',
        stateName: '2290_active',
        gridColumns: this.getGridColumns('2290_active', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('2290_active', resetColumns),
      },
      {
        title: 'Finished',
        field: 'active',
        data: this._2290Finished,
        extended: false,
        gridNameTitle: 'Finished',
        stateName: '2290_finished',
        gridColumns: this.getGridColumns('2290_finished', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('2290_finished', resetColumns),
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
      if (stateName === '2290') {
        return get2290Columns();
      } else if (stateName === '2290_active') {
        return get2290ActiveColumns();
      } else if (stateName === '2290_finished') {
        return get2290FinishedColumns();
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
      if (stateName === '2290') {
        return get2290ExtendedColumns();
      } else if (stateName === '2290_active') {
        return get2290ActiveExtendedColumns();
      } else if (stateName === '2290_finished') {
        return get2290FinishedExtendedColumns();
      }
    }
  }
}
