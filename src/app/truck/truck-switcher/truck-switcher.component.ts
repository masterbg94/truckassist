import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SubItemsSwitchService } from 'src/app/core/services/subitems-switch-service';
import { SwitchItem } from 'src/app/shared/truckassist-table/models/truckassist-table';

// export interface SwitchItem {
//   title: string;
//   selected: boolean;
//   path: string;
//   field: string;
//   index: number;
//   disabled?: boolean;
//   data?: any[]
// }

@Component({
  selector: 'app-truck-switcher',
  templateUrl: './truck-switcher.component.html',
  styleUrls: ['./truck-switcher.component.scss'],
})
export class TruckSwitcherComponent implements OnInit {
  active = 'top';
  public id: number;
  public selectedTab: string;
  items: SwitchItem[] = [
    {
      title: 'Repair',
      selected: false,
      path: '/repair',
      field: 'repair',
      index: 0,
      data: [],
    },
    {
      title: 'Load',
      selected: false,
      path: '/load',
      field: 'load',
      index: 1,
      data: [],
    },
    {
      title: 'Fuel',
      selected: false,
      path: '/fuel',
      field: 'fuel',
      index: 2,
      data: [],
    },
    {
      title: 'IFTA',
      selected: false,
      path: '/ifta',
      field: 'ifta',
      index: 3,
      data: [],
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private subItemsSwitchService: SubItemsSwitchService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = params.id;
      this.selectedTab = params.tab;
    });

    this.subItemsSwitchService.currentDataSource.subscribe((field: string) => {
      if (field && this.selectedTab !== 'detail') {
        let index = this.items.findIndex((a) => a.field === field);
        if (index !== -1 && this.selectedTab) {
          this.selectItem(index);
          this.router.navigateByUrl('/trucks/edit/' + this.id + this.items[index].path);
        }
      }
    });

    this.items = this.items.map((item) => {
      item.selected = this.selectedTab === item.field;
      return item;
    });
  }

  selectItem(index: number) {
    this.selectedTab = this.items[index].field;
    this.items = this.items.map((item) => {
      item.selected = this.selectedTab === item.field;
      return item;
    });
  }

  resetSelection() {
    this.selectedTab = 'detail';
    this.items = this.items.map((item) => {
      item.selected = false;
      return item;
    });
    this.router.navigateByUrl('/trucks/edit/' + this.id + '/detail');
  }
}
