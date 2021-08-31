import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { TruckTabData } from 'src/app/core/model/truck';

export const loadTruckData = createAction('[Truck List] Load Truck Data Request');

export const loadTruckDataSuccess = createAction(
  '[Truck/API] Load Truck Data Success',
  props<{ truckTabData: TruckTabData }>()
);

export const loadTruckDataFailure = createAction(
  '[Truck/API] Load Truck Data Failure',
  props<{ error: any }>()
);

// export const loadTrucks = createAction(
//   '[Truck/API] Load Trucks',
//   props<{ trucks: Truck[] }>()
// );

// export const addTruck = createAction(
//   '[Truck/API] Add Truck',
//   props<{ truck: Truck }>()
// );

// export const upsertTruck = createAction(
//   '[Truck/API] Upsert Truck',
//   props<{ truck: Truck }>()
// );

// export const addTrucks = createAction(
//   '[Truck/API] Add Trucks',
//   props<{ trucks: Truck[] }>()
// );

// export const upsertTrucks = createAction(
//   '[Truck/API] Upsert Trucks',
//   props<{ trucks: Truck[] }>()
// );

// export const updateTruck = createAction(
//   '[Truck/API] Update Truck',
//   props<{ truck: Update<Truck> }>()
// );

// export const updateTrucks = createAction(
//   '[Truck/API] Update Trucks',
//   props<{ trucks: Update<Truck>[] }>()
// );

// export const deleteTruck = createAction(
//   '[Truck/API] Delete Truck',
//   props<{ id: string }>()
// );

// export const deleteTrucks = createAction(
//   '[Truck/API] Delete Trucks',
//   props<{ ids: string[] }>()
// );

// export const clearTrucks = createAction(
//   '[Truck/API] Clear Trucks'
// );
