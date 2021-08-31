import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription, Subject, BehaviorSubject, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {
  TableOptions,
  TableColumnDefinition,
  TableData,
  TableSubject,
} from '../../shared/truckassist-table/models/truckassist-table';
import { UserState } from 'src/app/core/model/user';
import { SharedService } from 'src/app/core/services/shared.service';
import { TrailerData, TrailerTabData } from 'src/app/core/model/trailer';
import { AppTrailerService } from 'src/app/core/services/app-trailer.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { TrailerManageComponent } from '../trailer-manage/trailer-manage.component';
import { TrailerImportComponent } from '../trailer-import/trailer-import.component';
import {
  getExtendedTrailerColumnDefinition,
  getTrailerColumnDefinition,
} from 'src/assets/utils/settings/trailer-columns';
import { TrailerLicenseManageComponent } from '../trailer-licence/trailer-license-manage/trailer-license-manage.component';
import { TrailerInspectionManageComponent } from '../trailer-inspection/trailer-inspection-manage/trailer-inspection-manage.component';
import { DeletedItem, UpdatedData } from 'src/app/core/model/shared/enums';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SortPipe } from 'src/app/core/pipes/sort.pipe';
import { ClonerService } from 'src/app/core/services/cloner-service';
import { DatePipe } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
import { delay, takeUntil } from 'rxjs/operators';
import { TrailerState } from 'src/app/root-store/trailers-store/trailers.reducer';
import * as trailersActions from 'src/app/root-store/trailers-store/trailers.actions';
import * as trailersSelectors from 'src/app/root-store/trailers-store/trailers.selectors';
import { Store } from '@ngrx/store';

import { cloneDeep } from 'lodash-es';

@Component({
  templateUrl: './trailer-table.component.html',
  styleUrls: ['./trailer-table.component.scss'],
})
export class TrailerTableComponent implements OnInit, OnDestroy {
  @Input() inputData: any;
  private destroy$: Subject<void> = new Subject<void>();
  public trailerTabData: TrailerTabData = null;
  public trailersLoading$: Observable<boolean>;

  public tableOptions: TableOptions;
  private tableSubject: BehaviorSubject<TableSubject> = new BehaviorSubject(null);
  public trailerColumns: TableColumnDefinition[] = [];
  public extendedColumns: TableColumnDefinition[] = [];
  public loadingItems = true;

  // private subscriptions: Subscription[] = [];

  constructor(
    private trailerService: AppTrailerService,
    private customModalService: CustomModalService,
    private shared: SharedService,
    private notification: NotificationService,
    private spinner: SpinnerService,
    private toastr: ToastrService,
    private sortPipe: SortPipe,
    private clonerService: ClonerService,
    private datePipe: DatePipe,
    private trailersStore: Store<TrailerState>
  ) {}

  ngOnInit(): void {
    this.trailerService.addedTrailer
      .pipe(takeUntil(this.destroy$))
      .subscribe((trailer: TrailerData) => {
        trailer.animationType = 'new-item';
        this.trailerTabData.allTrailers.push(trailer);
        this.trailerTabData.activeTrailers.push(trailer);
        this.sendTrailerData();
        this.shared.emitAddItemAnimationAction.next(trailer.id);
        this.loadingItems = false;
      });

    this.trailerService.updateItemAction
      .pipe(delay(500), takeUntil(this.destroy$))
      .subscribe((success: any[]) => {
        for (const id of success) {
          let index = this.trailerTabData.allTrailers.findIndex((d) => d.id === id);
          if (index !== -1) {
            this.trailerTabData.allTrailers[index].status = this.trailerTabData.allTrailers[index]
              .status
              ? 0
              : 1;
            // check active trailers
            index = this.trailerTabData.inactiveTrailers.findIndex((d) => d.id === id);
            if (index !== -1) {
              this.trailerTabData.inactiveTrailers.splice(index, 1);
            }
            // check inactive trailers
            index = this.trailerTabData.inactiveTrailers.findIndex((d) => d.id === id);
            if (index !== -1) {
              this.trailerTabData.inactiveTrailers.splice(index, 1);
            }
          }
        }

        this.trailerTabData.inactiveTrailers = this.trailerTabData.allTrailers.filter(
          (d) => d.status === 0
        );
        this.trailerTabData.activeTrailers = this.trailerTabData.allTrailers.filter(
          (d) => d.status === 1
        );

        this.sendTrailerData();
        this.loadingItems = false;
      });

    this.trailerService.updatedStatuses
      .pipe(takeUntil(this.destroy$))
      .subscribe((updatedItems: UpdatedData) => {
        if (updatedItems.success && updatedItems.success.length) {
          for (const id of updatedItems.success) {
            let index = this.trailerTabData.allTrailers.findIndex((t) => t.id === id);

            if (index !== -1) {
              this.trailerTabData.allTrailers[index].animationType = 'update-item';
              // check active trailers
              index = this.trailerTabData.activeTrailers.findIndex((d) => d.id === id);
              if (index !== -1) {
                this.trailerTabData.activeTrailers[index].animationType = 'update-item';
              }
              // check inactive trailers
              index = this.trailerTabData.inactiveTrailers.findIndex((d) => d.id === id);
              if (index !== -1) {
                this.trailerTabData.inactiveTrailers[index].animationType = 'update-item';
              }
            }
          }

          this.sendTrailerData();
        }

        this.shared.emitUpdateStatusAnimationAction.next(updatedItems.success);
        this.trailerService.updateItemAction.next(updatedItems.success);
      });

    this.trailerService.updatedTrailer
      .pipe(takeUntil(this.destroy$))
      .subscribe((trailer: TrailerData) => {
        let index = this.trailerTabData.allTrailers.findIndex((d) => d.id === trailer.id);
        const tempStatus = this.clonerService.deepClone<number>(
          this.trailerTabData.allTrailers[index].status
        );
        if (index !== -1) {
          this.trailerTabData.allTrailers[index] = trailer;

          if (tempStatus !== trailer.status) {
            // check active trailers
            index = this.trailerTabData.activeTrailers.findIndex((d) => d.id === trailer.id);
            if (index !== -1) {
              this.trailerTabData.activeTrailers.splice(index, 1);
            }
            // check inactive trailers
            index = this.trailerTabData.inactiveTrailers.findIndex((d) => d.id === trailer.id);
            if (index !== -1) {
              this.trailerTabData.inactiveTrailers.splice(index, 1);
            }
          }
        }

        this.trailerTabData.activeTrailers = this.trailerTabData.allTrailers.filter(
          (d) => d.status === 1
        );

        this.trailerTabData.inactiveTrailers = this.trailerTabData.allTrailers.filter(
          (d) => d.status === 0
        );

        this.sendTrailerData();
        this.loadingItems = false;
      });

    this.trailerService.deleteItemAction
      .pipe(delay(500), takeUntil(this.destroy$))
      .subscribe((success: any[]) => {
        for (const id of success) {
          let index = this.trailerTabData.allTrailers.findIndex((t) => t.id === id);

          if (index !== -1) {
            this.trailerTabData.allTrailers.splice(index, 1);
            // check active trailers
            index = this.trailerTabData.activeTrailers.findIndex((d) => d.id === id);
            if (index !== -1) {
              this.trailerTabData.activeTrailers.splice(index, 1);
            }
            // check inactive trailers
            index = this.trailerTabData.inactiveTrailers.findIndex((d) => d.id === id);
            if (index !== -1) {
              this.trailerTabData.inactiveTrailers.splice(index, 1);
            }
          }
        }

        this.trailerTabData.activeTrailers = this.trailerTabData.allTrailers.filter(
          (d) => d.status === 1
        );

        this.trailerTabData.inactiveTrailers = this.trailerTabData.allTrailers.filter(
          (d) => d.status === 0
        );

        this.sendTrailerData();
        this.loadingItems = false;
      });

    this.trailerService.deletedTrailers
      .pipe(takeUntil(this.destroy$))
      .subscribe((dupdatedItems: UpdatedData) => {
        if (dupdatedItems.success && dupdatedItems.success.length) {
          for (const id of dupdatedItems.success) {
            let index = this.trailerTabData.allTrailers.findIndex((t) => t.id === id);

            if (index !== -1) {
              this.trailerTabData.allTrailers[index].animationType = 'delete-item';
              // check active trailers
              index = this.trailerTabData.activeTrailers.findIndex((d) => d.id === id);
              if (index !== -1) {
                this.trailerTabData.activeTrailers[index].animationType = 'delete-item';
              }
              // check inactive trailers
              index = this.trailerTabData.inactiveTrailers.findIndex((d) => d.id === id);
              if (index !== -1) {
                this.trailerTabData.inactiveTrailers[index].animationType = 'delete-item';
              }
            }
          }

          this.sendTrailerData();
        }

        this.shared.emitDeleteItemAnimationAction.next(dupdatedItems.success);
        this.trailerService.deleteItemAction.next(dupdatedItems.success);
      });

    this.shared.emitDeleteAction.pipe(takeUntil(this.destroy$)).subscribe((resp: any) => {
      this.deleteTrailer(resp.data.id);
    });

    this.initTableOptions();
    this.getTrailers();
  }

  private initTableOptions(): void {
    this.tableOptions = {
      data: this.tableSubject,
      useAdditionalFeatures: true,
      toolbarActions: {
        hideImport: false,
        hideExport: false,
        hideLockUnlock: false,
        hideAddNew: false,
        hideColumns: false,
        hideCompress: false,
        hideLabel: true,
        hideSelectNumber: true,
      },
      config: {
        showSort: true,
        sortBy: '',
        sortDirection: '',
        disabledColumns: [0],
        minWidth: 60,
      },
      mainActions: [
        {
          title: 'Edit Trailer',
          name: 'edit-trailer',
        },
      ],
      otherActions: [
        {
          title: 'Add Registration',
          name: 'add-registration',
        },
        {
          title: 'Add Repair',
          name: 'add-repair',
        },
        {
          title: 'Add Inspection',
          name: 'add-inspection',
        },
      ],
      activateAction: {
        title: 'Activate',
        reverseTitle: 'Deactivate',
        name: 'activate-item',
      },
      deleteAction: {
        title: 'Delete',
        name: 'delete-item',
        type: 'trailer',
        text: 'Are you sure you want to delete trailer(s)?',
      },
      export: true
    };
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
          this.sendTrailerData();
        }
      });
  }

  private getGridColumns(stateName: string, resetColumns: boolean): TableColumnDefinition[] {
    const userState: UserState = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );
    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      return getTrailerColumnDefinition();
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
      return getExtendedTrailerColumnDefinition();
    }
  }

  getTrailerFileName(data: any){
    if(data.name === 'Wabash National'){
      return 'wabash-national.svg'
    }else{
      return data.file;
    }
  }

  private sendTrailerData(resetColumns?: boolean): void {
    const data: TableData[] = [
      {
        title: 'Active',
        field: 'active',
        data: this.trailerTabData.activeTrailers ? this.trailerTabData.activeTrailers.map((trailer) => {
          trailer.doc.inspectionData = this.sortPipe.transform(
            trailer.doc.inspectionData,
            'startDate'
          );
          trailer.doc.licenseData = this.sortPipe.transform(trailer.doc.licenseData, 'endDate');
          trailer.doc.titleData = this.sortPipe.transform(trailer.doc.titleData, 'startDate');
          trailer.doc.trailerLeaseData = this.sortPipe.transform(
            trailer.doc.trailerLeaseData,
            'date'
          );
          trailer.doc.additionalData.make.file = this.getTrailerFileName(
            trailer.doc.additionalData.make
          );
          return trailer;
        }) : [],
        extended: false,
        gridNameTitle: 'Trailer',
        stateName: 'trailers',
        gridColumns: this.getGridColumns('trailers', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('trailers', resetColumns),
      },
      {
        title: 'Inactive',
        field: 'inactive',
        data: this.trailerTabData.inactiveTrailers ? this.trailerTabData.inactiveTrailers.map((trailer) => {
          trailer.doc.inspectionData = this.sortPipe.transform(
            trailer.doc.inspectionData,
            'startDate'
          );
          trailer.doc.licenseData = this.sortPipe.transform(trailer.doc.licenseData, 'endDate');
          trailer.doc.titleData = this.sortPipe.transform(trailer.doc.titleData, 'startDate');
          trailer.doc.trailerLeaseData = this.sortPipe.transform(
            trailer.doc.trailerLeaseData,
            'date'
          );
          trailer.doc.additionalData.make.file = this.getTrailerFileName(
            trailer.doc.additionalData.make
          );
          return trailer;
        }) : [],
        extended: false,
        gridNameTitle: 'Trailer',
        stateName: 'trailers',
        gridColumns: this.getGridColumns('trailers', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('trailers', resetColumns),
      },
      {
        title: 'All',
        field: null,
        data: this.trailerTabData.allTrailers ? this.trailerTabData.allTrailers.map((trailer) => {
          trailer.doc.inspectionData = this.sortPipe.transform(
            trailer.doc.inspectionData,
            'startDate'
          );
          trailer.doc.licenseData = this.sortPipe.transform(trailer.doc.licenseData, 'endDate');
          trailer.doc.titleData = this.sortPipe.transform(trailer.doc.titleData, 'startDate');
          trailer.doc.trailerLeaseData = this.sortPipe.transform(
            trailer.doc.trailerLeaseData,
            'date'
          );
          trailer.doc.additionalData.make.file = this.getTrailerFileName(
            trailer.doc.additionalData.make
          );
          return trailer;
        }) : [],
        extended: false,
        gridNameTitle: 'Trailer',
        stateName: 'trailers',
        gridColumns: this.getGridColumns('trailers', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('trailers', resetColumns),
      },
    ];


    console.log('Trailer Formated')
    console.log(this.trailerTabData);
    this.tableSubject.next({ tableData: data, check: true });
  }

  public callAction(action: any): void {
    if (this.trailerTabData.allTrailers.length && action.id) {
      const trailer = this.trailerTabData.allTrailers.find((t) => t.id === action.id);
      action.trailer = trailer ? trailer : null;
    }
    if (action.type === 'edit-trailer') {
      this.openTrailerQuickEdit(action.id);
    } else if (action.type === 'import-event') {
      this.callImport();
    } else if (action.type === 'insert-event') {
      this.callInsert();
    } else if (action.type === 'add-repair') {
      this.addNewMainenance(action);
    } else if (action.type === 'add-registration') {
      this.addNewLicense(action);
    } else if (action.type === 'add-inspection') {
      this.addNewInspection(action);
    } else if (action.type === 'status-event') {
      this.callStatus(action);
    } else if (action.type === 'init-columns-event') {
      this.sendTrailerData(true);
    } else if (action.type === 'delete-item') {
      this.deleteTrailer(action.id);
    } else if (action.type === 'save-note-event') {
      this.saveNote(action);
    } else if (action.type === 'activate-item') {
      action.selection = [{ id: action.id }];
      this.callStatus(action);
    }
  }

  private saveNote(data: any) {
    const saveData: TrailerData = this.clonerService.deepClone<TrailerData>(data.trailer);
    saveData.doc.additionalData.note = data.value;

    this.spinner.show(true);
    this.trailerService
      .updateTrailerData(saveData, saveData.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.notification.success('Trailer Note has been updated.', 'Success:');
          this.spinner.show(false);
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  private deleteTrailer(id: any) {
    this.spinner.show(true);
    this.trailerService
      .deleteAllTrailers([{ id }])
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

  openTrailerQuickEdit(id: any) {
    this.trailerService
      .editTrailers(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (trailer: TrailerData) => {
          const data = {
            type: 'edit',
            trailer,
            id,
          };
          this.customModalService.openModal(TrailerManageComponent, { data }, null, {
            size: 'small',
          });
        },
        (error: HttpErrorResponse) => {
          this.shared.handleError(error);
        }
      );
  }

  public openQuickEdit(id: any): void {
    const data = {
      type: 'edit',
      id,
    };
    this.customModalService.openModal(TrailerManageComponent, { data }, null, { size: 'small' });
  }

  public addNewLicense(action: any): void {
    const data = {
      type: 'new',
      trailer: action.trailer,
      prefix: true,
    };
    this.customModalService.openModal(TrailerLicenseManageComponent, { data }, null, {
      size: 'small',
    });
  }

  public addNewInspection(action: any) {
    const data = {
      type: 'new',
      trailer: action.trailer,
      prefix: true,
    };
    this.customModalService.openModal(TrailerInspectionManageComponent, { data }, null, {
      size: 'small',
    });
  }

  public addNewMainenance(action: any) {
    const data = {
      type: 'new',
      trailer: action.trailer,
      prefix: true,
    };
    this.notification.warning('WIP: In progress');
  }

  public callImport(): void {
    this.customModalService.openModal(TrailerImportComponent);
  }

  public callInsert(): void {
    const data = {
      type: 'new',
      id: null,
    };
    this.customModalService.openModal(TrailerManageComponent, { data }, null, { size: 'small' });
  }

  public callDelete(event: any): void {
    this.trailerService
      .deleteAllTrailers(event)
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

  public callStatus(event: any): void {
    this.trailerService
      .changeTrailerStatuses(event.selection)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: UpdatedData) => {
          if (event.tab === 'active' && response.success.length === 1) {
            this.toastr.success('Trailer has been deactivated.', 'Success');
          } else if (event.tab === 'active' && response.success.length > 1) {
            this.toastr.success('Trailers have been deactivated.', 'Success');
          } else if (event.tab === 'inactive' && response.success.length === 1) {
            this.toastr.success('Trailer has been activated.', 'Success');
          } else if (event.tab === 'inactive' && response.success.length > 1) {
            this.toastr.success('Trailers have been activated.', 'Success');
          }

          // failed trailers
          if (response.failure.length) {
            for (const id of response.failure) {
              if (event.tab === 'inactive') {
                this.toastr.warning(`Trailer with Id: '${id}' hasn't been activated.`, 'Warning');
              } else {
                this.toastr.warning(`Trailer with Id: '${id}' hasn't been deactivated.`, 'Warning');
              }
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
