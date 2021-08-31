import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrailerTableComponent } from './trailer-table/trailer-table.component';
import { TrailerSwitcherComponent } from './trailer-switcher/trailer-switcher.component';

const routes: Routes = [
  {
    path: 'edit/:id/:tab',
    component: TrailerSwitcherComponent
  },
  { path: '', component: TrailerTableComponent, data: { title: 'Trailers' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrailerRoutingModule {}
