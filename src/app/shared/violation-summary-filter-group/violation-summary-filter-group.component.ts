import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-violation-summary-filter-group',
  templateUrl: './violation-summary-filter-group.component.html',
  styleUrls: ['./violation-summary-filter-group.component.scss'],
})
export class ViolationSummaryFilterGroupComponent implements OnInit {
  violationSummaryFilters: any;
  loaded = false;
  constructor() {}

  ngOnInit(): void {
    this.violationSummaryFilters = [
      {
        value: 36,
        icon: 'vl1',
        active: true,
      },
      {
        value: 18,
        icon: 'vl2',
        active: false,
      },
      {
        value: 7,
        icon: 'vl3',
        active: false,
      },
      {
        value: 7,
        icon: 'vl4',
        active: false,
      },
      {
        value: 0,
        icon: 'vl5',
        active: false,
      },
      {
        value: 5,
        icon: 'vl6',
        active: false,
      },
      {
        value: 0,
        icon: 'vl7',
        active: false,
      },
    ];
    this.loaded = true;
  }

  switchFilter(index) {
    this.violationSummaryFilters.forEach((element) => {
      element.active = false;
    });
    this.violationSummaryFilters[index].active = true;
  }
}
