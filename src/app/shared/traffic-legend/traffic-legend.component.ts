import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-traffic-legend',
  templateUrl: './traffic-legend.component.html',
  styleUrls: ['./traffic-legend.component.scss'],
})
export class TrafficLegendComponent implements OnInit {
  layers = [{ color: '#30C862' }, { color: '#FFAD43' }, { color: '#FF4D4D' }, { color: '#B20000' }];

  constructor() {}

  ngOnInit(): void {}
}
