import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-status-others',
  templateUrl: './dashboard-status-others.component.html',
  styleUrls: ['./dashboard-status-others.component.scss']
})
export class DashboardStatusOthersComponent implements OnInit {

  constructor() { }

  selectedBoard: any = 'all';
  boardList: any = [
    {
      id: 1,
      name: 'April 2020',
      board: 'all'
    }
  ];

  selectedPeriod: any = 'all';

  pendingStatuses: any = [
      {
        id: 40,
        name: 'BOOKED',
        status: 58,
        statusPercentage: 100.0,
        color: '#959595'
      },
      {
        id: 40,
        status: 58,
        name: 'ASSIGNED',
        statusPercentage: 100.0,
        color: '#202020'
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
        name: 'LOADED',
        color: '#207E4C',
        statusPercentage: 100.0
      }
  ];

  closedStatuses: any = [
    {
      id: 40,
      name: 'CANCELED',
      status: 58,
      statusPercentage: 100.0,
      color: '#AE3232'
    },
    {
      id: 40,
      status: 58,
      name: 'TONU',
      statusPercentage: 100.0,
      color: '#FF5D5D'
    },
    {
      id: 40,
      status: 58,
      name: 'INVOICED',
      color: '#BFB580',
      statusPercentage: 100.0,
    },
    {
      id: 40,
      status: 58,
      name: 'In HOLD / REVISED',
      color: '#B7B7B7',
      statusPercentage: 100.0
    },
    {
      id: 40,
      name: 'PAID',
      status: 58,
      statusPercentage: 100.0,
      color: '#9F9A7B'
    },
    {
      id: 40,
      status: 58,
      name: 'SHORT-PAID',
      statusPercentage: 100.0,
      color: '#807B65'
    },
    {
      id: 40,
      status: 58,
      name: 'UNPAID',
      color: '#65614D',
      statusPercentage: 100.0,
    },
    {
      id: 40,
      status: 58,
      name: 'CLAIM',
      color: '#514E40',
      statusPercentage: 100.0
    }
];


  ngOnInit(): void {
  }

}
