import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BrokerReviewService {

  constructor(private http: HttpClient) { }

  /* Create */
  createBrokerReview(data: any) {
    return this.http.post(environment.API_ENDPOINT + `broker/review`, data);
  }

  /* Update Review */
  updateBrokerReview(data: any, brokerReviewId: number) {
    return this.http.put(environment.API_ENDPOINT + `broker/review/${brokerReviewId}`, data);
  }

  /* Get Review By Id */
  getBrokerReview(brokerReviewId: number) {
    return this.http.get(environment.API_ENDPOINT + `broker/review/${brokerReviewId}`);
  }

  /* Get Broker Review List */
  getBrokerReviewList(brokerId: number) {
    return this.http.get(environment.API_ENDPOINT + `broker/review/list/${brokerId}/1/100`);
  }

  /* Delete */
  deleteBrokerReview(brokerReviewId: number) {
    return this.http.delete(environment.API_ENDPOINT + `broker/review/${brokerReviewId}`);
  }
}
