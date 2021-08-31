import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Comments } from '../model/comment';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AppActivityLogService {
  constructor(private http: HttpClient) {}

  getAccountingList() {
    return this.http.get(environment.API_ENDPOINT + `activity/log/accounting/list/1/${environment.perPage}`);
  }

  getDispatchboardList() {
    return this.http.get(environment.API_ENDPOINT + `activity/log/dispatchboard/list/1/${environment.perPage}`);
  }

  getGeneralList() {
    return this.http.get(environment.API_ENDPOINT + `activity/log/general/list/1/${environment.perPage}`);
  }
 
}
