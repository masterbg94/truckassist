import { createFeatureSelector, createSelector } from '@ngrx/store';
import { getError, LoadingState } from '../status-store/status.reducer';
import { trailersFeatureKey, TrailerState, selectAll } from './trailers.reducer';

export const selectTrailerDataState = createFeatureSelector<TrailerState>(trailersFeatureKey);
export const selectTrailerData = createSelector(selectTrailerDataState, (state: TrailerState) => state.trailerTabData);

export const selectTrailerDataLoading = createSelector(
  selectTrailerDataState,
  (state: TrailerState) => state.statusState === LoadingState.LOADING
);

export const selectTrailersError = createSelector(selectTrailerDataState, (state: TrailerState) =>
  getError(state.statusState)
);
