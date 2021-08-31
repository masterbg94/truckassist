import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { empty, forkJoin, Observable, Subject } from 'rxjs';
import { ManageCompany } from 'src/app/core/model/company';
import { OwnerData } from 'src/app/core/model/shared/owner';
import { TruckData, TruckOwner, TruckTabData } from 'src/app/core/model/truck';
import { AppTruckService } from 'src/app/core/services/app-truck.service';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import {
  HistoryData,
  TruckassistHistoryDataComponent,
} from 'src/app/shared/truckassist-history-data/truckassist-history-data.component';
import { formatAddress } from 'src/assets/utils/settings/formatting';
import { TruckManageComponent } from '../truck-manage/truck-manage.component';
import { v4 as uuidv4 } from 'uuid';
import { DatePipe } from '@angular/common';
import { TruckLicenseManageComponent } from '../truck-licence/truck-license-manage/truck-license-manage.component';
import { TruckInspectionManageComponent } from '../truck-inspection/truck-inspection-manage/truck-inspection-manage.component';
import { TruckTitleManageComponent } from '../truck-title/truck-title-manage/truck-title-manage.component';
import { TruckLeasePurchaseManageComponent } from '../truck-lease-purchase/truck-lease-purchase-manage/truck-lease-purchase-manage.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ClonerService } from 'src/app/core/services/cloner-service';
import { switchMap, takeUntil } from 'rxjs/operators';
import { AppSharedService } from 'src/app/core/services/app-shared.service';
import { UpdatedData } from 'src/app/core/model/shared/enums';
import { ToastrService } from 'ngx-toastr';
import { TruckState } from 'src/app/root-store/trucks-store/trucks.reducer';
import { Store } from '@ngrx/store';
import * as trucksActions from 'src/app/root-store/trucks-store/trucks.actions';
import * as trucksSelectors from 'src/app/root-store/trucks-store/trucks.selectors';

import { cloneDeep } from 'lodash-es';

@Component({
  selector: 'app-truck-details',
  templateUrl: './truck-details.component.html',
  styleUrls: ['./truck-details.component.scss'],
})
export class TruckDetailsComponent implements OnInit, OnDestroy {
  @ViewChild(TruckassistHistoryDataComponent)
  truckassistHistoryDataComponent: TruckassistHistoryDataComponent;
  @ViewChild('autoComplete') autoComplete;

  private destroy$: Subject<void> = new Subject<void>();
  public truckTabData: TruckTabData = null;
  public trucksLoading$: Observable<boolean>;

  loading = false;
  statusLoading = false;
  truck: TruckData = null;
  owner: OwnerData = null;
  activityHistory: HistoryData[] = [];
  keyword = 'truckNumber';
  id: number;
  options: any = [];
  truckAutocompleteControl = new FormControl();
  showNote = false;
  noteChanged = false;
  textRows = 1;
  noteControl = new FormControl();
  userCompany: ManageCompany = null;
  enableAutoComplete = false;

  dropdownOptions: any = {
    mainActions: [
      {
        title: 'Edit',
        name: 'edit-truck',
      },
    ],
    otherActions: [],
    deleteAction: {
      title: 'Delete',
      name: 'delete-truck',
      type: 'truck',
      text: 'Are you sure you want to delete truck?',
    },
  };

  constructor(
    private customModalService: CustomModalService,
    public truckService: AppTruckService,
    private route: ActivatedRoute,
    private shared: SharedService,
    public router: Router,
    private spinner: SpinnerService,
    private notification: NotificationService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private clonerService: ClonerService,
    private ownerService: AppSharedService,
    private toastr: ToastrService,
    private trucksStore: Store<TruckState>
  ) {
    this.route.params
    .pipe(takeUntil(this.destroy$))
    .subscribe((params) => {
      this.id = params.id;
    });
  }

  ngOnInit(): void {
    this.getUserCompany();
    this.getTrucks();
    this.getTruckData();

    this.truckService.updatedTruck
      .pipe(
        switchMap((truck: TruckData) => {
          this.truck = truck;
          this.activityHistory =
            truck && truck.doc && this.truck.doc.activityHistory
              ? this.truck.doc.activityHistory
              : [];
          this.truckassistHistoryDataComponent.loadData(this.activityHistory);

          return this.truck.companyOwned
            ? new Observable((observer) => {
                observer.next(null);
                observer.complete();
              })
            : this.ownerService.getOwner(this.truck.ownerId);
        })
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (owner: OwnerData) => {
          this.owner = owner;
          this.createForm();
        },
        () => {
          this.shared.handleServerError();
        }
      );

    this.shared.emitDeleteAction
    .pipe(takeUntil(this.destroy$))
    .subscribe((resp: any) => {
      if (resp.data && resp.data.id && resp.data.type === 'delete-item') {
        this.deleteTruck(resp.data.id);
      }
    });
  }

  getUserCompany() {
    this.userCompany = JSON.parse(localStorage.getItem('userCompany'));
  }

  public getTrucks(): void {
    this.trucksLoading$ = this.trucksStore.select(trucksSelectors.selectTruckDataLoading);
    this.trucksStore
      .select(trucksSelectors.selectTruckData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((truckTabData) => {
        this.truckTabData = cloneDeep(truckTabData);
        if (!truckTabData) {
          this.trucksStore.dispatch(trucksActions.loadTruckData());
        } else {
          this.truckTabData = truckTabData;
          this.enableAutoComplete = this.truckTabData.allTrucks.length > 1;
          this.options = this.truckTabData.allTrucks;
        }
      });
  }

  public getTruckData() {
    // const truckList$ = this.truckService.getTruckList();
    const truck$ = this.truckService.getTruckData(this.id, 'all');

    this.loading = true;
    forkJoin([truck$])
      .pipe(
        switchMap(([truck]: [TruckData]) => {
          this.truck = truck;
          this.activityHistory =
            truck && truck.doc && this.truck.doc.activityHistory
              ? this.truck.doc.activityHistory
              : [];
          return this.truck.companyOwned
            ? new Observable((observer) => {
                observer.next(null);
                observer.complete();
              })
            : this.ownerService.getOwner(this.truck.ownerId);
        })
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (owner: OwnerData) => {
          this.owner = owner;
          this.createForm();
          this.loading = false;
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  public createForm() {
    this.noteControl.setValue(
      this.truck.doc.additionalData && this.truck.doc.additionalData.note
        ? this.truck.doc.additionalData.note
        : ''
    );

    if (this.noteControl.value.length) {
      this.handleHeight(this.noteControl.value);
      this.showNote = true;
    }

    if (this.truck.status) {
      this.noteControl.enable();
    } else {
      this.noteControl.disable();
    }
  }

  public selectPreviousTruck(): void {
    if (this.truckTabData.allTrucks.length && this.enableAutoComplete) {
      let currentIndex = this.truckTabData.allTrucks.findIndex((d) => d.id === this.truck.id);
      if (currentIndex !== -1) {
        currentIndex--;
        if (currentIndex === 0) {
          currentIndex = this.truckTabData.allTrucks.length - 1;
        }
        this.truck = this.truckTabData.allTrucks[currentIndex];
        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => this.router.navigate(['/trucks/edit/' + this.truck.id + '/basic']));
      }
    }
  }

  public selectNextTruck(): void {
    if (this.truckTabData.allTrucks.length && this.enableAutoComplete) {
      let currentIndex = this.truckTabData.allTrucks.findIndex((d) => d.id === this.truck.id);
      if (currentIndex !== -1) {
        currentIndex++;
        if (currentIndex === this.truckTabData.allTrucks.length) {
          currentIndex = 0;
        }
        this.truck = this.truckTabData.allTrucks[currentIndex];
        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => this.router.navigate(['/trucks/edit/' + this.truck.id + '/basic']));
      }
    }
  }

  public focus(e: any, arrow: HTMLElement) {
    e.stopPropagation();
    if (this.enableAutoComplete) {
      if (arrow.classList.contains('focused') && this.autoComplete.isOpen) {
        this.autoComplete.close();
        arrow.classList.remove('focused');
      } else {
        this.autoComplete.open();
        arrow.classList.add('focused');
      }

      this.autoComplete.filteredList = this.truckTabData.allTrucks.filter(
        (d) => d.truckNumber !== this.truckAutocompleteControl.value
      );
    }
  }

  public closeAutocomplete(arrow: HTMLElement) {
    arrow.classList.remove('focused');
  }

  public selectTruck(event: any) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/trucks/edit/' + event.id + '/basic']));
  }

  public openAction(action: any): void {
    if (action.type === 'edit-truck') {
      this.openTruckEdit(action.id);
    } else if (action.type === 'delete-item') {
      this.deleteTruck(action.id);
    }
  }

  private openTruckEdit(id: number) {
    const data = {
      type: 'edit',
      truck: this.truck,
    };
    this.customModalService.openModal(TruckManageComponent, { data }, null, { size: 'small' });
  }

  private deleteTruck(id: any) {
    this.spinner.show(true);
      this.truckService.deleteAllTrucks([{ id }])
      .pipe(takeUntil(this.destroy$))
      .subscribe(
      (response: UpdatedData) => {
        if (response.success.length === 1) {
          this.toastr.success('Truck has been deleted.', 'Success');
        } else if (response.success.length > 1) {
          this.toastr.success('Trucks have been deleted.', 'Success');
        }

        // failed trucks
        if (response.failure.length) {
          for (const id of response.failure) {
            this.toastr.warning(`Truck with Id: '${id}' hasn't been deleted.`, 'Warning');
          }
        }

        // not exist trucks
        if (response.notExist.length) {
          for (const id of response.notExist) {
            this.toastr.warning(`Truck with Id: '${id}' doesn't exist.`, 'Warning');
          }
        }
      },
      (error: HttpErrorResponse) => {
        this.shared.handleError(error);
      }
    );
  }

  changeStatus(id: any) {
    const saveData: TruckData = this.clonerService.deepClone<TruckData>(this.truck);
    saveData.status = this.truck.status ? 0 : 1;

    if (this.truck.status) {
      this.noteControl.enable();
    } else {
      this.noteControl.disable();
    }

    if (saveData.doc.activityHistory.length) {
      if (saveData.status) {
        saveData.doc.activityHistory.push({
          id: uuidv4(),
          startDate: new Date(),
          startDateShort: this.datePipe.transform(new Date(), 'shortDate'),
          endDate: null,
          endDateShort: null,
          header: saveData.doc.activityHistory[saveData.doc.activityHistory.length - 1].header,
          ownerId: saveData.doc.activityHistory[saveData.doc.activityHistory.length - 1].ownerId,
        });
      } else {
        if (saveData.doc.activityHistory.length) {
          saveData.doc.activityHistory[
            saveData.doc.activityHistory.length - 1
          ].endDate = new Date();
          saveData.doc.activityHistory[
            saveData.doc.activityHistory.length - 1
          ].endDateShort = this.datePipe.transform(new Date(), 'shortDate');
        }
      }
    }

    this.spinner.show(true);
    this.statusLoading = true;
    this.truckService.updateTruckData(saveData, id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      () => {
        this.notification.success('Truck Status has been updated.', 'Success:');
        this.spinner.show(false);
        this.statusLoading = false;
      },
      () => {
        this.shared.handleServerError();
      }
    );
  }

  public updateTruckNote(newNote: string): void {
    const saveData: TruckData = this.clonerService.deepClone<TruckData>(this.truck);
    saveData.status = this.truck.status ? 1 : 0;
    saveData.doc.additionalData.note = newNote;
    this.truckService.updateTruckData(saveData, this.truck.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      () => {
        this.notification.success(`The Note has been updated.`, 'Success:');
      },
      (error: HttpErrorResponse) => {
        this.shared.handleError(error);
      }
    );
  }

  public saveHistoryData(event: any): void {
    const historyData: HistoryData[] = event.data;
    const index: number = event.index;
    const isStartDate: boolean = event.isStartDate;

    // set owner history header
    // historyData[index].header =
    //   this.userCompany && this.truck.companyOwned
    //     ? this.userCompany.name
    //     : this.owner
    //     ? this.owner.ownerName
    //     : null;

    this.truck.doc.activityHistory = historyData.map((wd) => {
      delete wd.editStartDate;
      delete wd.editEndDate;
      return wd;
    });

    const saveData: TruckData = this.clonerService.deepClone<TruckData>(this.truck);
    saveData.status = this.truck.status ? 1 : 0;

    if (
      saveData.doc.activityHistory.length &&
      index === saveData.doc.activityHistory.length - 1 &&
      !isStartDate
    ) {
      saveData.status = saveData.doc.activityHistory[saveData.doc.activityHistory.length - 1]
        .endDate
        ? 0
        : 1;
    }

    this.spinner.show(true);

    this.truckService.updateTruckData(saveData, this.truck.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      () => {
        if (isStartDate) {
          this.notification.success('Owner Start Date has been updated.', 'Success:');
        } else {
          this.notification.success('Owner End Date has been updated.', 'Success:');
        }
        this.spinner.show(false);
      },
      (error: HttpErrorResponse) => {
        this.shared.handleError(error);
      }
    );
  }

  public removeHistoryData(index: number): void {
    const tempData: HistoryData[] = Object.assign([], this.activityHistory);

    if (index !== -1) {
      tempData.splice(index, 1);
    }

    const saveData: TruckData = this.clonerService.deepClone<TruckData>(this.truck);
    saveData.status = tempData[tempData.length - 1].endDate ? 0 : 1;
    saveData.doc.activityHistory = tempData;

    this.spinner.show(true);
    this.truckService.updateTruckData(saveData, this.truck.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      () => {
        this.notification.success('Owner History Item has been removed.', 'Success:');
        this.spinner.show(false);
      },
      (error: HttpErrorResponse) => {
        this.shared.handleError(error);
      }
    );
  }

  public printProfile() {
    return;
  }

  public formatAddress(address: string, unit: string, index: number) {
    return formatAddress(address, unit, index);
  }

  handleHeight(val: string) {
    const lines = val.split(/\r|\r\n|\n/);
    const count = lines.length;
    this.textRows = count >= 4 ? 4 : count;
  }

  public addNewLicence(): void {
    const data = {
      type: 'new',
      truck: this.truck,
    };
    this.customModalService.openModal(TruckLicenseManageComponent, { data }, null, {
      size: 'small',
    });
  }

  public addNewInspection(): void {
    const data = {
      type: 'new',
      truck: this.truck,
    };
    this.customModalService.openModal(TruckInspectionManageComponent, { data }, null, {
      size: 'small',
    });
  }

  public newTruckTitle(): void {
    const data = {
      type: 'new',
      truck: this.truck,
    };
    this.customModalService.openModal(TruckTitleManageComponent, { data }, null, {
      size: 'small',
    });
  }

  public newTruckLease(): void {
    const data = {
      type: 'new',
      truck: this.truck,
    };
    this.customModalService.openModal(TruckLeasePurchaseManageComponent, { data }, null, {
      size: 'small',
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
