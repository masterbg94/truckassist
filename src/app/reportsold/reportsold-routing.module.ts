import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsoldComponent } from './reportsold-list/reportsold.component';

const routes: Routes = [
  { path: '', component: ReportsoldComponent, data: { title: 'Todo list' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsoldRoutingModule { }
