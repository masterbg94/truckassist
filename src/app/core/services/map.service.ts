import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private http: HttpClient) {}

  /* GET Longitude And Latitude(Coordinates) From Address Or Location */
  geocoding(address: string){
    return this.http.get(environment.API_ENDPOINT + `gis/geocode/${address}`);
  } 

  /* GET Address Or Location From Longitude And Latitude(Coordinates) */
  reverseGeocoding(longitude: number, latitude: number){
    return this.http.get(environment.API_ENDPOINT + `gis/revgeo/${longitude}/${latitude}`);
  }  
}
