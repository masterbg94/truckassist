import { Component, OnInit } from '@angular/core';
import * as AppConst from './../../const';
// import * as signalR from '@aspnet/signalr';
import * as signalR from '@microsoft/signalr';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-reportsold',
  templateUrl: './reportsold.component.html',
  styleUrls: ['./reportsold.component.scss'],
})
export class ReportsoldComponent implements OnInit {
  data = {
    message: [
      {
        id: 1,
        truck: 123,
        trailer: 1234,
        driver: 3,
        status: 1000,
        statusId: 1000,
      },
      {
        id: 2,
        truck: 121,
        trailer: 154,
        driver: 4,
        status: 1000,
        statusId: 1000,
      },
    ],
  };

  data2 = {
    message: [
      {
        id: 1,
        truck: 123,
        trailer: 1234,
        driver: 3,
        status: 1000,
        statusId: 1000,
      },
      {
        id: 2,
        truck: 121,
        trailer: 154,
        driver: 4,
        status: 1000,
        statusId: 1000,
      },
    ],
  };

  dispatchStatuses = AppConst.DISPATCH_BOARD_STATUS;

  public hubConnection: signalR.HubConnection;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.startConnection();
    // this.startHttpRequest();
  }

  startConnection = () => {
    Object.defineProperty(WebSocket, 'OPEN', { value: 1 });

    this.hubConnection = new signalR.HubConnectionBuilder()
    	 // .withUrl('http://68.183.127.141:5000/api/v2/test/jsonmsg')
	// .withUrl('https://api-test.truckassist.io/api/v2/ws/jsonmsg')
  .withUrl('https://api-test.truckassist.io/tahub')
  .withAutomaticReconnect()
  // , {
  //     skipNegotiation: true,
  //     transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
  //   })
    .configureLogging(signalR.LogLevel.Information)
    .build();
    this.hubConnection
      .start()
      .then(() => console.log('started'))
      .catch((err) => console.log('Error: ', err));

    this.hubConnection.on('SendMessage', (data) => {
      console.log('RECEIVED MESSAGE');
      console.log(data);
      data.message.map(item => {
        item.statusId = item.status;
        return item;
      });
      this.data = data;
    });

    this.hubConnection.on('messageReceived', (data) => {
      console.log('RECEIVED MESSAGE');
      console.log(data);
      data = JSON.parse(data);
      data.message.map(item => {
        item.statusId = item.status;
        return item;
      });
      this.data2 = data;
    });
  }

  private startHttpRequest = (dataItem?) => {
    let jsonData;

    if (dataItem) {
      jsonData = dataItem;
    } else {
      jsonData = JSON.stringify(this.data);
    }

    const headers = new HttpHeaders()
      // .set('api_key', '12345')
      .set('Content-Type', 'application/json')
       // .set('Access-Control-Allow-Origin', 'http://68.183.127.141:5000');
	    // .set('Access-Control-Allow-Origin', 'https://api-test.truckassist.io/api/v2/ws/jsonmsg');
      .set('Access-Control-Allow-Origin', 'https://api-test.truckassist.io/tahub');
    this.http
        // .post('http://68.183.127.141:5000/api/v2/test/jsonmsg', jsonData, { headers })
	  //  .post('https://api-test.truckassist.io/api/v2/ws/jsonmsg', jsonData, { headers })
    .post('https://api-test.truckassist.io/tahub', jsonData, { headers })
      .subscribe((data: any) => {
        data.message.map(item => {
          item.statusId = item.status;
          return item;
        });
        console.log(data);
        this.data = data;
      });
  }

  addStatus(event: any, id: any) {
    this.data.message.forEach((el) => {
      if (el.id === id) {
        el.statusId = event.id;
        el.status = event.id;
      }
    });
    const data = this.data;
    this.startHttpRequest(JSON.stringify(data));
  }

  public sendMessage(event: any, id: any) {
    this.data2.message.forEach((el) => {
      if (el.id === id) {
        el.statusId = event.id;
        el.status = event.id;
      }
    });
    const data = this.data2;
    this.hubConnection.invoke('NewMessage', JSON.stringify(this.data2))
    .then(() => console.log('send'));
  }
}