import { takeUntil } from 'rxjs/operators';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { forkJoin, Subject } from 'rxjs';
import * as AppConst from '../const';
import { DriverTabData } from '../core/model/driver';
import { AppDriverService } from '../core/services/app-driver.service';
import { AppTruckService } from '../core/services/app-truck.service';
import { GpsService } from '../core/services/gps.service';
import { SharedService } from '../core/services/shared.service';
import { Options } from 'ng5-slider';
import {
  getGPSLegendData,
  getGpsMarkerData,
  getRouteAndMarkerData,
  getTimeDifference,
  imageMapType,
} from 'src/assets/utils/methods-global';
import { SearchFilterEvent } from '../core/model/shared/searchFilter';
import { SearchDataService } from '../core/services/search-data.service';
import { DateFilter } from '../core/model/date-filter';
import { SignalRService } from '../core/services/app-signalr.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import {
  HistoryGpsDeviceData,
  HistoryLogData,
  HistoryMarkers,
  HistoryStop,
} from '../core/model/gps';
import { TravelMarker, TravelMarkerOptions } from 'travel-marker';
import { DISPATCH_BOARD_STATUS } from '../const';
import { getFlagOfFilter } from './gpsMethods';
import { ToastrService } from 'ngx-toastr';
import { MapService } from '../core/services/map.service';
declare const geoXML3: any;
declare let MarkerClusterer: any;

@Component({
  selector: 'app-gps',
  templateUrl: './gps.component.html',
  styleUrls: ['./gps.component.scss'],
})
export class GpsComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  /* Map Variables */
  styles = AppConst.GOOGLE_MAP_STYLES;
  mapRestrictions = {
    latLngBounds: AppConst.NORTH_AMERICA_BOUNDS,
    strictBounds: true,
  };
  mapOptions = {
    latitude: 38.3357027,
    longitude: -99.8558299,
  };
  zoom = 5;
  fullscreenMode: boolean;
  map: any;
  trafficLayer: any;
  trafficLayerShow: boolean;
  showHistoryLog: boolean;
  historyLogSwitch = {
    data: [
      { name: 'Day', checked: false, id: 1, inputName: 'date' },
      { name: 'Week', checked: false, id: 2, inputName: 'date' },
      { name: 'Custom', checked: true, id: 3, inputName: 'date' },
    ],
  };

  showTruckDropDown = -1;
  showDevicesList: boolean;
  trucks: any[] = [];
  truckSelected = -1;
  focusOnNgSelect = -1;
  truckSearchItems = 0;
  expandListOfAssigned: boolean;
  showUnassignHoverSvg: boolean;
  showDropDownDialog = -1;
  hideDateRangePicker: boolean;
  animateDatePicker: boolean;
  animateRangePicker: boolean;
  hideTruckSelectedNumber: boolean;
  ngSelect: NgSelectComponent;
  rangePickerDate = new Date();
  datePickerDate = new Date();
  startDate = new Date();
  endDate = new Date();
  startDatePrevius = new Date();
  endDatePrevius = new Date();
  showDriverTruckList: boolean;
  driverTabDate: DriverTabData = null;
  trucksPositionOnMap = [];
  callGpsDevice: any;
  historyDataView: any;
  tableData = [];
  notAssignedGpsDevices = [];
  trucksIdleTimes = [];
  trucksStopTimes = [];
  allSelected = false;
  clickedOnPicker: boolean;
  pickerWasSelected: boolean;
  delayRequest = 100;
  agmMap: any;
  tileNeXRad = [];
  allNexrad = [
    { nexrad: 'nexrad-n0q-900913' },
    { nexrad: 'nexrad-n0q-900913-m05m' },
    { nexrad: 'nexrad-n0q-900913-m10m' },
    { nexrad: 'nexrad-n0q-900913-m15m' },
    { nexrad: 'nexrad-n0q-900913-m20m' },
    { nexrad: 'nexrad-n0q-900913-m25m' },
    { nexrad: 'nexrad-n0q-900913-m30m' },
  ];
  showDoppler: boolean;
  dopplerInterval: any;
  highlightingWords = [];
  public dateFilter: DateFilter[] = [];
  public filteredData: Array<any> = [];
  parser: any;
  kmlUrl = 'assets/kml/timezones.kml';
  isTimeZoneActive: boolean;
  markerSelected = -1;
  countOfMarkerCliced: number;
  dontDoFocusOutMarker: boolean;
  clusterStyles = [
    {
      textColor: '#FFA24E',
      url: '../../../assets/img/png/New_GpsCluster.png',
      height: 46,
      width: 46,
    },
    /* {
      height: 0,
      url: '',
      width: 0,
      fontSize: 0,
      class: 'custom-clustericon',
      cssClass: 'custom-clustericon',
      textColor: '#fff0',
      textSize: 0,
    }, */
  ];
  truckDataOfSelected: any;
  countOfSelected = 0;
  countOfGpsDevices = 0;
  countOfLiveTrtucking = 0;
  gpsDevices: any[] = [];
  drivers: any[] = [];
  trucksResponse: any[] = [];
  trucksWithGps: any[] = [];
  canUseHistoryLog: boolean;
  positionsDataHasFilled: boolean;
  doneWithTruckingData: boolean;
  markerClick: boolean;
  isTollRoadActive: boolean;
  tollRoads: any = [];
  isTollRoadsActive: boolean;
  tollRoadsKml = [
    { state: 'assets/kml/toll-roads/florida.kml' },
    { state: 'assets/kml/toll-roads/Texas.kml' },
    { state: 'assets/kml/toll-roads/California.kml' },
  ];
  sortedByDriver: boolean;
  driverSortCliced: boolean;
  sortedByHardware: boolean;
  hardwareSortCliced: boolean;
  sortedByTruck: boolean;
  truckSortCliced: boolean;
  finishedDivecesTruckDriverList: boolean;
  fillDataCompleted: boolean;
  countTruckSorted = 0;
  countDriverSorted = 0;
  countHardwareSorted = 0;
  pathOfMarker: any;
  markerPlayed: boolean;
  indexLocationOne = 0;
  indexLocationtwo = 1;
  locationBCords = [];
  zoomOnMarkerInterval;
  legendData = getGPSLegendData();
  showGpsLegend: boolean;
  listExtendet: boolean;
  showUnassignOption: boolean;
  hoverSvgUnassign: boolean;
  deleteDialogOpened = -1;
  dispatchStatuses = DISPATCH_BOARD_STATUS;
  gpsMode = 2;
  drivingPercentage = 0;
  shortStopPercentage = 0;
  extendedStopPercentage = 0;
  parkingPercentage = 0;
  playerTimeLineData = [];
  showDropSelect: boolean;
  gpsLegendInterval: any;
  removeGpsLegend: boolean;

  /* Table */
  mouseOver = -1;
  halfAnHour = 1800000;
  twelveHours = 43200000;
  countSpeedSort = 0;
  sortedBySpeed: boolean;
  scrollItemInFilter = 0;
  activeTrucks = [];
  inactiveTrucks = [];

  /* Truck Route Variables */
  activeDirection = -1;
  truckRouteOptions = {
    suppressMarkers: true,
    polylineOptions: {
      strokeColor: '#28529F',
    },
  };
  truckRouteMarkerOptions = {
    origin: {
      icon: '../../assets/img/svgs/GPS/gps-startPoint.svg',
    },
    destination: {
      icon: '../../assets/img/svgs/GPS/gps-endPoint.svg',
    },
  };
  truckLocation: string;
  truckDestination: string;

  /* Custom Cluster Variables */
  clusterDropdownData = [];
  clusterLocation = {
    lat: undefined,
    long: undefined,
  };
  isClusterDropDownOpened: boolean;
  clusters: any;
  countTrailerSort = 0;
  sortedByTrailer: boolean;
  countStatusSort = 0;
  sortedByStatus: boolean;
  hasUpdate: boolean;

  /* HISTORY LOG VARIABLES */

  /* Stop List */
  historyStops: HistoryStop[];
  historyLogData: HistoryLogData;
  showStopListDropdown: boolean;

  /* Map Variables */
  frames: any[] = [];
  requestForRoutes = [];
  routesArray = [];
  routesBorderArray = [];
  marker: any;
  directionsService = new google.maps.DirectionsService();
  historyRouteOnMap = [];
  historyRouteData: HistoryGpsDeviceData[];
  historyMarkers: HistoryMarkers[] = [];
  courseForMarkerIcon: string;

  /* Player */
  slideInit = 0;
  options: Options = {
    floor: 0,
    ceil: 1,
    animate: true,
    step: 0.0000001,
    showSelectionBar: true,
    hideLimitLabels: true,
  };
  playInterval: any;

  constructor(
    private toastr: ToastrService,
    private gpsServise: GpsService,
    private truckService: AppTruckService,
    private shared: SharedService,
    private elementRef: ElementRef,
    private searchDateService: SearchDataService,
    public signalRService: SignalRService,
    private http: HttpClient,
    private mapService: MapService,
    @Inject(ChangeDetectorRef) private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.startSignalRConnetction();
    this.getTrucks();

    /* Search Filter */
    this.searchDateService.dataSource
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: SearchFilterEvent) => {
        if (event && event.check) {
          this.highlightingWords =
            event.searchFilter && event.searchFilter.chipsFilter
              ? event.searchFilter.chipsFilter.words
              : [];

          this.filterTableData();
        }
      });

    /* GPS SignalR */
    this.signalRService.currentGpsData.pipe(takeUntil(this.destroy$)).subscribe((gpsData: any) => {
      /* Create Gps Data For Tabel And Map */
      if (!this.trucksPositionOnMap.length && !this.showHistoryLog && gpsData) {
        const gpsDataLocal = JSON.parse(localStorage.getItem('gpsData'));

        console.log('gpsData');
        console.log(gpsData);
        /* Set Table And Not Assigned List Data */
        for (const data of gpsData) {
          if (data.truckId) {
            this.setTableData(data, gpsDataLocal);
            /* If Trucks Exist, Finde The Those In Table */
            this.setNgSelectData(data.truckId, true);
          } else {
            this.setNotAssignedList(data);
          }
        }

        /* For Scroll Filter Action */
        this.scrollItemInFilter = this.tableData.length;

        /* Set Tabel Data In Local Storage */
        localStorage.setItem('gpsBeforeSorting', JSON.stringify({ data: this.tableData }));

        this.countOfGpsDevices = gpsData.length;

        /* Set Map Data */
        this.setMapData(gpsData, this.trucksPositionOnMap);

        /* Check Witch Map Data To Show On Map And Get Count Of Selected */
        this.countOfSelected = this.checkIfToShowDataOnMap();

        this.canUseHistoryLog = true;

        /* Create Cluster */
        const interval = setInterval(() => {
          this.createCustomCluster();
          clearInterval(interval);
        }, 200);
      }

      /* Update Gps Data For Tabel And Map */
      if (this.trucksPositionOnMap.length && !this.showHistoryLog && gpsData) {
        this.checkForNewGpsData(gpsData);
      }
    });
  }

  /* Keyboard Events */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: any) {
    const key = event.keyCode;
    if (key === 27) {
      /* Esc */
      if (this.fullscreenMode) {
        this.fullscreenMode = false;
      }
    }
  }

  /* Click Events */
  @HostListener('document:click', ['$event.target'])
  onClick(target) {
    const clickedInside = this.elementRef.nativeElement.contains(target);

    if (!clickedInside) {
      this.animateDatePicker = false;
    } else {
      if (!this.clickedOnPicker) {
        this.animateDatePicker = false;
      }
    }
    this.clickedOnPicker = false;

    if (!this.markerClick) {
      this.markerSelected = -1;
      this.countOfMarkerCliced = 0;
    }

    this.markerClick = false;
  }

  /* LIVE TRUCKING */

  /* Filter Table Data */
  filterTableData() {
    if (this.highlightingWords.length) {
      this.scrollItemInFilter = 0;
      this.tableData.filter((liveData) => {
        let flag = false;

        flag = getFlagOfFilter(flag, liveData, this.highlightingWords);

        if (flag) {
          this.scrollItemInFilter++;
          return this.toggleDataInTabel(true, liveData);
        } else {
          return this.toggleDataInTabel(false, liveData);
        }
      });
    } else {
      this.tableData.filter((liveData) => {
        return this.toggleDataInTabel(true, liveData);
      });
      this.scrollItemInFilter = this.tableData.length;
    }

    /* Set Filter On Map Data */
    this.trucksPositionOnMap.forEach((mapData) => {
      this.tableData.forEach((table) => {
        if (mapData.hardwareID === table.hardwareID && table.isSelected) {
          mapData.showOnMap = table.show;
        }
      });
    });
  }

  /* Toggle Live Data In Tabel  */
  toggleDataInTabel(show: boolean, liveData: any) {
    liveData.show = show;
    return liveData;
  }

  /* Get Truck List */
  getTrucks() {
    const trucks$ = this.truckService.getTruckList();
    forkJoin([trucks$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ([trucks]: [any]) => {
          /* All Active Trucks */
          trucks.activeTrucks.forEach((truck) => {
            this.trucks.push({
              deviceId: truck.deviceId,
              id: truck.id,
              truckNumber: truck.truckNumber,
              isInTable: false,
              isActive: true,
            });

            this.activeTrucks.push({
              deviceId: truck.deviceId,
              id: truck.id,
              truckNumber: truck.truckNumber,
              isActive: true,
            });
          });

          /* All Inactive Trucks */
          trucks.inactiveTrucks.forEach((truck) => {
            this.trucks.push({
              deviceId: truck.deviceId,
              id: truck.id,
              truckNumber: truck.truckNumber,
              isInTable: false,
              isActive: false,
            });

            this.inactiveTrucks.push({
              deviceId: truck.deviceId,
              id: truck.id,
              truckNumber: truck.truckNumber,
              isActive: false,
            });
          });
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  /* Set Map Data */
  setMapData(gpsRespons: any, fillData: any[]) {
    for (let i = 0; i < gpsRespons.length; i++) {
      fillData.push(this.getMapData(gpsRespons, i, true));
    }

    this.countOfLiveTrtucking = fillData.length;
  }

  /* Get Map Data From Gps Response */
  getMapData(gpsRespons: any, i: number, isFirstData?: boolean) {
    const mapMarkerData = getGpsMarkerData(gpsRespons[i], gpsRespons[i].truckId);
    let animationStarted: boolean;

    if (
      !isFirstData &&
      gpsRespons.latitude !== this.trucksPositionOnMap[i].lat &&
      gpsRespons.longitude !== this.trucksPositionOnMap[i].long &&
      mapMarkerData.marker
    ) {
      this.animateMarker(mapMarkerData.marker, this.trucksPositionOnMap[i], gpsRespons[i]);
      animationStarted = true;
    }

    return {
      lat: gpsRespons[i].latitude,
      long: gpsRespons[i].longitude,
      speed: mapMarkerData.speed,
      vehicleStatus: mapMarkerData.statusOfVehicle,
      statusTime: getTimeDifference(gpsRespons[i], true),
      statusDays: getTimeDifference(gpsRespons[i], false),
      course: gpsRespons[i].course,
      eventDateTime: gpsRespons[i].eventDateTime,
      hardwareID: gpsRespons[i].uniqueId,
      marker: mapMarkerData.marker ? mapMarkerData.marker : '',
      clusterMurker: mapMarkerData.clusterMurker,
      dms: this.convertDMS(gpsRespons[i].latitude, gpsRespons[i].longitude),
      driverName: gpsRespons[i].driverFullName !== ' ' ? gpsRespons[i].driverFullName : 'No Driver',
      distance: gpsRespons[i].distance,
      totalDistance: gpsRespons[i].totalDistance,
      altitude: gpsRespons[i].altitude,
      truckId: gpsRespons[i].truckId ? gpsRespons[i].truckId : undefined,
      truckNumber: gpsRespons[i].truckNumber ? gpsRespons[i].truckNumber : 'No Data',
      truckLoadNumber: gpsRespons[i].truckloadId ? gpsRespons[i].truckloadId : 'No Data',
      trailerNumber: gpsRespons[i].trailerNumber ? gpsRespons[i].trailerNumber : 'No Data',
      fullAddress: gpsRespons[i].location ? gpsRespons[i].location : '',
      placeAddress: gpsRespons[i].location ? this.convertAddress(gpsRespons[i].location) : '',
      fullLocation: gpsRespons[i].location ? gpsRespons[i].location : '',
      location: gpsRespons[i].location ? this.getLocaton(gpsRespons[i].location) : '',
      dispatchBoardStatus: gpsRespons[i].dispatchBoardStatus
        ? gpsRespons[i].dispatchBoardStatus
        : '',
      boardStatusColor: this.getDispatchBoardStatusColor(gpsRespons[i].dispatchBoardStatus),
      showOnMap: !animationStarted,
      ignition: gpsRespons[i].ignition,
      animation: '',
      motion: gpsRespons[i].motion,
      shortStop: gpsRespons[i].shortStop,
      parking: gpsRespons[i].parking,
      extendedStop: gpsRespons[i].extendedStop,
      driverNameColor: mapMarkerData.driverNameColor,
      showToolTip: this.trucksPositionOnMap[i] ? this.trucksPositionOnMap[i].showToolTip : true,
      isNew: false,
    };
  }

  /* Set Tabel Data Method */
  setTableData(gpsSignalRData: any, localStorageData: any) {
    const tableMarkerData = getGpsMarkerData(gpsSignalRData, gpsSignalRData.truckId);

    const dataInLocalStorage =
      localStorageData && localStorageData.data
        ? localStorageData.data.find((data) => data.hardwareID === gpsSignalRData.uniqueId)
        : undefined;

    this.tableData.push({
      id: gpsSignalRData.id,
      driverName:
        gpsSignalRData &&
        gpsSignalRData.driverFullName &&
        gpsSignalRData.driverFullName !== '' &&
        gpsSignalRData.driverFullName !== ' '
          ? gpsSignalRData.driverFullName
          : 'No Driver',
      hardwareID: gpsSignalRData.uniqueId,
      deviceId: gpsSignalRData.deviceId,
      truckNumber: gpsSignalRData.truckNumber ? gpsSignalRData.truckNumber : null,
      truckId: gpsSignalRData.truckId ? gpsSignalRData.truckId : null,
      isSelected:
        dataInLocalStorage && dataInLocalStorage.isSelected ? dataInLocalStorage.isSelected : false,
      dispatchBoardStatus:
        gpsSignalRData && gpsSignalRData.dispatchBoardStatus
          ? gpsSignalRData.dispatchBoardStatus
          : 'No Data',
      location:
        gpsSignalRData && gpsSignalRData.location
          ? this.getLocaton(gpsSignalRData.location)
          : 'No Location',
      destination: 'No Destination',
      boardStatusColor: this.getDispatchBoardStatusColor(gpsSignalRData.dispatchBoardStatus),
      speed: tableMarkerData.speed,
      course: gpsSignalRData.course,
      marker: tableMarkerData.marker,
      trailerNumber:
        gpsSignalRData && gpsSignalRData.trailerNumber ? gpsSignalRData.trailerNumber : 'No Data',
      show: true,
      time: getTimeDifference(gpsSignalRData, true),
      timeDay: getTimeDifference(gpsSignalRData, false),
    });
  }

  /* Update Tabel */
  updateTable(mapData: any) {
    const localStorageData = JSON.parse(localStorage.getItem('gpsData'));
    const dataInLocalStorage =
      localStorageData && localStorageData.data
        ? localStorageData.data.find((data) => data.hardwareID === mapData.hardwareID)
        : undefined;

    this.tableData = this.tableData.map((data) => {
      if (data.hardwareID === mapData.hardwareID) {
        data.boardStatusColor = mapData.boardStatusColor;
        data.dispatchBoardStatus = mapData.dispatchBoardStatus;
        data.location = mapData.location;
        data.marker = mapData.marker;
        data.truckNumber = mapData.truckNumber;
        data.trailerNumber = mapData.trailerNumber;
        data.driverName = mapData.driverName;
        data.speed = mapData.speed;
        data.course = mapData.course;
        data.time = mapData.statusTime;
        data.timeDay = mapData.statusDays;
        data.isSelected =
          dataInLocalStorage && dataInLocalStorage.isSelected
            ? dataInLocalStorage.isSelected
            : false;
      }

      return data;
    });

    localStorage.setItem('gpsData', JSON.stringify({ data: this.tableData }));
    localStorage.setItem('gpsBeforeSorting', JSON.stringify({ data: this.tableData }));
  }

  /* Set Not Assigned Devices In List */
  setNotAssignedList(gpsData: any) {
    this.notAssignedGpsDevices.push({
      uniqueId: gpsData.uniqueId,
      id: gpsData.id,
      deviceId: gpsData.deviceId,
    });
  }

  /* Format Location For Table */
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

  /* Fromat Address For Marker Drop Down */
  convertAddress(address: string) {
    let count = 0;
    let street = '';
    let state = '';
    let zip = '';
    let country = '';
    for (const c of address) {
      if (c === ',') {
        count++;
      }
      if (c !== ',' && count === 0) {
        street += c;
      } else if (c !== ',' && count === 1) {
        state += c;
      } else if (c !== ',' && count === 2) {
        zip += c;
      } else if (c !== ',' && count === 3) {
        country += c;
      }
    }
    return {
      street,
      state,
      zip,
      country,
    };
  }

  getDispatchBoardStatusColor(status: string) {
    const bordStatus = this.dispatchStatuses.filter((s) => {
      if (status) {
        if (s.name.toLowerCase() === status.toLowerCase()) {
          return s.color;
        }
      }
    });

    return bordStatus.length ? bordStatus[0].color : '';
  }

  /* Animate Marker Moving On Live Trucking*/
  animateMarker(markerIcon?: string, oldMarkerData?: any, newMarkerData?: any) {
    const svgMarker = {
      url: markerIcon,
      scaledSize: new google.maps.Size(26, 26),
    };

    const marker = new google.maps.Marker({
      position: { lat: oldMarkerData.lat, lng: oldMarkerData.long },
      map: this.map,
      icon: svgMarker,
    });

    const newMarkerPosition = new google.maps.Marker({
      position: { lat: newMarkerData.latitude, lng: newMarkerData.longitude },
    });

    const lat = oldMarkerData.lat;
    const lng = oldMarkerData.long;
    const deltalat = (newMarkerData.latitude - lat) / 100;
    const deltalng = (newMarkerData.longitude - lng) / 100;
    const delay = 10 * 0.5;
    let animationComplete: boolean;
    for (let i = 0; i < 100; i++) {
      setTimeout(() => {
        let lat = marker.getPosition().lat();
        let lng = marker.getPosition().lng();
        lat += deltalat;
        lng += deltalng;
        const latlng = new google.maps.LatLng(lat, lng);
        marker.setPosition(latlng);
        if (lat.toFixed(7) === newMarkerPosition.getPosition().lat().toFixed(7)) {
          marker.setMap(null);
          animationComplete = true;
          for (let i = 0; i < this.trucksPositionOnMap.length; i++) {
            if (this.trucksPositionOnMap[i].hardwareID === oldMarkerData.hardwareID) {
              this.trucksPositionOnMap[i].showOnMap = true;
            }
          }
        }
      }, delay * i);
    }
  }

  /* Main Call Method For Converting Long And Lat To DMS*/
  convertDMS(lat, lng) {
    const latitude = this.toDegreesMinutesAndSeconds(lat);
    const latitudeCardinal = lat >= 0 ? 'N' : 'S';

    const longitude = this.toDegreesMinutesAndSeconds(lng);
    const longitudeCardinal = lng >= 0 ? 'E' : 'W';

    return latitude + ' ' + latitudeCardinal + '\n' + longitude + ' ' + longitudeCardinal;
  }

  /* Convert Long And Lat To DMS */
  toDegreesMinutesAndSeconds(coordinate) {
    const absolute = Math.abs(coordinate);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = Math.floor((minutesNotTruncated - minutes) * 60);
    return `${degrees}° ${minutes}' ${seconds}"`;
  }

  /* Checkbox Actions */
  /* All */
  onAllSelect(action: string) {
    if (action === 'Select') {
      for (let i = 0; i < this.tableData.length; i++) {
        this.tableData[i].isSelected = true;
        this.showOnMap(this.tableData[i]);
      }
      this.allSelected = true;
      this.countOfSelected = this.tableData.length;
    } else {
      for (let i = 0; i < this.tableData.length; i++) {
        this.tableData[i].isSelected = false;
        this.showOnMap(this.tableData[i]);
      }
      this.allSelected = false;
      this.countOfSelected = 0;
    }

    localStorage.setItem('gpsData', JSON.stringify({ data: this.tableData }));
    localStorage.setItem('gpsBeforeSorting', JSON.stringify({ data: this.tableData }));

    /* Update Clusters */
    const interval = setInterval(() => {
      this.createCustomCluster();
      clearInterval(interval);
    }, 200);
  }

  /* Specified Device */
  selectDevices(data) {
    data.isSelected = !data.isSelected;
    this.showOnMap(data);

    localStorage.setItem('gpsData', JSON.stringify({ data: this.tableData }));
    localStorage.setItem('gpsBeforeSorting', JSON.stringify({ data: this.tableData }));

    let countOfSelected = 0;
    for (const data of this.tableData) {
      if (data.isSelected) {
        countOfSelected++;
      }
    }

    this.countOfSelected = countOfSelected;

    this.allSelected = this.tableData.length === countOfSelected ? true : false;

    /* Update Clusters */
    const interval = setInterval(() => {
      this.createCustomCluster();
      clearInterval(interval);
    }, 200);
  }

  /* Show Unassign Option */
  onUnassignMode(showUnassign: boolean, hoverSvgActive: boolean) {
    this.showUnassignOption = showUnassign;
    this.hoverSvgUnassign = hoverSvgActive;
  }

  /* Expend Tabel */
  onExpendTabel() {
    this.listExtendet = !this.listExtendet;
  }

  /* Set Destinatoin Route On Map For Selected Truck */
  setDirection(gpsData: any, index: number) {
    if (this.activeDirection !== index) {
      /* Get Truck Data */
      const truckData = this.trucksPositionOnMap.filter((truck) => {
        if (truck.hardwareID === gpsData.hardwareID) {
          return truck;
        }
      });

      /* Set Direction Rout On Map */
      if (truckData[0].fullAddress !== 'No Location') {
        this.truckLocation = truckData[0].fullAddress;
        this.truckDestination = 'Los Angeles, CA, USA';
        this.truckRouteOptions.polylineOptions.strokeColor = truckData[0].driverNameColor;

        /* Set Focus In Table */
        this.activeDirection = index;
      }
    } else {
      /* Remove Focus In Table And Route */
      this.activeDirection = -1;
      this.truckLocation = undefined;
      this.truckDestination = undefined;
    }
  }

  /* For Unassign Gps Device Dialog */
  toggleDeleteDialog(popover: any, data: any) {
    this.togglePopover(popover, data);
  }

  /* For Statisitc DropDown */
  toggleStatisticStops(popover: any) {
    this.togglePopover(popover, {});
  }

  /* Toggle Popover Method */
  togglePopover(popover: any, data: any) {
    if (popover.isOpen()) {
      popover.close();
    } else {
      popover.open({ data });
    }
  }

  checkForNewGpsData(gpsData: any) {
    for (let i = 0; i < gpsData.length; i++) {
      if (
        (gpsData[i].latitude !== this.trucksPositionOnMap[i]?.lat ||
          gpsData[i].longitude !== this.trucksPositionOnMap[i]?.long ||
          gpsData[i].motion !== this.trucksPositionOnMap[i].motion ||
          this.trucksPositionOnMap[i].isNew ||
          this.trucksPositionOnMap[i].truckId === -1) &&
        this.trucksPositionOnMap[i].showOnMap
      ) {
        this.trucksPositionOnMap[i] = this.getMapData(gpsData, i, false);
        this.updateTable(this.trucksPositionOnMap[i]);
        this.hasUpdate = true;
      }
    }

    /* Update Clusters And More */
    if (this.hasUpdate) {
      this.hasUpdate = false;
      this.countOfSelected = this.checkIfToShowDataOnMap();

      /* Update Clusters */

      const interval = setInterval(() => {
        this.createCustomCluster();
        clearInterval(interval);
      }, 200);
    }
  }

  /* Assign Hardware From Truck */
  onAssign(gpsData: any) {
    /* Update Backend */
    this.updateGpsDevice(true, gpsData);
    this.onCancleSelectedTruck();
  }

  /* Unassign Hardware From Truck */
  onUnassign(dataToUnassign?: any) {
    this.deleteDialogOpened = -1;

    if (this.countOfSelected) {
      this.countOfSelected--;
    }

    /* Update Backend */
    if (dataToUnassign) {
      this.updateGpsDevice(false, dataToUnassign);
    }

    /* Remove Gps Device From Assigned Devices List */
    for (let i = 0; i < this.tableData.length; i++) {
      if (dataToUnassign.truckId === this.tableData[i].truckId) {
        this.setNgSelectData(this.tableData[i].truckId, false);
        this.tableData.splice(i, 1);
      }
    }

    /* Add Gps Device To Not Assigned Devices List */
    this.notAssignedGpsDevices.push({
      uniqueId: dataToUnassign.hardwareID,
      id: dataToUnassign.id,
      deviceId: dataToUnassign.deviceId,
    });

    this.markerChange(dataToUnassign.hardwareID, false);

    localStorage.setItem('gpsData', JSON.stringify({ data: this.tableData }));
    localStorage.setItem('gpsBeforeSorting', JSON.stringify({ data: this.tableData }));
    this.onCancleSelectedTruck();

    /* Update Cluster */
    const interval = setInterval(() => {
      this.createCustomCluster();
      clearInterval(interval);
    }, 200);
  }

  setNgSelectData(truckId: number, remuve: boolean) {
    if (remuve) {
      let arrayOfIndex = [];
      if (this.trucks.length) {
        this.trucks.forEach((truck, index) => {
          if (truck.id === truckId) {
            arrayOfIndex.push(index);
          }
        });
      }

      arrayOfIndex.filter((index) => {
        this.trucks.splice(index, 1);
      });
    } else {
      let data: any;
      this.activeTrucks.forEach((t) => {
        if (truckId === t.id) {
          data = t;
        }
      });

      if (!data) {
        this.inactiveTrucks.forEach((t) => {
          if (truckId === t.id) {
            data = t;
          }
        });
      }

      this.trucks.push({
        deviceId: data.deviceId,
        id: data.id,
        truckNumber: data.truckNumber,
        isInTable: false,
        isActive: data.isActive,
      });
    }
  }

  /* Selected Truck In Drop Down */
  selectTruck(event, index: number) {
    this.truckDataOfSelected = event;
    this.truckSelected = index;
    this.hideTruckSelectedNumber = false;
  }

  /* For Drop Down Search  */
  onSearch(event: any) {
    this.truckSearchItems = event.items.length;
    if (event.term !== '') {
      this.hideTruckSelectedNumber = true;
    } else {
      this.hideTruckSelectedNumber = false;
    }
  }

  /* For Close NgSelect Drop Or Focus On NgSelect  */
  onClose() {
    if (this.hideTruckSelectedNumber) {
      /*  this.focusOnNgSelect = -1; */
      this.truckSelected = -1;
      this.hideTruckSelectedNumber = false;
    }
    if (this.truckSelected === -1) {
      /*  this.focusOnNgSelect = -1; */
      this.hideTruckSelectedNumber = false;
    }
    this.truckSearchItems = 0;
  }

  /* For Cancle Selected Truck */
  onCancleSelectedTruck() {
    this.truckSelected = -1;
    this.focusOnNgSelect = -1;
    this.showTruckDropDown = -1;
    this.hideTruckSelectedNumber = false;
    this.truckDataOfSelected = {};
  }

  /* Focus On NgSelect */
  onFocusNgSelect(index: number) {
    if (this.focusOnNgSelect === index) {
      this.focusOnNgSelect = -1;
    } else {
      this.focusOnNgSelect = index;
    }
  }

  /* When The Device Is Added Or Removed From The Truck, Change The Marker */
  markerChange(hardwareID: any, isAssigned?: boolean, truckData?: any) {
    let marker = '';
    this.trucksPositionOnMap.forEach((truck) => {
      if (truck.hardwareID === hardwareID) {
        if (isAssigned) {
          truck.truckId = truckData.id;
          truck.truckNumber = truckData.truckNumber;
          const interval = setInterval(() => {
            truck.lat -= 1;
            clearInterval(interval);
          }, 1000);
        } else {
          marker = getGpsMarkerData(truck, isAssigned).marker;
          truck.marker = marker;
          truck.truckNumber = 'No Data';
          truck.trailerNumber = 'No Data';
          truck.showOnMap = true;
        }
      }
    });
  }

  /* Unassign or Assign Gps Device */
  updateGpsDevice(assign: boolean, data: any) {
    if (assign) {
      this.callApiUpdateGpsDevice(data.id, this.truckDataOfSelected.id, data);
    } else {
      this.callApiUpdateGpsDevice(data.id, 0);
    }
  }

  /* Update GpsDevice On Backend */
  callApiUpdateGpsDevice(deviceId: number, truckId: number, data?: any) {
    const date = new Date();
    this.gpsServise
      .updateGpsDevice(deviceId, {
        truckId,
        fromDate: date,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (gpsDevice: any) => {
          if (data) {
            /* Remove Gps Device From Not Assigned Devices List */
            for (let i = 0; i < this.notAssignedGpsDevices.length; i++) {
              if (data.id === this.notAssignedGpsDevices[i].id) {
                this.notAssignedGpsDevices.splice(i, 1);
              }
            }

            /* Set New Item In Table */
            this.tableData.push({
              id: gpsDevice.id,
              driverName: 'No Driver',
              hardwareID: data.uniqueId,
              deviceId: gpsDevice.deviceId,
              truckNumber: null,
              truckId: gpsDevice.truckId,
              isSelected: true,
              dispatchBoardStatus: '',
              location: '',
              destination: '',
              boardStatusColor: '',
              speed: '',
              course: '',
              marker: '',
              trailerNumber: '',
              show: true,
              time: 0,
              timeDay: 0,
            });

            this.countOfSelected++;

            this.onCancleSelectedTruck();

            /* Update Local Storage */
            localStorage.setItem('gpsData', JSON.stringify({ data: this.tableData }));
            localStorage.setItem('gpsBeforeSorting', JSON.stringify({ data: this.tableData }));

            /* Set The Change For signalR To Notice  */
            this.trucksPositionOnMap.map((truck) => {
              if (truck.hardwareID === data.uniqueId) {
                truck.isNew = true;
              }
            });

            this.setNgSelectData(gpsDevice.truckId, true);

            /* Update Cluster */
            const interval = setInterval(() => {
              this.createCustomCluster();
              clearInterval(interval);
            }, 200);
          }
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  /* On Marker Clicked */
  markerClicked(index: number) {
    this.markerClick = true;

    if (this.markerSelected === index) {
      this.countOfMarkerCliced++;
    } else {
      this.markerSelected = index;
      this.countOfMarkerCliced = 1;
    }

    if (this.countOfMarkerCliced > 2) {
      this.countOfMarkerCliced = 0;
      this.markerSelected = -1;
    }
  }

  /* Get Driver Name */
  getDriverName(gpsDevices: any, drivers: any[]) {
    for (const driver of drivers) {
      if (gpsDevices.driverId === driver.id) {
        return driver;
      }
    }

    return '';
  }

  /* Method Check If To Show On Map Some Data Of Truck */
  checkIfToShowDataOnMap() {
    const gpsDataToShow = JSON.parse(localStorage.getItem('gpsData'));
    let countOfSelected = 0;

    if (gpsDataToShow) {
      for (let i = 0; i < this.tableData.length; i++) {
        for (let j = 0; j < gpsDataToShow.data.length; j++) {
          if (this.tableData[i].truckId === gpsDataToShow.data[j].truckId) {
            this.tableData[i].isSelected = gpsDataToShow.data[j].isSelected;
            if (this.tableData[i].isSelected) {
              countOfSelected++;
            }
            this.showOnMap(this.tableData[i]);
            break;
          }
        }
      }
    } else {
      for (let i = 0; i < this.tableData.length; i++) {
        this.tableData[i].isSelected = false;
      }

      for (let i = 0; i < this.trucksPositionOnMap.length; i++) {
        this.trucksPositionOnMap[i].showOnMap = false;
      }
    }

    this.countOfSelected = countOfSelected;
    this.allSelected = countOfSelected === this.tableData.length;

    /* For Showing No Assigned Devices On Map */
    if (this.notAssignedGpsDevices.length) {
      for (let i = 0; i < this.notAssignedGpsDevices.length; i++) {
        for (let j = 0; j < this.trucksPositionOnMap.length; j++) {
          if (this.trucksPositionOnMap[j].hardwareID === this.notAssignedGpsDevices[i].uniqueId) {
            this.trucksPositionOnMap[j].showOnMap = true;
            break;
          }
        }
      }
    }

    return countOfSelected;
  }

  /* Method For Showing Truck On Map */
  showOnMap(event: any) {
    for (let i = 0; i < this.trucksPositionOnMap.length; i++) {
      if (this.trucksPositionOnMap[i].hardwareID === event.hardwareID) {
        this.trucksPositionOnMap[i].showOnMap = event.isSelected;
        break;
      }
    }
  }

  /* Switch Between History Log And Live Trucking */
  onToggleTracking(show: boolean) {
    if (this.showHistoryLog !== show && this.canUseHistoryLog) {
      this.showHistoryLog = show;
      if (this.showHistoryLog) {
        this.showDriverTruckList = true;
        this.signalRService.stopConnection();
        this.getGpsDataList(this.historyDataView ? this.historyDataView : this.tableData[0]);
        this.historyDataView = this.tableData[0];
      } else {
        this.startSignalRConnetction();
        if (this.marker) {
          this.marker.setMap(null);
        }
        this.deleteRoute();
        this.markerSelected = -1;

        const countOfSlected = this.checkIfToShowDataOnMap();
        if (countOfSlected === this.tableData.length) {
          this.allSelected = true;
        } else {
          this.allSelected = false;
        }

        for (let i = 0; i < this.notAssignedGpsDevices.length; i++) {
          for (let j = 0; j < this.trucksPositionOnMap.length; j++) {
            if (this.notAssignedGpsDevices[i].uniqueId === this.trucksPositionOnMap[j].hardwareID) {
              this.trucksPositionOnMap[j].showOnMap = true;
            }
          }
        }
      }
    }
  }
  /* HISTORY LOG */
  /* Select History Data To Show */
  onSTruckDHistory(data: any) {
    if (this.historyDataView.id !== data.id) {
      /* Reset All */
      this.historyMarkers = [];
      clearInterval(this.zoomOnMarkerInterval);
      this.markerPlayed = false;
      this.indexLocationOne = 0;
      this.indexLocationtwo = 1;
      this.historyStops = [];
      this.slideInit = 0;
      this.drivingPercentage = 0;
      this.shortStopPercentage = 0;
      this.extendedStopPercentage = 0;
      this.parkingPercentage = 0;
      this.deleteRoute();
      if (this.marker) {
        this.marker.setMap(null);
        clearTimeout(this.playInterval);
      }

      /* Set List View Selected  */
      this.historyDataView = data;

      this.showDriverTruckList = false;

      /* Call Api */
      this.getGpsDataList(data);
    }
  }

  /* Switch Date On History Log */
  switchDate(event: any) {
    this.animateDatePicker = false;
    this.animateRangePicker = false;
    for (const dateSelected of event) {
      if (dateSelected.checked && (dateSelected.id === 1 || dateSelected.id === 2)) {
        this.hideDateRangePicker = true;
        break;
      } else {
        this.hideDateRangePicker = false;
      }
    }
  }
  
  /* History Log Switch Day */
  onSwitchDay(isLeft: boolean) {}

  /* Method To Call Gps Data */
  getGpsDataList(dataOfDevice: any) {
    if (this.marker) {
      this.marker.setMap(null);
      clearTimeout(this.playInterval);
    }
    this.deleteRoute();

    const truckPositionData$ = this.gpsServise.getGpsData(
      '',
      dataOfDevice.truckId,
      -1,
      '',
      '',
      'wtd'
    );

    forkJoin([truckPositionData$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ([truckPositionData]: [HistoryLogData]) => {
          console.log('History Log Res');
          console.log(truckPositionData);
          this.historyLogData = truckPositionData;
          this.historyRouteData = truckPositionData.data;

          this.getPercentageStatistic(truckPositionData);
          this.setHistoryStopListData(truckPositionData.stops);

          /* Get Marker For History Log */
          this.historyMarkers = [];
          this.historyRouteData.forEach((routeData, i) => {
            if (this.getHistoryMarkerData(routeData)) {
              this.historyMarkers.push({
                icon:
                  i === 0 || i === this.historyRouteData.length - 1
                    ? '../../assets/img/svgs/GPS/History Markers/History-Start-End-Marker.svg'
                    : this.getHistoryMarkerData(routeData),
                latitude: routeData.latitude,
                longitude: routeData.longitude,
                course: routeData.course,
              });
            }
          });

          /* Get Route Data */
          if (this.historyRouteData.length) {
            this.historyRouteOnMap = getRouteAndMarkerData(
              this.historyRouteData,
              false,
              true
            ).route;

            /* For Marker Course */
            this.courseForMarkerIcon = this.historyRouteData[
              this.historyRouteData.length - 1
            ].course;

            /* Get Locations */
            if (this.historyRouteOnMap.length) {
              this.getRouteLocations(0);
            }
          }
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  /* Set Stop List Data */
  setHistoryStopListData(stops: any) {
    this.historyStops = [];
    if(stops.length){
      stops.map((stop) => {
        this.historyStops.push({
          endDateTime: stop.endDateTime,
          id: stop.id,
          leg: stop.leg,
          location: stop.location,
          startDateTime: stop.startDateTime,
          total: stop.total,
          typeOfStop: '',
        });
      });
  
      this.historyStops.map((stop) => {
        const date1 = new Date(stop.startDateTime);
        const date2 = new Date(stop.endDateTime);
        const millSec = date2.getTime() - date1.getTime();
        if(Math.round(millSec / (1000 * 60)) < 30){
          stop.typeOfStop = 'Short Stop';
        }else if (Math.round(millSec / (1000 * 60)) >= 30 && Math.round(millSec / (1000 * 60 * 60)) < 12) {
          stop.typeOfStop = 'Extended Stop';
        }else{
          stop.typeOfStop = 'Parking';
        }
      });
    }

    console.log('My Stop List Data');
    console.log(this.historyStops);
  }

  /* Get Locations If There Are Non */
  getRouteLocations(index: number) {
    let originDone = false,
      destinationDone = false,
      waypointsDone = false,
      countOfWaypointsCalls = 0;

    /* Origin */
    if (!this.historyRouteOnMap[index].origin) {
      this.mapService
        .reverseGeocoding(
          this.historyRouteOnMap[index].originLatLong.lng,
          this.historyRouteOnMap[index].originLatLong.lat
        )
        .subscribe((address: any) => {
          this.historyRouteOnMap[index].origin = address.address;
          originDone = true;
        });
    } else {
      originDone = true;
    }

    /* Destination */
    if (!this.historyRouteOnMap[index].destination) {
      this.mapService
        .reverseGeocoding(
          this.historyRouteOnMap[index].destinationLatLong.lng,
          this.historyRouteOnMap[index].destinationLatLong.lat
        )
        .subscribe((address: any) => {
          this.historyRouteOnMap[index].destination = address.address;
          destinationDone = true;
        });
    } else {
      destinationDone = true;
    }

    /* Waypoints */
    if (this.historyRouteOnMap[index].waypoints.length) {
      this.historyRouteOnMap[index].waypoints.map((waypoints) => {
        if (!waypoints.location) {
          this.mapService
            .reverseGeocoding(waypoints.position.lng, waypoints.position.lat)
            .subscribe((address: any) => {
              waypoints.location = address.address;
              countOfWaypointsCalls++;
              if (this.historyRouteOnMap[index].waypoints.length === countOfWaypointsCalls) {
                waypointsDone = true;
              }
            });
        } else {
          countOfWaypointsCalls++;
          if (this.historyRouteOnMap[index].waypoints.length === countOfWaypointsCalls) {
            waypointsDone = true;
          }
        }
      });
    } else {
      waypointsDone = true;
    }

    const interval = setInterval(() => {
      if (originDone && destinationDone && waypointsDone) {
        clearInterval(interval);

        if (this.historyRouteOnMap[index + 1]) {
          this.getRouteLocations(index + 1);
        } else {
          this.settingRouteUp(this.historyRouteOnMap);
        }
      }
    }, 100);
  }

  /* Get Color For Time Line */
  getTimeLinecolor(data: any) {
    if (data.shortStop) {
      return '#A16CAF';
    } else if (data.extendedStop) {
      return '#FFA24E';
    } else if (data.parking) {
      return '#6C6C6C';
    } else {
      return '#5673AA';
    }
  }

  /* Get Statistic Of Driving, Idle, Stop Percentage */
  getPercentageStatistic(truckPositionData: HistoryLogData) {
    let sumOfTime = truckPositionData.drivingTime;
    sumOfTime += truckPositionData.idleTime;
    sumOfTime += truckPositionData.stopTime;
    sumOfTime += truckPositionData.extendedStopTime;

    this.drivingPercentage =
      truckPositionData.drivingTime && sumOfTime
        ? Math.round((truckPositionData.drivingTime / sumOfTime) * 100)
        : 0;
    this.shortStopPercentage =
      truckPositionData.stopTime && sumOfTime
        ? Math.round((truckPositionData.stopTime / sumOfTime) * 100)
        : 0;
    this.extendedStopPercentage =
      truckPositionData.extendedStopTime && sumOfTime
        ? Math.round((truckPositionData.extendedStopTime / sumOfTime) * 100)
        : 0;
    this.parkingPercentage =
      truckPositionData.idleTime && sumOfTime
        ? Math.round((truckPositionData.idleTime / sumOfTime) * 100)
        : 0;
  }

  /* HISTORY GET ROUTE DATA */
  /* Setting Up Drowing Route On Map */
  settingRouteUp(place: any) {
    for (let i = 0; i < place.length; i++) {
      this.createRouteRequest(place[i]);
    }

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

      let legs = [];
      for (let i = 0; i < this.routesArray.length; i++) {
        for (let j = 0; j < this.routesArray[i].directions.routes[0].legs.length; j++) {
          legs.push(this.routesArray[i].directions.routes[0].legs[j]);
        }
      }

      let markerLatLng = [];
      for (let i = 0; i < legs.length; i++) {
        for (let j = 0; j < legs[i].steps.length; j++) {
          markerLatLng.push(legs[i].steps[j].lat_lngs);
        }
      }

      const latlng = markerLatLng[0];
      const lat = latlng[0].lat();
      const lng = latlng[0].lng();

      this.marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: this.map,
        icon: {
          url: this.courseForMarkerIcon
            ? `../../assets/img/svgs/GPS/Moving Directions/${this.courseForMarkerIcon}.svg`
            : null,
          size: new google.maps.Size(26, 32),
          scaledSize: new google.maps.Size(26, 32),
          anchor: new google.maps.Point(0, 30),
        },
      });

      this.zoomOnLocation(lat, lng);

      this.getFramesForMarker(markerLatLng);
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
        strokeColor: '#1E283B',
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
        strokeColor: '#5673AA',
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

  /* Get Frames For Marker */
  getFramesForMarker(markerLatLng: any) {
    this.frames = [];
    for (let i = 0; i < markerLatLng.length; i++) {
      for (let j = 0; j < markerLatLng[i].length; j++) {
        this.frames.push(
          new google.maps.LatLng(markerLatLng[i][j].lat(), markerLatLng[i][j].lng())
        );
      }
    }

    this.setPlayerData(this.frames);
  }

  /* Set Player Data */
  setPlayerData(frames: any) {
    this.options = {
      floor: 0,
      ceil: frames.length,
      animate: true,
      step: 1,
      showSelectionBar: true,
      hideLimitLabels: true,
    };
  }

  /* Set Marker Position On Slider Seleked Frame */
  onPlayerSlider() {
    /* Check If Marker And Frames Exists */
    if (this.frames[this.slideInit] && this.frames.length && this.marker) {
      /* Set Marker Position On Map */
      this.marker.setPosition({
        lat: this.frames[this.slideInit].lat(),
        lng: this.frames[this.slideInit].lng(),
      });
    } else {
      this.slideInit = 0;
    }
  }

  /* Play Or Stop Animation */
  onPlayMarker() {
    /* Check If Animation Is Activated */
    if (!this.playInterval) {
      /* Check If Marker And Frames Exists */
      if (this.marker && this.frames.length) {
        /* Play Slider */
        this.playInterval = setInterval(() => {
          this.slideInit += 1;
          if (
            this.slideInit < this.frames.length &&
            this.frames[this.slideInit] &&
            this.frames[this.slideInit].lat() &&
            this.frames[this.slideInit].lng()
          ) {
            this.marker.setPosition({
              lat: this.frames[this.slideInit].lat(),
              lng: this.frames[this.slideInit].lng(),
            });
          } else {
            /* If Frames Ends Stop Player */
            clearInterval(this.playInterval);
            this.playInterval = 0;
            this.slideInit = 0;
          }
        }, 0);
      }
    } else {
      /* Stop Player And Marker */
      clearInterval(this.playInterval);
      this.playInterval = 0;
    }
  }

  /* HISTORY GET MARKER DATA */
  /* Call Reverse Geocoding */
  /* async getAddress(locationData: any, locationOneIndex: number, locationTwoIndex: number) {
    console.log('Poziva se Get Address');
    try {
      if (locationData[locationTwoIndex]) {
        const loactionOne = await this.reverseGeocoding(
          locationData[locationOneIndex][0],
          locationData[locationOneIndex][1]
        );
        const loactionTwo = await this.reverseGeocoding(
          locationData[locationTwoIndex][0],
          locationData[locationTwoIndex][1]
        );

        this.getCoordinatesBetweenTwoLocations(loactionOne, loactionTwo);
      }
    } catch (err) {
      this.shared.handleServerError();
    }
  } */

  /* Get Address From Lat And Lng */
  /* reverseGeocoding(lat: number, lng: number) {
    return new Promise((resolve) => {
      Sasa Api
      this.mapService.reverseGeocoding(lng, lat).subscribe((address: any) => {
        resolve(address.address);
      });

      Google Api
      const geocoder = new google.maps.Geocoder();
      const latlng = {
        lat,
        lng,
      };

      geocoder.geocode(
        { location: latlng },
        (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
          if (status === 'OK') {
            if (results[0]) {
              resolve(results[0].formatted_address);
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        }
      );
    });
  } */

  /* Get Route Coordinates And Start Marker Setup */
  /* async getCoordinatesBetweenTwoLocations(locationOne: any, loactionTwo: any) {
    const request = {
      origin: locationOne,
      destination: loactionTwo,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    try {
      const steps = await this.getSteps(request);
      this.getDirectionsForMarker(steps);
    } catch (err) {
      this.shared.handleServerError();
    }
  } */

  /* Set Coordinates In Array From Directions Service*/
  /*  getSteps(request) {
    return new Promise((resolve) => {
      const steps = [];
      this.directionsService.route(request, function (result, status) {
        if (status == 'OK') {
          const directionsData = result.routes[0].legs[0];

          for (let i = 0; i < directionsData.steps.length; i++) {
            for (let j = 0; j < directionsData.steps[i].path.length; j++) {
              steps.push([
                directionsData.steps[i].path[j].lat(),
                directionsData.steps[i].path[j].lng(),
              ]);
            }
          }
          resolve(steps);
        }
      });
    });
  } */

  /* Get Route For Marker To Go During The Animation */
  /* getDirectionsForMarker(recordedTruckLocations: any) {
    this.locationBCords = recordedTruckLocations[recordedTruckLocations.length - 1];
    const locationArray = recordedTruckLocations.map((l) => new google.maps.LatLng(l[0], l[1]));

    if (!this.pathOfMarker) {
      this.pathOfMarker = new google.maps.Polyline({
        strokeOpacity: 0,
        path: [],
        map: this.map,
      });
    } else {
      this.pathOfMarker.setMap(null);
      this.pathOfMarker = new google.maps.Polyline({
        strokeOpacity: 0,
        path: [],
        map: this.map,
      });
    }

    locationArray.forEach((l) => this.pathOfMarker.getPath().push(l));

    this.addDirectionsToMarker();
  } */

  /* Set Options And Route For Marker To Go During The Animation */
  /* addDirectionsToMarker() {
    const route = this.pathOfMarker.getPath().getArray();

    const options: TravelMarkerOptions = {
      map: this.map,
      speed: 4000,
      interval: 1,
      speedMultiplier: 4,
      markerOptions: {
        title: 'Travel Marker',
        animation: '',
        icon: {
          url: this.getIcon(this.historyMarkers[this.indexLocationtwo], true),
          animation: '',
          scaledSize: new google.maps.Size(26, 32),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(0, 32),
        },
      },
    };

    if (!this.marker) {
      this.marker = new TravelMarker(options);
    } else {
      this.marker.setMap(null);
      this.marker = new TravelMarker(options);
    }

    this.marker.addLocation(route);

    if (this.markerPlayed) {
      this.marker.play();
    }

    this.zoomOnMarker();
  } */

  /* Zoom On Location On Map */
  zoomOnLocation(lat: number, lng: number) {
    /* this.marker.getPosition().lng() */
    const bounds = new google.maps.LatLngBounds();
    bounds.extend({
      lat: lat,
      lng: lng,
    });
    const myLatlng = new google.maps.LatLng(lat, lng);

    this.map.setCenter(bounds.getCenter());
    this.map.panToBounds(bounds);

    const interval = setInterval(() => {
      this.map.setZoom(12);
      this.map.panTo(myLatlng);
      clearInterval(interval);
    }, 500);
  }

  /* Get SVG For Marker During Animation */
  getHistoryMarkerData(gpsData: any) {
    /* FOR EXTENDED STOP */
    if (gpsData.extendedStop) {
      return `../../assets/img/svgs/GPS/History Markers/History-ExtendedStop.svg`;
    } else if (gpsData.shortStop) {
      /* FOR SHORT STOP */
      return `../../assets/img/svgs/GPS/History Markers/History-ShortStop.svg`;
    } else if (gpsData.parking) {
      /* FOR PARKING */
      return `../../assets/img/svgs/GPS/History Markers/History-Parking.svg`;
    }
  }

  /* Get Icon Form Marker */
  /* getIcon(gpsData: any, isAssigned: boolean) {
    return !isAssigned
      ? `../../assets/img/svgs/GPS/Unassign/${gpsData.course}.svg`
      : `../../assets/img/svgs/GPS/Moving Directions/${gpsData.course}.svg`;
  } */

  /* Animations Arrow Date Pickers */
  onAddAnimationArrowPickers() {
    this.animateDatePicker = true;
    this.pickerWasSelected = true;
    this.clickedOnPicker = true;
  }

  /* TOOL BAR */

  /* Initialization Of Map */
  mapReady(event: any) {
    this.map = event;
    this.trafficLayer = new google.maps.TrafficLayer();

    this.parser = new geoXML3.parser({
      map: this.map,
      processStyles: false,
      zoom: false,
      singleInfoWindow: false,
    });

    for (let i = 0; i < this.tollRoadsKml.length; i++) {
      this.tollRoads.push(
        new geoXML3.parser({
          map: this.map,
          processStyles: false,
          zoom: false,
          singleInfoWindow: false,
        })
      );
    }
  }

  /* Method To Set Programmatically Custom Cluster From Which To Get Data Of Truck Inside Cluster */
  createCustomCluster() {
    /* If Cluster Drop Down Is Opened, Close It */
    if (this.isClusterDropDownOpened) {
      this.isClusterDropDownOpened = false;
    }

    /* Get Markers Positions */
    let arrayOfMarkers = [];
    this.trucksPositionOnMap.map((marker) => {
      if (marker.showOnMap) {
        let m = new google.maps.Marker({
          position: new google.maps.LatLng(parseFloat(marker.lat), parseFloat(marker.long)),
          icon: {
            url: '',
            scaledSize: new google.maps.Size(0, 0),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 0),
          },
        });

        arrayOfMarkers.push(m);
      }
    });

    /* Set Clusters Options */
    const mcOptions = {
      imagePath: '',
      zoomOnClick: false,
      averageCenter: true,
      styles: [
        {
          height: 46,
          url: '',
          width: 46,
          fontSize: 0,
          class: 'custom-clustericon',
          cssClass: 'custom-clustericon',
          textColor: '#fff0',
          textSize: 0,
        },
      ],
    };

    /* Create Cluster */
    if (this.clusters) {
      google.maps.event.clearListeners(this.map, 'bounds_changed');
    }

    this.clusters = new MarkerClusterer(this.map, arrayOfMarkers, mcOptions);

    console.log('Clusters');
    console.log(this.clusters);

    /* Add Listener To Clusters */
    google.maps.event.addListener(this.clusters, 'clusterclick', (cluster) => {
      /* Set Drop Down Data Of Cluster To Null And Get Markers In Cluster */
      this.clusterDropdownData = [];
      this.clusterLocation = {
        lat: cluster.center_.lat(),
        long: cluster.center_.lng(),
      };
      const clusters = cluster.getMarkers();

      /* Fill Custom Object Fith Markers In Cluster */
      clusters.forEach((element) => {
        const lat = element.getPosition().lat();
        const lng = element.getPosition().lng();

        this.trucksPositionOnMap.forEach((truck) => {
          if (parseFloat(truck.lat) === lat && parseFloat(truck.long) === lng) {
            this.clusterDropdownData.push(truck);
          }
        });
      });

      /* Show Drop Down */
      this.isClusterDropDownOpened = true;
    });
  }

  /* Toggle Cluster Drop Down */
  clusterDropDownIsToggled($isOpen: any) {
    this.isClusterDropDownOpened = $isOpen;
    this.changeDetectorRef.detectChanges();
  }

  /* Zoom On Marker Clicked In CLuster Drop Down */
  onZoomMarkerInCluster(marker) {
    /* Hide Cluster Drop Down */
    this.isClusterDropDownOpened = false;
    this.clusterLocation = {
      lat: undefined,
      long: undefined,
    };

    /* Set Data For Zoom */
    const bounds = new google.maps.LatLngBounds();
    bounds.extend({
      lat: parseFloat(marker.lat),
      lng: parseFloat(marker.long),
    });
    const myLatlng = new google.maps.LatLng(marker.lat, marker.long);

    /* Zoom */
    this.map.panToBounds(bounds);
    this.map.panTo(myLatlng);
    const interval = setInterval(() => {
      this.map.setZoom(8);
      clearInterval(interval);
    }, 1000);
  }

  /* Zoom On Marker Mouse Wheel Event  */
  onMouseWheel(event: any) {
    this.onZoom(event.deltaY < 0);
  }

  /* Toll Road */
  onTollRoad() {
    for (let i = 0; i < this.tollRoads.length; i++) {
      if (this.tollRoads[i].docs.length) {
        if (!this.isTollRoadActive) {
          this.tollRoads[i].showDocument();
        } else {
          this.tollRoads[i].hideDocument();
        }
      } else {
        this.tollRoads[i].parse(this.tollRoadsKml[i].state);
      }
    }
    this.isTollRoadActive = !this.isTollRoadActive;
  }

  /* Timezone */
  onTimeZone() {
    this.showGpsLegend = false;
    if (this.parser.docs.length) {
      if (!this.isTimeZoneActive) {
        this.parser.showDocument();
      } else {
        this.parser.hideDocument();
      }
      this.isTimeZoneActive = !this.isTimeZoneActive;
    } else {
      this.parser.parse(this.kmlUrl);
      this.isTimeZoneActive = true;
    }
  }

  /* Activate Or Deactivate FullScreen */
  onFullScreen(isFullScreen: boolean) {
    this.fullscreenMode = isFullScreen;
  }

  /* Zoom Control */
  onZoom(zoomIn: boolean) {
    this.zoom = this.map.zoom;
    if (zoomIn) {
      this.zoom++;
    } else {
      this.zoom--;
    }
  }

  /* Triffic  */
  onShowTruffic() {
    this.trafficLayerShow = !this.trafficLayerShow;
    this.showGpsLegend = false;
    const interval = setInterval(() => {
      if (this.trafficLayerShow) {
        this.trafficLayer.setMap(this.map);
      } else {
        this.trafficLayer.setMap(null);
      }
      clearInterval(interval);
    }, 200);
  }

  /* Doppler Radar */
  onDopplerRadar() {
    this.showDoppler = !this.showDoppler;
    this.showGpsLegend = false;
    this.onToggleDoppler(this.showDoppler);
  }

  /* On Off Doppler Radar */
  onToggleDoppler(on: boolean) {
    this.showGpsLegend = false;
    if (on) {
      if (!this.tileNeXRad.length) {
        for (const rad of this.allNexrad) {
          this.tileNeXRad.push(imageMapType(rad));
        }
      }
      for (const tile of this.tileNeXRad) {
        this.map.overlayMapTypes.push(tile);
      }

      for (let i = 0; i < this.map.overlayMapTypes.getLength(); i++) {
        this.map.overlayMapTypes.getAt(i).setOpacity(0.6);
      }

      this.startAnimation(true);
    } else {
      this.startAnimation(false);
      this.map.overlayMapTypes.clear();
    }
  }

  /* Animate For Doppler Radar */
  public startAnimation(animationOn: boolean) {
    let countIntervalTime = 0;
    if (animationOn) {
      let index = this.map.overlayMapTypes.getLength() - 1;

      this.dopplerInterval = window.setInterval(() => {
        this.map.overlayMapTypes.getAt(index).setOpacity(0.0);
        index--;
        if (index < 0) {
          index = this.map.overlayMapTypes.getLength() - 1;
        }
        this.map.overlayMapTypes.getAt(index).setOpacity(0.6);

        countIntervalTime++;
        if (countIntervalTime === 700) {
          clearInterval(this.dopplerInterval);
          this.map.overlayMapTypes.clear();
          this.showDoppler = false;
        }
      }, 400);
    } else {
      clearInterval(this.dopplerInterval);
    }
  }

  onShowGpsLegend() {
    this.showGpsLegend = true;

    if (this.showGpsLegend && !this.gpsLegendInterval) {
      this.removeGpsLegend = false;
      this.gpsLegendInterval = setInterval(() => {
        this.removeGpsLegend = true;
        this.setShowGpsLegendFalse();
        clearInterval(this.gpsLegendInterval);
        this.gpsLegendInterval = 0;
      }, 180000);
    } else {
      this.removeGpsLegend = true;
      this.setShowGpsLegendFalse();
      clearInterval(this.gpsLegendInterval);
      this.gpsLegendInterval = 0;
    }
  }

  setShowGpsLegendFalse() {
    const interval = setInterval(() => {
      this.showGpsLegend = false;
      this.removeGpsLegend = false;
      clearInterval(interval);
    }, 200);
  }

  startSignalRConnetction() {
    this.signalRService.startConnection();
    this.signalRService.addTransferGpsDataListener();
    this.startHttpRequest();
  }

  private startHttpRequest = () => {
    this.http
      .get(environment.API_ENDPOINT + 'signalr/gps')
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  };

  /* On Leave Page */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /* TODO: Sredi da bude prostije */
  /* Sorting Live Trucking Data */
  onSort(sortBy: string) {
    alert('Optimizacija se trunto radi na sortu');
  }
}
