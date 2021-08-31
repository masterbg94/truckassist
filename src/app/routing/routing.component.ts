import { takeUntil } from 'rxjs/operators';
import { CdkDragDrop, CdkDragEnd, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Subject } from 'rxjs';
import { imageMapType } from 'src/assets/utils/methods-global';
import * as AppConst from '../const';
import { formatAddress } from '../core/helpers/formating';
import 'ol/ol.css';
declare const geoXML3: any;

@Component({
  selector: 'app-routing',
  templateUrl: './routing.component.html',
  styleUrls: ['./routing.component.scss'],
})
export class RoutingComponent implements OnInit, AfterViewInit, OnDestroy {
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
  routs = [];
  showRoutDropDown = -1;
  showSettings = false;

  appTaSwitchData = [
    {
      data: [
        { name: 'Miles', checked: true, id: 1, inputName: 'unit', title: 'Units:' },
        { name: 'Km', checked: false, id: 2, inputName: 'unit', title: 'Units:' },
      ],
    },
    {
      data: [
        { name: 'Open', checked: true, id: 1, inputName: 'border', title: 'Border:' },
        { name: 'Closed', checked: false, id: 2, inputName: 'border', title: 'Border:' },
      ],
    },
    {
      data: [
        { name: 'Avoid', checked: true, id: 1, inputName: 'tolls', title: 'Tolls:' },
        { name: 'Dont', checked: false, id: 2, inputName: 'tolls', title: 'Tolls:' },
      ],
    },
  ];

  addBorderWidth = -1;
  showAddNewPlace = -1;

  optionsCities = {
    types: ['(cities)'],
    componentRestrictions: { country: ['US', 'CA'] },
  };

  optionsZip = {
    types: ['address'],
    componentRestrictions: { country: ['US', 'CA'] },
  };

  options = {
    componentRestrictions: { country: ['US', 'CA'] },
  };

  origin: string;
  destination: string;
  lat: any;
  long: any;
  address: string;
  routAddress = '';

  renderOptions = {
    suppressMarkers: true,
    polylineOptions: {
      strokeColor: '#28529F',
    },
  };

  places = [];
  markers = [];
  formatedAddress: string;
  showPlaces = true;
  timeOutRout = false;
  routName: string;
  showRenameRout = -1;
  mainActions = [
    {
      title: 'Rename',
      name: 'edit-rout',
    },
  ];
  printAction = [
    {
      title: 'Print',
      name: 'print-rout',
    },
  ];
  deleteActions = {
    title: 'Delete',
    name: 'delete-rout',
    text: 'Are you sure you want to delete Rout?',
  };
  addNewPlace = false;
  indexOfRoute: number;
  openAddNewPlaceOnEnter = false;
  savedIdnex = -1;
  clikeOnSettings = false;
  copyOfRoutes = [];
  showTitleBar = false;
  canUseUpAndDown = true;
  currentlyFocusedRoute = -1;
  currentlyFocusedPlace = -1;
  internalAddPlace = false;
  hideRegularInput = true;
  doFocusOutRename = false;
  doFocusInRename = false;
  indexOFInternalInput = -1;
  private destroy$: Subject<void> = new Subject<void>();
  showLegend = false;
  fullScreenMode = false;
  mode = '';
  firstUsageOfUpAndDownArrow = false;
  dontUseTab = false;
  usedUpandDownArrow = false;
  firstResult = '';
  @ViewChild('placesRef') placesRef: GooglePlaceDirective;
  map;
  requestArray = [];
  renderArray = [];
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsService = new google.maps.DirectionsService();
  renderOption: any;
  multipleRequest = [];
  pausedIndex = 0;
  isFirstLoad = false;
  allRenderInArray = [];
  trafficLayer;
  trafficLayerShow = false;
  delayRequest = 100;
  legendBtnClicked = false;
  renderBorderArray = [];
  selectedRouteForPrint = -1;
  previousMarkerBounds: any;
  previousBounds: any;
  removeDeleteOption: boolean;
  routesLengthMax: boolean;
  addAnimationRoutes: boolean;
  dragPosition = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ];
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
  isDopplerOn: boolean;
  dopplerInterval: any;
  hoverOnMarker = -1;
  routeOfHoveredMarker = -1;
  heightOfRoutesContainer: any;
  @ViewChild('routesContainer') routesContainer: any;
  setHeightAuto: boolean;
  timeZones: any;
  kmlUrl = 'assets/kml/timezones.kml';
  isTimeZoneActive: boolean;
  tollRoads: any = [];
  isTollRoadsActive: boolean;
  tollRoadsKml = [
    { state: 'assets/kml/toll-roads/florida.kml' },
    { state: 'assets/kml/toll-roads/Texas.kml' },
    { state: 'assets/kml/toll-roads/California.kml' },
  ];
  mapPrint: any;
  placesToPrint = [];
  routeGoogleData: any;

  constructor(
    private elementRef: ElementRef,
    private http: HttpClient,
    public router: Router,
    private toastr: ToastrService,
    private elRef: ElementRef
  ) {}

  ngOnInit(): void {
    const routsData = JSON.parse(localStorage.getItem('routsData'));
    const routingSettingsUnit = JSON.parse(localStorage.getItem('routingSettingsUnit'));
    const routingSettingsBorders = JSON.parse(localStorage.getItem('routingSettingsBorders'));
    const routingSettingsTolls = JSON.parse(localStorage.getItem('routingSettingsTolls'));
    const routingTraffic = JSON.parse(localStorage.getItem('routingTraffic'));
    const mapMode = JSON.parse(localStorage.getItem('routeMapMode'));
    if (mapMode !== null && mapMode.fullScreen) {
      this.fullScreenMode = true;
    }

    if (routsData !== null && routsData?.length) {
      this.routs = routsData;
      this.checkToRemuveDeleteOption();
      this.removeEmptyLocations();
      for (let i = 0; i < this.routs.length; i++) {
        this.routs[i].rightColorHight = this.calculateHeight(i);
        this.routs[i].addScroll = false;
      }
      if (routsData.length === 8) {
        this.routesLengthMax = true;
      }
    } else {
      this.createDefaultRoute(true);
    }

    if (routingSettingsUnit !== null) {
      if (routingSettingsUnit.miles) {
        this.appTaSwitchData[0].data[0].checked = true;
        this.appTaSwitchData[0].data[1].checked = false;
      } else {
        this.appTaSwitchData[0].data[0].checked = false;
        this.appTaSwitchData[0].data[1].checked = true;
      }
    }

    if (routingSettingsBorders !== null) {
      if (routingSettingsBorders.open) {
        this.appTaSwitchData[1].data[0].checked = true;
        this.appTaSwitchData[1].data[1].checked = false;
      } else {
        this.appTaSwitchData[1].data[0].checked = false;
        this.appTaSwitchData[1].data[1].checked = true;
      }
    }

    if (routingSettingsTolls !== null) {
      if (routingSettingsTolls.avoid) {
        this.appTaSwitchData[2].data[0].checked = true;
        this.appTaSwitchData[2].data[1].checked = false;
      } else {
        this.appTaSwitchData[2].data[0].checked = false;
        this.appTaSwitchData[2].data[1].checked = true;
      }
    }

    if (routingTraffic !== null && routingTraffic.show) {
      this.onRenderTrafficLayer();
    }

    this.checkIfThereAreActive();
    this.getAllDirection();
    document.body.classList.add('routing-page');
  }

  ngAfterViewInit() {
    this.calculatesHeightOfRouteContainer(this.routs);
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(target) {
    const clickedInside = this.elementRef.nativeElement.contains(target);

    /* Fokus Out */
    if (!clickedInside) {
      /* For Settings Drop Down */
      this.showSettings = false;

      /* For Rename Route */
      if (this.doFocusOutRename) {
        this.showRenameRout = -1;
        this.routName = '';
      }
      this.doFocusOutRename = true;
      /* For Route */
      if (this.currentlyFocusedRoute !== -1) {
        this.currentlyFocusedPlace = -1;
        this.currentlyFocusedRoute = -1;
        this.showAddNewPlace = -1;
        this.hideRegularInput = true;
        this.internalAddPlace = false;
        this.removeEmptyLocations();
        /*  this.showAllMarkers(); */
        this.setZIndexOfRoute();
      }

      /* For Legend */
      this.showLegend = false;
    }

    /* Fokus in  */
    if (clickedInside) {
      /* For Settings Drop Down */
      if (!this.clikeOnSettings) {
        this.showSettings = false;
      }
      this.clikeOnSettings = false;

      /* For Rename Route */
      if (this.doFocusInRename) {
        this.showRenameRout = -1;
        this.routName = '';
      }
      this.doFocusInRename = true;

      /* For Legend */
      if (!this.legendBtnClicked) {
        this.showLegend = false;
      }
      this.legendBtnClicked = false;
    }
  }

  @HostListener('keydown', ['$event']) onKeyDown(e) {
    if (e.shiftKey && e.keyCode == 9) {
      this.switchRoute(true);
      this.dontUseTab = true;
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: any) {
    const key = event.keyCode;
    if (key === 27) {
      /* Esc */
      if (this.fullScreenMode && this.currentlyFocusedRoute === -1) {
        this.onFullScreen(false);
      }
      if (this.currentlyFocusedRoute !== -1) {
        this.checkIfOpenInternalAdd(this.currentlyFocusedRoute);
        this.routs[this.currentlyFocusedRoute].rightColorHight = this.calculateHeight(
          this.currentlyFocusedRoute
        );
      }
      this.routAddress = null;
      if (this.openAddNewPlaceOnEnter) {
        this.openAddNewPlaceOnEnter = false;
      }
      this.internalAddPlace = false;
      this.currentlyFocusedPlace = -1;
      this.indexOFInternalInput = -1;
      this.firstUsageOfUpAndDownArrow = false;
      this.currentlyFocusedRoute = -1;
    } else if (!this.dontUseTab && key === 9) {
      /* Tab switch routes */
      event.preventDefault();
      this.switchRoute();
    } else if (key === 40 || key === 38) {
      /* Up and Down arrow */
      event.preventDefault();
      if (this.currentlyFocusedRoute !== -1) {
        this.onUpAndDownArrow(key);
      }
    } else if (key === 119) {
      /* F8 */
      event.preventDefault();
      this.canUseUpAndDown = true;
      if (!this.internalAddPlace) {
        if (this.currentlyFocusedPlace !== -1) {
          this.onDeleteWithShortCut();
        }
      } else {
        if (this.indexOFInternalInput !== this.currentlyFocusedPlace) {
          this.onDeleteWithShortCut(true);
        } else {
          this.internalAddPlace = false;
          this.indexOFInternalInput = -1;
          this.checkIfOpenInternalAdd(this.currentlyFocusedRoute);
        }
      }
    } else if (key === 118) {
      /* F7 */
      event.preventDefault();
      this.routAddress = '';
      if (this.currentlyFocusedRoute !== -1) {
        if (this.currentlyFocusedPlace !== -1) {
          this.firstUsageOfUpAndDownArrow = false;
          this.checkIfOpenInternalAdd(this.currentlyFocusedRoute);
          this.internalAddPlace = true;
          this.showAddNewPlace = this.currentlyFocusedRoute;
          this.hideRegularInput = true;
          this.canUseUpAndDown = true;
          this.indexOFInternalInput = this.currentlyFocusedPlace;
          this.routs[this.currentlyFocusedRoute].places.splice(this.currentlyFocusedPlace, 0, {
            emptyPlace: true,
          });
          this.routs[this.currentlyFocusedRoute].rightColorHight = this.calculateHeight(
            this.currentlyFocusedRoute,
            true
          );
          let count = 0;
          const interval = setInterval(() => {
            document.getElementById('insertPlaceInternal' + this.currentlyFocusedPlace).focus();
            count++;
            if (count === 1) {
              clearInterval(interval);
            }
          }, 100);
        } else {
          this.onAddNewPlace(this.currentlyFocusedRoute);
        }
      }
    }
    this.dontUseTab = false;
  }

  /* For Remuving Delete Route Option */
  checkToRemuveDeleteOption() {
    if (this.routs.length === 1) {
      for (let i = 1; i < 9; i++) {
        if (this.routs[0].routName === `Route ${i}` && !this.routs[0].places.length) {
          this.removeDeleteOption = true;
          break;
        } else {
          this.removeDeleteOption = false;
        }
      }
    } else {
      this.removeDeleteOption = false;
    }
  }

  /* Activate Full Screen Mode*/
  onFullScreen(isFullScreen: boolean) {
    this.fullScreenMode = isFullScreen;
    localStorage.setItem('routeMapMode', JSON.stringify({ fullScreen: this.fullScreenMode }));
    this.fullScreenMode ? (this.addAnimationRoutes = true) : (this.addAnimationRoutes = false);
    let count = 0;
    const interval = setInterval(() => {
      this.addAnimationRoutes = false;
      count++;
      if (count === 1) {
        clearInterval(interval);
      }
    }, 500);
    this.onResizeRoutesContainer();
  }

  /* Check If There Are Active Routes */
  checkIfThereAreActive() {
    let countOfActive = 0;
    for (const rout of this.routs) {
      if (rout.active) {
        countOfActive++;
      }
    }

    if (countOfActive !== 0) {
      this.showTitleBar = true;
    } else {
      this.showTitleBar = false;
    }
  }

  /* To Fokus On Input */
  fokusOnInput(inputName: string, index: number) {
    let count = 0;
    const interval = setInterval(() => {
      document.getElementById(inputName + index).focus();
      count++;
      if (count === 1) {
        clearInterval(interval);
      }
    }, 150);
  }

  /* Switch Route Method*/
  switchRoute(isViceVersa?: boolean) {
    this.removeEmptyLocations();
    this.zoom = 2;
    this.routAddress = '';
    if (isViceVersa) {
      if (this.savedIdnex === 0) {
        this.savedIdnex = this.routs.length - 1;
      } else {
        this.savedIdnex -= 1;
      }
      for (let i = this.savedIdnex; i >= 0; i--) {
        if (this.routs[i].active) {
          this.focusOnRoute(i);
          break;
        }
        if (i === 0) {
          i = this.routs.length - 1;
        }
      }
    } else {
      if (this.savedIdnex === this.routs.length - 1) {
        this.savedIdnex = 0;
      } else {
        this.savedIdnex += 1;
      }
      for (let i = this.savedIdnex; i <= this.routs.length - 1; i++) {
        if (this.routs[i].active) {
          this.focusOnRoute(i);
          break;
        }
        if (i === this.routs.length - 1) {
          i = -1;
        }
      }
    }
  }

  /* Focus On Route */
  focusOnRoute(i: number) {
    this.indexOFInternalInput = -1;
    this.canUseUpAndDown = true;
    this.savedIdnex = i;
    this.hideRegularInput = false;
    this.showAddNewPlace = i;
    this.fokusOnInput('insertPlace', i);
    this.currentlyFocusedRoute = i;
    this.currentlyFocusedPlace = -1;
    this.setZIndexOfRoute(i);
    this.setBounds(this.markers[i]);
  }

  /* Delete Place In Route */
  onDeleteWithShortCut(internalInputActive?: boolean) {
    const lengthOfPlaces = this.routs[this.currentlyFocusedRoute].places.length - 1;
    this.routs[this.currentlyFocusedRoute].places.splice(this.currentlyFocusedPlace, 1);
    if (lengthOfPlaces === this.currentlyFocusedPlace) {
      this.currentlyFocusedPlace -= 1;
    }
    if (internalInputActive) {
      this.routs[this.currentlyFocusedRoute].rightColorHight = this.calculateHeight(
        this.currentlyFocusedRoute,
        true
      );
    } else {
      this.routs[this.currentlyFocusedRoute].rightColorHight = this.calculateHeight(
        this.currentlyFocusedRoute
      );
    }
    this.deleteRender(this.currentlyFocusedRoute);
    this.getDirectionOfRout(this.currentlyFocusedRoute);
    localStorage.setItem('routsData', JSON.stringify(this.routs));
  }

  /* Check If Open Internal Input If So Close It */
  checkIfOpenInternalAdd(index: number) {
    this.hideRegularInput = false;
    this.showAddNewPlace = -1;
    for (let i = 0; i < this.routs[index].places.length; i++) {
      if (this.routs[index].places[i]?.emptyPlace) {
        this.routs[this.currentlyFocusedRoute].places.splice(i, 1);
        break;
      }
    }
  }

  /* Show Tool Tip Of Place */
  onMarkerClick(indexI: number, indexJ: number) {
    if (this.currentlyFocusedRoute !== indexI) {
      this.currentlyFocusedRoute = indexI;
      this.setZIndexOfRoute(indexI);
      this.setBounds(this.markers[indexI]);
    }
    if (this.currentlyFocusedPlace !== indexJ) {
      this.currentlyFocusedPlace = indexJ;
    }
  }

  /* Uo Aan Down Arrow Method */
  onUpAndDownArrow(key: number) {
    if (this.routAddress === '') {
      this.hideRegularInput = true;
      if (!this.internalAddPlace) {
        this.showAddNewPlace = -1;
      }
      if (key === 38) {
        /* Up Arrow */
        if (this.currentlyFocusedPlace === -1) {
          this.currentlyFocusedPlace = this.routs[this.currentlyFocusedRoute].places.length - 1;
        } else {
          for (let i = 0; i < this.routs[this.currentlyFocusedRoute].places.length; i++) {
            if (i === this.currentlyFocusedPlace) {
              if (i === 0 && !this.firstUsageOfUpAndDownArrow) {
                this.currentlyFocusedPlace =
                  this.routs[this.currentlyFocusedRoute].places.length - 1;
                break;
              } else if (this.firstUsageOfUpAndDownArrow && i === 0) {
                this.internalAddPlace = false;
                this.currentlyFocusedPlace = -1;
                this.hideRegularInput = false;
                this.showAddNewPlace = this.currentlyFocusedRoute;
                this.fokusOnInput('insertPlace', this.currentlyFocusedRoute);
                this.firstUsageOfUpAndDownArrow = false;
              } else {
                this.currentlyFocusedPlace = i - 1;
                break;
              }
            }
          }
          if (!this.internalAddPlace) {
            this.firstUsageOfUpAndDownArrow = true;
          }
        }
      } else if (key === 40) {
        /* Down Arrow */
        if (this.currentlyFocusedPlace === -1) {
          this.currentlyFocusedPlace = 0;
        } else {
          for (let i = 0; i < this.routs[this.currentlyFocusedRoute].places.length; i++) {
            if (i === this.currentlyFocusedPlace) {
              if (
                i === this.routs[this.currentlyFocusedRoute].places.length - 1 &&
                !this.firstUsageOfUpAndDownArrow
              ) {
                this.currentlyFocusedPlace = 0;
                break;
              } else if (
                this.firstUsageOfUpAndDownArrow &&
                i === this.routs[this.currentlyFocusedRoute].places.length - 1
              ) {
                this.currentlyFocusedPlace = -1;
                this.hideRegularInput = false;
                this.showAddNewPlace = this.currentlyFocusedRoute;
                this.fokusOnInput('insertPlace', this.currentlyFocusedRoute);
                this.firstUsageOfUpAndDownArrow = false;
              } else {
                this.currentlyFocusedPlace = i + 1;
                break;
              }
            }
          }
          if (!this.internalAddPlace) {
            this.firstUsageOfUpAndDownArrow = true;
          }
        }
      }
    }
  }

  /* Time Out For Resize Routes Container */
  setIntervalOnHeightCalculation() {
    let count = 0;
    const interval = setInterval(() => {
      this.calculatesHeightOfRouteContainer(this.routs, true);
      count++;
      if (count === 1) {
        clearInterval(interval);
      }
    }, 100);
  }

  /* Resize Routes Container On Events */
  onResizeRoutesContainer() {
    this.setHeightAuto = false;
    this.setIntervalOnHeightCalculation();
  }

  /* Calculates Height Of Route Container */
  calculatesHeightOfRouteContainer(routsData: any[], isResize?: boolean) {
    this.setHeightAuto = false;
    this.heightOfRoutesContainer = this.routesContainer.nativeElement.offsetHeight;
    if (isResize) {
      for (let i = 0; i < routsData.length; i++) {
        if (routsData[i].addScroll && routsData[i].routHight) {
          routsData[i].addScroll = false;
          routsData[i].routHight = this.calculateHeight(i);
        }
      }
    }

    let routesHeight = 0;
    const copyHeight = [];
    for (let i = 0; i < routsData.length; i++) {
      if (routsData[i].active) {
        let addBtnHeight = 21;
        const placesContainerHeight = routsData[i].places.length * 21;
        const marginOfRouteContainer = 12;
        let hasInternalInput: boolean;
        for (let j = 0; j < routsData[i].places.length; j++) {
          if (routsData[i].places[j].emptyPlace) {
            hasInternalInput = true;
            addBtnHeight = 0;
            break;
          }
        }

        copyHeight.push({
          height: addBtnHeight + placesContainerHeight + marginOfRouteContainer,
          routName: routsData[i].routName,
        });

        if (!routsData[i].addScroll) {
          routesHeight += addBtnHeight + placesContainerHeight + marginOfRouteContainer;
        } else {
          routesHeight += routsData[i].routHight;
        }
      }
    }
    const exceededAllowedHeight = routesHeight > this.heightOfRoutesContainer;

    if (exceededAllowedHeight) {
      const placesLenght = {
        index: -1,
        lenght: -1,
      };

      /* Looking for the biggest route */
      for (let i = 0; i < routsData.length; i++) {
        if (
          routsData[i].places.length > placesLenght.lenght &&
          !routsData[i].addScroll &&
          routsData[i].active
        ) {
          placesLenght.index = i;
          placesLenght.lenght = routsData[i].places.length;
        }
      }

      let routHeight = 0;
      for (let i = 0; i < routsData.length; i++) {
        for (let j = 0; j < copyHeight.length; j++) {
          if (
            i !== placesLenght.index &&
            routsData[i].active &&
            copyHeight[j].routName === routsData[i].routName
          ) {
            routHeight += copyHeight[j].height;
          }
        }
      }

      let allowedHeight;
      if (this.heightOfRoutesContainer > routHeight) {
        allowedHeight = this.heightOfRoutesContainer - routHeight - 12;
      } else {
        allowedHeight = routHeight - this.heightOfRoutesContainer - 12;
        allowedHeight *= -1;
      }

      if (allowedHeight < 70) {
        if (routsData[placesLenght.index].places.length > 2) {
          routsData[placesLenght.index].addScroll = true;
          routsData[placesLenght.index].routHight = 63;
          this.calculatesHeightOfRouteContainer(routsData);
        }
      } else {
        routsData[placesLenght.index].addScroll = true;
        routsData[placesLenght.index].routHight = allowedHeight;
      }
    }
  }

  /* Open Settings */
  onOpenSettings() {
    this.showSettings = !this.showSettings;
    this.clikeOnSettings = true;
  }

  /* Map Direction*/
  getAllDirection() {
    this.requestArray = [];
    localStorage.setItem('routsData', JSON.stringify(this.routs));
    this.places = [];
    this.markers = [];
    for (let i = 0; i < this.routs.length; i++) {
      this.getDirectionOfRout(i, true);
    }
  }

  /* Display Direction Of Rout */
  getDirectionOfRout(i: number, isFist?: boolean) {
    let routMaker = [];
    let waypoints = [];
    const gropuOfWaypoints = [];
    if (this.routs[i].places.length > 0) {
      this.requestArray = [];
      localStorage.setItem('routsData', JSON.stringify(this.routs));
      for (let j = 0; j < this.routs[i].places.length; j++) {
        if (this.routs[i].places[j].formatedAddress) {
          routMaker.push({
            lat: this.routs[i].places[j].lat,
            long: this.routs[i].places[j].long,
            hideMarker: false,
            placeName: this.routs[i].places[j].address,
          });
        }
      }

      let countOfWaypoints = 0;
      if (this.routs[i].places.length > 2) {
        for (let j = 0; j < this.routs[i].places.length; j++) {
          if (this.routs[i].places[j]?.formatedAddress) {
            countOfWaypoints++;
            if (countOfWaypoints === 6) {
              const length = waypoints.length;
              const newWaypoints = [];
              for (let k = 1; k < waypoints.length - 1; k++) {
                newWaypoints.push(waypoints[k]);
              }
              gropuOfWaypoints.push({
                origin: this.routs[i].places[j - length].formatedAddress,
                originLatLong: {
                  lat: this.routs[i].places[j - length].lat,
                  long: this.routs[i].places[j - length].long,
                },
                destinationLatLong: {
                  lat: this.routs[i].places[j - 1].lat,
                  long: this.routs[i].places[j - 1].long,
                },
                destination: this.routs[i].places[j - 1].formatedAddress,
                waypoints: newWaypoints,
                done: true,
              });
              waypoints = [];
              countOfWaypoints = 0;
              j -= 1;
            }
            waypoints.push({
              location: {
                lat: this.routs[i].places[j].lat,
                lng: this.routs[i].places[j].long,
              },
            });

            if (j === this.routs[i].places.length - 1 && countOfWaypoints < 6) {
              const length = waypoints.length - 1;
              const newWaypoints = [];
              for (let k = 1; k < waypoints.length - 1; k++) {
                newWaypoints.push(waypoints[k]);
              }
              if (gropuOfWaypoints[gropuOfWaypoints.length - 1] && !newWaypoints.length) {
                gropuOfWaypoints.push({
                  origin: gropuOfWaypoints[gropuOfWaypoints.length - 1].destination,
                  originLatLong: gropuOfWaypoints[gropuOfWaypoints.length - 1].destinationLatLong,
                  destination: this.routs[i].places[j].formatedAddress,
                  destinationLatLong: {
                    lat: this.routs[i].places[j].lat,
                    long: this.routs[i].places[j].long,
                  },
                  waypoints: newWaypoints,
                  done: true,
                });
              } else {
                gropuOfWaypoints.push({
                  origin: this.routs[i].places[j - length].formatedAddress,
                  originLatLong: {
                    lat: this.routs[i].places[j - length].lat,
                    long: this.routs[i].places[j - length].long,
                  },
                  destination: this.routs[i].places[j].formatedAddress,
                  destinationLatLong: {
                    lat: this.routs[i].places[j].lat,
                    long: this.routs[i].places[j].long,
                  },
                  waypoints: newWaypoints,
                  done: true,
                });
              }
              countOfWaypoints = 0;
            }
          }
        }
      } else {
        if (this.routs[i].places.length > 1) {
          gropuOfWaypoints.push({
            origin: this.routs[i].places[0].formatedAddress,
            originLatLong: {
              lat: this.routs[i].places[0].lat,
              long: this.routs[i].places[0].long,
            },
            destination: this.routs[i].places[1].formatedAddress,
            destinationLatLong: {
              lat: this.routs[i].places[1].lat,
              long: this.routs[i].places[1].long,
            },
            waypoints: [],
            done: true,
          });
        }
      }
    }

    console.log('gropuOfWaypoints')
    console.log(gropuOfWaypoints);
    
    const data = {
      renderOptions: {
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: this.routs[i].rightColor,
          strokeWidth: this.routs[i].strokeWidth,
          zIndex: this.routs[i].zIndex,
        },
      },
      gropuOfWaypoints,
      id: i,
      active: this.routs[i].active,
      shownOnMap: this.routs[i].active ? true : false,
    };

    if (isFist) {
      this.places.push(data);
      this.isFirstLoad = isFist;
    } else {
      this.isFirstLoad = false;
      let isSame = false;
      let index = -1;
      for (let j = 0; j < this.places.length; j++) {
        if (this.places[j].id === i) {
          isSame = true;
          index = j;
          break;
        }
      }
      if (isSame) {
        this.places[index] = data;
      } else {
        this.places.push(data);
      }
      for (let j = 0; j < this.places.length; j++) {
        if (!this.places[j].id && this.places[j].id !== 0) {
          this.places.splice(j, 1);
        }
      }
    }

    waypoints = [];
    const markerData = {
      routMaker,
      active: this.routs[i].active,
      id: i,
      color: this.routs[i].rightColor,
      colorMarkerCircle: this.getRoutPathColor(this.routs[i].rightColor),
    };

    if (isFist) {
      this.markers.push(markerData);
    } else {
      this.markers[i] = markerData;
    }

    routMaker = [];
    if (this.routs.length === 1) {
      this.checkToRemuveDeleteOption();
    }

    if (this.places[i].shownOnMap && !isFist && this.routs[i].places.length > 0) {
      this.places[i].shownOnMap = false;
      this.drawGivenRoute(this.places[i].gropuOfWaypoints, this.places[i].renderOptions);
    } else {
      if (this.places.length === this.routs.length && isFist) {
        this.drawAllActive();
      }
    }
  }

  /* Settings options */
  onRoutOptions(event: any) {
    if (event.type === 'edit-rout') {
      this.onRenameRout(event.id);
    } else if (event.type === 'delete-rout') {
      this.onDeleteRout(event.id);
    } else {
      this.selectedRouteForPrint = event.id;
      let count = 0;
      const interval = setInterval(() => {
        this.printDiv();
        count++;
        if (count === 1) {
          clearInterval(interval);
        }
      }, 200);
    }
  }

  /* Focus On Route And Direction  */
  onDetailRoutFokus(index: number) {
    if (this.currentlyFocusedRoute !== index) {
      this.currentlyFocusedRoute = index;
      this.showAddNewPlace = -1;
      this.hideRegularInput = true;
      this.currentlyFocusedPlace = -1;
      this.savedIdnex = index;
    }
    /*  this.showAllMarkers();
    this.hideMarkersOfNotFocusedRoute(index); */
    this.setBounds(this.markers[index]);
    this.setZIndexOfRoute(index);
  }

  /* Fokus On Place In Route */
  onPlaceFokus(index: number, indexOfRoute?: number) {
    this.firstUsageOfUpAndDownArrow = true;
    this.onDetailRoutFokus(indexOfRoute);
    /*  this.hideMarkersThatAreNotSelected(indexOfRoute, index); */
    this.currentlyFocusedPlace = index;
    this.hideRegularInput = true;
    if (this.currentlyFocusedRoute !== indexOfRoute) {
      this.removeEmptyLocations();
      this.internalAddPlace = false;
      this.setZIndexOfRoute(index);
    }
    if (!this.internalAddPlace) {
      this.showAddNewPlace = -1;
    }
  }

  /* On Marker Hover Show POP UP */
  onMarkerHover(indexI: number, indexJ: number) {
    if (this.routeOfHoveredMarker !== indexI || this.hoverOnMarker !== indexJ) {
      this.routeOfHoveredMarker = indexI;
      this.hoverOnMarker = indexJ;
    }
  }

  /* Remove Internal Input */
  removeEmptyLocations() {
    this.showAddNewPlace = -1;
    for (let i = 0; i < this.routs.length; i++) {
      for (let j = 0; j < this.routs[i].places.length; j++) {
        if (this.routs[i].places[j].emptyPlace) {
          this.routs[i].places.splice(j, 1);
          break;
        }
      }
    }
  }

  /* Darg and drop */
  drop(event: CdkDragDrop<string[]>, index: number) {
    this.currentlyFocusedRoute = index;
    moveItemInArray(this.routs[index].places, event.previousIndex, event.currentIndex);
    this.showAddNewPlace = -1;
    this.removeEmptyLocations();
    this.routs[index].rightColorHight = this.calculateHeight(index);
    this.onCalculateDistanceBetweenMarkers(index);
    this.deleteRender(index);
    this.getDirectionOfRout(index, false);
    this.onDetailRoutFokus(index);
    this.currentlyFocusedPlace = -1;
  }

  /* Route Drag And Drop End Positin */
  dragRouteEnd(event: CdkDragEnd, index: number) {
    const elementRoute = document.getElementById(`routdetail${index}`);
    const transform: string = elementRoute.style.transform;

    let transformData: RegExpMatchArray = transform.match(/^translate3d\((.+)\)$/);

    if (transformData[1].includes(' translate3d(')) {
      transformData = transformData[1].split(' translate3d(');
    }

    this.dragPosition[index] = {
      x: parseFloat(transformData[1].split(', ')[0]),
      y: parseFloat(transformData[1].split(', ')[1]),
    };
  }

  public calculateHeight(index: number, idSpecialCase?: boolean) {
    if (!idSpecialCase) {
      return this.routs[index].places.length * 21 + 21 + 'px';
    } else {
      return this.routs[index].places.length * 21 + 'px';
    }
  }

  /* Inputs Keydown Method */
  onAddresEnter(event: any, index: number) {
    const k = event.keyCode;

    if ((k >= 96 && k <= 123) || (k >= 48 && k <= 57)) {
      this.options = this.optionsZip;
    } else {
      this.options = this.optionsCities;
    }

    if (  
      event.keyCode === 13 &&
      !event.shiftKey &&
      event.path !== undefined &&
      event.path !== null &&
      event.path[3].className !== 'ng-select-container ng-has-value'
    ) {
      event.preventDefault();
      this.indexOfRoute = index;
      this.canUseUpAndDown = true;
    }

    if (event.keyCode === 8) {
      let count = 0;
      const interval = setInterval(() => {
        if (this.routAddress === '') {
          this.canUseUpAndDown = true;
        }
        count++;
        if (count === 1) {
          clearInterval(interval);
        }
      }, 100);
    }

    if (this.canUseUpAndDown && !this.internalAddPlace) {
      if (event.keyCode === 40 || event.keyCode === 38) {
        this.usedUpandDownArrow = true;
        this.onUpAndDownArrow(event.keyCode);
      }
    }
  }

  /* GeoCall For Zip Address */
  CallGeoAPI(code) {
    const apiURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${code}&key=AIzaSyAgDUII_kvGfCJNmu4qhhzjl8YNzblV9Ng`;
    return this.http.get(apiURL);
  }

  /* Address handle */
  handleAddressChange(address: any, i: number, index: number, indexOfPlace?: number) {
    if (this.fullScreenMode) {
      const elementRoute = document.getElementById(`routdetail${index}`).getBoundingClientRect();
      const elementMap = document.getElementById(`mapcontainer`).getBoundingClientRect();
      if (elementRoute.bottom >= elementMap.bottom - 20) {
        this.dragPosition[index] = {
          x: this.dragPosition[index].x,
          y: this.dragPosition[index].y - 50,
        };
      }
    }

    if (address.address_components && address.formatted_address !== this.routAddress) {
      this.getGeoLocation(address.formatted_address, index, indexOfPlace);
    } else if (!this.usedUpandDownArrow) {
      const pacContainerFirstItem = $('.pac-container .pac-item:first').text();
      $('.pac-container .pac-item').remove();
      if (pacContainerFirstItem !== '') {
        this.getGeoLocation(pacContainerFirstItem, index, indexOfPlace);
      } else {
        const zipAddress$ = this.CallGeoAPI(this.routAddress);
        forkJoin([zipAddress$])
          .pipe(takeUntil(this.destroy$))
          .subscribe(([zipAddress]: [any]) => {
            const result = zipAddress.results[0];
            if (result?.formatted_address) {
              this.address = result.formatted_address = result.formatted_address
                ? formatAddress(result.formatted_address)
                : '';
              this.lat = result.geometry.location.lat;
              this.long = result.geometry.location.lng;
              this.formatedAddress = result.formatted_address;
              if (this.indexOfRoute === undefined) {
                this.indexOfRoute = index;
              }
              this.onSaveNewPlace(this.indexOfRoute, indexOfPlace);
              this.addNewPlace = false;
            } else {
              this.toastr.error(`The place could not be found`, 'Error:');
              this.routAddress = '';
              this.fokusOnInput('insertPlace', index);
            }
          });
      }
    }
    this.usedUpandDownArrow = false;
  }

  /* GeoLocation of address */
  getGeoLocation(address: string, index: number, indexOfPlace?: number) {
    const axios = require('axios').default;
    axios
      .get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address,
          key: 'AIzaSyCw4WQw1T4N6TjFWdS731mM09x88SGW81I',
        },
      })
      .then((res) => {
        this.address = res.data.results[0].formatted_address = res.data.results[0].formatted_address
          ? formatAddress(res.data.results[0].formatted_address)
          : '';
        this.lat = res.data.results[0].geometry.location.lat;
        this.long = res.data.results[0].geometry.location.lng;
        this.formatedAddress = res.data.results[0].formatted_address;
        this.onSaveNewPlace(index, indexOfPlace);
        this.addNewPlace = false;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /* Add new routs */
  onAddRouts() {
    if (this.routs.length <= 7) {
      this.createDefaultRoute();
      this.getDirectionOfRout(this.routs.length - 1, false);
      this.onResizeRoutesContainer();
    }
  }

  /* For Create Default  Rout */
  createDefaultRoute(isFirstLoad?: boolean) {
    const color = this.getRoutColor(this.routs.length);
    this.routs.push({
      routName: 'Route ' + (this.routs.length + 1),
      strokeWidth: 0,
      routNumber: 0,
      active: true,
      rightColorHight: '0px',
      rightColor: color,
      places: [],
      placesExists: false,
      routHight: 33,
      addScroll: false,
      zIndex: this.routs.length + 1,
    });
    /*  this.setRoutsStrokeWidth(); */
    this.routesLengthMax = this.routs.length === 8;
    this.currentlyFocusedRoute = this.routs.length - 1;
    this.showAddNewPlace = this.routs.length - 1;
    this.hideRegularInput = false;
    this.showTitleBar = true;
    if (!isFirstLoad) {
      this.fokusOnInput('insertPlace', this.routs.length - 1);
    }
    this.routs[this.routs.length - 1].rightColorHight = this.calculateHeight(this.routs.length - 1);
    this.checkToRemuveDeleteOption();
    localStorage.setItem('routsData', JSON.stringify(this.routs));
  }

  // TODO: trenutno ne treba vise vidi ukloni ako ne bude trazio
  /* setRoutsStrokeWidth() {
    for (let i = 0; i < this.routs.length; i++) {
      this.routs[i].strokeWidth = this.routs.length - i;
    }
    for (let i = 0; i < this.allRenderInArray.length; i++) {
      this.allRenderInArray[i].renderArrayItem.polylineOptions.strokeWeight = this.routs[
        i
      ].strokeWidth;
    }
    for (let i = 0; i < this.allRenderInArray.length; i++) {
      if (this.allRenderInArray[i].active) {
        this.allRenderInArray[i].renderArrayItem.setMap(null);
        this.allRenderInArray[i].renderArrayItem.setMap(this.map);
      }
    }
  } */

  /* Delete New Routs */
  onDeleteRout(index: number) {
    this.routs.splice(index, 1);

    if (this.routs.length) {
      for (let i = 0; i < this.routs.length; i++) {
        this.routs[i].rightColor = this.getRoutColor(i);
      }
      for (let i = 1; i < 9; i++) {
        for (let j = 0; j < this.routs.length; j++) {
          if (this.routs[j].routName === `Route ${i}`) {
            this.routs[j].routName = '';
          }
        }
      }
      for (let j = 0; j < this.routs.length; j++) {
        if (this.routs[j].routName === '') {
          this.routs[j].routName = `Route ${j + 1}`;
        }
      }
      this.deleteRender(index, true);
      /* this.setRoutsStrokeWidth(); */
    } else {
      this.createDefaultRoute();
    }
    this.checkToRemuveDeleteOption();
    this.checkIfThereAreActive();
    this.routesLengthMax = this.routs.length === 8;
    localStorage.setItem('routsData', JSON.stringify(this.routs));
  }

  /* Activate Or Deactivate Rout */
  onRout(index: number) {
    this.routs[index].active = !this.routs[index].active;
    for (let i = 0; i < this.routs.length; i++) {
      this.routs[i].addScroll = false;
    }

    this.onResizeRoutesContainer();
    this.places[index].active = !this.places[index].active;
    this.markers[index].active = !this.markers[index].active;

    if (this.routs[index]?.active) {
      this.currentlyFocusedRoute = index;
      this.showAddNewPlace = index;
      this.hideRegularInput = false;
      this.currentlyFocusedPlace = -1;
      this.fokusOnInput('insertPlace', index);
      this.places[index].shownOnMap = true;
      this.searchRoute(index);
      this.setBounds(this.markers[index]);
    } else {
      this.hideRoute(index);
    }

    this.routs[index].rightColorHight = this.calculateHeight(index);
    localStorage.setItem('routsData', JSON.stringify(this.routs));
    this.checkIfThereAreActive();
  }

  searchRoute(index: number) {
    let chekIfHas = false;
    for (let i = 0; i < this.allRenderInArray.length; i++) {
      if (
        this.places[index].renderOptions.polylineOptions.strokeColor ===
        this.allRenderInArray[i].color
      ) {
        chekIfHas = true;
        break;
      }
    }
    if (chekIfHas) {
      this.showRoute(index);
    } else {
      this.getDirectionOfRout(index);
    }
  }

  showRoute(index: number) {
    for (let i = 0; i < this.allRenderInArray.length; i++) {
      if (
        this.places[index].renderOptions.polylineOptions.strokeColor ===
        this.allRenderInArray[i].color
      ) {
        this.allRenderInArray[i].active = true;
        this.allRenderInArray[i].borderOfRoute.setMap(this.map);
        this.allRenderInArray[i].renderArrayItem.setMap(this.map);
      }
    }
  }

  hideRoute(index: number) {
    for (let i = 0; i < this.allRenderInArray.length; i++) {
      if (
        this.places[index].renderOptions.polylineOptions.strokeColor ===
        this.allRenderInArray[i].color
      ) {
        this.allRenderInArray[i].active = false;
        this.allRenderInArray[i].borderOfRoute.setMap(null);
        this.allRenderInArray[i].renderArrayItem.setMap(null);
      }
    }
  }

  deleteRender(index: number, isDeleteRoute?: boolean) {
    const copyOfActiveRender = [];
    if (isDeleteRoute) {
      for (let i = 0; i < this.allRenderInArray.length; i++) {
        this.allRenderInArray[i].active = false;
        this.allRenderInArray[i].borderOfRoute.setMap(null);
        this.allRenderInArray[i].renderArrayItem.setMap(null);
      }
      this.allRenderInArray = [];
      this.multipleRequest = [];
      this.places = [];
      this.markers = [];
      for (let i = 0; i < this.routs.length; i++) {
        this.getDirectionOfRout(i, true);
      }
    } else {
      for (let i = 0; i < this.allRenderInArray.length; i++) {
        if (
          this.places[index].renderOptions.polylineOptions.strokeColor !==
          this.allRenderInArray[i].color
        ) {
          copyOfActiveRender.push(this.allRenderInArray[i]);
        }
        this.allRenderInArray[i].borderOfRoute.setMap(null);
        this.allRenderInArray[i].renderArrayItem.setMap(null);
      }
      this.allRenderInArray = [];
      this.allRenderInArray = copyOfActiveRender;
    }
  }

  /* Open Input To Change Rout Name */
  onRenameRout(index: number) {
    this.showRoutDropDown = -1;
    let isDefaultRouteName = false;
    for (let i = 1; i < 9; i++) {
      if (this.routs[index].routName === 'Route ' + i) {
        isDefaultRouteName = true;
      }
    }

    if (isDefaultRouteName) {
      this.routName = '';
    } else {
      this.routName = this.routs[index].routName;
    }

    this.showRenameRout = index;
    let count = 0;
    const interval = setInterval(() => {
      document.getElementById('rename' + index).focus();
      count++;
      if (count === 1) {
        clearInterval(interval);
      }
    }, 100);
  }

  /* Save New Route Name */
  onSaveNewRoutName(index: number) {
    if (this.routName === '') {
      this.routs[index].routName = 'Route ' + (index + 1);
    } else {
      this.routs[index].routName = this.routName;
    }
    localStorage.setItem('routsData', JSON.stringify(this.routs));
    let count = 0;
    const interval = setInterval(() => {
      this.showRenameRout = -1;
      this.checkToRemuveDeleteOption();
      count++;
      if (count === 1) {
        clearInterval(interval);
      }
    }, 100);
  }

  /* Save New Route Name On Enter*/
  onEnterSaveNewRoutName(event: any, index: number) {
    const key = event.keyCode;
    if (key === 13) {
      event.preventDefault();
      this.onSaveNewRoutName(index);
    }
  }

  /* Add New Place */
  onAddNewPlace(index: number) {
    this.onDetailRoutFokus(index);
    this.removeEmptyLocations();
    this.routAddress = '';
    this.showAddNewPlace = index;
    this.hideRegularInput = false;
    this.canUseUpAndDown = true;
    this.internalAddPlace = false;
    this.currentlyFocusedPlace = -1;
    for (let i = 0; i < this.routs.length; i++) {
      this.routs[i].rightColorHight = this.calculateHeight(i);
    }
    this.routs[index].rightColorHight = this.calculateHeight(index);
    localStorage.setItem('routsData', JSON.stringify(this.routs));
    let count = 0;
    const interval = setInterval(() => {
      document.getElementById('insertPlace' + this.showAddNewPlace).focus();
      this.openAddNewPlaceOnEnter = true;
      this.savedIdnex = index;
      count++;
      if (count === 1) {
        clearInterval(interval);
      }
    }, 100);
  }

  /* Close On Adding New Place */
  onCloseAddNew(index: number) {
    this.openAddNewPlaceOnEnter = false;
    this.showAddNewPlace = -1;
    this.routAddress = '';
    this.routs[index].rightColorHight = this.calculateHeight(index);
  }

  /* Save New Place In Rout */
  onSaveNewPlace(index: number, indexOfPlace?: number) {
    const data = {
      lat: this.lat,
      long: this.long,
      address: this.address,
      formatedAddress: this.formatedAddress,
      distance: 0,
      totalDistance: 0,
    };

    if (indexOfPlace || indexOfPlace === 0) {
      this.routs[index].places[indexOfPlace] = data;
    } else {
      this.routs[index].places.push(data);
      for (let i = 0; i < this.routs[index].places.length; i++) {
        if (this.routs[index].places[i].emptyPlace) {
          this.routs[index].places.splice(i, 1);
          break;
        }
      }
    }

    this.routAddress = '';
    this.internalAddPlace = false;
    this.hideRegularInput = false;
    this.showAddNewPlace = index;
    this.fokusOnInput('insertPlace', index);
    this.routs[index].rightColorHight = this.calculateHeight(index);

    if (this.routs[index].places.length > 1) {
      this.routs[index].placesExists = true;
      this.onCalculateDistanceBetweenMarkers(index);
    }

    this.calculatesHeightOfRouteContainer(this.routs);
    localStorage.setItem('routsData', JSON.stringify(this.routs));
    this.getDirectionOfRout(index, false);

    this.setBounds(this.markers[index]);
  }

  /* Delete Place */
  onDeletePlace(i: number, j: number) {
    if (!this.internalAddPlace) {
      this.routs[i].places.splice(j, 1);
      this.routs[i].rightColorHight = this.calculateHeight(i);
      if (this.routs[i].places.length > 1) {
        this.onCalculateDistanceBetweenMarkers(i);
      } else {
        this.routs[i].placesExists = false;
      }
      for (let i = 0; i < this.routs.length; i++) {
        this.routs[i].addScroll = false;
      }
      this.calculatesHeightOfRouteContainer(this.routs);
      localStorage.setItem('routsData', JSON.stringify(this.routs));
      this.deleteRender(i);
      this.getDirectionOfRout(i, false);
      /* this.showAllMarkers();
      this.hideMarkersOfNotFocusedRoute(i); */
      this.setBounds(this.markers[i]);
      this.currentlyFocusedRoute = i;
      this.currentlyFocusedPlace = -1;
    }
  }

  /* Calculate Distance of Markers*/
  onCalculateDistanceBetweenMarkers(i: number) {
    if (this.routs[i].placesExists) {
      /* Set all distance and totalDistance to 0 km or miles */
      for (let j = 0; j < this.routs[i].places.length; j++) {
        this.routs[i].places[j].distance = 0;
        this.routs[i].places[j].totalDistance = 0;
      }
      /* For  Calculate Distance*/
      for (let j = 1; j < this.routs[i].places.length; j++) {
        if (
          this.routs[i].places[j].lat !== undefined &&
          this.routs[i].places[j].long !== undefined
        ) {
          const firstAddress = new google.maps.LatLng(
            this.routs[i].places[j - 1].lat,
            this.routs[i].places[j - 1].long
          );
          const secondAddress = new google.maps.LatLng(
            this.routs[i].places[j].lat,
            this.routs[i].places[j].long
          );

          let distance: number;
          /* Chack if miles or km */
          if (this.appTaSwitchData[0].data[0].checked) {
            distance =
              google.maps.geometry.spherical.computeDistanceBetween(firstAddress, secondAddress) *
              0.000621371;
          } else {
            distance =
              google.maps.geometry.spherical.computeDistanceBetween(firstAddress, secondAddress) /
              1000.0;
          }

          this.routs[i].places[j].distance = distance;
          this.routs[i].places[j].totalDistance =
            this.routs[i].places[j - 1].totalDistance + this.routs[i].places[j].distance;
        }
      }
      for (let j = 1; j < this.routs[i].places.length; j++) {
        this.routs[i].places[j].distance = Math.round(this.routs[i].places[j].distance);
        this.routs[i].places[j].totalDistance = Math.round(this.routs[i].places[j].totalDistance);
      }
    }
  }

  /* Switch Change */
  switchChange(event: any) {
    if (event[0].inputName === 'unit') {
      if (event[0].checked) {
        this.onCovertKmOrMiles('Miles');
      } else {
        this.onCovertKmOrMiles('Km');
      }
    } else if (event[0].inputName === 'border') {
      this.startRouteSwitchAnimatin(0, undefined);
      if (event[0].checked) {
        localStorage.setItem('routingSettingsBorders', JSON.stringify({ open: true }));
      } else {
        localStorage.setItem('routingSettingsBorders', JSON.stringify({ open: false }));
      }
    } else {
      if (event[0].checked) {
        localStorage.setItem('routingSettingsTolls', JSON.stringify({ avoid: true }));
      } else {
        localStorage.setItem('routingSettingsTolls', JSON.stringify({ avoid: false }));
      }
    }
  }

  /* Route Style When Traffic Is On */
  /* renderRoutesTrafficStyle(isTrufficOn: boolean) {
    if (isTrufficOn) {
      for (let i = 0; i < this.allRenderInArray.length; i++) {
        if (this.allRenderInArray[i].active) {
          this.allRenderInArray[i].borderOfRoute.setMap(this.map);
        }
      }
    } else {
      for (let i = 0; i < this.allRenderInArray.length; i++) {
        if (this.allRenderInArray[i].active) {
          this.allRenderInArray[i].borderOfRoute.setMap(null);
        }
      }
    }
  } */

  drawAllActive(index?: number, finis?: boolean) {
    if (!finis) {
      let i;
      if (index) {
        i = index;
      } else {
        i = 0;
      }
      if (this.places[i].active) {
        for (let j = 0; j < this.places[i].gropuOfWaypoints.length; j++) {
          if (this.places[i].gropuOfWaypoints[j]) {
            this.drawRoute(this.places[i].gropuOfWaypoints[j]);
          }
        }
        this.multipleRequest.push({
          id: i,
          request: this.requestArray,
          renderOptions: this.places[i].renderOptions,
        });
        this.drawNextRoute(i);
      } else {
        this.drawNextRoute(i);
      }
    } else {
      this.setMultipleRequest(0);
    }
  }

  setMultipleRequest(i: number) {
    if (this.multipleRequest[i]?.request && this.multipleRequest[i]?.request.length) {
      this.requestArray = this.multipleRequest[i].request;
      this.renderOption = this.multipleRequest[i].renderOptions;
      this.pausedIndex = i + 1;
      this.processRequests();
    } else {
      if (this.multipleRequest[i]) {
        this.pausedIndex = i + 1;
        this.setMultipleRequest(this.pausedIndex);
      }
    }
  }

  drawNextRoute(i: number) {
    this.requestArray = [];
    if (i < this.places.length - 1) {
      i++;
      if (this.places[i].active) {
        this.drawAllActive(i);
      } else {  
        this.drawNextRoute(i);
      }
    } else {
      this.drawAllActive(i, true);
    }
  }

  drawGivenRoute(place: any, renderOption: any) {
    for (let i = 0; i < place.length; i++) {
      this.drawRoute(place[i]);
    }
    this.renderOption = renderOption;
    this.processRequests();
  }

  drawRoute(place: any) {      
    const start = new google.maps.LatLng(place.originLatLong.lat, place.originLatLong.long);
    const end = new google.maps.LatLng(place.destinationLatLong.lat, place.destinationLatLong.long);
    const newWaypoints = [];

    for (let j = 0; j < place.waypoints.length; j++) {
      newWaypoints.push({
        location: place.waypoints[j].location,
        stopover: true,
      });
    }

    let request = {};
    if (newWaypoints.length) {
      request = {
        origin: start,
        destination: end,
        waypoints: newWaypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        avoidTolls: this.appTaSwitchData[2].data[0].checked,
        region: this.appTaSwitchData[1].data[0].checked ? '' : 'US',
      };
    } else {
      request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING,
        avoidTolls: this.appTaSwitchData[2].data[0].checked,
        region: this.appTaSwitchData[1].data[0].checked ? '' : 'US',
      };
    }

    this.requestArray.push({ route: place, request });
  }

  processRequests() {
    const i = 0;
    this.submitRequest(i);
  }

  submitRequest(i: number) {
    if (this.requestArray[i]?.request) {
      this.directionsService.route(this.requestArray[i].request, (result, status) => {
        if (status == google.maps.DirectionsStatus.OK) {
          const interval = setInterval(() => {
            this.delaySubmitRequest(i, result);
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
    if (i <= this.requestArray.length - 1) {
      this.submitRequest(i);
    } else {
      if (this.isFirstLoad) {
        this.setMultipleRequest(this.pausedIndex);
      } else {
        this.requestArray = [];
      }
      return;
    }
  }

  startRouteSwitchAnimatin(index: number, interval: any) {
    if(interval){
      clearInterval(interval);
    }

    for (let i = 0; i < this.allRenderInArray.length; i++) {
      if (
        this.places[index].renderOptions.polylineOptions.strokeColor ===
          this.allRenderInArray[i].color &&
        this.places[index].shownOnMap
      ) {
        const zIndexRenderArrayItem = this.allRenderInArray[i].renderArrayItem.polylineOptions.zIndex;
        const zIndexBorderOfRoute = this.allRenderInArray[i].borderOfRoute.polylineOptions.zIndex;
        this.setZIndexForAnimation(101, 100, i, false, index, undefined);

        const indexInterval = setInterval(() => {
          this.setZIndexForAnimation(zIndexRenderArrayItem, zIndexBorderOfRoute , i, true, index, indexInterval);
        }, 1000);
      }
    }
  }

  setZIndexForAnimation(zIndexRenderArrayItem: number, zIndexBorderOfRoute: number, i: number, reset: boolean, curentIndex: number, interval: any){

    if(interval){
      clearInterval(interval);
    }
    this.allRenderInArray[i].active = false;
    this.allRenderInArray[i].borderOfRoute.setMap(null);
    this.allRenderInArray[i].renderArrayItem.setMap(null);
    this.allRenderInArray[i].borderOfRoute.polylineOptions.zIndex = zIndexBorderOfRoute;
    this.allRenderInArray[i].renderArrayItem.polylineOptions.zIndex = zIndexRenderArrayItem;
    this.allRenderInArray[i].active = true;
    this.allRenderInArray[i].borderOfRoute.setMap(this.map);
    this.allRenderInArray[i].renderArrayItem.setMap(this.map);


    if(reset){
      let nextIndex = curentIndex;

      if(nextIndex < 6){
        nextIndex++;
      }else{
        nextIndex = 0;
      }

      const interval = setInterval(() => {
        this.startRouteSwitchAnimatin(nextIndex, interval);
      }, 1000);
    }
  } 

  /* Zoom On Route */
  setBounds(markers: any) {
    const routMaker = markers.routMaker;
    if (this.previousMarkerBounds !== routMaker) {
      if (routMaker.length > 1) {
        const bounds = new google.maps.LatLngBounds();
        this.previousMarkerBounds = bounds;
        for (const marker of routMaker) {
          bounds.extend({
            lat: marker.lat,
            lng: marker.long,
          });
        }
        if (this.previousBounds !== bounds) {
          this.previousBounds = bounds;
          this.map.setCenter(bounds.getCenter());
          this.map.panToBounds(bounds);
          let count = 0;
          const interval = setInterval(() => {
            this.map.fitBounds(bounds);
            this.map.setZoom(this.map.getZoom() - 0.8);
            count++;
            if (count === 1) {
              clearInterval(interval);
            }
          }, 400);
        }
      }
      this.previousMarkerBounds = routMaker;
    }
  }

  /* Print Selected Route */
  printDiv() {
    for (let i = 0; i < this.places[this.selectedRouteForPrint].gropuOfWaypoints.length; i++) {
      this.placesToPrint.push(this.places[this.selectedRouteForPrint].gropuOfWaypoints[i]);
    }

    let count = 0;
    const interval = setInterval(() => {
      const printContents = document.getElementById('printableArea').innerHTML;
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();

      count++;
      if (count === 1) {
        clearInterval(interval);
      }
    }, 4000);
  }

  /* Delay Google Request */
  delaySubmitRequest(i: number, result) {
    /* Border Of Route */
    this.renderBorderArray[i] = new google.maps.DirectionsRenderer();
    this.renderBorderArray[i].setMap(this.map);
    this.renderBorderArray[i].setOptions({
      preserveViewport: true,
      suppressInfoWindows: false,
      polylineOptions: {
        strokeWeight: 5,
        strokeOpacity: 1,
        strokeColor: this.renderOption.polylineOptions.strokeColor,
        zIndex: this.renderOption.polylineOptions.zIndex,
      },
      markerOptions: {
        visible: false,
      },
    });
    this.renderBorderArray[i].setDirections(result);

    /* Route */
    this.renderArray[i] = new google.maps.DirectionsRenderer();
    this.renderArray[i].setMap(this.map);
    this.renderArray[i].setOptions({
      preserveViewport: true,
      suppressInfoWindows: false,
      polylineOptions: {
        strokeWeight: 3,
        strokeOpacity: 1,
        strokeColor: this.getRoutPathColor(this.renderOption.polylineOptions.strokeColor),
        zIndex: this.renderOption.polylineOptions.zIndex + 2,
      },
      markerOptions: {
        visible: false,
      },
    });
    this.renderArray[i].setDirections(result);

    this.allRenderInArray.push({
      borderOfRoute: this.renderBorderArray[i],
      renderArrayItem: this.renderArray[i],
      color: this.renderOption.polylineOptions.strokeColor,
      routeDirectionsData: result,
      active: true,
    });
    this.nextRequest(i);
  }

  foucsOutOnRout() {
    this.currentlyFocusedRoute = -1;
    this.setZIndexOfRoute();
  }

  /* Get Color For Path On Map */
  getRoutPathColor(strokeColor: string) {
    let color: string;

    if (strokeColor === '#A14502') {
      color = '#FFA60D';
    } else if (strokeColor === '#9E8900') {
      color = '#FFDC4D';
    } else if (strokeColor === '#4E5D2A') {
      color = '#D3FF67';
    } else if (strokeColor === '#426B2C') {
      color = '#03FF79';
    } else if (strokeColor === '#355988') {
      color = '#78CEFF';
    } else if (strokeColor === '#2D635E') {
      color = '#97FFF8';
    } else if (strokeColor === '#4F2E6B') {
      color = '#FF60FA';
    } else {
      color = '#FF5353';
    }

    return color;
  }

  /* Set Zindex Of Route When Fokus On It */
  setZIndexOfRoute(index?: number) {
    console.log('Ulazi postavi index');
    if (index || index === 0) {
      for (let i = 0; i < this.allRenderInArray.length; i++) {
        if (this.allRenderInArray[i].color === this.routs[index].rightColor) {
          this.allRenderInArray[i].renderArrayItem.polylineOptions.zIndex = 30;
          this.allRenderInArray[i].borderOfRoute.polylineOptions.zIndex = 29;
        } else {
          this.allRenderInArray[i].renderArrayItem.polylineOptions.zIndex = 3;
          this.allRenderInArray[i].borderOfRoute.polylineOptions.zIndex = 2;
        }
      }
      for (let i = 0; i < this.allRenderInArray.length; i++) {
        if (this.allRenderInArray[i].active) {
          this.allRenderInArray[i].borderOfRoute.setMap(null);
          this.allRenderInArray[i].borderOfRoute.setMap(this.map);
          this.allRenderInArray[i].renderArrayItem.setMap(null);
          this.allRenderInArray[i].renderArrayItem.setMap(this.map);
        }
      }
    } else {
      for (let i = 0; i < this.allRenderInArray.length; i++) {
        this.allRenderInArray[i].renderArrayItem.polylineOptions.zIndex = 3;
        this.allRenderInArray[i].borderOfRoute.polylineOptions.zIndex = 2;
      }
      for (let i = 0; i < this.allRenderInArray.length; i++) {
        if (this.allRenderInArray[i].active) {
          this.allRenderInArray[i].borderOfRoute.setMap(null);
          this.allRenderInArray[i].borderOfRoute.setMap(this.map);
          this.allRenderInArray[i].renderArrayItem.setMap(null);
          this.allRenderInArray[i].renderArrayItem.setMap(this.map);
        }
      }
    }

    console.log(this.allRenderInArray);
  }

  /* Covert To Other Unit */
  onCovertKmOrMiles(convertTo: string) {
    for (let i = 0; i < this.routs.length; i++) {
      this.onCalculateDistanceBetweenMarkers(i);
    }
    if (convertTo === 'Miles') {
      localStorage.setItem('routingSettingsUnit', JSON.stringify({ miles: true }));
    } else {
      localStorage.setItem('routingSettingsUnit', JSON.stringify({ miles: false }));
    }
    localStorage.setItem('routsData', JSON.stringify(this.routs));
  }

  /* Show Legend */
  onShowLegend() {
    this.showLegend = !this.showLegend;
    this.legendBtnClicked = true;
  }

  /* Zoom control */
  onZoom(isZoom: boolean) {
    this.zoom = this.map.zoom;
    if (isZoom) {
      this.zoom++;
    } else {
      this.zoom--;
    }
  }

  /* Zoom On Marker Mouse Wheel Event  */
  onMouseWheel(event: any) {
    this.onZoom(event.deltaY < 0);
  }

  /* Get Color Of Route */
  getRoutColor(lenght: number) {
    let color: string;
    switch (lenght) {
      case 0:
        color = '#A14502';
        break;
      case 1:
        color = '#9E8900';
        break;
      case 2:
        color = '#4E5D2A';
        break;
      case 3:
        color = '#426B2C';
        break;
      case 4:
        color = '#355988';
        break;
      case 5:
        color = '#2D635E';
        break;
      case 6:
        color = '#4F2E6B';
        break;
      case 7:
        color = '#871616';
        break;
    }

    return color;
  }

  /* Get Map Instance */
  mapReady(event) {
    this.map = event;
    this.trafficLayer = new google.maps.TrafficLayer();

    this.timeZones = new geoXML3.parser({
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

  /* Toll Roads */
  onTollRoads() {
    for (let i = 0; i < this.tollRoads.length; i++) {
      if (this.tollRoads[i].docs.length) {
        if (!this.isTollRoadsActive) {
          this.tollRoads[i].showDocument();
        } else {
          this.tollRoads[i].hideDocument();
        }
      } else {
        this.tollRoads[i].parse(this.tollRoadsKml[i].state);
      }
    }
    this.isTollRoadsActive = !this.isTollRoadsActive;
  }

  /* Timezone */
  onTimeZone() {
    if (this.timeZones.docs.length) {
      if (!this.isTimeZoneActive) {
        this.timeZones.showDocument();
      } else {
        this.timeZones.hideDocument();
      }
      this.isTimeZoneActive = !this.isTimeZoneActive;
    } else {
      this.timeZones.parse(this.kmlUrl);
      this.isTimeZoneActive = true;
    }
  }

  /* Doppler Radar */
  onDoppler() {
    this.isDopplerOn = !this.isDopplerOn;
    this.onToggleDoppler(this.isDopplerOn);
  }

  /* On Off Doppler Radar */
  onToggleDoppler(on: boolean) {
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
          this.isDopplerOn = false;
        }
      }, 400);
    } else {
      clearInterval(this.dopplerInterval);
    }
  }

  /* Show Or Hide Traffic */
  onRenderTrafficLayer() {
    this.trafficLayerShow = !this.trafficLayerShow;
    let count = 0;
    const interval = setInterval(() => {
      if (this.trafficLayerShow) {
        this.trafficLayer.setMap(this.map);
        localStorage.setItem('routingTraffic', JSON.stringify({ show: true }));
      } else {
        this.trafficLayer.setMap(null);
        localStorage.setItem('routingTraffic', JSON.stringify({ show: false }));
      }
      count++;
      if (count === 1) {
        clearInterval(interval);
      }
    }, 200);

    /* this.renderRoutesTrafficStyle(this.trafficLayerShow); */
  }

  ngOnDestroy(): void {
    for (let i = 0; i < this.routs.length; i++) {
      this.routs[i].rightColorHight = this.calculateHeight(i);
    }
    localStorage.setItem('routsData', JSON.stringify(this.routs));
    document.body.classList.remove('routing-page');

    clearInterval(this.dopplerInterval);
  }
}
