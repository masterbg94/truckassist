import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerRoutingModule } from './customer-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CustomerManageComponent } from './customer-manage/customer-manage.component';
import { CustomerTableComponent } from './customer-table/app-customer-table.component';
import { ShipperManageComponent } from './shipper-manage/shipper-manage.component';

@NgModule({
  declarations: [
    CustomerTableComponent,
    CustomerManageComponent,
    ShipperManageComponent,
    ShipperManageComponent,
  ],
  imports: [CommonModule, CustomerRoutingModule, SharedModule],
})
export class CustomerModule {}
