import { Component, OnInit } from '@angular/core';
import calendarJson from '../../../assets/calendarjson/calendar.json'

@Component({
  selector: 'app-custom-datetime-pickers',
  templateUrl: './custom-datetime-pickers.component.html',
  styleUrls: ['./custom-datetime-pickers.component.scss']
})
export class CustomDatetimePickersComponent implements OnInit {

  constructor() { }

  calendarData: any = calendarJson;
  calendarYears: any[] = Object.keys(calendarJson);

  currentYear: any = new Date().getFullYear();
  currentMonth: any = new Date().getMonth();
  currentDay: any = new Date().getDate();

  listPreview: any = 'full_list';
  monthNames = [
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

  ngOnInit(): void {
    // console.log(this.calendarData);
    // const fullData = {};

    // for(let i = 1940; i <= 2090; i++){
    //   for(let m = 0; m < 12; m++){
    //     if( !fullData[i] ) fullData[i] = [];
    //     fullData[i].push(this.renderCalendarDays(i, m));
    //   }
    // }

    // console.log(JSON.stringify(fullData));
  }


  public setListPreview(): void{
    this.listPreview = this.listPreview == "full_list" ? "month_list" : "full_list";
  }

  renderCalendarDays(fullYear, fullMonth) {
    const monthArray = [];
    // Previous month
    const prevMonth = new Date(fullYear, fullMonth, 0);
    // This month
    const thisMonth = new Date(fullYear, fullMonth + 1, 0);
    // Next month
    const nextMonth = new Date(fullYear, fullMonth + 1, 1);

    // Last day of previous month
    const lastMonthDay = prevMonth.getDate();
    // Previos month last day name / 0 - 6 // 0 is Sunday
    const lastMonthDayName = prevMonth.getDay();

    const lastMonthDiff = lastMonthDay - lastMonthDayName;

    const thisMonthDays = thisMonth.getDate();
    const nextMonthDays = nextMonth.getDay();

    const monthDays = [];

    if ( lastMonthDayName != 6 ) {
      for (let i = lastMonthDiff; i <= lastMonthDay; i++ ) {
        monthDays.push(
          {
            day: i,
            additionalClass: ['prev_days'],
            events: []
          }
        );
      }
    }

    for (let i = 1; i <= thisMonthDays; i++) {
    monthDays.push(
        {
          day: i,
          events: []
        }
      );
    }

    if ( nextMonthDays != 0 ) {
      for (let i = 1; i <= (7 - nextMonthDays); i++) {
        monthDays.push(
          {
            day: i,
            additionalClass: ['prev_days'],
            events: []
          }
        );
      }
    }

    return monthDays;
  }
}
