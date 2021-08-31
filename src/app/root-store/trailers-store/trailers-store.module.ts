import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromTrailers from './trailers.reducer';
import { TrailerEffects } from './trailers.effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(fromTrailers.trailersFeatureKey, fromTrailers.reducer),
    EffectsModule.forFeature([TrailerEffects]),
  ],
})
export class TrailersStoreModule {}
