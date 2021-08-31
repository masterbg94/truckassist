import { Component, OnInit, Input } from '@angular/core';
import { animate, style, transition, trigger, keyframes } from '@angular/animations';
@Component({
  selector: 'app-dashboard-small-tables',
  templateUrl: './dashboard-small-tables.component.html',
  styleUrls: ['./dashboard-small-tables.component.scss'],
  animations: [
    trigger('shrinkItem', [
      transition(':enter', [
        style({ width: 0 }),
        animate('180ms', style({ width: '*' })),
      ]),
      transition(':leave', [
        animate('140ms', style({ width: 0 })),
      ]),
    ]),
  ]
})
export class DashboardSmallTablesComponent implements OnInit {
  @Input() listTitle: string;
  @Input() data: string;
  searchExpanded = false;
  constructor() { }

  toolTipCollors: any = {
    Drivers: '#5673aa',
    Trucks: '#24c1a1',
    Trailers: '#f99e00',
    Owner: '#4cb3f8',
    Shipper: '#6bb550',
    Broker: '#e3c001',
    Shop: '#ff5d5d',
    Account: '#e870b0',
    Contact: '#9b650d'
  };

  ngOnInit(): void {
  }

  public setExpanded(data): void {
    this.searchExpanded = data.changeStyle;
  }

}
