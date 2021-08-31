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
import { AccidentManageComponent } from '../accident-manage/accident-manage.component';
declare let MarkerClusterer: any;

@Component({
  selector: 'app-accident-map',
  templateUrl: './accident-map.component.html',
  styleUrls: ['./accident-map.component.scss'],
})
export class AccidentMapComponent implements OnInit, OnChanges, OnDestroy {
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
        url: '../../../assets/img/png/violation-map/violation-map-circle-25-49.png',
        height: 48,
        width: 48,
      },
    ],
  };

  clusterDropdownData = [];
  clusterLocation = {
    lat: undefined,
    long: undefined,
  };
  openClusterDropdown: boolean;
  constructor(
    private customModalService: CustomModalService,
    @Inject(ChangeDetectorRef) private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log(this.tableShopData);

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

  collectShopsData(accidentData: any) {
    this.markerReiting = [];
    accidentData.forEach((element) => {
      this.setMarkers(element);
    });
  }

  onAddShop() {
    const data = {
      type: 'new',
      id: null,
    };
    this.customModalService.openModal(AccidentManageComponent, { data }, null, {
      size: 'small',
    });
  }

  onDeleteShop(shop) {}

  clickedMarker(index: number, marker: any) {
    this.closeInfoWindow = false;
    this.markerReiting.forEach((element, i) => {
      element.marker = 'assets/img/png/accident-marker.png';
      if (index === i) {
        element.marker = 'assets/img/png/accident-marker-focus.png';
        this.markerInfoData = marker;
        this.zoomOnMarker(marker);
        this.closeInfoWindow = true;
      }
    });
  }

  setMarkers(accident) {
    let marker: string;
    marker = 'assets/img/png/accident-marker.png';
    this.markerReiting.push({
      marker,
      customer: accident?.customer,
      driverFullName: accident?.driverFullName,
      eventDate: accident?.eventDate,
      address: accident?.address,
      latitude:
        accident?.latitude || (35.0 + Math.floor(Math.random() * (9 - 1 + 1) + 1)).toString(),
      longitude:
        accident?.longitude || (-90.0 - Math.floor(Math.random() * (9 - 1 + 1) + 1)).toString(),
      report: accident?.report,
      state: accident?.state,
      trailerNumber: accident?.trailerNumber || 'B34242',
      truckNumber: accident?.truckNumber || 'Z6543',
      injuries: accident?.injuries,
      insuranceClaim: accident?.insuranceClaim,
      fatality: accident?.fatality,
      towing: accident?.towing,
      hm: accident?.hm,
      id: accident?.id,
      animation: 'DROP',
      time: accident?.time || '10:17 PM',
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
          height: 48,
          url: '',
          width: 48,
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
      let markersInCluster = [];
      let tempData = [];
      markersInCluster = cluster.getMarkers();
      markersInCluster.forEach((element) => {
        const lat = element.getPosition().lat();
        const lng = element.getPosition().lng();
        this.markerReiting.forEach((marker) => {
          if (parseFloat(marker.latitude) === lat && parseFloat(marker.longitude) === lng) {
            tempData.push(marker);
          }
        });
      });
      this.clusterDropdownData = tempData;
      tempData = [];
      this.clusterLocation = {
        lat: cluster.center_.lat(),
        long: cluster.center_.lng(),
      };
      this.openClusterDropdown = true;
    });
  }

  snazzyInfoWindowIsToggled($isOpen: boolean) {
    if (!$isOpen) {
      this.markerReiting.forEach((element) => {
        element.marker = 'assets/img/png/accident-marker.png';
      });
    }
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
