import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriversStoreModule } from './drivers-store/drivers-store.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TrucksStoreModule } from './trucks-store/trucks-store.module';
import { TrailersStoreModule } from './trailers-store/trailers-store.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    DriversStoreModule,
    TrucksStoreModule,
    TrailersStoreModule,
  ],
})
export class RootStoreModule {}
