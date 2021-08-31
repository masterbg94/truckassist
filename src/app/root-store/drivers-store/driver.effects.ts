import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { formatPhoneNumber, formatSSNfield } from 'src/app/core/helpers/formating';
import { SortPipe } from 'src/app/core/pipes/sort.pipe';
import { AppDriverService } from 'src/app/core/services/app-driver.service';
import * as driverActions from './driver.actions';

@Injectable()
export class DriverEffects {
  constructor(
    private actions$: Actions,
    private driverService: AppDriverService,
    private sortPipe: SortPipe
  ) {}

  loadDrivers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(driverActions.loadDriverData),
      mergeMap(() =>
        this.driverService.getDrivers().pipe(
          map((driverTabData) => {
            // ALL DRIVERS
            driverTabData.allDrivers = driverTabData.allDrivers.map((driver) => {
              driver.fullName = `${driver.firstName + ' ' + driver.lastName}`;
              driver.error = false;
              driver.fullName = `${driver.firstName.trim()} ${driver.lastName.trim()}`;
              if (driver.doc && driver.doc.additionalData) {
                driver.doc.additionalData.phone = driver.doc.additionalData.phone
                  ? formatPhoneNumber(driver.doc.additionalData.phone)
                  : '';
              }
              driver.ssn = driver.ssn ? formatSSNfield(driver.ssn.toString()) : '';
              if (driver.doc && driver.doc.additionalData) {
                driver.doc.testData = this.sortPipe.transform(driver.doc.testData, 'testingDate');
                driver.doc.licenseData = this.sortPipe.transform(
                  driver.doc.licenseData,
                  'licenseEndDate'
                );
                driver.doc.medicalData = this.sortPipe.transform(driver.doc.medicalData, 'endDate');
                driver.doc.mvrData = this.sortPipe.transform(driver.doc.mvrData, 'startDate');
              }
              return driver;
            });
            // ACTIVE DRIVERS
            driverTabData.activeDrivers = driverTabData.activeDrivers.map((driver) => {
              driver.fullName = `${driver.firstName + ' ' + driver.lastName}`;
              driver.error = false;
              driver.fullName = `${driver.firstName.trim()} ${driver.lastName.trim()}`;
              if (driver.doc && driver.doc.additionalData) {
                driver.doc.additionalData.phone = driver.doc.additionalData.phone
                  ? formatPhoneNumber(driver.doc.additionalData.phone)
                  : '';
              }
              driver.ssn = driver.ssn ? formatSSNfield(driver.ssn.toString()) : '';
              if (driver.doc && driver.doc.additionalData) {
                driver.doc.testData = this.sortPipe.transform(driver.doc.testData, 'testingDate');
                driver.doc.licenseData = this.sortPipe.transform(
                  driver.doc.licenseData,
                  'licenseEndDate'
                );
                driver.doc.medicalData = this.sortPipe.transform(driver.doc.medicalData, 'endDate');
                driver.doc.mvrData = this.sortPipe.transform(driver.doc.mvrData, 'startDate');
              }
              return driver;
            });
            // INACTIVE DRIVERS
            driverTabData.inactiveDrivers = driverTabData.inactiveDrivers.map((driver) => {
              driver.fullName = `${driver.firstName + ' ' + driver.lastName}`;
              driver.error = false;
              driver.fullName = `${driver.firstName.trim()} ${driver.lastName.trim()}`;
              if (driver.doc && driver.doc.additionalData) {
                driver.doc.additionalData.phone = driver.doc.additionalData.phone
                  ? formatPhoneNumber(driver.doc.additionalData.phone)
                  : '';
              }
              driver.ssn = driver.ssn ? formatSSNfield(driver.ssn.toString()) : '';
              if (driver.doc && driver.doc.additionalData) {
                driver.doc.testData = this.sortPipe.transform(driver.doc.testData, 'testingDate');
                driver.doc.licenseData = this.sortPipe.transform(
                  driver.doc.licenseData,
                  'licenseEndDate'
                );
                driver.doc.medicalData = this.sortPipe.transform(driver.doc.medicalData, 'endDate');
                driver.doc.mvrData = this.sortPipe.transform(driver.doc.mvrData, 'startDate');
              }
              return driver;
            });

            return driverActions.loadDriverDataSuccess({ driverTabData });
          }),
          catchError((error) => of(driverActions.loadDriverDataFailure({ error })))
        )
      )
    )
  );
}
