import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatisticService {
  /* Subject for parent child communication chart type */
  private chartType$ = new Subject();
  private chartTypeData$ = new Subject();

  constructor() {}

  /* Get current selected chart type */
  getChartType() {
    return this.chartType$;
  }

  /* Update selected chart type */
  updateChartType(data: string) {
    this.chartType$.next(data);
  }

  /* Get current selected chart type data */
  getChartTypeData() {
    return this.chartTypeData$;
  }
  /* Update selected chart type data */
  updateChartTypeData(data: any) {
    this.chartTypeData$.next(data);
  }
}
