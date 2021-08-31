import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { getFlagOfFilterMiles, getRouteAndMarkerData } from 'src/assets/utils/methods-global';
import * as AppConst from '../const';
import { MilesServiceService } from '../core/services/miles-service.service';
import { SearchDataService } from '../core/services/search-data.service';
import { SharedService } from '../core/services/shared.service';
import { takeUntil } from 'rxjs/operators';
import { SearchFilterEvent } from '../core/model/shared/searchFilter';
import { forkJoin, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TruckassistDateFilterComponent } from '../shared/truckassist-date-filter/truckassist-date-filter.component';
import { DateFilterService } from '../core/services/date-filter.service';
import { MapService } from '../core/services/map.service';

@Component({
  selector: 'app-miles',
  templateUrl: './miles.component.html',
  styleUrls: ['./miles.component.scss'],
})
export class MilesComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  /* Tool Bar Variables */

  /* periodSwitch = {
    data: [
      { name: 'WTD', checked: false, id: 1, inputName: 'date', period: 'wtd' },
      { name: 'MTD', checked: true, id: 2, inputName: 'date', period: 'mtd' },
      { name: 'YTD', checked: false, id: 3, inputName: 'date', period: 'ytd' },
      { name: 'All', checked: false, id: 3, inputName: 'date', period: 'all' },
    ],
  }; */

  @ViewChild(TruckassistDateFilterComponent)
  truckassistDateFilterComponent: TruckassistDateFilterComponent;
  loadingDateFilter = true;

  legendItems = [
    { src: '../../assets/img/svgs/miles/legend/pickup.svg', itemName: 'Pickup' },
    { src: '../../assets/img/svgs/miles/legend/delivery.svg', itemName: 'Delivery' },
    { src: '../../assets/img/svgs/miles/legend/deadhead.svg', itemName: 'Deadhead' },
    { src: '../../assets/img/svgs/miles/legend/fuel.svg', itemName: 'Fuel' },
    { src: '../../assets/img/svgs/miles/legend/repair.svg', itemName: 'Repair' },
    { src: '../../assets/img/svgs/miles/legend/Loaded.svg', itemName: 'Loaded' },
    { src: '../../assets/img/svgs/miles/legend/Empty.svg', itemName: 'Empty' },
  ];
  activeLegend: boolean;
  activeRouteDataItems: boolean;
  highlightingWords = [];
  from = '';
  to = '';
  /* months = [
    {month: 'January'},
    {month: 'February'},
    {month: 'March'},
    {month: 'April'},
    {month: 'May'},
    {month: 'June'},
    {month: 'July'},
    {month: 'August'},
    {month: 'September'},
    {month: 'October'},
    {month: 'November'},
    {month: 'December'},
  ];
  showMonthsDropdown: boolean; */

  /* Lists Variables */
  truckMilesData = [];
  routeDataSelected = -1;
  activeStopDataItems: boolean;
  truckStops = [];
  stopDataSelected = -1;
  stopColors = [
    { color: '#24C1A1', state: 'pickup' },
    { color: '#FF5D5D', state: 'delivery' },
    { color: '#FA873A', state: 'deadhead' },
    { color: '#6C6C6C', state: 'repair' },
    { color: '#5673AA', state: 'fuel' },
  ];

  /* Map Variables*/
  map: any;
  styles = AppConst.GOOGLE_MAP_STYLES;
  mapRestrictions = {
    latLngBounds: AppConst.NORTH_AMERICA_BOUNDS,
    strictBounds: true,
  };
  mapOptions = {
    latitude: 38.3357027,
    longitude: -99.8558299,
  };

  latlng = new google.maps.LatLng(38.3357027, -99.8558299);
  screenOptions = {
    position: 2,
  };
  zoom = 1;
  fullscreenActive: boolean;
  markers: any[] = [];
  requestForRoutes: any[] = [];
  routesArray = [];
  routesBorderArray = [];
  directionsService = new google.maps.DirectionsService();
  delayRequest = 100;

  routeData = [];

  /* END VARIABLES */

  constructor(
    private elementRef: ElementRef,
    private milesService: MilesServiceService,
    private shared: SharedService,
    private searchDateService: SearchDataService,
    private toastr: ToastrService,
    private changeRef: ChangeDetectorRef,
    private dateFilterService: DateFilterService,
    private mapService: MapService
  ) {}

  ngOnInit(): void {
    this.getTruckMilesData('all', -1, -1);
    /* this.setTruckMilesPeriod(this.periodSwitch.data); */

    this.searchDateService.dataSource
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: SearchFilterEvent) => {
        if (event && event.check) {
          this.highlightingWords =
            event.searchFilter && event.searchFilter.chipsFilter
              ? event.searchFilter.chipsFilter.words
              : [];

          this.filterTruckMilesData();
        }
      });

    /* Date Filter  */
    this.dateFilterService.currentDataSource
      .pipe(takeUntil(this.destroy$))
      .subscribe((dateFilter) => {
        console.log('date filter');
        console.log(dateFilter);
      });
  }

  ngAfterViewInit(): void {
    if (this.truckassistDateFilterComponent) {
      this.truckassistDateFilterComponent.reloadDateFilterGroups([]);
      this.loadingDateFilter = false;
      this.changeRef.detectChanges();
    }
  }

  /* Keyboard Shortcut */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: any) {
    const key = event.keyCode;
    if (key === 27) {
      /* Esc */
      if (this.fullscreenActive) {
        this.fullscreenActive = false;
      }
    }
  }

  /* Click Event */
  @HostListener('document:click', ['$event.target'])
  public onClick(target) {
    const clickedInside = this.elementRef.nativeElement.contains(target);

    /* Fokus Out */
    if (!clickedInside) {
      /* Zoom Out Of Map */
      if (this.map.zoom > 5) {
        this.zoom = this.map.zoom;
        const interval = setInterval(() => {
          this.zoom--;
          console.log(this.zoom);
          if (this.zoom <= 5) {
            clearInterval(interval);
          }
        }, 200);
      }
    }
  }

  /* Method For Filtering Truck Miles Data */
  filterTruckMilesData() {
    if (this.highlightingWords.length) {
      this.truckMilesData.filter((dataToFilter) => {
        let flag = false;

        /* Get Flag If Object Has Search Item */
        flag = getFlagOfFilterMiles(flag, dataToFilter, this.highlightingWords);

        if (flag) {
          return this.toggleDataInMilesList(true, dataToFilter);
        } else {
          return this.toggleDataInMilesList(false, dataToFilter);
        }
      });
    } else {
      /* Reset All */
      this.truckMilesData.filter((dataToFilter) => {
        return this.toggleDataInMilesList(true, dataToFilter);
      });
    }
  }

  /* Toggle Truck Miles Data In Tabel  */
  toggleDataInMilesList(show: boolean, dataToFilter: any) {
    dataToFilter.showInList = show;
    return dataToFilter;
  }

  /* Date Switch */
  /* switchDate(switchDateEvent: any) {
    this.setTruckMilesPeriod(switchDateEvent);
  } */

  /* Set Period Form Truck Mailes Data And Call Api */
  /* setTruckMilesPeriod(switchData: any) {
    const optionSelected = switchData.filter((data) => {
      if (data.checked) {
        return data;
      }
    });

    this.getTruckMilesData(optionSelected[0].period, -1, -1);
  } */

  /* Delete Range Picked Date */
  /*  deleteRangeChip(){
    this.from = '';
    this.to = '';
  } */

  /* Open Focus On Truck Miles Data And Get Stops Of Focused Truck */
  onFocusTruckMilesData(index: number) {
    this.routeDataSelected = index;

    /* Check If There Is Focus Truck And The Truck Id */
    if (this.truckMilesData[index] && this.truckMilesData[index].truckId) {
      /* Get Truck Stops */
      this.getStopsByTrucId(this.truckMilesData[index].truckId);
    }
  }

  /* Format Location For Rendering In List */
  getLocaton(location: string) {
    let trigerCount = false;
    let count = 0;
    let formatedLocation = '';
    for (const c of location) {
      if (c === ',') {
        count++;
      }

      if (trigerCount && count < 3) {
        formatedLocation += c;
      }

      if (count === 1) {
        trigerCount = true;
      }
    }
    return formatedLocation;
  }

  /* Open Focus On Stop Data  */
  onFocusStopData(index: number) {
    if (this.markers[index]) {
      this.stopDataSelected = index;
      
      this.markers[index].active = false;
      const interval = setInterval(() => {
        this.markers[index].active = true;
        clearInterval(interval);
      }, 200);
    }
  }

  /* Get Instance Of Map */
  mapReady(event: any) {
    this.map = event;
  }

  /* Full Screen Toggle */
  onFullScreen(isFullscreen: boolean) {
    this.fullscreenActive = isFullscreen;
  }

  /* Zoom Control */
  onZoom(isZoom: boolean) {
    this.zoom = this.map.zoom;
    if (isZoom) {
      this.zoom++;
    } else {
      this.zoom--;
    }
  }

  /* API */
  getTruckMilesData(period?: string, year?: number, month?: number) {
    this.milesService.getMiles('', '', period, year, month).subscribe(
      (truck: any) => {
        this.truckMilesData = [];
        this.truckStops = [];
        this.stopDataSelected = -1;
        this.routeDataSelected = -1;
        this.markers = [];

        console.log('Truck Miles Data Res');
        console.log(truck);

        /* If Route Exists Delete It*/
        this.deleteRoute();

        /* Fill truckMilesData With Response Data */
        for (const t of truck) {
          this.truckMilesData.push({
            emptyMiles: t.emptyMiles.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            gallons: t.gallons.toString(),
            loadedMiles: t.loadedMiles.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            loads: t.loads.toString(),
            miles: t.miles.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            milesPerGallon: t.milesPerGallon ? t.milesPerGallon.toFixed(2).toString() : '',
            stops: t.stops.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            truckId: t.truckId,
            unit: t.unit,
            showInList: true,
          });
        }

        /* Open List Of Truck Miles Data If Data Exist  */
        this.activeRouteDataItems = this.truckMilesData.length ? true : false;
      },
      () => {
        this.shared.handleServerError();
      }
    );
  }

  async getStopsByTrucId(truckId: number) {
    try {
      this.milesService.getMilesStopsByTruckId(truckId).subscribe(
        (stops: any) => {
          this.truckStops = [];
          this.stopDataSelected = -1;

          /* If Route Exists Delete It*/
          this.deleteRoute();

          for (const stop of stops) {
            this.truckStops.push({
              latitude: stop.latitude,
              longitude: stop.longitude,
              loaded: stop.loaded,
              legMiles: stop.legMiles,
              pointState: stop.pointState,
              stopDateTime: stop.stopDateTime,
              stopLocation: stop.stopLocation,
              totalMiles: stop.totalMiles,
              truckloadId: stop.truckloadId,
              stopFormattedLocation: stop.stopLocation ? this.getLocaton(stop.stopLocation) : '',
              color: this.getColorOfStop(stop.pointState),
            });
          }

          this.markers = [];
          this.geocodinStops(0);
          /* Open List Of Truck Stops Data If Data Exist  */
          const interval = setInterval(() => {
            this.activeStopDataItems = this.truckStops.length ? true : false;

            clearInterval(interval);
          }, 200);
        },
        () => {
          this.shared.handleServerError();
        }
      );
    } catch (error) {
      this.shared.handleServerError();
    }
  }

  /* Get Lat And Lng From Address */
  geocodinStops(index: number) {
    if (!this.truckStops[index].latitude && !this.truckStops[index].longitude) {
      const coordinates$ = this.mapService.geocoding(this.truckStops[index].stopLocation);
      forkJoin([coordinates$])
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          ([coordinates]: [any]) => {
            this.truckStops[index].latitude = coordinates.latitude;
            this.truckStops[index].longitude = coordinates.longitude;

            if (index === this.truckStops.length - 1) {
              this.truckStops.filter((stops) => {
                this.setMarkerData(stops);
              });

              console.log('Markers');
              console.log(this.markers);

              this.requestForRoutes = [];
              this.routeData = getRouteAndMarkerData(this.truckStops, false, true).route;
              console.log('route data');
              console.log(this.routeData);
              this.settingRouteUp(this.routeData);
            } else {
              this.geocodinStops(index + 1);
            }
          },
          () => {
            this.shared.handleServerError();
          }
        );
    } else {
      if (index === this.truckStops.length - 1) {
        this.truckStops.filter((stops) => {
          this.setMarkerData(stops);
        });
      }
    }
  }

  /* Set Marker Data */
  setMarkerData(stops: any) {
    this.markers.push({
      lat: stops.latitude,
      lng: stops.longitude,
      color: stops.color,
      colorMarkerCircle: stops.color,
      active: true,
      location: stops.stopFormattedLocation,
    });
  }

  /* Get Stop Color By State */
  getColorOfStop(state: string) {
    let color = '';
    this.stopColors.forEach((stopColor) => {
      if (stopColor.state === state) {
        color = stopColor.color;
      }
    });
    return color;
  }

  /* Setting Up Drowing Route On Map */
  settingRouteUp(place: any) {
    for (let i = 0; i < place.length; i++) {
      this.createRouteRequest(place[i]);
    }

    console.log('request For Routes');
    console.log(this.requestForRoutes);

    this.submitRequest(0);
  }

  /* Create Request For Route */
  createRouteRequest(place: any) {
    const start = new google.maps.LatLng(place.originLatLong.lat, place.originLatLong.lng);
    const end = new google.maps.LatLng(place.destinationLatLong.lat, place.destinationLatLong.lng);
    const newWaypoints = [];

    /* Set Waypoints Of Route */
    for (let j = 0; j < place.waypoints.length; j++) {
      newWaypoints.push({
        location: place.waypoints[j].position,
        stopover: true,
      });
    }

    /* Set Request */
    let request = {};
    if (newWaypoints.length) {
      request = {
        origin: start,
        destination: end,
        waypoints: newWaypoints,
        travelMode: google.maps.TravelMode.DRIVING,
      };
    } else {
      request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING,
      };
    }

    this.requestForRoutes.push({ route: place, request });
  }

  /* Submit Created Request For Route */
  submitRequest(i: number) {
    if (this.requestForRoutes[i]?.request) {
      this.directionsService.route(this.requestForRoutes[i].request, (result, status) => {
        if (status == google.maps.DirectionsStatus.OK) {
          const interval = setInterval(() => {
            this.drawRoute(i, result);
            clearInterval(interval);
          }, this.delayRequest);
        } else {
          if (status == google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
            this.toastr.warning(
              `Over the requests limit in too short a period of time. OVER_QUERY_LIMIT`,
              'Warning:'
            );

            this.delayRequest++;
            const interval = setInterval(() => {
              this.submitRequest(i);
              clearInterval(interval);
            }, 1000);
          } else {
            console.log('poziva se ovaj status');
            this.toastr.warning(`${status}`, 'Warning:');
          }
        }
      });
    }
  }

  /* Set Next Request */
  nextRequest(i: number) {
    i++;
    if (i <= this.requestForRoutes.length - 1) {
      this.submitRequest(i);
    } else {
      this.requestForRoutes = [];
      return;
    }
  }

  /* Draw Route On Map */
  drawRoute(i: number, result) {
    /* Border Of Route */
    this.routesBorderArray[i] = new google.maps.DirectionsRenderer();
    this.routesBorderArray[i].setMap(this.map);
    this.routesBorderArray[i].setOptions({
      preserveViewport: true,
      suppressInfoWindows: false,
      polylineOptions: {
        strokeWeight: 5,
        strokeOpacity: 1,
        strokeColor: '#6C6C6C',
        zIndex: 1,
      },
      markerOptions: {
        visible: false,
      },
    });

    this.routesBorderArray[i].setDirections(result);

    /* Route */
    this.routesArray[i] = new google.maps.DirectionsRenderer();
    this.routesArray[i].setMap(this.map);
    this.routesArray[i].setOptions({
      preserveViewport: true,
      suppressInfoWindows: false,
      polylineOptions: {
        strokeWeight: 3,
        strokeOpacity: 1,
        strokeColor: '#919191',
        zIndex: 2,
      },
      markerOptions: {
        visible: false,
      },
    });

    this.routesArray[i].setDirections(result);

    this.nextRequest(i);
  }

  /* Delete Route */
  deleteRoute() {
    this.requestForRoutes = [];

    if (this.routesArray.length) {
      for (let i = 0; i < this.routesArray.length; i++) {
        this.routesArray[i].setMap(null);
        this.routesBorderArray[i].setMap(null);
      }
    }

    this.routesArray = [];
    this.routesBorderArray = [];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
