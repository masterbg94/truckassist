import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DateFilter, DateFilterEvent } from '../model/date-filter';

@Injectable({
  providedIn: 'root',
})
export class DateFilterService {
  public dataSource = new BehaviorSubject<DateFilterEvent>({ dateFilter: null, check: false });
  public currentDataSource = this.dataSource.asObservable();

  constructor() {}

  /**
   * Send data source function
   *
   * @param dateFilter DateFilter
   */
  public sendDataSource(dateFilter: DateFilter[]) {
    this.dataSource.next({ dateFilter, check: true });
  }
}
