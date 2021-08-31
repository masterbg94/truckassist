import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OwnersTableComponent } from './owner-table/owner-table.component';

const routes: Routes = [
  { path: '', component: OwnersTableComponent, data: { title: 'Owners' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OwnerRoutingModule {}
