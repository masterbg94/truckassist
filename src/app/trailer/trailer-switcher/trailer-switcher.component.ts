import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubItemsSwitchService } from 'src/app/core/services/subitems-switch-service';
import { SwitchItem } from 'src/app/shared/truckassist-table/models/truckassist-table';

@Component({
  selector: 'app-trailer-switcher',
  templateUrl: './trailer-switcher.component.html',
  styleUrls: ['./trailer-switcher.component.scss'],
})
export class TrailerSwitcherComponent implements OnInit {
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
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private subItemsSwitchService: SubItemsSwitchService
  ) {
    this.route.params.subscribe((params) => {
      this.id = params.id;
      this.selectedTab = params.tab;
    });

    this.subItemsSwitchService.currentDataSource.subscribe((field: string) => {
      if (field && this.selectedTab !== 'detail') {
        let index = this.items.findIndex((a) => a.field === field);
        if (index !== -1) {
          this.selectItem(index);
          this.router.navigateByUrl('/trailers/edit/' + this.id + this.items[index].path);
        }
      }
    });
  }

  ngOnInit() {
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
    this.router.navigateByUrl('/trailers/edit/' + this.id + '/detail');
  }
}
