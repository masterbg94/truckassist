import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MvrRoutingModule } from './mvr-routing.module';
import { MvrTableComponent } from './mvr-table/mvr-table.component';
import { MvrMaintenanceComponent } from './mvr-maintenance/mvr-maintenance.component';
import { MvrDetailsComponent } from './mvr-details/mvr-details.component';

@NgModule({
  declarations: [MvrTableComponent, MvrMaintenanceComponent, MvrDetailsComponent],
  imports: [
    CommonModule,
    SharedModule,
    MvrRoutingModule,
    ReactiveFormsModule
  ],
})
export class MvrModule {}
