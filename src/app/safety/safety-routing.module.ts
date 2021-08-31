import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { SafetyAccidentComponent } from './safety-accident/safety-accident/safety-accident.component';
import { SafetyScheduledInsComponent } from './safety-insurance/safety-scheduled-ins/safety-scheduled-ins.component';
import { SafetyLogComponent } from './safety-log/safety-log/safety-log.component';
import { SafetyViolationComponent } from './safety-violation/safety-violation/safety-violation.component';
import { ViolationDetailsComponent } from './safety-violation/violation-details/violation-details.component';
import { SafetyComponent } from './safety.component';

const routes: Routes = [
  {
    path: '',
    component: SafetyComponent,
    children: [
      {
        path: 'accident',
        component: SafetyAccidentComponent,
        data: {
          title: 'Accidents'
        }
      },
      {
        path: 'violation',
        component: SafetyViolationComponent,
        data: {
          title: 'Violations'
        }
      },
      {
        path: 'violation/edit/:id/:tab',
        component: ViolationDetailsComponent,
        data: { title: 'Violation Details' },
      },
      {
        path: 'log',
        component: SafetyLogComponent,
        data: {
          title: 'Logs'
        }
      },
      {
        path: 'scheduled-insurance',
        component: SafetyScheduledInsComponent,
        data: {
          title: 'Scheduled Insurances'
        }
      }
    ],
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: [RouterModule],
})
export class SafetyRoutingModule {}
