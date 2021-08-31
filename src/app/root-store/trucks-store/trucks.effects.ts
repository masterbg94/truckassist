import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { SortPipe } from 'src/app/core/pipes/sort.pipe';
import { AppTruckService } from 'src/app/core/services/app-truck.service';
import * as truckActions from './trucks.actions';

@Injectable()
export class TruckEffects {
  constructor(private actions$: Actions, private truckService: AppTruckService, private sortPipe: SortPipe) {}

  loadTrucks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(truckActions.loadTruckData),
      mergeMap(() =>
        this.truckService.getTrucks().pipe(
          map((truckTabData) => {
            // ALL TRUCKS
            truckTabData.allTrucks = truckTabData.allTrucks.map((truck) => {
              truck.commission =
                truck.companyOwned || truck.divisionFlag
                  ? undefined
                  : truck.commission.toString().includes('%')
                  ? truck.commission
                  : truck.commission + '%';
              truck.doc.inspectionData = this.sortPipe.transform(truck.doc.inspectionData, 'startDate');
              truck.doc.licenseData = this.sortPipe.transform(truck.doc.licenseData, 'endDate');
              truck.doc.titleData = this.sortPipe.transform(truck.doc.titleData, 'startDate');
              truck.doc.truckLeaseData = this.sortPipe.transform(truck.doc.truckLeaseData, 'date');
              return truck;
            });
            // ACTIVE TRUCKS
            truckTabData.activeTrucks = truckTabData.activeTrucks.map((truck) => {
              truck.commission =
                truck.companyOwned || truck.divisionFlag
                  ? undefined
                  : truck.commission.toString().includes('%')
                  ? truck.commission
                  : truck.commission + '%';
              truck.doc.inspectionData = this.sortPipe.transform(truck.doc.inspectionData, 'startDate');
              truck.doc.licenseData = this.sortPipe.transform(truck.doc.licenseData, 'endDate');
              truck.doc.titleData = this.sortPipe.transform(truck.doc.titleData, 'startDate');
              truck.doc.truckLeaseData = this.sortPipe.transform(truck.doc.truckLeaseData, 'date');
              return truck;
            });
            // INACTIVE TRUCKS
            truckTabData.inactiveTrucks = truckTabData.inactiveTrucks.map((truck) => {
              truck.commission =
                truck.companyOwned || truck.divisionFlag
                  ? undefined
                  : truck.commission.toString().includes('%')
                  ? truck.commission
                  : truck.commission + '%';
              truck.doc.inspectionData = this.sortPipe.transform(truck.doc.inspectionData, 'startDate');
              truck.doc.licenseData = this.sortPipe.transform(truck.doc.licenseData, 'endDate');
              truck.doc.titleData = this.sortPipe.transform(truck.doc.titleData, 'startDate');
              truck.doc.truckLeaseData = this.sortPipe.transform(truck.doc.truckLeaseData, 'date');
              return truck;
            });

            return truckActions.loadTruckDataSuccess({ truckTabData });
          }),
          catchError((error) => of(truckActions.loadTruckDataFailure({ error })))
        )
      )
    )
  );
}
