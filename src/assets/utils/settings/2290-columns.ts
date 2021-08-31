import { TableColumnDefinition } from './../../../app/shared/truckassist-table/models/truckassist-table';

// 2290 column defintion
export function get2290Columns() {
  return [] as TableColumnDefinition[];
}

// 2290 active column definition
export function get2290ActiveColumns() {
  return [
    {
      ngTemplate: 'checkboxTemplate',
      title: '',
      field: 'select',
      name: 'Select',
      hidden: false,
      width: 32,
      filter: '',
      isNumeric: false,
      index: 0,
      sortable: false,
      isActionColumn: true,
      isSelectColumn: true,
      avatar: null,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: false,
      resizable: false,
    },
    {
      ngTemplate: 'linkFieldTemplate',
      title: 'Order #',
      field: 'id',
      name: 'Order',
      hidden: false,
      width: 100,
      filter: '',
      isNumeric: false,
      index: 1,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: null,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
      linkField: {
        routerLinkStart: '/tools/2290/edit/',
        routerLinkEnd: '/detail',
      },
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Company',
      field: 'company',
      name: 'Company',
      hidden: false,
      width: 190,
      filter: '',
      isNumeric: false,
      index: 2,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Tax Period',
      field: 'taxSeason',
      name: 'Tax Period',
      hidden: false,
      width: 260,
      filter: '',
      isNumeric: false,
      index: 3,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'VINs',
      field: 'vins',
      name: 'VINs',
      hidden: false,
      width: 127,
      filter: '',
      isNumeric: false,
      index: 4,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Net Tax',
      field: 'tax',
      name: 'Net Tax',
      hidden: false,
      width: 150,
      filter: '',
      isNumeric: false,
      index: 5,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Filing Fee',
      field: 'fillingFee',
      name: 'Filing Fee',
      hidden: false,
      width: 150,
      filter: '',
      isNumeric: false,
      index: 6,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'E-filled',
      field: 'eFilled',
      name: 'E-filled',
      hidden: false,
      width: 196,
      filter: '',
      isNumeric: false,
      index: 7,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'statesTemplate',
      title: '',
      field: 'summary',
      name: 'Summary',
      hidden: false,
      width: 97.5,
      filter: '',
      isNumeric: false,
      index: 8,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'statesTemplate',
      title: '',
      field: 'schedule',
      name: 'Schedule',
      hidden: false,
      width: 97.5,
      filter: '',
      isNumeric: false,
      index: 9,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'actionTemplate',
      title: '',
      field: 'action',
      name: 'Action',
      hidden: false,
      width: 40,
      filter: '',
      isNumeric: false,
      index: 10,
      sortable: false,
      isActionColumn: true,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: false,
      resizable: false,
    },
  ] as TableColumnDefinition[];
}

// 2290 finished column definition
export function get2290FinishedColumns() {
  return [
    {
      ngTemplate: 'checkboxTemplate',
      title: '',
      field: 'select',
      name: 'Select',
      hidden: false,
      width: 32,
      filter: '',
      isNumeric: false,
      index: 0,
      sortable: false,
      isActionColumn: true,
      isSelectColumn: true,
      avatar: null,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: false,
      resizable: false,
    },
    {
      ngTemplate: 'linkFieldTemplate',
      title: 'Order #',
      field: 'id',
      name: 'Order',
      hidden: false,
      width: 135,
      filter: '',
      isNumeric: false,
      index: 1,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: null,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
      linkField: {
        routerLinkStart: '/tools/2290/edit/',
        routerLinkEnd: '/detail',
      },
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Company',
      field: 'company',
      name: 'Company',
      hidden: false,
      width: 228,
      filter: '',
      isNumeric: false,
      index: 2,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Tax Season',
      field: 'taxSeason',
      name: 'Tax Season',
      hidden: false,
      width: 270,
      filter: '',
      isNumeric: false,
      index: 3,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'VINs',
      field: 'vins',
      name: 'VINs',
      hidden: false,
      width: 147,
      filter: '',
      isNumeric: false,
      index: 4,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Tax',
      field: 'tax',
      name: 'Tax',
      hidden: false,
      width: 180,
      filter: '',
      isNumeric: false,
      index: 5,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'statusTextTemplate',
      title: 'Status',
      field: 'status',
      name: 'Status',
      hidden: false,
      width: 151,
      filter: '',
      isNumeric: false,
      index: 6,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'statesTemplate',
      title: '',
      field: 'finish',
      name: 'Finish',
      hidden: false,
      width: 257,
      filter: '',
      isNumeric: false,
      index: 7,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'actionTemplate',
      title: '',
      field: 'action',
      name: 'Action',
      hidden: false,
      width: 40,
      filter: '',
      isNumeric: false,
      index: 8,
      sortable: false,
      isActionColumn: true,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: false,
      resizable: false,
    },
  ] as TableColumnDefinition[];
}
//------------------------------------------------

// 2290 expanded column defintion
export function get2290ExtendedColumns() {
  return [] as TableColumnDefinition[];
}

// 2290 expanded active column definition
export function get2290ActiveExtendedColumns() {
  return [
    {
      ngTemplate: 'checkboxTemplate',
      title: '',
      field: 'select',
      name: 'Select',
      hidden: false,
      width: 32,
      filter: '',
      isNumeric: false,
      index: 0,
      sortable: false,
      isActionColumn: true,
      isSelectColumn: true,
      avatar: null,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: false,
      resizable: false,
    },
    {
      ngTemplate: 'linkFieldTemplate',
      title: 'Order #',
      field: 'id',
      name: 'Order',
      hidden: false,
      width: 90,
      filter: '',
      isNumeric: false,
      index: 1,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: null,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
      linkField: {
        routerLinkStart: '/tools/2290/edit/',
        routerLinkEnd: '/detail',
      },
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Company',
      field: 'company',
      name: 'Company',
      hidden: false,
      width: 190,
      filter: '',
      isNumeric: false,
      index: 2,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Tax Period',
      field: 'taxSeason',
      name: 'Tax Period',
      hidden: false,
      width: 270,
      filter: '',
      isNumeric: false,
      index: 3,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'VINs',
      field: 'vins',
      name: 'VINs',
      hidden: false,
      width: 127,
      filter: '',
      isNumeric: false,
      index: 4,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Net Tax',
      field: 'tax',
      name: 'Net Tax',
      hidden: false,
      width: 150,
      filter: '',
      isNumeric: false,
      index: 5,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Filing Fee',
      field: 'fillingFee',
      name: 'Filing Fee',
      hidden: false,
      width: 150,
      filter: '',
      isNumeric: false,
      index: 6,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'E-filled',
      field: 'eFilled',
      name: 'E-filled',
      hidden: false,
      width: 196,
      filter: '',
      isNumeric: false,
      index: 7,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: '',
      field: 'summary',
      name: 'Summary',
      hidden: false,
      width: 97.5,
      filter: '',
      isNumeric: false,
      index: 8,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: '',
      field: 'schedule',
      name: 'Schedule',
      hidden: false,
      width: 97.5,
      filter: '',
      isNumeric: false,
      index: 9,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'actionTemplate',
      title: '',
      field: 'action',
      name: 'Action',
      hidden: false,
      width: 40,
      filter: '',
      isNumeric: false,
      index: 10,
      sortable: false,
      isActionColumn: true,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: false,
      resizable: false,
    },
  ] as TableColumnDefinition[];
}

// 2290 expanded finished column definition
export function get2290FinishedExtendedColumns() {
  return [
    {
      ngTemplate: 'checkboxTemplate',
      title: '',
      field: 'select',
      name: 'Select',
      hidden: false,
      width: 32,
      filter: '',
      isNumeric: false,
      index: 0,
      sortable: false,
      isActionColumn: true,
      isSelectColumn: true,
      avatar: null,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: false,
      resizable: false,
    },
    {
      ngTemplate: 'linkFieldTemplate',
      title: 'Order #',
      field: 'id',
      name: 'Order',
      hidden: false,
      width: 135,
      filter: '',
      isNumeric: false,
      index: 1,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: null,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
      linkField: {
        routerLinkStart: '/tools/2290/edit/',
        routerLinkEnd: '/detail',
      },
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Company',
      field: 'company',
      name: 'Company',
      hidden: false,
      width: 228,
      filter: '',
      isNumeric: false,
      index: 2,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Tax Season',
      field: 'taxSeason',
      name: 'Tax Season',
      hidden: false,
      width: 270,
      filter: '',
      isNumeric: false,
      index: 3,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'VINs',
      field: 'vins',
      name: 'VINs',
      hidden: false,
      width: 147,
      filter: '',
      isNumeric: false,
      index: 4,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Tax',
      field: 'tax',
      name: 'Tax',
      hidden: false,
      width: 180,
      filter: '',
      isNumeric: false,
      index: 5,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'statusTextTemplate',
      title: 'Status',
      field: 'status',
      name: 'Status',
      hidden: false,
      width: 151,
      filter: '',
      isNumeric: false,
      index: 6,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: '',
      field: 'finish',
      name: 'Finish',
      hidden: false,
      width: 257,
      filter: '',
      isNumeric: false,
      index: 7,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'actionTemplate',
      title: '',
      field: 'action',
      name: 'Action',
      hidden: false,
      width: 40,
      filter: '',
      isNumeric: false,
      index: 8,
      sortable: false,
      isActionColumn: true,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: false,
      resizable: false,
    },
  ] as TableColumnDefinition[];
}
