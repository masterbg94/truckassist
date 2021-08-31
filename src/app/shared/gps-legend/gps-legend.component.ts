import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-gps-legend',
  templateUrl: './gps-legend.component.html',
  styleUrls: ['./gps-legend.component.scss']
})
export class GpsLegendComponent implements OnInit {
  @Input() dataLegend: any;
  constructor() { }

  ngOnInit(): void {}

}
