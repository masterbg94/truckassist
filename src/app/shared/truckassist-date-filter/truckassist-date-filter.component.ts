import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  DateRangeComponent,
  DateRangeInput,
  DateRangePopupComponent,
  DateTimePickerComponent,
  SelectionRange,
  SelectionRangeEnd,
} from '@progress/kendo-angular-dateinputs';
import { DateRange } from '@progress/kendo-angular-scheduler';
import moment from 'moment';
import { title } from 'node:process';
import { enterLeave } from 'src/app/core/helpers/animations';
import { DateFilter, DateFilterGroup } from 'src/app/core/model/date-filter';
import { DateFilterService } from 'src/app/core/services/date-filter.service';

@Component({
  selector: 'app-truckassist-date-filter',
  templateUrl: './truckassist-date-filter.component.html',
  styleUrls: ['./truckassist-date-filter.component.scss'],
  animations: [enterLeave],
  providers: [NgbDropdownConfig],
})
export class TruckassistDateFilterComponent implements OnInit {
  @ViewChild('dateRange') public dateRange: DateRangeComponent;
  @ViewChild('actionDrop') actionDrop: any;
  @Input() loading: boolean;
  @Input() field: string;
  @Input() stateName: string;
  years: number[] = [];
  hovered = false;

  public activeRange: SelectionRangeEnd = 'end';
  public range = {
    start: new Date(2018, 10, 10),
    end: new Date(2018, 10, 20),
  };

  public dateFilter: DateFilter[] = [];
  public showDateRange = false;

  public dateFilterGroups: DateFilterGroup[] = [];

  constructor(private dateFilterService: DateFilterService, config: NgbDropdownConfig) {
    config.autoClose = false;
  }

  ngOnInit(): void {
    this.loadDateFilter();
  }

  private fillDateFilterGroupForMiles() {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    let curentMonth = new Date();

    let index = curentMonth.getMonth();

    this.dateFilterGroups = [
      {
        id: 1,
        value: [
          {
            hidden: false,
            title: 'Today',
            startDate: moment().toDate(),
            endDate: null,
          },
          {
            hidden: false,
            title: 'Yesterday',
            startDate: moment().subtract(1, 'days').toDate(),
            endDate: null,
          },
        ],
      },

      {
        id: 2,
        value: [
          {
            hidden: false,
            title: 'This week',
            startDate: moment().weekday(1).toDate(),
            endDate: moment().weekday(7).toDate(),
          },
          {
            hidden: false,
            title: 'Last week',
            startDate: moment().startOf('week').isoWeekday(1).toDate(),
            endDate: moment().startOf('week').isoWeekday(7).toDate(),
          },
          {
            hidden: false,
            title: '1 week',
            startDate: moment()
              .weekday(moment().day() - 7)
              .toDate(),
            endDate: moment().weekday(moment().day()).toDate(),
          },
        ],
      },
      {
        id: 3,
        value: [
          {
            hidden: false,
            title: 'This month',
            startDate: moment().clone().startOf('month').toDate(),
            endDate: moment().clone().endOf('month').toDate(),
          },
          {
            hidden: false,
            title: 'Last month',
            startDate: moment().subtract(1, 'months').startOf('month').toDate(),
            endDate: moment().subtract(1, 'months').endOf('month').toDate(),
          },
          {
            hidden: false,
            title: monthNames[index - 2],
            startDate: moment().subtract(60, 'days').toDate(),
            endDate: moment().toDate(),
          },
          {
            hidden: false,
            title: monthNames[index - 3],
            startDate: moment().subtract(90, 'days').toDate(),
            endDate: moment().toDate(),
          },
          {
            hidden: false,
            title: monthNames[index - 4],
            startDate: moment().subtract(120, 'days').toDate(),
            endDate: moment().toDate(),
          },
          {
            hidden: false,
            title: monthNames[index - 5],
            startDate: moment().subtract(150, 'days').toDate(),
            endDate: moment().toDate(),
          },
        ],
      },
    ];
  }

  private fillDateFilterGroup() {
    this.dateFilterGroups = [
      {
        id: 1,
        value: [
          {
            hidden: false,
            title: 'Today',
            startDate: moment().toDate(),
            endDate: null,
          },
          {
            hidden: false,
            title: 'Yesterday',
            startDate: moment().subtract(1, 'days').toDate(),
            endDate: null,
          },
        ],
      },

      {
        id: 2,
        value: [
          {
            hidden: false,
            title: 'This week',
            startDate: moment().weekday(1).toDate(),
            endDate: moment().weekday(7).toDate(),
          },
          {
            hidden: false,
            title: 'Last week',
            startDate: moment().startOf('week').isoWeekday(1).toDate(),
            endDate: moment().startOf('week').isoWeekday(7).toDate(),
          },
          {
            hidden: false,
            title: '1 week',
            startDate: moment()
              .weekday(moment().day() - 7)
              .toDate(),
            endDate: moment().weekday(moment().day()).toDate(),
          },
        ],
      },
      {
        id: 3,
        value: [
          {
            hidden: false,
            title: 'This month',
            startDate: moment().clone().startOf('month').toDate(),
            endDate: moment().clone().endOf('month').toDate(),
          },
          {
            hidden: false,
            title: 'Last month',
            startDate: moment().subtract(1, 'months').startOf('month').toDate(),
            endDate: moment().subtract(1, 'months').endOf('month').toDate(),
          },
          {
            hidden: false,
            title: '1 month',
            startDate: moment().subtract(30, 'days').toDate(),
            endDate: moment().toDate(),
          },
          {
            hidden: false,
            title: '3 months',
            startDate: moment().subtract(90, 'days').toDate(),
            endDate: moment().toDate(),
          },
        ],
      },
      {
        id: 4,
        value: [
          {
            hidden: false,
            title: 'This quarter',
            startDate: moment().startOf('quarter').toDate(),
            endDate: moment().endOf('quarter').toDate(),
          },
          {
            hidden: false,
            title: 'Last quarter',
            startDate: moment().subtract(1, 'quarter').startOf('quarter').toDate(),
            endDate: moment().subtract(1, 'quarter').endOf('quarter').toDate(),
          },
        ],
      },
      {
        id: 5,
        value: [
          {
            hidden: false,
            title: 'This year',
            startDate: moment().startOf('year').toDate(),
            endDate: moment().endOf('year').toDate(),
          },
          {
            hidden: false,
            title: '1 year',
            startDate: moment().subtract(365, 'days').toDate(),
            endDate: moment().toDate(),
          },
        ],
      },
    ];
  }

  private loadDateFilter(): void {
    const dateFilter = JSON.parse(localStorage.getItem(this.stateName + '_dateFilter'));
    this.dateFilter = dateFilter && dateFilter.length ? dateFilter : [];
  }

  private fillYears(): void {
    for (const year of this.years) {
      this.dateFilterGroups[this.dateFilterGroups.length - 1].value.push({
        hidden: false,
        title: year.toString(),
        startDate: moment([year]).startOf('year').toDate(),
        endDate: moment([year]).endOf('year').toDate(),
      });
    }
  }

  public reloadDateFilterGroups(years: number[]): void {
    this.years = years;
    if (this.stateName === 'miles') {
      this.fillDateFilterGroupForMiles();
    } else {
      this.fillDateFilterGroup();
    }
    this.fillYears();

    this.dateFilterGroups = this.dateFilterGroups.map((dfg) => {
      dfg.value.map((df) => {
        if (this.dateFilter.length && df.title === this.dateFilter[0].title) {
          df.hidden = true;
        } else {
          df.hidden = false;
        }
        return df;
      });
      return dfg;
    });
    // for (const dfg of this.dateFilterGroups) {
    //   for (const df of dfg.value) {
    //     if(this.dateFilter.length && df.field === this.dateFilter[0].field) {
    //       df.hidden = true;
    //     } else {
    //       df.hidden = false;
    //     }
    //   }
    // }
  }

  public setDateFilter(i: number, j: number) {
    if (this.dateFilter.length) {
      this.dateFilter[0] = this.dateFilterGroups[i].value[j];
    } else {
      this.dateFilter.push(this.dateFilterGroups[i].value[j]);
    }

    this.dateFilter[0].field = this.field;

    for (const dfg of this.dateFilterGroups) {
      for (const df of dfg.value) {
        df.hidden = false;
      }
    }
    this.dateFilterGroups[i].value[j].hidden = true;
    localStorage.setItem(this.stateName + '_dateFilter', JSON.stringify(this.dateFilter));
    this.dateFilterService.sendDataSource(this.dateFilter);
  }

  public onRemove(df: DateFilter) {
    for (const dfg of this.dateFilterGroups) {
      const index = dfg.value.findIndex((d) => d.title === df.title);
      if (index !== -1) {
        dfg.value[index].hidden = false;
      }
    }

    this.dateFilter = [];
    localStorage.setItem(this.stateName + '_dateFilter', JSON.stringify(this.dateFilter));
    this.dateFilterService.sendDataSource(this.dateFilter);
  }

  public handleSelectionRange(range: SelectionRange): void {
    this.dateFilter[0] = {
      hidden: false,
      title: range.start.toLocaleDateString() + ' - ' + range.end.toLocaleDateString(),
      startDate: moment(range.start).toDate(),
      endDate: moment(range.end).toDate(),
      field: this.field,
    };
    localStorage.setItem(this.stateName + '_dateFilter', JSON.stringify(this.dateFilter));
    this.dateFilterService.sendDataSource(this.dateFilter);
  }

  public switchToDateRange(event: any) {
    event.stopPropagation();
    this.showDateRange = true;
  }

  public openManualyDrop() {
    console.log(this.actionDrop);
    this.actionDrop.open();
  }
}
