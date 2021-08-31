import { Component, OnInit, HostListener } from '@angular/core';
import * as AppConst from './../../const';
// import * as signalR from '@aspnet/signalr';
import { SignalRService } from '../../core/services/app-signalr.service';
import * as signalR from '@microsoft/signalr';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Subscription } from 'rxjs';
import { AppLoadService } from 'src/app/core/services/app-load.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {

  constructor(public signalRService: SignalRService, private http: HttpClient,
              private loadService: AppLoadService
    ) { }

  subscription: Subscription[] = [];
  gridData: any = [];

  dispatchStatuses = AppConst.DISPATCH_BOARD_STATUS;

  public hubConnection: signalR.HubConnection;

  statusOpenedIndex = -1;

  ngOnInit() {
    this.signalRService.startConnection();
    this.signalRService.addBroadcastDBTableDataListener();
    this.signalRService.addBroadcastDbStatusDataListener();
    this.signalRService.addBroadcastDBTableSwitchRowListener();
    this.startHttpRequest();
  }

  // ovo je realan scenario da se incijalno podaci ucitaju kod svakog klijenta iz baze
  private startHttpRequest = () => {
    this.http.get('https://api-test.truckassist.io/api/v2/db/initialdata')
      .subscribe(
        (result: any) => {
          this.signalRService.data = result;
          console.log('startHttpRequest');
          console.log(JSON.stringify(this.signalRService.data));
      });
  }

  // ovo ucitava tabele naizmenicno tj samo jednu i dok se ne promeni status ili ne promeni redosled redova u drugim klijentima je nista ne vidi
  // private startHttpRequest = () => {
  //   this.http.get('https://api-test.truckassist.io/api/v2/signalr/dashboard')
  //   .subscribe(res => {
  //     console.log(res);
  //   })
  // }

  public sendMessage = (event: any, id: any) => {
    console.log('this.signalRService.data ', this.signalRService.data);
    console.log('indexofelement  id ', id);

    // this.signalRService.data[id].statusId = event.id;
    // this.signalRService.data[id].status = event.id;
    // this.signalRService.broadcastDbTableData();
    this.signalRService.broadcastDbStatusData(); // broadcastDbStatusData
    this.statusOpenedIndex = -1;
    console.log('event', event);
    console.log('event id', id);
    console.log('sendMessage > broadcastDbStatusData ', this.signalRService.data);

  }



  onDrop(event: CdkDragDrop<string[]>, type?: string) {
    moveItemInArray(this.signalRService.data, event.previousIndex, event.currentIndex);
    this.signalRService.broadcastDbTableSwitchRow();
  }
  openIndex(indx: number) {
    this.statusOpenedIndex = indx;
  }

  @HostListener('document:click', ['$event'])
  handleKeyboardEvent(event: any) {
    if ( event.target && event.target.className ) {
      if ( typeof event.target.className.includes !== 'undefined' && event.target.parentNode ) {
        if ( !event.target.className.includes('switch_statuses')
            && !event.target.parentNode.className.includes('switch_statuses')) {
          setTimeout(() => {
            this.statusOpenedIndex = -1;
          }, 500);
        }
      }
    }
  }

}
