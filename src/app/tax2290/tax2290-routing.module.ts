import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Tax2290DetailsComponent } from './tax2290-details/tax2290-details.component';
import { Tax2290TableComponent } from './tax2290-table/tax2290-table.component';


const routes: Routes = [
  {path: '', component: Tax2290TableComponent, data: {title: '2290'}},
  {path: 'edit/:id/:tab', component: Tax2290DetailsComponent, data: {title: '2290-details'}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tax2290RoutingModule { }
