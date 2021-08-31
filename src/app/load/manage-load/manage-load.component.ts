import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { AppSharedService } from 'src/app/core/services/app-shared.service';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  ChangeDetectorRef,
  NgZone,
  HostListener,
} from '@angular/core';
import { Enums } from 'src/app/core/model/shared/enums';
import { FormArray, FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { AppLoadService } from 'src/app/core/services/app-load.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/core/services/shared.service';
import { CustomerManageComponent } from './../../customer/customer-manage/customer-manage.component';
import { Subject } from 'rxjs';
import { AppCustomerService } from 'src/app/core/services/app-customer.service';
import * as AppConst from './../../const';
import { CdkDragDrop, moveItemInArray, CdkDrag } from '@angular/cdk/drag-drop';
import { MaintenanceService } from 'src/app/core/services/maintenance.service';
import { pasteCheck } from 'src/assets/utils/methods-global';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { AppCommentsComponent } from '../../shared/app-comments/app-comments.component';
import { formatPhoneNumber } from 'src/app/core/helpers/formating';
const moment = require('moment/moment');
import { ShippersPipe } from './../../core/pipes/shippers.pipe';
import { ToastrService } from 'ngx-toastr';
import { ShipperManageComponent } from 'src/app/customer/shipper-manage/shipper-manage.component';
import { animate, style, transition, trigger, keyframes } from '@angular/animations';
import { StorageService } from 'src/app/core/services/storage.service';
import { FILE_TABLES } from 'src/app/const';

@Component({
  selector: 'app-manage-load',
  templateUrl: './manage-load.component.html',
  styleUrls: ['./manage-load.component.scss'],
  providers: [ShippersPipe],
  animations: [
    trigger('commentAnimation', [
      transition('* => expanded', [
        style({ marginLeft: 'calc(100% - 32px)' }),
        animate('300ms', style({ height: '32px', width: '32px' })),
        animate('600ms', style({ width: '*' })),
      ]),
      transition('* => notexpanded', [animate('500ms', style({ width: '32px' }))]),
    ]),
    trigger('commentTopAnimation', [
      transition(':enter', [animate('1000ms', style({ width: '*' }))]),
      transition(':leave', []),
    ]),
    trigger('commentBottomAnimation', [
      transition(':enter', [animate('1000ms', style({ width: '*' }))]),
      transition(':leave', [animate('500ms', style({ height: '0' }))]),
    ]),
    trigger('pickupAnimation', [
      transition(':enter', [
        style({ height: 10 }),
        animate('200ms', style({ height: '*' })),
      ]),
      transition(':leave', [
        animate('250ms', style({ height: 0 })),
      ]),
    ]),
  ],
})
export class ManageLoadComponent implements OnInit, OnDestroy {

  constructor(
    private formBuilder: FormBuilder,
    private loadService: AppLoadService,
    private spinner: SpinnerService,
    private activeModal: NgbActiveModal,
    private notification: NotificationService,
    private shared: SharedService,
    private customModalService: CustomModalService,
    private customerService: AppCustomerService,
    private appShared: AppSharedService,
    private maintenanceService: MaintenanceService,
    private shipperPipe: ShippersPipe,
    private ref: ChangeDetectorRef,
    private storageService: StorageService,
    private zone: NgZone,
    private toastr: ToastrService
  ) {}
  get additionsFormGropus() {
    return (this.loadForm.get('doc') as FormGroup).get('additions') as FormArray;
  }

  get ratesFormGroup() {
    return this.loadForm.get('rates') as FormArray;
  }

  get waypointFormGroup() {
    return (this.loadForm.get('doc') as FormGroup).get('waypoints') as FormArray;
  }
  @Input() inputData: any;
  @ViewChild('note') note: ElementRef;
  @ViewChild(AppCommentsComponent, { static: false }) commentSection: AppCommentsComponent;

  loadForm: FormGroup;
  lang = 'en';

  waypointList: FormArray;

  additionFormGroup: FormArray;
  drivers: FormArray;
  customers = new FormControl();
  loadCustomers: any[];
  loadTrucks: any[];
  loadShippers: any[] = [];

  pickupShippers: any[] = [];
  deliveryShippers: any[] = [];

  selectedPickup = null;
  selectedDelivery = null;

  loadAdditionTypes = JSON.parse(JSON.stringify(AppConst.ADDITION_TYPE_LIST));
  loadAdditionTypesHolder = AppConst.ADDITION_TYPE_LIST;
  loadStatuses = AppConst.LOAD_STATUS;
  loadDeductionTypes: Enums[];
  loadDispatchers: any[];
  loadCompany: any = [];
  companyState = true;
  defaultType;
  baseRateEditEnd: boolean;
  showNote = false;
  newDate;
  totalPrice = 0;
  sumDed;
  additionalValueArray = [];
  deductionValueArray = [];
  baseRateeValue;
  revisedRateeValue;
  textRows = 1;
  mapOpened = false;
  origin: any;
  destination: any;
  tempWaypoints = [];
  distance = '0';
  statusId: number;
  public steps: any = { year: 1, month: 1, day: 1, hour: 1, minute: 15, second: 0 };
  originInfoWindowData: any;
  destinationInfoWindowData: any;
  truckSelected = false;
  selectedTruck = null;
  comments_expanded = false;
  public shippersListItems: any = [];
  public pickupListItems: any;
  public deliveryListItems: any;

  private destroy$: Subject<void> = new Subject<void>();
  mapRestrictions = {
    latLngBounds: AppConst.NORTH_AMERICA_BOUNDS,
    strictBounds: true,
  };

  activeData: any = {
    deliveryDateTime: '',
    multipleItems: []
  };

  // LOAD_STATUS_ARRAY = AppConst.LOAD_STATUS_ARRAY;

  legMilage = [];

  public styles = AppConst.GOOGLE_MAP_STYLES;

  mainMarkers: any;

  scrollConfig = {
    suppressScrollX: true,
    suppressScrollY: false,
  };
  user: any;
  newLoadStatus = 0;

  spinnerLoad = false;
  loadTitle: string;
  company1Active = true;
  clearFiles = false;
  files = [];
  loadComments: any = [];
  loadLastNumber = 0;

  ratesEdit: any = {
    baseRate: false,
    revised: false,
    adjusted: false,
    advanced: false,
    lumper: false,
    detention: false,
    layover: false,
    escort: false,
    fuelSurch: false,
  };
  waypoints = [];

  public renderOptions = {
    suppressMarkers: true,
    polylineOptions: {
      strokeColor: '#28529F',
    },
  };

  markerTypes: any = {
    delivery: [],
    pickup: [],
  };

  originMarker = {
    lat: 0,
    lng: 0,
  };

  destinationMarker = {
    lat: 0,
    lng: 0,
  };

  mapCenter: any = {
    latitude: 0,
    longitude: 0,
  };

  agmMap: any;

  destinationIcon = '../../../../assets/img/dispatch_marker.svg';
  originIcon = '../../../../assets/img/dispatch_icon_green.svg';

  waypointMarkers = [];
  editLoadId: number;

  loadData: any;

  searchItems = {
    dispatcher: 0,
    broker: 0,
    startingPoint: 0,
    shipper: 0,
    endingPoint: 0,
  };

  attachments: any = [];

  statusOpenedIndex = -1;

  truckLocationPosition: any;

  additionalRates: any = [];
  additinalRateAdded = false;
  show_revised: any = 0;
  nonAdditionalItems: any = ['baseRate', 'adjusted', 'advanced', 'revised'];

  waypointsWithAddress: any;

  public fomratType = /^[!@#$%^&*()_+\=\[\]{};':"\\|,<>\?]*$/;
  public numOfSpaces = 0;

  // TO DO - TRANSFER ALL TO SEPARATE FILE
  activatedLoadMap: number;
  selectedShipperId: number;
  activatedLoadMapSnazzy: boolean;

  startIndexShipperDrag: number;

  agmWindowTimeout: any;

  public setActive(item, status) {
    this.activeData[item] = status;
  }

  public changeActive(item) {
    this.activeData[item] = this.activeData[item] == 'open' ? 'app' : 'open';
  }

  addStatus(ev) {
    if (ev === 'error') {
      this.statusOpenedIndex = -1;
      return;
    }
    this.loadForm.patchValue({
      statusId: ev.id,
    });
    this.statusOpenedIndex = -1;
    this.loadService
      .updateLoadStatus(JSON.stringify({ statusId: ev.id }), this.editLoadId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.notification.success('Load Status has been updated.', 'Success:');
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  @HostListener('document:click', ['$event'])
  handleKeyboardEvent(event: any) {
    if (event.target && event.target.className) {
      if (typeof event.target.className.includes !== 'undefined' && event.target.parentNode) {
        if (
          !event.target.className.includes('switch_statuses') &&
          !event.target.parentNode.className.includes('switch_statuses')
        ) {
          setTimeout(() => {
            this.statusOpenedIndex = -1;
          }, 500);
        }
      }
    }
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.createNewForm();

    if (this.inputData.data.type === 'new') {
      this.loadLastNumber = 0;
      this.loadService.getLoadLastId()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.loadLastNumber = res.newLoadId;
      });
      this.loadTitle = 'Add Load';
      this.getLoadData();
      this.newDate = moment().format('MM/DD/YY - HH:mm');
    } else if (this.inputData.data.type === 'edit') {
      this.loadTitle = 'Edit Load';
      this.newDate = moment().format('MM/DD/YY - HH:mm');
      if (this.inputData.data.id) {
        this.editLoadId = this.inputData.data.id;
        this.loadService.getLoadEdit(this.inputData.data.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe((result: any) => {
          this.loadData = result;
          this.attachments = (result.doc && result.doc.attachments) ? result.doc.attachments : [];
          this.loadForm.patchValue({
            attachments: this.attachments
          });
          this.loadForm.patchValue({
            dispatchBoardId: result.dispatchBoardId,
            brokerId: result.brokerId,
            loadNumber: result.loadNumber,
            category: result.category,
            statusId: result.statusId,
            note: result.note,
            brokerLoadNumber: result.brokerLoadNumber,
            additionTotal: result.additionTotal,
            deductionTotal: result.deductionTotal /** back calculated */,
            total: result.total,
            companyCheck: result.companyCheck,
            dispatcherId: result.dispatcherId,
            pickupId: result.pickupId,
            deliveryId: result.deliveryId,
            pickupDateTime: new Date(result.pickupDateTime),
            deliveryDateTime: new Date(result.deliveryDateTime),
            mileage: result.mileage,
            pickupCount: result.pickupCount /** back calculated */,
            destinationCount: result.destinationCount /** back calculated */,
          });
          this.getLoadData(result.truckNumber, result.assignedCompanyId);
          const tempDoc = result.route;
          const allRates = result.rates;
          allRates.forEach((element) => {
            let inside_index = -1;
            this.ratesFormGroup.value.forEach((elem, index) => {
              if (element.Title == elem.title) { inside_index = index; }
            });

            if (inside_index > -1) {
              this.ratesFormGroup.at(inside_index).patchValue({
                rate: element.Rate,
                edited: 'on',
              });
            } else if (element.Title == 'revised') {
              this.ratesFormGroup.insert(
                1,
                this.formBuilder.group({
                  title: 'revised',
                  label: 'Revised',
                  rate: element.Rate,
                  edited: 'on',
                })
              );
              this.show_revised = 1;
            } else {
              const finded_label = this.loadAdditionTypesHolder.find(
                (elem) => elem.formName == element.Title
              );
              this.ratesFormGroup.push(
                this.formBuilder.group({
                  title: element.Title,
                  label: finded_label.name,
                  rate: element.Rate,
                  edited: 'on',
                })
              );
            }
          });

          tempDoc.forEach((element) => {
            if (
              (element.PointOrder > 1 && element.PointType == 'pickup') ||
              (element.PointType == 'delivery' && element.PointOrder < result.deliveryCount)
            ) {
              ((this.loadForm.get('doc') as FormGroup).get('waypoints') as FormArray).push(
                this.setWaypoint(element)
              );
              this.shippersListItems.push([]);
            } else if (
              (element.PointOrder == 1 && element.PointType == 'pickup') ||
              (element.PointType == 'delivery' && element.PointOrder == result.deliveryCount)
            ) {
              const pointAt = element.PointType == 'pickup' ? 0 : 1;
              const pointArray = this.loadForm.get('route') as FormArray;
              pointArray.at(pointAt).patchValue({
                shipperId: element.ShipperId,
                shipperName: element.ShipperName,
                pointType: element.PointType,
                distanceMiles: parseInt(element.DistanceMiles),
                pointOrder: element.PointOrder,
                pointZip: element.PointZip,
                pointCity: element.PointCity,
                pointAddress: element.PointAddress,
                pointState: element.PointState,
                pointCountry: element.PointCountry,
              });

              pointArray.controls[pointAt]
                .get('pointDatetime')
                .setValue(new Date(element.PointDateTime));
            }
          });

          this.total();
          if (result.companyCheck) {
            this.companyState = true;
          } else {
            this.companyState = false;
          }
          if (result.note.length > 0) {
            this.showNote = true;
            this.handleHeight(result.note);
          }
          if (result.statusId === 5) {
            this.loadForm.disable();
          }
          setTimeout(() => {
            this.origin = { address: result.pickupLocation, id: result.pickupId };
            this.destination = { address: result.deliveryLocation, id: result.deliveryId };
            this.getDistance(this.origin, this.destination, this.waypointRender());
          });
        });

        this.loadService.getLoadComments(this.inputData.data.id).subscribe((res: any) => {
          this.loadComments = res.reverse();
        });
      }
    }

    this.shared.emitShipperChange
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      this.getLoadShippers();
    });

    this.shared.emitShipperClose
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      this.origin &&
        this.destination &&
        this.getDistance(this.origin, this.destination, this.waypointRender());
    });

    this.customerService.newCustomer
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      this.loadService.getLoadCustomers().subscribe((result: any) => {
        this.setCustomerData(result);
      });
    });

    this.shared.emitDeleteFiles
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (files: any) => {
        if (files.success) {
          const removedFile = files.success[0];
          this.loadData.doc.attachments = this.loadData.doc.attachments.filter((file: any) => file.fileItemGuid !== removedFile.guid);
          this.manageLoad(true);
        }
      }
    );
  }
  openIndex(indx: number) {
    this.statusOpenedIndex = indx;
  }

  setCustomerData(result): void {
    this.loadCustomers = result
      .sort((a, b) => {
        const o1 = a.dnu;
        const o2 = b.dnu;

        const p1 = a.ban;
        const p2 = b.ban;

        if (o1 < o2) { return -1; }
        if (o1 > o2) { return 1; }
        if (p1 < p2) { return -1; }
        if (p1 > p2) { return 1; }
        return 0;
      })
      .map((item) => {
        if (item.ban === 1 || item.dnu === 1) { item.disabled = true; }
        return item;
      });
    console.log('add new');
    this.loadCustomers.unshift({
      id: 0,
      brokerName: 'Add new',
      customerAddress: null,
    });
    // this.loadCustomers.reverse();
  }

  setFiles(files: any) {
    this.files = files;
  }

  setWaypoint(data: any) {
    return this.formBuilder.group({
      shipperId: [data.ShipperId, Validators.required],
      pointDatetime: [new Date(data.PointDateTime), Validators.required],
      shipperName: data.ShipperName,
      pointType: data.PointType,
      distanceMiles: parseInt(data.DistanceMiles),
      pointOrder: data.PointOrder,
      pointZip: data.PointZip,
      pointCity: data.PointCity,
      pointAddress: data.PointAddress,
      pointState: data.PointState,
      pointCountry: data.PointCountry,
    });
  }

  setAddition(data: any) {
    return this.formBuilder.group({
      type: data.type,
      value: data.value,
    });
  }

  switchCompany(event) {
   
    this.company1Active = event;
    event.map((item) => {
      if (item.checked) {
        this.loadForm.get('companyCheck').setValue(item.id);
        this.loadForm.get('assignedCompanyId').setValue(item.id);
      }
    });
  }

  onAddShipper() {
    const data = {
      type: 'new',
      id: null,
    };
    this.customModalService.openModal(ShipperManageComponent, { data }, null, {
      size: 'small',
    });
  }

  addNewComment() {
    // if( !this.comments_expanded ) {
    //   this.comments_expanded = true;
    //   return;
    // }

    this.comments_expanded = true;
    this.commentSection.startNewMessages();
  }

  getLoadData(truckNumber?, compId?) {
    setTimeout(() => {
      this.loadService.getDispatchers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: any) => {
        // result.push({id: 79, dispatcherFirstName: 'Slavisa', dispatcherLastName: 'Disp'});
        const itemIndex = result.findIndex((item) => item.id === this.user.id);
        result.splice(0, 0, result.splice(itemIndex, 1)[0]);

        this.loadDispatchers = result;

        // this.loadDispatchers.unshift({
        //   id: 0,
        //   dispatcherFirstName: 'All',
        //   dispatcherLastName: 'Dispatchers',
        // });
        // TO DO - DO LOGIC IF THERE IS NO DISPATCHERS IN LIST
        if (itemIndex > -1 && this.loadForm.get('dispatcherId').value === null) {
          this.loadForm.get('dispatcherId').setValue(this.user.id);
        } else if (this.loadForm.get('dispatcherId').value === null) {
          this.loadForm.get('dispatcherId').setValue(this.loadDispatchers[0].id);
 }
      });
      this.loadService.getLoadCustomers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: any) => {
        this.setCustomerData(result);
      });

      this.loadService.getAllLoadTrucks()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: any) => {
        if (result[0].id !== null) {
          this.loadTrucks = result.filter((item) => {
            if (truckNumber && item.truckNumber == truckNumber) {
              this.truckLocationPosition = item.location;
              this.selectedTruck = item;
              this.truckSelected = true;
            }
            return item.truckNumber;
          });
        } else {
          this.loadTrucks = [];
        }
      });

      this.getLoadShippers();

      const user = JSON.parse(localStorage.getItem('currentUser'));
      let is_checked = false;
      let is_checked_main = false;
      this.appShared.getCompany(user.companyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.loadCompany = res.companyDivision ? res.companyDivision.map((item, index) => {
          is_checked = false;
          if (this.inputData.data.type === 'edit' && compId === item.id) {
            this.loadForm.get('assignedCompanyId').setValue(item.id);
            is_checked = true;
          }
          return { id: item.id, name: item.name, checked: is_checked };
        }) : [];
        if (this.inputData.data.type === 'new' || compId == res.id) {
          is_checked_main = true;
          this.loadForm.get('assignedCompanyId').setValue(res.id);
        }

        this.loadCompany.unshift({ id: res.id, name: res.name, checked: is_checked_main });
      });
      if (this.inputData.data.type === 'new') {
        this.loadTitle = 'Add Load';
      } else if (this.inputData.data.type === 'edit') {
        this.loadTitle = 'Edit Load | ' + this.loadForm.get('loadNumber').value;
      }
    });
  }

  handleHeight(val: string) {
    const lines = val.split(/\r|\r\n|\n/);
    const count = lines.length;
    this.textRows = count >= 4 ? 4 : count;
  }

  changeBroker(event) {
    if (event !== undefined) {
      if (event.id == 0) {
        this.loadForm.controls.brokerId.reset();
        const data = {
          type: 'new',
          id: null,
        };
        this.customModalService.openModal(CustomerManageComponent, { data }, null, {
          size: 'small',
        });
      }
    }
  }

  getLoadShippers() {
    this.loadShippers = [];
    this.pickupShippers = [];
    this.deliveryShippers = [];

    this.loadService.getLoadShippers()
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (result: any) => {
        console.log('result after adding');
        console.log(result);
        result.push({
          id: 0,
          shipperAddress: null,
          shipperName: 'Add new',
        });

        result.sort((a, b) => (a.id > b.id ? 1 : -1));

        this.loadShippers = this.pickupShippers = this.deliveryShippers = result;

        this.spinnerLoad = true;
      },
      (error: any) => {
        this.spinnerLoad = true;
      }
    );
  }

  company(event) {
    if (!event) {
      this.companyState = false;
      this.loadForm.get('division').enable();
    } else {
      this.companyState = true;
      this.loadForm.get('division').disable();
    }
  }
  selectTruck(event) {
    this.selectedTruck = event;
    if (event !== undefined) {
      this.truckSelected = true;
      this.loadForm.get('dispatchBoardId').setValue(event.id);
      this.loadForm.get('statusId').setValue(1);
      this.truckLocationPosition = event.location;
      this.startingPointDeadHeadingDistance();
    } else {
      this.loadForm.get('dispatchBoardId').setValue(null);
      this.loadForm.get('statusId').setValue(0);
    }
    if (this.inputData.data.type === 'new') {
      this.newLoadStatus = event ? 1 : 0;
    } else {
      this.truckSelected = false;
      // this.loadData.data.statusId = event ? 2 : 1;
    }
  }

  addNewAddition() {
    ((this.loadForm.get('doc') as FormGroup).get('additions') as FormArray).push(
      this.formBuilder.group({
        type: [null],
        value: '',
      })
    );
  }

  closeValueCard() {
    this.truckSelected = false;
    this.selectedTruck = null;
    this.newLoadStatus = 0;
    this.loadForm.get('dispatchBoardId').setValue(null);
    this.loadForm.get('statusId').setValue(0);
  }

  addNewAdditional(mod) {
    // this.loadAdditionTypes = this.loadAdditionTypes.filter(item => item.id != mod.id);
    this.additionalRates.push({ name: mod.formName, label: mod.name, id: mod.id });
    (this.loadForm.get('rates') as FormArray).push(
      this.formBuilder.group({
        title: mod.formName,
        label: mod.name,
        rate: null,
        edited: null,
      })
    );
    this.ratesEdit.additionals = false;
    this.loadForm.patchValue({
      additionals: null,
    });
  }

  saveRate(ind, isBox?, fromBox?, isBlur?) {
    const rateControlls = this.loadForm.get('rates') as FormArray;

    const value_title = rateControlls.controls[ind].get('title').value;
    if (
      isBlur &&
      !rateControlls.controls[ind].get('rate').value &&
      (value_title == 'adjusted' || value_title == 'advanced')
    ) {
      rateControlls.controls[ind].get('edited').setValue(false);
    }
    if (rateControlls.controls[ind].get('rate').value || fromBox) {
      rateControlls.controls[ind].get('edited').setValue(isBox ? isBox : true);

      if (!this.nonAdditionalItems.includes(value_title)) {
        this.additinalRateAdded = false;
      }
    }
    this.total();
  }

  checkForRevised(ind) {
    if (this.inputData.data.type === 'edit' && this.loadForm.get('statusId').value > 3) {
      (this.loadForm.get('rates') as FormArray).insert(
        1,
        this.formBuilder.group({
          title: 'revised',
          label: 'Revised',
          rate: null,
          edited: null,
        })
      );
      this.show_revised = 1;
      return;
    }
    (this.loadForm.get('rates') as FormArray).controls[ind].get('edited').setValue(null);
    this.total();
  }

  removeRates(ind, title) {
    if (title == 'revised') {
      this.show_revised = 0;
    }
    if (title == 'adjusted') {
      this.loadForm.get('adjustedTotal').setValue(0);
    }
    if (title !== 'adjusted' && title !== 'advanced') {
      (this.loadForm.get('rates') as FormArray).removeAt(ind);
    } else {
      (this.loadForm.get('rates') as FormArray).at(ind).patchValue({
        edited: null,
        rate: null,
      });
    }

    this.total();
  }

  saveRateValue(mod, state) {
    this.ratesEdit[mod] = state;
    this.additinalRateAdded = true;
  }

  createNewForm() {
    this.loadForm = this.formBuilder.group({
      assignedCompanyId: [null, Validators.required],
      dispatchBoardId: null,
      brokerId: [null, Validators.required],
      loadNumber: [100] /** TODO: back calculated */,
      category: ['ftl'],
      statusId: [1],
      note: [''],
      baseRate: [null],
      additionals: null,
      revisedRate: [null],
      brokerLoadNumber: [null, Validators.required],
      additionTotal: [0],
      deductionTotal: [0] /** back calculated */,
      total: [0],
      adjustedTotal: [0],
      companyCheck: [0],
      reviseRate: [0],
      dispatcherId: [null, Validators.required],
      pickupId: [null, Validators.required],
      deliveryId: [null, Validators.required],
      pickupDateTime: [null, Validators.required],
      deliveryDateTime: [null, Validators.required],
      mileage: { value: this.distance, disabled: true },
      pickupCount: [0] /** back calculated */,
      deliveryCount: [0] /** back calculated */,
      route: this.formBuilder.array([
        this.formBuilder.group({
          shipperId: [null, Validators.required],
          pointDatetime: [null, Validators.required],
          shipperName: '',
          pointType: null,
          pointOrder: null,
          distanceMiles: null,
          pointZip: null,
          pointCity: null,
          pointAddress: null,
          pointState: null,
          pointCountry: null,
        }),
        this.formBuilder.group({
          shipperId: [null, Validators.required],
          pointDatetime: [null, Validators.required],
          shipperName: '',
          pointType: null,
          pointOrder: null,
          distanceMiles: null,
          pointZip: null,
          pointCity: null,
          pointAddress: null,
          pointState: null,
          pointCountry: null,
        }),
      ]),
      meta: [],
      doc: this.formBuilder.group({
        additions: this.formBuilder.array([]),
        waypoints: this.formBuilder.array([]),
      }),
      attachments: [],
      rates: this.formBuilder.array([
        this.formBuilder.group({
          title: 'baseRate',
          label: 'Base Rate',
          rate: [null, Validators.required],
          edited: null,
        }),
        this.formBuilder.group({
          title: 'adjusted',
          label: 'Adjusted',
          rate: null,
          edited: null,
          showBox: true,
        }),
        this.formBuilder.group({
          title: 'advanced',
          label: 'Advance',
          rate: null,
          edited: null,
          showBox: true,
          plusOrMinus: -1,
        }),
      ]),
    });
  }

  openShipperSelect(ind) {
    this.shippersListItems[ind] = [];
  }

  addLoadedRoutes() {
    let pickupCount = 1;
    let deliveryCount = 1;
    const tempArr = (this.loadForm.get('doc') as FormGroup).get('waypoints') as FormArray;
    let last_delivery_order = 0;
    const routes = this.loadForm.get('route') as FormArray;
    let routesIndx = 1;
    tempArr.value.forEach((element, index) => {
      if (element.pointType === 'delivery') {
        deliveryCount += 1;
        last_delivery_order++;
        element.pointOrder = last_delivery_order;
      } else if (element.pointType === 'pickup') {
        pickupCount += 1;
        element.pointOrder = pickupCount;
      }
      routes.insert(routesIndx, this.formBuilder.group(element));
      routesIndx++;
    });

    routes.at(routes.length - 1).patchValue({ pointOrder: this.markerTypes.delivery.length + 1 });
    this.legMilage.map((item, indx) => {
      if (item.distanceValue) {
        routes
          .at(indx)
          .patchValue({ distanceMiles: parseInt((item.distanceValue * 0.00062137).toFixed(0)) });
      }
    });

    this.loadForm.get('pickupCount').setValue(pickupCount);
    this.loadForm.get('deliveryCount').setValue(deliveryCount);
  }

  manageLoad(keepModal: boolean) {
    this.maintenanceService.loadChange = true;
    setTimeout(() => {
      if (this.inputData.data.type === 'new') {
        if (this.loadForm.invalid) {
          if (!this.shared.markInvalid(this.loadForm)) {
            return false;
          }
          return;
        }
        this.addLoadedRoutes();
        this.spinner.show(true);
        const loadForm = this.loadForm.getRawValue();
        loadForm.doc = {};
        loadForm.attachments = [];
        const rateControlls = this.loadForm.get('rates') as FormArray;
        const rates_controlls = [];

        rateControlls.value.forEach((element, index) => {
          if (element.rate) {
            rates_controlls.push({ title: element.title, rate: element.rate });
          }
        });
        loadForm.rates = rates_controlls;
        const newLoadData = JSON.stringify(loadForm);

        this.loadService.createLoad(newLoadData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (resp: any) => {
            this.activeModal.close();
            this.spinner.show(false);
            this.notification.success('Load added successfully.', 'Success:');

            const newFiles = this.shared.getNewFiles(this.files);
            if (newFiles.length > 0) {
              this.storageService.uploadFiles(resp.guid, FILE_TABLES.TRUCK_LOAD, resp.id, this.files).subscribe(
                (resp2: any) => {
                  if (resp2.success.length > 0) {
                    resp.success.forEach(element => {
                      loadForm.doc.attachments.push(element);
                    });
                    this.notification.success(`Attachments successfully uploaded.`, ' ');
                    this.loadService.updateLoad(resp.id, loadForm)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(
                      (resp3: any) => {
                        if (!keepModal) {
                          this.resetForm();
                        }
                        this.spinnerLoad = false;
                        this.notification.success(`Load for unit ${resp.id} updated.`, ' ');
                      },
                      (error: HttpErrorResponse) => {
                        this.shared.handleError(error);
                      }
                    );
                  } else {
                    if (!keepModal) {
                      this.resetForm();
                    }
                    this.spinnerLoad = false;
                  }
                },
                (error: HttpErrorResponse) => {
                  this.shared.handleError(error);
                }
              );
            } else {
              if (!keepModal) {
                this.resetForm();
              }
              this.spinnerLoad = false;
            }
          },
          (error: HttpErrorResponse) => {
            this.shared.handleError(error);
          }
        );
      } else if (this.inputData.data.type === 'edit') {
        if (this.loadForm.invalid) {
          if (!this.shared.markInvalid(this.loadForm)) {
            return false;
          }
          return;
        }
        this.addLoadedRoutes();
        this.spinner.show(true);
        const loadForm = this.loadForm.getRawValue();
        loadForm.doc = {};
        loadForm.attachments = (this.loadData.doc.attachments && this.loadData.doc.attachments !== null && this.loadData.doc.attachments.length == 0) ? this.loadData.doc.attachments : [];
        const rateControlls = this.loadForm.get('rates') as FormArray;
        const rates_controlls = [];
        rateControlls.value.forEach((element, index) => {
          if (element.rate) {
            rates_controlls.push({ title: element.title, rate: element.rate });
          }
        });
        loadForm.rates = rates_controlls;
        const newLoadData = JSON.stringify(loadForm);

        const newFiles = this.shared.getNewFiles(this.files);
        if (newFiles.length > 0) {
          this.storageService.uploadFiles(this.loadData.guid, FILE_TABLES.TRUCK_LOAD, this.loadData.id, this.files)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (resp2: any) => {
              if (resp2.success.length > 0) {
                resp2.success.forEach(element => {
                  loadForm.doc.attachments.push(element);
                });
                this.notification.success(`Attachments successfully uploaded.`, ' ');
                this.loadService.updateLoad(loadForm, this.loadData.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe(
                  (resp3: any) => {
                    if (!keepModal) {
                      this.resetForm();
                    }
                    this.spinnerLoad = false;
                    this.notification.success(`Load for unit ${this.loadData.id} updated.`, ' ');
                  },
                  (error: HttpErrorResponse) => {
                    this.shared.handleError(error);
                  }
                );
              } else {
                if (!keepModal) {
                  this.resetForm();
                }
                this.spinnerLoad = false;
              }
            },
            (error: HttpErrorResponse) => {
              this.shared.handleError(error);
            }
          );
        } else {
          this.loadService.updateLoad(newLoadData, this.loadData.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (result: any) => {
              this.activeModal.close();
              this.spinner.show(false);
              this.notification.success(`Load ${this.loadData.id} updated.`, 'Success:');
            },
            (error: any) => {
              this.shared.handleServerError();
            }
          );
        }

      }
    });
  }

  cancel() {
    this.resetForm();
  }

  resetForm() {
    this.loadForm.reset();
    this.showNote = false;
    this.activeModal.close();
    this.loadForm.get('companyCheck').setValue(true);
  }

  additionValue() {
    this.total();
  }

  deductionValue(event, index) {
    this.deductionValueArray[index] = event;
    this.total();
  }

  baseRateValue(event) {
    this.baseRateeValue = event;
    this.total();
  }

  additionPlaceholder(i) {
    const tempArr = ((this.loadForm.get('doc') as FormGroup).get('additions') as FormArray).value;
    return tempArr[i].type;
  }

  total() {
    const rateControlls = this.loadForm.get('rates') as FormArray;
    let totalRate = 0;
    let totalAdjusted = 0;
    let before_adjusted = false;
    rateControlls.value.forEach((element) => {
      if (element.rate) {
        if (element.title == 'advanced') {
          totalRate = totalRate - element.rate;
          if (before_adjusted) { totalAdjusted = totalAdjusted - element.rate; }
        } else if (element.title == 'revised') { totalRate = element.rate; } else if (element.title == 'adjusted') {
          totalRate = totalRate;
          totalAdjusted = element.rate;
          before_adjusted = true;
        } else {
          totalRate = totalRate + element.rate;
          if (before_adjusted) { totalAdjusted = totalAdjusted + element.rate; }
        }
      }
    });
    this.loadForm.get('total').setValue(totalRate);
    this.loadForm.get('adjustedTotal').setValue(totalAdjusted);
  }

  cancelEditModal() {
    this.activeModal.close();
  }

  openNote() {
    if (this.showNote === true) {
      this.showNote = false;
    } else {
      this.showNote = true;
      setTimeout(() => {
        this.note.nativeElement.focus();
      }, 250);
    }
  }

  removeShipper(i, type) {
    let tempArr: any;
    tempArr = this.loadForm.get(type) as FormArray;
    tempArr.removeAt(tempArr.value[i]);
  }

  removeAddition(i) {
    ((this.loadForm.get('doc') as FormGroup).get('additions') as FormArray).removeAt(i);
    this.total();
  }

  showCompany() {
    this.loadForm.get('companyCheck').setValue(true);
    this.loadForm.get('division').setValue(null);
    this.companyState = true;
  }

  public getMapInstance(map) {
    this.agmMap = map;
  }

  public startingPointDeadHeadingDistance() {
    const directionsService = new google.maps.DirectionsService();
    const routes = this.loadForm.get('route') as FormArray;
    if (this.truckLocationPosition && routes.at(0).get('shipperId').value) {
      new google.maps.DistanceMatrixService().getDistanceMatrix(
        {
          origins: [this.truckLocationPosition],
          destinations: [routes.at(0).get('pointAddress').value],
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (results: any) => {
          routes
            .at(0)
            .patchValue({
              distanceMiles: parseInt(
                (results.rows[0].elements[0].distance.value * 0.00062137).toFixed(0)
              ),
            });
        }
      );
    }
  }

  public getDistance(origins: any, destinations: any, waypoint: any[]) {
    console.log(waypoint);
    const directionsService = new google.maps.DirectionsService();
    const request = {
      origin: origins.address.address,
      destination: destinations.address.address,
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
          if (index === 0) {
            this.waypointMarkers.push({
              lat: response.routes[0].legs[0].start_location.lat(),
              lng: response.routes[0].legs[0].start_location.lng(),
              type: 'pickup',
              index: 1,
              shipper_id: origins.id,
            });
            this.mainMarkers.push({
              lat: response.routes[0].legs[0].start_location.lat(),
              lng: response.routes[0].legs[0].start_location.lng(),
            });
          }
          if (index == response.routes[0].legs.length - 1) {
            this.waypointMarkers.push({
              lat: response.routes[0].legs[response.routes[0].legs.length - 1].end_location.lat(),
              lng: response.routes[0].legs[response.routes[0].legs.length - 1].end_location.lng(),
              type: 'delivery',
              index: this.markerTypes.delivery.length + 1,
              shipper_id: destinations.id,
            });

            this.mainMarkers.push({
              lat: response.routes[0].legs[response.routes[0].legs.length - 1].end_location.lat(),
              lng: response.routes[0].legs[response.routes[0].legs.length - 1].end_location.lng(),
            });
          }
          const item_type = this.waypointsWithAddress[index]?.pointType
            ? this.waypointsWithAddress[index]?.pointType
            : 'delivery';
          const shipper_id = this.waypointsWithAddress[index]?.shipperId;
          this.originMarker.lat = response.routes[0].legs[0].start_location.lat();
          this.originMarker.lng = response.routes[0].legs[0].start_location.lng();
          this.destinationMarker.lat = response.routes[0].legs[
            response.routes[0].legs.length - 1
          ].end_location.lat();
          this.destinationMarker.lng = response.routes[0].legs[
            response.routes[0].legs.length - 1
          ].end_location.lng();

          this.mapCenter.latitude = this.originMarker.lat;
          this.mapCenter.longitude = this.originMarker.lng;
          if (response.routes[0].legs.length > 1) {
            if (index === 0) {
              this.legMilage.push({
                distance: null,
                distanceValue: null,
                startAddress:
                  origins.address.city +
                  ', ' +
                  origins.address.stateShortName +
                  ' ' +
                  origins.address.zipCode,
                endAddress: null,
                lat: element.start_location.lat(),
                lng: element.start_location.lng(),
                shipper_id: origins.id,
                type: 'pickup',
              });
              this.legMilage.push({
                distance: element.distance.text.replace('mi', '').trim(),
                distanceValue: element.distance.value,
                startAddress: null,
                lat: element.end_location.lat(),
                lng: element.end_location.lng(),
                endAddress:
                  this.waypointsWithAddress[0]?.pointCity +
                  ', ' +
                  this.waypointsWithAddress[0]?.pointState +
                  ' ' +
                  this.waypointsWithAddress[0]?.pointZip,
                totalDistanceValue: null,
                shipper_id: this.waypointsWithAddress[0]?.shipperId,
                type: this.waypointsWithAddress[0]?.pointType,
              });
            } else if (index !== response.routes[0].legs.length - 1) {
              this.legMilage.push({
                distance: element.distance.text.replace('mi', '').trim(),
                distanceValue: element.distance.value,
                totalDistanceValue: null,
                startAddress: null,
                lat: element.end_location.lat(),
                lng: element.end_location.lng(),
                endAddress:
                  this.waypointsWithAddress[index]?.pointCity +
                  ', ' +
                  this.waypointsWithAddress[index]?.pointState +
                  ' ' +
                  this.waypointsWithAddress[index]?.pointZip,
                shipper_id,
                type: item_type,
              });
            } else {
              this.legMilage.push({
                distance: element.distance.text.replace('mi', '').trim(),
                distanceValue: element.distance.value,
                totalDistanceValue: null,
                startAddress: null,
                lat: element.end_location.lat(),
                lng: element.end_location.lng(),
                endAddress:
                  destinations.address.city +
                  ', ' +
                  destinations.address.stateShortName +
                  ' ' +
                  destinations.address.zipCode,
                shipper_id: destinations.id,
                type: 'delivery',
              });
            }
            if (index !== response.routes[0].legs.length - 1) {
              const destType = this.waypointsWithAddress[index]?.pointType;
              const ship_id = this.waypointsWithAddress[index]?.shipperId;
              if (destType) { this.markerTypes[destType].push(1); }
              this.waypointMarkers.push({
                lat: element.end_location.lat(),
                lng: element.end_location.lng(),
                type: destType,
                shipper_id: ship_id,
                index:
                  destType == 'pickup'
                    ? this.markerTypes[destType].length + 1
                    : this.markerTypes[destType].length,
              });
              this.mainMarkers.push({
                lat: element.end_location.lat(),
                lng: element.end_location.lng(),
              });
            }
          } else {
            this.legMilage.push({
              distance: null,
              distanceValue: null,
              lat: element.start_location.lat(),
              lng: element.start_location.lng(),
              startAddress:
                origins.address.city +
                ', ' +
                origins.address.stateShortName +
                ' ' +
                origins.address.zipCode,
              endAddress: null,
              shipper_id: origins.id,
              type: 'pickup',
            });
            this.legMilage.push({
              distance: element.distance.text.replace('mi', '').trim(),
              distanceValue: element.distance.value,
              startAddress: null,
              endAddress:
                destinations.address.city +
                ', ' +
                destinations.address.stateShortName +
                ' ' +
                destinations.address.zipCode,
              lat: element.end_location.lat(),
              lng: element.end_location.lng(),
              totalDistanceValue: null,
              shipper_id: destinations.id,
              type: 'delivery',
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
        const position = new google.maps.LatLng(this.mapCenter.latitude, this.mapCenter.longitude);
        this.distance = (totalDistance * 0.00062137).toFixed(0).toString();
        setTimeout(() => {
          this.punToMapPosition(this.mainMarkers);
        }, 2000);
        this.loadForm.get('mileage').setValue(this.distance);
      }
    });
  }

  public mapClicked(e) {
    this.selectedShipperId = -1;
    this.activatedLoadMap = -1;
  }

  startingPointChange(event) {
    if (
      event !== undefined &&
      event.shipperAddress !== null &&
      event.shipperAddress.address !== null
    ) {
      (this.loadForm.get('route') as FormArray).at(0).patchValue({
        shipperId: event.id,
        shipperName: event.shipperName,
        pointType: 'pickup',
        pointOrder: 1,
        pointZip: event.shipperAddress.zipCode,
        pointCity: event.shipperAddress.city,
        pointAddress: event.shipperAddress.address,
        pointState: event.shipperAddress.stateShortName,
        pointCountry: event.shipperAddress.country,
      });
      this.origin = { address: event.shipperAddress, id: event.id };

      if (this.destination) {
        this.getDistance(this.origin, this.destination, this.waypointRender());
      }
      this.startingPointDeadHeadingDistance();
    } else {
      this.loadForm.controls.pickupId.reset();
      (this.loadForm.get('route') as FormArray).at(0).patchValue({
        shipperId: null,
        shipperName: null,
        pointType: 'pickup',
        pointOrder: 1,
        distanceMiles: 0,
        pointZip: null,
        pointCity: null,
        pointAddress: null,
        pointState: null,
        pointCountry: null,
      });
      this.origin = null;
      this.onAddShipper();
      this.waypointMarkers = [];
    }
  }

  endingPointChange(event) {
    if (
      event !== undefined &&
      event.shipperAddress !== null &&
      event.shipperAddress.address !== null
    ) {
      (this.loadForm.get('route') as FormArray).at(1).patchValue({
        shipperId: event.id,
        shipperName: event.shipperName,
        pointType: 'delivery',
        pointOrder: 1,
        pointZip: event.shipperAddress.zipCode,
        pointCity: event.shipperAddress.city,
        pointAddress: event.shipperAddress.address,
        pointState: event.shipperAddress.stateShortName,
        pointCountry: event.shipperAddress.country,
      });

      this.destination = { address: event.shipperAddress, id: event.id };
      if (this.origin) {
        this.getDistance(this.origin, this.destination, this.waypointRender());
      }
    } else {
      this.loadForm.controls.deliveryId.reset();
      (this.loadForm.get('route') as FormArray).at(1).patchValue({
        shipperId: null,
        shipperName: null,
        pointType: 'delivery',
        pointOrder: 1,
        distanceMiles: 0,
        pointZip: null,
        pointCity: null,
        pointAddress: null,
        pointState: null,
        pointCountry: null,
      });
      this.destination = null;
      this.onAddShipper();
      this.waypointMarkers = [];
    }
  }
  waypointRender() {
    const waypointArr = [];
    this.waypointsWithAddress = [];
    if ((this.loadForm.get('doc') as FormGroup).get('waypoints')) {
      const tempArr = ((this.loadForm.get('doc') as FormGroup).get('waypoints') as FormArray).value;
      tempArr.forEach((element) => {
        if (element.pointAddress !== null) {
          this.waypointsWithAddress.push(element);
          waypointArr.push({
            location: element.pointAddress,
          });
        }
      });
    }

    this.waypoints = waypointArr;
    return waypointArr;
  }

  waypointsChange(i, event, type?) {
    if (event.shipperAddress !== null) {
      ((this.loadForm.get('doc') as FormGroup).get('waypoints') as FormArray).at(i).patchValue({
        shipperId: event.id,
        shipperName: event.shipperName,
        pointType: type,
        pointZip: event.shipperAddress.zipCode,
        pointCity: event.shipperAddress.city,
        pointAddress: event.shipperAddress.address,
        pointState: event.shipperAddress.stateShortName,
        pointCountry: event.shipperAddress.country,
      });
      this.getDistance(this.origin, this.destination, this.waypointRender());
    } else {
      ((this.loadForm.get('doc') as FormGroup).get('waypoints') as FormArray).at(i).patchValue({
        shipperId: null,
        shipperName: null,
        pointZip: null,
        distanceMiles: null,
        pointCity: null,
        pointAddress: null,
        pointState: null,
        pointCountry: null,
      });
      this.onAddShipper();
    }
  }

  createWaypoint(types?) {
    return this.formBuilder.group({
      shipperId: [null, Validators.required],
      pointDatetime: [null, Validators.required],
      shipperName: '',
      pointType: types,
      pointOrder: null,
      distanceMiles: null,
      pointZip: null,
      pointCity: null,
      pointAddress: null,
      pointState: null,
      pointCountry: null,
    });
  }

  addNewWaypoint(type) {
    ((this.loadForm.get('doc') as FormGroup).get('waypoints') as FormArray).push(
      this.createWaypoint(type)
    );
    this.shippersListItems.push([]);
  }

  destinationDateTimeChange(e) {
    (this.loadForm.get('route') as FormArray).controls[1].get('pointDatetime').setValue(e);
    return;
    if (this.loadForm.get('pickupDateTime').value !== null) {
      if (this.waypointList.controls.length > 0) {
        this.waypointList.controls.forEach((element) => {
          element.get('dateTime').enable();
        });
      }
    }
  }

  pickupDateTimeChange(e) {
    (this.loadForm.get('route') as FormArray).controls[0].get('pointDatetime').setValue(e);
    return;
    if (this.loadForm.get('deliveryDateTime').value !== null) {
      if (this.waypointList.controls.length > 0) {
        this.waypointList.controls.forEach((element) => {
          element.get('dateTime').enable();
        });
      }
    }
  }

  dispatcherSelected(event) {
    this.loadForm.get('dispatcherId').setValue(event.id);
    // this.loadForm.get('dispatchBoardId').setValue([null]);
    if (this.inputData.data.type === 'new') {
      this.loadForm.get('statusId').setValue(1);
    }
    /*this.loadTrucks = [];
    this.loadService.getLoadTrucks(event.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe((result: any) => {
      if (result[0].id !== null) {
        this.loadTrucks = result;
      } else {
        this.loadTrucks = [];
      }
    });*/
  }

  customSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item.shipperName.toLocaleLowerCase().indexOf(term) > -1 ||
      item.shipperAddress?.city.toLocaleLowerCase().indexOf(term) > -1 ||
      item.id === 0
    );
  }

  customBrokerSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.brokerName.toLocaleLowerCase().indexOf(term) > -1 || item.id === 0;
  }

  dateValueChange(event, item) {
    const tempArr = (this.loadForm.get('doc') as FormGroup).get('waypoints') as FormArray;
    setTimeout(() => {
      // tempArr.value.sort((a, b) => {
      //   if (
      //     (a.pointDatetime !== null && new Date(a.pointDatetime).getTime()) >
      //     (b.pointDatetime !== null && new Date(b.pointDatetime).getTime())
      //   ) {
      //     return 1;
      //   }
      // });
      this.setWaypointChanges(tempArr, true);
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    const tempArr = (this.loadForm.get('doc') as FormGroup).get('waypoints') as FormArray;
    if (event.currentIndex !== event.previousIndex) {
      this.waypointFormGroup.at(event.previousIndex).patchValue({
        pointDatetime: null,
      });
    }
    moveItemInArray(tempArr.value, event.previousIndex, event.currentIndex);
    this.setWaypointChanges(tempArr);
    this.zone.run(() => {
      this.shippersListItems.forEach((element, indx) => {
        this.shippersListItems[indx] = undefined;
        this.shippersListItems[indx] = [];
      });
    });
  }

  setWaypointChanges(tempArr: any, getDist?: boolean) {
    ((this.loadForm.get('doc') as FormGroup).get('waypoints') as FormArray).setValue(tempArr.value);
    !getDist && this.getDistance(this.origin, this.destination, this.waypointRender());
  }
  onPaste(event: any, inputID: string) {
    event.preventDefault();
    (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
      event.clipboardData.getData('Text'),
      this.fomratType,
      true
    );
    this.loadForm.controls[inputID].patchValue(
      (document.getElementById(inputID) as HTMLInputElement).value
    );
  }
  onLoadNumberTyping(event) {
    let k;
    k = event.charCode;
    console.log(k);
    if (k == 32) {
      this.numOfSpaces++;
    } else {
      this.numOfSpaces = 0;
    }
    if (this.numOfSpaces < 2) {
      return (k > 64 && k < 91) || (k > 96 && k < 121) || (k >= 45 && k <= 57) || k == 8 || k == 32;
    } else {
      event.preventDefault();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  calcMarkerOpacity(i) {
    let opacity = 1 - i * 0.04;
    if (opacity < 0) {
      opacity = opacity + i * 0.04;
    }
    return opacity;
  }

  mouseOverShowShipper(indx) {
    this.selectedShipperId = indx;
  }
  public handleMapSelection(mod: any, indx: number, type: string) {
    if (this.activatedLoadMap !== indx) {
      this.activatedLoadMapSnazzy = false;
      this.activatedLoadMap = indx;
      const position = new google.maps.LatLng(mod.lat, mod.lng);
      this.punToMapPosition([{ lat: mod.lat, lng: mod.lng }], position);
    } else {
      if (!this.activatedLoadMapSnazzy) {
        if (!this.waypointMarkers[indx].markerInfo) {
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

  public markerClicked(mod: any, ind: number) {
    if (this.activatedLoadMap != ind || !this.activatedLoadMapSnazzy) {
      if (!this.waypointMarkers[ind].markerInfo) {
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
    this.appShared.getShipperInfo(shipper_id)
    .pipe(takeUntil(this.destroy$))
    .subscribe((res: any) => {
      this.waypointMarkers[ind].markerInfo = {
        name: res.name,
      };
      this.waypointMarkers[ind].markerInfo.address = this.getMarkerFullAddress(
        res.doc.address
      );
      this.waypointMarkers[ind].markerInfo.phone =
        res.doc.phone || res.doc.phone != '' ? formatPhoneNumber(res.doc.phone) : null;
      this.activatedLoadMap = ind;
      this.activatedLoadMapSnazzy = true;
    });
  }
  cdkDragStartedShipper(event, rowIndex) {
    this.startIndexShipperDrag = rowIndex;
  }

  // USE ARROW FUNCTION NOTATION TO ACCESS COMPONENT "THIS"
  containerPredictPosition = (index: number, item: CdkDrag<number>) => {
    return this.canShipperBeReordered(index + 1, this.startIndexShipperDrag + 1);
  }

  removeWaypoint(i) {
    if (this.canShipperBeReordered(i + 1, i + 1, true)) {
      ((this.loadForm.get('doc') as FormGroup).get('waypoints') as FormArray).removeAt(i);
      const tempArr = (this.loadForm.get('doc') as FormGroup).get('waypoints') as FormArray;
      this.setWaypointChanges(tempArr);
      this.shippersListItems.splice(i, 1);
    } else {
      this.toastr.error('Unable to remove Shipper from this position');
    }
  }

  public canShipperBeReordered(finalIndex: number, startIndex: number, replace?: boolean) {
    const pickupId = this.loadForm.get('pickupId').value;
    const deliveryId = this.loadForm.get('deliveryId').value;
    const waypoint_array = [pickupId];
    this.waypointFormGroup.value.forEach((element) => {
      waypoint_array.push(element.shipperId);
    });
    waypoint_array.push(deliveryId);
    const tempValue = waypoint_array.splice(startIndex, 1);
    if (!replace) {
      waypoint_array.splice(finalIndex, 0, tempValue[0]);
    }
    let noDuplicate = true;

    waypoint_array.forEach((element, index) => {
      if (element) {
        if (waypoint_array[index - 1] == element) {
          noDuplicate = false;
        }
      }
    });
    return noDuplicate;
  }

  public getMarkerFullAddress(address: any): string {
    if (
      (address.streetName && address.streetName != '') ||
      (address.streetNumber && address.streetNumber != '')
    ) {
      return `${address.streetNumber} ${address.streetName} <br/> ${address.city}, ${address.stateShortName} ${address.zipCode}`;
    } else {
      // TO DO - THIS PART IS NOT NECESSARY AFTER CREATING NEW SHIPPERS
      return address.address.replace(', USA', '');
    }
  }

  public punToMapPosition(markers, position?) {
    const bounds = new google.maps.LatLngBounds();
    markers.map((item) => bounds.extend(new google.maps.LatLng(item.lat, item.lng)));
    this.agmMap.fitBounds(bounds);
    if (position) {
      setTimeout(() => {
        this.agmMap.panTo(position);
        this.agmMap.setZoom(13);
      }, 500);
    }
  }

  snazzyInfoWindowIsToggled(event) {
    clearTimeout(this.agmWindowTimeout);
    if (!event) {
      this.agmWindowTimeout = setTimeout(() => {
        // this.activatedLoadMap = -1;
        // this.activatedLoadMapSnazzy = false;
      }, 300);
    }
  }

  getMinWaypointTime(ind) {
    let new_index = ind - 1;
    if (new_index < 0) { return this.loadForm.get('pickupDateTime').value; }
    let previous_index;
    while (!previous_index && new_index > -1) {
      previous_index = this.waypointFormGroup.at(new_index).get('pointDatetime').value;
      new_index--;
    }
    return previous_index ? previous_index : this.loadForm.get('pickupDateTime').value;
  }

  getMaxWaypointTime(ind) {
    let new_index = ind + 1;
    if (new_index == this.waypointFormGroup.controls.length) {
      return this.loadForm.get('deliveryDateTime').value;
    }
    let previous_index;
    while (!previous_index && new_index < this.waypointFormGroup.controls.length) {
      previous_index = this.waypointFormGroup.at(new_index).get('pointDatetime').value;
      new_index++;
    }
    return previous_index ? previous_index : this.loadForm.get('deliveryDateTime').value;
  }

  closeCommentSection() {
    this.comments_expanded = false;
    this.commentSection.removeNewMessageAdding();
  }

  // FOR CUSTOM LOAD SEARCH
  customSearchDispatchersFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    const full_name = item.dispatcherFirstName + ' ' + item.dispatcherLastName;
    return full_name.toLocaleLowerCase().indexOf(term) > -1 || item.id === 0;
  }

  public changeDispatcherSelect(elem) {
    elem.blur();
  }

  customTruckSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item.trailerNumber?.toLocaleLowerCase().includes(term) ||
      item.truckNumber?.toLocaleLowerCase().includes(term) ||
      item.driverName?.toLocaleLowerCase().includes(term)
    );
  }

  onSearch(event: any, type: string) {
    switch (type) {
      case 'dispatcher':
        this.searchItems.startingPoint = event.items.length;
        break;
      case 'broker':
        this.searchItems.broker = event.items.length;
        break;
      case 'starting-point':
        this.searchItems.startingPoint = event.items.length;
        break;
      case 'shipper':
        this.searchItems.shipper = event.items.length;
        break;
      case 'ending-point':
        this.searchItems.endingPoint = event.items.length;
        break;
      default:
        return;
    }
  }

  onClose(event: any, type: string) {
    switch (type) {
      case 'dispatcher':
        this.searchItems.startingPoint = 0;
        break;
      case 'broker':
        this.searchItems.broker = 0;
        break;
      case 'starting-point':
        this.searchItems.startingPoint = 0;
        break;
      case 'shipper':
        this.searchItems.shipper = 0;
        break;
      case 'ending-point':
        this.searchItems.endingPoint = 0;
        break;
      default:
        return;
    }
  }
}
