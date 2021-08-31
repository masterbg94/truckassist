import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-markers',
  templateUrl: './markers.component.html',
  styleUrls: ['./markers.component.scss'],
})
export class MarkersComponent implements OnInit {
  @Input() markers: any;
  @Input() number: number;

  constructor() {}

  ngOnInit(): void {}
}
