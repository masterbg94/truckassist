import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContactAccountService {
  public emitAccountsUpdate: EventEmitter<any> = new EventEmitter();
  public emitAccountLabel: EventEmitter<any> = new EventEmitter();

  public emitContactsUpdate: EventEmitter<any> = new EventEmitter();
  public emitContactLabel: EventEmitter<any> = new EventEmitter();
  public reloadAccount: boolean;
  public reloadContact: boolean;

  public companyId = JSON.parse(localStorage.getItem('currentUser')).companyId;
  constructor(private http: HttpClient) {}

  public getAllItems(serviceType: string) {
    return this.http.get(
      environment.API_ENDPOINT + `company/${serviceType}/list/all/1/${environment.perPage}`
    );
  }

  public createItem(serviceType: string, data: any) {
    return this.http.post(environment.API_ENDPOINT + `company/${serviceType}`, data);
  }

  getItemDetails(serviceType: string, id) {
    return this.http.get(environment.API_ENDPOINT + `company/${serviceType}/${id}/all`);
  }

  updateItem(serviceType, itemId, data) {
    return this.http.put(environment.API_ENDPOINT + `company/${serviceType}/${itemId}`, data);
  }

  public deleteItem(serviceType: string, id: any) {
    return this.http.delete(environment.API_ENDPOINT + `company/${serviceType}/${id}`);
  }

  deleteMultipleItems(serviceType: string, options) {
    return this.http.put(
      environment.API_ENDPOINT + `company/${serviceType}/multiple/delete`,
      options
    );
  }

  decryptPassword(id) {
    return this.http.get(environment.API_ENDPOINT + `company/account/password/${id}`);
  }

  getLabels() {
    return this.http.get(environment.API_ENDPOINT + `metadata/app/label/list`);
  }

  getLabelsByType(domain) {
    return this.http.get<any>(environment.API_ENDPOINT + `metadata/app/label/list`).pipe(
      map((x) => {
        return x.filter((p) => p.domain === domain);
      })
    );
  }

  deleteLabel(id) {
    return this.http.delete(environment.API_ENDPOINT + `metadata/app/label/` + id);
  }

  createLabel(data) {
    return this.http.post(environment.API_ENDPOINT + `metadata`, data);
  }

  updateLabel(data, id) {
    return this.http.put(environment.API_ENDPOINT + `metadata/app/label/` + id, data);
  }
}
