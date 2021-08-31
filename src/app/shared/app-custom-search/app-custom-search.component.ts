import { takeUntil } from 'rxjs/operators';
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Input,
  OnDestroy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { ChipsFilter, HighlightText } from 'src/app/core/model/shared/searchFilter';
import { SearchDataService } from 'src/app/core/services/search-data.service';
import { enterLeave } from 'src/app/core/helpers/animations';
import { Subject } from 'rxjs';
import { DateFilterService } from 'src/app/core/services/date-filter.service';
import { DateFilter, DateFilterEvent } from 'src/app/core/model/date-filter';
import { TabFilter, TabFilterEvent } from 'src/app/core/model/tab-filter';
import { TabSelectFilterService } from 'src/app/core/services/tab-select-filter.service';
import { LoadStatusFilterEvent } from 'src/app/core/model/load-status';
import { LoadStatusFilterService } from 'src/app/core/services/load-status-filter.service';
import { ViolationGroupFilterService } from 'src/app/core/services/violation-group-filter.service';
import { ViolationGroupFilterEvent } from 'src/app/core/model/violation-group-filter-event';
import { ShopTypeFilterService } from 'src/app/core/services/shop-type-filter.service';

@Component({
  selector: 'app-custom-search',
  templateUrl: './app-custom-search.component.html',
  styleUrls: ['./app-custom-search.component.scss'],
  animations: [enterLeave],
})
export class AppCustomSearchComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('searchTerm') searchTerm: ElementRef;
  @ViewChild('searchAddress') searchAddress: ElementRef;
  @Input() stateName: string;
  @Input() tableTitle: string;
  @Input() gridNameTitle: string;
  @Input() googleClass: string;
  @Input() googleSearch = false;
  @Input() recordsLength: number;
  @Input() expandedClass: boolean;
  @Input() repairStyle: boolean;
  @Input() truckAndTrailerStyle: boolean;
  @Output() sendChangeStyle: EventEmitter<any> = new EventEmitter();
  @Output() handleAddress: EventEmitter<any> = new EventEmitter();
  @Input() dontShowChips: EventEmitter<boolean> = new EventEmitter();
  private destroy$: Subject<void> = new Subject<void>();
  public chipses: ChipsFilter[] = [];
  public expanded = false;
  public focused = false;
  public addShopMapStyle: boolean;
  addressOption = {
    types: ['(cities)'],
    componentRestrictions: { country: ['US', 'CA'] },
  };
  loadStatusFilter: number[] = [];
  dateFilter: DateFilter[] = [];
  tabFilter: TabFilter[] = [];
  violationGroupFilters: number[] = [];
  shopTypeFilter: any[] = [];

  constructor(
    private searchDateService: SearchDataService,
    private cd: ChangeDetectorRef,
    private dateFilterService: DateFilterService,
    private tabSelectFilterService: TabSelectFilterService,
    private loadStatusFilterService: LoadStatusFilterService,
    private violationGroupFilterService: ViolationGroupFilterService,
    private shopTypeFilterService: ShopTypeFilterService
  ) {}

  ngOnInit() {
    this.expanded = false;

    // SHOP TYPE FILTER
    this.shopTypeFilterService.dataSource
    .pipe(takeUntil(this.destroy$))
    .subscribe((event: any) =>{
      if (event && event.check) {
        this.shopTypeFilter = event.shopTypeFilter;
        this.resetDataSources();
      }
    })

    // DATE FILTER
    this.dateFilterService.dataSource
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: DateFilterEvent) => {
        if (event && event.check) {
          this.dateFilter = event.dateFilter;
          this.resetDataSources();
        }
      });

    // TAB FILTER
    this.tabSelectFilterService.dataSource
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: TabFilterEvent) => {
        if (event && event.check) {
          this.tabFilter = event.tabFilter;
          this.resetDataSources();
        }
      });

    // LOAD STATUS FILTER
    this.loadStatusFilterService.dataSource
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: LoadStatusFilterEvent) => {
        if (event && event.check) {
          this.loadStatusFilter = event.loadStatusFilter;
          this.resetDataSources();
        }
      });

    // VIOLATION GROUP FILTERS
    this.violationGroupFilterService.dataSource
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: ViolationGroupFilterEvent) => {
        if (event && event.active) {
          this.violationGroupFilters = event.violationGroupFilter;
          this.resetDataSources();
        }
      });

    if (this.stateName) {
      this.loadStatusesFilter();
      this.loadTabFilter();
      this.loadDateFilter();
      this.loadChipses();
      this.loadShopTypeFilter();
    }
  }

  ngOnChanges() {
    if (!this.expandedClass) {
      this.addShopMapStyle = true;
    } else {
      this.addShopMapStyle = false;
    }
  }

  loadStatusesFilter() {
    const loadStatusFilter = JSON.parse(
      localStorage.getItem(this.tableTitle + '_loadStatusFilter')
    );
    this.loadStatusFilter = loadStatusFilter ? loadStatusFilter : null;
  }

  private loadViolationGroupFilters() {
    const violationGroupFilter = JSON.parse(localStorage.getItem('_violationGroupFilter'));
    this.violationGroupFilters = violationGroupFilter ? violationGroupFilter : null;
  }

  private loadTabFilter(): void {
    const tabFilter = JSON.parse(localStorage.getItem(this.stateName + '_tabFilter'));
    this.tabFilter = tabFilter && tabFilter.length ? tabFilter : [];
  }

  private loadDateFilter(): void {
    const dateFilter = JSON.parse(localStorage.getItem(this.stateName + '_dateFilter'));
    this.dateFilter = dateFilter && dateFilter.length ? dateFilter : [];
  }

  public loadChipses(): void {
    const chipses = JSON.parse(localStorage.getItem(this.stateName + '_chipses'));
    this.chipses = chipses ? chipses : [];
  }

  private loadShopTypeFilter(): void {
    const shopTypeFilter = JSON.parse(localStorage.getItem(this.stateName + '_shopTypeFilter'));
    this.shopTypeFilter = shopTypeFilter && shopTypeFilter.length ? shopTypeFilter : [];
  }

  private getLoadStatusFilter(): number[] {
    return this.loadStatusFilter ? this.loadStatusFilter : [];
  }

  private getDateFilter(): DateFilter[] {
    return this.dateFilter && this.dateFilter.length ? this.dateFilter : [];
  }

  private getTabFilter(): TabFilter[] {
    return this.tabFilter && this.tabFilter.length ? this.tabFilter : [];
  }

  private getViolationGroupFilters(): number[] {
    return this.violationGroupFilters && this.violationGroupFilters.length
      ? this.violationGroupFilters
      : [];
  }

  private getShopTypeFiter(): any[]{
    return this.shopTypeFilter && this.shopTypeFilter.length ? this.shopTypeFilter : [];
  }

  public resetDataSources(): void {

    if (this.stateName) {
      this.loadStatusesFilter();
      this.loadTabFilter();
      this.loadDateFilter();
      this.loadChipses();
      this.loadShopTypeFilter();
      this.loadViolationGroupFilters();
    }

    if (this.searchTerm?.nativeElement) {
      this.searchTerm.nativeElement.value = null;
    }

    if (this.searchAddress?.nativeElement) {
      this.searchAddress.nativeElement.value = null;
    }

    if (this.chipses.length) {
      this.chipses.forEach(() => {
        this.searchDateService.dataSource.next({
          searchFilter: {
            chipsFilter: this.chipses[this.chipses.length - 1],
            dateFilter: this.getDateFilter(),
            tabFilter: this.getTabFilter(),
            loadStatusFilter: this.getLoadStatusFilter(),
            violationGroupFilter: this.getViolationGroupFilters(),
            shopTypeFilter: this.getShopTypeFiter(),
          },
          check: true,
        });
      });
    } else {
      this.searchDateService.dataSource.next({
        searchFilter: {
          chipsFilter: null,
          dateFilter: this.getDateFilter(),
          tabFilter: this.getTabFilter(),
          loadStatusFilter: this.getLoadStatusFilter(),
          violationGroupFilter: this.getViolationGroupFilters(),
          shopTypeFilter: this.getShopTypeFiter(),
        },
        check: true,
      });
    }
  }

  public resetDataSourcesForRemove(): void {
    this.chipses.map((chip, key) => {
      if (key === 0) {
        chip.words = [
          {
            index: chip.index,
            text: chip.label,
          },
        ];
      } else {
        chip.words = this.chipses.map((c: ChipsFilter, k: number) => {
          const item: HighlightText = {
            index: c.index,
            text: c.label,
          };
          return item;
        });
      }
      this.searchDateService.resetPageSizeDataSource.next(true);
      this.searchDateService.dataSource.next({
        searchFilter: {
          chipsFilter: chip,
          dateFilter: this.getDateFilter(),
          tabFilter: this.getTabFilter(),
          loadStatusFilter: this.getLoadStatusFilter(),
          violationGroupFilter: this.getViolationGroupFilters(),
          shopTypeFilter: this.getShopTypeFiter(),
        },
        check: true,
      });
      return chip;
    });
  }

  public onRemove(index: number): void {
    this.chipses.splice(index, 1);

    this.cd.detectChanges();

    localStorage.setItem(this.stateName + '_chipses', JSON.stringify(this.chipses));

    if (this.chipses.length) {
      this.resetDataSourcesForRemove();
    } else {
      this.searchDateService.resetPageSizeDataSource.next(true);
      this.searchDateService.dataSource.next({
        searchFilter: {
          chipsFilter: null,
          dateFilter: this.getDateFilter(),
          tabFilter: this.getTabFilter(),
          loadStatusFilter: this.getLoadStatusFilter(),
          violationGroupFilter: this.getViolationGroupFilters(),
          shopTypeFilter: this.getShopTypeFiter(),
        },
        check: true,
      });
    }
  }

  public onAdd(inputLabel: string): void {
    this.searchTerm.nativeElement.value = null;
    this.chipses.push({
      label: inputLabel.trim(),
      removable: true,
      removeIcon: 'fad fa-times-circle fs-10',
      index: this.getIndex(0),
      init: false,
      words: [],
    });
    this.chipses[this.chipses.length - 1].words = this.chipses.map((chip: ChipsFilter) => {
      const item: HighlightText = {
        index: chip.index,
        text: chip.label,
      };
      return item;
    });
    localStorage.setItem(this.stateName + '_chipses', JSON.stringify(this.chipses));
    this.searchDateService.resetPageSizeDataSource.next(true);
    this.searchDateService.dataSource.next({
      searchFilter: {
        chipsFilter: this.chipses[this.chipses.length - 1],
        dateFilter: this.dateFilter,
        tabFilter: this.getTabFilter(),
        loadStatusFilter: this.getLoadStatusFilter(),
        violationGroupFilter: this.getViolationGroupFilters(),
        shopTypeFilter: this.getShopTypeFiter(),
      },
      check: true,
    });
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (this.chipses.length) {
      this.searchDateService.resetPageSizeDataSource.next(true);
      this.searchDateService.dataSource.next({
        searchFilter: {
          chipsFilter: {
            label: filterValue.trim(),
            removable: true,
            removeIcon: 'fad fa-times-circle fs-10',
            index: this.getIndex(0),
            init: false,
            words: [
              ...this.chipses[this.chipses.length - 1].words,
              {
                index: this.getIndex(0),
                text: filterValue.trim(),
              },
            ],
          },
          dateFilter: this.dateFilter,
          tabFilter: this.getTabFilter(),
          loadStatusFilter: this.getLoadStatusFilter(),
          violationGroupFilter: this.getViolationGroupFilters(),
          shopTypeFilter: this.getShopTypeFiter(),
        },
        check: true,
      });
    } else {
      this.searchDateService.resetPageSizeDataSource.next(true);
      this.searchDateService.dataSource.next({
        searchFilter: {
          chipsFilter: {
            label: filterValue.trim(),
            removable: true,
            removeIcon: 'fad fa-times-circle fs-10',
            index: this.getIndex(0),
            init: true,
            words: [
              {
                index: this.getIndex(0),
                text: filterValue.trim(),
              },
            ],
          },
          dateFilter: this.getDateFilter(),
          tabFilter: this.getTabFilter(),
          loadStatusFilter: this.getLoadStatusFilter(),
          violationGroupFilter: this.getViolationGroupFilters(),
          shopTypeFilter: this.getShopTypeFiter(),
        },
        check: true,
      });
    }
  }

  public resetSearchFiled(): void {
    this.searchTerm.nativeElement.value = null;
    this.searchAddress.nativeElement.value = null;
    this.searchDateService.resetPageSizeDataSource.next(true);
    this.searchDateService.dataSource.next({
      searchFilter: {
        chipsFilter: this.chipses.length ? this.chipses[this.chipses.length - 1] : null,
        dateFilter: this.getDateFilter(),
        tabFilter: this.getTabFilter(),
        loadStatusFilter: this.getLoadStatusFilter(),
        violationGroupFilter: this.getViolationGroupFilters(),
        shopTypeFilter: this.getShopTypeFiter(),
      },
      check: true,
    });
  }

  public getIndex(index: number): number {
    if (this.chipses.length) {
      if (this.chipses.some((chip: ChipsFilter) => chip.index === index) && index < 3) {
        index++;
        return this.getIndex(index);
      }
    }
    return index;
  }

  public autoFocus(): void {
    this.expanded = !this.expanded;
    const selectedInput = this.googleSearch ? this.searchAddress : this.searchTerm;
    this.sendChangeStyle.emit({ changeStyle: this.expanded });
    this.cd.detectChanges();
    if (this.expanded) {
      selectedInput.nativeElement.value = null;
      selectedInput.nativeElement.focus();
      this.cd.detectChanges();
    } else {
      if (selectedInput.nativeElement.value) {
        selectedInput.nativeElement.value = null;
        this.searchDateService.resetPageSizeDataSource.next(true);
        this.searchDateService.dataSource.next({
          searchFilter: {
            chipsFilter: this.chipses.length ? this.chipses[this.chipses.length - 1] : null,
            dateFilter: this.getDateFilter(),
            tabFilter: this.getTabFilter(),
            loadStatusFilter: this.getLoadStatusFilter(),
            violationGroupFilter: this.getViolationGroupFilters(),
            shopTypeFilter: this.getShopTypeFiter(),
          },
          check: true,
        });
      } else {
        selectedInput.nativeElement.value = null;
      }
    }
  }

  public canAddFilter(): boolean {
    return (
      this.recordsLength &&
      this.chipses.length < 3 &&
      this.searchTerm &&
      this.searchTerm.nativeElement.value.trim()
    );
  }

  public ngOnDestroy(): void {
    this.searchDateService.resetPageSizeDataSource.next(true);
    // this.searchDateService.dataSource.next({
    //   searchFilter: {
    //     chipsFilter: null,
    //     dateFilter: this.getDateFilter(),
    //     tabFilter: this.getTabFilter(),
    //     loadStatusFilter: this.getLoadStatusFilter(),
    //     violationGroupFilter: this.getViolationGroupFilters(),
    //     shopTypeFilter: this.getShopTypeFiter(),
    //   },
    //   check: true,
    // });
    this.destroy$.next();
    this.destroy$.complete();
  }

  // enter search
  public enterSearch(search): void {
    if (this.canAddFilter() && !this.dontShowChips) {
      this.onAdd(search.value);
    }
  }

  showPacContainer(e) {
    this.focused = true;
    // TODO: izbaciti Jquery i timeout
    setTimeout(() => {
      document.querySelectorAll('.pac-container').forEach((element) => {
        element.classList.add(this.googleClass);
      });
    }, 200);
  }

  removePacClass(e) {
    this.focused = false;
    document.querySelectorAll('.pac-container').forEach((element) => {
      element.classList.remove(this.googleClass);
    });
  }

  public handleAddressChange(address: any, key?: any) {
    if (address.address_components) {
      this.searchAddress.nativeElement.value = null;
      this.handleAddress.emit(address);
    }
  }
}
