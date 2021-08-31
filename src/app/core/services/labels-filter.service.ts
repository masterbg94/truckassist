import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NewLabel } from '../model/label';

@Injectable({
  providedIn: 'root'
})
export class LabelsFilterService {
  public labelsFilter = new BehaviorSubject<any>(null);

  // send label data
  public sendLabelData(label: NewLabel[]) {
    this.labelsFilter.next(label);
  }
}
