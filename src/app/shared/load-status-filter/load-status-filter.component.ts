import { Component, Input, OnInit } from '@angular/core';
import { LOAD_STATUS } from 'src/app/const';
import { LoadStatusFilterService } from 'src/app/core/services/load-status-filter.service';

@Component({
  selector: 'app-load-status-filter',
  templateUrl: './load-status-filter.component.html',
  styleUrls: ['./load-status-filter.component.scss'],
})
export class LoadStatusFilterComponent implements OnInit {
  @Input() tableTitle: string;
  open = false;
  hovered = false;
  showCloseBtn = false;
  items = [];

  viewItems = [];

  loadStatusFilter: number[] = [];

  constructor(private loadStatusFilterService: LoadStatusFilterService) {}

  ngOnInit(): void {
    this.loadStatuses(this.tableTitle);
  }

  public loadStatuses(tableTitle: string) {
    this.tableTitle = tableTitle;

    this.loadFilter();

    this.showCloseBtn = false;
    this.items = LOAD_STATUS.filter((i) => {
      if (tableTitle !== 'All') {
        if (tableTitle.toLowerCase() === i.group.toLowerCase()) {
          return i;
        }
      } else {
        return i;
      }
    });

    this.viewItems = this.items.map((item) => {
      item.selected = this.loadStatusFilter.includes(item.id);
      item.approved = item.selected;
      if (item.approved) {
        this.showCloseBtn = true;
      }
      return item;
    });
  }

  closeMenu() {
    this.open = false;

    let showCloseBtn = false;
    this.viewItems = this.viewItems
      .map((item) => {
        item.approved = item.selected ? true : false;
        if (item.approved) {
          showCloseBtn = true;
        }
        return item;
      })
      .sort((a, b) => (a.approved ? -1 : 1));

    this.showCloseBtn = showCloseBtn;
  }

  showMenu(el: HTMLElement) {
    this.open = this.open ? false : true;
    setTimeout(() => {
      el.scrollTop = 0;
    }, 0);
  }

  selectItem(index: number) {
    this.viewItems[index].selected = !this.viewItems[index].selected;
    this.viewItems[index].approved = false;
    this.showCloseBtn = true;

    const loadStatusFilter = [];

    this.viewItems = this.viewItems.map((item) => {
      if (item.selected) {
        loadStatusFilter.push(item.id);
      }
      return item;
    });
    this.loadStatusFilter = loadStatusFilter;
    this.appyFilter();
  }

  removeFilter(event: any) {
    event.stopPropagation();
    this.viewItems = this.viewItems.map((item) => {
      item.selected = false;
      return item;
    });
    this.loadStatusFilter = null;
    this.showCloseBtn = false;
    this.appyFilter();
  }

  loadFilter() {
    const loadStatusFilter = JSON.parse(
      localStorage.getItem(this.tableTitle + '_loadStatusFilter')
    );
    this.loadStatusFilter = loadStatusFilter ? loadStatusFilter : [];
  }

  appyFilter() {
    localStorage.setItem(
      this.tableTitle + '_loadStatusFilter',
      JSON.stringify(this.loadStatusFilter)
    );
    this.loadStatusFilterService.sendDataSource(this.loadStatusFilter);
  }
}
