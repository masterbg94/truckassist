import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatisticRoutingModule } from './statistic-routing.module';
import { StatisticComponent } from './statistic.component';
import { StatisticLoadComponent } from './statistic-load/statistic-load.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { StatisticMilesComponent } from './statistic-miles/statistic-miles.component';
import { StatisticGPSStatusComponent } from './statistic-gps-status/statistic-gps-status.component';
import { StatisticRepairComponent } from './statistic-repair/statistic-repair.component';
import { StatisticPayrollComponent } from './statistic-payroll/statistic-payroll.component';
import { StatisticInvoiceAgeingComponent } from './statistic-invoice-ageing/statistic-invoice-ageing.component';
import { StatisticFuelComponent } from './statistic-fuel/statistic-fuel.component';
import { ChartModule } from 'angular2-chartjs';
import { StatisticViolationComponent } from './statistic-violation/statistic-violation.component';
import { StatisticAccidentComponent } from './statistic-accident/statistic-accident.component';

@NgModule({
  declarations: [
    StatisticComponent,
    StatisticLoadComponent,
    StatisticMilesComponent,
    StatisticGPSStatusComponent,
    StatisticRepairComponent,
    StatisticPayrollComponent,
    StatisticInvoiceAgeingComponent,
    StatisticFuelComponent,
    StatisticViolationComponent,
    StatisticAccidentComponent,
  ],
  imports: [CommonModule, StatisticRoutingModule, SharedModule, ChartModule],
})
export class StatisticModule {}
