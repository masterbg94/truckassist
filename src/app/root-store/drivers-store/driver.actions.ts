import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { DriverTabData } from 'src/app/core/model/driver';

export const loadDriverData = createAction('[Driver List] Load Driver Data Request');

export const loadDriverDataSuccess = createAction(
  '[Driver/API] Load Driver Data Success',
  props<{ driverTabData: DriverTabData }>()
);

export const loadDriverDataFailure = createAction(
  '[Driver/API] Load Driver Data Failure',
  props<{ error: any }>()
);

// export const loadDrivers = createAction(
//   '[Driver/API] Load Drivers',
//   props<{ drivers: Driver[] }>()
// );

// export const addDriver = createAction(
//   '[Driver/API] Add Driver',
//   props<{ driver: Driver }>()
// );

// export const upsertDriver = createAction(
//   '[Driver/API] Upsert Driver',
//   props<{ driver: Driver }>()
// );

// export const addDrivers = createAction(
//   '[Driver/API] Add Drivers',
//   props<{ drivers: Driver[] }>()
// );

// export const upsertDrivers = createAction(
//   '[Driver/API] Upsert Drivers',
//   props<{ drivers: Driver[] }>()
// );

// export const updateDriver = createAction(
//   '[Driver/API] Update Driver',
//   props<{ driver: Update<Driver> }>()
// );

// export const updateDrivers = createAction(
//   '[Driver/API] Update Drivers',
//   props<{ drivers: Update<Driver>[] }>()
// );

// export const deleteDriver = createAction(
//   '[Driver/API] Delete Driver',
//   props<{ id: string }>()
// );

// export const deleteDrivers = createAction(
//   '[Driver/API] Delete Drivers',
//   props<{ ids: string[] }>()
// );

// export const clearDrivers = createAction(
//   '[Driver/API] Clear Drivers'
// );
