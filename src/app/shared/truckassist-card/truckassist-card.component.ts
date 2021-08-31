import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { DriverData } from '../../core/model/driver';
import { TruckData } from '../../core/model/truck';
import { TrailerData } from '../../core/model/trailer';
import { TaCard, TaCardTrailer } from '../ta-card/ta-card';
import { LoadTabledata } from '../../core/model/load';
import { Customer } from '../../core/model/customer';
import * as AppConst from '../../const';
import { ViolationManageComponent } from 'src/app/safety/safety-violation/violation-manage/violation-manage.component';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { AccidentManageComponent } from 'src/app/safety/safety-accident/accident-manage/accident-manage.component';
import { ManageLoadComponent } from 'src/app/load/manage-load/manage-load.component';
import { DriverManageComponent } from 'src/app/driver/driver-manage/driver-manage.component';
import { TruckManageComponent } from 'src/app/truck/truck-manage/truck-manage.component';
import { TrailerManageComponent } from 'src/app/trailer/trailer-manage/trailer-manage.component';
import { CustomerManageComponent } from 'src/app/customer/customer-manage/customer-manage.component';
import { ShipperManageComponent } from 'src/app/customer/shipper-manage/shipper-manage.component';
import { RepairShopManageComponent } from '../app-repair-shop/repair-shop-manage/repair-shop-manage.component';
import { MaintenanceManageComponent } from 'src/app/repairs/maintenance-manage/maintenance-manage.component';

@Component({
  selector: 'app-truckassist-card',
  templateUrl: './truckassist-card.component.html',
  styleUrls: ['./truckassist-card.component.scss'],
})
export class TruckassistCardComponent implements OnInit, OnChanges {
  // @Input() inputItem: DriverData | TruckData | TrailerData; // driver, truck, trailer... object
  @Input() inputItem: any; // driver, truck, trailer... object
  @Input() stateName;
  @Input() cardIdentificator;
  @Input() selectedTab;
  public type;

  cardItem: TaCard = {
    title: null,
    status: null,
    truck: {},
    driver: {},
    trailer: {},
    load: {},
    violation: {},
    customer: {},
    repair: {},
    repairTruckTrailer: {},
    accident: {},
  };
  violationIconData = [];
  @ViewChild('violationCard') violationCard: ElementRef;
  @ViewChild('cardMain') cardMain: ElementRef;
  @ViewChild('taCardBody') taCardBody: ElementRef;
  expanded;
  public dropdownOptions: any = {
    mainActions: [
      {
        title: 'Edit',
        name: 'edit-card',
      },
    ],
    otherActions: [],
    deleteAction: {
      title: 'Delete',
      name: 'delete-item',
      type: 'driver',
      text: 'Are you sure you want to delete driver?',
    },
  };
  sliderOptions: Options = {
    floor: 0,
    ceil: 50,
    disabled: true,
  };
  repairDropdownItems = ['TRK', 'TRL', 'MBL', 'SHP', 'TOW', 'PTS', 'TRE', 'DRL'];
  expireDateye = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() + 17
  );
  // MAPA
  public styles = AppConst.GOOGLE_MAP_STYLES;
  mapRestrictions = {
    latLngBounds: AppConst.NORTH_AMERICA_BOUNDS,
    strictBounds: true,
  };
  agmMap: any;
  directionRoutes: any = [];

  waypointMarkers = [];
  markerTypes: { delivery: any[]; pickup: any[] };
  legMilage: any[];
  distance: string;
  mapCollors: any = {
    pickup: {
      marker: '#24C1A1',
      bottom: '#159F83',
      line: '#919191',
    },
    delivery: {
      marker: '#FF5D5D',
      bottom: '#D85656',
      line: '#919191',
    },
  };

  heightClass;

  constructor(private customModalService: CustomModalService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes.stateName) {
    //   this.stateName = changes.stateName.currentValue;
    //   this.initCardData();
    // }
    console.log('changes', this.cardItem);
  }

  ngOnInit(): void {
    console.log('ngOnInit');
    this.initCardData();
  }

  /* Method for calling edit functions from child components */
  editCard(event) {
    switch (this.type) {
      case 'violation':
        this.customModalService
          .openModal(
            ViolationManageComponent,
            {
              data: {
                type: 'edit',
                id: event.id,
              },
            },
            null,
            {
              modalDialogClass: 'violation-modal',
            }
          )
          .result.then(() => {
            console.log('End');
          });
        break;
      case 'accident':
        this.customModalService.openModal(
          AccidentManageComponent,
          {
            data: {
              type: 'edit',
              id: event.id,
            },
          },
          null,
          {
            size: 'small',
          }
        );
        break;
      case 'load':
        this.customModalService.openModal(
          ManageLoadComponent,
          {
            data: {
              type: 'edit',
              id: event.id,
            },
          },
          null,
          { size: 'xxl' }
        );
        break;
      case 'driver':
        this.customModalService.openModal(
          DriverManageComponent,
          {
            data: {
              type: 'edit',
              id: event.id,
            },
          },
          null,
          { size: 'small' }
        );
        break;
      case 'truck':
        this.customModalService.openModal(
          TruckManageComponent,
          {
            data: {
              type: 'edit',
              id: event.id,
              truck: this.inputItem,
            },
          },
          null,
          {
            size: 'small',
          }
        );
        break;
      case 'trailer':
        this.customModalService.openModal(
          TrailerManageComponent,
          {
            data: {
              type: 'edit',
              id: event.id,
              trailer: this.inputItem,
            },
          },
          null,
          {
            size: 'small',
          }
        );
        break;
      case 'shipper':
        this.customModalService.openModal(
          ShipperManageComponent,
          {
            data: {
              type: 'edit',
              id: event.id,
              shipper: this.inputItem,
            },
          },
          null,
          {
            size: 'small',
          }
        );
        break;
      case 'broker':
        this.customModalService.openModal(
          CustomerManageComponent,
          {
            data: {
              type: 'edit',
              id: event.id,
              customer: this.inputItem,
            },
          },
          null,
          {
            size: 'small',
          }
        );
        break;
      case 'repair shop':
        this.customModalService.openModal(
          RepairShopManageComponent,
          {
            data: {
              type: 'edit',
              id: event.id,
              shop: this.inputItem,
            },
          },
          null,
          {
            size: 'small',
          }
        );
        break;
      case 'repair trailer':
        this.customModalService.openModal(
          MaintenanceManageComponent,
          {
            data: {
              type: 'edit',
              id: event.id,
              maintenance: this.inputItem,
              vehicle: 'truck',
            },
          },
          null,
          {
            size: 'small',
          }
        );
        break;
      case 'repair truck':
        this.customModalService.openModal(
          MaintenanceManageComponent,
          {
            data: {
              type: 'edit',
              id: event.id,
              maintenance: this.inputItem,
              vehicle: 'trailer',
            },
          },
          null,
          {
            size: 'small',
          }
        );
        break;
      default:
        break;
    }
  }

  initCardData() {
    switch (this.stateName) {
      case 'drivers': {
        this.mapDriverData();
        this.type = 'driver';
        this.heightClass = 137;
        break;
      }
      case 'trucks': {
        this.mapTruckData();
        this.type = 'truck';
        this.heightClass = 134;
        break;
      }
      case 'trailers': {
        this.mapTrailerData();
        this.type = 'trailer';
        this.heightClass = 134;
        break;
      }
      case 'loads': {
        this.mapLoadData();
        this.type = 'load';
        this.heightClass = 148;
        console.log('initCardData load');
        break;
      }
      case 'violations': {
        this.mapViolationData();
        this.type = 'violation';
        this.heightClass = 148;
        break;
      }
      case 'accidents':
      case 'accidents_non-reportable': {
        this.mapAccidentsData();
        this.type = 'accident';
        break;
      }
      case 'shippers': {
        this.mapCustomerData();
        this.type = 'shipper';
        this.heightClass = 148;
        break;
      }
      case 'brokers': {
        this.mapCustomerData();
        this.type = 'broker';
        this.heightClass = 148;
        break;
      }
      case 'repair_shops': {
        this.mapRepairShop();
        this.type = 'repair shop';
        this.heightClass = 148;
        break;
      }
      case 'repair_trailers': {
        this.mapTruckTrailerShop();
        this.type = 'repair trailer';
        this.heightClass = 137;
        break;
      }
      case 'repair_trucks': {
        this.mapTruckTrailerShop();
        this.type = 'repair truck';
        this.heightClass = 137;
        break;
      }
    }
  }

  toggleExpand() {
    this.expanded = !this.expanded;
  }

  mapDriverData() {
    const driverData: DriverData = this.inputItem as DriverData;
    this.cardItem.title = driverData.firstName || 'name';
    this.cardItem.driver.image = driverData.avatar;
    this.cardItem.driver.ssn = driverData?.ssn;
    this.cardItem.driver.dob = driverData?.dateOfBirth;
    this.cardItem.driver.cdl = driverData?.doc?.licenseData[0]?.number || null;
    this.cardItem.driver.hired = driverData?.doc?.workData[0]?.startDate || null;
    this.cardItem.driver.state = driverData?.doc?.additionalData?.address?.country;
    this.cardItem.driver.term = driverData?.doc?.testData[0]?.testingDate || null;
    this.cardItem.driver.status = driverData.status;
    // expand data
    this.cardItem.driver.phone = driverData?.doc?.additionalData?.phone;
    this.cardItem.driver.mail = driverData?.doc?.additionalData?.email;
    this.cardItem.driver.address = driverData?.doc?.additionalData?.address;
    this.cardItem.driver.expiredCDL = driverData?.doc?.licenseData[0]?.endDate
      ? new Date(driverData?.doc?.licenseData[0]?.endDate)
      : null;
    this.cardItem.driver.expiredMedical = driverData?.doc?.medicalData[0]?.endDate
      ? new Date(driverData?.doc?.medicalData[0]?.endDate)
      : null;
    this.cardItem.driver.expiredMVR = driverData?.doc?.mvrData[0]?.startDate
      ? new Date(driverData?.doc?.mvrData[0]?.startDate)
      : null;
    this.cardItem.driver.account = driverData.doc?.additionalData?.bankData?.accountNumber;
    this.cardItem.driver.routing = driverData.doc?.additionalData?.bankData?.routingNumber;
    this.cardItem.driver.bankImage = driverData?.doc?.additionalData?.bankData?.bankLogo;
    this.cardItem.driver.commission = driverData?.commission;
    this.cardItem.driver.restrictions = driverData?.doc?.licenseData[0]?.restrictions;
    this.cardItem.driver.endorsements = driverData?.doc?.licenseData[0]?.endorsements;
    this.cardItem.status = driverData?.status;
  }

  mapTruckData() {
    const truckData: TruckData = this.inputItem as TruckData;
    this.cardItem.title = truckData.truckNumber;
    this.cardItem.truck.mainImage = truckData.doc.additionalData.type.file;
    this.cardItem.truck.logoImage = truckData.doc.additionalData.make.file;
    this.cardItem.truck.vin = truckData.vin;
    this.cardItem.truck.year = truckData.doc.additionalData.year;
    this.cardItem.truck.color = truckData?.doc?.additionalData?.color?.value;
    this.cardItem.truck.model = truckData.doc.additionalData.model;
    // expand
    this.cardItem.truck.expireDate =
      truckData &&
      truckData?.doc &&
      truckData?.doc?.licenseData &&
      truckData?.doc?.licenseData.length
        ? truckData?.doc?.licenseData[0]?.startDate
        : '';
    this.cardItem.truck.licencePlate =
      truckData &&
      truckData?.doc &&
      truckData?.doc?.licenseData &&
      truckData?.doc?.licenseData.length
        ? truckData.doc.licenseData[0].licensePlate
        : '';
    this.cardItem.truck.owner = truckData.ownerName;
    this.cardItem.truck.axles = truckData.doc.additionalData.axises;
    this.cardItem.truck.weight = truckData.doc.additionalData.emptyWeight;
    this.cardItem.truck.engine = truckData?.doc?.additionalData?.engine?.value;
    this.cardItem.truck.tireSize = truckData?.doc?.additionalData?.tireSize;
    this.cardItem.truck.commission = Number(truckData?.commission?.toString().replace('%', ''));
    this.cardItem.truck.mileage = truckData?.doc?.additionalData?.mileage;
    this.cardItem.truck.ipass = truckData?.doc?.additionalData?.ipasEzpass;
    this.cardItem.truck.insurance = truckData?.doc?.additionalData?.insurancePolicyNumber;
    this.cardItem.status = truckData?.status;
  }

  mapTrailerData() {
    const trailerData: TrailerData = this.inputItem as TrailerData;
    this.cardItem.title = trailerData?.trailerNumber;
    this.cardItem.trailer.mainImage = trailerData.doc.additionalData.type.file;
    this.cardItem.trailer.logoImage = trailerData.doc.additionalData.make.file;
    this.cardItem.trailer.vin = trailerData.vin;
    this.cardItem.trailer.year = trailerData.year;
    this.cardItem.trailer.color = trailerData.doc.additionalData?.color?.value;
    this.cardItem.trailer.model = trailerData.doc.additionalData.model;
    //  expand
    this.cardItem.trailer.expireDate = trailerData?.doc?.licenseData?.length
      ? trailerData?.doc?.licenseData[0]?.startDate
      : '';
    this.cardItem.trailer.licencePlate = trailerData?.doc?.licenseData.length
      ? trailerData?.doc?.licenseData[0]?.licensePlate
      : '';
    this.cardItem.trailer.owner = trailerData.ownerName;
    this.cardItem.trailer.axles = trailerData.doc.additionalData.axises;
    this.cardItem.trailer.length = trailerData.doc.additionalData.length.value;
    this.cardItem.trailer.tireSize = trailerData.doc.additionalData.tireSize;
    this.cardItem.trailer.insurance = trailerData.doc.additionalData.insurancePolicyNumber;
    this.cardItem.status = trailerData?.status;
  }

  mapLoadData() {
    const loadData: LoadTabledata = this.inputItem as LoadTabledata;
    this.cardItem.title = loadData?.loadNumber;
    this.cardItem.load.company = loadData?.assignedCompanyId;
    this.cardItem.load.miles = loadData?.mileage;
    this.cardItem.load.reference = loadData?.customerLoadNumber;
    this.cardItem.load.dispatcher = loadData?.dispatcherName;
    // this.cardItem.load.loads = loadData; ===> Load[]
    this.cardItem.load.truck = loadData?.truckNumber;
    this.cardItem.load.trailer = loadData?.trailerNumber;
    this.cardItem.load.driver = loadData?.driverName;
    this.cardItem.load.baseRate = loadData?.baseRate;
    this.cardItem.load.adjusted = loadData?.adjusted;
    this.cardItem.load.advance = loadData?.advance;
    this.cardItem.load.additional = loadData?.additional;
    // this.cardItem.load.totalPrice =
    //   this.convertToNumber(this.cardItem.load.baseRate) +
    //   this.convertToNumber(this.cardItem.load.adjusted) +
    //   this.convertToNumber(this.cardItem.load.advance) +
    //   this.convertToNumber(this.cardItem.load.additional);
    this.cardItem.load.totalPrice = loadData?.total;
    this.cardItem.load.loadMap = loadData?.route?.length >= 2;
    this.cardItem.load.route = loadData?.route;
    this.cardItem.load.lastRoute = loadData?.route[loadData?.route?.length - 1];
    this.cardItem.load.status = loadData?.status;
    this.showMaps(loadData);
    // console.log(this.cardItem.title, this.cardItem.load);
  }

  mapCustomerData() {
    const customerData: Customer = this.inputItem as Customer;
    // title: string;
    this.cardItem.title = customerData?.name;
    // this.cardItem.customer.phone = parseInt(customerData?.doc.phone.replace(/\D/g,''),10);
    this.cardItem.customer.phone = customerData?.doc?.phone;
    this.cardItem.customer.email = customerData?.doc?.email;
    this.cardItem.customer.address = customerData?.doc?.address;
    this.cardItem.customer.likes = customerData?.upCount;
    this.cardItem.customer.dislikes = customerData?.downCount;
    this.cardItem.customer.loads = customerData?.loadCount;
    this.cardItem.customer.gross = customerData?.total;
  }

  mapRepairShop() {
    const repairData: any = this.inputItem as any;

    this.cardItem.title = repairData?.name;
    this.cardItem.repair.phone = repairData?.doc?.phone;
    this.cardItem.repair.email = repairData?.doc?.email;
    this.cardItem.repair.address = repairData?.doc?.address;
    this.cardItem.repair.likes = repairData?.upCount;
    this.cardItem.repair.dislikes = repairData?.downCount;
    this.cardItem.repair.dropdownItems = repairData?.doc?.types
      .map((x, index) => {
        x.short = this.repairDropdownItems[index];
        return x;
      })
      .filter((x) => x.checked);
  }

  mapTruckTrailerShop() {
    const repairTruckTrailerData: any = this.inputItem as any;

    this.cardItem.title = repairTruckTrailerData?.repairShopName;

    this.cardItem.repairTruckTrailer.company = repairTruckTrailerData?.companyId;
    this.cardItem.repairTruckTrailer.repairDate = repairTruckTrailerData?.maintenanceDate;
    this.cardItem.repairTruckTrailer.inv = repairTruckTrailerData?.invoiceNo;
    this.cardItem.repairTruckTrailer.odo = repairTruckTrailerData?.millage;
    this.cardItem.repairTruckTrailer.repairItems = repairTruckTrailerData?.doc?.items;
    this.cardItem.repairTruckTrailer.total = repairTruckTrailerData?.total;
  }

  convertToNumber(x: any): number | undefined {
    if (x) {
      const prvi = x.charAt(0);
      if (prvi === '$') {
        return parseInt(x.substring(1), 10);
      } else {
        return parseInt(x, 10);
      }
    } else {
      return 0;
    }
  }

  /* Violation Card Template Method */
  mapViolationData() {
    const violationData = this.inputItem;
    this.violationIconData = [
      {
        iconUrl: 'vl1',
        weight: violationData.vl1,
      },
      {
        iconUrl: 'vl2',
        weight: violationData.vl2,
      },
      {
        iconUrl: 'vl3',
        weight: violationData.vl3,
      },
      {
        iconUrl: 'vl4',
        weight: violationData.vl4,
      },
      {
        iconUrl: 'vl5',
        weight: violationData.vl5,
      },
      {
        iconUrl: 'vl6',
        weight: violationData.vl6,
      },
      {
        iconUrl: 'vl7',
        weight: violationData.vl7,
      },
    ];
    /* Check with backend about model structure */
    this.cardItem.violation = {
      reportNumber: violationData.report,
      driverName: violationData.driverFullName,
      date: violationData.eventDate,
      time: violationData.hm,
      state: violationData.state,
      truck: violationData.truckNumber,
      trailer: violationData.trailerNumber,
      lvl: violationData.lvl,
      lvlTitle: violationData.lvlTitle,
      violationsData: violationData.violationsData,
      oos: violationData.oos,
      customer: violationData.customer,
      citation: violationData.citationData,
      citationNumber: violationData.citation,
      policeDepartment: violationData.policeDepartment,
      files: violationData.attachments,
      total: violationData.total,
    };
  }

  /* Watch for events around violation cards to close */
  @HostListener('document:click', ['$event']) documentClick(event: any): void {
    if (
      !this.cardMain.nativeElement.contains(event.target) &&
      !this.taCardBody.nativeElement.contains(event.target) &&
      this.expanded === true
    ) {
      this.expanded = !this.expanded;
    }
  }

  public getMapInstance(map) {
    this.agmMap = map;
  }

  public showMaps(mod: any) {
    const allwaypoints = mod.route.reduce(
      (routeArray, item) => {
        if (
          (item.PointOrder > 1 && item.PointType == 'pickup') ||
          (item.PointType == 'delivery' && item.PointOrder < mod.deliveryCount)
        ) {
          routeArray.routeAddress.push({ location: item.PointAddress });
          routeArray.routes.push(item);
        }
        return routeArray;
      },
      { routes: [], routeAddress: [] }
    );
    const waypoints = allwaypoints.routeAddress;
    this.getDispatchMapDistance(
      mod.pickupLocation.address,
      mod.deliveryLocation.address,
      waypoints,
      allwaypoints.routes,
      mod
    );
  }

  public getDispatchMapDistance(
    origins: string,
    destinations: string,
    waypoint: any[],
    mod: any,
    load: any
  ) {
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
    directionsService.route(request, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        response.routes[0].legs.forEach((element, index) => {
          if (index == response.routes[0].legs.length - 1) {
            this.waypointMarkers.push({
              lat: response.routes[0].legs[0].start_location.lat(),
              lng: response.routes[0].legs[0].start_location.lng(),
              type: 'pickup',
              index: 1,
              shipper_id: load.pickupId,
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
              renderOptions: {
                suppressMarkers: true,
                polylineOptions: {
                  fillOpacity: 0.35,
                  strokeWeight: 5,
                  strokeOpacity: 0.8,
                  strokeColor: '#5673AA',
                },
              },
            });

            this.directionRoutes.push({
              origin: {
                lat: response.routes[0].legs[0].start_location.lat(),
                lng: response.routes[0].legs[0].start_location.lng(),
              },
              destination: {
                lat: response.routes[0].legs[response.routes[0].legs.length - 1].end_location.lat(),
                lng: response.routes[0].legs[response.routes[0].legs.length - 1].end_location.lng(),
              },
              waypoints: waypoint,
              renderOptions: {
                suppressMarkers: true,
                polylineOptions: {
                  fillOpacity: 0.35,
                  strokeWeight: 3,
                  strokeOpacity: 0.8,
                  // strokeColor: this.mapCollors[load.route[index].PointType].line,
                },
              },
            });
          } else {
            this.waypointMarkers.push({
              lat: element.end_location.lat(),
              lng: element.end_location.lng(),
              type: mod[index].PointType,
              shipper_id: mod[index].ShipperId,
              index: mod[index].PointOrder,
            });
          }
        });
      }
    });
  }

  mapAccidentsData() {
    const accidentData = this.inputItem;
    this.cardItem.accident = {
      reportNumber: accidentData.report,
      driverFullName: accidentData.driverFullName,
      eventDate: accidentData.eventDate,
      time: accidentData.time || '16:25 PM',
      state: accidentData.state || 'Park, AL',
      truck: accidentData.truckNumber || 'BT3242',
      trailer: accidentData.trailerNumber || 'R3433',
      files: accidentData.doc?.attachments || [
        {
          url:
            'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/accident/51/0/5bd28ba0ba8a4d9e91f20b370927c5521623697227-CLAIMANT DEMAND.pdf',
          fileName: 'CLAIMANT DEMAND.pdf',
          fileItemGuid: '5bd28ba0-ba8a-4d9e-91f2-0b370927c552',
        },
        {
          url:
            'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/accident/51/0/3fb56a98b8ef45c493f1b5858e047c2a1623697228-JD Freight-Accident Report-5-14-21.pdf',
          fileName: 'JD Freight-Accident Report-5-14-21.pdf',
          fileItemGuid: '3fb56a98-b8ef-45c4-93f1-b5858e047c2a',
        },
        {
          url:
            'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/accident/51/0/6c4cf4d8fd3a490eb458fbd7a7c46fd91623697228-Triumph Ins Group-Traffic Invoice 21-034.pdf',
          fileName: 'Triumph Ins Group-Traffic Invoice 21-034.pdf',
          fileItemGuid: '6c4cf4d8-fd3a-490e-b458-fbd7a7c46fd9',
        },
      ],
      insuranceClaim: accidentData.insuranceClaim || '83-42-98374',
      fatality: accidentData.fatality,
      injuries: accidentData.injuries,
      towing: accidentData.towing,
      hm: accidentData.hm,
    };
  }
}
