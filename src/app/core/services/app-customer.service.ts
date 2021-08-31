import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Subject, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Customer, Shipper } from '../model/customer';

@Injectable({
  providedIn: 'root',
})
export class AppCustomerService {
  /* Swich */
  public tabOnCustomer: boolean;
  // Shipper
  public createShipper = new Subject<void>();
  public editShipperSubject = new Subject<Shipper>();
  public shipperEdited = false;

  // Customer
  public createCustomer = new Subject<void>();
  public editCustomerSubject = new Subject<Customer>();

  public customerEdited = false;

  constructor(private http: HttpClient) {}

  // Shipper
  get newShipper() {
    return this.createShipper;
  }

  get updateShipperSubject() {
    return this.editShipperSubject;
  }

  // Customer
  get newCustomer() {
    return this.createCustomer;
  }

  get updateCustomerSubject() {
    return this.editCustomerSubject;
  }

  /* Customer */
  getCustomers() {
    return this.http.get(environment.API_ENDPOINT + 'broker/list/all/1/' + environment.perPage);
  }
  getCustomerById(id: number) {
    return this.http.get(environment.API_ENDPOINT + `broker/${id}/all`);
  }
  editCustomer(id: number) {
    return this.http.get(environment.API_ENDPOINT + `broker/${id}/all`);
  }

  addCustomer(customer) {
    return this.http.post(environment.API_ENDPOINT + 'broker', customer).pipe(
      tap(() => {
        this.createCustomer.next();
      })
    );
  }
  updateCustomer(data: any, id: number) {
    return this.http.put(environment.API_ENDPOINT + `broker/${id}`, data).pipe(
      tap(() => {
        this.editCustomerSubject.next(data);
      })
    );
  }
  deleteCustomer(id: number) {
    return this.http.delete(environment.API_ENDPOINT + `broker/${id}`);
  }

  /* Customer Reiting */
  createCustomerReiting(data: any) {
    return this.http.post(environment.API_ENDPOINT + `broker/rating`, data);
  }

  getCustomerCommentsById(customerId: number) {
    return this.http.get(environment.API_ENDPOINT + `broker/rating/reviews/${customerId}/1/${environment.perPage}`);
  }

  getCustomerRaitingList() {
    return this.http.get(environment.API_ENDPOINT + `broker/rating/list/1/100`);
  }

  getCustomerReitingById(customerId: number) {
    return this.http.get(environment.API_ENDPOINT + `broker/rating/${customerId}`);
  }

  updateCustomerReiting(id: number, data: any) {
    return this.http.put(environment.API_ENDPOINT + `broker/rating/${id}`, data);
  }

  deleteCustomerReiting(id: number) {
    return this.http.delete(environment.API_ENDPOINT + `broker/rating/${id}`);
  }

  /* Review */
  createBrokerReview(data: any) {
    return this.http.post(environment.API_ENDPOINT + `broker/review`, data);
  }

  /* Shipper reiting */
  createShipperReiting(data: any) {
    return this.http.post(environment.API_ENDPOINT + `shipper/rating`, data);
  }

  getShipperReitingList() {
    return this.http.get(environment.API_ENDPOINT + `shipper/rating/list/1/100`);
  }

  getShipperComentsById(shipperId: number) {
    return this.http.get(environment.API_ENDPOINT + `shipper/rating/reviews/${shipperId}/1/${environment.perPage}`);
  }

  updateShipperReiting(id: number, data: any) {
    return this.http.put(environment.API_ENDPOINT + `shipper/rating/${id}`, data);
  }

  deleteShipperReiting(id: number) {
    return this.http.delete(environment.API_ENDPOINT + `shipper/rating/${id}`);
  }
  /* Shipper */

  getShipper() {
    return this.http.get(environment.API_ENDPOINT + 'shipper/list/all/' + 1 + '/' + environment.perPage);
  }
  editShipper(id: number) {
    return this.http.get(environment.API_ENDPOINT + `shipper/${id}/all`);
  }
  addShipper(shipper: any) {
    return this.http.post(environment.API_ENDPOINT + 'shipper', shipper).pipe(
      tap(() => {
        this.createShipper.next();
      })
    );
  }
  updateShipper(data: any, id: number) {
    return this.http.put(environment.API_ENDPOINT + `shipper/${id}`, data).pipe(
      tap(() => {
        this.editShipperSubject.next(data);
      })
    );
  }
  getShipperById(id: number) {
    return this.http.get(environment.API_ENDPOINT + `shipper/${id}/all`);
  }
  deleteShipper(id: number) {
    return this.http.delete(environment.API_ENDPOINT + `shipper/${id}`);
  }
  //////////////////////////////////////////////////////////////////////////////
}
