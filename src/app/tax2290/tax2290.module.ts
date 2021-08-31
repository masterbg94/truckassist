import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Tax2290RoutingModule } from './tax2290-routing.module';
import { Tax2290TableComponent } from './tax2290-table/tax2290-table.component';
import { Tax2290MaintenanceComponent } from './tax2290-maintenance/tax2290-maintenance.component';
import { Tax2290DetailsComponent } from './tax2290-details/tax2290-details.component';
import { Tax2290CompanyInfoComponent } from './tax2290-maintenance/tax2290-company-info/tax2290-company-info.component';
import { Tax2290VehiclesComponent } from './tax2290-maintenance/tax2290-vehicles/tax2290-vehicles.component';
import { Tax2290SignerComponent } from './tax2290-maintenance/tax2290-signer/tax2290-signer.component';
import { Tax2290IrsPaymentComponent } from './tax2290-maintenance/tax2290-irs-payment/tax2290-irs-payment.component';
import { Tax2290ReviewComponent } from './tax2290-maintenance/tax2290-review/tax2290-review.component';
import { Tax2290CompanyComponent } from './tax2290-maintenance/tax2290-company/tax2290-company.component';
import { Tax2290VehiclesAttachmentsComponent } from './tax2290-maintenance/tax2290-vehicles-attachments/tax2290-vehicles-attachments.component';
import { Tax2290DetailsCardComponent } from './tax2290-details/tax2290-details-card/tax2290-details-card.component';


@NgModule({
  declarations: [Tax2290TableComponent, Tax2290MaintenanceComponent, Tax2290DetailsComponent, Tax2290CompanyInfoComponent, Tax2290VehiclesComponent, Tax2290SignerComponent, Tax2290IrsPaymentComponent, Tax2290ReviewComponent, Tax2290CompanyComponent, Tax2290VehiclesAttachmentsComponent, Tax2290DetailsCardComponent],
  imports: [
    CommonModule,
    Tax2290RoutingModule,
    SharedModule
  ]
})
export class Tax2290Module { }
