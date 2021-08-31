import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { ToastrService } from 'ngx-toastr';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  SwitchItem,
  TableColumnDefinition,
  TableData,
  TableOptions,
  TableSubject,
} from './models/truckassist-table';
import { SearchDataService } from 'src/app/core/services/search-data.service';
import { SearchFilterEvent } from 'src/app/core/model/shared/searchFilter';
import { environment } from 'src/environments/environment';
import { AppCustomSearchComponent } from '../app-custom-search/app-custom-search.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserObject, UserState } from 'src/app/core/model/user';
import {
  GridCompression,
  GridCompressionService,
} from 'src/app/core/services/grid-compression.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ActiveItem, DeletedItem } from 'src/app/core/model/shared/enums';
import { MaintenanceService } from 'src/app/core/services/maintenance.service';
import { Comments } from 'src/app/core/model/comment';
import { NewLabel } from 'src/app/core/model/label';
import * as AppConst from './../../const';

import { listAnimation, expandCollapse, expandContainerCollapse } from './helpers/animations';
import { ClonerService } from 'src/app/core/services/cloner-service';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { DeleteDialogComponent } from 'src/app/shared/delete-dialog/delete-dialog.component';
import { Router } from '@angular/router';
import { ContactAccountService } from '../../core/services/contactaccount.service';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { LabelsFilterService } from '../../core/services/labels-filter.service';
import { DateFilterService } from 'src/app/core/services/date-filter.service';
import { DateFilter } from 'src/app/core/model/date-filter';
import moment from 'moment';
import { AppUserService } from 'src/app/core/services/app-user.service';
import { UserProfile } from 'src/app/core/model/user-profile';
import { TruckassistDateFilterComponent } from '../truckassist-date-filter/truckassist-date-filter.component';
import {
  animateDataCountFromTo,
  getRepairTypesData,
  mapUserData,
} from 'src/assets/utils/methods-global';
import { delay, mapTo, takeUntil } from 'rxjs/operators';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { RoutingFullscreenService } from 'src/app/core/services/routing-fullscreen.service';
import { TabFilter } from 'src/app/core/model/tab-filter';
import { TruckassistActionStackComponent } from '../truckassist-action-stack/truckassist-action-stack.component';
import { LoadStatusFilterComponent } from '../load-status-filter/load-status-filter.component';
import { ViolationTooltipComponent } from '../violation-tooltip/violation-tooltip.component';
import { SubItemsSwitchService } from 'src/app/core/services/subitems-switch-service';
import { ShopTypeFilterService } from 'src/app/core/services/shop-type-filter.service';
import { ViolationGroupFilterComponent } from '../violation-group-filter/violation-group-filter.component';
import { CellTemplatesComponent } from './cell-templates/cell-templates.component';
import { ViolationListTooltipService } from 'src/app/core/services/violation-list-tooltip.service';

export type SortDirection = 'desc' | 'asc' | '';
const rotate: { [key: string]: SortDirection } = {
  asc: '',
  desc: 'asc',
  '': 'desc',
};

@Component({
  selector: 'app-truckassist-table',
  templateUrl: './truckassist-table.component.html',
  styleUrls: ['./truckassist-table.component.scss'],
  animations: [listAnimation, expandCollapse, expandContainerCollapse],
})
export class TruckassistTableComponent implements OnInit, OnDestroy, AfterViewInit {
  /****** Properties ********/

  @ViewChild('cellTemplates') cellTemplates: CellTemplatesComponent;

  @ViewChild('exportTruckassistTable') exportTruckassistTable: ElementRef;
  @ViewChild('truckassistTable') truckassistTable: ElementRef;
  @ViewChild(AppCustomSearchComponent)
  customSearchComponent: AppCustomSearchComponent;
  @ViewChild(TruckassistDateFilterComponent)
  truckassistDateFilterComponent: TruckassistDateFilterComponent;
  @ViewChild(LoadStatusFilterComponent)
  loadStatusFilterComponent: LoadStatusFilterComponent;
  @ViewChild(ViolationGroupFilterComponent)
  violationGroupFilterComponent: ViolationGroupFilterComponent;
  @ViewChildren('editComment') editComent: QueryList<ElementRef>;
  @ViewChild(TruckassistActionStackComponent)
  truckassistActionStackComponent: TruckassistActionStackComponent;
  @Output() actionEvent: EventEmitter<any> = new EventEmitter();
  @Output() deleteEvent: EventEmitter<any> = new EventEmitter();
  @Output() typeSelected: EventEmitter<number> = new EventEmitter();
  @Output() allTypsDeselected: EventEmitter<any> = new EventEmitter();
  @Output() pinShop: EventEmitter<any> = new EventEmitter();
  @Output() justLikeOrDislike: EventEmitter<any> = new EventEmitter();
  @Output() reitingReveiw: EventEmitter<any> = new EventEmitter();
  @Output() commentChange: EventEmitter<any> = new EventEmitter();
  @Output() deleteComment: EventEmitter<any> = new EventEmitter();
  @Output() editUser: EventEmitter<any> = new EventEmitter();
  @Output() openShopComments: EventEmitter<any> = new EventEmitter();
  @Output() sendShopData: EventEmitter<any> = new EventEmitter();
  @Output() shopMode: EventEmitter<any> = new EventEmitter();
  @Output() switchRepairTabelView: EventEmitter<any> = new EventEmitter();
  @Input() options: TableOptions;
  @Input() loadingItems: boolean;
  @Input() useSwitchTabEvent: any;
  @Input() toolsTableTitle: string;

  private destroy$: Subject<void> = new Subject<void>();
  public viewData: Array<any> = [];
  public filteredData: Array<any> = [];
  // public exportData: Array<any> = [];
  public openUnitDrop: boolean;

  // private subscriptions: Subscription[] = [];

  public columns: TableColumnDefinition[] = [];
  // public exportColumns: TableColumnDefinition[] = [];
  public previousIndex: number;

  public tableData: TableData[] = [];
  public selectedTab = 'active';

  // for front pagination
  public tempPageSize = 20;
  public pageSize = 20;
  public skip = 0;
  public showMoreVisible = true;
  public highlightingWords = [];

  public mySelection: DeletedItem[] = [];
  public activeItems: ActiveItem[] = [];
  public selectedViewItems = false;

  public deletePlaceholder = 'Delete all';
  public emailPlaceholder = 'Email all';
  public printPlaceholder = 'Print all';
  public deleteType = '';

  // public printerFriendly = false;
  // public exportFormGroup: FormGroup;
  // public submitted = false;

  public loggedUser: UserObject = null;
  public locked = true;
  public expanded = false;
  // public export = false;

  public checked = false;

  public tooltip: any;
  loadStatuses = AppConst.LOAD_STATUS;
  // LOAD_STATUS_ARRAY = AppConst.LOAD_STATUS_ARRAY;

  public showTypes = false;
  public selectedType: boolean;
  public visibleReveiw = -1;
  public moveWriteReveiw: boolean;
  public visiblComments = -1;
  public reveiw: string;
  public comments: Comments[] = [];
  public reiting: any[] = [];
  public showDelivery = -1;
  public isReveiwOpen = false;
  public clickOnRewue = false;
  public isCommentsOpen = false;
  public clickOnComments = false;
  public showFilter = false;
  public copyText: boolean;
  public visibleCopy = -1;
  public visiblePassword = -1;
  public showCommentOption = -1;
  public showDeleteComent = -1;
  public showComentEdit = -1;
  public commentEdit: string;
  public optionsOnCommentsOpen = 0;
  public commentToDelete: number;
  public shop;
  public hideToolBar: boolean;
  public hideTabs: boolean;
  public showToolsDowpDown: boolean;
  public showTabs = true;
  public allowSelect: boolean;
  public showUnitSwitch: boolean;
  public switchUnitData: any;
  public type: string;
  public keywordForSwich: string;
  public showResetConfirmation = false;
  public touched = false;
  public extendedTableTouched = false;
  public showUserQuestion = -1;
  public preventSendUserData: boolean;
  public isLike: boolean;
  public isPin: boolean;
  public shopPined = -1;
  public clickedOnResult: boolean;
  public liked = -1;
  public disLiked = -1;
  public switchOpenNotes: boolean;
  public indexOfShop: number;
  dontShowChips = false;
  isBroker: string;

  // Labels
  public labels: NewLabel[] = [];
  public availableColors: any;
  public resetSortDirection = true;

  currentUser: any;
  userHasComments = true;
  showWriteReveiw = false;
  checkComments = false;
  showDeleteActionDialog = -1;
  decryptedPassword: any[] = [];
  showPass: any[] = [];

  // RESIZER
  pressed = false;
  currentResizeIndex: number;
  startX: number;
  startWidth: number;
  isResizingRight: boolean;
  tableHeight = 100;
  resizableMousemove: () => void;
  resizableMouseup: () => void;
  public showSubtitle = true;
  public subtitleProgress = 0;
  public subtitleInterval;

  private compressTouch = false;
  // public loading = true;
  private sortColumn: TableColumnDefinition = null;
  private checkSorting = false;
  public total = 0;

  public filterByCustomer: string;
  setChecked: boolean;
  public dateFilter: DateFilter[] = [];
  public tabFilter: TabFilter[] = [];
  public loadStatusFilter: number[] = [];
  public violationGroupFilter: number[] = [];
  public shopTypeFilter: any[] = [];
  countOfEnter = 0;

  public lockProgress = 0;
  public lockInterval;

  filterYears: number[] = [];
  descriptionInViewport = true;
  noCount;

  digit = -1;
  currentDataCount: number;

  public viewMode = 'ListView';
  showShopMap = false;

  public stateName = '';
  public tableTitle = '';
  public gridNameTitle = '';
  public gridCoumns: TableColumnDefinition[] = [];
  public extendedGridColumns: TableColumnDefinition[] = [];
  public switchItems?: SwitchItem[] = [];
  public selectedSubTab = '';
  public showExpandedContainer = -1;
  public showDescription = -1;

  /* Show Violation Tooltip */
  violationTooltipIndex = 0;
  violationTooltipRowIndex = 0;
  showViolationTooltipModal = false;

  /* Repair Variables */
  types = getRepairTypesData();
  testNoResults: boolean;

  /****** End Properties ********/

  constructor(
    private changeRef: ChangeDetectorRef,
    private toastr: ToastrService,
    private searchDateService: SearchDataService,
    private gridCompressionService: GridCompressionService,
    private sharedService: SharedService,
    private elmentRef: ElementRef,
    private maintenanceService: MaintenanceService,
    private customModalService: CustomModalService,
    private router: Router,
    private contactAccountService: ContactAccountService,
    private renderer: Renderer2,
    private labelService: LabelsFilterService,
    private userService: AppUserService,
    private mapModeServise: RoutingFullscreenService,
    private subItemsSwitchService: SubItemsSwitchService,
    private shopTypeFilterService: ShopTypeFilterService,
    private tooltipViolation: ViolationListTooltipService
  ) {
    if (this.stateName === 'violations') {
      this.tooltipViolation.tooltip$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
        this.showViolationTooltipModal = data.tooltip;
        this.violationTooltipIndex = data.index;
        this.violationTooltipRowIndex = data.rowIndex;
      });
    }
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // TODO: proveriti ovaj switch
    if (this.maintenanceService.tabShop) {
      this.selectedTab = null;
      this.checked = this.selectedTab === null;
      this.maintenanceService.tabShop = false;
    } else {
      this.checked = this.selectedTab === 'active';
    }
    this.getLoggedUser();

    this.sharedService.emitDeleteAction.pipe(takeUntil(this.destroy$)).subscribe((resp: any) => {
      if (resp && resp.data?.name === 'delete') {
        this.deleteSelectedItems();
      }
    });

    this.sharedService.emitDeleteItemAnimationAction
      .pipe(delay(100), takeUntil(this.destroy$))
      .subscribe((success: any[]) => {
        if (success && success.length) {
          for (const id of success) {
            const index = this.filteredData.findIndex((d) => d.id === id);
            if (index !== -1) {
              this.filteredData[index].animationType =
                this.filteredData[index].animationType === 'delete-item' ? 'delete-active' : '';
            }
          }
        }
      });

    this.sharedService.emitAddItemAnimationAction
      .pipe(delay(100), takeUntil(this.destroy$))
      .subscribe((id: number) => {
        if (id) {
          const index = this.filteredData.findIndex((d) => d.id === id);
          if (index !== -1) {
            this.filteredData[index].animationType =
              this.filteredData[index].animationType === 'new-item' ? 'new-active' : '';
          }
        }
      });

    this.sharedService.emitUpdateStatusAnimationAction
      .pipe(delay(100), takeUntil(this.destroy$))
      .subscribe((success: any[]) => {
        if (success && success.length) {
          for (const id of success) {
            const index = this.filteredData.findIndex((d) => d.id === id);
            if (index !== -1) {
              this.filteredData[index].animationType =
                this.filteredData[index].animationType === 'update-item'
                  ? this.filteredData[index].status === 1
                    ? 'update-active'
                    : 'update-inactive'
                  : '';
            }
          }
        }
      });
  }

  ngAfterViewInit(): void {
    this.options.data.pipe(takeUntil(this.destroy$)).subscribe((tableSubject: TableSubject) => {
      if (tableSubject && tableSubject.check) {
        this.tableData = tableSubject.tableData;
        // set state properties
        this.fillStateProperties(true);

        // Check Active Users
        if (!this.options.toolbarActions.hideSelectNumber && this.tableData) {
          this.checkActiveItems();
        }

        if (this.options.useAdditionalFeatures) {
          this.additionalFeatures();
        }

        this.customSearchComponent.resetDataSources();
      }
    });

    this.searchDateService.resetPageSizeDataSource.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.pageSize = 20;
    });

    this.searchDateService.dataSource
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: SearchFilterEvent) => {
        if (this.tableData.length && event && event.check) {
          this.loadingItems = true;
          this.compressTouch = false;

          // set state properties
          this.fillStateProperties();

          // SEARCH FILTER
          this.highlightingWords =
            event.searchFilter && event.searchFilter.chipsFilter
              ? event.searchFilter.chipsFilter.words
              : [];
          // DATE FILTER
          this.dateFilter =
            event.searchFilter && event.searchFilter.dateFilter
              ? event.searchFilter.dateFilter
              : [];
          // TAB FILTER
          this.tabFilter =
            event.searchFilter && event.searchFilter.tabFilter ? event.searchFilter.tabFilter : [];
          // LOAD STATUS FILTER
          this.loadStatusFilter =
            event.searchFilter && event.searchFilter.loadStatusFilter
              ? event.searchFilter.loadStatusFilter
              : [];
          // VIOLATION GROUP FILTER
          this.violationGroupFilter =
            event.searchFilter && event.searchFilter.violationGroupFilter
              ? event.searchFilter.violationGroupFilter
              : [];
          // SHOP TYPE
          this.shopTypeFilter =
            event.searchFilter && event.searchFilter.shopTypeFilter
              ? event.searchFilter.shopTypeFilter
              : [];

          // PM FILTER
          this.changeRef.detectChanges();
          this.filteringDataByStatus();

          // add checkLabelFilters inb options object for specific table
          //TODO: Izmeni
          this.getLabelFilters();

          if (
            this.truckassistTable &&
            this.truckassistTable.nativeElement.parentNode.clientWidth &&
            this.stateName
          ) {
            this.setTableResize(this.truckassistTable.nativeElement.parentNode.clientWidth);
          }

          this.loadingItems = false;
        }
      });

    this.gridCompressionService.currentDataSource
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: GridCompression) => {
        if (data && data.checked) {
          this.expanded = data.expanded;
          this.compressTouch = true;
          this.changeRef.detectChanges();
        }
      });

    this.sharedService.emitCloseNote.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (this.tooltip !== undefined && res) {
        this.tooltip.close();
      }
    });

    this.sharedService.emitAllNoteOpened.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.switchOpenNotes = res;
    });

    this.labelService.labelsFilter.pipe(takeUntil(this.destroy$)).subscribe((res: NewLabel[]) => {
      if (res) {
        this.filteringDataByStatus();
        this.checkLabelFilters(res);
      }
    });

    this.userService.updatedUser.pipe(takeUntil(this.destroy$)).subscribe((user: UserProfile) => {
      const index = this.viewData.findIndex((t) => t.id === user.id);

      if (index !== -1) {
        this.viewData[index] = mapUserData(user);
        this.viewData[index].error = false;

        const activeItemIndex = this.activeItems.findIndex((a) => a.id === user.id);
        if (user.enabled) {
          if (activeItemIndex === -1) {
            this.activeItems.push({ id: user.id });
          }
        } else {
          if (activeItemIndex !== -1) {
            this.activeItems.splice(activeItemIndex, 1);
          }
        }
      }
    });
  }

  getTemplate(ngTemplateName: string): TemplateRef<any> {
    return this.cellTemplates.getTemplate(ngTemplateName);
  }

  getContext(row: any, column: TableColumnDefinition, index: number, rowIndex?: number): any {
    return {
      row: row,
      column: column,
      i: index,
      scope: this,
      j: rowIndex,
    };
  }

  public downloadData() {
    alert('WIP');
  }

  private fillStateProperties(switching?: boolean) {
    const td = this.tableData.find((t) => t.field === this.selectedTab);

    /* Reset Page Size For Map View */
    if (this.viewMode === 'MapView') {
      this.pageSize = td.data.length;
    }

    if (switching) {
      this.switchItems = td.items && td.items.length ? td.items : [];
    }
    this.selectedSubTab = this.switchItems.find((si) => si.selected)?.field;
    this.gridCoumns = td.gridColumns;
    this.extendedGridColumns = td.extendedGridColumns;
    this.columns = this.expanded
      ? this.extendedGridColumns.filter((c) => !c.hidden)
      : this.gridCoumns.filter((c) => !c.hidden);
    this.stateName = td.stateName;
    this.tableTitle = td.title;
    this.gridNameTitle = td.gridNameTitle;
    this.changeRef.detectChanges();
  }

  private getLabelFilters(): void {
    const labelFilters = JSON.parse(localStorage.getItem(this.options.type + '_filter'));
    if (labelFilters && labelFilters.length) {
      this.checkLabelFilters(labelFilters);
    }
  }

  private checkLabelFilters(res) {
    const tempArray = [];
    if (res.length) {
      res.forEach((text) => {
        tempArray.push(text.labelId);
      });
    }
    if (tempArray.length) {
      for (const i of tempArray) {
        this.filteredData = this.filteredData.filter((x) => x.labelId !== i);
      }
      this.viewData = this.filteredData.slice(this.skip, this.skip + this.pageSize);
    }
    setTimeout(() => {
      animateDataCountFromTo('data-animate', this.digit, this.filteredData.length, 200);
    }, 500);
  }

  identify(index, item) {
    return item.id;
  }

  public additionalFeatures() {
    // TODO: ovo nije dobro
    for (const td of this.tableData) {
      this.labels = td.labels;
      this.availableColors = td.availableColors;
      this.type = td.type;
      this.noCount = td.noLabelCount;
      // td.hideTabs === true ? (this.showTabs = false) : (this.showTabs = true);
      td.showToolsDropDown === true
        ? (this.showToolsDowpDown = true)
        : (this.showToolsDowpDown = false);
      td.allowSelectRow === true ? (this.allowSelect = true) : (this.allowSelect = false);
      td.showUnitSwitch === true ? (this.showUnitSwitch = true) : (this.showUnitSwitch = false);
      this.switchUnitData = td.swichUnitData;
      this.keywordForSwich = td.keywordForSwich;
      /* if (td?.dontShowChips) {
        this.dontShowChips = true;
      } */
      if (td.isCustomer) {
        this.isBroker = 'Broker';
      }
    }
  }

  get itemsLength(): number {
    return this.getItemsLength();
  }

  @HostListener('document:click', ['$event.target'])
  public onClickOutside(target) {
    const clickedInside = this.elmentRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.showViolationTooltip(0, 0);
    }
  }

  showViolationTooltip(rowIndex, index) {
    if (index !== 0) {
      this.tooltipViolation.changeData({ tooltip: true, rowIndex, index });
    } else {
      this.tooltipViolation.changeData({ tooltip: false, rowIndex, index });
    }
  }

  checkActiveItems(): void {
    const results = this.tableData.find((t) => t.field === this.selectedTab);
    if (results && results.data?.length) {
      this.activeItems = [];

      for (const d of results.data.filter((d) => d.status)) {
        this.activeItems.push({ id: d.id });
      }
    }
  }

  getUserlastName(userFullName: string) {
    let count = 0;
    for (const nameCharacter of userFullName) {
      if (count) {
        return nameCharacter;
      }
      if (nameCharacter === ' ') {
        count = 1;
      }
    }
  }

  onNavigatePage(url: string) {
    window.location.href = url;
  }

  public onShowPassword(index: number, row) {
    this.showPass[index] = !this.showPass[index];
    this.contactAccountService
      .decryptPassword(row.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          this.decryptedPassword[index] = res.password;
        },
        (error: any) => {
          this.sharedService.handleServerError();
        }
      );
  }

  /* Copy text function */
  public onCopy(index: number, val: string) {
    this.copyText = true;
    if (this.visibleCopy === index) {
      this.visibleCopy = -1;
    } else {
      this.visibleCopy = index;
    }

    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    let count = 0;
    const interval = setInterval(() => {
      this.copyText = false;
      this.visibleCopy = -1;
      count++;
      if (count === 1) {
        clearInterval(interval);
      }
    }, 600);
  }

  public onShowFilter() {
    this.showFilter = true;
  }

  public onShowDel(index: number) {
    if (this.showDelivery === index) {
      this.showDelivery = -1;
    } else {
      this.showDelivery = index;
    }
  }

  toggleLoadPopup(tooltip: any, data: any) {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open();
    }
  }

  // MAYBE WE NEED TO REMOVE THIS FUNCTION
  public onTypeSelected(index: number) {
    this.types[index].active = !this.types[index].active;

    let types = [];

    for (const type of this.types) {
      if (type.active) {
        types.push(type);
      }
    }
    localStorage.setItem(this.stateName + '_shopTypeFilter', JSON.stringify(types));
    this.shopTypeFilterService.sendDataSource(types, true);
  }

  public onPin(isPin: boolean, shop: any, index: number) {
    /* Pin Item */
    if (isPin) {
      this.pinShop.emit({ shop });
      this.shopPined = index;
    }

    /* Reset Animations */
    let count = 0;
    const interval = setInterval(() => {
      this.shopPined = -1;
      this.disLiked = -1;
      this.liked = -1;
      count++;
      if (count === 1) {
        clearInterval(interval);
      }
    }, 200);
  }

  /*  Checks If Element Is In The Viewport */
  public checkToSeeIfViewport(index: number) {
    const el = document.getElementById(`description-drop_${index}`);

    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  public getLoggedUser(): void {
    const localStorageData = JSON.parse(localStorage.getItem('currentUser'));
    this.loggedUser = localStorageData ? localStorageData : null;

    const state = JSON.parse(localStorage.getItem(this.stateName + '_user_columns_state'));
    this.touched = state && state.touched ? state.touched : false;
    this.extendedTableTouched =
      state && state.extendedTableTouched ? state.extendedTableTouched : false;
  }

  private loadItems(): void {
    this.customSearchComponent.resetDataSources();
  }

  public showMore(): void {
    // this.loading = true;
    this.selectedViewItems = false;
    this.pageSize += this.tempPageSize;
    this.loadItems();
  }

  public getItemsLength(): number {
    return this.tableData.length
      ? this.tableData.find((t) => t.field === this.selectedTab)?.data.length
      : 0;
  }

  public filterCustomerBy(item): void {
    this.filterByCustomer = this.filterByCustomer != item ? item : '';
    this.filteringDataByStatus();
  }

  private filteringDataByStatus(): void {
    const td = this.tableData.find((t) => t.field === this.selectedTab);

    if (td && td.data?.length) {
      this.filteredData = td.data.slice(this.skip, environment.perPage);
      this.filterYears = td?.filterYears ? td.filterYears.sort((a, b) => b - a) : [];
    } else {
      this.filteredData = [];
      this.filterYears = [];
    }

    if (
      this.options.toolbarActions.showDateFilter &&
      this.viewMode !== 'MapView' &&
      this.stateName !== 'violations_summary'
    ) {
      this.truckassistDateFilterComponent.reloadDateFilterGroups(this.filterYears);
    }

    // TODO: proveriti da li je potrebno da se radi dodatno filtriranje
    if (this.selectedTab == 'active' && this.filterByCustomer) {
      this.filteredData = this.tableData[0].filterData[this.filterByCustomer];
    }

    const pinnedData = this.filteredData.filter((d) => d.pinned);
    let unpinnedData = this.filteredData.filter((d) => !d.pinned);

    if (this.checkSorting && this.sortColumn) {
      unpinnedData = this.options.config.sortDirection
        ? unpinnedData.sort((a, b) => {
            let res;
            if (this.sortColumn.progress) {
              res = this.compare(
                this.getValueByField(a, this.sortColumn.field)
                  ? new Date(this.getValueByField(a, this.sortColumn.field))
                  : null,
                this.getValueByField(b, this.sortColumn.field)
                  ? new Date(this.getValueByField(b, this.sortColumn.field))
                  : null
              );
            } else if (this.sortColumn.isProgress) {
              let e1 = this.getValueByField(a, this.sortColumn.field);
              let e2 = this.getValueByField(b, this.sortColumn.field);
              e1 = e1 ? e1.toString().replace('%', '') : null;
              e2 = e2 ? e2.toString().replace('%', '') : null;
              res = this.compare(e1, e2);
            } else if (this.sortColumn.isDate) {
              const e1 = this.getValueByField(a, this.sortColumn.field);
              const e2 = this.getValueByField(b, this.sortColumn.field);
              const v1 = e1 ? moment(e1.toString()).toDate() : null;
              const v2 = e2 ? moment(e2.toString()).toDate() : null;
              res = this.compare(v1, v2);
            } else if (this.sortColumn.specialColumn) {
              let e1 = this.sortColumn.grossColumn
                ? a[this.sortColumn.field]
                : this.getValueByField(a, this.sortColumn.field);
              let e2 = this.sortColumn.grossColumn
                ? b[this.sortColumn.field]
                : this.getValueByField(b, this.sortColumn.field);
              e1 = e1 ? e1.replace('$', '').replace(/\,/g, '') : null;
              e2 = e2 ? e2.replace('$', '').replace(/\,/g, '') : null;
              res = this.compare(e1 ? Number(e1) : null, e2 ? Number(e2) : null);
            } else {
              res = this.compare(
                this.getValueByField(a, this.sortColumn.field)
                  ? this.getValueByField(a, this.sortColumn.field)
                  : '',
                this.getValueByField(b, this.sortColumn.field)
                  ? this.getValueByField(b, this.sortColumn.field)
                  : ''
              );
            }
            return this.options.config.sortDirection === 'asc' ? res : -res;
          })
        : unpinnedData;
    }

    this.filteredData = [...pinnedData, ...unpinnedData];

    this.checkFilters();
    this.checkTotal();

    let from;
    if (this.currentDataCount === undefined || this.currentDataCount === null) {
      from = this.digit;
    } else {
      from = this.currentDataCount;
    }

    setTimeout(() => {
      animateDataCountFromTo('data-animate', from, this.filteredData.length, 200);
    }, 500);

    this.currentDataCount = this.filteredData.length;
  }

  private checkTotal() {
    this.total = 0;
    this.filteredData.forEach((d) => {
      if (this.mySelection.length) {
        if (this.mySelection.findIndex((s) => s.id === d.id) !== -1) {
          if (d.total) {
            const t = d.total.toString().replace('$', '').replace(',', '');
            this.total += this.financial(t);
          } else if (d.doc && d.doc.total) {
            const t = d.doc.total.replace('$', '').replace(',', '');
            this.total += this.financial(t);
          }
        }
      } else {
        if (d.total) {
          const t = d.total.toString().replace('$', '').replace(',', '');
          this.total += this.financial(t);
        } else if (d.doc && d.doc.total) {
          const t = d.doc.total.replace('$', '').replace(',', '');
          this.total += this.financial(t);
        }
      }
    });
  }

  private financial(x: any): number {
    return Number.parseFloat(x);
  }

  private checkFilters() {
    // search filters
    if (this.highlightingWords.length) {
      this.highlightingWords.forEach((text) => {
        this.onFilter(text.text);
      });
    }

    // date filters
    if (
      this.truckassistDateFilterComponent &&
      this.dateFilter.length &&
      this.options.toolbarActions.showDateFilter
    ) {
      if (this.dateFilter[0].startDate && this.dateFilter[0].endDate) {
        this.filteredData = this.filteredData.filter(
          (fd) =>
            moment(fd[this.dateFilter[0].field]).toDate() >=
              moment(this.dateFilter[0].startDate).toDate() &&
            moment(new Date(fd[this.dateFilter[0].field])).toDate() <=
              moment(this.dateFilter[0].endDate).toDate()
        );
      } else if (this.dateFilter[0].startDate && !this.dateFilter[0].endDate) {
        this.filteredData = this.filteredData.filter((fd) => {
          const d1 = new Date(fd[this.dateFilter[0].field]).toDateString();
          const d2 = new Date(this.dateFilter[0].startDate).toDateString();
          return d1 == d2;
        });
      }
    }

    // TAB FILTER
    if (this.tabFilter.length) {
      const units = this.tabFilter.length ? this.tabFilter : [];
      if (units.length) {
        this.filteredData = this.filteredData.filter(
          (x) => x.doc && x.doc.unit && units.includes(x.doc.unit)
        );
      }
    }

    // LOAD STATUS FILTER
    if (this.loadStatusFilterComponent && this.loadStatusFilter.length) {
      const statuses = this.loadStatusFilter.length ? this.loadStatusFilter : [];
      this.filteredData = this.filteredData.filter(
        (x) => x.statusId != undefined && statuses.includes(x.statusId)
      );
    }

    // VIOLATION GROUP FILTER
    if (this.violationGroupFilter && this.violationGroupFilterComponent) {
      const violationsFilter = this.violationGroupFilter.length ? this.violationGroupFilter : [];
      /* Change the code below after API and real data show up */
      /* If dummy data, testing filtering */
      let sum = 0;
      const length = this.violationGroupFilter.length;
      violationsFilter.forEach((element) => {
        sum += element;
      });
      if (sum < 4) {
        if (sum === 3 && length === 1) {
          this.filteredData = this.filteredData.filter(
            (x) => x.oosStatus !== undefined && x.oosStatus === true
          );
        }
        if (sum === 1 && length === 1) {
          this.filteredData = this.filteredData.filter(
            (x) => x.violationsStatus !== undefined && x.violationsStatus === false
          );
        }
        if (sum === 2 && length === 1) {
          this.filteredData = this.filteredData.filter(
            (x) => x.violationsStatus !== undefined && x.violationsStatus === true
          );
        }
      } else {
        if (sum === 4 && length === 2) {
          this.filteredData = this.filteredData.filter(
            (x) =>
              x.oosStatus !== undefined &&
              x.oosStatus === true &&
              x.violationsStatus !== undefined &&
              x.violationsStatus === false
          );
        }
        if (sum === 5 && length === 2) {
          this.filteredData = this.filteredData.filter(
            (x) =>
              x.oosStatus !== undefined &&
              x.oosStatus === true &&
              x.violationsStatus !== undefined &&
              x.violationsStatus === true
          );
        }
        if (sum === 6 && length === 3) {
          this.filteredData = this.filteredData.filter(
            (x) => x.oosStatus !== undefined && x.oosStatus === true
          );
        }
      }
    }

    // SHOP TYPE FILTER
    if (this.shopTypeFilter.length) {
      const types = this.shopTypeFilter.length ? this.shopTypeFilter : [];
      let shopData = [];
      let count = 0;
      for (let i = 0; i < this.filteredData.length; i++) {
        for (let j = 0; j < this.filteredData[i].doc?.types?.length; j++) {
          for (let k = 0; k < types.length; k++) {
            if (
              types[k].option === this.filteredData[i].doc.types[j].name &&
              this.filteredData[i].doc.types[j].checked
            ) {
              count++;
            }
          }
        }
        if (count === types.length) {
          shopData.push(this.filteredData[i]);
        }
        count = 0;
      }

      this.filteredData = shopData;
    }

    this.viewData = this.filteredData.slice(this.skip, this.skip + this.pageSize);

    this.viewData = this.viewData.map((d) => {
      d.error = false;
      d.expandedRow = false;
      // important for animation
      d.animationType =
        d.animationType === 'update-active' || d.animationType === 'update-inactive'
          ? ''
          : d.animationType;
      d.isSelected = this.mySelection.findIndex((a) => a.id === d.id) !== -1;
      return d;
    });

    this.changeRef.markForCheck();
    this.showExpandedContainer = -1;
  }

  public onFilter(inputValue: string): void {
    if (inputValue) {
      this.filteredData = this.filteredData.filter((d) => {
        let response = false;
        for (const column of this.columns) {
          const value = this.getValueByField(d, column.field);
          response =
            column.field &&
            column.filterable &&
            value &&
            value.toString().toLowerCase().includes(inputValue.toLowerCase());

          if (column.objectIn) {
            const docItems = d.doc.items;
            if (docItems && docItems.length) {
              for (const item of docItems) {
                const nestedItem = item && item.item ? item.item : null;
                if (nestedItem) {
                  response = nestedItem.toString().toLowerCase().includes(inputValue.toLowerCase());
                  if (response) {
                    break;
                  }
                }
              }
            }
          }

          if (response) {
            break;
          }
        }
        return response;
      });
    }
  }

  public resetDataSources(): void {
    this.highlightingWords = [];
    this.customSearchComponent.resetDataSources();
  }

  public switchTab(tab: string): void {
    this.pageSize = 20;
    this.showMoreVisible = true;
    this.selectedTab = tab;
    if (tab === 'payroll') {
      location.href = 'accounting/payroll';
    }
    this.showShopMap = false;
    // TODO: proveriti ove evente ako postoji drugi nacin da ih izbacimo
    this.shopMode.emit(false);
    this.checked = this.selectedTab === 'active';

    /**** TODO: remove this event ****/
    // if (this.useSwitchTabEvent?.use) {
    //   this.switchTabEvent.emit({ type: 'switch-tab-event', selectedTab: this.selectedTab });
    // }
    // TODO:
    if (this.tableData[0].isCustomer) {
      if (this.selectedTab === 'active') {
        this.isBroker = 'Broker';
      } else {
        this.isBroker = 'Shipper';
      }
    }
    /**** END remove this event ****/

    const td = this.tableData.find((t) => t.field === this.selectedTab);

    this.stateName = td.stateName;
    if (this.stateName === 'violations_summary') {
      this.viewMode = 'ListView';
    }
    this.tableTitle = td.title;
    this.changeRef.detectChanges();

    // RESET LOAD STATUSES DROPDOWN ITEMS
    if (this.loadStatusFilterComponent) {
      this.loadStatusFilterComponent.loadStatuses(td.title);
    }

    // RESET SELECTED ITEMS AND DATA SOURCES
    if (this.customSearchComponent) {
      this.onDeselectSelected();
      this.customSearchComponent.resetDataSources();
    }
  }

  drop(event: CdkDragDrop<string[]>): void {
    this.lockProgress = 0;
    const firstIndex = this.expanded
      ? this.extendedGridColumns.findIndex(
          (c) => c.field === this.columns[event.previousIndex].field
        )
      : this.gridCoumns.findIndex((c) => c.field === this.columns[event.previousIndex].field);

    const secondIndex = this.expanded
      ? this.extendedGridColumns.findIndex(
          (c) => c.field === this.columns[event.currentIndex].field
        )
      : this.gridCoumns.findIndex((c) => c.field === this.columns[event.currentIndex].field);

    moveItemInArray(
      this.expanded ? this.extendedGridColumns : this.gridCoumns,
      firstIndex,
      secondIndex
    );

    if (this.expanded) {
      this.extendedTableTouched = true;
    } else {
      this.touched = true;
    }

    // UPDATE COLUMN STATE BASED ON STATENAME
    if (this.stateName) {
      this.updateColumnsState();
    }

    this.customSearchComponent.resetDataSources();
  }

  public onDeselectSelected(): void {
    this.mySelection = [];
    this.selectedViewItems = false;

    this.viewData = this.viewData.map((d) => {
      d.isSelected = false;
      d.animationType = '';
      const index = this.mySelection.findIndex((selection) => d.id === selection.id);
      if (index !== -1) {
        this.mySelection.splice(index, 1);
      }
      return d;
    });

    this.checkTotal();
  }

  public onSelectVisibleItems(): void {
    this.truckassistActionStackComponent.setExportMode('Visible');
    this.mySelection = [];
    this.selectedViewItems = true;

    for (let i = 0; i < this.viewData.length; i++) {
      this.viewData[i].isSelected = this.selectedViewItems;
      if (this.viewData[i].isSelected) {
        this.deleteType = 'visible';
        this.deletePlaceholder = 'Delete visible';
        this.emailPlaceholder = 'Email visible';
        this.printPlaceholder = 'Print visible';
        this.mySelection.push({ id: this.viewData[i].id });
      } else {
        const index = this.mySelection.findIndex(
          (selection) => this.viewData[i].id === selection.id
        );
        if (index !== -1) {
          this.mySelection.splice(index, 1);
        }
      }
    }
    this.checkTotal();
  }

  public onSelectItem(event: any, rowIndex: number): void {
    const isUser = event.userType ? true : false;
    this.deleteType = 'custom';
    this.deletePlaceholder = 'Delete selected';
    this.emailPlaceholder = 'Email selected';
    this.printPlaceholder = 'Print selected';
    if (!isUser) {
      if (event.isSelected) {
        this.mySelection.push({ id: event.id });
      } else {
        this.filteredData[rowIndex].animationType = '';
        const index = this.mySelection.findIndex((selection) => event.id === selection.id);
        if (index !== -1) {
          this.mySelection.splice(index, 1);
        }
      }
    }
    this.checkTotal();
  }

  public getValueByField(row: any, field: string): string {
    return this.byString(row, field);
  }

  private byString(inputObject: any, inputString: string) {
    inputString = inputString.replace(/\[(\w+)\]/g, '.$1');
    inputString = inputString.replace(/^\./, '');
    const a = inputString.split('.');
    for (let i = 0, n = a.length; i < n; ++i) {
      const k = a[i];
      if (k in inputObject) {
        if (inputObject[k]) {
          inputObject = inputObject[k];
        } else {
          return;
        }
      } else {
        return;
      }
    }
    return inputObject;
  }

  public getAvatarByField(inputObject: any, inputString: string): string {
    inputString = inputString.replace(/\[(\w+)\]/g, '.$1');
    inputString = inputString.replace(/^\./, '');
    const a = inputString.split('.');

    a.forEach((element) => {
      inputObject = inputObject && inputObject[element] ? inputObject[element] : null;
    });

    return inputObject && typeof inputObject === 'string' ? inputObject : '';
  }

  // private isBase64(input: string): boolean {
  //   const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  //   return base64regex.test(input);
  // }

  public sortHeaderClick(column: TableColumnDefinition): void {
    if (column.field && column.sortable && this.locked && this.viewData.length > 1) {
      // this.loading = true;
      this.options.config.sortBy = column.field;
      this.options.config.sortDirection = rotate[this.options.config.sortDirection];

      this.columns
        .filter((a) => a.sortDirection && a.field !== column.field)
        .forEach((c) => {
          c.sortDirection = '';
          this.options.config.sortDirection = 'desc';
        });

      column.sortDirection = this.options.config.sortDirection;

      this.sort(
        this.tableData.find((t) => t.field === this.selectedTab)?.data,
        this.expanded
          ? this.extendedGridColumns.find((c) => c.field === this.options.config.sortBy)
          : this.gridCoumns.find((c) => c.field === this.options.config.sortBy),
        this.options.config.sortDirection
      );
    }
  }

  public compare = (v1: string | number | Date, v2: string | number | Date) =>
    v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

  public sort(array: Array<any>, column: TableColumnDefinition, direction: string) {
    this.pageSize = 20;
    this.showMoreVisible = true;
    this.checkSorting = true;
    this.sortColumn = column;
    this.customSearchComponent.resetDataSources();
  }

  public copy(event: any): void {
    const copyText = event.target.previousSibling.textContent;
    const colorText = event.target.previousSibling;
    const el = document.createElement('textarea');
    el.value = copyText;
    colorText.style.color = 'lightgray';
    colorText.style.transition = 'all 0.5s ease';
    setTimeout(() => {
      colorText.style.color = 'initial';
    }, 500);
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    this.toastr.success('Copied!', 'Success');
  }

  public toggle(tooltip: any, data: any): void {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({ data });
    }
  }

  public toggleNote(tooltip: any, data: any) {
    this.tooltip = tooltip;
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({ data });
    }
  }

  public editorClick(event): void {
    if (event.target.innerText === 'Take a note...') {
      event.target.innerText = '';
    }
  }

  public onAvatarNavigate(canNavigate: boolean, link: any, rowId: any) {
    if (canNavigate) {
      this.router.navigate([`${link.avatar.routerLinkStart}${rowId}${link.avatar.routerLinkEnd}`]);
    }
  }

  public openAction(action: any): void {
    action.tab = this.selectedTab;
    this.actionEvent.emit(action);
  }

  public openImportModal(): void {
    this.actionEvent.emit({ type: 'import-event', tab: this.selectedTab });
  }

  public openInsertModal(): void {
    this.pageSize = 20;
    this.showMoreVisible = true;
    this.customSearchComponent.resetDataSources();
    this.actionEvent.emit({ type: 'insert-event', tab: this.selectedTab });
  }

  public hideColumn(field: string): void {
    this.changeRef.detectChanges();
    if (this.expanded) {
      const index = this.extendedGridColumns.findIndex((c) => c.field === field);
      this.extendedGridColumns[index].hidden = !this.extendedGridColumns[index].hidden;
      this.extendedGridColumns[index].touched = true;
      this.extendedTableTouched = true;
    } else {
      const index = this.gridCoumns.findIndex((c) => c.field === field);
      this.gridCoumns[index].hidden = !this.gridCoumns[index].hidden;
      this.gridCoumns[index].touched = true;
      this.touched = true;
    }
    if (this.stateName) {
      this.updateColumnsState();
    }

    this.customSearchComponent.resetDataSources();
  }

  public updateColumnsState(): void {
    const userState: UserState = {
      userId: this.loggedUser.id,
      extendedTableColumns: this.extendedGridColumns,
      columns: this.gridCoumns,
      touched: this.touched,
      extendedTableTouched: this.extendedTableTouched,
    };
    localStorage.setItem(this.stateName + '_user_columns_state', JSON.stringify(userState));
  }

  public onCompress(): void {
    this.expanded = !this.expanded;
    this.compressTouch = true;
    this.changeRef.detectChanges();
    this.gridCompressionService.sendDataSource({ expanded: this.expanded, checked: true });

    if (this.expanded) {
      this.showSubtitle = true;
      this.subtitleProgress = 0;
      this.subtitleInterval = setInterval(() => {
        this.subtitleProgress++;
        if (this.subtitleProgress === 100) {
          this.showSubtitle = false;
          clearInterval();
        }
      }, 100);
    } else {
      if (this.subtitleInterval) {
        clearInterval(this.subtitleInterval);
      }
    }
  }

  public deleteSelectedItems(): void {
    this.loadingItems = true;
    this.digit = this.filteredData.length;
    this.mySelection.forEach((selection) => {
      const index = this.viewData.findIndex((d) => d.id === selection.id);
      if (index !== -1) {
        this.viewData[index].animationType = 'delete-item';
      }
    });

    this.deleteEvent.emit(this.mySelection);
    // TODO: check if we need this
    this.mySelection = [];
    this.checked = this.selectedTab === 'active';
    this.changeRef.detectChanges();
  }

  onDeleteAction(deleteRowData: boolean, action: any) {
    if (deleteRowData) {
      this.actionEvent.emit(action);
      this.showDeleteActionDialog = -1;
    } else {
      this.showDeleteActionDialog = -1;
    }
  }

  public changeStatuses(): void {
    this.loadingItems = true;

    this.actionEvent.emit({
      selection: this.mySelection,
      tab: this.selectedTab,
      type: 'status-event',
    });

    // TODO: check if we need this
    this.mySelection = [];
    this.checked = this.selectedTab === 'active';
    this.changeRef.detectChanges();
  }

  public getExpireData(expireData: Date): Date {
    if (expireData) {
      const newDate = new Date(expireData ? expireData : '');
      newDate.setFullYear(newDate.getFullYear() + 1);
      return newDate;
    } else {
      return undefined;
    }
  }

  public saveNote(value: string, id: number) {
    this.resetSortDirection = false;
    this.actionEvent.emit({ type: 'save-note-event', value, id });
  }

  public changeLoadStatus(status: any, id: number) {
    this.actionEvent.emit({ type: 'change-status-event', status: status.id, id });
  }

  public toggleDeleteDialog() {
    const data = {
      name: 'delete',
      type: this.options.deleteAction.type,
      text: this.options.deleteAction.text,
    };
    this.customModalService.openModal(DeleteDialogComponent, { data }, null, { size: 'small' });
  }

  openAllNotes() {
    this.switchOpenNotes = !this.switchOpenNotes;
    this.sharedService.emitAllNoteOpened.emit(this.switchOpenNotes);
  }

  trackByFn(index, item) {
    return index;
  }

  /* RESIZER */
  setTableResize(tableWidth: number) {
    let totWidth = 0;

    this.columns.forEach((column) => {
      totWidth += column.width;
    });

    let scale = tableWidth - totWidth;
    scale = scale === -1 ? 0 : scale;

    if (scale > 0) {
      scale =
        Math.abs(scale) /
        this.columns.filter((c) => !c.isActionColumn && !c.isSelectColumn && !c.touched).length;
      this.columns
        .filter((c) => !c.isActionColumn && !c.isSelectColumn && !c.touched)
        .forEach((column) => {
          column.width += Math.round(scale);
          this.setColumnWidth(column);
        });
    } else if (scale < 0) {
      scale =
        Math.abs(scale) /
        this.columns.filter((c) => !c.isActionColumn && !c.isSelectColumn && !c.touched).length;
      this.columns
        .filter((c) => !c.isActionColumn && !c.isSelectColumn && !c.touched)
        .forEach((column) => {
          column.width -= Math.round(scale);
          this.setColumnWidth(column);
        });
    } else {
      this.columns
        .filter((c) => !c.isActionColumn && !c.isSelectColumn)
        .forEach((column) => {
          this.setColumnWidth(column);
        });
    }
  }

  onResizeColumn(event: any, index: number) {
    this.lockProgress = 0;
    this.checkResizing(event, index);
    this.currentResizeIndex = index;
    this.pressed = true;

    if (this.expanded) {
      this.extendedTableTouched = true;
    } else {
      this.touched = true;
    }

    this.startX = event.pageX;
    this.startWidth = event.target.parentElement.clientWidth;
    this.changeRef.detectChanges();
    event.preventDefault();
    this.mouseMove(index);
  }

  private checkResizing(event, index) {
    const cellData = this.getCellData(index);
    if (
      index === 0 ||
      (Math.abs(event.pageX - cellData.right) < cellData.width / 2 &&
        index !== this.columns.length - 1)
    ) {
      this.isResizingRight = true;
    } else {
      this.isResizingRight = false;
    }
  }

  private getCellData(index: number) {
    const headerRow = this.truckassistTable.nativeElement.children[0].children[0];
    const cell = headerRow.children[index];
    return cell.getBoundingClientRect();
  }

  mouseMove(index: number) {
    this.resizableMousemove = this.renderer.listen('document', 'mousemove', (event) => {
      if (this.pressed && event.buttons) {
        const dx = this.isResizingRight ? event.pageX - this.startX : -event.pageX + this.startX;
        const width = this.startWidth + dx;
        if (this.currentResizeIndex === index && width >= 50) {
          this.setColumnWidthChanges(index, width);
        }
      }
    });
    this.resizableMouseup = this.renderer.listen('document', 'mouseup', (event) => {
      if (this.pressed) {
        this.pressed = false;
        this.currentResizeIndex = -1;
        this.resizableMousemove();
        this.resizableMouseup();
      }
    });
  }

  setColumnWidthChanges(index: number, width: number) {
    const orgWidth = this.columns[index].width;
    const dx = width - orgWidth;
    if (dx !== 0) {
      const j = this.isResizingRight ? index + 1 : index - 1;
      const newWidth = this.columns[j].width - dx;
      if (newWidth >= 50) {
        this.columns[index].width = width;
        this.setColumnWidth(this.columns[index]);
        this.columns[j].width = newWidth;
        this.setColumnWidth(this.columns[j]);
      }
    }
  }

  setColumnWidth(column: TableColumnDefinition) {
    const columnEls = Array.from(document.getElementsByClassName('mat-column-' + column.field));
    if (columnEls.length) {
      columnEls.forEach((el: HTMLDivElement) => {
        el.style.width = column.width + 'px';
      });
    }
    this.updateColumnsState();
    this.changeRef.detectChanges();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.lockProgress = 0;
    if (event === 'check') {
      if (this.compressTouch && this.customSearchComponent) {
        this.customSearchComponent.resetDataSources();
      }
    } else {
      if (
        this.truckassistTable &&
        this.truckassistTable.nativeElement.parentNode.clientWidth &&
        this.stateName
      ) {
        this.setTableResize(this.truckassistTable.nativeElement.parentNode.clientWidth);
      }
    }
  }

  /* END RESIZER*/

  public callAction(action: string) {
    if (action === 'emit-import-modal') {
      this.openImportModal();
    } else if (action === 'emit-locking') {
      this.setLocking();
    } else if (action === 'init-columns-event') {
      this.actionEvent.emit({ type: action });
    }
  }

  public resetColumnState(event: any): void {
    if (event) {
      if (this.expanded) {
        this.extendedTableTouched = false;
      } else {
        this.touched = false;
      }
      this.showResetConfirmation = false;
      this.callAction('init-columns-event');
    } else {
      this.showResetConfirmation = false;
    }
  }

  public setLocking(): void {
    if (this.locked) {
      this.locked = false;
      this.lockProgress = 0;
      this.lockInterval = setInterval(() => {
        this.lockProgress++;
        if (this.lockProgress === 60) {
          this.locked = true;
          clearInterval();
        }
      }, 1000);
    } else {
      this.locked = !this.locked;
      if (this.lockInterval) {
        clearInterval(this.lockInterval);
      }
    }
  }

  /* onRepairModeView(modeView: boolean){
    this.
  } */

  switchViewMode(viewMode: string) {
    this.pageSize = 20;
    this.viewMode = viewMode;
    this.resetDataSources();
    // TODO: proveriti
    this.onShopMode();
    this.changeRef.detectChanges();
  }

  // TODO: remove after migration
  onShopMode() {
    if (this.viewMode === 'MapView' && !this.showShopMap) {
      this.showShopMap = true;
      this.selectedType = false;
      this.allTypsDeselected.emit(true);
      this.shopMode.emit(true);
      this.sendShopData.emit(this.tableData);
    } else if (this.viewMode !== 'MapView' && this.showShopMap) {
      this.shopMode.emit(false);
      this.showShopMap = false;
      for (let i = 0; i < this.types.length; i++) {
        if (this.types[i].active) {
          this.selectedType = true;
          this.typeSelected.emit(i);
        }
      }
    }
  }

  /* Row Click Method */
  rowClicked(row: any, index: number) {
    /* Violation Summary */
    if (this.stateName === 'violations_summary') {
      this.showExpandedContainer = index;
      setTimeout(() => {
        row.expandedRow = !row.expandedRow;
      }, 200);
    }
    /* End Violation Summary */
  }

  /* Column Click Method */
  columnClicked(rowSelected: any, indexRow: number, indexColumn: number) {
    /* User Tabel */
    if (this.stateName === 'company_users') {
      /* For Open User Modal */
      if (indexColumn !== 0 && indexColumn !== 6) {
        this.editUser.emit({ index: indexRow, disableUser: false, row: rowSelected, edit: true });
      }
    }
    /* End User Tabel */
  }

  onToggleUser(index: number, rowSelected: any){
    this.editUser.emit({ index: index, disableUser: true, row: rowSelected, edit: false });
  }

  ngOnDestroy(): void {
    // this.expanded = false;
    // this.gridCompressionService.sendDataSource({ expanded: this.expanded, checked: true });
    // this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    if (this.subtitleInterval) {
      clearInterval(this.subtitleInterval);
    }

    if (this.lockInterval) {
      clearInterval(this.lockInterval);
    }

    this.destroy$.next();
    this.destroy$.complete();
  }
}
