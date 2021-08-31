import { animate, style, transition, trigger } from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { TabFilter } from 'src/app/core/model/tab-filter';
import { TabSelectFilterService } from 'src/app/core/services/tab-select-filter.service';

@Component({
  selector: 'app-custom-tab',
  templateUrl: './custom-tab.component.html',
  styleUrls: ['./custom-tab.component.scss']
})
export class CustomTabComponent implements OnInit, AfterViewInit {
  @ViewChild('switchBtn') switchBtnElement: ElementRef;
  @ViewChild('inputToFocus') inputElement: ElementRef;
  @ViewChild('target') targetElement: ElementRef;
  @Input() class: any;
  @Input() title: string;
  @Input() id: string;
  @Input() total: string;
  @Input() stateName: string;

  @Output() clickOutside = new EventEmitter<void>();

  open = false;

  @Input() items: any;

  viewItems = [];
  hovered = false;
  showCloseBtn = false;
  selectedItems = 0;
  tabFilter: TabFilter[] = [];
  dropWidth = 0;

  focusedItemIndex = -1;

  @HostListener('document:click', ['$event.target'])
  public onClick(target) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }

  @HostListener('keydown', ['$event']) onKeyDown(e) {
    if (e.target.localName === 'input') {
      if (e.keyCode === 40) {
        this.focusedItemIndex < this.viewItems.length
          ? this.focusedItemIndex++
          : this.viewItems.length - 1;
      } else if (e.keyCode === 38) {
        this.focusedItemIndex !== -1 ? this.focusedItemIndex-- : -1;
      } else if (e.keyCode === 13) {
        this.viewItems.forEach((item, key) => {
          if (this.focusedItemIndex === key) {
            this.selectItem(this.focusedItemIndex);
          }
        });
      }
      if (this.focusedItemIndex === -1) {
        this.viewItems.forEach((item, key) => {
          item.focused = false;
        });
      } else {
        this.viewItems.forEach((item, key) => {
          item.focused = this.focusedItemIndex === key;
        });
      }
    }
  }

  constructor(
    private elementRef: ElementRef,
    private tabSelectFilterService: TabSelectFilterService,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit(): void {
    if (this.switchBtnElement?.nativeElement) {
      const width = `${this.switchBtnElement.nativeElement.offsetWidth}px`;
      this.renderer.setStyle(this.targetElement.nativeElement, 'width', width);
      this.renderer.setStyle(this.switchBtnElement.nativeElement, 'width', width);
    }
  }

  ngOnInit(): void {
    this.showCloseBtn = false;
    this.loadFilter();
    this.reloadList();
  }

  searchItems(event: any) {
    const searchText = (event.target as HTMLInputElement).value.trim().toLowerCase();

    if (!searchText) {
      this.viewItems = this.items;
    }

    this.viewItems = this.items.filter((item) => item.id.toLowerCase().includes(searchText));
  }

  reloadList() {
    let selectedItems = 0;
    this.viewItems = this.items
      .map((item) => {
        item.selected = this.tabFilter.includes(item.id);
        item.approved = item.selected;
        if (item.approved) {
          selectedItems++;
          this.showCloseBtn = true;
        }
        return item;
      })
      .sort((a, b) => (a.approved ? -1 : 1));

    this.selectedItems = selectedItems;
  }

  showMenu(el: HTMLElement) {
    this.open = this.open ? false : true;
    if (this.open) {
      setTimeout(() => {
        el.scrollTop = 0;
      }, 0);
    }
    this.inputElement.nativeElement.value = '';
    this.reloadList();
    setTimeout(() => {
      this.inputElement.nativeElement.focus();
      const width = `${this.switchBtnElement.nativeElement.offsetWidth}px`;
      this.renderer.setStyle(this.targetElement.nativeElement, 'width', width);
    }, 0);
  }

  removeFilters(event: any) {
    event.stopPropagation();
    this.viewItems = this.viewItems.map((item) => {
      item.approved = false;
      item.selected = false;
      return item;
    });
    this.showCloseBtn = false;
    this.tabFilter = [];
    this.appyFilter();
  }

  selectItem(index: number) {
    this.viewItems[index].selected = !this.viewItems[index].selected;
    this.viewItems[index].approved = false;
    this.showCloseBtn = true;

    let selectedItems = 0;
    const tabFilters = [];

    this.viewItems = this.viewItems.map((item) => {
      if (item.selected) {
        selectedItems++;
        tabFilters.push(item.id);
      }
      return item;
    });

    this.selectedItems = selectedItems;
    this.tabFilter = tabFilters;
    this.appyFilter();
  }

  closeMenu() {
    this.open = false;

    let showCloseBtn = false;
    this.viewItems = this.viewItems.map((item) => {
      item.approved = item.selected ? true : false;

      if (item.approved) {
        showCloseBtn = true;
      }
      return item;
    });

    this.showCloseBtn = showCloseBtn;
  }

  loadFilter() {
    const tabFilter = JSON.parse(localStorage.getItem(this.stateName + '_tabFilter'));
    this.tabFilter = tabFilter ? tabFilter : [];
  }

  appyFilter() {
    localStorage.setItem(this.stateName + '_tabFilter', JSON.stringify(this.tabFilter));
    this.tabSelectFilterService.sendTabFilterData(this.tabFilter);
  }
}
