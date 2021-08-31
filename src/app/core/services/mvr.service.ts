import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})

export class MvrService {

  private mvrDriversSubject = new BehaviorSubject<any>(null);

  get mvrDrivers() {
    return this.mvrDriversSubject.asObservable();
  }

  public getMvrDrivers(data: any) {
    this.mvrDriversSubject.next(data);
  }
}
