import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as TruckActions from './trucks.actions';
import { LoadingState, StatusState } from '../status-store/status.reducer';
import { TruckTabData } from 'src/app/core/model/truck';

export const trucksFeatureKey = 'trucks';

export interface TruckState extends EntityState<TruckTabData> {
  // additional entities state properties
  truckTabData: TruckTabData;
  statusState: StatusState;
}

export const adapter: EntityAdapter<TruckTabData> = createEntityAdapter<TruckTabData>();

export const initialState: TruckState = adapter.getInitialState({
  // additional entity state properties
  truckTabData: null,
  statusState: LoadingState.INIT,
});

export const reducer = createReducer(
  initialState,
  // on(TruckActions.addTruck, (state, action) => adapter.addOne(action.truck, state)),
  // on(TruckActions.upsertTruck, (state, action) => adapter.upsertOne(action.truck, state)),
  // on(TruckActions.addTrucks, (state, action) => adapter.addMany(action.trucks, state)),
  // on(TruckActions.upsertTrucks, (state, action) => adapter.upsertMany(action.trucks, state)),
  // on(TruckActions.updateTruck, (state, action) => adapter.updateOne(action.truck, state)),
  // on(TruckActions.updateTrucks, (state, action) => adapter.updateMany(action.trucks, state)),
  // on(TruckActions.deleteTruck, (state, action) => adapter.removeOne(action.id, state)),
  // on(TruckActions.deleteTrucks, (state, action) => adapter.removeMany(action.ids, state)),
  on(TruckActions.loadTruckData, (state) => {
    return {
      ...state,
      statusState: LoadingState.LOADING,
    };
  }),
  on(TruckActions.loadTruckDataSuccess, (state, action) =>
    adapter.setOne(action.truckTabData, {
      ...state,
      truckTabData: action.truckTabData,
      statusState: LoadingState.LOADED,
    })
  ),
  on(TruckActions.loadTruckDataFailure, (state, action) => {
    return {
      ...state,
      truckTabData: null,
      statusState: { error: action.error },
    };
  })
  // on(TruckActions.clearTrucks, (state) => adapter.removeAll(state))
);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
