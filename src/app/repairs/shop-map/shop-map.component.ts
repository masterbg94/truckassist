import { takeUntil } from 'rxjs/operators';
import { TableData } from './../../shared/truckassist-table/models/truckassist-table';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import * as AppConst from '../../const';
import { AppSharedService } from 'src/app/core/services/app-shared.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { RepairShopManageComponent } from 'src/app/shared/app-repair-shop/repair-shop-manage/repair-shop-manage.component';
import { ManageRepairShop, RepairShops } from 'src/app/core/model/shared/repairShop';
import { ToastrService } from 'ngx-toastr';
import { MaintenanceService } from 'src/app/core/services/maintenance.service';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { formatPhoneNumber } from 'src/app/core/helpers/formating';
import { Comments } from 'src/app/core/model/comment';
import { forkJoin, Subject } from 'rxjs';
import { SearchDataService } from 'src/app/core/services/search-data.service';
import { ReveiwService } from 'src/app/core/services/reveiw.service';
import { TruckTrailerMaintenance } from 'src/app/core/model/shared/maintenance';
import { DateFilter } from 'src/app/core/model/date-filter';
import { RoutingFullscreenService } from 'src/app/core/services/routing-fullscreen.service';
import { GoogleMapsAPIWrapper } from '@agm/core';
/* import MarkerClusterer from '@googlemaps/markerclustererplus'; */
declare let MarkerClusterer: any;
@Component({
  selector: 'app-shop-map',
  templateUrl: './shop-map.component.html',
  styleUrls: ['./shop-map.component.scss'],
})
export class ShopMapComponent implements OnInit, OnChanges, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  @Input() tableShopData: TableData;

  types = [
    { option: 'Truck', active: false },
    { option: 'Trailer', active: false },
    { option: 'Mobile', active: false },
    { option: 'Shop', active: false },
    { option: 'Towing', active: false },
    { option: 'Parts', active: false },
    { option: 'Tire', active: false },
    { option: 'Dealer', active: false },
  ];

  typesSelected = [];
  activeBtn = 3;
  movePoints = false;

  renderOptions = {
    suppressMarkers: true,
    polylineOptions: {
      strokeColor: '#28529F',
    },
  };

  markerOptions = {
    origin: {
      icon: '../../../../assets/img/NewStartPoint.svg',
    },
    destination: {
      icon: '../../../../assets/img/NewEndPoint.svg',
    },
  };

  markerReiting = [];
  markerReitingCopy = [];
  markerReitingBackup = [];

  shopReting = [];

  @ViewChild('startPoint') startPoint: GooglePlaceDirective;
  @ViewChild('endPoint') endPoint: GooglePlaceDirective;
  styles = AppConst.GOOGLE_MAP_STYLES;
  mapRestrictions = {
    latLngBounds: AppConst.NORTH_AMERICA_BOUNDS,
    strictBounds: true,
  };
  mapOptions = {
    latitude: 38.3357027,
    longitude: -99.8558299,
  };
  zoom = 1;
  origin: string;
  destination: string;
  originPom = '';
  destinationPom = '';
  repairShops: ManageRepairShop[];
  frShops: any[];
  rShops: any[];
  shopDataList: any[];
  frShopsBackUp: any[];
  rShopsBackUp: any[];
  repairShopRatingList = [];
  textArea = 0;
  rating: number;
  options = {
    types: ['(cities)'],
    componentRestrictions: { country: ['US', 'CA'] },
  };

  markersForPinned = [
    { count: 0, marker: '../../../../assets/img/svgs/markers-map/Marker-No-Types-Fav.svg' },
    { count: 1, marker: '../../../../assets/img/svgs/markers-map/1-fav.svg' },
    { count: 2, marker: '../../../../assets/img/svgs/markers-map/2-fav.svg' },
    { count: 3, marker: '../../../../assets/img/svgs/markers-map/3-fav.svg' },
    { count: 4, marker: '../../../../assets/img/svgs/markers-map/4-fav.svg' },
    { count: 5, marker: '../../../../assets/img/svgs/markers-map/5-fav-new.svg' },
    { count: 6, marker: '../../../../assets/img/svgs/markers-map/5-plus-fav.svg' },
  ];

  markersForNotPinned = [
    { count: 0, marker: '../../../../assets/img/svgs/markers-map/Marker-No-Types.svg' },
    { count: 1, marker: '../../../../assets/img/svgs/markers-map/1.svg' },
    { count: 2, marker: '../../../../assets/img/svgs/markers-map/2.svg' },
    { count: 3, marker: '../../../../assets/img/svgs/markers-map/3.svg' },
    { count: 4, marker: '../../../../assets/img/svgs/markers-map/4.svg' },
    { count: 5, marker: '../../../../assets/img/svgs/markers-map/5.svg' },
    { count: 6, marker: '../../../../assets/img/svgs/markers-map/5-plus.svg' },
  ];

  closeInfoWindow = -1;
  lat;
  long;
  showShopInfo = -1;
  countForMarker = 0;
  markerCliked: boolean;
  copyPhoneDrop: boolean;
  copyAddressDrop: boolean;
  copyEmailDrop: boolean;
  shopRairingId: number;
  noAnimation = false;
  textAreaClicked: boolean;
  markerClickCount = 0;
  isEnter: boolean;
  isFirstLoad = true;
  map: any;
  fullScreenMode = false;
  shopsInCluster = [
    { name: 'W & B Service Co' },
    { name: 'Truck Space' },
    { name: 'Utility trailer sales Southeast Test Test' },
    { name: 'THE GOODYEAR TIRE & RUBBER CO Test Test' },
  ];
  firstLoad = true;
  @ViewChild('favoriteList') favoriteList: any;
  @ViewChild('regularList') regularList: any;
  countOfFavorites = 0;
  countOfRegular = 0;
  searchOnFavorite: boolean;
  searchOnRegular: boolean;

  clusterStyles = [
    {
      fontWeight: '700',
      textSize: 15,
      textColor: '#5673AA',
      url: '../../../assets/img/png/shop-cluster.png',
      height: 46,
      width: 46,
    },
  ];

  clusterDropdownData = [];
  clusterLocation = {
    lat: undefined,
    long: undefined,
  };
  isClusterDropDownOpened: boolean;
  markersInCluster: any;
  mapInitialization: boolean;

  constructor(
    private sharedService: AppSharedService,
    private shared: SharedService,
    private customModalService: CustomModalService,
    private toastr: ToastrService,
    private elementRef: ElementRef,
    private maintenanceServise: MaintenanceService,
    private searchDateService: SearchDataService,
    private reveiwService: ReveiwService,
    private mapModeServise: RoutingFullscreenService,
    @Inject(ChangeDetectorRef) private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.collectShopsData(this.tableShopData, false);

    /* Filter On Type Selected */
    this.mapModeServise.currentTypeSelected
      .pipe(takeUntil(this.destroy$))
      .subscribe((filterTypeData) => {
        if (filterTypeData) {
          this.onType(filterTypeData);
        }
      });

    let isFirstLoad = true;
    this.maintenanceServise.currentShop.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      let isEdit: boolean;
      if (!isFirstLoad) {
        for (let marker of this.markerReiting) {
          if (marker.id === res.id) {
            isEdit = true;
            /* Formating Address */
            const address = res.doc.address.address ? res.doc.address.address : '';
            let formatedAddres = '';
            for (const c of address) {
              if (c !== ',') {
                formatedAddres += c;
              } else {
                break;
              }
            }
            /* Edit Marker */
            marker = {
              marker: marker.marker,
              latitude: res.latitude,
              longitude: res.longitude,
              name: res.name,
              phone: res.doc.phone,
              email: res.doc.email,
              stret: formatedAddres,
              address: res.doc.address,
              de: res.doc.types[7].checked,
              ti: res.doc.types[6].checked,
              pa: res.doc.types[5].checked,
              sh: res.doc.types[3].checked,
              to: res.doc.types[4].checked,
              tru: res.doc.types[0].checked,
              tra: res.doc.types[1].checked,
              mo: res.doc.types[2].checked,
              numberOfServises: marker.numberOfServises,
              id: res.id,
              animation: 'DROP',
            };
          }
        }
      }

      if (!isEdit && !isFirstLoad) {
        this.repairShops.push(res);
        for (let i = 0; i < this.repairShops.length; i++) {
          if (this.repairShops[i].id === res.id) {
            this.setMarkers(this.repairShops[i]);
          }
        }
      }

      isFirstLoad = false;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tableShopData.currentValue) {
      this.markerReiting = [];
      this.collectShopsData(this.tableShopData, false);

      if (this.mapInitialization) {
        const interval = setInterval(() => {
          this.createCustomCluster();
          clearInterval(interval);
        }, 200);
      }
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: any) {
    const key = event.keyCode;
    if (key === 27) {
      /* Esc */
      if (this.fullScreenMode) {
        this.fullScreenMode = false;
      }
    }
  }

  @HostListener('document:click', ['$event.target'])
  onClick(target) {
    const clickedInside = this.elementRef.nativeElement.contains(target);

    /* Fokus in for Start And End points */
    if (clickedInside) {
      if (!this.textAreaClicked) {
        this.textArea = -1;
      }
      this.textAreaClicked = false;
    }

    /* Fokus Out For Start And End Points */
    if (!clickedInside) {
      this.textArea = -1;
      this.textAreaClicked = false;
    }

    /* FOCUS OUT FOR DROP DOWN ON MARKERS OUT */
    if (!clickedInside) {
      this.closeInfoWindow = -1;
      this.showShopInfo = -1;
      this.markerClickCount = 0;
    }

    /* FOCUS OUT FOR MARKERS CLICK IN */
    if (clickedInside && this.closeInfoWindow !== -1) {
      if (!this.markerCliked) {
        this.closeInfoWindow = -1;
        this.showShopInfo = -1;
        this.markerClickCount = 0;
      }
      if (this.markerCliked) {
        this.markerCliked = false;
      }
    }
    this.firstLoad = false;
  }

  /* Call Api For Repair Shops */
  getAllRepairShops(justLiked?: boolean) {
    if (!justLiked) {
      this.markerReiting = [];
    }
    const repairShops$ = this.sharedService.getRepairShops();
    const maintenance$ = this.maintenanceServise.getMaintenance();
    forkJoin([repairShops$, maintenance$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ([repairShops, maintenance]: [RepairShops, TruckTrailerMaintenance]) => {
          this.collectShopsData(repairShops, justLiked);
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  /* Collect Shops Data From Tabel Object */
  collectShopsData(repairShops: any, justLiked?: boolean) {
    if (this.isFirstLoad) {
      this.shopDataList = [];
    }
    this.repairShops = repairShops;

    this.reveiwService.sendShopRaitingData(this.repairShops);
    for (let i = 0; i < this.repairShops.length; i++) {
      let count = 0;

      this.shopDataList.push(this.getDataFromObject(this.repairShops[i]));

      for (let j = 0; j < this.repairShops[i].doc?.types?.length; j++) {
        if (this.repairShops[i].doc.types[j].checked) {
          count++;
        }
      }

      if (!justLiked) {
        this.setMarkers(this.repairShops[i]);
      }
    }
  }

  /* Get Data Of Repair Shop */
  getDataFromObject(shop: ManageRepairShop) {
    return {
      id: shop.id,
      companyID: shop.companyID,
      name: shop.name,
      status: shop.status,
      pinned: shop.pinned,
      latitude: shop.latitude,
      longitude: shop.longitude,
      upCount: shop.upCount,
      downCount: shop.downCount,
      thumbUp: shop.thumbUp,
      thumbDown: shop.thumbDown,
      latestComment: shop.latestComment,
      repairCount: shop.repairCount,
      total: shop.total,
      doc: shop.doc,
      show: true,
    };
  }

  /* New Shop */
  onAddShop() {
    const data = {
      type: 'new',
      id: null,
    };
    this.customModalService.openModal(RepairShopManageComponent, { data }, null, {
      size: 'small',
    });
  }

  /* For shop delete */
  onDeleteShop(shop: ManageRepairShop) {
    for (let i = 0; i < this.markerReiting.length; i++) {
      if (this.markerReiting[i].id === shop.id) {
        this.markerReiting.splice(i, 1);
      }
    }

    for (let i = 0; i < this.repairShops.length; i++) {
      if (this.repairShops[i].id === shop.id) {
        this.repairShops.splice(i, 1);
      }
    }
  }

  /* Pin and Unpin */
  onPin(shop: ManageRepairShop) {
    if (shop) {
      for (const repairShop of this.repairShops) {
        if (repairShop.id === shop.id) {
          repairShop.pinned = shop.pinned === 1 ? 0 : 1;
          this.getMarkerReiting(true, shop.id);
          break;
        }
      }
    }
  }

  /* Filter On Type */
  onType(shopTypes: any) {
    for (let i = 0; i < shopTypes.length; i++) {
      this.types[i].active = shopTypes[i].active;
    }

    this.typesSelected = [];
    for (let i = 0; i < this.types.length; i++) {
      if (this.types[i].active) {
        this.typesSelected.push({
          type: this.types[i].option,
          active: this.types[i].active,
        });
      }
    }
    if (this.typesSelected.length === 0) {
      this.markerReiting = this.markerReitingCopy;
      if (!this.markerReiting.length) {
        for (let i = 0; i < this.repairShops.length; i++) {
          this.setMarkers(this.repairShops[i]);
        }
      }
    } else {
      if (this.markerReitingCopy.length) {
        this.markerReiting = this.markerReitingCopy;
      }
      this.markerReitingCopy = [];
      for (let i = 0; i < this.markerReiting.length; i++) {
        this.markerReitingCopy.push(this.markerReiting[i]);
      }
      this.getMarkerReiting();
    }
  }

  /* On Marker Click */
  clickedMarker(index: number, marker: any) {
    this.markerClickCount++;
    this.markerCliked = true;
    if (this.closeInfoWindow !== index) {
      this.closeInfoWindow = index;
      this.showShopInfo = -1;
      this.markerClickCount = 1;
    }
    if (this.markerClickCount === 1) {
      this.closeInfoWindow = index;
    }

    if (this.markerClickCount === 2) {
      this.showShopInfo = index;
    }

    if (this.markerClickCount === 3) {
      this.showShopInfo = -1;
      this.closeInfoWindow = -1;
      this.markerClickCount = 0;
    }

    /* this.zoomOnMarker(marker) */
  }

  /* Set Markers On Map */
  setMarkers(shop: ManageRepairShop) {
    let count = 0;
    let marker: string;
    for (let j = 0; j < shop.doc?.types?.length; j++) {
      if (shop.doc.types[j].checked) {
        count++;
      }
    }

    if (shop.pinned) {
      for (let i = 0; i < this.markersForPinned.length; i++) {
        if (this.markersForPinned[i].count === count) {
          marker = this.markersForPinned[i].marker;
          break;
        }
      }
    } else {
      for (let i = 0; i < this.markersForNotPinned.length; i++) {
        if (this.markersForNotPinned[i].count === count) {
          marker = this.markersForNotPinned[i].marker;
          break;
        }
      }
    }

    /* Formating address */
    const address = shop?.doc?.address?.address ? shop?.doc?.address?.address : '';
    let formatedAddres = '';
    for (const c of address) {
      if (c !== ',') {
        formatedAddres += c;
      } else {
        break;
      }
    }

    if (shop.doc.types) {
      this.markerReiting.push({
        marker,
        latitude: shop.latitude,
        longitude: shop.longitude,
        name: shop.name,
        phone: shop.doc.phone,
        email: shop.doc.email,
        stret: formatedAddres,
        address: shop.doc.address,
        de: shop.doc.types[7].checked,
        ti: shop.doc.types[6].checked,
        pa: shop.doc.types[5].checked,
        sh: shop.doc.types[3].checked,
        to: shop.doc.types[4].checked,
        tru: shop.doc.types[0].checked,
        tra: shop.doc.types[1].checked,
        mo: shop.doc.types[2].checked,
        numberOfServises: count,
        id: shop.id,
        animation: 'DROP',
      });
    } else {
      this.markerReiting.push({
        marker,
        latitude: shop.latitude,
        longitude: shop.longitude,
        name: shop.name,
        phone: shop.doc.phone,
        email: shop.doc.email,
        stret: formatedAddres,
        address: shop.doc.address,
        de: false,
        ti: false,
        pa: false,
        sh: false,
        to: false,
        tru: false,
        tra: false,
        mo: false,
        numberOfServises: count,
        id: shop.id,
        animation: 'DROP',
      });
    }
  }

  /* Update Marker Or Filter On Type Selected */
  getMarkerReiting(justUpdate?: boolean, id?: number) {
    if (justUpdate) {
      let newMarker: string;
      for (let i = 0; i < this.repairShops.length; i++) {
        if (this.repairShops[i].id === id) {
          newMarker = this.getMarker(i, 0);
          break;
        }
      }
      for (const marker of this.markerReiting) {
        if (marker.id === id) {
          marker.marker = newMarker;
          marker.animation = 'BOUNCE';
          const interval = setInterval(() => {
            marker.animation = 'DROP';
            clearInterval(interval);
          }, 10);
          break;
        }
      }
    } else {
      const markersWithSelectedTypes = [];
      let count = 0;
      for (let i = 0; i < this.repairShops.length; i++) {
        for (let j = 0; j < this.repairShops[i].doc?.types?.length; j++) {
          for (let k = 0; k < this.typesSelected.length; k++) {
            if (
              this.typesSelected[k].type === this.repairShops[i].doc.types[j].name &&
              this.repairShops[i].doc.types[j].checked
            ) {
              count++;
            }
          }
        }

        if (count === this.typesSelected.length) {
          for (let j = 0; j < this.markerReiting.length; j++) {
            if (this.markerReiting[j].id === this.repairShops[i].id) {
              markersWithSelectedTypes.push(this.markerReiting[j]);
            }
          }
        }
        count = 0;
      }
      this.markerReiting = markersWithSelectedTypes;
    }
  }

  /* Get Marker For Shop On Map */
  getMarker(i: number, count2: number) {
    let markerPin: string;
    let marker: string;
    if (this.repairShops[i].pinned) {
      for (let k = 0; k < this.repairShops[i].doc?.types?.length; k++) {
        if (this.repairShops[i].doc.types[k].checked) {
          count2++;
        }
      }
      for (let p = 0; p < this.markersForPinned.length; p++) {
        if (count2 === this.markersForPinned[p].count) {
          markerPin = this.markersForPinned[p].marker;
        }
      }

      return markerPin;
    } else {
      for (let k = 0; k < this.repairShops[i].doc?.types?.length; k++) {
        if (this.repairShops[i].doc.types[k].checked) {
          count2++;
        }
      }
      for (let p = 0; p < this.markersForNotPinned.length; p++) {
        if (count2 === this.markersForNotPinned[p].count) {
          marker = this.markersForNotPinned[p].marker;
        }
      }

      return marker;
    }
  }

  /* Zoom On Marker */
  zoomOnMarker(marker: any) {
    const bounds = new google.maps.LatLngBounds();
    const latitude: number = +marker.latitude;
    const longitude: number = +marker.longitude;
    bounds.extend({
      lat: latitude,
      lng: longitude,
    });
    this.map.setCenter(bounds.getCenter());
    this.map.panToBounds(bounds);

    const interval = setInterval(() => {
      this.map.fitBounds(bounds);
      this.map.setZoom(this.map.getZoom() - 10);
      clearInterval(interval);
    }, 400);
  }

  /* Copy Text In Marker Info Window */
  onCopy(val: string, isPhone: boolean, isMail: boolean, isAddres: boolean) {
    if (isPhone) {
      this.copyPhoneDrop = true;
    }
    if (isMail) {
      this.copyEmailDrop = true;
    }
    if (isAddres) {
      this.copyAddressDrop = true;
    }

    const interval = setInterval(() => {
      this.copyPhoneDrop = false;
      this.copyEmailDrop = false;
      this.copyAddressDrop = false;
      clearInterval(interval);
    }, 600);

    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    if (isPhone) {
      selBox.value = formatPhoneNumber(val);
    } else {
      selBox.value = val;
    }
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  /* When TextArea Clicked */
  onTextArea(index: number) {
    this.textAreaClicked = true;
    this.textArea = index;
  }

  /* On Enter In TextArea */
  onEnterStart(event: any) {
    if (
      event.keyCode === 13 &&
      !event.shiftKey &&
      event.path !== undefined &&
      event.path !== null &&
      event.path[3].className !== 'ng-select-container ng-has-value'
    ) {
      event.preventDefault();
      this.textArea = 2;
      this.isEnter = true;
      document.getElementById('end_point').focus();
    }
  }

  /* Search Lat And Long Of Address */
  handleAddressChange(address: Address, i: number) {
    if (!this.isEnter) {
      this.textArea = 0;
    }
    this.isEnter = false;
    if (i === 1) {
      this.origin = address.formatted_address;
      if (this.destination === undefined) {
        this.getGeoLocation(this.origin);
      }
    } else {
      this.destination = address.formatted_address;
      if (this.origin === undefined) {
        this.getGeoLocation(this.destination);
      }
    }
  }

  /* Google Geocoding, Transform Address In Cords */
  getGeoLocation(address: string) {
    const axios = require('axios').default;
    axios
      .get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address,
          key: 'AIzaSyCw4WQw1T4N6TjFWdS731mM09x88SGW81I',
        },
      })
      .then((res) => {
        this.lat = res.data.results[0].geometry.location.lat;
        this.long = res.data.results[0].geometry.location.lng;
      })
      .catch((error) => {
        this.toastr.success(`Error: ${error}`, ' ');
      });
  }

  /* Delete Strat Point */
  onDeleteStartPoints() {
    this.textArea = 0;
    this.origin = undefined;
    this.originPom = '';
    this.lat = undefined;
    this.long = undefined;
    if (this.destination) {
      this.getGeoLocation(this.destination);
    }
    this.zoom = 1;
    if (this.origin === undefined && this.destination === undefined) {
      this.noAnimation = false;
    } else {
      this.noAnimation = true;
    }
  }

  /* Delete End Point */
  onDeleteEndPoints() {
    this.textArea = 0;
    this.destination = undefined;
    this.destinationPom = '';
    this.lat = undefined;
    this.long = undefined;
    if (this.origin) {
      this.getGeoLocation(this.origin);
    }
    this.zoom = 1;
    if (this.origin === undefined && this.destination === undefined) {
      this.noAnimation = false;
    } else {
      this.noAnimation = true;
    }
  }

  /* Get Map Instance */
  mapReady(event) {
    this.map = event;

    /* Create Custom Claster */
    this.createCustomCluster();
  }

  createCustomCluster() {
    /* If Cluster Drop Down Is Opened, Close It */
    if (this.isClusterDropDownOpened) {
      this.isClusterDropDownOpened = false;
    }

    /* Get Markers Data And Options */
    let arrayOfMarkers = [];
    var icon = {
      url: '',
      scaledSize: new google.maps.Size(0, 0),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(0, 0),
    };

    this.markerReiting.map((marker) => {
      let m = new google.maps.Marker({
        position: new google.maps.LatLng(parseFloat(marker.latitude), parseFloat(marker.longitude)),
        icon: icon,
      });

      arrayOfMarkers.push(m);
    });

    /* Set Cluster Options */
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
    if (this.markersInCluster) {
      google.maps.event.clearListeners(this.map, 'bounds_changed');
    }
    this.markersInCluster = new MarkerClusterer(this.map, arrayOfMarkers, mcOptions);
    this.mapInitialization = true;

    /* Add Click Listener On Cluster*/
    google.maps.event.addListener(this.markersInCluster, 'clusterclick', (cluster) => {
      this.clusterDropdownData = [];

      this.clusterLocation = {
        lat: cluster.center_.lat(),
        long: cluster.center_.lng(),
      };

      const markersInCluster = cluster.getMarkers();

      markersInCluster.forEach((element) => {
        const lat = element.getPosition().lat();
        const lng = element.getPosition().lng();

        this.markerReiting.forEach((marker) => {
          if (parseFloat(marker.latitude) === lat && parseFloat(marker.longitude) === lng) {
            this.clusterDropdownData.push(marker);
          }
        });
      });

      this.isClusterDropDownOpened = true;
    });
  }

  clusterDropDownIsToggled($isOpen: any) {
    this.isClusterDropDownOpened = $isOpen;
    this.changeDetectorRef.detectChanges();
  }

  onZoomMarkerInCluster(marker) {
    this.isClusterDropDownOpened = false;

    this.clusterLocation = {
      lat: undefined,
      long: undefined,
    };

    const bounds = new google.maps.LatLngBounds();

    bounds.extend({
      lat: parseFloat(marker.latitude),
      lng: parseFloat(marker.longitude),
    });

    const myLatlng = new google.maps.LatLng(marker.latitude, marker.longitude);

    this.map.panToBounds(bounds);
    this.map.panTo(myLatlng);
    const interval = setInterval(() => {
      this.map.setZoom(8);
      clearInterval(interval);
    }, 1000);
  }

  /* Activate Or Not Full Screen */
  onFullScreen(isFullScreen: boolean) {
    this.fullScreenMode = isFullScreen;
  }

  /* Zoom In Or Out */
  onZoom(zoom: boolean) {
    this.zoom = this.map.zoom;
    if (zoom) {
      this.zoom++;
    } else {
      this.zoom--;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
