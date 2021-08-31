import { Component, OnInit, HostListener } from '@angular/core';
import * as AppConst from './../../const';
import { SignalRService } from '../../core/services/app-signalr.service';
import * as signalR from '@microsoft/signalr';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Subscription } from 'rxjs';
import { AppLoadService } from 'src/app/core/services/app-load.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-testgps',
  templateUrl: './testgps.component.html',
  styleUrls: ['./testgps.component.scss'],
})
export class TestgpsComponent implements OnInit {

  subscription: Subscription[] = [];
  gridData: any = [];

  public hubConnection: signalR.HubConnection;

  constructor(public signalRService: SignalRService, private http: HttpClient,
              private loadService: AppLoadService) { }

  ngOnInit() {
    this.signalRService.startConnection();
    this.signalRService.addTransferGpsDataListener();
    this.signalRService.addBroadcastGpsLastDataListener();
    this.startHttpRequest();
  }

  // ovo je ucitavanje podataka iz baze

  // private startHttpRequest = () => {
  //   this.http.get('https://api-test.truckassist.io/api/v2/signalr/gps/last')
  //     .subscribe(
  //       (result: any)  => {
  //         console.log("startGpsHttpRequest result ", result);
  //         this.signalRService.gps = result;
  //         console.log("startGpsHttpRequest this.signalRService.gps ", this.signalRService.gps);
  //     })
  // }

  /* GPS */
  // ucitavanje podataka preko kontrolera
  private startHttpRequest = () => {
    this.http.get(environment.API_ENDPOINT + 'signalr/gps')
      .subscribe(res => {
        console.log(res);
      });
  }



  public gpsLoad = (event: any) => {
    console.log('gpsLoad ', event);
    // this.signalRService.addTransferGpsDataListener();
    this.signalRService.broadcastGpsLastData();

  }
}
