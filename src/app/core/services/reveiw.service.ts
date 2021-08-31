import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReveiwService {
  private shopRaiting = new BehaviorSubject<any[]>([]);
  public currentShopRaiting = this.shopRaiting.asObservable();

  constructor() {
  }


  public sendShopRaitingData(data: any) {
    this.shopRaiting.next(data);
  }
}
