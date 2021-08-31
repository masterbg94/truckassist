import { createFeatureSelector, createSelector } from '@ngrx/store';
import { getError, LoadingState } from '../status-store/status.reducer';
import { trucksFeatureKey, TruckState, selectAll } from './trucks.reducer';

export const selectTruckDataState = createFeatureSelector<TruckState>(trucksFeatureKey);
export const selectTruckData = createSelector(selectTruckDataState, (state: TruckState) => state.truckTabData);

export const selectTruckDataLoading = createSelector(
  selectTruckDataState,
  (state: TruckState) => state.statusState === LoadingState.LOADING
);

export const selectTrucksError = createSelector(selectTruckDataState, (state: TruckState) =>
  getError(state.statusState)
);
