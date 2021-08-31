import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TruckData, TruckOwner, TruckTabData } from '../model/truck';
import { Vin } from '../model/vin';
import { DeletedItem, UpdatedData, UpdatedItem } from '../model/shared/enums';
import { SortPipe } from '../pipes/sort.pipe';

@Injectable({
  providedIn: 'root',
})
export class AppTruckService {
  private updatedTruckSubject = new Subject<TruckData>();
  private addedTruckSubject = new Subject<TruckData>();
  private deletedItemsSubject = new Subject<UpdatedData>();
  private updatedItemsSubject = new Subject<UpdatedData>();
  public deleteItemAction: EventEmitter<any[]> = new EventEmitter();
  public updateItemAction: EventEmitter<any[]> = new EventEmitter();

  get updatedTruck() {
    return this.updatedTruckSubject;
  }

  get addedTruck() {
    return this.addedTruckSubject;
  }

  get deletedTrucks() {
    return this.deletedItemsSubject;
  }

  get updatedStatuses() {
    return this.updatedItemsSubject;
  }

  constructor(private http: HttpClient, private sortPipe: SortPipe) {}

  addTruck(truck: TruckData) {
    return this.http.post(environment.API_ENDPOINT + 'truck', truck).pipe(
      tap((truckData: TruckData) => {
        truck.id = truckData.id;
        this.addedTruckSubject.next(truck);
      })
    );
  }

  updateTruckData(data: TruckData, id: number): Observable<TruckData> {
    return this.http.put<TruckData>(environment.API_ENDPOINT + `truck/${id}`, data).pipe(
      tap((truckData: TruckData) => {
        if (truckData.doc) {
          truckData.doc.inspectionData = this.sortPipe.transform(
            truckData.doc.inspectionData,
            'startDate'
          );
          truckData.doc.licenseData = this.sortPipe.transform(truckData.doc.licenseData, 'endDate');
          truckData.doc.titleData = this.sortPipe.transform(truckData.doc.titleData, 'startDate');
          truckData.doc.truckLeaseData = this.sortPipe.transform(
            truckData.doc.truckLeaseData,
            'date'
          );
        }
        this.updatedTruckSubject.next(truckData);
      })
    );
  }

  updateTruckBasic(data: any, id: number): Observable<TruckData> {
    return this.http.put<TruckData>(environment.API_ENDPOINT + `truck/${id}`, data).pipe(
      tap((truckData: TruckData) => {
        if (truckData.doc) {
          truckData.doc.inspectionData = this.sortPipe.transform(
            truckData.doc.inspectionData,
            'startDate'
          );
          truckData.doc.licenseData = this.sortPipe.transform(truckData.doc.licenseData, 'endDate');
          truckData.doc.titleData = this.sortPipe.transform(truckData.doc.titleData, 'startDate');
          truckData.doc.truckLeaseData = this.sortPipe.transform(
            truckData.doc.truckLeaseData,
            'date'
          );
        }
        this.updatedTruckSubject.next(truckData);
      })
    );
  }

  getTrucks(): Observable<TruckTabData> {
    return this.http
      .get<TruckTabData>(environment.API_ENDPOINT + 'truck/list/all/' + 1 + '/' + environment.perPage)
      .pipe(
        map((response: TruckTabData) => {
          return response;
        })
      );
  }

  editTrucks(id) {
    return this.http.get(environment.API_ENDPOINT + `truck/${id}/all`);
  }

  deleteMaintennaceItem(id) {
    return this.http.delete(environment.API_ENDPOINT + 'maintenance/' + id);
  }

  removeTruckLoad(id) {
    return this.http.delete(environment.API_ENDPOINT + `truckload/${id}`);
  }

  getVinData(vin: string): Observable<Vin[]> {
    const endpoint = environment.API_ENDPOINT + 'vin/truck/';
    return this.http.get<Vin[]>(endpoint + vin);
  }

  getOwners(): Observable<TruckOwner[]> {
    const endpoint = environment.API_ENDPOINT + 'select/owner/list';
    return this.http.get<TruckOwner[]>(endpoint);
  }

  getTruckList(): Observable<TruckTabData> {
    return this.http.get<TruckTabData>(environment.API_ENDPOINT + 'truck/list/all/1/' + environment.perPage);
  }

  getTruckData(id: number, jsonNode: string): Observable<TruckData> {
    return this.http.get<TruckData>(environment.API_ENDPOINT + `truck/${id}/${jsonNode}`).pipe(
      map((truckData: TruckData) => {
        truckData.doc.inspectionData = this.sortPipe.transform(
          truckData.doc.inspectionData,
          'startDate'
        );
        truckData.doc.licenseData = this.sortPipe.transform(truckData.doc.licenseData, 'endDate');
        truckData.doc.titleData = this.sortPipe.transform(truckData.doc.titleData, 'startDate');
        truckData.doc.truckLeaseData = this.sortPipe.transform(
          truckData.doc.truckLeaseData,
          'date'
        );
        return truckData;
      })
    );
  }

  deleteAllTrucks(data) {
    return this.http.put(environment.API_ENDPOINT + 'truck/multiple/delete', data).pipe(
      tap((items: UpdatedData) => {
        // items.failure = JSON.parse(items.failure.toString());
        // items.notExist = JSON.parse(items.notExist.toString());
        // items.success = JSON.parse(items.success.toString());
        this.deletedItemsSubject.next(items);
      })
    );
  }

  changeTruckStatuses(data) {
    return this.http.put(environment.API_ENDPOINT + 'truck/multiple/status', data).pipe(
      tap((items: UpdatedData) => {
        // items.failure = JSON.parse(items.failure.toString());
        // items.notExist = JSON.parse(items.notExist.toString());
        // items.success = JSON.parse(items.success.toString());
        this.updatedItemsSubject.next(items);
      })
    );
  }
}
