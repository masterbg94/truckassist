import { Accounting } from './../../core/model/shared/accounting';
import { DriverTabData } from 'src/app/core/model/driver';
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UserState } from 'src/app/core/model/user';
import { AppDriverService } from '../../core/services/app-driver.service';
import {
  TableColumnDefinition,
  TableData,
  TableOptions,
  TableSubject,
} from 'src/app/shared/truckassist-table/models/truckassist-table';
import { getAccountingsColumnsDefinition } from 'src/assets/utils/settings/accounting-columns';

@Component({
  selector: 'app-accounting-index',
  templateUrl: './accounting-index.component.html',
  styleUrls: ['./accounting-index.component.scss']
})
export class AccountingIndexComponent implements OnInit {

  constructor(
    private changeRef: ChangeDetectorRef,
    private driverService: AppDriverService // temporary service
  ) {}
  @Input() inputData: any;
  public tableOptions: TableOptions;
  private tableSubject: BehaviorSubject<TableSubject> = new BehaviorSubject(null);
  public accountingColumns: TableColumnDefinition[] = [];
  public driversList: any[];
  public driverColumns: TableColumnDefinition[] = [];

  public loadingItems = true;
  public selectedTab = 'payroll';
  public typesSelected = [];
  public selectedOpenedTab = 'open';
  public selectedUser: any;

  tableData: TableData[] = [
    {
      title: 'Payroll',
      field: 'payroll',
      data: [],
      extended: false,
      hideLength: false,
      gridColumns: [],
      extendedGridColumns: []
    },
    {
      title: 'Fuel',
      field: 'fuel',
      data: [],
      extended: false,
      hideLength: false,
      gridColumns: [],
      extendedGridColumns: []
    },
    {
      title: 'Ledger',
      field: 'ledger',
      data: [],
      extended: false,
      hideLength: false,
      gridColumns: [],
      extendedGridColumns: []
    },
    {
      title: 'IFTA',
      field: 'ifta',
      data: [],
      extended: false,
      hideLength: false,
      gridColumns: [],
      extendedGridColumns: []
    },
    {
      title: 'Tax',
      field: 'tax',
      data: [],
      extended: false,
      hideLength: false,
      gridColumns: [],
      extendedGridColumns: []
    }
  ];

  ngOnInit(): void {

    // this.getDrivers();
  }

  public selectFromList(e) {
    console.log(e);
    this.selectedUser = undefined;
    setTimeout(() => {
      this.selectedUser = e;
    }, 500);
  }

  public switchTab(e) {
    console.log(e);
  }

  public getDrivers(): void {
    this.driverService.getDrivers().subscribe((driverTabDate: DriverTabData) => {
      this.driversList = driverTabDate.allDrivers;
    });
  }

  ngOnDestroy(): void {}

}
