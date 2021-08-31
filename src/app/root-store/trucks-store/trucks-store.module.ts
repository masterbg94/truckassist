import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromTrucks from './trucks.reducer';
import { TruckEffects } from './trucks.effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(fromTrucks.trucksFeatureKey, fromTrucks.reducer),
    EffectsModule.forFeature([TruckEffects]),
  ],
})
export class TrucksStoreModule {}
