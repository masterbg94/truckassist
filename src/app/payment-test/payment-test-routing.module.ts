import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentTestComponent } from './payment-test/payment-test.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentTestComponent,
    data: { title: 'Payments Test' }
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentTestRoutingModule {}
