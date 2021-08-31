import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BankData, EndorsementData, RestrictionData } from 'src/app/core/model/driver';
import { MetaData } from 'src/app/core/model/shared/enums';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplicantOpenService {

  private states = '../../../assets/utils/states.json';
  private provinces = '../../../assets/utils/provinces.json';

  constructor(private http: HttpClient) {}

  createMetadata(data: any) {
    return this.http.post(environment.API_ENDPOINT + `open`, data);
  }

  getMetaDataByDomainKey(domain: string, key: string) {
    return this.http.get<MetaData[]>(environment.API_ENDPOINT + `open/domain/${domain}/key/${key}`);
  }

  getColorList() {
    return this.http.get<MetaData[]>(environment.API_ENDPOINT + 'open/app/color/list/' + 1 + '/' + environment.perPage);
  }

  deleteColor(id: number) {
    return this.http.delete(environment.API_ENDPOINT + `open/app/color/` + id);
  }

  public getJSON(key: string): Observable<MetaData[]> {
    if (key === 'US') {
      return this.http.get<MetaData[]>(this.states);
    } else if (key === 'Canada') {
      return this.http.get<MetaData[]>(this.provinces);
    }
  }

  getBankList() {
    return this.http.get<BankData[]>(
      environment.API_ENDPOINT + `open/app/bank/list/1/${environment.perPage}`
    );
  }

  deleteBank(id: number) {
    return this.http.delete(environment.API_ENDPOINT + `open/app/bank/` + id);
  }

  getRestriction(): Observable<RestrictionData[]> {
    return this.http.get<RestrictionData[]>(environment.API_ENDPOINT + 'open/app/restriction/list');
  }

  getEndorsement(): Observable<EndorsementData[]> {
    return this.http.get<EndorsementData[]>(environment.API_ENDPOINT + 'open/app/endorsement/list');
  }
}
