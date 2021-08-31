import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShopReviewService {
  constructor(private http: HttpClient) {}

  /* Create */
  createShopReview(data: any) {
    return this.http.post(environment.API_ENDPOINT + `repairshop/review`, data);
  }

  /* Get  Shop Review By Id */
  getShopReviewById(repairShopReviewId: number) {
    return this.http.get(environment.API_ENDPOINT + `repairshop/review/${repairShopReviewId}`);
  }

  /* Get Shop Review List */
  getShopReviewList(repairShopId: number) {
    return this.http.get(environment.API_ENDPOINT + `repairshop/review/list/${repairShopId}/1/100`);
  }

  /* Update Shop Review */
  updateShopReview(data: any, repairShopReviewId: number) {
    return this.http.put(
      environment.API_ENDPOINT + `repairshop/review/${repairShopReviewId}`,
      data
    );
  }

  /* Delete Shop Review */
  deleteShopReview(repairShopReviewId: number) {
    return this.http.delete(environment.API_ENDPOINT + `repairshop/review/${repairShopReviewId}`);
  }
}
