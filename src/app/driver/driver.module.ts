import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DriverLicenseCardComponent } from './driver-license/driver-license-card/driver-license-card.component';
import { DriverMedicalCardComponent } from './driver-medical/driver-medical-card/driver-medical-card.component';
import { DriverDrugCardComponent } from './driver-drug/driver-drug-card/driver-drug-card.component';
import { DriverMvrCardComponent } from './driver-mvr/driver-mvr-card/driver-mvr-card.component';
import { DriverImportComponent } from './driver-import/driver-import.component';
import { DriverTableComponent } from './driver-table/driver-table.component';
import { DriverRoutingModule } from './driver-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DriverMedicalManageComponent } from './driver-medical/driver-medical-manage/driver-medical-manage.component';
import { DriverMvrManageComponent } from './driver-mvr/driver-mvr-manage/driver-mvr-manage.component';
import { DriverDrugManageComponent } from './driver-drug/driver-drug-manage/driver-drug-manage.component';
import { DriverLicenseManageComponent } from './driver-license/driver-license-manage/driver-license-manage.component';
import { DriverManageComponent } from './driver-manage/driver-manage.component';
import { DriverDetailsComponent } from './driver-details/driver-details.component';
import { DriverSwitcherComponent } from './driver-switcher/driver-switcher.component';
import { SortPipe } from '../core/pipes/sort.pipe';

@NgModule({
  declarations: [
    DriverLicenseCardComponent,
    DriverMedicalCardComponent,
    DriverDrugCardComponent,
    DriverMvrCardComponent,
    DriverImportComponent,
    DriverTableComponent,
    DriverMedicalManageComponent,
    DriverMvrManageComponent,
    DriverDrugManageComponent,
    DriverLicenseManageComponent,
    DriverManageComponent,
    DriverDetailsComponent,
    DriverSwitcherComponent,
  ],
  imports: [CommonModule, DriverRoutingModule, SharedModule, RouterModule],
  providers: [DatePipe, SortPipe]
})
export class DriverModule {}
