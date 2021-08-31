import { AccountingIftaComponent } from './../accounting/accounting-ifta/accounting-ifta.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TruckImportComponent } from './truck-import/truck-import.component';
import { TruckTableComponent } from './truck-table/truck-table.component';
import { TruckRoutingModule } from './truck-routing.module';
import { SharedModule } from '../shared/shared.module';
import { OwnersModule } from '../owners/owners.module';
import { TruckManageComponent } from './truck-manage/truck-manage.component';
import { TruckDetailsComponent } from './truck-details/truck-details.component';
import { TruckLicenseCardComponent } from './truck-licence/truck-license-card/truck-license-card.component';
import { TruckLicenseManageComponent } from './truck-licence/truck-license-manage/truck-license-manage.component';
import { TruckInspectionCardComponent } from './truck-inspection/truck-inspection-card/truck-inspection-card.component';
import { TruckInspectionManageComponent } from './truck-inspection/truck-inspection-manage/truck-inspection-manage.component';
import { TruckTitleCardComponent } from './truck-title/truck-title-card/truck-title-card.component';
import { TruckTitleManageComponent } from './truck-title/truck-title-manage/truck-title-manage.component';
import { TruckLeasePurchaseCardComponent } from './truck-lease-purchase/truck-lease-purchase-card/truck-lease-purchase-card.component';
import { TruckLeasePurchaseManageComponent } from './truck-lease-purchase/truck-lease-purchase-manage/truck-lease-purchase-manage.component';
import { TruckSwitcherComponent } from './truck-switcher/truck-switcher.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TruckFuelComponent } from './truck-fuel/truck-fuel.component';
import { TruckIftaComponent } from './truck-ifta/truck-ifta.component';
import { TruckLoadComponent } from './truck-load/truck-load.component';
import { TruckRepairComponent } from './truck-repair/truck-repair.component';

@NgModule({
  declarations: [
    TruckTableComponent,
    TruckImportComponent,
    TruckManageComponent,
    TruckDetailsComponent,
    TruckLicenseManageComponent,
    TruckLicenseCardComponent,
    TruckInspectionCardComponent,
    TruckInspectionManageComponent,
    TruckTitleCardComponent,
    TruckTitleManageComponent,
    TruckLeasePurchaseCardComponent,
    TruckLeasePurchaseManageComponent,
    TruckSwitcherComponent,
    TruckFuelComponent,
    TruckIftaComponent,
    TruckLoadComponent,
    TruckRepairComponent
  ],
  imports: [CommonModule, TruckRoutingModule, SharedModule, OwnersModule, NgbNavModule],
  entryComponents: [
    TruckImportComponent,
    TruckLeasePurchaseCardComponent
  ],
  exports: [
    TruckImportComponent,
    TruckLeasePurchaseCardComponent
  ],
  providers: [DatePipe]
})
export class TruckModule {}
