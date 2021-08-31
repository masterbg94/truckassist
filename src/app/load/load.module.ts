import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadImportComponent } from './load-import/load-import.component';
import { SharedModule } from '../shared/shared.module';
import { LoadRoutingModule } from './load-routing.module';
import { ManageLoadComponent } from './manage-load/manage-load.component';
import { LoadTableComponent } from './load-table/load-table.component';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { LoadDetailsComponent } from './load-details/load-details.component';

@NgModule({
  declarations: [LoadImportComponent, ManageLoadComponent, LoadTableComponent, LoadDetailsComponent],
  imports: [CommonModule, LoadRoutingModule, SharedModule, AgmSnazzyInfoWindowModule],
})
export class LoadModule {}
