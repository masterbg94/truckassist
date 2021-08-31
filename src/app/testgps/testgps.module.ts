import { TestgpsComponent } from './testgps-list/testgps.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { TestgpsRoutingModule } from './testgps-routing.module';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [TestgpsComponent],
  imports: [
    CommonModule,
    TestgpsRoutingModule,
    SharedModule
  ]
})
export class TestgpsModule { }
