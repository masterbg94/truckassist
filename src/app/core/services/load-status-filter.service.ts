import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoadStatusFilterEvent } from '../model/load-status';

@Injectable({
  providedIn: 'root',
})
export class LoadStatusFilterService {
  public dataSource = new BehaviorSubject<LoadStatusFilterEvent>({ loadStatusFilter: [], check: false });
  public currentDataSource = this.dataSource.asObservable();

  constructor() {}

  /**
   * Send data source function
   *
   * @param loadStatusFilter LoadStatusFilter
   */
  public sendDataSource(loadStatusFilter: number[]) {
    this.dataSource.next({ loadStatusFilter, check: true });
  }
}
