import { Component, OnInit } from '@angular/core';
import { ViolationGroupFilterService } from 'src/app/core/services/violation-group-filter.service';

@Component({
  selector: 'app-violation-group-filter',
  templateUrl: './violation-group-filter.component.html',
  styleUrls: ['./violation-group-filter.component.scss'],
})
export class ViolationGroupFilterComponent implements OnInit {
  violationFilter = [];
  violationFilters = [
    {
      violationId: 1,
      name: 'No Viol.',
      count: 3,
      active: false,
    },
    {
      violationId: 2,
      name: 'Viol.',
      count: 4,
      active: false,
    },
    {
      violationId: 3,
      name: 'OOS',
      count: 5,
      active: false,
    },
  ];
  constructor(private violationGroupFilterService: ViolationGroupFilterService) {}

  ngOnInit(): void {
    const violationGroupFilter = JSON.parse(localStorage.getItem('_violationGroupFilter'));
    this.violationFilter = violationGroupFilter ? violationGroupFilter : [];
    this.violationFilters.map((item) => {
      this.violationFilter.forEach((element) => {
        if (element === item.violationId) {
          item.active = true;
        }
      });
    });
  }

  useFilter(i: number) {
    this.violationFilters[i].active = !this.violationFilters[i].active;
    const filter = [];
    this.violationFilters = this.violationFilters.map((item) => {
      if (item.active) {
        filter.push(item.violationId);
      } else {
        const index = filter.indexOf(item);
        if (index > -1) {
          filter.splice(index, 1);
        }
      }
      return item;
    });
    this.violationFilter = filter;
    localStorage.setItem('_violationGroupFilter', JSON.stringify(this.violationFilter));
    this.violationGroupFilterService.sendDataSource(this.violationFilter);
  }
}
