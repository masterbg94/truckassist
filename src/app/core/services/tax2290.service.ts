import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Tax2290Service {
  private existCompany = [];
  private nexCompany = [];

  private selectedCompanySubject = new BehaviorSubject<any>(null);


  get selectedCompany(){
    return this.selectedCompanySubject.asObservable();
  }

  getCompany(data: any) {
    this.existCompany = data;
    this.selectedCompanySubject.next(data);
  }



}
