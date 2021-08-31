import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SafetyService {
  private newAccident = new Subject<void>();
  private newViolation = new Subject<void>();

  private updatedAccidentDataSubject = new Subject<any>();
  private updatedViolationDataSubject = new Subject<any>();

  constructor(private http: HttpClient) {}

  /*
    ACCIDENT CRUD
  */

  get createNewAccident() {
    return this.newAccident;
  }

  get updatedAccidentSubject() {
    return this.updatedAccidentDataSubject;
  }

  /* Post Accident */
  createAccident(data: any) {
    return this.http.post(environment.API_ENDPOINT + `accident`, data).pipe(
      tap(() => {
        this.newAccident.next();
      })
    );
  }

  /* Put Accident */
  updateAccident(data: any, accidentId: number) {
    return this.http.put(environment.API_ENDPOINT + `accident/${accidentId}`, data).pipe(
      tap((accidentData: any) => {
        this.updatedAccidentDataSubject.next(accidentData);
      })
    );
  }

  /* Delete Accident */
  deleteAccident(accidentId: number) {
    return this.http.delete(environment.API_ENDPOINT + `accident/${accidentId}`);
  }

  /* Get Accident by ID */
  getAccidentById(accidentId: number) {
    return this.http.get(environment.API_ENDPOINT + `accident/${accidentId}/all`);
  }

  /* Get Accidents */
  getAccidentList() {
    return this.http.get(environment.API_ENDPOINT + `accident/list/all/1/${environment.perPage}`);
  }

  /*
    ACCIDENT CRUD END
  */
  /*
    VIOLATION CRUD
  */

  get createNewViolation() {
    return this.newViolation;
  }

  get updatedViolationSubject() {
    return this.updatedViolationDataSubject;
  }

  /* Post Violation */
  createViolation(data: any) {
    return this.http.post(environment.API_ENDPOINT + `violation`, data).pipe(
      tap(() => {
        this.newViolation.next();
      })
    );
  }

  /* Put Violation */
  updateViolation(data: any, violationId: number) {
    return this.http.put(environment.API_ENDPOINT + `violation/${violationId}`, data).pipe(
      tap((violationData: any) => {
        this.updatedViolationDataSubject.next(violationData);
      })
    );
  }

  /* Delete Violation */
  deleteViolation(violationId: number) {
    return this.http.delete(environment.API_ENDPOINT + `violation/${violationId}`);
  }

  /* Get Violation by ID */
  getViolationById(violationId: number) {
    return this.http.get(environment.API_ENDPOINT + `violation/${violationId}/all`);
  }

  /* Get Violations */
  getViolationsList() {
    return this.http.get(environment.API_ENDPOINT + `violation/list/all/1/${environment.perPage}`);
  }

  /*
    VIOLATION CRUD END
  */
}
