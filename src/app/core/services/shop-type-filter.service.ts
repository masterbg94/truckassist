import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopTypeFilterService {
  public dataSource = new BehaviorSubject<any>({ shopTypeFilter: null, check: false });
  public currentDataSource = this.dataSource.asObservable();

  constructor() {}

  /**
   * Send data source function
   *
   * @param dateFilter DateFilter
   */
  
  public sendDataSource(shopTypeFilter: any[], isCheck: boolean) {
    this.dataSource.next({ shopTypeFilter, check: isCheck });
  }
}
