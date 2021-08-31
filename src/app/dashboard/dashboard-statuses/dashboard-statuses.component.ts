import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-statuses',
  templateUrl: './dashboard-statuses.component.html',
  styleUrls: ['./dashboard-statuses.component.scss']
})
export class DashboardStatusesComponent implements OnInit {

  constructor() { }

  selectedBoard: any = 'all';
  boardList: any = [
    {
      id: 1,
      name: 'All boards',
      board: 'all'
    }
  ];

  selectedPeriod: any = 'all';

  leadboardData: any = [
      {
        id: 40,
        name: 'OFF',
        status: 58,
        statusPercentage: 100.0,
        color: '#202020'
      },
      {
        id: 40,
        status: 58,
        name: 'ACTIVE',
        statusPercentage: 100.0,
        color: '#5AE99D'
      },
      {
        id: 40,
        status: 58,
        name: 'DISPATCHED',
        color: '#497BDC',
        statusPercentage: 100.0,
      },
      {
        id: 40,
        status: 58,
        name: 'CHECKED IN',
        color: '#24C1A1',
        statusPercentage: 100.0
      },
      {
        id: 40,
        status: 58,
        name: 'LOADED',
        color: '#207E4C',
        statusPercentage: 100.0
      },
      {
        id: 40,
        status: 58,
        name: 'REPAIR',
        color: '#AE3232',
        statusPercentage: 100.0
      },
      {
        id: 40,
        status: 58,
        name: 'EMPTY',
        color: '#F99E00',
        statusPercentage: 100.0
      }
  ];



  ngOnInit(): void {
  }

}
