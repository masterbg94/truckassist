import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TableData } from '../truckassist-table/models/truckassist-table';

@Component({
  selector: 'app-truckassist-buttongroup',
  templateUrl: './truckassist-buttongroup.component.html',
  styleUrls: ['./truckassist-buttongroup.component.scss'],
  animations: [
    trigger("anim", [
      state("selected", style({width: '*', overflow: 'hidden'})),
      state("normal", style({width: '*', overflow: 'hidden'})),
      transition("selected <=> normal", animate( "1500ms" )),
    ])
  ],
})
export class TruckassistButtongroupComponent implements OnInit {
  @Input() items: TableData[];
  @Input() loading: boolean;
  @Input() selectedTab: string;
  @Output() switch: EventEmitter<string> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  selectItem(item: any) {
    this.selectedTab = item.field;
    this.switch.emit(item.field);
  }
}
