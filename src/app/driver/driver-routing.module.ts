import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriverSwitcherComponent } from './driver-switcher/driver-switcher.component';
import { DriverTableComponent } from './driver-table/driver-table.component';

const routes: Routes = [
  { path: '', component: DriverTableComponent, data: { title: 'Drivers' } },
  {
    path: 'edit/:id/:tab',
    component: DriverSwitcherComponent,
    data: { title: 'Driver detail' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriverRoutingModule {}
