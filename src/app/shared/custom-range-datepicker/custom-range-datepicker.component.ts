import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { addDays, addWeeks } from '@fullcalendar/core';
import { DateRangePopupComponent, DateRangeService } from '@progress/kendo-angular-dateinputs';
import {
  addMonths,
  Day,
  firstDayOfMonth,
  lastDayOfMonth,
  nextDayOfWeek,
  prevDayOfWeek,
} from '@progress/kendo-date-math';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-custom-range-datepicker',
  templateUrl: './custom-range-datepicker.component.html',
  styleUrls: ['./custom-range-datepicker.component.scss'],
  providers: [DatePipe, DateRangeService],
})
export class CustomRangeDatepickerComponent implements OnInit, OnDestroy, AfterViewInit {
  /* Output to parent */
  @Output() dateParameters = new EventEmitter<any>();
  /* Inital range */
  public range = {
    start: new Date(),
    end: new Date(),
  };
  /* Current datepicker view */
  activeView = 'month';
  bottomView = 'month';
  /* Initial Date */
  public today = new Date();
  public selectedDate = new Date();
  /* Params */
  params = {
    dateFrom: '',
    dateTo: '',
  };
  /* Datepicker Options */
  datepickerOptions = [
    {
      name: 'Daily',
      type: 'day',
      active: true,
    },
    {
      name: 'Weekly',
      type: 'week',
      active: false,
    },
    {
      name: 'Monthly',
      type: 'month',
      active: false,
    },
    {
      name: 'Quarterly',
      type: 'quarter',
      active: false,
    },
  ];
  /* Sub */
  private destroy$: Subject<void> = new Subject<void>();
  /* All Time option */
  allTimeView = true;

  /* Get datepicker elements */
  @ViewChild('dateRangeAnchor') dateRangeAnchor: ElementRef;
  @ViewChild('dateChangeNext') dateChangeNext: ElementRef;
  @ViewChild('dateChangePrev') dateChangePrev: ElementRef;
  @ViewChild('dateRangePopup') dateRangePopup: DateRangePopupComponent;
  constructor(private dateRangeService: DateRangeService, public datepipe: DatePipe) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.dateRangePopup.close
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => event.preventDefault());
  }

  /* Destroy Subs */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /* Calendar Event Prev & Next, handle add and subtract events of days, weeks, months*/
  public handleCalendarArrowsClick(direction: boolean) {
    this.dateRangeService.setFocusedDate(this.selectedDate);
    if (!this.allTimeView) {
      const value = direction ? -1 : 1;
      if (this.datepickerOptions[0].active) {
        this.selectedDate = addDays(this.selectedDate, value);
      } else if (this.datepickerOptions[1].active) {
        this.selectedDate = addWeeks(this.selectedDate, value);
      } else if (this.datepickerOptions[2].active) {
        this.selectedDate = addMonths(this.selectedDate, value);
      } else if (this.datepickerOptions[3].active) {
        this.selectedDate = addMonths(this.selectedDate, value * 3);
      }
      this.onChange(this.selectedDate);
    }
  }

  /* Filter Dates and switch datepicker views*/
  filterDates(type, i) {
    this.datepickerOptions.forEach((element) => {
      element.active = false;
    });
    this.datepickerOptions[i].active = true;
    switch (type) {
      case 'all':
        this.bottomView = 'month';
        this.activeView = 'month';
        this.applyDateFilters(false);
        break;
      case 'day':
      case 'week':
        this.bottomView = 'month';
        this.activeView = 'month';
        this.onChange(this.selectedDate);
        break;
      case 'month':
      case 'quarter':
        this.bottomView = 'year';
        this.activeView = 'year';
        this.onChange(this.selectedDate);
        break;
      default:
        break;
    }
  }

  /* Handle week range selection */
  public handleSelectionRangeWeek(date): void {
    const firstWeekDay = prevDayOfWeek(date, Day.Sunday);
    const lastWeekDay = nextDayOfWeek(firstWeekDay, Day.Saturday);

    this.range = { start: firstWeekDay, end: lastWeekDay };
    this.applyDateFilters(true);
  }

  /* Handle quarter range selection */
  public handleSelectionRangeQuarter(date): void {
    const previousMonth = addMonths(date, -1);
    const nextMonth = addMonths(previousMonth, 2);
    const firstDay = firstDayOfMonth(previousMonth);
    const lastDay = lastDayOfMonth(nextMonth);
    this.range = { start: firstDay, end: lastDay };
    this.applyDateFilters(true);
  }

  /* Method for handleing range and single date selection */
  onChange(eventDate) {
    this.allTimeView = false;
    this.selectedDate = eventDate;
    this.range = { start: this.selectedDate, end: this.selectedDate };
    if (this.datepickerOptions[3].active) {
      this.handleSelectionRangeQuarter(eventDate);
    } else if (this.datepickerOptions[1].active) {
      this.handleSelectionRangeWeek(eventDate);
    } else {
      this.applyDateFilters(true);
    }
  }

  /* Watch for events around datepicker */
  @HostListener('document:click', ['$event']) documentClick(event: any): void {
    if (
      this.dateRangePopup &&
      this.dateRangePopup.show &&
      !this.dateRangeAnchor.nativeElement.contains(event.target) &&
      !this.dateRangePopup.popupRef.popupElement.contains(event.target) &&
      !this.dateChangeNext.nativeElement.contains(event.target) &&
      !this.dateChangePrev.nativeElement.contains(event.target)
    ) {
      this.dateRangePopup.toggle(false);
      this.dateRangeService.setFocusedDate(this.selectedDate);
    }
  }

  /* Apply date filters with everything prepared for an API request */
  applyDateFilters(bool: boolean) {
    let format = '';
    let singleDate = '';
    let startDate = '';
    let endDate = '';
    if (bool) {
      /* Send formated values to backend for filtered data */
      if (this.datepickerOptions[0].active) {
        format = 'MM/dd/yyyy';
        singleDate = this.formatDateForBackend(this.selectedDate, format);
        this.getFilteredData(singleDate);
      } else if (this.datepickerOptions[1].active) {
        format = 'MM/dd/yyyy';
        startDate = this.formatDateForBackend(this.range.start, format);
        endDate = this.formatDateForBackend(this.range.end, format);
        this.getFilteredData(startDate, endDate);
      } else if (this.datepickerOptions[2].active) {
        format = 'MM/yyyy';
        singleDate = this.formatDateForBackend(this.selectedDate, format);
        this.getFilteredData(singleDate);
      } else if (this.datepickerOptions[3].active) {
        format = 'MM/dd/yyyy';
        startDate = this.formatDateForBackend(this.range.start, format);
        endDate = this.formatDateForBackend(this.range.end, format);
        this.getFilteredData(startDate, endDate);
      }
    } else {
      /* Get initial values from backend for "All Time" */
      this.allTimeView = true;
      this.dateRangePopup.toggle(false);
      this.dateRangeService.setFocusedDate(this.today);
      this.selectedDate = this.today;
      this.params.dateFrom = '';
      this.params.dateTo = '';
      this.dateParameters.emit(this.params);
    }
  }

  /* Format custom dates for backend */
  formatDateForBackend(date, format) {
    return this.datepipe.transform(date, format);
  }

  /* Get Filtered Data from backend */
  getFilteredData(date, endDate?) {
    this.params.dateFrom = date;
    this.params.dateTo = endDate ? endDate : '';
    this.dateParameters.emit(this.params);
  }
}
