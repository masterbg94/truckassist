import {
  Component,
  HostListener,
  ElementRef,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AppSharedService } from '../../services/app-shared.service';
import { SharedService } from '../../services/shared.service';
import { listItemTrigger, toggleListShow } from './sidebar-triggers';
import { animate, style, transition, trigger } from '@angular/animations';
import { AppTruckService } from '../../services/app-truck.service';
// import { DataService } from '@progress/kendo-angular-dropdowns';
import { AppTrailerService } from '../../services/app-trailer.service';
import { OwnerData, OwnerTabData } from 'src/app/core/model/shared/owner';
import { cwd } from 'node:process';
import { TRAILER_LIST, TRUCK_LIST_APPLICANTS } from '../../../const';
import { StorageService } from '../../services/storage.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [listItemTrigger, toggleListShow],
})
export class SidebarComponent implements OnInit, OnDestroy {
  selectedTab = 0;

  tabs = [
    {
      id: 1,
      name: 'Trucks',
      checked: false,
    },
    {
      id: 2,
      name: 'Trailers',
      checked: false,
    },
  ];

  public users = [
    {
      img: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Lueg_im_SWR1_Studio.jpg',
      time: '17 Apr, 2019',
      name: 'Denis Rodman',
      al: 'DR',
      hour: '10:23 AM',
      status: {
        type: 'added',
        comment: 'Added New Truck #1256',
        info: {
          unit: 1254,
          year: 2020,
          make: 'Volvo',
          type: '../../../../assets/img/svgs/truck/semi-truck.svg',
        },
      },
    },
    {
      img: 'https://static.toiimg.com/photo/msid-77965239/77965239.jpg?pl=1189319',
      time: '15 Apr, 2019',
      name: 'Michael Jordan',
      al: 'MJ',
      hour: '11:23 AM',
      status: {
        type: 'added',
        comment: 'Added New Truck #3478',
        info: {
          unit: 3478,
          year: 2020,
          make: 'Volvo',
          type: '../../../../assets/img/svgs/truck/semi-truck.svg',
        },
      },
    },
    {
      img: 'https://i.pinimg.com/originals/78/4d/86/784d86ebc0b04cdc04bc3b1f79b94455.jpg',
      time: '12 Apr, 2019',
      name: 'Scottie Pippen',
      al: 'SP',
      hour: '03:23 PM',
      status: {
        type: 'updated',
        comment: 'Updated Status',
        info: {
          year: 2020,
          make: 'Western',
        },
      },
    },
    {
      img: 'https://i.pinimg.com/originals/78/4d/86/784d86ebc0b04cdc04bc3b1f79b94455.jpg',
      time: '10 Apr, 2019',
      name: 'Scottie Pippen',
      al: 'SP',
      hour: '08:23 AM',
      status: {
        type: 'deleted',
        comment: 'Removed Trailer #L65665',
        info: {
          unit: 'L65665',
          year: 2017,
          make: 'Dorsey',
          type: '../../../../assets/img/svgs/trailer/dry-van.svg',
        },
      },
    },
  ];

  dailyUserData = [
    {
      date: '12/01/2021',
      data: this.users,
    },
    {
      date: '11/01/2021',
      data: this.users,
    },
    {
      date: '10/01/2021',
      data: this.users,
    },
    {
      date: '09/01/2021',
      data: this.users,
    },
    {
      date: '08/01/2021',
      data: this.users,
    },
    {
      date: '07/01/2021',
      data: this.users,
    },
    {
      date: '06/01/2021',
      data: this.users,
    },
  ];

  public user_data = [
    { unit: '1256', year: '2012', make: 'Volvo', type: 'grean' },
    { unit: '1345', year: '2013', make: 'Benz', type: 'red' },
    { unit: '1673', year: '2014', make: 'BMW', type: 'blue' },
    { unit: '1154', year: '2015', make: 'AUDI', type: 'yellow' },
  ];
  public selected__nav_option = 1;
  public selected__nav_option_sub = 4;

  public documents: any = [];

  docViewType = 1;
  visibleGroup = -1;
  visibleIndex = -1;
  public index = 0;
  public clickedInSideBar = false;
  canPlayAnimation = true;
  @Input() isOpen = false;
  @Input() width = '0px';
  @Input() counter = 0;
  @Output() sideBarClose: EventEmitter<any> = new EventEmitter();

  private notifySubscription: Subscription;

  private updateOfficeFactoringSubscription: Subscription;
  private companySubscription?: Subscription;

  change: boolean;

  allTrucks: any[];
  semiTrucks: any[] = [];
  semiSleepersTrucks: any[] = [];
  carHaulerTrucks: any[] = [];
  boxTrucks: any[] = [];
  cargoVan: any[] = [];
  towTruck: any[] = [];
  bus: any[] = [];
  motor: any[] = [];
  persVehicle: any[] = [];

  allTrailers: any[];
  reefer: any[] = [];
  dryVan: any[] = [];
  sideKit: any[] = [];
  conestoga: any[] = [];
  dumper: any[] = [];
  container: any[] = [];
  tanker: any[] = [];
  carHaulerTrailer: any[] = [];
  flatBed: any[] = [];
  lowBoy: any[] = [];
  chassis: any[] = [];
  stepDeck: any[] = [];
  companies: any;
  openedItem = 0;
  files: any;

  constructor(
    private shared: SharedService,
    private sharedService: AppSharedService,
    private truckService: AppTruckService,
    private storageService: StorageService,
    private trailerService: AppTrailerService
  ) {}

  openSidebar(): void {
    document.getElementById('mySidebar').classList.toggle('opened');
  }

  ngOnInit(): void {
    document.getElementById('mySidebar').style.width = '0px';
    this.notifySubscription = this.shared.notifyObservable$.subscribe((res) => {
      if (res.hasOwnProperty('option') && res.option === 'call_child') {
        document.getElementById('mySidebar').style.width = '0px';
        this.counter = 0;
        this.isOpen = false;
        this.sideBarClose.emit(true);
      }
    });
    this.updateOfficeFactoringSubscription = this.sharedService.updateOfficeFactoringSubject.subscribe(
      () => {
        this.getCompany();
      }
    );
    this.getCompany();
    this.getDocuments();
  }

  // dropdown
  showCompanyInfo(indx: number) {
    this.openedItem = this.openedItem == indx ? -1 : indx;
    this.tabs[0].name = this.companies[indx].trucksLenght + ' Trucks';
    this.tabs[1].name = this.companies[indx].trailersLength + ' Trailers';
  }

  getDocuments() {
    this.storageService.getDocuments().subscribe(
      (resp: any) => {
        this.files = [];
        this.documents = [];
        this.documents = resp;
       /*  console.log('documents: ', resp); */
        if (resp.length > 0) {
          this.handleFiles();
        }
      },
      (error: HttpErrorResponse) => {
        this.shared.handleError(error);
      }
    );
  }

  handleFiles() {
    this.documents && this.documents.forEach((element: any) => {
      const urlToObject = async () => {
        const response = await fetch(element.url);
        // here image is url/location of image
        const blob = await response.blob();
        const file: any = new File([blob], element.fileName, { type: blob.type });

        file.fileType = (file.type == 'application/pdf') ? 'pdf' : 'img';
        file.fileItemGuid = element.fileItemGuid ? element.fileItemGuid : null;
        file.url = element.url ? element.url : null;

        this.files.push(file);
        // emit frontend files
      };
      urlToObject();
    });
  }

  // which tab switch is selected
  public tabChange(ev: any) {
    if (ev[0].checked) {
      this.selectedTab = ev[0].id;
    } else {
      this.selectedTab = ev[1].id;
    }
  }

  ngOnDestroy(): void {
    this.notifySubscription.unsubscribe();
    this.companySubscription?.unsubscribe();
    this.updateOfficeFactoringSubscription.unsubscribe();
  }

  private getCompany() {
    const currentUserJsonString = localStorage.getItem('currentUser');
    const { companyId } = JSON.parse(currentUserJsonString);
   /*  this.companySubscription = this.sharedService.getCommentList().subscribe((res) => {
      this.company = { ...res };
    }); */
    this.companySubscription = this.sharedService.getCompany(companyId).subscribe((res: any) => {
      this.companies = res.companyDivision ? res.companyDivision : [];
      delete res.companyDivision;
      this.companies.unshift(res);

      this.companies.map(res => {
        res.trucksLenght = res.truckStatByType.map(item => {
          item.mainClass = item.category.replace(/[^a-zA-Z]/g, '').toLowerCase();
          item.mainImage = TRUCK_LIST_APPLICANTS.find(truck => truck.name == item.category)?.file;
          return item;
        })
        .reduce((mainData, item) => {
          mainData = mainData + item.count;
          return mainData;
        }, 0);

        res.trailersLength = res.trailerStatByType.map(item => {
          item.mainClass = item.category.replace(/[^a-zA-Z]/g, '').toLowerCase();
          item.mainImage = TRAILER_LIST.find(trailer => trailer.name == item.category)?.file;
          return item;
        })
        .reduce((mainData, item) => {
          mainData = mainData + item.count;
          return mainData;
        }, 0);

        return res;
      });

      this.tabs[0].name = this.companies[0].trucksLenght + ' Trucks';
      this.tabs[1].name = this.companies[0].trailersLength + ' Trailers';
    });
    let count = 0;
    const interval = setInterval(() => {
      count++;
      if (count === 1) {
        clearInterval(interval);
      }
    }, 1000);
  }

  public openNav() {}

  onNavOptionSelect(index: number) {
    this.selected__nav_option = index;
    this.selected__nav_option_sub = 4;
  }

  onNavOptionSubSelect(index: number) {
    this.selected__nav_option_sub = index;
  }

  onUserSelected(group: number, index: number) {
    if (this.visibleGroup === group && this.visibleIndex === index) {
      this.visibleGroup = -1;
      this.visibleIndex = -1;
      return;
    }

    if (this.visibleGroup === group) {
      this.visibleIndex = index;
      return;
    }

    this.visibleGroup = group;
    this.visibleIndex = index;
  }

  onChangeDocViewType(index: number) {
    this.docViewType = index;
  }

  getTrucks() {
    this.truckService.getTruckList().subscribe((result: any) => {
      this.allTrucks = result.activeTrucks;
      this.tabs[0].name = result.activeTrucks.length + ' Trucks';
      for (let i = 0; i < this.allTrucks.length; i++) {
        this.allTrucks[i].doc.additionalData.type.file
          ? `assets/img/svgs/truck/${this.allTrucks[i].doc.additionalData.type.file}`
          : '';
      }
      for (let i = 0; i < this.allTrucks.length; i++) {
        if (this.allTrucks[i].doc.additionalData.type.name === 'Semi w/Sleeper') {
          this.semiSleepersTrucks.push(this.allTrucks[i]);
        } else if (this.allTrucks[i].doc.additionalData.type.name === 'Semi Trucks') {
          this.semiTrucks.push(this.allTrucks[i]);
        } else if (this.allTrucks[i].doc.additionalData.type.name === 'Box Truck') {
          this.boxTrucks.push(this.allTrucks[i]);
        } else if (this.allTrucks[i].doc.additionalData.type.name === 'Cargo Van') {
          this.boxTrucks.push(this.allTrucks[i]);
        } else if (this.allTrucks[i].doc.additionalData.type.name === 'Tow Truck') {
          this.towTruck.push(this.allTrucks[i]);
        } else if (this.allTrucks[i].doc.additionalData.type.name === 'Bus') {
          this.bus.push(this.allTrucks[i]);
        } else if (this.allTrucks[i].doc.additionalData.type.name === 'Motorcycle') {
          this.motor.push(this.allTrucks[i]);
        } else if (this.allTrucks[i].doc.additionalData.type.name === 'Pers. Vehicle') {
          this.persVehicle.push(this.allTrucks[i]);
        } else {
          this.carHaulerTrucks.push(this.allTrucks[i]);
        }
      }
    });
  }

  getTrailers() {
    this.trailerService.getTrailerList().subscribe((result: any) => {
      this.allTrailers = result.activeTrailers;
      this.tabs[1].name = result.activeTrailers.length + ' Trailers';
      for (let i = 0; i < this.allTrailers.length; i++) {
        this.allTrailers[i].doc.additionalData.type.file
          ? `assets/img/svgs/trailer/${this.allTrailers[i].doc.additionalData.type.file}`
          : '';
      }
      for (let i = 0; i < this.allTrailers.length; i++) {
        if (this.allTrailers[i].doc.additionalData.type.name === 'Reefer') {
          this.reefer.push(this.allTrailers[i]);
        } else if (this.allTrailers[i].doc.additionalData.type.name === 'Dry Van') {
          this.dryVan.push(this.allTrailers[i]);
        } else if (this.allTrailers[i].doc.additionalData.type.name === 'Side Kit') {
          this.sideKit.push(this.allTrailers[i]);
        } else if (this.allTrailers[i].doc.additionalData.type.name === 'Conestoga') {
          this.conestoga.push(this.allTrailers[i]);
        } else if (this.allTrailers[i].doc.additionalData.type.name === 'Dumper') {
          this.dumper.push(this.allTrailers[i]);
        } else if (this.allTrailers[i].doc.additionalData.type.name === 'Dumper') {
          this.container.push(this.allTrailers[i]);
        } else if (this.allTrailers[i].doc.additionalData.type.name === 'Tanker') {
          this.tanker.push(this.allTrailers[i]);
        } else if (this.allTrailers[i].doc.additionalData.type.name === 'Car Hauler Trailer') {
          this.carHaulerTrailer.push(this.allTrailers[i]);
        } else if (this.allTrailers[i].doc.additionalData.type.name === 'Flat Bed') {
          this.flatBed.push(this.allTrailers[i]);
        } else if (this.allTrailers[i].doc.additionalData.type.name === 'Low Boy') {
          this.lowBoy.push(this.allTrailers[i]);
        } else if (this.allTrailers[i].doc.additionalData.type.name === 'Chassis') {
          this.chassis.push(this.allTrailers[i]);
        } else {
          this.stepDeck.push(this.allTrailers[i]);
        }
      }
    });
  }

  downloadFile(file: File) {
    this.getBase64(file);
  }

  getBase64(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      const a = document.createElement('a');
      a.href = reader.result.toString();
      a.download = file.name; // File name Here
      a.click();
    };
    reader.onerror = function(error) {
      console.log('Error: ', error);
    };
  }

  emitImagePreview(event: any, slideIndex?: number) {
    console.log('emitImagePreview');
  }
}
