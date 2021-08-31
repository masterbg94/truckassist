import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { SortPipe } from 'src/app/core/pipes/sort.pipe';
import { AppTrailerService } from 'src/app/core/services/app-trailer.service';
import * as trailerActions from './trailers.actions';

@Injectable()
export class TrailerEffects {
  constructor(
    private actions$: Actions,
    private trailerService: AppTrailerService,
    private sortPipe: SortPipe
  ) {}

  getTrailerFileName(data: any){
    if(data.name === 'Wabash National'){
      return 'wabash-national.svg'
    }else{
      return data.file;
    }
  }

  loadTrailers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(trailerActions.loadTrailerData),
      mergeMap(() =>
        this.trailerService.getTrailers().pipe(
          map((trailerTabData) => {
            // ALL TRAILERS
            trailerTabData.allTrailers = trailerTabData.allTrailers.map((trailer) => {
              trailer.doc.inspectionData = this.sortPipe.transform(
                trailer.doc.inspectionData,
                'startDate'
              );
              trailer.doc.licenseData = this.sortPipe.transform(trailer.doc.licenseData, 'endDate');
              trailer.doc.titleData = this.sortPipe.transform(trailer.doc.titleData, 'startDate');
              trailer.doc.trailerLeaseData = this.sortPipe.transform(
                trailer.doc.trailerLeaseData,
                'date'
              );
              trailer.doc.additionalData.make.file = this.getTrailerFileName(
                trailer.doc.additionalData.make
              );
              return trailer;
            });
            // ACTIVE TRAILERS
            trailerTabData.activeTrailers = trailerTabData.activeTrailers.map((trailer) => {
              trailer.doc.inspectionData = this.sortPipe.transform(
                trailer.doc.inspectionData,
                'startDate'
              );
              trailer.doc.licenseData = this.sortPipe.transform(trailer.doc.licenseData, 'endDate');
              trailer.doc.titleData = this.sortPipe.transform(trailer.doc.titleData, 'startDate');
              trailer.doc.trailerLeaseData = this.sortPipe.transform(
                trailer.doc.trailerLeaseData,
                'date'
              );
              trailer.doc.additionalData.make.file = this.getTrailerFileName(
                trailer.doc.additionalData.make
              );
              return trailer;
            });
            // INACTIVE TRAILERS
            trailerTabData.inactiveTrailers = trailerTabData.inactiveTrailers.map((trailer) => {
              trailer.doc.inspectionData = this.sortPipe.transform(
                trailer.doc.inspectionData,
                'startDate'
              );
              trailer.doc.licenseData = this.sortPipe.transform(trailer.doc.licenseData, 'endDate');
              trailer.doc.titleData = this.sortPipe.transform(trailer.doc.titleData, 'startDate');
              trailer.doc.trailerLeaseData = this.sortPipe.transform(
                trailer.doc.trailerLeaseData,
                'date'
              );
              trailer.doc.additionalData.make.file = this.getTrailerFileName(
                trailer.doc.additionalData.make
              );
              return trailer;
            });
            return trailerActions.loadTrailerDataSuccess({ trailerTabData });
          }),
          catchError((error) => of(trailerActions.loadTrailerDataFailure({ error })))
        )
      )
    )
  );
}
