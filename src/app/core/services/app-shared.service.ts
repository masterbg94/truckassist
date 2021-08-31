import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable, Subject, Subscriber } from 'rxjs';
import { BankData, DriverOwnerData } from '../model/driver';
import { OwnerData, OwnerTabData } from '../model/shared/owner';
import { environment } from 'src/environments/environment';
import { ManageMaintenance } from '../model/shared/maintenance';

@Injectable({
  providedIn: 'root',
})
export class AppSharedService {
  public emitViewChange: EventEmitter<boolean> = new EventEmitter();

  // Owner
  public createOwner = new Subject<OwnerData>();
  public editOwnerSubject = new Subject<void>();
  public updateOwnerSubject = new Subject<OwnerData>();

  // Repair shop
  public createRepairShop = new Subject<void>();
  // TODO: dodati tip za RepairShop
  public updateRepairShopSubject = new Subject<any>();

  // Maintenance
  public createMaintenance = new Subject<void>();
  public editMaintenanceSubject = new Subject<ManageMaintenance>();
  public deleteMaintenanceSubject = new Subject<void>();
  // ublic multiDeleteMaintenanceSubject = new Subject<void>();

  public reloadTruckList = new Subject<void>();
  public reloadTrailerList = new Subject<void>();

  // Office / Factoring
  public editOfficeFactoringSubject = new Subject<void>();

  public enableDisable: EventEmitter<boolean> = new EventEmitter();
  public emitTab: EventEmitter<number> = new EventEmitter();
  public reloadOwner: boolean;
  headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
  constructor(private http: HttpClient) {}

  // Owner
  get newOwner() {
    return this.createOwner;
  }

  get updateOwnerData() {
    return this.updateOwnerSubject;
  }

  // Repair shop
  get newRepairShop() {
    return this.createRepairShop;
  }

  // Maintenance
  get newMaintenance() {
    return this.createMaintenance;
  }

  get updateMaintenanceSubject() {
    return this.editMaintenanceSubject;
  }

  get removeMaintenance() {
    return this.deleteMaintenanceSubject;
  }

  // get multiRemoveMaintenance() {
  //   return this.multiDeleteMaintenanceSubject;
  // }

  // Office
  get updateOfficeFactoringSubject() {
    return this.editOfficeFactoringSubject;
  }

  get reloadTruckListSubject() {
    return this.reloadTruckList;
  }

  get reloadTrailerListSubject() {
    return this.reloadTrailerList;
  }

  get updatedRepairShopData() {
    return this.updateRepairShopSubject;
  }

  // Shared enums
  // Colors
  // addColor(data) {
  //   return this.http.post(app_endpoint + 'app/enum/color/add/', data);
  // }

  // getColors(lang) {
  //   return this.http.get(app_endpoint + 'app/enum/color/list/' + lang);
  // }

  // Owners
  /*
  addOwner(data) {
    return this.http.post(app_endpoint + 'app/ownership/create', data).pipe(
      tap(() => {
        this.createOwner.next();
      })
    );
  }

  editOwner(id) {
    return this.http.get(app_endpoint + 'app/ownership/detail/' + id);
  }

  updateOwner(data, id) {
    return this.http.put(app_endpoint + 'app/ownership/update/' + id, data).pipe(
      tap(() => {
        this.createOwner.next();
      })
    );
  }
  */

  // multipleDelete(data) {
  //   return this.http.delete(app_endpoint + 'app/ownership/multiple/delete/', data);
  // }

  /*
  getOwners() {
    return this.http.get(app_endpoint + 'app/ownership/list/active/0/1/30');
  }
  */

  // getOwnersWithCount() {
  //   return this.http.get(app_endpoint + 'app/ownership/list/1/1/1/10000');
  // }

  // getOwnerTypes() {
  //   return this.http.get(app_endpoint + 'app/ownership/type');
  // }

  /*   deleteOwner(id) {
    return this.http.delete(app_endpoint + 'app/ownership/delete/' + id);
  } */

  // getRepairsSorting(page, num, field, sort) {
  //   return this.http.get(
  //     app_endpoint +
  //       'app/repair_shop/list/active/' +
  //       page +
  //       '/' +
  //       num +
  //       '?sortColumn=' +
  //       field +
  //       '&sortOrder=' +
  //       sort
  //   );
  // }

  // rateRepairShop(id, data) {
  //   return this.http.post(app_endpoint + 'app/rating/repairshop/' + id, data);
  // }

  // getRepairShopTypes() {
  //   return this.http.get(app_endpoint + 'app/repair_shop/list_types');
  // }

  // getCurrencies() {
  //   return this.http.get(app_endpoint + 'app/currency/list');
  // }

  // addBank(data) {
  //   return this.http.post(app_endpoint + 'app/enum/bank/add/', data);
  // }

  // Country
  // Enum
  // getCountry(language) {
  //   return this.http.get(app_endpoint + 'app/enum/country/list/' + language);
  // }

  // getCountryStates(language) {
  //   return this.http.get(app_endpoint + 'app/enum/state/list/' + language);
  // }

  // getCountryProvinces(language) {
  //   return this.http.get(app_endpoint + 'app/enum/province/list/' + language);
  // }

  // deleteMaintenance(id, vehicle) {
  //   return this.http.delete(app_endpoint + 'app/' + vehicle + '/maintenance/delete/' + id).pipe(
  //     tap(() => {
  //       this.deleteMaintenanceSubject.next();
  //     })
  //   );
  // }

  // multiDeleteMaintenance(vehicle, data) {
  //   //STO PUT?!
  //   return this.http.put(app_endpoint + 'app/maintenance/delete/' + vehicle, data);
  // }

  // updateMaintennace(id, data, vehicle) {
  //   return this.http.put(app_endpoint + 'app/' + vehicle + '/maintenance/update/' + id, data).pipe(
  //     tap(() => {
  //       this.editMaintenanceSubject.next();
  //       if (vehicle == 'truck') {
  //         this.reloadTruckList.next();
  //       }
  //       if (vehicle == 'trailer') {
  //         this.reloadTrailerListSubject.next();
  //       }
  //     })
  //   );
  // }

  // getMaintenanceSortingList(isTruck, field, sort) {
  //   return this.http.get(
  //     app_endpoint +
  //       'app/' +
  //       isTruck +
  //       '/maintenance/list' +
  //       '?sortColumn=' +
  //       field +
  //       '&sortOrder=' +
  //       sort
  //   );
  // }

  // Unit number
  // getUnitNumberList(vehicle) {
  //   return this.http.get(app_endpoint + 'app/maintenance/autocomplete/' + vehicle);
  // }

  // getMaintenanceTypeList() {
  //   return this.http.get(app_endpoint + 'app/enum/maintenance/type/list');
  // }

  // Zip code
  // getZipCodesList(zip) {
  //   return this.http.get(app_endpoint + 'app/zip/autocomplete/' + zip);
  // }

  // Office
  // editOffice(id) {
  //   return this.http.get(app_endpoint + 'app/company/office/detail/' + id);
  // }

  // updateOfficeData(id, data) {
  //   return this.http.put(app_endpoint + 'app/company/office/update/' + id, data).pipe(
  //     tap(() => {
  //       this.editOfficeFactoringSubject.next();
  //     })
  //   );
  // }

  // deleteCompanyOffice(id: number) {
  //   return this.http.delete(app_endpoint + 'app/company/office/delete/' + id).pipe(
  //     tap(() => {
  //       this.editOfficeFactoringSubject.next();
  //     })
  //   );
  // }

  // deleteFactoringCompany(id: number) {
  //   return this.http.post(app_endpoint + 'app/company/factoring/delete/' + id, '').pipe(
  //     tap(() => {
  //       this.editOfficeFactoringSubject.next();
  //     })
  //   );
  // }

  // Factoring
  // editFactoring(id) {
  //   return this.http.get(app_endpoint + 'app/company/factoring/detail/' + id);
  // }

  // updateFactoringData(id, data) {
  //   return this.http.put(app_endpoint + 'app/company/factoring/update/' + id, data).pipe(
  //     tap(() => {
  //       this.editOfficeFactoringSubject.next();
  //     })
  //   );
  // }

  // updateDivisionCompany(id, data) {
  //   return this.http.put(app_endpoint + 'app/company/division/update/' + id, data).pipe(
  //     tap(() => {
  //       this.editOfficeFactoringSubject.next();
  //     })
  //   );
  // }

  // createDivisionCompany(data) {
  //   return this.http.post(app_endpoint + 'app/company/division/create', data).pipe(
  //     tap(() => {
  //       this.editOfficeFactoringSubject.next();
  //     })
  //   );
  // }
  // v2 ////////////////////////////////////////////////////////////////////////

  deleteRepairShop(id) {
    return this.http.delete(environment.API_ENDPOINT + 'repairshop/' + id);
  }

  // Bank
  getBankList() {
    return this.http.get<BankData[]>(
      environment.API_ENDPOINT + `metadata/app/bank/list/1/${environment.perPage}`
    );
  }

  deleteMaintenanceV2(id: any) {
    return this.http.delete(environment.API_ENDPOINT + `maintenance/${id}`);
  }

  // OWNER
  editOwner(id: number) {
    return this.http.get(environment.API_ENDPOINT + `owner/${id}/all`);
  }

  addOwner(ownerData: OwnerData): Observable<OwnerData> {
    return this.http.post<OwnerData>(environment.API_ENDPOINT + 'owner', ownerData).pipe(
      tap((owner: OwnerData) => {
        this.createOwner.next(owner);
      })
    );
  }

  updateOwner(data: any, id: number) {
    return this.http.put(environment.API_ENDPOINT + `owner/${id}`, data).pipe(
      tap(() => {
        this.updateOwnerSubject.next(data);
      })
    );
  }

  deleteOwner(id: number) {
    return this.http.delete(environment.API_ENDPOINT + `owner/` + id);
  }

  getOwners(): Observable<OwnerTabData> {
    return this.http.get<OwnerTabData>(
      environment.API_ENDPOINT + `owner/list/all/1/${environment.perPage}`
    );
  }

  getOwner(id: number): Observable<OwnerData> {
    return this.http.get<OwnerData>(environment.API_ENDPOINT + `owner/${id}/all`);
  }

  pingSsn(ssn) {
    return this.http.get(environment.API_ENDPOINT + `ping/ssn/${ssn}`);
  }

  // Maintenance
  addMaintenanceGlobal(data: any) {
    return this.http.post(environment.API_ENDPOINT + 'maintenance', data).pipe(
      tap(() => {
        if (data.category == 'truck') {
          this.reloadTruckList.next();
        }
        if (data.category == 'trailer') {
          this.reloadTrailerList.next();
        }
      })
    );
  }

  updateMaintennace(id: number, data: any) {
    return this.http.put(environment.API_ENDPOINT + `maintenance/${id}`, data).pipe(
      tap(() => {
        // if (data.category == 'truck') {
        //   this.reloadTruckList.next();
        // }
        // if (data.category == 'trailer') {
        //   this.reloadTrailerList.next();
        // }
        this.editMaintenanceSubject.next(data);
      })
    );
  }

  getMaintenanceList() {
    return this.http.get(
      environment.API_ENDPOINT + `maintenance/list/all/1/${environment.perPage}`
    );
  }

  editMaintennace(id: number) {
    return this.http.get(environment.API_ENDPOINT + `maintenance/${id}/all`);
  }

  addRepairShop(data: any) {
    return this.http.post(environment.API_ENDPOINT + 'repairshop', data).pipe(
      tap(() => {
        this.createRepairShop.next();
      })
    );
  }

  getRepairShop(id: number) {
    return this.http.get(environment.API_ENDPOINT + `repairshop/${id}/all`);
  }

  getRepairShops() {
    return this.http.get(environment.API_ENDPOINT + `repairshop/list/all/1/${environment.perPage}`);
  }

  getRepairShopCommentById(repairShopId: number) {
    return this.http.get(
      environment.API_ENDPOINT +
        `repairshop/rating/reviews/${repairShopId}/1/${environment.perPage}`
    );
  }

  updateRepairShop(data: any, id) {
    return this.http.put(environment.API_ENDPOINT + `repairshop/${id}`, data).pipe(
      tap(() => {
        this.updateRepairShopSubject.next(data);
      })
    );
  }

  pinRepairShop(id: number, data: any) {
    return this.http.put(environment.API_ENDPOINT + `repairshop/pin/${id}`, data);
  }
  /* Comment Api */
  createComment(data: any) {
    return this.http.post(environment.API_ENDPOINT + `comment`, data);
  }

  getCommentList() {
    return this.http.get(environment.API_ENDPOINT + `comment/list/1/${environment.perPage}`);
  }

  updateComment(id: number, data: any) {
    return this.http.put(environment.API_ENDPOINT + `comment/${id}`, data);
  }

  deleteComment(id: number) {
    return this.http.delete(environment.API_ENDPOINT + `comment/${id}`);
  }

  /* Repair Shop Review Api */
  createRepairShopReview(data: any) {
    console.log('Servis za kreiranje komentara');
    console.log(data);
    return this.http.post(environment.API_ENDPOINT + `repairshop/review`, data);
  }


  getRepairShopReview(repairShopReviewId: number) {
    return this.http.get(environment.API_ENDPOINT + `repairshop/review/${repairShopReviewId}`);
  }

  getRepairShopReviewList(repairShopId: number) {
    return this.http.get(environment.API_ENDPOINT + `repairshop/review/list/${repairShopId}/1/100`);
  }

  updateRepairShopReview(data: any, repairShopReviewId: number) {
    return this.http.put(
      environment.API_ENDPOINT + `repairshop/review/${repairShopReviewId}`,
      data
    );
  }

  deleteRepairShopReview(repairShopReviewId: number) {
    return this.http.delete(environment.API_ENDPOINT + `repairshop/review/${repairShopReviewId}`);
  }

  /* RepairShopRatingApi */
  createRepairShopRating(data: any) {
    return this.http.post(environment.API_ENDPOINT + `repairshop/rating/`, data);
  }

  updateRepairShopRating(data: any, id: number) {
    return this.http.put(environment.API_ENDPOINT + `repairshop/rating/${id}`, data);
  }

  getRepairShopRating(repairShopId: number) {
    return this.http.get(
      environment.API_ENDPOINT + `repairshop/rating/list/${repairShopId}/1/${environment.perPage}`,
      {
        headers: this.headers,
      }
    );
  }

  deleteRepairShopRating(id: number) {
    return this.http.delete(environment.API_ENDPOINT + `repairshop/rating/${id}`);
  }
  /* End of RepairShopRatingApi */

  getCompany(id: number) {
    // return this.http.get(environment.API_ENDPOINT + `company/list/all/1/${environment.perPage}`);
    return this.http.get(environment.API_ENDPOINT + `company/${id}/all`);
  }

  updateCompany(data: any, id: number) {
    return this.http.put(environment.API_ENDPOINT + `company/${id}`, data).pipe(
      tap(() => {
        this.editOfficeFactoringSubject.next();
      })
    );
  }

  createCompany(data: any) {
    return this.http.post(environment.API_ENDPOINT + `company`, data).pipe(
      tap(() => {
        this.editOfficeFactoringSubject.next();
      })
    );
  }

  deleteDivisionCompany(id: number) {
    return this.http.delete(environment.API_ENDPOINT + `company/${id}`).pipe(
      tap(() => {
        this.editOfficeFactoringSubject.next();
      })
    );
  }

  getShipperInfo(id: number) {
    return this.http.get(environment.API_ENDPOINT + `shipper/${id}/all`);
  }

  getDriverOwnerData(ein: number): Observable<DriverOwnerData> {
    return this.http.get<DriverOwnerData>(environment.API_ENDPOINT + `ping/taxnumber/${ein}`);
  }
  //////////////////////////////////////////////////////////////////////////////
}
