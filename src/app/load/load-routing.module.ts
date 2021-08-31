import { LoadDetailsComponent } from './load-details/load-details.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoadTableComponent } from './load-table/load-table.component';


const routes: Routes = [
    { path: '', component: LoadTableComponent, data: { title: 'Loads' } },
    {
      path: 'edit/:id/:tab',
      component: LoadDetailsComponent,
      data: { title: 'Load detail' },
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoadRoutingModule {}
