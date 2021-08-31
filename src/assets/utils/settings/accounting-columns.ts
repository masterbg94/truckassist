import { TableColumnDefinition } from 'src/app/shared/truckassist-table/models/truckassist-table';

export function getAccountingsColumnsDefinition() {
  // temporary mockap for displaying data
  return [
    {
      ngTemplate: 'defaultTemplate',
      title: 'Name',
      field: 'fullName',
      name: 'Name',
      hidden: false,
      width: 32,
      filter: '',
      isNumeric: false,
      index: 0,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: {
        src: 'doc.additionalData.avatar.src',
        // routerLinkStart: '/#/#/',
        // routerLinkEnd: '/#',
      },
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: true,
      export: true,
      resizable: false,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Pay period',
      field: 'doc.licenseData[0].birthDateShort',
      name: 'Pay period',
      hidden: false,
      width: 0,
      filter: '',
      isNumeric: true,
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
      resizable: false,
    },
    {
      title: 'Salary',
      field: 'ssn',
      name: 'Salary',
      hidden: false,
      width: 0,
      filter: '',
      isNumeric: true,
      index: 2,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: null,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: false,
    },
    {
      title: 'Status',
      field: 'doc.licenseData[0].class.value',
      name: 'Status',
      hidden: false,
      width: 0,
      filter: '',
      isNumeric: true,
      index: 3,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: null,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: false,
    },
  ] as TableColumnDefinition[];
}


export function getExtendedAccountingsColumnsDefinition() {
  // temporary mockap for displaying data
  return [
    {
      title: 'Name',
      field: 'fullName',
      name: 'Name',
      hidden: false,
      width: 40,
      filter: '',
      isNumeric: false,
      index: 0,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: {
        src: 'doc.additionalData.avatar.src',
        // routerLinkStart: '/#/#/',
        // routerLinkEnd: '/#',
      },
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: true,
      export: true,
      resizable: false,
    },
    {
      title: 'Pay period',
      field: 'doc.licenseData[0].birthDateShort',
      name: 'Pay period',
      hidden: false,
      width: 0,
      filter: '',
      isNumeric: true,
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
      resizable: false,
    },
    {
      title: 'Salary',
      field: 'ssn',
      name: 'Salary',
      hidden: false,
      width: 0,
      filter: '',
      isNumeric: true,
      index: 2,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: null,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: false,
    },
    {
      title: 'Status',
      field: 'doc.licenseData[0].class.value',
      name: 'Status',
      hidden: false,
      width: 0,
      filter: '',
      isNumeric: true,
      index: 3,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: null,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: false,
    },
  ] as TableColumnDefinition[];
}