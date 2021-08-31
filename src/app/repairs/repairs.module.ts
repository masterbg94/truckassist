import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RepairsRoutingModule } from './repairs-routing.module';
import { MaintenanceManageComponent } from './maintenance-manage/maintenance-manage.component';
import { RepairsComponent } from './repairs.component';
import { SharedModule } from '../shared/shared.module';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { RepairsTableComponent } from './repairs-table/repairs-table.component';
import { RepairsDetailsComponent } from './repairs-details/repairs-details.component';

@NgModule({
  declarations: [
    RepairsComponent,
    MaintenanceManageComponent,
    RepairsTableComponent,
    RepairsDetailsComponent,
  ],
  imports: [CommonModule, RepairsRoutingModule, SharedModule, AgmSnazzyInfoWindowModule],
  entryComponents: [MaintenanceManageComponent],
  exports: [MaintenanceManageComponent],
})
export class RepairsModule {}
