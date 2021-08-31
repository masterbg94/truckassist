import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GpsService {
  constructor(private http: HttpClient) {}

  checkParamas(
    device: string,
    truckId: number,
    driverId: number,
    from: string,
    to: string,
    period: string
  ) {
    let params = new HttpParams()
      .set('device', device)
      .set('truckId', truckId.toString())
      .set('driverId', driverId.toString())
      .set('from', from)
      .set('to', to)
      .set('period', period);

    if (device === '') {
      params = params.delete('device', undefined);
    }
    if (truckId === -1) {
      params = params.delete('truckId', undefined);
    }
    if (driverId === -1) {
      params = params.delete('driverId', undefined);
    }
    if (from === '') {
      params = params.delete('from', undefined);
    }
    if (to === '') {
      params = params.delete('to', undefined);
    }
    if (period === '') {
      params = params.delete('period', undefined);
    }

    return params;
  }

  /* GPS Data Api */

  // GET
  /* Gps Device Last Position List*/
  /* getGpsDeviceLastPosition(
    device: string,
    truckId?: number,
    driverId?: number,
    from?: string,
    to?: string,
    period?: string
  ) {
    let params = this.checkParamas(device, truckId, driverId, from, to, period);
    return this.http.get(environment.API_ENDPOINT + `gps/data/positions/last?`, { params });
  } */


  /* Gps Data  */
  getGpsData(
    device: string,
    truckId?: number,
    driverId?: number,
    from?: string,
    to?: string,
    period?: string
  ) {
    const params = this.checkParamas(device, truckId, driverId, from, to, period);
    return this.http.get(environment.API_ENDPOINT + `gps/data/all/list?`, { params });
  }

  /* GPS Device Api */

  // POST
  /* Create Bulk Devices */
  createBulkGpsDevices(data: any) {
    return this.http.post(environment.API_ENDPOINT + 'gps/device/bulk', data);
  }

  /* Create Bulk Devices Only */
  createBulkGpsDevicesOnly(data: any) {
    return this.http.post(environment.API_ENDPOINT + 'gps/device/only', data);
  }

  /* Create Gps Device */
  createGpsDevice(data: any) {
    return this.http.post(environment.API_ENDPOINT + 'gps/device', data);
  }


  // DELETE
  /* Delete Gps Device */
  deleteGpsDevice(deviceId: number) {
    return this.http.delete(environment.API_ENDPOINT + `gps/device/${deviceId}`);
  }


  // GET
  /* Get Gps Device By Id  */
  getGpsDeviceById(deviceId: number) {
    return this.http.get(environment.API_ENDPOINT + `gps/device/${deviceId}`);
  }

  /* Get Gps Devices List  */
  getGpsDevicesList() {
    return this.http.get(environment.API_ENDPOINT + 'gps/device/list/all/1/100');
  }


  // PUT
  /* Update Gps Device */
  updateGpsDevice(deviceId: number, data: any) {
    return this.http.put(environment.API_ENDPOINT + `gps/device/${deviceId}`, data);
  }

  /* Delete Multiple Gps Device */
  multipleDeleteGpsDevice(deviceId: number) {
    return this.http.put(environment.API_ENDPOINT + 'gps/device/multiple/delete', deviceId);
  }

  /* Set Multiple Status Of Gps Devices */
  multipleStatusSetGpsDevice(deviceId: number) {
    return this.http.put(environment.API_ENDPOINT + 'gps/device/multiple/status', deviceId);
  }
}
