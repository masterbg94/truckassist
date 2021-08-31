import { TableColumnDefinition } from 'src/app/shared/truckassist-table/models/truckassist-table';

// DRIVER TABLE COLUMNS DEFINITION
export function getDriverColumnsDefinition() {
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
      ngTemplate: 'avatarTemplate',
      title: 'Name',
      field: 'fullName',
      name: 'Name',
      hidden: false,
      width: 179,
      filter: '',
      isNumeric: false,
      index: 1,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: {
        src: 'doc.additionalData.avatar.src',
        routerLinkStart: '/drivers/edit/',
        routerLinkEnd: '/basic',
      },
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: true,
      export: true,
      resizable: true,
      class: 'overflow-unset'
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Phone',
      field: 'doc.additionalData.phone',
      name: 'Phone',
      hidden: false,
      width: 117,
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
      resizable: true,
      class: 'custom-font',
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Email',
      field: 'doc.additionalData.email',
      name: 'Email',
      hidden: true,
      width: 50,
      filter: '',
      isNumeric: false,
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
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Address',
      field: 'doc.additionalData.address.address',
      name: 'Address',
      hidden: true,
      width: 50,
      filter: '',
      isNumeric: false,
      index: 4,
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
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'SSN',
      field: 'ssn',
      name: 'SSN',
      hidden: false,
      width: 107,
      filter: '',
      isNumeric: true,
      index: 5,
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

      class: 'custom-font',
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'DOB',
      field: 'doc.additionalData.birthDateShort',
      name: 'DOB',
      hidden: false,
      width: 83,
      filter: '',
      isNumeric: true,
      isDate: true,
      index: 6,
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
      class: 'custom-font',
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Hired',
      field: 'doc.workData[0].startDateShort',
      name: 'Hired',
      isComputed: false,
      hidden: false,
      width: 76,
      filter: '',
      isNumeric: true,
      isDate: true,
      index: 7,
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
      class: 'custom-font',
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'CDL',
      field: 'doc.licenseData[0].number',
      name: 'CDL',
      hidden: false,
      width: 148,
      filter: '',
      isNumeric: true,
      index: 8,
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
    },
    {
      ngTemplate: 'stateTemplate',
      title: 'State',
      field: 'doc.licenseData[0].state.value',
      name: 'State',
      hidden: false,
      width: 60,
      filter: '',
      isNumeric: false,
      index: 9,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: null,
      progress: null,
      hoverTemplate: {
        urlStart: '../assets/img/svgs/states/',
        field: 'doc.licenseData[0].state.key',
        urlEnd: '.svg',
      },
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Bank',
      field: 'doc.additionalData.bankData.bankName',
      name: 'Bank',
      hidden: true,
      width: 50,
      filter: '',
      isNumeric: false,
      index: 13,
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
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Account',
      field: 'doc.additionalData.bankData.accountNumber',
      name: 'Account',
      hidden: true,
      width: 50,
      filter: '',
      isNumeric: true,
      index: 14,
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
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Routing',
      field: 'doc.additionalData.bankData.routingNumber',
      name: 'Routing',
      hidden: true,
      width: 50,
      filter: '',
      isNumeric: true,
      index: 15,
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
    },
    {
      ngTemplate: 'progressTemplate',
      title: 'Expiration',
      field: 'doc.licenseData[0].endDate',
      name: 'Expiration',
      hidden: false,
      width: 170,
      filter: '',
      isNumeric: true,
      index: 10,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: null,
      progress: {
        start: 'doc.licenseData[0].startDate',
        end: 'doc.licenseData[0].endDate',
      },
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'progressTemplate',
      title: 'Medical',
      field: 'doc.medicalData[0].endDate',
      name: 'Medical',
      hidden: false,
      width: 170,
      filter: '',
      isNumeric: true,
      index: 11,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: null,
      progress: {
        start: 'doc.medicalData[0].startDate',
        end: 'doc.medicalData[0].endDate',
      },
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'progressTemplate',
      title: 'MVR',
      field: 'doc.mvrData[0].startDate',
      name: 'MVR',
      hidden: false,
      width: 170,
      filter: '',
      isNumeric: true,
      index: 12,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: null,
      progress: {
        start: '',
        end: 'doc.mvrData[0].startDate',
      },
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'filesTemplate',
      title: '',
      field: 'doc.additionalData.files',
      name: 'Files',
      hidden: false,
      width: 40,
      filter: '',
      isNumeric: false,
      index: 16,
      sortable: false,
      isActionColumn: true,
      isSelectColumn: false,
      avatar: null,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: false,
      resizable: false,
    },
    {
      ngTemplate: 'noteTemplate',
      title: '',
      field: 'doc.additionalData.note',
      name: 'Note',
      hidden: false,
      width: 40,
      filter: '',
      isNumeric: false,
      index: 17,
      sortable: false,
      isActionColumn: true,
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
      ngTemplate: 'actionTemplate',
      title: '',
      field: 'action',
      name: 'Action',
      hidden: false,
      width: 40,
      filter: '',
      isNumeric: false,
      index: 18,
      sortable: false,
      isActionColumn: true,
      isSelectColumn: false,
      avatar: null,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: false,
      resizable: false,
    },
  ] as TableColumnDefinition[];
}

export function getExtendedDriverTableColumnsDefinition() {
  return [
    {
      ngTemplate: 'checkboxTemplate',
      title: '',
      field: 'select',
      name: 'Select',
      hidden: false,
      width: 40,
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
      ngTemplate: 'avatarTemplate',
      title: 'Name',
      field: 'fullName',
      name: 'Name',
      hidden: false,
      width: 179,
      filter: '',
      isNumeric: false,
      index: 1,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: {
        src: 'doc.additionalData.avatar.src',
        routerLinkStart: '/drivers/edit/',
        routerLinkEnd: '/basic',
      },
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: true,
      export: true,
      resizable: true,
      class: 'overflow-unset'
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Phone',
      field: 'doc.additionalData.phone',
      name: 'Phone',
      hidden: false,
      width: 117,
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
      resizable: true,
      class: 'custom-font',
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Email',
      field: 'doc.additionalData.email',
      name: 'Email',
      hidden: false,
      width: 50,
      filter: '',
      isNumeric: false,
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
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Address',
      field: 'doc.additionalData.address.address',
      name: 'Address',
      hidden: true,
      width: 50,
      filter: '',
      isNumeric: false,
      index: 4,
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
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'SSN',
      field: 'ssn',
      name: 'SSN',
      hidden: false,
      width: 107,
      filter: '',
      isNumeric: true,
      index: 5,
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

      class: 'custom-font',
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'DOB',
      field: 'doc.additionalData.birthDateShort',
      name: 'DOB',
      hidden: false,
      width: 83,
      filter: '',
      isNumeric: true,
      isDate: true,
      index: 6,
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

      class: 'custom-font',
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Hired',
      field: 'doc.workData[0].startDateShort',
      name: 'Hired',
      isComputed: false,
      hidden: false,
      width: 76,
      filter: '',
      isNumeric: true,
      isDate: true,
      index: 7,
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
      class: 'custom-font',
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'CDL',
      field: 'doc.licenseData[0].number',
      name: 'CDL',
      hidden: false,
      width: 148,
      filter: '',
      isNumeric: true,
      index: 8,
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
    },
    {
      ngTemplate: 'stateTemplate',
      title: 'State',
      field: 'doc.licenseData[0].state.value',
      name: 'State',
      hidden: false,
      width: 60,
      filter: '',
      isNumeric: false,
      index: 9,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: null,
      progress: null,
      hoverTemplate: {
        urlStart: '../assets/img/svgs/states/',
        field: 'doc.licenseData[0].state.key',
        urlEnd: '.svg',
      },
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Bank',
      field: 'doc.additionalData.bankData.bankName',
      name: 'Bank',
      hidden: true,
      width: 50,
      filter: '',
      isNumeric: false,
      index: 13,
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
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Account',
      field: 'doc.additionalData.bankData.accountNumber',
      name: 'Account',
      hidden: true,
      width: 50,
      filter: '',
      isNumeric: true,
      index: 14,
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
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Routing',
      field: 'doc.additionalData.bankData.routingNumber',
      name: 'Routing',
      hidden: true,
      width: 50,
      filter: '',
      isNumeric: true,
      index: 15,
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
    },
    {
      ngTemplate: 'progressTemplate',
      title: 'Expiration',
      field: 'doc.licenseData[0].endDate',
      name: 'Expiration',
      hidden: false,
      width: 170,
      filter: '',
      isNumeric: true,
      index: 10,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: null,
      progress: {
        start: 'doc.licenseData[0].startDate',
        end: 'doc.licenseData[0].endDate',
      },
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'progressTemplate',
      title: 'Medical',
      field: 'doc.medicalData[0].endDate',
      name: 'Medical',
      hidden: false,
      width: 170,
      filter: '',
      isNumeric: true,
      index: 11,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: null,
      progress: {
        start: 'doc.medicalData[0].startDate',
        end: 'doc.medicalData[0].endDate',
      },
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'progressTemplate',
      title: 'MVR',
      field: 'doc.mvrData[0].startDate',
      name: 'MVR',
      hidden: false,
      width: 170,
      filter: '',
      isNumeric: true,
      index: 12,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: null,
      progress: {
        start: '',
        end: 'doc.mvrData[0].startDate',
      },
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'filesTemplate',
      title: '',
      field: 'doc.additionalData.files',
      name: 'Files',
      hidden: false,
      width: 40,
      filter: '',
      isNumeric: false,
      index: 16,
      sortable: false,
      isActionColumn: true,
      isSelectColumn: false,
      avatar: null,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: false,
      resizable: false,
    },
    {
      ngTemplate: 'noteTemplate',
      title: '',
      field: 'doc.additionalData.note',
      name: 'Note',
      hidden: false,
      width: 40,
      filter: '',
      isNumeric: false,
      index: 17,
      sortable: false,
      isActionColumn: true,
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
      ngTemplate: 'actionTemplate',
      title: '',
      field: 'action',
      name: 'Action',
      hidden: false,
      width: 40,
      filter: '',
      isNumeric: false,
      index: 18,
      sortable: false,
      isActionColumn: true,
      isSelectColumn: false,
      avatar: null,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: false,
      resizable: false,
    },
  ] as TableColumnDefinition[];
}
