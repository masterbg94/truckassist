import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification-service.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { ContactAccountService } from '../../core/services/contactaccount.service';
import {
  CreateEventScheduler,
  EventSchedulerRepeater,
  ShedulerRepeater,
  ShedulerRuleModel,
} from 'src/app/core/model/events';
import moment from 'moment';
import { animate, style, transition, trigger } from '@angular/animations';
import { SchedulerService } from '../../core/services/scheduler.service';
import { DatePipe } from '@angular/common';
import { AnyNaptrRecord } from 'dns';
import { RRule, RRuleSet, rrulestr } from 'rrule';

import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-accounts-manage',
  templateUrl: './calendar-manage.component.html',
  styleUrls: ['./calendar-manage.component.scss'],
  providers: [DatePipe],
  animations: [trigger('fuelAnimation', [
    transition(':enter', [
      style({ height: 100 }),
      animate('100ms', style({ height: '*' })),
      ]),
      transition(':leave', [
        animate('100ms', style({ height: 0 })),
      ]),
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarManageComponent implements AfterContentInit {
  @ViewChild('note') note: ElementRef;
  @Input() inputData: any;
  public modalTitle: string;
  public eventModel: CreateEventScheduler = new CreateEventScheduler();
  public eventRepeater: any;
  public ruleModel: ShedulerRuleModel;
  public endPeriod: ShedulerRepeater[];
  public weeklyPeriod: ShedulerRepeater[];
  public monthsPerYear: ShedulerRepeater[];
  public monthlyRadioFields: ShedulerRepeater[];
  public monthlyPeriodOccurences: ShedulerRepeater[];
  public yearlyRadioFields: ShedulerRepeater[];
  public eventType: ShedulerRepeater[];
  public remindMe: any;
  public calendarForm: any;
  public isUpdateEvent = false;
  public isRepeatingEvent = false;
  public monthlySwitcher = 'Day';
  public yearlySwitcher = 'Day of Month';
  format: FormatSettings = environment.dateFormat;
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private shared: SharedService,
    private spinner: SpinnerService,
    private notification: NotificationService,
    private contactAccountService: ContactAccountService,
    private schedulerService: SchedulerService,
    public datepipe: DatePipe
  ) {
    this.createForm();
  }

  // START OF NEW CALENDAR LOGIC
  ngAfterContentInit(): void {
    this.modalTitle = this.inputData.data.type == 'edit' ? 'Edit Event' : 'Add New Event';
    this.initCalendarModalData();
    this.createForm();
    if (this.inputData.data.type == 'edit') {
      this.schedulerService.getEventById(this.inputData.data.id).subscribe((res: CreateEventScheduler) => {
        this.eventModel = res;
        this.calendarForm.patchValue({
          title: res.title,
          startDate: new Date(res.startDate),
          endDate: new Date(res.endDate),
          allDay: res.isAllDay == 1 ? true : false,
          description: res.description
        });

        if ( res.doc.rrule ) {
          this.getRrule.setValue(RRule.fromString(res.doc.rrule));
          if ( this.docRule.bysetpos ) {
            const bysetposfind = this.monthlyPeriodOccurences.find(item => item.options == this.docRule.bysetpos);
            this.calendarForm.get('selectOccurence').setValue(bysetposfind.name);
          }

          if ( this.docRule.bymonth ) {
            const bymonthfind = this.monthsPerYear.find(item => item.options == this.docRule.bymonth);
            this.calendarForm.get('monthPerYear').setValue(bymonthfind.shortName);
          }

          if ( this.docRule.byweekday ) {
            const byweekdayfind = this.weeklyPeriod.find(item => item.options.weekday == this.docRule.byweekday[0].weekday);
            this.calendarForm.get('yearlyDayPerMonth').setValue(byweekdayfind.name);
            this.calendarForm.get('dayPerMonth').setValue(byweekdayfind.name);
          }

          if ( this.docRule.freq ) {
            this.eventRepeater.forEach((element, index) => {
              this.eventRepeater[index].checked = false;
              if (element.id == this.docRule.freq ) { this.eventRepeater[index].checked = true; }
            });
          }

          if ( this.docRule.until ) {
            this.calendarForm.get('endPeriodOccurence').setValue('Until');
            this.calendarForm.get('endInputDate').setValidators(Validators.required);
          } else if ( this.docRule.count ) {
            this.calendarForm.get('endPeriodOccurence').setValue('No of Times');
            this.calendarForm.get('endInputDate').clearValidators();
            this.calendarForm.get('endInputDate').updateValueAndValidity();
          } else if ( !this.docRule.count && !this.docRule.until ) {
            this.calendarForm.get('endPeriodOccurence').setValue('Forever');
            this.calendarForm.get('endInputDate').clearValidators();
            this.calendarForm.get('endInputDate').updateValueAndValidity();
          }

          this.calendarForm.get('endInputDate').setValue(this.docRule.until);
        }
      });

      this.isUpdateEvent = true;
    } else if (this.inputData.data.event) {
      console.log(this.inputData.data.event);
      this.calendarForm.get('startDate').setValue(new Date(this.inputData.data.event.start));
      if (this.inputData.data.event.end) {
        this.calendarForm.get('endDate').setValue(new Date(this.inputData.data.event.end));
      }
      this.calendarForm.get('allDay').setValue(this.inputData.data.event.allDay);
      // this.eventModel["isAllDay"] = this.inputData.data.event.allDay ? 1 : 0;
      // this.eventModel["allDay"] = this.inputData.data.event.allDay;
      this.calendarForm.get('endInputDate').clearValidators();
      this.calendarForm.get('endInputDate').updateValueAndValidity();
    }
  }
  public changeCount(type: string, isIncrement: boolean) {
    if (isIncrement) {
      this.docRule[type] =
        type === 'interval' || type === 'count'
          ? Number(this.docRule[type]) + 1
          : Number(this.docRule[type]) < 31
          ? Number(this.docRule[type]) + 1
          : Number(this.docRule[type]) + 0;
    } else {
      this.docRule[type] =
        Number(this.docRule[type]) > 1
          ? Number(this.docRule[type]) - 1
          : Number(this.docRule[type]) - 0;
    }
  }

  public setEndPeriod() {
    if (this.calendarForm.controls.endPeriodOccurence.value === 'Until') {
      this.docRule.until = '';
      this.calendarForm.get('endInputDate').setValidators(Validators.required);
    } else if (this.calendarForm.controls.endPeriodOccurence.value === 'No of Times') {
      this.docRule.count = '1';
      delete this.docRule.until;
      this.calendarForm.get('endInputDate').clearValidators();
      this.calendarForm.get('endInputDate').updateValueAndValidity();
    } else {
      delete this.docRule.count;
      delete this.docRule.until;
      this.calendarForm.get('endInputDate').clearValidators();
      this.calendarForm.get('endInputDate').updateValueAndValidity();
    }
    this.checkClassForOccurence();
  }

  public setYearlyField(field: ShedulerRepeater, periods: any) {
    if ( field.name == 'Every' ) {
      delete this.docRule.bymonthday;
      this.docRule.bysetpos = this.monthlyPeriodOccurences[0].options;
    } else {
      delete this.docRule.bysetpos;
      this.docRule.bymonth = '';
      this.docRule.bymonthday = 1;
      this.docRule.byweekday = '';
    }
  }

  public setRuleData(item: any, isDayOccurence: boolean, isDay: boolean, isMonth: boolean) {
    if (isMonth) {
      this.docRule.bymonth = item.options;
    }
    if (isDayOccurence) {
      this.docRule.bysetpos = item.options;
    }
    if (isDay) {
      this.docRule.byweekday = item.options;
    }
  }

  public setMonthlyField(field: ShedulerRepeater, periods: any) {
    periods.forEach((itm: any) => {
      itm.selected = false;
    });
    field.selected = true;
    this.monthlySwitcher = field.name;
    if ( this.monthlySwitcher == 'Day' ) {
      this.docRule.bymonthday = 1;
      delete this.docRule.byweekday;
      delete this.docRule.bysetpos;
    } else {
      delete this.docRule.bymonthday;
      this.docRule.byweekday = '';
      this.docRule.bysetpos = this.monthlyPeriodOccurences[0].options;
    }
  }

  public setMonthlyOccurence(type: any, isOccurence: boolean) {
      if (isOccurence) {
        this.docRule.bysetpos = type ? type.options : '';
      } else {
        this.docRule.byweekday = type ? type.options : '';
      }
  }


  public changeRepeater(item: any) {
    const selectedRepeater = item.filter((itm: any) => itm.checked)[0];
    this.docRule.freq = selectedRepeater.id;
    if ( selectedRepeater.id == RRule.WEEKLY ) {
      this.docRule.byweekday = [];

      delete this.docRule.bymonth;
      delete this.docRule.bysetpos;
    } else if ( selectedRepeater.id == RRule.YEARLY ) {
      this.docRule.bymonth = '';
      this.docRule.bymonthday = 1;
      delete this.docRule.bysetpos;
    } else if ( selectedRepeater.id == RRule.MONTHLY ) {
      this.docRule.bymonthday = 1;
      delete this.docRule.bysetpos;
      delete this.docRule.bymonth;
    }

    this.calendarForm.get('selectOccurence').setValue('First');
    this.calendarForm.get('dayPerMonth').setValue(null);
  }

  public onChange(isAllDay: any) {
    this.calendarForm.get('allDay').setValue(false);
    // this.eventModel.allDay = !isAllDay;
  }

  public checkRepeatingEvent(isRepeating: any) {
      this.isRepeatingEvent = !isRepeating;
      if ( this.isRepeatingEvent ) {
        this.calendarForm.get('doc').patchValue({
          rrule: new RRule({
            freq: RRule.DAILY,
            interval: 1
          })
      });
        this.calendarForm.get('endInputDate').setValidators(Validators.required);
        this.calendarForm.get('startDate').clearValidators();
        this.calendarForm.get('endDate').clearValidators();
    } else {
      this.calendarForm.get('doc').patchValue({
        rrule: null
      });

      this.calendarForm.get('startDate').setValidators(Validators.required);
      this.calendarForm.get('endDate').setValidators(Validators.required);
      this.calendarForm.get('endInputDate').clearValidators();
    }

      this.calendarForm.get('endInputDate').updateValueAndValidity();
      this.calendarForm.get('startDate').updateValueAndValidity();
      this.calendarForm.get('endDate').updateValueAndValidity();
  }

  public setSelected(day: ShedulerRepeater) {
    const findedDay = this.docRule.byweekday.find(item => item.weekday == day.options.weekday);
    if ( findedDay ) {
      this.docRule.byweekday = this.docRule.byweekday.filter(item => item.weekday != day.options.weekday);
    } else {
      this.docRule.byweekday.push(day.options);
    }
  }

  public createForm() {
    this.calendarForm = this.formBuilder.group({
      title: [null, Validators.required],
      startDate: [null, Validators.required],
      startTime: [null],
      endDate: [null, Validators.required],
      endTime: [null],
      allDay: true,
      description: [null],
      dailyNumber: [null],
      endNumber: [{ value: null, disabled: false }],
      endInputDate: [null],
      selectOccurence: 'First',
      dayPerMonth: [null],
      monthlyDayNumber: [null],
      yearlyDayNumber: [null],
      yearlyDayPerMonth: [null],
      monthPerYear: [null],
      yearlySelectedOption: null,
      eventType: null,
      endPeriodOccurence: ['Until'],
      count: [],
      doc: this.formBuilder.group({
        rrule: null
      }),
    });
  }

  public closeEventModal() {
    localStorage.setItem('modalOpened', null);
    this.activeModal.close();
  }

  get getRrule() {
    return (this.calendarForm.get('doc') as FormGroup).get('rrule');
  }

  public get docRule() {
    return (this.calendarForm.get('doc') as FormGroup).get('rrule').value.origOptions;
  }

  public updateCurrentEvent() {
    this.saveEvent();
  }

  public saveEvent() {
    if (this.calendarForm.invalid) {
      if (!this.shared.markInvalid(this.calendarForm)) {
        return false;
      }
      return;
    }
    const data = this.generateEventData();
    const loadForm = this.calendarForm.getRawValue();
    this.spinner.show(true);
    if (this.inputData.data.type == 'edit') {
      this.schedulerService.updateEvent(this.inputData.data.id, data).subscribe(
        (response: any) => {
          this.schedulerService.emitEventUpdate.emit(true);
          localStorage.setItem('modalOpened', null);
          this.activeModal.close();
        },
        (error: any) => {
          this.shared.handleServerError();
        }
      );
    } else {
      this.schedulerService.createEvent(data).subscribe(
        (response: any) => {
          this.schedulerService.emitEventUpdate.emit(true);
          this.activeModal.close();
          localStorage.setItem('modalOpened', null);
        },
        (error: any) => {
          this.shared.handleServerError();
        }
      );
    }
  }

  private generateEventData() {
    // console.log(this.calendarForm);
    // console.log("ddd");
    // console.log(this.calendarForm.controls.startDate.value.toISOString());
    // console.log(moment(new Date(this.calendarForm.controls.startDate.value.toISOString())).format());

    const rrule = (this.calendarForm.get('doc') as FormGroup).get('rrule').value;
    if ( rrule ) {
        const dDate = this.calendarForm.controls.startDate.value;
        if ( dDate ) { this.docRule.dtstart = moment(new Date(this.calendarForm.controls.startDate.value.toISOString())).format().slice(0, 16); } else { this.docRule.dtstart = moment(new Date()).format().slice(0, 16); }
      }
    return {
      dataItem: this.calendarForm.controls.title.value,
      description: this.calendarForm.controls.description.value,
      doc: {
        rrule: rrule ? (this.calendarForm.get('doc') as FormGroup).get('rrule').value.toString() : rrule,
        // groupIdForOccurence: !this.inputData.data.isEditSingle ? this.eventModel.id : 0,
      },
      title: this.calendarForm.controls.title.value,
      startDate: !rrule ? moment(new Date(this.calendarForm.controls.startDate.value.toISOString())).format().slice(0, 16) : new Date(),
      endDate: !rrule ? moment(new Date(this.calendarForm.controls.endDate.value.toISOString())).format().slice(0, 16) : new Date(),
      endTimezone: 'GMT+0200',
      startTimezone: 'GMT+0200',
      recurrenceExceptions: '',
      recurrenceId: 2,
      recurrenceRule: '',
      isAllDay: this.calendarForm.controls.allDay.value === true ? 1 : 0,
      meta: [
        {
          Domain: 'test',
          Key: 'test',
          Value: 'test',
        },
      ],
    };
  }

  public checkClassForOccurence() {
    if (this.calendarForm.controls.endPeriodOccurence.value === 'Forever') {
      return 'eventModalForever';
    } else if (this.calendarForm.controls.endPeriodOccurence.value === 'No of Times') {
      return 'eventModalNumberOfTimes';
    } else if (this.calendarForm.controls.endPeriodOccurence.value === 'Until') {
      return 'eventModalEndOccurence';
    } else {
      this.calendarForm.controls.endPeriodOccurence.value = 'Forever';
      return 'eventModalForever';
    }
  }

  public get rrRules() {
    return RRule;
  }

  private initCalendarModalData() {
    this.endPeriod = [
      // Until -> After
      {
        selected: false,
        name: 'Until',
        options: '',
      },
      // No of Times -> On
      {
        selected: false,
        name: 'No of Times',
        options: '',
      },
      {
        selected: true,
        name: 'Forever',
        options: '',
      },
    ];

    this.weeklyPeriod = [
      {
        name: 'Sun',
        fullName: 'Sunday',
        selected: false,
        options: RRule.SU,
      },
      {
        name: 'Mon',
        fullName: 'Monday',
        selected: false,
        options: RRule.MO,
      },
      {
        name: 'Tue',
        fullName: 'Tuesday',
        selected: false,
        options: RRule.TU,
      },
      {
        name: 'Wed',
        fullName: 'Wednesday',
        selected: false,
        options: RRule.WE,
      },
      {
        name: 'Thu',
        fullName: 'Thursday',
        selected: false,
        options: RRule.TH,
      },
      {
        name: 'Fri',
        fullName: 'Friday',
        selected: false,
        options: RRule.FR,
      },
      {
        name: 'Sat',
        fullName: 'Saturday',
        selected: false,
        options: RRule.SA,
      },
    ];

    this.monthlyRadioFields = [
      {
        name: 'Day',
        selected: true,
      },
      {
        name: 'Every',
        selected: false,
      },
    ];

    this.monthlyPeriodOccurences = [
      {
        name: 'First',
        selected: true,
        options: '1',
      },
      {
        name: 'Second',
        selected: false,
        options: '2',
      },
      {
        name: 'Third',
        selected: false,
        options: '3',
      },
      {
        name: 'Fourth',
        selected: false,
        options: '4',
      },
      {
        name: 'Last',
        selected: false,
        options: '-1',
      },
    ];

    this.monthsPerYear = [
      {
        name: 'January',
        shortName: 'Jan',
        selected: false,
        options: '1',
      },
      {
        name: 'February',
        selected: false,
        shortName: 'Feb',
        options: '2',
      },
      {
        name: 'March',
        shortName: 'Mar',
        selected: false,
        options: '3',
      },
      {
        name: 'April',
        shortName: 'Apr',
        selected: false,
        options: '4',
      },
      {
        name: 'May',
        shortName: 'May',
        selected: false,
        options: '5',
      },
      {
        name: 'June',
        shortName: 'June',
        selected: false,
        options: '6',
      },
      {
        name: 'July',
        shortName: 'July',
        selected: false,
        options: '7',
      },
      {
        name: 'August',
        shortName: 'Aug',
        selected: false,
        options: '8',
      },
      {
        name: 'September',
        shortName: 'Sept',
        selected: false,
        options: '9',
      },
      {
        name: 'October',
        shortName: 'Oct',
        selected: false,
        options: '10',
      },
      {
        name: 'November',
        shortName: 'Nov',
        selected: false,
        options: '11',
      },
      {
        name: 'December',
        shortName: 'Dec',
        selected: false,
        options: '12',
      },
    ];

    this.yearlyRadioFields = [
      {
        // MonthDayOccurance -> Day of Month
        name: 'Day of Month',
        selected: true,
        yearlyFieldDisable: 1,
      },
      {
        // MonthOccurance -> Every
        name: 'Every',
        selected: false,
        yearlyFieldDisable: 2,
      },
    ];

    this.eventRepeater = [
      {
        id: RRule.DAILY,
        name: 'Days',
        checked: true,
      },
      {
        id: RRule.WEEKLY,
        name: 'Weeks',
        checked: false,
      },
      {
        id: RRule.MONTHLY,
        name: 'Months',
        checked: false,
      },
      {
        id: RRule.YEARLY,
        name: 'Years',
        checked: false,
        yearlyDay: '1',
      },
    ];
    this.eventType = [
      {
        name: 'Event Type',
        selected: true,
      },
      {
        name: 'Event Type 1',
        selected: false,
      },
      {
        name: 'Event Type 2',
        selected: false,
      },
    ];


    this.remindMe = [
      {
        name: 'Remind Me',
        selected: true,
      }
    ];
  }
}
