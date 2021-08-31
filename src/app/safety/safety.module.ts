import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafetyRoutingModule } from './safety-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SafetyComponent } from './safety.component';
import { SafetyViolationComponent } from './safety-violation/safety-violation/safety-violation.component';
import { ViolationManageComponent } from './safety-violation/violation-manage/violation-manage.component';
import { SafetyScheduledInsComponent } from './safety-insurance/safety-scheduled-ins/safety-scheduled-ins.component';
import { SafetyAccidentComponent } from './safety-accident/safety-accident/safety-accident.component';
import { AccidentManageComponent } from './safety-accident/accident-manage/accident-manage.component';
import { LogManageComponent } from './safety-log/log-manage/log-manage.component';
import { InsuranceManageComponent } from './safety-insurance/insurance-manage/insurance-manage.component';
import { ViolationDetailsComponent } from './safety-violation/violation-details/violation-details.component';
@NgModule({
  declarations: [
    SafetyComponent,
    AccidentManageComponent,
    SafetyViolationComponent,
    ViolationManageComponent,
    SafetyScheduledInsComponent,
    SafetyAccidentComponent,
    LogManageComponent,
    InsuranceManageComponent,
    ViolationDetailsComponent,
  ],
  imports: [CommonModule, SafetyRoutingModule, SharedModule],
  entryComponents: [],
})
export class SafetyModule {}
