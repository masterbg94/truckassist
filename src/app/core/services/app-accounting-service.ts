import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Comments } from '../model/comment';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AppAccountingService {
  public newDeduction = new Subject<void>();
  public newBonuses = new Subject<void>();
  public newCredites = new Subject<void>();
  constructor(private http: HttpClient) {}

  createDeduction(data) {
    // return this.http.post(environment.API_ENDPOINT + 'comment', comment);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            this.newDeduction.next(data);
            resolve(data);
        }, 1000);
    });
  }

  createBonuses(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            this.newBonuses.next(data);
            resolve(data);
        }, 1000);
    });
  }

  createCredits(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            this.newBonuses.next(data);
            resolve(data);
        }, 1000);
    });
  }
}
