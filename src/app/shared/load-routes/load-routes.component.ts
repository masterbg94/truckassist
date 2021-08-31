/// <reference types="@types/googlemaps" />
import { Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import * as AppConst from 'src/app/const';
import { AppLoadService } from 'src/app/core/services/app-load.service';
import { LatLngBounds} from '@agm/core';
import { AppSharedService } from 'src/app/core/services/app-shared.service';
import { formatPhoneNumber } from 'src/app/core/helpers/formating';
declare global {
  interface Window {
    google: typeof google;
  }
}
@Component({
  selector: 'app-load-routes',
  templateUrl: './load-routes.component.html',
  styleUrls: ['./load-routes.component.scss'],
  animations: [
    trigger('pickupAnimation', [
      transition(':enter', [
        style({ height: 100 }),
        animate('200ms', style({ height: '*' })),
      ]),
      transition(':leave', [
        animate('150ms', style({ height: 0 })),
      ]),
    ]),
  ]
})
export class LoadRoutesComponent implements OnInit {

  constructor(private loadService: AppLoadService, private sharedService: AppSharedService) { }
  @Input() dataId: any;
  @ViewChild('infowindow') infowindow: ElementRef;
  markerTypes: any = {
    destination: [],
    pickup: [],
  };

  activatedLoadMap: number;
  activatedLoadMapSnazzy: boolean;
  origin = { lat: 0, lng: 0 };
  destination = { lat: 0, lng: 0 };
  distance = '0 miles';
  waypoints = [];
  dispatch_pickup_data: any;
  dispatch_data_loaded: boolean;
  selectedtab = 'Closed';
  mapRestrictions = {
    latLngBounds: AppConst.NORTH_AMERICA_BOUNDS,
    strictBounds: true,
  };

  public renderOptions = {
    suppressMarkers: true,
    polylineOptions: {
      strokeColor: '#28529F',
    },
  };
  public styles = AppConst.GOOGLE_MAP_STYLES;
  mapCenter: any = {
    latitude: 0,
    longitude: 0
  };

  agmMap: any;

  originMarker = {
    lat: 0,
    lng: 0,
  };

  destinationMarker = {
    lat: 0,
    lng: 0,
  };

  destinationIcon = '../../../../assets/img/dispatch_marker.svg';
  originIcon = '../../../../assets/img/dispatch_icon_green.svg';
  waypointMarkers = [];
  legMilage = [];
  selectedDispatchDataWaypoints: any;
  showMap = -1;
  previous_snazy_window: any;

  tabs = [
    {
      id: 1,
      name: 'Closed'
    },
    {
      id: 2,
      name: 'Active'
    },
    {
      id: 3,
      name: 'Pending'
    }
  ];
  mainMarkers: any;

  ngOnInit(): void {
  }

  snazzyInfoWindowIsToggled(event) {
  }

  onTabChanged(event?: any) {
    if (event) { this.selectedtab = event.name; }
    this.activatedLoadMap = -1;
    this.activatedLoadMapSnazzy = false;
    this.showMap = -1;
    this.waypointMarkers = [];
    this.originMarker = {
      lat: 0,
      lng: 0,
    };
  }

  toggleLoadPopup(tooltip: any) {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open();
      this.dispatch_data_loaded = false;
      this.onTabChanged();
      this.loadService.getByDispatchboardData(this.dataId).subscribe(res => {
        this.dispatch_data_loaded = true;
        this.dispatch_pickup_data = res;
      });
    }
  }

  public getMapInstance(map) {
    this.agmMap = map;
  }

  public showMaps(mod: any, index: number, justSort: boolean) {
    if ( justSort ) {
      this.dispatch_pickup_data.closedLoads[index].route.sort((a, b) =>
        (a.PointType > b.PointType) ? -1 : ((b.PointType > a.PointType) ? 1 : 0));
      this.showMap != index ? this.showMap = index : this.showMap = -1;
      return;
    }
    this.showMap != index ? this.showMap = index : this.showMap = -1;
    const allwaypoints = mod.route.reduce((routeArray, item) => {
      if ((item.PointOrder > 1 && item.PointType == 'pickup')
        || ( item.PointType == 'delivery' && item.PointOrder < mod.deliveryCount)) {
        routeArray.routeAddress.push({ location: item.PointAddress});
        routeArray.routes.push(item);
      }
      return routeArray;
    }, {routes: [], routeAddress: []});

    const waypoints = allwaypoints.routeAddress;
    this.selectedDispatchDataWaypoints = allwaypoints.routes;
    this.destination = mod.deliveryLocation.address;
    this.origin = mod.pickupLocation.address;
    this.waypoints = waypoints;
    this.getDispatchMapDistance(mod.pickupLocation.address, mod.deliveryLocation.address, waypoints, mod);
  }

  public handleMapSelection(mod: any, indx: number, type: string) {
    if ( this.activatedLoadMap !== indx ) {
      this.activatedLoadMapSnazzy = false;
      this.activatedLoadMap = indx;
      const position = new google.maps.LatLng(mod.lat, mod.lng);
      this.punToMapPosition([{lat: mod.lat, lng: mod.lng}], position);
    } else {
      if (!this.activatedLoadMapSnazzy) {
        if ( !this.waypointMarkers[indx].markerInfo ) {
            this.showMarkerWindow(indx, mod.shipper_id);
        } else {
          this.activatedLoadMapSnazzy = true;
        }
      } else {
        this.activatedLoadMap = -1;
        this.activatedLoadMapSnazzy = false;
      }
    }
  }

  public getDispatchMapDistance(origins: string, destinations: string, waypoint: any[], mod: any) {
    const directionsService = new google.maps.DirectionsService();
    const request = {
      origin: origins,
      destination: destinations,
      waypoints: waypoint,
      optimizeWaypoints: false,
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.IMPERIAL,
    };
    this.markerTypes = { delivery: [], pickup: [] };
    directionsService.route(request, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        let totalDistance = 0.0;
        this.legMilage = [];
        this.waypointMarkers = [];
        this.mainMarkers = [];
        response.routes[0].legs.forEach((element, index) => {
          if ( index == response.routes[0].legs.length - 1 ) {
            this.waypointMarkers.push({
              lat: response.routes[0].legs[0].start_location.lat(),
              lng: response.routes[0].legs[0].start_location.lng(),
              type: 'pickup',
              index: 1,
              shipper_id: mod.pickupId
            });
            this.waypointMarkers.push({
              lat: response.routes[0].legs[response.routes[0].legs.length - 1].end_location.lat(),
              lng: response.routes[0].legs[response.routes[0].legs.length - 1].end_location.lng(),
              type: 'delivery',
              index: this.markerTypes.delivery.length + 1,
              shipper_id: mod.deliveryId,
            });
          }
          const item_type = this.selectedDispatchDataWaypoints[index]?.PointType ? this.selectedDispatchDataWaypoints[index]?.PointType : 'delivery';
          const shipper_id = this.selectedDispatchDataWaypoints[index]?.ShipperId;
          this.originMarker.lat = response.routes[0].legs[0].start_location.lat();
          this.originMarker.lng = response.routes[0].legs[0].start_location.lng();
          this.destinationMarker.lat = response.routes[0].legs[
            response.routes[0].legs.length - 1
          ].end_location.lat();
          this.destinationMarker.lng = response.routes[0].legs[
            response.routes[0].legs.length - 1
          ].end_location.lng();
          this.mainMarkers.push({lat: this.originMarker.lat, lng: this.originMarker.lng});
          this.mainMarkers.push({lat: this.destinationMarker.lat, lng: this.destinationMarker.lng});
          this.mapCenter.latitude = this.originMarker.lat;
          this.mapCenter.longitude = this.destinationMarker.lng;
          if (response.routes[0].legs.length > 1) {
            if (index !== response.routes[0].legs.length - 1) {
              const destType = this.selectedDispatchDataWaypoints[index]?.PointType;
              const shipper_id = this.selectedDispatchDataWaypoints[index]?.ShipperId;
              if ( destType ) { this.markerTypes[destType].push(1); }
              this.waypointMarkers.push({
                lat: element.end_location.lat(),
                lng: element.end_location.lng(),
                type: destType,
                shipper_id,
                index: destType == 'pickup' ? this.markerTypes[destType].length + 1 : this.markerTypes[destType].length
              });

              this.mainMarkers.push({lat: element.end_location.lat(), lng: element.end_location.lng()});
            }

            if (index === 0) {
              this.legMilage.push({
                distance: null,
                distanceValue: null,
                startAddress: mod.pickupLocation.city + ', ' +  mod.pickupLocation.stateShortName + ' ' + mod.pickupLocation.zipCode,
                lat: element.start_location.lat(),
                lng: element.start_location.lng(),
                endAddress: null,
                shipper_id: mod.pickupId,
                type: 'pickup'
              });
              this.legMilage.push({
                distance: element.distance.text.replace('mi', '').trim(),
                distanceValue: element.distance.value,
                startAddress: null,
                lat: element.end_location.lat(),
                lng: element.end_location.lng(),
                endAddress: this.selectedDispatchDataWaypoints[0]?.PointCity + ', ' +  this.selectedDispatchDataWaypoints[0]?.PointState + ' ' + this.selectedDispatchDataWaypoints[0]?.PointZip,
                totalDistanceValue: null,
                shipper_id: this.selectedDispatchDataWaypoints[0]?.ShipperId,
                type: this.selectedDispatchDataWaypoints[0]?.PointType
              });
            } else if ( index !== response.routes[0].legs.length - 1 ) {
              this.legMilage.push({
                distance: element.distance.text.replace('mi', '').trim(),
                distanceValue: element.distance.value,
                lat: element.end_location.lat(),
                lng: element.end_location.lng(),
                totalDistanceValue: null,
                startAddress: null,
                endAddress: this.selectedDispatchDataWaypoints[index]?.PointCity + ', ' +  this.selectedDispatchDataWaypoints[index]?.PointState + ' ' + this.selectedDispatchDataWaypoints[index]?.PointZip,
                shipper_id,
                type: item_type
              });
            } else {
              this.legMilage.push({
                distance: element.distance.text.replace('mi', '').trim(),
                distanceValue: element.distance.value,
                startAddress: null,
                endAddress: mod.deliveryLocation.city + ', ' +  mod.deliveryLocation.stateShortName + ' ' + mod.deliveryLocation.zipCode,
                lat: element.end_location.lat(),
                lng: element.end_location.lng(),
                totalDistanceValue: null,
                shipper_id: mod.deliveryId,
                type: 'delivery'
              });
            }
          } else {
            this.legMilage.push({
              distance: null,
              distanceValue: null,
              startAddress: mod.pickupLocation.city + ', ' +  mod.pickupLocation.stateShortName + ' ' + mod.pickupLocation.zipCode,
              lat: element.start_location.lat(),
              lng: element.start_location.lng(),
              endAddress: null,
              shipper_id: mod.pickupId,
              type: 'pickup'
            });
            this.legMilage.push({
              distance: element.distance.text.replace('mi', '').trim(),
              distanceValue: element.distance.value,
              startAddress: null,
              endAddress: mod.deliveryLocation.city + ', ' +  mod.deliveryLocation.stateShortName + ' ' + mod.deliveryLocation.zipCode,
              lat: element.end_location.lat(),
              lng: element.end_location.lng(),
              totalDistanceValue: null,
              shipper_id: mod.deliveryId,
              type: 'delivery'
            });
          }
          totalDistance += element.distance.value;
        });
        this.legMilage.forEach((element, index) => {
          if (index === 0) {
            element.mileageSum = 0;
            element.mileageSumString = null;
          } else {
            element.mileageSum = element.distanceValue + this.legMilage[index - 1].mileageSum;
            element.mileageSumString = (element.mileageSum * 0.00062137).toFixed(0).toString();
          }
        });
        this.waypointMarkers.sort(function(a, b) {
          if (a.type == b.type) {
                  return (a.index < b.index) ? -1 : (a.index > b.index) ? 1 : 0;
              } else {
                  return (a.type < b.type) ? 1 : -1;
              }
        });
        this.distance = (totalDistance * 0.00062137).toFixed(0).toString();
        setTimeout(() => {
          this.punToMapPosition(this.mainMarkers);
        }, 2000);
      }
    });
  }

  public mapClicked(e) {
    this.activatedLoadMap = -1;
  }

  public markerClicked(mod: any, ind: number) {
    if ( this.activatedLoadMap != ind || !this.activatedLoadMapSnazzy ) {
      if ( !this.waypointMarkers[ind].markerInfo ) {
          this.showMarkerWindow(ind, mod.shipper_id);
      } else {
        this.activatedLoadMap = ind;
        this.activatedLoadMapSnazzy = true;
      }
    } else {
      this.activatedLoadMap = -1;
      this.activatedLoadMapSnazzy = false;
    }
  }

  public showMarkerWindow(ind: number, shipper_id: number) {
    this.sharedService.getShipperInfo(shipper_id).subscribe((res: any) => {
      this.waypointMarkers[ind].markerInfo = {
        name: res.name
      };
      this.waypointMarkers[ind].markerInfo.address = this.getMarkerFullAddress(res.doc.address);
      this.waypointMarkers[ind].markerInfo.phone = res.doc.phone || res.doc.phone != '' ? formatPhoneNumber(res.doc.phone) : null;
      this.activatedLoadMap = ind;
      this.activatedLoadMapSnazzy = true;
    });
  }

  public getMarkerFullAddress(address: any): string {
    if ( (address.streetName && address.streetName != '') || (address.streetNumber && address.streetNumber != '') ) {
      return `${address.streetNumber} ${address.streetName} <br/> ${address.city}, ${address.stateShortName} ${address.zipCode}`;
    } else {
      // TO DO - THIS PART IS NOT NECESSARY AFTER CREATING NEW SHIPPERS
      return address.address.replace(', USA', '');
    }
  }

  public punToMapPosition(markers, position?) {
    const bounds = new google.maps.LatLngBounds();
    markers.map(item => bounds.extend(new google.maps.LatLng(item.lat, item.lng)));
    this.agmMap.fitBounds(bounds);
    if ( position ) {
      setTimeout(() => {
        this.agmMap.panTo(position);
        this.agmMap.setZoom(6);
      }, 500);
    }
  }

}
