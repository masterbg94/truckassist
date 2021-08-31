import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as TrailerActions from './trailers.actions';
import { LoadingState, StatusState } from '../status-store/status.reducer';
import { TrailerTabData } from 'src/app/core/model/trailer';

export const trailersFeatureKey = 'trailers';

export interface TrailerState extends EntityState<TrailerTabData> {
  // additional entities state properties
  trailerTabData: TrailerTabData;
  statusState: StatusState;
}

export const adapter: EntityAdapter<TrailerTabData> = createEntityAdapter<TrailerTabData>();

export const initialState: TrailerState = adapter.getInitialState({
  // additional entity state properties
  trailerTabData: null,
  statusState: LoadingState.INIT,
});

export const reducer = createReducer(
  initialState,
  // on(TrailerActions.addTrailer, (state, action) => adapter.addOne(action.trailer, state)),
  // on(TrailerActions.upsertTrailer, (state, action) => adapter.upsertOne(action.trailer, state)),
  // on(TrailerActions.addTrailers, (state, action) => adapter.addMany(action.trailers, state)),
  // on(TrailerActions.upsertTrailers, (state, action) => adapter.upsertMany(action.trailers, state)),
  // on(TrailerActions.updateTrailer, (state, action) => adapter.updateOne(action.trailer, state)),
  // on(TrailerActions.updateTrailers, (state, action) => adapter.updateMany(action.trailers, state)),
  // on(TrailerActions.deleteTrailer, (state, action) => adapter.removeOne(action.id, state)),
  // on(TrailerActions.deleteTrailers, (state, action) => adapter.removeMany(action.ids, state)),
  on(TrailerActions.loadTrailerData, (state) => {
    return {
      ...state,
      statusState: LoadingState.LOADING,
    };
  }),
  on(TrailerActions.loadTrailerDataSuccess, (state, action) =>
    adapter.setOne(action.trailerTabData, {
      ...state,
      trailerTabData: action.trailerTabData,
      statusState: LoadingState.LOADED,
    })
  ),
  on(TrailerActions.loadTrailerDataFailure, (state, action) => {
    return {
      ...state,
      trailerTabData: null,
      statusState: { error: action.error },
    };
  })
  // on(TrailerActions.clearTrailers, (state) => adapter.removeAll(state))
);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
