import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timezone-legend',
  templateUrl: './timezone-legend.component.html',
  styleUrls: ['./timezone-legend.component.scss']
})
export class TimezoneLegendComponent implements OnInit {

  timezones = [
    {color: '#FF4A4A', text: '-03:30 Greenwich Mean Time'},
    {color: '#FFDD00', text: '-04:00 Eastern Daylight Time'},
    {color: '#7BC57B', text: '-05:00 Central Daylight Time'},
    {color: '#EEA649', text: '-06:00 Mountain Daylight Time'},
    {color: '#3383EC', text: '-07:00 Pacific Daylight Time'},
    {color: '#A851FF', text: '-08:00 Alaska Daylight Time'},
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
