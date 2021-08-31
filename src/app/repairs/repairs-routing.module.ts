import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RepairsDetailsComponent } from './repairs-details/repairs-details.component';
import { RepairsComponent } from './repairs.component';

const routes: Routes = [
  {
    path: '',
    component: RepairsComponent,
    data: { title: 'Repairs' },
  },
  {
    path: 'edit/:id/:tab',
    component: RepairsDetailsComponent,
    data: { title: 'Repair detail' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RepairsRoutingModule {}
