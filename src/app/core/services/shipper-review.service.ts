import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShipperReviewService {

  constructor(private http: HttpClient) {}

  /* Create */
  createShipperReview(data: any) {
    return this.http.post(environment.API_ENDPOINT + `shipper/review`, data);
  }

  /* Update Review */
  updateShipperReview(data: any, shipperReviewId: number) {
    return this.http.put(environment.API_ENDPOINT + `shipper/review/${shipperReviewId}`, data);
  }

  /* Get Review By Id */
  getShipperReview(shipperReviewId: number) {
    return this.http.get(environment.API_ENDPOINT + `shipper/review/${shipperReviewId}`);
  }

  /* Get Broker Review List */
  getShipperReviewList(brokerId: number) {
    return this.http.get(environment.API_ENDPOINT + `shipper/review/list/${brokerId}/1/100`);
  }

  /* Delete */
  deleteShipperReview(shipperReviewId: number) {
    return this.http.delete(environment.API_ENDPOINT + `shipper/review/${shipperReviewId}`);
  }
}
