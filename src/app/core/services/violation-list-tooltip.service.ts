import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ViolationListTooltipService {
  private tooltipData = new BehaviorSubject<any>({ tooltip: false, index: 0, rowIndex: 0 });

  tooltip$ = this.tooltipData.asObservable();

  constructor() {}

  changeData(data: any) {
    this.tooltipData.next(data);
  }
}
