import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-state-usa',
  templateUrl: './dashboard-state-usa.component.html',
  styleUrls: ['./dashboard-state-usa.component.scss']
})
export class DashboardStateUsaComponent implements OnInit {
  constructor() { }
  @Input() statesColor: any;

  hoveredItem: any;

  ngOnInit(): void {
  }

  setPopoverData(country: string): void {
    this.hoveredItem = this.statesColor[country];
  }

}
