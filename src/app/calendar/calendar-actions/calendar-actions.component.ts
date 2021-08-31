import { AfterContentInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification-service.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { ContactAccountService } from '../../core/services/contactaccount.service';
import { CalendarManageComponent } from '../../calendar/calendar-manage/calendar-manage.component';
import { CustomModalService } from '../../core/services/custom-modal.service';
import { SchedulerService } from '../../core/services/scheduler.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-calendar-actions',
  templateUrl: './calendar-actions.component.html',
  providers: [DatePipe],
})
export class CalendarActionsComponent implements AfterContentInit {
  constructor(
    private activeModal: NgbActiveModal,
    private shared: SharedService,
    private schedulerService: SchedulerService,
    public datepipe: DatePipe,
    private customModalService: CustomModalService
  ) {}
  @Input() inputData: any;
  public modalTitle: string;
  public data: [];

  ngAfterContentInit(): void {
    console.log('COSTE');
    console.log(this.inputData);
    this.modalTitle = this.inputData.data.isDeleteEvent ? 'Delete Event' : '';
    this.modalTitle = this.inputData.data.isDeleteSeriesEvent ? 'Delete Recurring Item' : '';
    this.modalTitle = this.inputData.data.isEditEvent ? 'Edit Event' : '';
    this.data = this.inputData;
  }

  public closeEventModal() {
    this.activeModal.close();
  }

  public editCurrentEvent(id: any, isEditCurrent: boolean) {
    if (this.inputData.data.isDropOccurence) {
      this.createSingleEvent(this.inputData.data.event.event);
      this.deleteCurrent(this.inputData.data.event.event.id);
    } else {
      this.deleteCurrent(id, isEditCurrent);
      this.editEvent(id, isEditCurrent);
    }
  }

  public createSingleEvent(event: any) {
    const eventData = {
      dataItem: event.title,
      description: '',
      doc: {
        groupIdForOccurence: event.groupId,
      },
      title: event.title,
      startDate: event.allDay ? event.startStr : event.startStr.slice(0, 19),
      endDate: !!event.endStr
        ? event.allDay
          ? event.endStr
          : event.endStr.slice(0, 19)
        : event.startStr.slice(0, 19),
      endTimezone: 'GMT+0200',
      startTimezone: 'GMT+0200',
      recurrenceExceptions: '',
      recurrenceId: 2,
      recurrenceRule: 'NEVER',
      isAllDay: event.allDay === true ? 1 : 0,
    };

    this.schedulerService.createEvent(eventData).subscribe(
      () => {},
      (error: any) => {
        this.shared.handleServerError();
      }
    );
  }

  public deleteEvent(id: any) {
    if (this.inputData.data.deleteIds.length > 0) {
      this.inputData.data.deleteIds.forEach((itm: any) => {
        this.deleteEventApi(itm);
      });
    } else {
      this.deleteEventApi(id);
    }
  }

  private deleteEventApi(id: any) {
    this.schedulerService.deleteEvent(id).subscribe(
      (response: any) => {
        this.schedulerService.emitEventUpdate.emit(true);
        this.activeModal.close();
      },
      (error: any) => {
        this.shared.handleServerError();
      }
    );
  }

  public deleteCurrent(id: any, isEditCurrent?: any) {
    this.schedulerService.getEventById(id).subscribe(
      (response: any) => {
        if (response.doc.rrule) {
          let date = '';
          if (!!this.inputData.data.event) {
            date = this.inputData.data.event.oldEvent.startStr;
          } else {
            date = localStorage.getItem('currentDate');
          }
          while (date.includes('-')) {
            date = date.replace('-', '');
          }
          let rExep = response.recurrenceExceptions;
          rExep += ',' + date;
          const recurrenceExceptions = rExep;

          if (response.doc.exception) {
            response.doc.exception +=
              ',' +
              date.slice(0, 8) +
              'T' +
              (response.isAllDay === 0
                ? response.startDate.slice(11, 19).replaceAll(':', '') + 'Z'
                : '000000Z');
          } else {
            response.doc.exception =
              '\nEXDATE:' +
              date.slice(0, 8) +
              (response.isAllDay === 0
                ? 'T' + response.startDate.slice(11, 19).replaceAll(':', '')
                : '');
          }

          this.schedulerService.updateEvent(id, response).subscribe(
            () => {
              if (!isEditCurrent) {
                this.schedulerService.emitEventUpdate.emit(true);
                this.activeModal.close();
              }
            },
            (error: any) => {
              this.shared.handleServerError();
            }
          );
        }
      },

      (error: any) => {
        this.shared.handleServerError();
      }
    );
  }

  public editEvent(id: any, isCurrent: boolean) {
    debugger;
    if (!!id) {
      const ruleModel = {
        freq: '',
        byDay: '',
        byMonthDay: '',
        bySetPos: '',
        count: '',
        interval: 1,
        until: '',
        byMonth: '',
      };
      this.schedulerService.getEventById(id).subscribe(
        (response: any) => {
          let data = {};
          if (response.doc.rrule) {
            const rrule = response.doc.rrule.split(';');
            rrule.forEach((item: any) => {
              const splited = item.split('=');
              if (splited[0] === 'FREQ') {
                ruleModel.freq = splited[1];
              }
              if (splited[0] === 'BYMONTH') {
                ruleModel.byMonth = splited[1];
              }
              if (splited[0] === 'BYMONTHDAY') {
                ruleModel.byMonthDay = splited[1];
              }
              if (splited[0] === 'BYSETPOS') {
                ruleModel.bySetPos = splited[1];
              }
              if (splited[0] === 'INTERVAL') {
                ruleModel.interval = splited[1];
              }
              if (splited[0] === 'UNTIL') {
                ruleModel.until = splited[1];
              }
              if (splited[0] === 'COUNT') {
                ruleModel.count = splited[1];
              }
              if (splited[0] === 'BYDAY') {
                ruleModel.byDay = splited[1];
              }
            });
            data = {
              event: {
                id: response.id,
                freq: response.recurrenceRule,
                dataItem: response.title,
                description: response.description,
                doc: response.doc.rrule ? ruleModel : {},
                title: response.title,
                start: response.startDate.slice(0, 10),
                end: response.endDate.slice(0, 10),
                endTimezone: 'GMT+0200',
                startTimezone: 'GMT+0200',
                recurrenceExceptions: '11-10-2020',
                recurrenceId: 2,
                recurrenceRule: response.recurrenceRule, // Daily, Weekly ex.
                isAllDay: response.isAllDay,
                startTime: !response.isAllDay ? response.startDate.slice(11, 16) : '',
                endTime: !response.isAllDay ? response.endDate.slice(11, 16) : '',
                allDay: response.isAllDay,
              },
              isEditOccurence: isCurrent,
            };
          }
          this.customModalService.openModal(CalendarManageComponent, { data });
          this.closeEventModal();
        },
        (error: any) => {
          this.shared.handleServerError();
        }
      );
    } else {
      id = !!id ? id : this.inputData.data.event.event.id;
      this.updateEvent(id);
    }
  }
  public updateEvent(id: any) {
    this.schedulerService.getEventById(id).subscribe(
      (response: any) => {
        let data = {};
        data = {
          dataItem: response.title,
          description: response.description,
          doc: {
            rrule: response.doc.rrule,
          },
          title: response.title,
          endTimezone: 'GMT+0200',
          startTimezone: 'GMT+0200',
          recurrenceExceptions: '11-10-2020',
          recurrenceId: 2,
          recurrenceRule: response.recurrenceRule,
          isAllDay: response.isAllDay,
          startDate: this.generateStartString(
            this.inputData.data.event.event.startStr.slice(0, 19),
            response
          ),
          endDate: this.inputData.data.event.event.endStr
            ? this.inputData.data.event.event.endStr.slice(0, 19)
            : '',
        };
        this.schedulerService.updateEvent(id, data).subscribe(
          () => {
            this.schedulerService.emitEventUpdate.emit(true);
            this.activeModal.close();
          },
          (error: any) => {
            this.shared.handleServerError();
          }
        );
      },
      (error: any) => {
        this.shared.handleServerError();
      }
    );
  }
  private generateStartString(date: string, response: any) {
    const startDay = Number(response.startDate.slice(8, 10));
    const endDay = Number(this.inputData.data.event.event.startStr.slice(8, 10));
    let finalDay = Number(response.startDate.slice(0, 10).slice(-2));
    if (startDay < endDay) {
      finalDay += endDay - startDay;
    } else {
      finalDay -= startDay - endDay;
    }
    return (
      this.inputData.data.event.event.startStr.slice(0, 8) +
      finalDay.toString() +
      this.inputData.data.event.event.startStr.slice(10, 19)
    );
  }
}
