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
  selector: 'app-custom-tab-select',
  templateUrl: './custom-tab-select.component.html',
  styleUrls: ['./custom-tab-select.component.scss'],
})
export class CustomTabSelectComponent implements OnInit, AfterViewInit {
  @ViewChild('switchBtn') switchBtnElement: ElementRef;
  @ViewChild('inputToFocus') inputElement: ElementRef;
  @ViewChild('target') targetElement: ElementRef;
 /*  @Input() class: any;
  @Input() title: string;
  @Input() id: string;
  @Input() total: string;
  @Input() stateName: string; */
  @Input() viewItems: any;

  @Output() clickOutside = new EventEmitter<void>();
  @Output() changeType = new EventEmitter<void>();

  open = false;

  @Input() items: any;

  hovered = false;
  showCloseBtn = false;
  selectedItems = 0;
  tabFilter: TabFilter[] = [];
  dropWidth = 0;

  @HostListener('document:click', ['$event.target'])
  public onClick(target) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }

  constructor(
    private elementRef: ElementRef,
    private tabSelectFilterService: TabSelectFilterService,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit(): void {
    const width = `${this.switchBtnElement.nativeElement.offsetWidth}px`;
    this.renderer.setStyle(this.targetElement.nativeElement, 'width', width);
  }

  ngOnInit(): void {
    this.showCloseBtn = false;
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

  appyFilter() {
    this.tabSelectFilterService.sendTabFilterData(this.tabFilter);
  }
}
