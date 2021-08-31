import { SharedService } from 'src/app/core/services/shared.service';
import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import {
  TableColumnDefinition,
  TableData,
  TableOptions,
} from 'src/app/shared/truckassist-table/models/truckassist-table';

@Component({
  selector: 'app-accounting-payroll',
  templateUrl: './accounting-payroll.component.html',
  styleUrls: ['./accounting-payroll.component.scss']
})
export class AccountingPayrollComponent implements OnInit {

  constructor(private router: Router, private shared: SharedService) { }
  public loadingItems = false;
  public selectedTab = 'payroll';
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

  public switchTab(e) {
    this.selectedTab = e;
    if ( e == 'payroll' || e == 'fuel' ) {
      this.router
          .navigate(['/accounting/' + e]);
    } else {
      this.router
          .navigate(['/accounting/notfound']);
    }

  }

  public changeScreen(e) {
    console.log('ddd', e);
  }

  ngOnInit(): void {
    if (this.router.url.includes('/fuel')) {
      this.selectedTab = 'fuel';
    }

    this.shared.emitAccountingChange.subscribe(res => {
      this.selectedTab = res;
    });
  }

}
