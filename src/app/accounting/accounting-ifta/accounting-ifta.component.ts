import { IftaTableOptions } from './../models/accounting-table';
import { takeUntil } from 'rxjs/operators';
import { TableData } from './../../shared/truckassist-table/models/truckassist-table';
import { Component, Input, OnInit } from '@angular/core';
import * as AppConst from './../../const';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-accounting-ifta',
  templateUrl: './accounting-ifta.component.html',
  styleUrls: ['./accounting-ifta.component.scss']
})
export class AccountingIftaComponent implements OnInit {
  @Input() options: IftaTableOptions;
  private destroy$: Subject<void> = new Subject<void>();
  mainData: any = {
    usaStates: [
      {
        state: "AL"
      },
      {
        state: "AK"
      },
      {
        state: "AS"
      },
      {
        state: "AZ"
      },
      {
        state: "AR"
      },
      {
        state: "CA"
      },
      {
        state: "CO"
      },
      {
        state: "CT"
      },
      {
        state: "DE"
      },
      {
        state: "DC"
      },
      {
        state: "FM"
      },
      {
        state: "FL"
      },
      {
        state: "GA"
      },
      {
        state: "GU"
      },
      {
        state: "HI"
      },
      {
        state: "ID"
      },
      {
        state: "IL"
      },
      {
        state: "IN"
      },
      {
        state: "IA"
      },
      {
        state: "KS"
      },
      {
        state: "KY"
      },
      {
        state: "LA"
      },
      {
        state: "ME"
      },
      {
        state: "MH"
      },
      {
        state: "MD"
      },
      {
        state: "MA"
      },
      {
        state: "MI"
      },
      {
        state: "MN"
      },
      {
        state: "MS"
      },
      {
        state: "MO"
      },
      {
        state: "MT"
      },
      {
        state: "NE"
      },
      {
        state: "NV"
      },
      {
        state: "NH"
      },
      {
        state: "NJ"
      },
      {
        state: "NM"
      },
      {
        state: "NY"
      },
      {
        state: "NC"
      },
      {
        state: "ND"
      },
      {
        state: "MP"
      },
      {
        state: "OH"
      },
      {
        state: "OK"
      },
      {
        state: "OR"
      },
      {
        state: "PW"
      },
      {
        state: "PA"
      },
      {
        state: "PR"
      },
      {
        state: "RI"
      },
      {
        state: "SC"
      },
      {
        state: "SD"
      },
      {
        state: "TN"
      },
      {
        state: "SD"
      },
      {
        state: "TN"
      },
      {
        state: "TX"
      },
      {
        state: "UT"
      },
      {
        state: "VT"
      },
      {
        state: "VI"
      },
      {
        state: "VA"
      },
      {
        state: "WA"
      },
      {
        state: "WV"
      },
      {
        state: "WI"
      },
      {
        state: "WY"
      }
    ],
    stopsList: [
      {
        type: "start",
        location: "Gary, IN 30055",
        date: 1625659486
      },
      {
        type: "unknown",
        location: "Chicago, IL 65005",
        date: 1625659486,
        leg: 60.6,
        miles: 60.6
      },
      {
        type: "delivery",
        location: "Chicago, IL 65005",
        date: 1625659486,
        leg: 60.6,
        miles: 60.6
      },
      {
        type: "pickup",
        location: "Chicago, IL 65005",
        date: 1625659486,
        leg: 60.6,
        miles: 60.6
      },
      {
        type: "delivery",
        location: "Chicago, IL 65005",
        date: 1625659486,
        leg: 60.6,
        miles: 60.6
      },
      {
        type: "delivery",
        location: "Chicago, IL 65005",
        date: 1625659486,
        leg: 60.6,
        miles: 60.6
      },
      {
        type: "delivery",
        location: "Chicago, IL 65005",
        date: 1625659486,
        leg: 60.6,
        miles: 60.6
      },
      {
        type: "pickup",
        location: "Chicago, IL 65005",
        date: 1625659486,
        leg: 60.6,
        miles: 60.6
      },
      {
        type: "pickup",
        location: "Chicago, IL 65005",
        date: 1625659486,
        leg: 60.6,
        miles: 60.6
      },
      {
        type: "unknown",
        location: "Chicago, IL 65005",
        date: 1625659486,
        leg: 60.6,
        miles: 60.6
      },
      {
        type: "delivery",
        location: "Chicago, IL 65005",
        date: 1625659486,
        leg: 60.6,
        miles: 60.6
      },
      {
        type: "pickup",
        location: "Chicago, IL 65005",
        date: 1625659486,
        leg: 60.6,
        miles: 60.6
      },
      {
        type: "unknown",
        location: "Chicago, IL 65005",
        date: 1625659486,
        leg: 60.6,
        miles: 60.6
      },
      {
        type: "delivery",
        location: "Chicago, IL 65005",
        date: 1625659486,
        leg: 60.6,
        miles: 60.6
      },
      {
        type: "delivery",
        location: "Chicago, IL 65005",
        date: 1625659486,
        leg: 60.6,
        miles: 60.6
      },
      {
        type: "pickup",
        location: "Chicago, IL 65005",
        date: 1625659486,
        leg: 60.6,
        miles: 60.6
      },
      {
        type: "delivery",
        location: "Chicago, IL 65005",
        date: 1625659486,
        leg: 60.6,
        miles: 60.6
      },
      {
        type: "delivery",
        location: "Chicago, IL 65005",
        date: 1625659486,
        leg: 60.6,
        miles: 60.6
      },
      {
        type: "pickup",
        location: "Chicago, IL 65005",
        date: 1625659486,
        leg: 60.6,
        miles: 60.6
      },
      {
        type: "delivery",
        location: "Chicago, IL 65005",
        date: 1625659486,
        leg: 60.6,
        miles: 60.6
      },
      {
        type: "pickup",
        location: "Chicago, IL 65005",
        date: 1625659486,
        leg: 60.6,
        miles: 60.6
      },
      {
        type: "delivery",
        location: "Chicago, IL 65005",
        date: 1625659486,
        leg: 60.6,
        miles: 60.6
      },
      {
        type: "delivery",
        location: "Chicago, IL 65005",
        date: 1625659486,
        leg: 60.6,
        miles: 60.6
      },
      {
        type: "delivery",
        location: "Chicago, IL 65005",
        date: 1625659486,
        leg: 60.6,
        miles: 60.6
      },
      {
        type: "delivery",
        location: "Chicago, IL 65005",
        date: 1625659486,
        leg: 60.6,
        miles: 60.6
      },
      {
        type: "delivery",
        location: "Chicago, IL 65005",
        date: 1625659486,
        leg: 60.6,
        miles: 60.6
      },
      {
        type: "delivery",
        location: "Chicago, IL 65005",
        date: 1625659486,
        leg: 60.6,
        miles: 60.6
      },
      {
        type: "delivery",
        location: "Chicago, IL 65005",
        date: 1625659486,
        leg: 60.6,
        miles: 60.6
      },
      {
        type: "delivery",
        location: "Chicago, IL 65005",
        date: 1625659486,
        leg: 60.6,
        miles: 60.6
      },
      {
        type: "delivery",
        location: "Chicago, IL 65005",
        date: 1625659486,
        leg: 60.6,
        miles: 60.6
      },
      {
        type: "delivery",
        location: "Chicago, IL 65005",
        date: 1625659486,
        leg: 60.6,
        miles: 60.6
      }
    ]
  };

  constructor() { }


  tableData: TableData[] = [
    {
      title: 'IFTA',
      field: 'ifta',
      data: [],
      extended: false,
      hideLength: false,
      gridColumns: [],
      extendedGridColumns: []
    }
  ];

  accountingChecbox = false;
  activeTab: string = "stops";
  isMapActive: boolean = false;
  selectedIndex: number = 1;
  fullscreenActive: boolean;
  agmMap: any;
  mapRestrictions = {
    latLngBounds: AppConst.NORTH_AMERICA_BOUNDS,
    strictBounds: true,
  };
  public styles = AppConst.GOOGLE_MAP_STYLES;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.options.data.pipe(takeUntil(this.destroy$)).subscribe(res =>{
        this.mainData = res;
      })
    });
  }

  setSelectedIndx(indx: number):void{
    this.selectedIndex = indx;
  }

  onFullScreen(isFullScreen: boolean) {
    this.fullscreenActive = isFullScreen;
  }

  public getMapInstance(map) {
    this.agmMap = map;
  }

  public activateTabs(tab: string):void{
    this.activeTab = tab;
    if( tab == 'summary' ){
      this.isMapActive = false;
    }
  }
}
