import { MvrDetailsComponent } from './mvr-details/mvr-details.component';
import { MvrTableComponent } from './mvr-table/mvr-table.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: MvrTableComponent, data: { title: 'MVR' } },
  { path: 'edit/:id/:tab', component: MvrDetailsComponent, data: { title: 'MVR Details' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MvrRoutingModule {}
