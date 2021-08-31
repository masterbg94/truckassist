import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TruckTableComponent } from './truck-table/truck-table.component';
import { TruckSwitcherComponent } from './truck-switcher/truck-switcher.component';
import { TruckRepairComponent } from './truck-repair/truck-repair.component';

const routes: Routes = [
  {
    path: 'edit/:id/:tab',
    component: TruckSwitcherComponent,
  },
  { path: '', component: TruckTableComponent, data: { title: 'Trucks' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TruckRoutingModule {}
