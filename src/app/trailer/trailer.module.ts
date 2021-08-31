import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TrailerImportComponent } from './trailer-import/trailer-import.component';
import { TrailerTableComponent } from './trailer-table/trailer-table.component';
import { TrailerRoutingModule } from './trailer-routing.module';
import { SharedModule } from '../shared/shared.module';
import { OwnersModule } from '../owners/owners.module';
import { TrailerManageComponent } from './trailer-manage/trailer-manage.component';
import { TrailerDetailsComponent } from './trailer-details/trailer-details.component';
import { TrailerLicenseCardComponent } from './trailer-licence/trailer-license-card/trailer-license-card.component';
import { TrailerLicenseManageComponent } from './trailer-licence/trailer-license-manage/trailer-license-manage.component';
import { TrailerInspectionCardComponent } from './trailer-inspection/trailer-inspection-card/trailer-inspection-card.component';
import { TrailerInspectionManageComponent } from './trailer-inspection/trailer-inspection-manage/trailer-inspection-manage.component';
import { TrailerTitleCardComponent } from './trailer-title/trailer-title-card/trailer-title-card.component';
import { TrailerTitleManageComponent } from './trailer-title/trailer-title-manage/trailer-title-manage.component';
import { TrailerLeasePurchaseCardComponent } from './trailer-lease-purchase/trailer-lease-purchase-card/trailer-lease-purchase-card.component';
import { TrailerLeasePurchaseManageComponent } from './trailer-lease-purchase/trailer-lease-purchase-manage/trailer-lease-purchase-manage.component';
import { TrailerSwitcherComponent } from './trailer-switcher/trailer-switcher.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TrailerRepairComponent } from './trailer-repair/trailer-repair.component';
import { SortPipe } from '../core/pipes/sort.pipe';

@NgModule({
  declarations: [
    TrailerTableComponent,
    TrailerImportComponent,
    TrailerManageComponent,
    TrailerDetailsComponent,
    TrailerLicenseManageComponent,
    TrailerLicenseCardComponent,
    TrailerInspectionCardComponent,
    TrailerInspectionManageComponent,
    TrailerTitleCardComponent,
    TrailerTitleManageComponent,
    TrailerLeasePurchaseCardComponent,
    TrailerLeasePurchaseManageComponent,
    TrailerSwitcherComponent,
    TrailerRepairComponent,
  ],
  imports: [CommonModule, TrailerRoutingModule, SharedModule, OwnersModule, NgbNavModule],
  entryComponents: [
    TrailerImportComponent,
    TrailerLeasePurchaseCardComponent
  ],
  exports: [
    TrailerImportComponent,
    TrailerLeasePurchaseCardComponent
  ],
  providers: [DatePipe, SortPipe]
})
export class TrailerModule {}
