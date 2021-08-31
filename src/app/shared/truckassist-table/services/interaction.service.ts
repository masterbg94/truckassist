import { Injectable, ViewChild } from '@angular/core';
import { TruckassistTableComponent } from '../truckassist-table.component';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {
    
//   @ViewChild(TruckassistTableComponent)
//   truckassistTableComponent: TruckassistTableComponent;

  constructor() { }

  public onSelectItem(event: any, rowIndex: number) {
      // this.truckassistTableComponent.onSelectItem(event, rowIndex);
  }
}
