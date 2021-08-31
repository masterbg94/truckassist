import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AppWeatherService {
  public weatherChange = new Subject<void>();
  constructor(private http: HttpClient) {}
  private newApiKey = 'EKLC5X22VX2CHUDGCL6MKY3HT';

  getWeatherInfo(address) {
    return this.http.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${address}?unitGroup=us&key=${this.newApiKey}`);
  }
}
