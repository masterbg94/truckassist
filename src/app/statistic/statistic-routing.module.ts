import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatisticAccidentComponent } from './statistic-accident/statistic-accident.component';
import { StatisticFuelComponent } from './statistic-fuel/statistic-fuel.component';
import { StatisticGPSStatusComponent } from './statistic-gps-status/statistic-gps-status.component';
import { StatisticInvoiceAgeingComponent } from './statistic-invoice-ageing/statistic-invoice-ageing.component';
import { StatisticLoadComponent } from './statistic-load/statistic-load.component';
import { StatisticMilesComponent } from './statistic-miles/statistic-miles.component';
import { StatisticPayrollComponent } from './statistic-payroll/statistic-payroll.component';
import { StatisticRepairComponent } from './statistic-repair/statistic-repair.component';
import { StatisticViolationComponent } from './statistic-violation/statistic-violation.component';

import { StatisticComponent } from './statistic.component';

const routes: Routes = [
  {
    path: '',
    component: StatisticComponent,
    children: [
      { path: '', redirectTo: '/statistic/load', pathMatch: 'full' },
      {
        path: 'load',
        component: StatisticLoadComponent,
        data: { title: 'Load Statistics' },
      },
      {
        path: 'miles',
        component: StatisticMilesComponent,
        data: { title: 'Miles Statistics' },
      },
      {
        path: 'gps-status',
        component: StatisticGPSStatusComponent,
        data: { title: 'GPS Status Statistics' },
      },
      {
        path: 'fuel',
        component: StatisticFuelComponent,
        data: { title: 'Fuel Statistics' },
      },
      {
        path: 'repair',
        component: StatisticRepairComponent,
        data: { title: 'Repair Statistics' },
      },
      {
        path: 'payroll',
        component: StatisticPayrollComponent,
        data: { title: 'Payroll Statistics' },
      },
      {
        path: 'invoice-ageing',
        component: StatisticInvoiceAgeingComponent,
        data: { title: 'Invoice Ageing Statistics' },
      },
      {
        path: 'violation',
        component: StatisticViolationComponent,
        data: { title: 'Violation Statistics' },
      },
      {
        path: 'accident',
        component: StatisticAccidentComponent,
        data: { title: 'Accident Statistics' },
      },
    ],
    data: { title: 'Statistics' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatisticRoutingModule {}
