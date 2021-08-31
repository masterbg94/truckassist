import { takeUntil } from 'rxjs/operators';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, forkJoin, Subject } from 'rxjs';
import { dateFormat } from 'src/app/core/helpers/formating';
import { DeletedItem } from 'src/app/core/model/shared/enums';
import { UserState } from 'src/app/core/model/user';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { SafetyService } from 'src/app/core/services/safety.service';
import { SharedService } from 'src/app/core/services/shared.service';
import {
  TableColumnDefinition,
  TableData,
  TableOptions,
  TableSubject,
} from 'src/app/shared/truckassist-table/models/truckassist-table';
import {
  getAccidentColumns,
  getExtendedAccidentColumns,
} from 'src/assets/utils/settings/safety-columns';
import moment from 'moment';
import { NotificationService } from 'src/app/services/notification-service.service';
import { AccidentManageComponent } from '../accident-manage/accident-manage.component';

@Component({
  selector: 'app-safety-accident',
  templateUrl: './safety-accident.component.html',
  styleUrls: ['./safety-accident.component.scss'],
})
export class SafetyAccidentComponent implements OnInit, OnDestroy {
  @Input() inputData: any;
  public tableOptions: TableOptions;
  private tableSubject: BehaviorSubject<TableSubject> = new BehaviorSubject(null);
  public safetyColumns: TableColumnDefinition[] = [];
  public extendedColumns: TableColumnDefinition[] = [];
  public loadingItems = true;
  public selectedTab = 'active';
  private destroy$: Subject<void> = new Subject<void>();

  public safetyData = [];
  public safetyDataReportable = [];
  public safetyDataNonReportable = [];
  accidentYears: number[] = [];

  constructor(
    private toastr: ToastrService,
    private shared: SharedService,
    private changeRef: ChangeDetectorRef,
    private safetyService: SafetyService,
    private customModalService: CustomModalService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    /* For New Accident subscriptions */
    this.safetyService.createNewAccident.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.getAccidentData();
    });

    /* For delete subscriptions */
    this.shared.emitDeleteAction.pipe(takeUntil(this.destroy$)).subscribe((resp: any) => {
      if (resp.data.id) {
        this.onDeleteAccident(resp.data.id);
        setTimeout(() => {
          this.toastr.success('Successfully deleted accident.');
          this.getAccidentData();
        }, 200);
      }
    });

    /* For update subscriptions */
    this.safetyService.updatedAccidentSubject.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.getAccidentData();
    });

    this.initTableOptions();
    this.getAccidentData();
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
        showDateFilter: true,
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
          name: 'edit-accident',
        },
      ],
      deleteAction: {
        title: 'Delete',
        name: 'delete',
        type: 'safety',
        text: 'Are you sure you want to delete accident?',
      },
    };
    this.changeRef.detectChanges();
  }

  getAccidentData() {
    const accidents$ = this.safetyService.getAccidentList();
    forkJoin([accidents$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ([accidents]: [any]) => {
          this.safetyData = accidents.data.map((accident) => {
            if (accident.towing !== '') {
              accident.towing = accident.towing === 1 ? 'Yes' : 'No';
            }

            if (accident.hm !== '') {
              accident.hm = accident.hm === 1 ? 'Yes' : 'No';
            }
            if (accident.eventDate) {
              accident.eventDate = accident.eventDate ? dateFormat(accident.eventDate) : '';
            }
            if (accident.fatality === 0) {
              accident.fatality = '0';
            }
            if (accident.injuries === 0) {
              accident.injuries = '0';
            }
            if (accident.eventDate) {
              const year = moment(accident.eventDate).year();

              if (this.accidentYears.indexOf(year) === -1) {
                this.accidentYears.push(year);
              }
            }
            if (accident.report === null) {
              accident.report = 'Non-Reportable';
            }
            return accident;
          });
          this.safetyDataReportable = this.safetyData.filter((item) => {
            if (item.report !== 'Non-Reportable') {
              return item;
            }
          });
          this.safetyDataNonReportable = this.safetyData.filter((item) => {
            if (item.report === 'Non-Reportable') {
              return item;
            }
          });
          this.sendSafetyData();
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  private getGridColumns(stateName: string, resetColumns: boolean): TableColumnDefinition[] {
    const userState: UserState = JSON.parse(
      localStorage.getItem(stateName + '_user_columns_state')
    );
    if (userState && userState.columns.length && !resetColumns) {
      return userState.columns;
    } else {
      return getAccidentColumns();
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
      return getExtendedAccidentColumns();
    }
  }

  private sendSafetyData(resetColumns?: boolean): void {
    const data: TableData[] = [
      {
        title: 'Accident',
        field: 'accident',
        data: this.safetyData,
        extended: false,
        filterYears: this.accidentYears,
        gridNameTitle: 'Accident',
        stateName: 'accidents',
        gridColumns: this.getGridColumns('accidents', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('accidents', resetColumns),
      },
      {
        title: 'Reportable',
        field: 'active',
        data: this.safetyDataReportable,
        extended: false,
        filterYears: this.accidentYears,
        gridNameTitle: 'Accident',
        stateName: 'accidents',
        gridColumns: this.getGridColumns('accidents', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('accidents', resetColumns),
      },
      {
        title: 'Non-Reportable',
        field: 'non-reportable',
        data: this.safetyDataNonReportable,
        extended: false,
        filterYears: this.accidentYears,
        gridNameTitle: 'Accident',
        stateName: 'accidents_non-reportable',
        gridColumns: this.getGridColumns('accidents', resetColumns),
        extendedGridColumns: this.getExtendedGridColumns('accidents', resetColumns),
      },
    ];
    this.tableSubject.next({ tableData: data, check: true });
  }

  public callAction(action: any): void {
    if (action.type === 'import-event') {
      this.callImport();
    } else if (action.type === 'insert-event') {
      this.onAddAccident();
    } else if (action.type === 'init-columns-event') {
      this.sendSafetyData(true);
    } else if (action.type === 'edit-accident') {
      this.editAccident(action.id);
    } else if (action.type === 'delete') {
      this.onDeleteAccident(action.id);
    } else if (action.type === 'save-note-event') {
      this.onSaveNote(action);
    }
  }

  public onAddAccident() {
    const data = {
      type: 'new',
      id: null,
    };
    this.customModalService.openModal(AccidentManageComponent, { data }, null, { size: 'small' });
  }

  public editAccident(id: number) {
    const data = {
      type: 'edit',
      id,
      accident: this.safetyData,
    };
    this.customModalService.openModal(AccidentManageComponent, { data }, null, { size: 'small' });
  }

  public callImport(): void {}

  onSaveNote(note: any) {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.safetyData.length; i++) {
      if (this.safetyData[i].id === note.id) {
        this.safetyData[i].note = note.value;
        this.safetyService
          .updateAccident(
            {
              note: this.safetyData[i].note,
            },
            this.safetyData[i].id
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
  onDeleteAccident(accidentId: number) {
    this.safetyService
      .deleteAccident(accidentId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          for (let i = 0; i < this.safetyData.length; i++) {
            if (this.safetyData[i].id === accidentId) {
              this.safetyData.splice(i, 1);
            }
          }
          this.sendSafetyData();
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  /* Multiple Delete */
  public callDelete(accidentDelete: DeletedItem[]): void {
    for (const accident of accidentDelete) {
      this.onDeleteAccident(accident.id);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
