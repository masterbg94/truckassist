import { AccountingIftaComponent } from './accounting-ifta/accounting-ifta.component';
import { AppNoPageFoundComponent } from './../shared/app-no-page-found/app-no-page-found.component';
import { AccountingFuelComponent } from './accounting-fuel/accounting-fuel.component';
import { AccountingIndexComponent } from './accounting-index/accounting-index.component';
import { AccountingPayrollComponent } from './accounting-payroll/accounting-payroll.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AccountingPayrollComponent,
    children: [
      { path: '', redirectTo: 'payroll', pathMatch: 'full' },
      {
        path: 'payroll',
        component: AccountingIndexComponent,
        data: { title: 'Payroll' },
      },
      {
        path: 'fuel',
        component: AccountingFuelComponent,
        data: { title: 'Fuel' },
      },
      {
        path: 'ifta',
        component: AccountingIftaComponent,
        data: { title: 'Ifta' },
      },
      {
        path: 'notfound',
        component: AppNoPageFoundComponent,
        data: { title: 'Fuel' },
      },
    ],
    data: { title: 'Accounting' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountingRoutingModule {}
