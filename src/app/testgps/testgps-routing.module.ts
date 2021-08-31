import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestgpsComponent } from './testgps-list/testgps.component';

const routes: Routes = [
    { path: '', component: TestgpsComponent, data: { title: 'Test Gps SignalR' } },
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class TestgpsRoutingModule { }
