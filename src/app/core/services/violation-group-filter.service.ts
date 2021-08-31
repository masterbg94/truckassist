import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ViolationGroupFilterEvent } from '../model/violation-group-filter-event';

@Injectable({
  providedIn: 'root',
})
export class ViolationGroupFilterService {
  public dataSource = new BehaviorSubject<ViolationGroupFilterEvent>({
    violationGroupFilter: [],
    active: false,
  });
  public currentDataSource = this.dataSource.asObservable();

  constructor() {}

  /**
   * Send data source function
   *
   * @param violationGroupFilter ViolationGroupFilter
   */
  public sendDataSource(violationGroupFilter: number[]) {
    this.dataSource.next({ violationGroupFilter, active: true });
  }
}
