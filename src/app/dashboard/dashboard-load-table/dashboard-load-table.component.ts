import { takeUntil } from 'rxjs/operators';
import { AppLoadService } from 'src/app/core/services/app-load.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ClonerService } from 'src/app/core/services/cloner-service';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import {
  TableColumnDefinition,
  TableOptions,
} from 'src/app/shared/truckassist-table/models/truckassist-table';
import { dateFormat, numberWithCommas } from 'src/app/core/helpers/formating';
import { forkJoin, Subject } from 'rxjs';
import { LoadTabledata } from 'src/app/core/model/load';
@Component({
  selector: 'app-dashboard-load-table',
  templateUrl: './dashboard-load-table.component.html',
  styleUrls: ['./dashboard-load-table.component.scss']
})
export class DashboardLoadTableComponent implements OnInit, OnDestroy {

  public selectedTab = 'active';
  public tableOptions: TableOptions;
  public customerTable = '';
  public customerColumns: TableColumnDefinition[] = [];
  public pendingLoadsData: LoadTabledata[] = [];
  public activeLoadsData: LoadTabledata[] = [];
  public closedLoadsData: LoadTabledata[] = [];
  public allLoadsData: LoadTabledata[] = [];
  public loadingItems = true;
  public totalDashData: any = {
    pendingLoadsData: [],
    activeLoadsData: [],
    closedLoadsData: []
  };

  public selectedLoadData = 'activeLoadsData';

  public allLoads: LoadTabledata[] = [];
  private destroy$: Subject<void> = new Subject<void>();
  constructor(private changeRef: ChangeDetectorRef,
              private loadService: AppLoadService,
              private clonerService: ClonerService,
              private shared: SharedService
              ) { }

  ngOnInit(): void {
    this.getLoadData();
  }

  openDashLoads(mod): void {
    this.selectedLoadData = mod;
  }

  getLoadData() {
    const load$ = this.loadService.getLoadData();
      forkJoin([load$])
        .pipe(takeUntil(this.destroy$))
        .subscribe(
        ([load]: [any]) => {
          const allLoads = load.allLoads ? load.allLoads : [];
          this.allLoads = this.clonerService.deepClone<LoadTabledata[]>(allLoads);
          const pendingLoads = load.pendingLoads ? load.pendingLoads : [];
          this.totalDashData.pendingLoadsData = pendingLoads.map((load) => {
            if (load && load.mileage) {
              load.mileage = load.mileage ? numberWithCommas(load.mileage, false) : '';
              load.pickupDateTime = load.pickupDateTime ? dateFormat(load.pickupDateTime) : '';
              load.deliveryDateTime = load.deliveryDateTime
                ? dateFormat(load.deliveryDateTime)
                : '';
              load.total = load.total ? '$' + numberWithCommas(load.total, false) : load.total;
              load.stops = load.deliveryCount + load.pickupCount;
            }
            return load;
          });
          const activeLoads = load.activeLoads ? load.activeLoads : [];
          this.totalDashData.activeLoadsData = activeLoads.map((load) => {
            if (load && load.mileage) {
              load.mileage = load.mileage ? numberWithCommas(load.mileage, false) : '';
              load.pickupDateTime = load.pickupDateTime ? dateFormat(load.pickupDateTime) : '';
              load.deliveryDateTime = load.deliveryDateTime
                ? dateFormat(load.deliveryDateTime)
                : '';
              load.total = load.total ? '$' + numberWithCommas(load.total, false) : load.total;
              load.stops = load.deliveryCount + load.pickupCount;
            }
            return load;
          });
          const closedLoads = load.closedLoads ? load.closedLoads : [];
          this.totalDashData.closedLoadsData = closedLoads.map((load) => {
            if (load && load.mileage) {
              load.mileage = load.mileage ? numberWithCommas(load.mileage, false) : '';
              load.pickupDateTime = load.pickupDateTime ? dateFormat(load.pickupDateTime) : '';
              load.deliveryDateTime = load.deliveryDateTime
                ? dateFormat(load.deliveryDateTime)
                : '';
              load.total = load.total ? '$' + numberWithCommas(load.total, false) : load.total;
              load.stops = load.deliveryCount + load.pickupCount;
            }
            return load;
          });
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
