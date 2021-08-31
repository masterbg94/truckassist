import {Component, OnInit} from '@angular/core';

import { Options } from '@angular-slider/ngx-slider';
import * as AppConst from '../../const';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-ta-card',
  templateUrl: './ta-card.component.html',
  styleUrls: ['./ta-card.component.scss'],
  animations: [
    trigger('taCardExpand', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('0.3s ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1 }),
        animate('0.3s ease-in', style({ height: 0, opacity: 0 }))
      ])
    ])
  ]
})
export class TaCardComponent implements OnInit {
  type = 'truck';
  expanded: any[] = [];
  startDate = new Date();
  expireDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 17);
  expireDate1 = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() + 60
  );
  expireDate2 = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() + 150
  );
  sliderOptions: Options = {
    floor: 10,
    ceil: 50,
    disabled: true
  };
  loopRoutes = 6;
  loop = 30;
  arr = Array;
  types: any[] = [
    'load',
    'trailer',
    'repair',
    'customer',
    'customer',
    'truck',
    'load',
    'repair-truck-trailer',
    'load',
    'customer',
    'repair-truck-trailer',
    'load',
    'trailer',
    'driver',
    'repair-truck-trailer',
    'repair',
    'load',
    'load',
    'customer',
    'trailer',
    'driver',
    'driver',
    'truck',
    'repair',
    'driver',
    'driver',
    'repair',
    'load'
  ];
  driverRestrictions = [
    {
      name: 'a',
      description: 'Prosthetic Device'
    },
    {
      name: 'a2',
      description: 'Prosthetic Device'
    },
    {
      name: 'a3',
      description: 'Prosthetic Device'
    },
    {
      name: 'b',
      description: 'Prosthetic Device'
    },
    {
      name: 'd',
      description: 'Prosthetic Device'
    },
    {
      name: 'e1',
      description: 'Prosthetic Device'
    },
    {
      name: 'l4',
      description: 'Prosthetic Device'
    },
    {
      name: 'k',
      description: 'Prosthetic Device'
    }
  ];

  /** AGM inputs  */
  mapRestrictions = {
    latLngBounds: AppConst.NORTH_AMERICA_BOUNDS,
    strictBounds: true
  };
  styles = AppConst.GOOGLE_MAP_STYLES;
  renderOptions = {
    suppressMarkers: true
  };
  origin = {
    address: {
      city: 'Tucker',
      state: 'Georgia',
      address: '3300 Montreal Industrial Way, Tucker, GA 30084, USA',
      country: 'US',
      zipCode: '30084',
      streetName: 'Montreal Industrial Way',
      streetNumber: '3300',
      stateShortName: 'GA'
    },
    id: 1
  };
  destination = {
    address: {
      city: 'Buffalo',
      state: 'New York',
      address: '2375 South Park Ave, Buffalo, NY 14220, USA',
      country: 'US',
      zipCode: '14220',
      streetName: 'South Park Avenue',
      streetNumber: '2375',
      stateShortName: 'NY'
    },
    id: 2
  };
  waypoints = [
    //  {location: { lat: 39.0921167, lng: -94.8559005 }},
    //  {location: { lat: 41.8339037, lng: -87.8720468 }}
  ];
  waypointMarkers = [];
  destinationIcon = '../../../../assets/img/dispatch_marker.svg';
  originIcon = '../../../../assets/img/dispatch_icon_green.svg';

  repairDropdown = [
    'TRK',
    'TRL',
    'MBL',
    'SHP',
    'TOW',
    'PTS',
    'TRE',
    'DRL'
  ];
  truckRepairDropdown = [
    'Transmission oil',
    'Transmission input crankshaft seal supply',
    'Crankshaft seal supply',
    'Door handle driver side',
    'Shop supply',
    'Door handle & window door'
  ];
  truckRepairList = [
    {
      name: 'Transmision oil',
      count: 1,
      price: 1245
    },
    {
      name: 'Transmission input crankshaft seal supply',
      count: 2,
      price: 3450
    },
    {
      name: 'Crankshaft seal supply',
      count: 22,
      price: 20579
    },
    {
      name: 'Door handle driver side',
      count: 2,
      price: 789
    },
    {
      name: 'Shop supply',
      count: 12,
      price: 2548
    },
    {
      name: 'Door handle & window door',
      count: 1,
      price: 3600
    },
    {
      name: 'Transmision oil',
      count: 1,
      price: 1245
    }
  ];

  public dropdownOptions: any = {
    mainActions: [
      {
        title: 'Edit',
        name: 'edit-driver'
      }
    ],
    otherActions: [],
    deleteAction: {
      title: 'Delete',
      name: 'delete-item',
      type: 'driver',
      text: 'Are you sure you want to delete driver?'
    }
  };

  returnRepairPrice() {
    let suma = 0;
    for (let i = 0; i < this.truckRepairList.length; i++) {
      suma += this.truckRepairList[i].price;
    }
    return suma;
  }

  toggleAdditional(index) {
    this.expanded[index] = !this.expanded[index];
  }

  ngOnInit(): void {
    this.types.fill('repair', 0, 4);
    this.types.fill('truck', 4, 8);
    this.types.fill('trailer', 8, 12);
    this.types.fill('driver', 12, 16);
    this.types.fill('repair-truck-trailer', 16, 20);
    this.types.fill('customer', 20, 24);
    this.types.fill('load', 24, 28);
  }
}
