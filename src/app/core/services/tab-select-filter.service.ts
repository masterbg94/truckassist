import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TabFilterEvent } from '../model/tab-filter';

@Injectable({
  providedIn: 'root'
})
export class TabSelectFilterService {
  public dataSource = new BehaviorSubject<TabFilterEvent>({ tabFilter: null, check: false });

  // send tabFilter data
  public sendTabFilterData(tabFilter: any[]) {
    this.dataSource.next({ tabFilter, check: true });
  }
}
