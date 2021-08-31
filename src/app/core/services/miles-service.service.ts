import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MilesServiceService {
  constructor(private http: HttpClient) {}

  checkParamas(from: any, to: any, period: string, year: number, month: number) {
    let params = new HttpParams()
      .set('from', from.toString())
      .set('to', to.toString())
      .set('period', period)
      .set('year', year.toString())
      .set('month', month.toString());
    if (from === '') {
      params = params.delete('from', undefined);
    }
    if (to === '') {
      params = params.delete('to', undefined);
    }
    if (period === '') {
      params = params.delete('period', undefined);
    }
    if (year === -1) {
      params = params.delete('year', undefined);
    }
    if (month === -1) {
      params = params.delete('month', undefined);
    }

    return params;
  }

  /* Get Miles */
  getMiles(
    from?: any,
    to?: any,
    period?: string,
    year?: number,
    month?: number
  ) {
    const params = this.checkParamas(from, to, period, year, month);
    
    return this.http.get(environment.API_ENDPOINT + `miles/list/truck?`, { params });
  }

  /* Get Stops By Truck ID */
  getMilesStopsByTruckId(truckId: number) {
    return this.http.get(environment.API_ENDPOINT + `miles/list/stops/bytruck/${truckId}/1/100`);
  }
}
