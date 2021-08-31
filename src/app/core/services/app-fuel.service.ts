import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppFuelService {
  public newFuel = new Subject<void>();
  public editAddFuel = new Subject<void>();

  constructor(private http: HttpClient) {}

  get load() {
    return this.newFuel;
  }

  get editedLoad() {
    return this.editAddFuel;
  }

  getFuellist() {
    return this.http.get(environment.API_ENDPOINT + `fuel/list/${environment.page}/${environment.perPage}`);
  }

  getFuelById(id) {
    return this.http.get(environment.API_ENDPOINT + `fuel/${id}`);
  }

  editFuelById(data, id) {
    return this.http.put(environment.API_ENDPOINT + `fuel/${id}`, data).pipe(
      tap((fuelData) => {
        this.editAddFuel.next(data);
      })
    );

  }

  deleteFuel(fuel_id: number) {
    return this.http.delete(environment.API_ENDPOINT + `fuel/${fuel_id}`);
  }

  addFuel(data) {
    return this.http.post(environment.API_ENDPOINT + 'fuel', data).pipe(
      tap(() => {
        this.editAddFuel.next();
      })
    );
  }
}
