import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DeletedItem } from 'src/app/core/model/shared/enums';
import { UserState } from 'src/app/core/model/user';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { SafetyService } from 'src/app/core/services/safety.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import {
  TableColumnDefinition,
  TableData,
  TableOptions,
  TableSubject,
} from 'src/app/shared/truckassist-table/models/truckassist-table';
import {
  getExtendedViolationsColums,
  getExtendedViolationsSummaryColums,
  getViolationsColums,
  getViolationsSummaryColums,
} from 'src/assets/utils/settings/safety-columns';
import { ViolationManageComponent } from '../violation-manage/violation-manage.component';

@Component({
  selector: 'app-safety-violation',
  templateUrl: './safety-violation.component.html',
  styleUrls: ['./safety-violation.component.scss'],
})
export class SafetyViolationComponent implements OnInit, OnDestroy {
  @Input() inputData: any;
  public tableOptions: TableOptions;
  private tableSubject: BehaviorSubject<TableSubject> = new BehaviorSubject(null);
  public safetyColumns: TableColumnDefinition[] = [];
  public extendedColumns: TableColumnDefinition[] = [];
  public loadingItems = true;
  public selectedTab = 'active';
  private destroy$: Subject<void> = new Subject<void>();

  public violationData = [];
  public violationSummaryData = [];
  public violationDataActive = [];
  public violationDataInactive = [];
  violationYears: number[] = [];
  constructor(
    private changeRef: ChangeDetectorRef,
    private customModalService: CustomModalService,
    private safetyService: SafetyService,
    private notification: NotificationService,
    private shared: SharedService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    /* For new vioaltion subscriptions */
    this.safetyService.createNewViolation.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.getViolationsData();
    });

    /* For delete subscriptions */
    this.shared.emitDeleteAction.pipe(takeUntil(this.destroy$)).subscribe((resp: any) => {
      if (resp.data.id) {
        this.onDeleteViolation(resp.data.id);
        setTimeout(() => {
          this.toastr.success('Successfully deleted violation.');
          this.getViolationsData();
        }, 200);
      }
    });

    /* For update subscriptions */
    this.safetyService.updatedViolationSubject.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.getViolationsData();
    });
    this.initTableOptions();
    this.getViolationsData();
  }

  private initTableOptions(): void {
    this.tableOptions = {
      disabledMutedStyle: true,
      data: this.tableSubject,
      toolbarActions: {
        hideImport: false,
        hideExport: false,
        hideLockUnlock: false,
        hideAddNew: false,
        hideColumns: false,
        hideCompress: false,
        hideEmail: true,
        hideShopType: false,
        hideLabel: true,
        hideSelectNumber: true,
        hideSwitch: true,
        showDateFilter: true,
        showViolationFilterButtonGroup: true,
      },
      config: {
        showSort: true,
        sortBy: '',
        sortDirection: '',
        disabledColumns: [0],
        minWidth: 60,
        dateFilterField: 'eventDate',
      },
      mainActions: [
        {
          title: 'Edit',
          name: 'edit-violation',
        },
      ],
      deleteAction: {
        title: 'Delete',
        name: 'delete',
        type: 'violations',
        text: 'Are you sure you want to delete violation?',
      },
      type: 'violations',
    };
    this.changeRef.detectChanges();
  }

  getViolationsData() {
    const test$ = this.safetyService.getViolationsList();
    forkJoin([test$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([violations]: [any]) => {
        const test = violations.data.map((violation) => {
          return violation;
        });
        console.log(test);
      });
    const violations$ = [
      {
        latitude: '41.7147018',
        longitude: '-87.8063395',
        markerNumber: 1,
        address: 'East Greenwich Township, NJ, USA',
        avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4',
        policeDepartment: 'Illinoins Department of Transportation',
        files: null,
        customer: 'IVS Freight Inc',
        companyId: null,
        oosStatus: true,
        violationsStatus: true,
        createdAt: null,
        doc: null,
        driverFullName: 'Glen Cotton',
        driverId: 167,
        eventDate: '01/12/21',
        guid: '962e8b7f-87c0-49f6-8783-421f4d5a4511',
        hm: '06:15 AM',
        id: 51,
        lvl: 'III',
        lvlTitle: 'Walk Around',
        total: '$2,904',
        violationsData: [
          {
            title: 'Unsafe Driving',
            iconUrl: 'assets/img/svgs/table/violation-vl1.svg',
            sumWeight: '30',
            timeWeight: '3',
            weight: '10',
            violationDetails: [
              {
                title: '324.23SSW2',
                oos: 'D',
                oosStatus: true,
                weight: '2',
                desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              },
              {
                title: '8932.2GSS6',
                oos: 'D',
                oosStatus: false,
                weight: '6',
                desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              },
            ],
          },
        ],
        vl1: '60',
        vl2: '3',
        vl3: '0',
        vl4: '0',
        vl5: '48',
        vl6: '0',
        vl7: '0',
        oos: [
          {
            active: true,
            value: 'D',
            title: 'Driver',
          },
          {
            active: false,
            value: '1',
            title: 'Truck',
          },
          {
            active: true,
            value: '2',
            title: 'Trailer',
          },
        ],
        citation: '2',
        citationData: [
          {
            title: 'T879327-2',
            value: '$2,452',
            desc: 'Operated Non-PA Vehicle with class 3B without registration',
          },
        ],
        note: 'nema claima, nije bio na osiguranju',
        report: 'MS1017010339',
        trailerId: 12,
        trailerNumber: '#322R',
        truckId: 13,
        truckNumber: '#43252',
        state: 'South Carolina',
        updatedAt: null,
        active: true,
        attachments: [
          {
            fileItemGuid: '1df783f0-c014-4410-aef1-a0ed34df8487',
            fileName: '6557 insp 12.22.20.pdf',
            url:
              'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/1df783f0c0144410aef1a0ed34df84871623772206-6557 insp 12.22.20.pdf',
          },
          {
            fileItemGuid: 'e3285ac1-5f99-41ca-936d-eca874497ef2',
            fileName: '6557 insp 12.22.20.pdf',
            url:
              'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/e3285ac15f9941ca936deca874497ef21625495471-6557 insp 12.22.20.pdf',
          },
          {
            fileItemGuid: '8b4cc20f-8474-44dc-9d31-08753330c4ce',
            fileName: 'test1.jpg',
            url:
              'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/8b4cc20f847444dc9d3108753330c4ce1625495472-test1.jpg',
          },
        ],
      },
      {
        latitude: '41.6388436',
        longitude: '-87.6800432',
        markerNumber: 2,
        address: 'East Greenwich Township, NJ, USA',
        avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4',
        policeDepartment: 'Illinoins Department of Transportation',
        files: null,
        customer: 'IVS Freight Inc',
        companyId: null,
        oosStatus: true,
        violationsStatus: false,
        createdAt: null,
        doc: null,
        driverFullName: 'Angelo Trotter',
        driverId: 166,
        eventDate: '11/11/20',
        guid: '962e8b7f-87c0-49f6-8783-421f4d5a4511',
        hm: '11:30 AM',
        id: 52,
        lvl: 'II',
        lvlTitle: 'Walk Around',
        total: '$2,904',
        violationsData: [
          {
            title: 'Unsafe Driving',
            iconUrl: 'assets/img/svgs/table/violation-vl1.svg',
            sumWeight: '30',
            timeWeight: '3',
            weight: '10',
            violationDetails: [
              {
                title: '324.23SSW2',
                oos: 'D',
                oosStatus: true,
                weight: '2',
                desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              },
              {
                title: '8932.2GSS6',
                oos: 'D',
                oosStatus: false,
                weight: '6',
                desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              },
            ],
          },
        ],
        vl1: '0',
        vl2: '0',
        vl3: '0',
        vl4: '0',
        vl5: '0',
        vl6: '0',
        vl7: '0',
        oos: [
          {
            active: false,
            value: 'D',
            title: 'Driver',
          },
          {
            active: true,
            value: '1',
            title: 'Truck',
          },
          {
            active: false,
            value: '2',
            title: 'Trailer',
          },
        ],
        citation: '0',
        citationData: [
          {
            title: 'T879327-2',
            value: '$2,452',
            desc: 'Operated Non-PA Vehicle with class 3B without registration',
          },
        ],
        note: 'nema claima, note',
        report: 'MS90234231333',
        trailerId: 13,
        trailerNumber: '#322A',
        truckId: 23,
        truckNumber: '#5234R',
        state: 'Texas',
        updatedAt: null,
        active: true,
        attachments: [
          {
            fileItemGuid: '1df783f0-c014-4410-aef1-a0ed34df8487',
            fileName: '6557 insp 12.22.20.pdf',
            url:
              'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/1df783f0c0144410aef1a0ed34df84871623772206-6557 insp 12.22.20.pdf',
          },
          {
            fileItemGuid: 'e3285ac1-5f99-41ca-936d-eca874497ef2',
            fileName: '6557 insp 12.22.20.pdf',
            url:
              'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/e3285ac15f9941ca936deca874497ef21625495471-6557 insp 12.22.20.pdf',
          },
          {
            fileItemGuid: '8b4cc20f-8474-44dc-9d31-08753330c4ce',
            fileName: 'test1.jpg',
            url:
              'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/8b4cc20f847444dc9d3108753330c4ce1625495472-test1.jpg',
          },
        ],
      },
      {
        latitude: '39.5545498',
        longitude: '-77.9884643',
        markerNumber: 3,
        address: 'East Greenwich Township, NJ, USA',
        avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4',
        policeDepartment: 'Illinoins Department of Transportation',
        files: null,
        customer: 'IVS Freight Inc',
        companyId: null,
        oosStatus: true,
        violationsStatus: false,
        createdAt: null,
        doc: null,
        driverFullName: 'Sven Matter',
        driverId: 234,
        eventDate: '04/30/07',
        guid: '962e8b7f-87c0-49f6-8783-421f4d5a4511',
        hm: '16:45 AM',
        id: 53,
        lvl: 'I',
        lvlTitle: 'Walk Around',
        total: '$2,904',
        violationsData: [
          {
            title: 'Unsafe Driving',
            iconUrl: 'assets/img/svgs/table/violation-vl1.svg',
            sumWeight: '30',
            timeWeight: '3',
            weight: '10',
            violationDetails: [
              {
                title: '324.23SSW2',
                oos: 'D',
                oosStatus: true,
                weight: '2',
                desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              },
              {
                title: '8932.2GSS6',
                oos: 'D',
                oosStatus: false,
                weight: '6',
                desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              },
            ],
          },
        ],
        vl1: '0',
        vl2: '0',
        vl3: '0',
        vl4: '0',
        vl5: '0',
        vl6: '0',
        vl7: '0',
        oos: [
          {
            active: false,
            value: 'D',
            title: 'Driver',
          },
          {
            active: false,
            value: '1',
            title: 'Truck',
          },
          {
            active: true,
            value: '2',
            title: 'Trailer',
          },
        ],
        citation: '0',
        citationData: [
          {
            title: 'T879327-2',
            value: '$2,452',
            desc: 'Operated Non-PA Vehicle with class 3B without registration',
          },
        ],
        note: 'nema claima, nije bio na osiguranju',
        report: 'MS10170108322',
        trailerId: 12,
        trailerNumber: '#225R',
        truckId: 13,
        truckNumber: '#53252',
        state: 'Kansas',
        updatedAt: null,
        active: true,
        attachments: [
          {
            fileItemGuid: '1df783f0-c014-4410-aef1-a0ed34df8487',
            fileName: '6557 insp 12.22.20.pdf',
            url:
              'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/1df783f0c0144410aef1a0ed34df84871623772206-6557 insp 12.22.20.pdf',
          },
          {
            fileItemGuid: 'e3285ac1-5f99-41ca-936d-eca874497ef2',
            fileName: '6557 insp 12.22.20.pdf',
            url:
              'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/e3285ac15f9941ca936deca874497ef21625495471-6557 insp 12.22.20.pdf',
          },
          {
            fileItemGuid: '8b4cc20f-8474-44dc-9d31-08753330c4ce',
            fileName: 'test1.jpg',
            url:
              'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/8b4cc20f847444dc9d3108753330c4ce1625495472-test1.jpg',
          },
        ],
      },
      {
        latitude: '41.24763090',
        longitude: '-82.69837460',
        markerNumber: 4,
        address: 'East Greenwich Township, NJ, USA',
        avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4',
        policeDepartment: 'Illinoins Department of Transportation',
        files: null,
        customer: 'IVS Freight Inc',
        companyId: null,
        oosStatus: true,
        violationsStatus: true,
        createdAt: null,
        doc: null,
        driverFullName: 'Mike Elangelo',
        driverId: 166,
        eventDate: '12/01/18',
        guid: '962e8b7f-87c0-49f6-8783-421f4d5a4511',
        hm: '14:30 AM',
        id: 54,
        lvl: 'II',
        lvlTitle: 'Walk Around',
        total: '$2,904',
        violationsData: [
          {
            title: 'Unsafe Driving',
            iconUrl: 'assets/img/svgs/table/violation-vl1.svg',
            sumWeight: '30',
            timeWeight: '3',
            weight: '10',
            violationDetails: [
              {
                title: '324.23SSW2',
                oos: 'D',
                oosStatus: true,
                weight: '2',
                desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              },
              {
                title: '8932.2GSS6',
                oos: 'D',
                oosStatus: false,
                weight: '6',
                desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              },
            ],
          },
        ],
        vl1: '0',
        vl2: '0',
        vl3: '5',
        vl4: '34',
        vl5: '20',
        vl6: '2',
        vl7: '1',
        oos: [
          {
            active: false,
            value: 'D',
            title: 'Driver',
          },
          {
            active: true,
            value: '1',
            title: 'Truck',
          },
          {
            active: true,
            value: '2',
            title: 'Trailer',
          },
        ],
        citation: '3',
        citationData: [
          {
            title: 'T879327-2',
            value: '$2,452',
            desc: 'Operated Non-PA Vehicle with class 3B without registration',
          },
        ],
        note: 'nema claima, note',
        report: 'MS902342319832',
        trailerId: 13,
        trailerNumber: '#322A',
        truckId: 23,
        truckNumber: '#5234R',
        state: 'Florida',
        updatedAt: null,
        active: true,
        attachments: [
          {
            fileItemGuid: '1df783f0-c014-4410-aef1-a0ed34df8487',
            fileName: '6557 insp 12.22.20.pdf',
            url:
              'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/1df783f0c0144410aef1a0ed34df84871623772206-6557 insp 12.22.20.pdf',
          },
          {
            fileItemGuid: 'e3285ac1-5f99-41ca-936d-eca874497ef2',
            fileName: '6557 insp 12.22.20.pdf',
            url:
              'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/e3285ac15f9941ca936deca874497ef21625495471-6557 insp 12.22.20.pdf',
          },
          {
            fileItemGuid: '8b4cc20f-8474-44dc-9d31-08753330c4ce',
            fileName: 'test1.jpg',
            url:
              'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/8b4cc20f847444dc9d3108753330c4ce1625495472-test1.jpg',
          },
        ],
      },
      {
        latitude: '34.07240380',
        longitude: '-83.81985150',
        markerNumber: 5,
        address: 'East Greenwich Township, NJ, USA',
        avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4',
        policeDepartment: 'Illinoins Department of Transportation',
        files: null,
        customer: 'IVS Freight Inc',
        companyId: null,
        oosStatus: true,
        violationsStatus: true,
        createdAt: null,
        doc: null,
        driverFullName: 'Kevin Mayer',
        driverId: 167,
        eventDate: '01/12/21',
        guid: '962e8b7f-87c0-49f6-8783-421f4d5a4511',
        hm: '06:15 AM',
        id: 55,
        lvl: 'I',
        lvlTitle: 'Walk Around',
        total: '$2,904',
        violationsData: [
          {
            title: 'Unsafe Driving',
            iconUrl: 'assets/img/svgs/table/violation-vl1.svg',
            sumWeight: '30',
            timeWeight: '3',
            weight: '10',
            violationDetails: [
              {
                title: '324.23SSW2',
                oos: 'D',
                oosStatus: true,
                weight: '2',
                desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              },
              {
                title: '8932.2GSS6',
                oos: 'D',
                oosStatus: false,
                weight: '6',
                desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              },
            ],
          },
        ],
        vl1: '3',
        vl2: '0',
        vl3: '0',
        vl4: '0',
        vl5: '10',
        vl6: '0',
        vl7: '0',
        oos: [
          {
            active: true,
            value: 'D',
            title: 'Driver',
          },
          {
            active: true,
            value: '1',
            title: 'Truck',
          },
          {
            active: true,
            value: '2',
            title: 'Trailer',
          },
        ],
        citation: '3',
        citationData: [
          {
            title: 'T879327-2',
            value: '$2,452',
            desc: 'Operated Non-PA Vehicle with class 3B without registration',
          },
        ],
        note: 'nema claima, nije bio na osiguranju',
        report: 'MS1017010339',
        trailerId: 12,
        trailerNumber: '#322R',
        truckId: 13,
        truckNumber: '#43252',
        state: 'Oregon',
        updatedAt: null,
        active: false,
        attachments: [
          {
            fileItemGuid: '1df783f0-c014-4410-aef1-a0ed34df8487',
            fileName: '6557 insp 12.22.20.pdf',
            url:
              'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/1df783f0c0144410aef1a0ed34df84871623772206-6557 insp 12.22.20.pdf',
          },
          {
            fileItemGuid: 'e3285ac1-5f99-41ca-936d-eca874497ef2',
            fileName: '6557 insp 12.22.20.pdf',
            url:
              'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/e3285ac15f9941ca936deca874497ef21625495471-6557 insp 12.22.20.pdf',
          },
          {
            fileItemGuid: '8b4cc20f-8474-44dc-9d31-08753330c4ce',
            fileName: 'test1.jpg',
            url:
              'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/8b4cc20f847444dc9d3108753330c4ce1625495472-test1.jpg',
          },
        ],
      },
      {
        latitude: '33.4567675',
        longitude: '-80.7337196',
        markerNumber: 6,
        address: 'East Greenwich Township, NJ, USA',
        avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4',
        policeDepartment: 'Illinoins Department of Transportation',
        files: null,
        customer: 'IVS Freight Inc',
        companyId: null,
        oosStatus: false,
        violationsStatus: true,
        createdAt: null,
        doc: null,
        driverFullName: 'Angelo Trotter',
        driverId: 166,
        eventDate: '11/11/20',
        guid: '962e8b7f-87c0-49f6-8783-421f4d5a4511',
        hm: '11:30 AM',
        id: 56,
        lvl: 'II',
        lvlTitle: 'Walk Around',
        total: '$2,904',
        violationsData: [
          {
            title: 'Unsafe Driving',
            iconUrl: 'assets/img/svgs/table/violation-vl1.svg',
            sumWeight: '30',
            timeWeight: '3',
            weight: '10',
            violationDetails: [
              {
                title: '324.23SSW2',
                oos: 'D',
                oosStatus: true,
                weight: '2',
                desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              },
              {
                title: '8932.2GSS6',
                oos: 'D',
                oosStatus: false,
                weight: '6',
                desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              },
            ],
          },
        ],
        vl1: '56',
        vl2: '18',
        vl3: '0',
        vl4: '10',
        vl5: '0',
        vl6: '2',
        vl7: '0',
        oos: [
          {
            active: false,
            value: 'D',
            title: 'Driver',
          },
          {
            active: false,
            value: '1',
            title: 'Truck',
          },
          {
            active: false,
            value: '2',
            title: 'Trailer',
          },
        ],
        citation: '2',
        citationData: [
          {
            title: 'T879327-2',
            value: '$2,452',
            desc: 'Operated Non-PA Vehicle with class 3B without registration',
          },
        ],
        note: 'nema claima, note',
        report: 'MS90234231333',
        trailerId: 13,
        trailerNumber: '#322A',
        truckId: 23,
        truckNumber: '#5234R',
        state: 'Utah',
        updatedAt: null,
        active: true,
        attachments: [
          {
            fileItemGuid: '1df783f0-c014-4410-aef1-a0ed34df8487',
            fileName: '6557 insp 12.22.20.pdf',
            url:
              'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/1df783f0c0144410aef1a0ed34df84871623772206-6557 insp 12.22.20.pdf',
          },
          {
            fileItemGuid: 'e3285ac1-5f99-41ca-936d-eca874497ef2',
            fileName: '6557 insp 12.22.20.pdf',
            url:
              'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/e3285ac15f9941ca936deca874497ef21625495471-6557 insp 12.22.20.pdf',
          },
          {
            fileItemGuid: '8b4cc20f-8474-44dc-9d31-08753330c4ce',
            fileName: 'test1.jpg',
            url:
              'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/8b4cc20f847444dc9d3108753330c4ce1625495472-test1.jpg',
          },
        ],
      },
      {
        latitude: '33.4567345',
        longitude: '-80.7332496',
        markerNumber: 7,
        address: 'East Greenwich Township, NJ, USA',
        avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4',
        policeDepartment: 'Illinoins Department of Transportation',
        files: null,
        customer: 'IVS Freight Inc',
        companyId: null,
        oosStatus: false,
        violationsStatus: false,
        createdAt: null,
        doc: null,
        driverFullName: 'Sven Matter',
        driverId: 234,
        eventDate: '04/30/07',
        guid: '962e8b7f-87c0-49f6-8783-421f4d5a4511',
        hm: '16:45 AM',
        id: 57,
        lvl: 'I',
        lvlTitle: 'Walk Around',
        total: '$2,904',
        violationsData: [
          {
            title: 'Unsafe Driving',
            iconUrl: 'assets/img/svgs/table/violation-vl1.svg',
            sumWeight: '30',
            timeWeight: '3',
            weight: '10',
            violationDetails: [
              {
                title: '324.23SSW2',
                oos: 'D',
                oosStatus: true,
                weight: '2',
                desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              },
              {
                title: '8932.2GSS6',
                oos: 'D',
                oosStatus: false,
                weight: '6',
                desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              },
            ],
          },
        ],
        vl1: '0',
        vl2: '0',
        vl3: '0',
        vl4: '0',
        vl5: '0',
        vl6: '0',
        vl7: '0',
        oos: [
          {
            active: false,
            value: 'D',
            title: 'Driver',
          },
          {
            active: false,
            value: '1',
            title: 'Truck',
          },
          {
            active: false,
            value: '2',
            title: 'Trailer',
          },
        ],
        citation: '0',
        citationData: [
          {
            title: 'T879327-2',
            value: '$2,452',
            desc: 'Operated Non-PA Vehicle with class 3B without registration',
          },
        ],
        note: 'nema claima, nije bio na osiguranju',
        report: 'MS10170108322',
        trailerId: 12,
        trailerNumber: '#225R',
        truckId: 13,
        truckNumber: '#53252',
        state: 'Kansas',
        updatedAt: null,
        active: true,
        attachments: [
          {
            fileItemGuid: '1df783f0-c014-4410-aef1-a0ed34df8487',
            fileName: '6557 insp 12.22.20.pdf',
            url:
              'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/1df783f0c0144410aef1a0ed34df84871623772206-6557 insp 12.22.20.pdf',
          },
          {
            fileItemGuid: 'e3285ac1-5f99-41ca-936d-eca874497ef2',
            fileName: '6557 insp 12.22.20.pdf',
            url:
              'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/e3285ac15f9941ca936deca874497ef21625495471-6557 insp 12.22.20.pdf',
          },
          {
            fileItemGuid: '8b4cc20f-8474-44dc-9d31-08753330c4ce',
            fileName: 'test1.jpg',
            url:
              'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/8b4cc20f847444dc9d3108753330c4ce1625495472-test1.jpg',
          },
        ],
      },
      {
        latitude: '40.7658028',
        longitude: '-87.12806499999999',
        markerNumber: 8,
        address: 'East Greenwich Township, NJ, USA',
        avatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4',
        policeDepartment: 'Illinoins Department of Transportation',
        files: null,
        customer: 'IVS Freight Inc',
        companyId: null,
        oosStatus: true,
        violationsStatus: true,
        createdAt: null,
        doc: null,
        driverFullName: 'Glen Cotton',
        driverId: 167,
        eventDate: '01/12/21',
        guid: '962e8b7f-87c0-49f6-8783-421f4d5a4511',
        hm: '06:15 AM',
        id: 58,
        lvl: 'III',
        lvlTitle: 'Walk Around',
        total: '$3,084',
        violationsData: [
          {
            title: 'Unsafe Driving',
            iconUrl: 'assets/img/svgs/table/violation-vl1.svg',
            sumWeight: '42',
            timeWeight: '3',
            weight: '14',
            violationDetails: [
              {
                title: '324.23SSW2',
                oos: 'D',
                oosStatus: true,
                weight: '2',
                desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              },
              {
                title: '8932.2GSS6',
                oos: 'D',
                oosStatus: false,
                weight: '6',
                desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              },
              {
                title: '1343.2AZAT',
                oos: 'T',
                oosStatus: true,
                weight: '2',
                desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              },
            ],
          },
          {
            title: 'Vehicle Maintenance',
            iconUrl: 'assets/img/svgs/table/violation-vl4.svg',
            sumWeight: '42',
            timeWeight: '3',
            weight: '14',
            violationDetails: [
              {
                title: '324.23SSW2',
                oos: 'D',
                oosStatus: true,
                weight: '2',
                desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              },
              {
                title: '8932.2GSS6',
                oos: 'D',
                oosStatus: false,
                weight: '6',
                desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              },
              {
                title: '1343.2AZAT',
                oos: 'T',
                oosStatus: true,
                weight: '2',
                desc: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limitation',
              },
            ],
          },
        ],
        vl1: '42',
        vl2: '0',
        vl3: '0',
        vl4: '42',
        vl5: '0',
        vl6: '0',
        vl7: '0',
        oos: [
          {
            active: true,
            value: 'D',
            title: 'Driver',
          },
          {
            active: false,
            value: '1',
            title: 'Truck',
          },
          {
            active: true,
            value: '2',
            title: 'Trailer',
          },
        ],
        citation: '4',
        citationData: [
          {
            title: 'T879327-2',
            value: '$2,452',
            desc: 'Operated Non-PA Vehicle with class 3B without registration',
          },
          {
            title: 'T927634-7',
            value: '$452',
            desc: 'Operated Non-PA Vehicle with class 2B without insurance',
          },
          {
            title: 'A23426-B3',
            value: '$50',
            desc: 'Broken turn light on rear side of the trailer, no glass cover',
          },
          {
            title: 'KFA4232-YY',
            value: '$130',
            desc: 'Driving without a seatbelt',
          },
        ],
        note: 'nema claima, nije bio na osiguranju',
        report: 'MS1017010339',
        trailerId: 12,
        trailerNumber: '#322R',
        truckId: 13,
        truckNumber: '#43252',
        state: 'South Carolina',
        updatedAt: null,
        active: true,
        attachments: [
          {
            fileItemGuid: '1df783f0-c014-4410-aef1-a0ed34df8487',
            fileName: '6557 insp 12.22.20.pdf',
            url:
              'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/1df783f0c0144410aef1a0ed34df84871623772206-6557 insp 12.22.20.pdf',
          },
          {
            fileItemGuid: 'e3285ac1-5f99-41ca-936d-eca874497ef2',
            fileName: '6557 insp 12.22.20.pdf',
            url:
              'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/e3285ac15f9941ca936deca874497ef21625495471-6557 insp 12.22.20.pdf',
          },
          {
            fileItemGuid: '8b4cc20f-8474-44dc-9d31-08753330c4ce',
            fileName: 'test1.jpg',
            url:
              'https://nyc3.digitaloceanspaces.com/space.truckasssist/uploads/0/0/1/truck/178/inspection/8b4cc20f847444dc9d3108753330c4ce1625495472-test1.jpg',
          },
        ],
      },
    ];
    this.violationSummaryData = [
      {
        violationNumber: 3,
        code: '391.2SLLS2',
        codeDescription: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limit',
        oosNumber: 1,
        severityWeight: 8,
      },
      {
        violationNumber: 7,
        code: '392.523TAS2',
        codeDescription: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limit',
        oosNumber: 5,
        severityWeight: 4,
      },
      {
        violationNumber: 1,
        code: '393.524DF21',
        codeDescription: 'State/Local Laws - Speeding 6-10 miles per hour over the speed limit',
        oosNumber: 0,
        severityWeight: 2,
      },
    ];
    this.violationData = violations$;
    (this.violationDataInactive = violations$.filter((item) => {
      if (!item.active) {
        return item;
      }
    })),
      (this.violationDataActive = violations$.filter((item) => {
        if (item.active) {
          return item;
        }
      }));
    this.sendViolationData();
  }

  private getGridColumns(stateName: string, resetColumns: boolean): TableColumnDefinition[] {
    const userState: UserState = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );
    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      if (stateName === 'violations') {
        return getViolationsColums();
      } else if (stateName === 'violations_summary') {
        return getViolationsSummaryColums();
      }
    }
  }

  private getExtendedGridColumns(
    stateName: string,
    resetColumns: boolean
  ): TableColumnDefinition[] {
    const userState: UserState = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );
    if (userState && userState.extendedTableColumns.length && !resetColumns) {
      return userState.extendedTableColumns;
    } else {
      if (stateName === 'violations') {
        return getExtendedViolationsColums();
      } else if (stateName === 'violations_summary') {
        return getExtendedViolationsSummaryColums();
      }
    }
  }

  private sendViolationData(resetColumns?: boolean): void {
    const data: TableData[] = [
      {
        title: 'Violations',
        field: 'violations',
        type: 'violations',
        data: this.violationData,
        extended: false,
        filterYears: this.violationYears,
        gridNameTitle: 'Violations',
        stateName: 'violations',
        gridColumns: this.getGridColumns('violations', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('violations', resetColumns),
      },
      {
        title: 'Active',
        field: 'active',
        type: 'violations',
        data: this.violationDataActive,
        extended: false,
        filterYears: this.violationYears,
        gridNameTitle: 'Violations',
        stateName: 'violations',
        gridColumns: this.getGridColumns('violations', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('violations', resetColumns),
      },
      {
        title: 'Inactive',
        field: 'inactive',
        type: 'violations',
        data: this.violationDataInactive,
        extended: false,
        filterYears: this.violationYears,
        gridNameTitle: 'Violations',
        stateName: 'violations',
        gridColumns: this.getGridColumns('violations', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('violations', resetColumns),
      },
      {
        title: 'Summary',
        field: 'summary',
        type: 'violations_summary',
        data: this.violationSummaryData,
        extended: false,
        gridNameTitle: 'Summary',
        stateName: 'violations_summary',
        gridColumns: this.getGridColumns('violations_summary', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('violations_summary', resetColumns),
      },
    ];
    this.tableSubject.next({ tableData: data, check: true });
  }

  public callAction(action: any): void {
    if (action.type === 'insert-event') {
      this.onAddViolation();
    } else if (action.type === 'init-columns-event') {
      this.sendViolationData(true);
    } else if (action.type === 'edit-violation') {
      this.editViolation(action.id);
    } else if (action.type === 'delete') {
      this.onDeleteViolation(action.id);
    } else if (action.type === 'save-note-event') {
      this.onSaveNote(action);
    }
  }

  public onAddViolation() {
    const data = {
      type: 'new',
      id: null,
    };
    this.customModalService.openModal(ViolationManageComponent, { data }, null, {
      modalDialogClass: 'violation-modal',
    });
  }

  public editViolation(id: number) {
    const data = {
      type: 'edit',
      id,
      violation: this.violationData,
    };
    this.customModalService.openModal(ViolationManageComponent, { data }, null, {
      modalDialogClass: 'violation-modal',
    });
  }

  onSaveNote(note: any) {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.violationData.length; i++) {
      if (this.violationData[i].id === note.id) {
        this.violationData[i].note = note.value;
        this.safetyService
          .updateViolation(
            {
              note: this.violationData[i].note,
            },
            this.violationData[i].id
          )
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (res) => {
              this.notification.success('Safety Note has been updated.', 'Success:');
            },
            () => {
              this.shared.handleServerError();
            }
          );
        break;
      }
    }
  }

  /* Single Delete */
  onDeleteViolation(violationId: number) {
    this.safetyService
      .deleteViolation(violationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          for (let i = 0; i < this.violationData.length; i++) {
            if (this.violationData[i].id === violationId) {
              this.violationData.splice(i, 1);
            }
          }
          this.sendViolationData();
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  /* Multiple Delete */
  public callDelete(violationDelete: DeletedItem[]): void {
    for (const violation of violationDelete) {
      this.onDeleteViolation(violation.id);
    }
  }

  /* Watch for events around file tooltip */
  @HostListener('document:click', ['$event']) documentClick(event: any): void {
    if (true) {
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
