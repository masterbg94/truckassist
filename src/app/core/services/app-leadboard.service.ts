import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppLeadBoardService {
  public newFuel = new Subject<void>();
  public editAddFuel = new Subject<void>();

  constructor(private http: HttpClient) {}

  get load() {
    return this.newFuel;
  }

  get editedLoad() {
    return this.editAddFuel;
  }
  getLeadBoardList(type: string, critearia: string, period: string) {
    return this.http.get(environment.API_ENDPOINT + `leaderboard/${type}/list/${critearia}?period=${period}`);
  }
}
