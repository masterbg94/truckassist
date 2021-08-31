import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableOptions } from '../truckassist-table/models/truckassist-table';

@Component({
  selector: 'app-table-view-switcher',
  templateUrl: './table-view-switcher.component.html',
  styleUrls: ['./table-view-switcher.component.scss'],
})
export class TableViewSwitcherComponent implements OnInit {
  @Input() viewMode: string;
  @Input() stateName: string;
  @Output() viewModeEvent: EventEmitter<string> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  changeViewMode(viewMode: string) {
    if (this.viewMode != viewMode) {
      this.viewMode = viewMode;
      this.viewModeEvent.emit(viewMode);
    }
  }
}
