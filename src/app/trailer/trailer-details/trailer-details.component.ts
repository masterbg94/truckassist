import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, Subject, Subscription } from 'rxjs';
import { ManageCompany } from 'src/app/core/model/company';
import { OwnerData } from 'src/app/core/model/shared/owner';
import { TrailerData, TrailerTabData } from 'src/app/core/model/trailer';
import { AppTrailerService } from 'src/app/core/services/app-trailer.service';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { NotificationService } from 'src/app/services/notification-service.service';

import {
  HistoryData,
  TruckassistHistoryDataComponent,
} from 'src/app/shared/truckassist-history-data/truckassist-history-data.component';
import { formatAddress } from 'src/assets/utils/settings/formatting';
import { TrailerManageComponent } from '../trailer-manage/trailer-manage.component';
import { v4 as uuidv4 } from 'uuid';
import { DatePipe } from '@angular/common';
import { TrailerLicenseManageComponent } from '../trailer-licence/trailer-license-manage/trailer-license-manage.component';
import { TrailerInspectionManageComponent } from '../trailer-inspection/trailer-inspection-manage/trailer-inspection-manage.component';
import { TrailerTitleManageComponent } from '../trailer-title/trailer-title-manage/trailer-title-manage.component';
import { TrailerLeasePurchaseManageComponent } from '../trailer-lease-purchase/trailer-lease-purchase-manage/trailer-lease-purchase-manage.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ClonerService } from 'src/app/core/services/cloner-service';
import { switchMap, takeUntil } from 'rxjs/operators';
import { AppSharedService } from 'src/app/core/services/app-shared.service';
import { UpdatedData } from 'src/app/core/model/shared/enums';
import { ToastrService } from 'ngx-toastr';
import { TrailerState } from 'src/app/root-store/trailers-store/trailers.reducer';
import { Store } from '@ngrx/store';
import * as trailersActions from 'src/app/root-store/trailers-store/trailers.actions';
import * as trailersSelectors from 'src/app/root-store/trailers-store/trailers.selectors';

import { cloneDeep } from 'lodash-es';

@Component({
  selector: 'app-trailer-details',
  templateUrl: './trailer-details.component.html',
  styleUrls: ['./trailer-details.component.scss'],
})
export class TrailerDetailsComponent implements OnInit, OnDestroy {
  @ViewChild(TruckassistHistoryDataComponent)
  trailerassistHistoryDataComponent: TruckassistHistoryDataComponent;
  @ViewChild('autoComplete') autoComplete;
  private destroy$: Subject<void> = new Subject<void>();

  public trailerTabData: TrailerTabData = null;
  public trailersLoading$: Observable<boolean>;

  loading = false;
  statusLoading = false;
  trailer: TrailerData = null;
  owner: OwnerData = null;
  activityHistory: HistoryData[] = [];
  keyword = 'trailerNumber';
  id: number;
  options: any = [];
  trailerAutocompleteControl = new FormControl();
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
        name: 'edit-trailer',
      },
    ],
    otherActions: [],
    deleteAction: {
      title: 'Delete',
      name: 'delete-item',
      type: 'trailer',
      text: 'Are you sure you want to delete trailer?',
    },
  };

  constructor(
    private customModalService: CustomModalService,
    public trailerService: AppTrailerService,
    private route: ActivatedRoute,
    private shared: SharedService,
    public router: Router,
    private spinner: SpinnerService,
    private notification: NotificationService,
    private datePipe: DatePipe,
    private clonerService: ClonerService,
    private ownerService: AppSharedService,
    private toastr: ToastrService,
    private trailersStore: Store<TrailerState>
  ) {

    this.route.params
    .pipe(takeUntil(this.destroy$))
    .subscribe((params) => {
      this.id = params.id;
    });
  }

  ngOnInit(): void {
    this.getUserCompany();
    this.getTrailers();
    this.getTrailerData();

    this.trailerService.updatedTrailer
      .pipe(
        switchMap((trailer: TrailerData) => {
          this.trailer = trailer;
          this.activityHistory =
            trailer && trailer.doc && this.trailer.doc.activityHistory
              ? this.trailer.doc.activityHistory
              : [];
          this.trailerassistHistoryDataComponent.loadData(this.activityHistory);

          return this.trailer.companyOwned
            ? new Observable((observer) => {
                observer.next(null);
                observer.complete();
              })
            : this.ownerService.getOwner(this.trailer.ownerId);
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
        this.deleteTrailer(resp.data.id);
      }
    });
  }

  getUserCompany() {
    this.userCompany = JSON.parse(localStorage.getItem('userCompany'));
  }

  public getTrailers(): void {
    this.trailersLoading$ = this.trailersStore.select(trailersSelectors.selectTrailerDataLoading);
    this.trailersStore
      .select(trailersSelectors.selectTrailerData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((trailerTabData) => {
        this.trailerTabData = cloneDeep(trailerTabData);
        if (!trailerTabData) {
          this.trailersStore.dispatch(trailersActions.loadTrailerData());
        } else {
          this.trailerTabData = trailerTabData;
          this.enableAutoComplete = this.trailerTabData.allTrailers.length > 1;
          this.options = this.trailerTabData.allTrailers;
        }
      });
  }

  public getTrailerData() {
    // const trailerList$ = this.trailerService.getTrailerList();
    const trailer$ = this.trailerService.getTrailerData(this.id, 'all');

    this.loading = true;

    forkJoin([trailer$])
      .pipe(
        switchMap(([trailer]: [TrailerData]) => {
          this.trailer = trailer;
          this.activityHistory =
            trailer && trailer.doc && this.trailer.doc.activityHistory
              ? this.trailer.doc.activityHistory
              : [];

          return this.trailer.companyOwned
            ? new Observable((observer) => {
                observer.next(null);
                observer.complete();
              })
            : this.ownerService.getOwner(this.trailer.ownerId);
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
      this.trailer.doc.additionalData && this.trailer.doc.additionalData.note
        ? this.trailer.doc.additionalData.note
        : ''
    );

    if (this.noteControl.value.length) {
      this.handleHeight(this.noteControl.value);
      this.showNote = true;
    }

    if (this.trailer.status) {
      this.noteControl.enable();
    } else {
      this.noteControl.disable();
    }
  }

  public selectPreviousTrailer(): void {
    if (this.trailerTabData.allTrailers.length && this.enableAutoComplete) {
      let currentIndex = this.trailerTabData.allTrailers.findIndex((d) => d.id === this.trailer.id);
      if (currentIndex !== -1) {
        currentIndex--;
        if (currentIndex === 0) {
          currentIndex = this.trailerTabData.allTrailers.length - 1;
        }
        this.trailer = this.trailerTabData.allTrailers[currentIndex];
        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => this.router.navigate(['/trailers/edit/' + this.trailer.id + '/basic']));
      }
    }
  }

  public selectNextTrailer(): void {
    if (this.trailerTabData.allTrailers.length && this.enableAutoComplete) {
      let currentIndex = this.trailerTabData.allTrailers.findIndex((d) => d.id === this.trailer.id);
      if (currentIndex !== -1) {
        currentIndex++;
        if (currentIndex === this.trailerTabData.allTrailers.length) {
          currentIndex = 0;
        }
        this.trailer = this.trailerTabData.allTrailers[currentIndex];
        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => this.router.navigate(['/trailers/edit/' + this.trailer.id + '/basic']));
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

      this.autoComplete.filteredList = this.trailerTabData.allTrailers.filter(
        (d) => d.trailerNumber !== this.trailerAutocompleteControl.value
      );
    }
  }

  public closeAutocomplete(arrow: HTMLElement) {
    arrow.classList.remove('focused');
  }

  public selectTrailer(event: any) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/trailers/edit/' + event.id + '/basic']));
  }

  public openAction(action: any): void {
    if (action.type === 'edit-trailer') {
      this.openTrailerEdit(action.id);
    } else if (action.type === 'delete-item') {
      this.deleteTrailer(action.id);
    }
  }

  private openTrailerEdit(id: number) {
    const data = {
      type: 'edit',
      trailer: this.trailer,
    };
    this.customModalService.openModal(TrailerManageComponent, { data }, null, { size: 'small' });
  }

  private deleteTrailer(id: any) {
    this.spinner.show(true);

    this.trailerService.deleteAllTrailers([{ id }])
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (response: UpdatedData) => {
        if (response.success.length === 1) {
          this.toastr.success('Trailer has been deleted.', 'Success');
        } else if (response.success.length > 1) {
          this.toastr.success('Trailers have been deleted.', 'Success');
        }

        // failed trailers
        if (response.failure.length) {
          for (const id of response.failure) {
            this.toastr.warning(`Trailer with Id: '${id}' hasn't been deleted.`, 'Warning');
          }
        }

        // not exist trailers
        if (response.notExist.length) {
          for (const id of response.notExist) {
            this.toastr.warning(`Trailer with Id: '${id}' doesn't exist.`, 'Warning');
          }
        }
      },
      (error: HttpErrorResponse) => {
        this.shared.handleError(error);
      }
    );
  }

  changeStatus(id: any) {
    const saveData: TrailerData = this.clonerService.deepClone<TrailerData>(this.trailer);
    saveData.status = this.trailer.status ? 0 : 1;

    if (this.trailer.status) {
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
    this.trailerService.updateTrailerData(saveData, id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      () => {
        this.notification.success('Trailer Status has been updated.', 'Success:');
        this.spinner.show(false);
        this.statusLoading = false;
      },
      (error: HttpErrorResponse) => {
        this.shared.handleError(error);
      }
    );
  }

  public updateTrailerNote(newNote: string): void {
    const saveData: TrailerData = this.clonerService.deepClone<TrailerData>(this.trailer);
    saveData.status = this.trailer.status ? 1 : 0;
    saveData.doc.additionalData.note = newNote;
    this.trailerService.updateTrailerData(saveData, this.trailer.id)
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
    historyData[index].header =
      this.userCompany && this.trailer.companyOwned
        ? this.userCompany.name
        : this.owner
        ? this.owner.businessName
        : null;

    this.trailer.doc.activityHistory = historyData.map((wd) => {
      delete wd.editStartDate;
      delete wd.editEndDate;
      return wd;
    });

    const saveData: TrailerData = this.clonerService.deepClone<TrailerData>(this.trailer);
    saveData.status = this.trailer.status ? 1 : 0;

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

    this.trailerService.updateTrailerData(saveData, this.trailer.id)
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

    const saveData: TrailerData = this.clonerService.deepClone<TrailerData>(this.trailer);
    saveData.status = tempData[tempData.length - 1].endDate ? 0 : 1;
    saveData.doc.activityHistory = tempData;

    this.spinner.show(true);
    this.trailerService.updateTrailerData(saveData, this.trailer.id)
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
      trailer: this.trailer,
    };
    this.customModalService.openModal(TrailerLicenseManageComponent, { data }, null, {
      size: 'small',
    });
  }

  public addNewInspection(): void {
    const data = {
      type: 'new',
      trailer: this.trailer,
    };
    this.customModalService.openModal(TrailerInspectionManageComponent, { data }, null, {
      size: 'small',
    });
  }

  public newTrailerTitle(): void {
    const data = {
      type: 'new',
      trailer: this.trailer,
    };
    this.customModalService.openModal(TrailerTitleManageComponent, { data }, null, {
      size: 'small',
    });
  }

  public newTrailerLease(): void {
    const data = {
      type: 'new',
      trailer: this.trailer,
    };
    this.customModalService.openModal(TrailerLeasePurchaseManageComponent, { data }, null, {
      size: 'small',
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
