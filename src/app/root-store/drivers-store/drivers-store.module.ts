import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromDriver from './driver.reducer';
import { DriverEffects } from './driver.effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(fromDriver.driversFeatureKey, fromDriver.reducer),
    EffectsModule.forFeature([DriverEffects]),
  ],
})
export class DriversStoreModule {}
