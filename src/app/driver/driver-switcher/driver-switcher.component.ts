import { Component, OnInit } from '@angular/core';

export interface SwitchItem {
  name: string;
  selected: boolean;
}

@Component({
  selector: 'app-driver-switcher',
  templateUrl: './driver-switcher.component.html',
  styleUrls: ['./driver-switcher.component.scss']
})
export class DriverSwitcherComponent implements OnInit {
  active = 'top';
  selectedIndex = 0;
  items: SwitchItem[] = [];

  constructor() {}

  ngOnInit() {}

  selectItem(index: number) {
    this.selectedIndex = index;
    this.items.map((item) => {
      item.selected = this.items[index].name === item.name ? true : false;
    });
  }
}
