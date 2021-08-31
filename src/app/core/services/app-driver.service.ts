import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import {
  DriverData,
  RestrictionData,
  EndorsementData,
  DriverTabData,
  LicenseData,
  UpsertedLicenseData,
} from '../model/driver';
import { environment } from 'src/environments/environment';
import { DeletedItem, UpdatedData, UpdatedItem } from '../model/shared/enums';
import { SortPipe } from '../pipes/sort.pipe';

@Injectable({
  providedIn: 'root',
})
export class AppDriverService {
  private updatedDriverSubject = new Subject<DriverData>();
  private addedDriverSubject = new Subject<DriverData>();
  private deletedItemsSubject = new Subject<UpdatedData>();
  private updatedItemsSubject = new Subject<UpdatedData>();
  private upsertCDLSubject = new Subject<UpsertedLicenseData>();
  public deleteItemAction: EventEmitter<any[]> = new EventEmitter();
  public updateItemAction: EventEmitter<any[]> = new EventEmitter();

  get updatedDriver() {
    return this.updatedDriverSubject;
  }

  get addedDriver() {
    return this.addedDriverSubject;
  }

  get deletedDrivers() {
    return this.deletedItemsSubject;
  }

  get updatedStatuses() {
    return this.updatedItemsSubject;
  }

  get upsertedCDL() {
    return this.upsertCDLSubject;
  }

  constructor(private http: HttpClient, private sortPipe: SortPipe) {}

  getDrivers(): Observable<DriverTabData> {
    return this.http.get<DriverTabData>(
      environment.API_ENDPOINT + 'driver/list/all/' + 1 + '/' + environment.perPage
    );
  }

  getDriverSelect() {
    return this.http.get<any>(environment.API_ENDPOINT + 'select/driver/all');
  }

  getDriverData(id: number, jsonNode: string): Observable<DriverData> {
    return this.http.get<DriverData>(environment.API_ENDPOINT + `driver/${id}/${jsonNode}`).pipe(
      map((driverData: DriverData) => {
        driverData.doc.testData = this.sortPipe.transform(driverData.doc.testData, 'testingDate');
        driverData.doc.licenseData = this.sortPipe.transform(driverData.doc.licenseData, 'endDate');
        driverData.doc.medicalData = this.sortPipe.transform(driverData.doc.medicalData, 'endDate');
        driverData.doc.mvrData = this.sortPipe.transform(driverData.doc.mvrData, 'startDate');
        return driverData;
      })
    );
  }

  deleteAllDrivers(data) {
    return this.http.put(environment.API_ENDPOINT + 'driver/multiple/delete', data).pipe(
      tap((items: UpdatedData) => {
        // items.failure = JSON.parse(items.failure.toString());
        // items.notExist = JSON.parse(items.notExist.toString());
        // items.success = JSON.parse(items.success.toString());
        this.deletedItemsSubject.next(items);
      })
    );
  }

  updateDriverBasic(data: any, id: number): Observable<DriverData> {
    return this.http.put<DriverData>(environment.API_ENDPOINT + `driver/${id}`, data).pipe(
      tap(() => {
        data.id = id;
        data.doc.testData = this.sortPipe.transform(data.doc.testData, 'testingDate');
        data.doc.licenseData = this.sortPipe.transform(data.doc.licenseData, 'endDate');
        data.doc.medicalData = this.sortPipe.transform(data.doc.medicalData, 'endDate');
        data.doc.mvrData = this.sortPipe.transform(data.doc.mvrData, 'startDate');
        this.updatedDriverSubject.next(data);
      })
    );
  }

  updateDriverData(data: DriverData, id: number): Observable<DriverData> {
    return this.http.put<DriverData>(environment.API_ENDPOINT + `driver/${id}`, data).pipe(
      tap(() => {
        data.id = id;
        data.doc.testData = this.sortPipe.transform(data.doc.testData, 'testingDate');
        data.doc.licenseData = this.sortPipe.transform(data.doc.licenseData, 'endDate');
        data.doc.medicalData = this.sortPipe.transform(data.doc.medicalData, 'endDate');
        data.doc.mvrData = this.sortPipe.transform(data.doc.mvrData, 'startDate');
        this.updatedDriverSubject.next(data);
      })
    );
  }

  addDriver(driver): Observable<DriverData> {
    return this.http.post<DriverData>(environment.API_ENDPOINT + 'driver', driver).pipe(
      tap((driverData: DriverData) => {
        driver.id = driverData.id;
        this.addedDriverSubject.next(driver);
      })
    );
  }

  getRestriction(): Observable<RestrictionData[]> {
    return this.http.get<RestrictionData[]>(
      environment.API_ENDPOINT + 'metadata/app/restriction/list'
    );
  }

  getEndorsement(): Observable<EndorsementData[]> {
    return this.http.get<EndorsementData[]>(
      environment.API_ENDPOINT + 'metadata/app/endorsement/list'
    );
  }

  changeDriverStatuses(data) {
    return this.http.put(environment.API_ENDPOINT + 'driver/multiple/status', data).pipe(
      tap((items: UpdatedData) => {
        this.updatedItemsSubject.next(items);
      })
    );
  }

  upsertCDL(licenseData: LicenseData, driverId: number): Observable<LicenseData> {
    return this.http
      .put<LicenseData>(environment.API_ENDPOINT + `driver/cdl/${driverId}`, licenseData)
      .pipe(
        tap((upsertedCDL: LicenseData) => {
          this.upsertCDLSubject.next({ licenseData: upsertedCDL, driverId });
        })
      );
  }
}
