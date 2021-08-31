import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { Subject } from 'rxjs';
import { TableData } from 'src/app/shared/truckassist-table/models/truckassist-table';
import * as AppConst from '../../../const';
import { ViolationManageComponent } from '../violation-manage/violation-manage.component';

declare let MarkerClusterer: any;
@Component({
  selector: 'app-violation-map',
  templateUrl: './violation-map.component.html',
  styleUrls: ['./violation-map.component.scss'],
})
export class ViolationMapComponent implements OnInit, OnChanges, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  @Input() tableShopData: TableData;
  markerInfoData: any = {
    latitude: 0,
    longitude: 0,
  };
  markerReiting = [];
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
  closeInfoWindow = false;
  lat;
  long;
  map: any;
  mapInitialization: boolean;
  fullScreenMode = false;

  clusterStyles = {
    styles: [
      {
        fontWeight: '700',
        textSize: 16,
        textColor: '#5673AA',
        url: '../../../assets/img/png/violation-map/violation-map-circle-1-9.png',
        height: 36,
        width: 36,
      },
      {
        fontWeight: '700',
        textSize: 16,
        textColor: '#5673AA',
        url: '../../../assets/img/png/violation-map/violation-map-circle-10-24.png',
        height: 42,
        width: 42,
      },
      {
        fontWeight: '700',
        textSize: 16,
        textColor: '#5673AA',
        url: '../../../assets/img/png/violation-map/violation-map-circle-25-49.png',
        height: 48,
        width: 48,
      },
      {
        fontWeight: '700',
        textSize: 16,
        textColor: '#5673AA',
        url: '../../../assets/img/png/violation-map/violation-map-circle-50-99.png',
        height: 54,
        width: 54,
      },
      {
        fontWeight: '700',
        textSize: 16,
        textColor: '#5673AA',
        url: '../../../assets/img/png/violation-map/violation-map-circle-100-199.png',
        height: 60,
        width: 60,
      },
      {
        fontWeight: '700',
        textSize: 16,
        textColor: '#5673AA',
        url: '../../../assets/img/png/violation-map/violation-map-circle-200-999.png',
        height: 68,
        width: 68,
      },
    ],
    calculator: (markers) => {
      for (const iterator of markers) {
        /* IF ELSE FOR REAL DATA */
        /*  if (markers.length >= 1 && markers.length <= 9) {
          return { text: markers.length, index: 1 };
        } else if (markers.length >= 10 && markers.length <= 24) {
          return { text: markers.length, index: 2 };
        } else if (markers.length >= 25 && markers.length <= 49) {
          return { text: markers.length, index: 3 };
        } else if (markers.length >= 50 && markers.length <= 99) {
          return { text: markers.length, index: 4 };
        } else if (markers.length >= 100 && markers.length <= 199) {
          return { text: markers.length, index: 5 };
        } else if (markers.length >= 200) {
          return { text: markers.length, index: 6 };
        } */

        /* DUMMY IF ELSE */
        if (markers.length === 1) {
          return { text: markers.length, index: 1 };
        } else if (markers.length === 2) {
          return { text: markers.length, index: 2 };
        } else if (markers.length === 3) {
          return { text: markers.length, index: 3 };
        }
      }
    },
  };

  clusterDropdownData = [];
  clusterLocation = {
    lat: undefined,
    long: undefined,
  };
  openClusterDropdown: boolean;
  violationIconData = [];
  constructor(
    private customModalService: CustomModalService,
    @Inject(ChangeDetectorRef) private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.collectShopsData(this.tableShopData);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tableShopData.currentValue) {
      this.markerReiting = [];
      this.collectShopsData(this.tableShopData);
      this.openClusterDropdown = false;
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

  collectShopsData(violationData: any) {
    violationData.forEach((element) => {
      this.setMarkers(element);
    });
  }

  onAddShop() {
    const data = {
      type: 'new',
      id: null,
    };
    this.customModalService.openModal(ViolationManageComponent, { data }, null, {
      size: 'small',
    });
  }

  onDeleteShop(shop) {}

  clickedMarker(index: number, marker: any) {
    this.closeInfoWindow = false;
    this.violationIconData = [
      {
        iconUrl: 'vl1',
        weight: marker.vl1,
      },
      {
        iconUrl: 'vl2',
        weight: marker.vl2,
      },
      {
        iconUrl: 'vl3',
        weight: marker.vl3,
      },
      {
        iconUrl: 'vl4',
        weight: marker.vl4,
      },
      {
        iconUrl: 'vl5',
        weight: marker.vl5,
      },
      {
        iconUrl: 'vl6',
        weight: marker.vl6,
      },
      {
        iconUrl: 'vl7',
        weight: marker.vl7,
      },
    ];
    this.markerInfoData = marker;
    this.zoomOnMarker(marker);
    this.closeInfoWindow = true;
  }

  setMarkers(shop) {
    let marker: string;
    marker = '../../../assets/img/png/violation-map/violation-map-circle-1-9.png';
    this.markerReiting.push({
      marker,
      customer: shop?.customer,
      driverFullName: shop?.driverFullName,
      eventDate: shop?.eventDate,
      hm: shop?.hm,
      latitude: shop?.latitude,
      longitude: shop?.longitude,
      markerNumber: shop?.markerNumber,
      report: shop?.report,
      state: shop?.state,
      trailerNumber: shop?.trailerNumber,
      truckNumber: shop?.truckNumber,
      total: shop?.total,
      citationNumber: shop?.citation,
      id: shop.id,
      animation: 'DROP',
      vl1: shop?.vl1,
      vl2: shop?.vl2,
      vl3: shop?.vl3,
      vl4: shop?.vl4,
      vl5: shop?.vl5,
      vl6: shop?.vl6,
      vl7: shop?.vl7,
    });
  }

  mapReady(event) {
    this.map = event;
    this.createCustomCluster();
  }

  createCustomCluster() {
    const arrayOfMarkers = [];
    const icon = {
      url: '',
      scaledSize: new google.maps.Size(0, 0),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(0, 0),
    };

    this.markerReiting.map((marker) => {
      const m = new google.maps.Marker({
        position: new google.maps.LatLng(parseFloat(marker.latitude), parseFloat(marker.longitude)),
        icon,
      });

      arrayOfMarkers.push(m);
    });

    const mcOptions = {
      imagePath: '',
      minimumClusterSize: 2,
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
    const markerCluster = new MarkerClusterer(this.map, arrayOfMarkers, mcOptions);
    this.mapInitialization = true;
    google.maps.event.addListener(markerCluster, 'clusterclick', (cluster) => {
      this.clusterLocation.lat = undefined;
      this.clusterLocation.long = undefined;
      this.clusterDropdownData = [];
      this.openClusterDropdown = false;
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
      this.clusterLocation = {
        lat: cluster.center_.lat(),
        long: cluster.center_.lng(),
      };
      this.openClusterDropdown = true;
    });
  }

  snazzyInfoWindowIsToggled($isOpen: boolean) {
    this.closeInfoWindow = $isOpen;
    this.changeDetectorRef.detectChanges();
  }
  snazzyInfoMainWindowIsToggled($isOpen: boolean) {
    this.openClusterDropdown = $isOpen;
    this.changeDetectorRef.detectChanges();
  }

  zoomOnMarker(marker: any) {
    this.clusterLocation = {
      lat: undefined,
      long: undefined,
    };

    // this.openClusterDropdown = false;
    const bounds = new google.maps.LatLngBounds();

    bounds.extend({
      lat: parseFloat(marker.latitude),
      lng: parseFloat(marker.longitude),
    });

    const myLatlng = new google.maps.LatLng(marker.latitude, marker.longitude);

    this.map.panToBounds(bounds);
    this.map.panTo(myLatlng);
    const interval = setInterval(() => {
      this.map.setZoom(12);
      clearInterval(interval);
    }, 500);
  }

  onFullScreen(isFullScreen: boolean) {
    this.fullScreenMode = isFullScreen;
  }

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
