import { takeUntil } from 'rxjs/operators';
import { TruckassistDropdownComponent } from './../shared/truckassist-dropdown/truckassist-dropdown.component';
import { Component, EventEmitter, HostListener, OnInit, Output, ViewChild, Injector, ComponentFactoryResolver, ApplicationRef, ChangeDetectorRef } from '@angular/core';
import { CalendarOptions, EventSourceInput, greatestDurationDenominator } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
import timeGridPlugin from '@fullcalendar/timegrid';
import { SchedulerService } from '../core/services/scheduler.service';
import { CustomModalService } from '../core/services/custom-modal.service';
import { CalendarManageComponent } from '../calendar/calendar-manage/calendar-manage.component';
import { CreateEventScheduler, GetEventScheduler, Events } from '../core/model/events';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { SharedService } from '../core/services/shared.service';
import rrulePlugin from '@fullcalendar/rrule';
import { RRule, RRuleSet, rrulestr } from 'rrule';
import { CalendarActionsComponent } from './calendar-actions/calendar-actions.component';
import { DomSanitizer } from '@angular/platform-browser';

import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import { environment } from 'src/environments/environment';
import { SearchDataService } from '../core/services/search-data.service';
import { ChipsFilter, SearchFilter, SearchFilterEvent } from '../core/model/shared/searchFilter';
import { CompositeFilterDescriptor, FilterDescriptor, process } from '@progress/kendo-data-query';
@Component({
  selector: 'app-full-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [DatePipe],
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions;
  @Output() actionEvent: EventEmitter<any> = new EventEmitter();
  eventsModel: any;
  @ViewChild('fullcalendar') fullcalendar: FullCalendarComponent;
  public initModel: CreateEventScheduler[] = [];
  public getDataModel: GetEventScheduler[] = [];
  public events: any[] = [];
  private destroy$: Subject<void> = new Subject<void>();
  public viewList = [];
  public calendarTitle = '';
  public showDatePicker = false;
  public isCalledAddEvent = false;
  public selectedDate = null;
  public options = null;

  // public dots = null;
  format: FormatSettings = environment.dateFormat;

  // search
  public highlightingWords = [];

  constructor(
    private schedulerService: SchedulerService,
    private customModalService: CustomModalService,
    public datepipe: DatePipe,
    private shared: SharedService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private app: ApplicationRef,
    private injector: Injector,
    private searchDateService: SearchDataService,
    private changeRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    // this.createEditDeleteButtonsJquery();
    this.getAllEvents();

    this.searchDateService.dataSource
    .pipe(takeUntil(this.destroy$))
    .subscribe((event: SearchFilterEvent) => {
      if (event && event.check) {
        if (event.searchFilter && event.searchFilter.chipsFilter) {
          this.highlightingWords = [];
          this.changeRef.detectChanges();
          this.highlightingWords = event.searchFilter.chipsFilter.words;
          this.highlightingWords.forEach((text) => {
            this.onFilter(text.text);
          });
        } else {
          this.highlightingWords = [];
          this.onFilter('');
        }
      }
    });

    this.shared.emitDeleteAction
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (resp: any) => {
        if ( resp.data && resp.data.category == 'event' ) {
          this.deleteEvent(resp.data.id);
        }
      }
    );

    this.schedulerService.emitEventUpdate
    .pipe(takeUntil(this.destroy$))
    .subscribe((resp: any) => {
      if (resp) {
        this.getAllEvents();
      }
    });
    localStorage.setItem('modalOpened', null);

    /*   $('.k-icon').removeClass('k-i-calendar');
    $('.k-icon').addClass('arrow'); */

    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, rrulePlugin],
      editable: true,
      dayMaxEventRows: 6,
      selectMinDistance: 150,
      selectable: true,
      droppable: true,
      selectMirror: true,
      initialView: 'dayGridMonth',
      contentHeight: 'auto',
      events: [],
      dateClick: this.handleDateClick.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventDrop: this.resizeEvent.bind(this),
      eventResize: this.resizeEvent.bind(this),
      select: this.selectMultiple.bind(this),
      eventDragStop: this.startEndDrag.bind(this),
      windowResize: this.windowResize.bind(this),
    };
    this.viewList = [
      {
        id: 1,
        name: 'Month',
        value: 'dayGridMonth',
        checked: true,
      },
      {
        id: 2,
        name: 'Week',
        value: 'timeGridWeek',
        checked: false,
      },
      {
        id: 3,
        name: 'Day',
        value: 'timeGridDay',
        checked: false,
      },
    ];
    this.options = {
      mainActions: [
        {
          title: 'Edit',
          name: 'edit-event',
        },
      ],
      deleteAction: {
        title: 'Delete',
        name: 'delete-item',
        type: 'event'
      }
    };

    setTimeout(() => {
      if (this.calendarOptions.initialView === 'timeGridWeek') {
        $('.fc-daygrid-day').addClass('week');
      } else {
        $('.fc-daygrid-day').addClass('month');
      }
      this.checkCalendarTitle();
    }, 1000);
  }

  public selectMultiple(info) {
    if (!info.endStr) { return; }
    localStorage.setItem('modalOpened', 'true');
    const data = {
      event: {
        type: 'add',
        id: 0,
        end: info.endStr,
        start: info.startStr,
        isEditOccurence: false,
        allDay: info.allDay
      },
    };
    this.customModalService.openModal(CalendarManageComponent, { data }, null, {
      size: 'small',
    });
  }

  public startEndDrag(e) {
    this.findAllEvents();
  }

  public windowResize() {
    this.findAllEvents();
  }

  public findAllEvents() {
    $('.fc-daygrid-day-bottom').removeClass('opened');
    $('.custom_calendar_dropdown').slideUp();
    setTimeout(() => {
      $('.fc-daygrid-day').removeClass('biggindex');
      this.createDropdown();
      $('.fc-daygrid-event, .fc-timegrid-col .fc-timegrid-event').each((index, elem) => {
        if ( $(elem).closest('.fc-daygrid-event-harness-abs').length > 0 ) {
          if ( !$(elem).closest('.fc-daygrid-event-harness-abs').hasClass('custom-harnesss-abs') ) {
            $(elem).closest('.fc-daygrid-day').addClass('biggindex');
          }
        }
        this.createDeleteItemsComponent(elem, index);
      });
    }, 1000);
  }

  public createDropdown() {
    const is_dropdown_shown = $('.fc-daygrid-day-bottom');
    if ( is_dropdown_shown.length > 0 ) {
      $(is_dropdown_shown).each(function(inxd, item) {
        const ling_value = parseInt($(item).find('.fc-daygrid-more-link').html());
        $(item).find('.fc-daygrid-more-link').remove();
        if ( !isNaN(ling_value) ) { $(item).html(`<span class="toggle_drop">${ling_value} More Events</span>`); }
        if ( $(item).find('.custom_calendar_dropdown').length == 0 ) { $(item).append('<div class=\'custom_calendar_dropdown\'></div>'); }
        $(item).parent().find('.fc-daygrid-event-harness.fc-daygrid-event-harness-abs').each(function(e, elem) {
          if ($(elem).attr('style') && $(elem).attr('style').includes('visibility')) {
            const clonedel = $(elem).detach();
            $(clonedel).addClass('custom-harnesss-abs');
            $(item).find('.custom_calendar_dropdown').append(clonedel);
          }
        });
      });

      $('.fc-daygrid-day-bottom').off('click');
      $('.fc-daygrid-day-bottom').on('click' , function(e) {
        $('.overbuttons').removeClass('overbuttons');
        if (e.target.className == 'toggle_drop') {
          $(this).toggleClass('opened');
          $(this).find('.custom_calendar_dropdown').slideToggle(100);
        }
      });
    }
  }


  public createDeleteItemsComponent(elem: any, index: number) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(TruckassistDropdownComponent);
    const newNode = document.createElement('div');
    newNode.className = 'd-inline-block show dropdown topDropdown';

    if ( $(elem).find('.d-inline-block.show.dropdown.topDropdown').length == 0 ) {
      $(elem).append(newNode);
      const ref = componentFactory.create(this.injector, [], newNode);
      ref.instance.mainActions = this.options.mainActions;
      ref.instance.deleteAction = this.options.deleteAction;
      ref.instance.actionEvent.subscribe((action) => {
        this.callAction(action);
      });
      ref.instance.category = 'event';
      this.app.attachView(ref.hostView);
    }
  }

  public callAction(action: any): void {
    if (action.type === 'edit-event') {
      this.openModal(action.id);
    }
  }
  public showActionMenu() {
    // this.actionEvent.emit(action);
  }

  public getAllEvents(): void {
    this.schedulerService.getEvents('scheduler').subscribe((event: any[]) => {
      this.events = [];

      event.forEach((element) => {
        if ( element.doc.rrule ) {
          const rulleString = element.doc.rrule + (!!element.doc.exception ? element.doc.exception : '');
          this.events.push({
            id: element.id,
            groupId: element.id,
            title: element.title,
            rrule: rulleString
          });
        } else {
          this.events.push({
            id: element.id,
            description: element.description,
            title: element.title,
            start: new Date(element.startDate),
            end: new Date(element.endDate),
            allDay: element.isAllDay == 1 ? true : false,
            groupId: !!element.doc.groupIdForOccurence
              ? element.doc.groupIdForOccurence
              : !!element.doc.rrule
              ? element.id
              : '',
            // duration: element.isAllDay == 1
            //     ? ''
            //     : this.generateDuration(element.startDate, element.endDate).toString(),
          });
        }
      });

      this.calendarOptions.events = this.events;
      this.findAllEvents();
    });
  }

  public goToDate() {
    const calendar = this.fullcalendar.getApi();
    calendar.gotoDate(this.datepipe.transform(this.selectedDate, 'yyyy-MM-dd'));
    this.checkCalendarTitle();
  }

  public goToTodayDate() {
    const calendar = this.fullcalendar.getApi();
    calendar.gotoDate(this.datepipe.transform(new Date(), 'yyyy-MM-dd'));
    this.checkCalendarTitle();
  }

  public openModal(id?) {
    const data = {
      type: id ? 'edit' : false,
      id: id ? id : 0,
      isEditOccurence: false,
    };
    this.customModalService.openModal(CalendarManageComponent, { data }, null, { size: 'small' });
  }

  public checkCalendarTitle() {
    const calendarApi = this.fullcalendar.getApi();
    console.log('11111111111111111111111111111111111111111111111111111111111');
    console.log(calendarApi);
    this.calendarTitle = calendarApi.currentData.viewTitle.replace(' ', ', ');
  }

  public prev() {
    const calendar = this.fullcalendar.getApi();
    calendar.prev();
    this.checkCalendarTitle();
    this.findAllEvents();
  }

  public next() {
    const calendar = this.fullcalendar.getApi();
    calendar.next();
    this.checkCalendarTitle();
    this.findAllEvents();
  }

  public changeCalendarView(view: any) {
    const checkedView = view.find((item: any) => item.checked);
    const calendarApi = this.fullcalendar.getApi();
    if ( checkedView.name == 'Week' || checkedView.name == 'Day' ) {
      calendarApi.setOption('selectMinDistance', 25);
    } else {
      calendarApi.setOption('selectMinDistance', 150);
    }
    calendarApi.changeView(checkedView.value);
    this.calendarTitle = calendarApi.currentData.viewTitle.replace(' ', ', ');

    this.findAllEvents();
  }

  public sameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  }

  public generateDuration(start: string, end: string) {
    const hourDifference = new Date(end).getHours() - new Date(start).getHours();

    if (hourDifference > 9) {
      return hourDifference;
    } else {
      return '0' + hourDifference.toString() + ':00';
    }
  }
  public resizeEvent(info: any) {
    console.log('resize');
    console.log(info);
    let model = null;
    // if (!!info.event.groupId) {
    //   const data = {
    //     isDropOccurence: true,
    //     isEditEvent: true,
    //     event: info,
    //   };
    //   this.customModalService.openModal(CalendarActionsComponent, { data }, null, {
    //     size: 'small',
    //   });
    // } else {
    this.schedulerService.getEventById(info.event.id).subscribe((event: any) => {
        model = event;
        if ( !model.doc.rrule ) {
          model.startDate = info.event.allDay ? info.event.startStr : info.event.startStr.slice(0, 19),
          model.endDate = !!info.event.endStr
          ? info.event.allDay
            ? info.event.endStr
            : info.event.endStr.slice(0, 19)
          : info.event.startStr.slice(0, 19);
        } else {
          const rrules = RRule.fromString(model.doc.rrule);
          if ( rrules.origOptions.until ) {
            const newDates = this.findDateRange(info);
            rrules.origOptions.dtstart = newDates.min;
            rrules.origOptions.until = newDates.max;
          }
          if ( rrules.origOptions.freq == 1 ) {
            if (rrules.origOptions.bymonthday) {
              rrules.origOptions.bymonthday = new Date(info.event.start).getDate();
            }
          }

          model.doc.rrule = rrules.toString();
        }
        $('.fc-daygrid-day').removeClass('biggindex');

        this.schedulerService.updateEvent(info.event.id, model).subscribe(
          (response: any) => {
            this.getAllEvents();
          },
          (error: any) => {
            this.shared.handleServerError();
          }
        );
      });
    // }
  }

  findDateRange(info) {
    const inside_dates = [info.event.start];
    if ( info.relatedEvents ) {
      info.relatedEvents.forEach(element => {
        inside_dates.push(element.start);
      });
    }
    return {
      max: Math.max.apply(null, inside_dates),
      min: Math.min.apply(null, inside_dates)
    };
  }

  handleDateClick(selectDate: any) {
    console.log(selectDate);
    $('td').removeClass('selectedDate');
    $(selectDate.dayEl).addClass('selectedDate');
    $('full-calendar').off('dblclick');
    $('full-calendar').on('dblclick', (e) => {
      let date = selectDate.dateStr.replace(/[^\w\s]/gi, '');
      date = date.slice(0, 8);
      const isOpened = localStorage.getItem('modalOpened');
      console.log(isOpened);
      if (isOpened == 'null') {
        localStorage.setItem('modalOpened', 'true');
        localStorage.setItem('currentDate', date);
        console.log(selectDate.dateStr);
        const data = {
          event: {
            type: 'add',
            id: 0,
            start: selectDate.dateStr,
            isEditOccurence: false,
            allDay: true,
            startTime: '',
            endTime: '',
          },
        };

        console.log('ddddddata');
        console.log(data);
        this.customModalService.openModal(CalendarManageComponent, { data }, null, {
          size: 'small',
        });
      }
    });
  }

  handleEventClick(arg) {
    const elmt = arg.el;
    if ( arg.jsEvent.target.className.includes('dropdown-toggle') ) {
      const clparent = $(elmt).closest('.fc-daygrid-event-harness');
      const clparenttop = $(elmt).closest('.fc-daygrid-day-events');
      $('.fc-daygrid-event-harness').not(clparent).removeClass('overbuttons');
      $('.fc-daygrid-day-events').not(clparenttop).removeClass('overbuttons');
      $(clparent).toggleClass('overbuttons');
      $(clparenttop).toggleClass('overbuttons');
    }
    this.customModalService.changedIndetifier.next(arg.event.id);
    const events = document.querySelectorAll('span.deleteBtn');
    const eventsEdit = document.querySelectorAll('i.fa.fa-edit');
    let date = arg.event.startStr.replace(/[^\w\s]/gi, '');
    date = date.slice(0, 8);
    localStorage.setItem('currentDate', date);

    const data = {
      id: arg.event.id,
      groupId: arg.event.groupId,
      actionType: '',
      isDeleteEvent: false,
      isEditEvent: false,
      isDeleteSeriesEvent: false,
      deleteIds: [],
      event: null,
      isEditSingle: false,
    };
    let clicked = false;
    document.addEventListener('click', (event: MouseEvent) => {
      if (clicked === false) {
        events.forEach((element) => {
          if (element === event.target) {
            data.isDeleteSeriesEvent = !!arg.event.groupId ? true : false;
            data.isDeleteEvent = !!arg.event.groupId ? false : true;
            if (!!arg.event.groupId) {
              if (
                this.events.filter(
                  (item) => item.groupId.toString() === arg.event.groupId.toString()
                ).length > 0
              ) {
                this.events
                  .filter((item) => item.groupId.toString() === arg.event.groupId.toString())
                  .forEach((item: any) => {
                    data.deleteIds.push(item.id);
                  });
              }
              this.customModalService.openModal(CalendarActionsComponent, { data }, null, {
                size: 'small',
              });
            } else {
              this.deleteEvent(arg.event.id);
            }
          }
        });

        eventsEdit.forEach((elements) => {
          if (elements === event.target) {
            data.isEditEvent = true;
            if (!!arg.event.groupId) {
              this.customModalService.openModal(CalendarActionsComponent, { data }, null, {
                size: 'small',
              });
            } else {
              data.event = this.events.filter((item) => item.id.toString() === arg.event.id)[0];
              data.event.recurrenceRule = 'NEVER';
              data.isEditSingle = true;
              this.customModalService.openModal(CalendarManageComponent, { data }, null, {
                size: 'small',
              });
            }
          }
        });
        clicked = true;
      }
    });
  }
  private deleteEvent(id: any) {
    this.schedulerService.deleteEvent(id).subscribe(
      (response: any) => {
        this.getAllEvents();
      },
      (error: any) => {
        this.shared.handleServerError();
      }
    );
  }

  public onFilter(inputValue: string): void {
    if (this.events.length) {
      const availableFilters: (
        | CompositeFilterDescriptor
        | FilterDescriptor
      )[] = this.checkEventForFiltering(inputValue);
      this.calendarOptions.events = process(this.events, {
        filter: {
          logic: 'or',
          filters: availableFilters,
        },
      }).data;
    }
  }

  public checkEventForFiltering(
    inputValue: string
  ): (CompositeFilterDescriptor | FilterDescriptor)[] {
    const filterDescriptor = [];

    filterDescriptor.push({
      field: 'title',
      operator: 'contains',
      value: inputValue,
    });

    return filterDescriptor;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /*   private createEditDeleteButtonsJquery() {
    const buttonList = ['prev', 'next', 'dayGridMonth', 'timeGridWeek', 'timeGridDay'];
    buttonList.forEach((element) => {
      $('body').on('click', 'button.fc-' + element + '-button', () => {
        $('.fc-event-title').append(
          '<i class="fa fa-edit" (click)="editEvent(1)"></i><span class="deleteBtn" (click)="resizeEvent(1)">X</span>'
        );
      });
    });
  } */
}
