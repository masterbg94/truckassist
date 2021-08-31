import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-gps-statistic',
  templateUrl: './gps-statistic.component.html',
  styleUrls: ['./gps-statistic.component.scss']
})
export class GpsStatisticComponent implements OnInit {
  @Input() hideCityInfo: boolean;

  /* Gps Variables */
  @Input() isGps: boolean;
  expend: boolean;

  mapPoints: any = [
    {
        Id: 544,
        PointType: 'pickup',
        PointOrder: 1,
        ShipperId: 26,
        ShipperName: 'SHIPER123',
        PointZip: '',
        PointCity: 'New York',
        PointAddress: 'New York, NY, USA',
        PointState: 'NY',
        PointCountry: 'US',
        PointDateTime: '2021-06-14T22:00:00',
        PointMileage: 360,
        PointMileageTotal: 360
    },
    {
        Id: 545,
        PointType: 'delivery',
        PointOrder: 1,
        ShipperId: 47,
        ShipperName: 'LONG ITEM',
        PointZip: '32034',
        PointCity: 'Fernandina Beach',
        PointAddress: '94016 Woodbrier Cir, Fernandina Beach, FL 32034, USA',
        PointState: 'FL',
        PointCountry: 'US',
        PointDateTime: '2021-06-21T22:00:00',
        PointMileage: 150,
        PointMileageTotal: 510
    },
    {
        Id: 546,
        PointType: 'pickup',
        PointOrder: 2,
        ShipperId: 27,
        ShipperName: 'SHIPP456',
        PointZip: '',
        PointCity: 'Chicago',
        PointAddress: 'Chicago, IL, USA',
        PointState: 'IL',
        PointCountry: 'US',
        PointDateTime: '2021-06-15T22:00:00',
        PointMileage: 250,
        PointMileageTotal: 760
    },
    {
        Id: 547,
        PointType: 'delivery',
        PointOrder: 2,
        ShipperId: 55,
        ShipperName: 'STREETSHIPPER',
        PointZip: '',
        PointCity: 'Washington',
        PointAddress: '14th St NW, Washington, DC, USA',
        PointState: 'DC',
        PointCountry: 'US',
        PointDateTime: '2021-06-28T22:00:00',
        PointMileage: 300,
        PointMileageTotal: 1060
    }
  ];

  constructor() { }

  ngOnInit(): void {
    console.log('isGps')
    console.log(this.isGps);
  }

  onExpend(){
    if(this.isGps){
      this.expend = !this.expend
    }
  }
}
