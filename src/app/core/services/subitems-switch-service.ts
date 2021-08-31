import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubItemsSwitchService {
  public dataSource = new BehaviorSubject<any>(null);
  public currentDataSource = this.dataSource.asObservable();

  constructor() {}

  public sendDataSource(data: any) {
    this.dataSource.next(data);
  }
}
