import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AccountingListComponent } from './accounting-list/accounting-list.component';
import { AccountingRoutingModule } from './accounting-routing.module';
import { AccountingDetailsComponent } from './accounting-details/accounting-details.component';
import { AccountingTablesComponent } from './accounting-tables/accounting-tables.component';
import { AccountingPayrollComponent } from './accounting-payroll/accounting-payroll.component';
import { AccountingFuelComponent } from './accounting-fuel/accounting-fuel.component';
import { AccountingIndexComponent } from './accounting-index/accounting-index.component';
import { FuelManageComponent } from './fuel-manage/fuel-manage.component';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { PayrollManageComponent } from './payroll-manage/payroll-manage.component';
@NgModule({
  declarations: [
    AccountingListComponent, AccountingDetailsComponent, AccountingTablesComponent, AccountingPayrollComponent, AccountingFuelComponent, AccountingIndexComponent, FuelManageComponent, PayrollManageComponent
    ],
  imports: [CommonModule, AccountingRoutingModule, SharedModule, AgmSnazzyInfoWindowModule],
  entryComponents: [],
})
export class AccountingModule {}
