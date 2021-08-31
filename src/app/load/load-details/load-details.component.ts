import { AppDriverService } from 'src/app/core/services/app-driver.service';
import { AppCustomerService } from 'src/app/core/services/app-customer.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { switchMap } from 'rxjs/operators';
import { AppLoadService } from 'src/app/core/services/app-load.service';
import { forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AppCommentsComponent } from './../../shared/app-comments/app-comments.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as AppConst from './../../const';
@Component({
  selector: 'app-load-details',
  templateUrl: './load-details.component.html',
  styleUrls: ['./load-details.component.scss']
})
export class LoadDetailsComponent implements OnInit {
  @ViewChild(AppCommentsComponent, {static: false}) commentSection: AppCommentsComponent;
  public options: any[] = [];
  public dataRates: any = [
  ];

  public loadId: number;
  public loadData: any;
  public brokerInfo: any;
  public driverInfo: any;

  mapRestrictions = {
    latLngBounds: AppConst.NORTH_AMERICA_BOUNDS,
    strictBounds: true,
  };
  public styles = AppConst.GOOGLE_MAP_STYLES;
  waypointMarkers = [];

  keyword = 'id';

  mapCollors: any = {
    pickup: {
      marker: '#24C1A1',
      bottom: '#159F83',
      line: '#919191'
    },
    delivery: {
      marker: '#FF5D5D',
      bottom: '#D85656',
      line: '#919191'
    }
  };

  distance: any;
  agmMap: any;
  markerTypes: any = {
    destination: [],
    pickup: [],
  };

  directionRoutes: any = [];
  legMilage: any = [];
  waypoints: any;
  constructor(
      private route: ActivatedRoute,
      private loadService: AppLoadService,
      private sharedService: SharedService,
      private customerService: AppCustomerService,
      private driverService: AppDriverService
    ) {
    this.route.params.subscribe((params) => {
      this.loadId = params.id;
    });
  }

  ngOnInit(): void {
    this.getLoadData();
  }

  public showMaps(mod: any) {
    const allwaypoints = mod.route.reduce((routeArray, item) => {
      if ((item.PointOrder > 1 && item.PointType == 'pickup')
        || ( item.PointType == 'delivery' && item.PointOrder < mod.deliveryCount)) {
        routeArray.routeAddress.push({ location: item.PointAddress});
        routeArray.routes.push(item);
      }
      return routeArray;
    }, {routes: [], routeAddress: []});
    const waypoints = allwaypoints.routeAddress;
    this.getDispatchMapDistance(mod.pickupLocation.address, mod.deliveryLocation.address, waypoints, allwaypoints.routes, mod);
  }

  public getDispatchMapDistance(origins: string, destinations: string, waypoint: any[], mod: any, load: any) {
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
    this.legMilage = [];
    let totalDistance = 0.0;
    directionsService.route(request, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        response.routes[0].legs.forEach((element, index) => {
          if ( index == response.routes[0].legs.length - 1 ) {
            this.waypointMarkers.push({
              lat: response.routes[0].legs[0].start_location.lat(),
              lng: response.routes[0].legs[0].start_location.lng(),
              type: 'pickup',
              index: 1,
              shipper_id: load.pickupId
            });
            this.waypointMarkers.push({
              lat: response.routes[0].legs[response.routes[0].legs.length - 1].end_location.lat(),
              lng: response.routes[0].legs[response.routes[0].legs.length - 1].end_location.lng(),
              type: 'delivery',
              index: load.deliveryCount,
              shipper_id: load.deliveryId,
            });

            this.directionRoutes.push({
              origin: load.pickupLocation.address,
              destination: load.deliveryLocation.address,
              waypoints: waypoint,
              renderOptions: { suppressMarkers: true, polylineOptions: { fillOpacity: 0.35,  strokeWeight: 5, strokeOpacity: 0.8, strokeColor: '#5673AA' } },
            });

            this.directionRoutes.push({
              origin: { lat: response.routes[0].legs[0].start_location.lat(), lng: response.routes[0].legs[0].start_location.lng() },
              destination: { lat: response.routes[0].legs[response.routes[0].legs.length - 1].end_location.lat(), lng: response.routes[0].legs[response.routes[0].legs.length - 1].end_location.lng() },
              waypoints: waypoint,
              renderOptions: { suppressMarkers: true, polylineOptions: { fillOpacity: 0.35,  strokeWeight: 3, strokeOpacity: 0.8, strokeColor: this.mapCollors[load.route[index].PointType].line } },
            });
          } else {
            this.waypointMarkers.push({
              lat: element.end_location.lat(),
              lng: element.end_location.lng(),
              type: mod[index].PointType,
              shipper_id: mod[index].ShipperId,
              index: mod[index].PointOrder
            });
          }

          if (response.routes[0].legs.length > 1) {
            if (index === 0) {
              this.legMilage.push({
                distance: null,
                distanceValue: null,
                type: 'pickup'
              });
              this.legMilage.push({
                distance: element.distance.text.replace('mi', '').trim(),
                distanceValue: element.distance.value,
                type: mod[0].PointType
              });
            } else if ( index !== response.routes[0].legs.length - 1 ) {
              this.legMilage.push({
                distance: element.distance.text.replace('mi', '').trim(),
                distanceValue: element.distance.value,
                type: mod[index].PointType
              });
            } else {
              this.legMilage.push({
                distance: element.distance.text.replace('mi', '').trim(),
                distanceValue: element.distance.value,
                type: 'delivery'
              });
            }
          } else {
            this.legMilage.push({
              distance: null,
              distanceValue: null,
              type: 'pickup'
            });
            this.legMilage.push({
              distance: element.distance.text.replace('mi', '').trim(),
              distanceValue: element.distance.value,
              type: 'delivery'
            });
          }
          totalDistance += element.distance.value;
        });

        this.distance = (totalDistance * 0.00062137).toFixed(0).toString();
        this.legMilage.forEach((element, index) => {
          if (index === 0) {
            element.mileageSum = 0;
            element.mileageSumString = null;
          } else {
            element.mileageSum = element.distanceValue + this.legMilage[index - 1].mileageSum;
            element.mileageSumString = (element.mileageSum * 0.00062137).toFixed(0).toString();
          }
        });
      }
    });
  }

  public getMapInstance(map) {
    this.agmMap = map;
  }

  addNewComment() {
    this.commentSection.startNewMessages();
  }

  public getLoadData() {
    let customer$;
    let driver$;
    let loadHistory$;
    const load$ = this.loadService.getLoadData();
    const loadData = this.loadService.getLoadEdit(this.loadId).pipe(
    switchMap((res: any): any => {
      customer$ = this.customerService.getCustomerById(res.customerId);
      driver$ = this.driverService.getDriverData(res.driverId, 'all');
      loadHistory$ = this.loadService.getLoadLogList(this.loadId);
      this.loadData = res;
      console.log(res);
      const ratesInfo = res.rates.reduce((data, item) => {

        data[item.Title] = data[item.Title] + item.Rate;
        data.total = data.total + item.Rate;

        if ( item.Title == 'advanced' ) {
          data.total = data.total - item.Rate;
          data.totalAdj > 0 ? data.totalAdj = data.totalAdj - item.Rate : 0;
        } else if ( item.Title == 'revised' ) { data.total = item.Rate; }

        if ( !['baseRate', 'revised'].includes(item.Title) ) { data.totalAdj = data.totalAdj + item.Rate; }

        return data;
      },
      {
        baseRate: 0,
        revised: 0,
        adjusted: 0,
        advanced: 0,
        lumper: 0,
        detention: 0,
        layover: 0,
        fuelSurch: 0,
        escort: 0,
        totalAdj: 0,
        total: 0
      });

      Object.assign(this.loadData, { ratesInfo });
      this.showMaps(res);

      return forkJoin([customer$, driver$, loadHistory$, load$]);
    })).subscribe(([customer$, driver$, loadHistory$, load$]) => {
      this.brokerInfo = customer$;
      this.driverInfo = driver$;
      this.options = load$.allLoads.map(item => {
        item.id = item.id.toString();
        return item;
      });
    });
  }

}
