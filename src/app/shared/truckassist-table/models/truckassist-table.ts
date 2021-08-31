import { Observable } from 'rxjs';
import { NewLabel } from 'src/app/core/model/label';

export class TableColumnDefinition {
  public ngTemplate?: string;
  public title: string;
  public field: string;
  public name: string;
  public hidden: boolean;
  public width: number;
  public minWidth?: number;
  public maxWidth?: number;
  public pdfWidth?: number;
  public filter: string;
  public index: number;
  public isNumeric: boolean;
  public isDate?: boolean;
  public sortable: boolean;
  public isActionColumn: boolean;
  public isSelectColumn: boolean;
  public avatar?: any;
  public progress: any;
  public opacityIgnore?: boolean;
  public hoverTemplate?: any;
  public filterable: boolean;
  public disabled: boolean;
  public export: boolean;
  public resizable: boolean;
  public draggable?: boolean;
  public linkField?: any;
  public imageHover?: any;
  public svg?: any;
  public showPin?: boolean;
  public objectIn?: boolean;
  public colorTemplate?: any;
  public devFrom?: boolean;
  public devTo?: boolean;
  public showStatus?: boolean;
  public showLabel?: boolean;
  public showCopy?: boolean;
  public class?: string;
  public password?: boolean;
  public navigateTo?: boolean;
  public empty?: any;
  public showUserCheckbox?: boolean;
  public addClassToTitle?: string;
  public addFontToTableText?: boolean;
  public showFuelDropDown?: boolean;
  public showQTY?: boolean;
  public touched?: boolean;
  public sortDirection?: string;
  public specialColumn?: boolean;
  public grossColumn?: boolean;
  public isProgress?: boolean;
  public citation?: boolean;
  public outOfService?: boolean;
  public violation?: boolean;
}

export class TableProgressData {
  start: string;
  end: string;
}

export class TableConfig {
  // public tableName: string;
  public disabledColumns: number[];
  public minWidth: number;
  public showSort: boolean;
  public sortDirection: string;
  public sortBy: string;
  public dateFilterField?: string;
}

export class TablePrimaryActions {
  public hideImport?: boolean;
  public hideExport?: boolean;
  public hideColumns?: boolean;
  public hideLabel?: boolean;
  public hideLockUnlock?: boolean;
  public hideCompress?: boolean;
  public hideAddNew?: boolean;
  public hidePrint?: boolean;
  public hideEmail?: boolean;
  public hideSwitch?: boolean;
  public hideDelete?: boolean;
  public hideShopType?: boolean;
  public showFilter?: boolean;
  public showTotalCounter?: boolean;
  public showCustomerFilter?: boolean;
  public hideDeleteMultiple?: boolean;
  public hideSelectNumber: boolean;
  public hideTabs?: boolean;
  public userTabelStyle?: boolean;
  public showDateFilter?: boolean;
  public showLabelStatusFilter?: boolean;
  public showTabFilter?: boolean;
  public showViolationFilterButtonGroup?: boolean;
  public hideSwitchView?: boolean
}

export class TableOptions {
  public disabledMutedStyle?: boolean;
  public data: Observable<TableSubject>;
  public config: TableConfig;
  public toolbarActions?: TablePrimaryActions;
  public mainActions: TableActions[];
  public customerActions?: TableActions[];
  public otherActions?: TableActions[];
  public activateAction?: TableActions;
  public deleteAction?: TableActions;
  public selectedTab?: string;
  public export?: boolean;
  public type?: string;
  public class?: string;
  public total?: number;
  public useAdditionalFeatures?: boolean;
}

export class TableActions {
  public title: string;
  public reverseTitle?: string;
  public name: string;
  public text?: string;
  public hovered?: boolean;
  public type?: string;
}

export class TableSubject {
  tableData: TableData[];
  check: boolean;
}

export class TableData {
  public title: string;
  public field: string;
  public data: any[];
  public tabFilters?: any[];
  public extended: boolean;
  /* public comments?: any[]; */
  // public hideTabs?: boolean;
  public showUnitSwitch?: boolean;
  public detailsData?: any;
  public detailsUnit?: any;
  public allowSelectRow?: boolean;
  public swichUnitData?: any;
  public type?: string;
  public keywordForSwich?: string;
  public checkPinned?: boolean;
  public labels?: NewLabel[];
  public availableColors?: any;
  public hideLength?: boolean;
  public dontShowChips?: boolean;
  public isCustomer?: boolean;
  public showToolsDropDown?: boolean;
  public filterData?: any;
  public filterYears?: number[];
  public numberOfShops?: number;
  public noLabelCount?: number;
  public selectTab?: boolean;
  public gridNameTitle?: string;
  public stateName?: string;
  public gridColumns?: TableColumnDefinition[];
  public extendedGridColumns?: TableColumnDefinition[];
  public items?: SwitchItem[];
}

export interface SwitchItem {
  title?: string;
  selected?: boolean;
  path?: string;
  field?: string;
  index?: number;
  disabled?: boolean;
  data?: any[];
}
