import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TableData } from 'src/app/shared/truckassist-table/models/truckassist-table';
import { GridCompressionService } from '../core/services/grid-compression.service';
import { StatisticService } from '../core/services/statistic.service';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss'],
})
export class StatisticComponent implements OnInit, AfterViewChecked, OnDestroy {
  /* Tab properties */
  public loadingItems = false;
  public selectedTab: string;
  /* Data for chart switcher */
  chartTypeData: any;
  /* Predefined values for dropdown filters */
  selectedTime = 'all';
  selectedPeriod = 'day';

  /* Data for time dropdown filter */
  timeList: any = [
    {
      id: 1,
      name: 'All time',
      value: 'all',
    },
    {
      id: 2,
      name: 'Today',
      value: 'today',
    },
    {
      id: 3,
      name: 'WTD',
      value: 'wtd',
    },
    {
      id: 4,
      name: 'MTD',
      value: 'mtd',
    },
    {
      id: 5,
      name: 'YTD',
      value: 'ytd',
    },
    {
      id: 6,
      name: 'Custom',
      value: 'custom',
    },
  ];

  /* Data for period dropdown filter */
  perdioList: any = [
    {
      id: 1,
      name: 'Daily',
      value: 'day',
    },
    {
      id: 2,
      name: 'Weekly',
      value: 'week',
    },
    {
      id: 3,
      name: 'Monthly',
      value: 'month',
    },
    {
      id: 4,
      name: 'Quarterly',
      value: 'quarter',
    },
    {
      id: 5,
      name: 'Yearly',
      value: 'year',
    },
  ];

  // Data for tabs navigation in Statistics
  tableData: TableData[] = [
    {
      title: 'Load',
      field: 'load',
      data: [],
      extended: false,
      hideLength: true,
    },
    {
      title: 'Miles',
      field: 'miles',
      data: [],
      extended: false,
      hideLength: true,
    },
    {
      title: 'GPS Status',
      field: 'gps-status',
      data: [],
      extended: false,
      hideLength: true,
    },
    {
      title: 'Fuel',
      field: 'fuel',
      data: [],
      extended: false,
      hideLength: true,
    },
    {
      title: 'Repair',
      field: 'repair',
      data: [],
      extended: false,
      hideLength: true,
    },
    {
      title: 'Payroll',
      field: 'payroll',
      data: [],
      extended: false,
      hideLength: true,
    },
    {
      title: 'Invoice Ageing',
      field: 'invoice-ageing',
      data: [],
      extended: false,
      hideLength: true,
    },
    {
      title: 'Violation',
      field: 'violation',
      data: [],
      extended: false,
      hideLength: true,
    },
    {
      title: 'Accident',
      field: 'accident',
      data: [],
      extended: false,
      hideLength: true,
    },
  ];
  href;

  public expanded = false;
  private compressTouch = false;
  public showSubtitle = true;
  public subtitleProgress = 0;
  public subtitleInterval;

  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private router: Router,
    private service: StatisticService,
    private cd: ChangeDetectorRef,
    private gridCompressionService: GridCompressionService
  ) {}

  ngOnInit(): void {
    this.getChartTypeData();
    // Initial selected tab
    this.href = this.router.url;
    this.tableData.forEach((element) => {
      const cUrl = '/statistic/' + element.field;
      if (cUrl === this.href) {
        this.selectedTab = element.field;
      }
    });
  }

  getChartTypeData() {
    this.service
      .getChartTypeData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((typeData) => {
        this.chartTypeData = typeData;
      });
  }

  ngAfterViewChecked() {
    this.cd.detectChanges();
  }

  // Method for switching routes and tabs
  public switchTab(e) {
    this.selectedTab = e;
    this.router.navigate(['/statistic/' + e]);
    this.getChartTypeData();
  }

  /* Switch chart type and update service */
  switchType(e): void {
    const chartTypeData = e;
    chartTypeData.forEach((element) => {
      if (element.checked) {
        this.service.updateChartType(element.name);
      }
    });
  }

  public onCompress(): void {
    this.expanded = !this.expanded;
    this.compressTouch = true;
    this.cd.detectChanges();
    this.gridCompressionService.sendDataSource({ expanded: this.expanded, checked: true });
    if (this.expanded) {
      this.showSubtitle = true;
      this.subtitleProgress = 0;
      this.subtitleInterval = setInterval(() => {
        this.subtitleProgress++;
        if (this.subtitleProgress === 100) {
          this.showSubtitle = false;
          clearInterval();
        }
      }, 100);
    } else {
      if (this.subtitleInterval) {
        clearInterval(this.subtitleInterval);
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
