import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface GridCompression {
  expanded: boolean;
  checked: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GridCompressionService {
  private dataSource = new BehaviorSubject<GridCompression>(null);
  public currentDataSource = this.dataSource.asObservable();

  constructor() {
  }

  /**
   * Send data source function
   *
   * @param data Boolean
   */
  public sendDataSource(data: GridCompression) {
    this.dataSource.next(data);
  }
}
