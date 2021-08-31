import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerTableComponent } from './customer-table/app-customer-table.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerTableComponent,
    data: { title: 'Customer List' },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
