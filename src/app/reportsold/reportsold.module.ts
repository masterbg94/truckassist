import { ReportsoldComponent } from './reportsold-list/reportsold.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ReportsoldRoutingModule } from './reportsold-routing.module';
import { BrowserModule } from '@angular/platform-browser';
@NgModule({
  declarations: [ReportsoldComponent],
  imports: [
    CommonModule,
    ReportsoldRoutingModule,
    SharedModule
  ]
})
export class ReportsoldModule { }
