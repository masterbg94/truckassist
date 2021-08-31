import { createFeatureSelector, createSelector } from '@ngrx/store';
import { getError, LoadingState } from '../status-store/status.reducer';
import { driversFeatureKey, DriverState, selectAll } from './driver.reducer';

export const selectDriverDataState = createFeatureSelector<DriverState>(driversFeatureKey);
export const selectDriverData = createSelector(selectDriverDataState, (state: DriverState) => state.driverTabData);

export const selectDriverDataLoading = createSelector(
  selectDriverDataState,
  (state: DriverState) => state.statusState === LoadingState.LOADING
);

export const selectDriversError = createSelector(selectDriverDataState, (state: DriverState) =>
  getError(state.statusState)
);
