import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { TrailerTabData } from 'src/app/core/model/trailer';

export const loadTrailerData = createAction('[Trailer List] Load Trailer Data Request');

export const loadTrailerDataSuccess = createAction(
  '[Trailer/API] Load Trailer Data Success',
  props<{ trailerTabData: TrailerTabData }>()
);

export const loadTrailerDataFailure = createAction(
  '[Trailer/API] Load Trailer Data Failure',
  props<{ error: any }>()
);

// export const loadTrailers = createAction(
//   '[Trailer/API] Load Trailers',
//   props<{ trailers: Trailer[] }>()
// );

// export const addTrailer = createAction(
//   '[Trailer/API] Add Trailer',
//   props<{ trailer: Trailer }>()
// );

// export const upsertTrailer = createAction(
//   '[Trailer/API] Upsert Trailer',
//   props<{ trailer: Trailer }>()
// );

// export const addTrailers = createAction(
//   '[Trailer/API] Add Trailers',
//   props<{ trailers: Trailer[] }>()
// );

// export const upsertTrailers = createAction(
//   '[Trailer/API] Upsert Trailers',
//   props<{ trailers: Trailer[] }>()
// );

// export const updateTrailer = createAction(
//   '[Trailer/API] Update Trailer',
//   props<{ trailer: Update<Trailer> }>()
// );

// export const updateTrailers = createAction(
//   '[Trailer/API] Update Trailers',
//   props<{ trailers: Update<Trailer>[] }>()
// );

// export const deleteTrailer = createAction(
//   '[Trailer/API] Delete Trailer',
//   props<{ id: string }>()
// );

// export const deleteTrailers = createAction(
//   '[Trailer/API] Delete Trailers',
//   props<{ ids: string[] }>()
// );

// export const clearTrailers = createAction(
//   '[Trailer/API] Clear Trailers'
// );
