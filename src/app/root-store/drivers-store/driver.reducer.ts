import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as DriverActions from './driver.actions';
import { LoadingState, StatusState } from '../status-store/status.reducer';
import { DriverTabData } from 'src/app/core/model/driver';

export const driversFeatureKey = 'drivers';

export interface DriverState extends EntityState<DriverTabData> {
  // additional entities state properties
  driverTabData: DriverTabData;
  statusState: StatusState;
}

export const adapter: EntityAdapter<DriverTabData> = createEntityAdapter<DriverTabData>();

export const initialState: DriverState = adapter.getInitialState({
  // additional entity state properties
  driverTabData: null,
  statusState: LoadingState.INIT,
});

export const reducer = createReducer(
  initialState,
  // on(DriverActions.addDriver, (state, action) => adapter.addOne(action.driver, state)),
  // on(DriverActions.upsertDriver, (state, action) => adapter.upsertOne(action.driver, state)),
  // on(DriverActions.addDrivers, (state, action) => adapter.addMany(action.drivers, state)),
  // on(DriverActions.upsertDrivers, (state, action) => adapter.upsertMany(action.drivers, state)),
  // on(DriverActions.updateDriver, (state, action) => adapter.updateOne(action.driver, state)),
  // on(DriverActions.updateDrivers, (state, action) => adapter.updateMany(action.drivers, state)),
  // on(DriverActions.deleteDriver, (state, action) => adapter.removeOne(action.id, state)),
  // on(DriverActions.deleteDrivers, (state, action) => adapter.removeMany(action.ids, state)),
  on(DriverActions.loadDriverData, (state) => {
    return {
      ...state,
      statusState: LoadingState.LOADING,
    };
  }),
  on(DriverActions.loadDriverDataSuccess, (state, action) =>
    adapter.setOne(action.driverTabData, {
      ...state,
      driverTabData: action.driverTabData,
      statusState: LoadingState.LOADED,
    })
  ),
  on(DriverActions.loadDriverDataFailure, (state, action) => {
    return {
      ...state,
      driverTabData: null,
      statusState: { error: action.error },
    };
  })
  // on(DriverActions.clearDrivers, (state) => adapter.removeAll(state))
);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
