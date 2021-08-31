import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ta-tab-switch',
  templateUrl: './ta-tab-switch.component.html',
  styleUrls: ['./ta-tab-switch.component.scss'],
})
export class TaTabSwitchComponent implements OnInit {
  @Input() tabs: any[];

  activeTab: number;

  @Output() switchClicked = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {
    this.activeTab = this.tabs[0].id;
  }

  handleChange(event: any) {
    this.switchClicked.emit(event);
    this.activeTab = event.id;
  }
}
