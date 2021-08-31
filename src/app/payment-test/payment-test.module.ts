import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { PaymentTestRoutingModule } from './payment-test-routing.module';
import { PaymentTestComponent } from './payment-test/payment-test.component';
import { ExpiredModalComponent } from './expired-modal/expired-modal.component';
import { AccountModalComponent } from './account-modal/account-modal.component';
import { PaymentDetailsModalComponent } from './payment-details-modal/payment-details-modal.component';
import { PaymentDetailsSecondComponent } from './payment-details-second/payment-details-second.component';
import { ExpiredSecondModalComponent } from './expired-second-modal/expired-second-modal.component';
import { SuccessfulSubscibingModalComponent } from './successful-subscibing-modal/successful-subscibing-modal.component';
import { PaymentFaliModalComponent } from './payment-fali-modal/payment-fali-modal.component';
import { AddCardAccountModalComponent } from './add-card-account-modal/add-card-account-modal.component';
import { AddCardModalComponent } from './add-card-modal/add-card-modal.component';
import { PaymentUnsuccesfulModalComponent } from './payment-unsuccesful-modal/payment-unsuccesful-modal.component';
import { ProcessingModalComponent } from './processing-modal/processing-modal.component';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';
import { ExpiredNewModalComponent } from './expired-new/expired-new-modal.component';

@NgModule({
  declarations: [
    PaymentTestComponent,
    ExpiredModalComponent,
    AccountModalComponent,
    PaymentDetailsModalComponent,
    PaymentDetailsSecondComponent,
    ExpiredSecondModalComponent,
    SuccessfulSubscibingModalComponent,
    PaymentFaliModalComponent,
    AddCardAccountModalComponent,
    AddCardModalComponent,
    PaymentUnsuccesfulModalComponent,
    ProcessingModalComponent,
    PaymentDetailsComponent,
    ExpiredNewModalComponent
  ],
  imports: [CommonModule, SharedModule, PaymentTestRoutingModule],
})
export class PaymentTestModule {}
