import { TableColumnDefinition } from 'src/app/shared/truckassist-table/models/truckassist-table';

// LOAD COLUMN DEFINITION
export function getLoadColumnDefinition() {
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
      title: 'Inv.',
      field: 'loadNumber',
      name: 'Invoice',
      hidden: false,
      width: 51,
      filter: '',
      isNumeric: false,
      index: 1,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
      linkField: {
        routerLinkStart: '/loads/edit/',
        routerLinkEnd: '/detail',
      }
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Broker',
      field: 'brokerName',
      name: 'Broker',
      hidden: false,
      width: 183,
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
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Shipper',
      field: 'pickupName',
      name: 'Shipper',
      hidden: true,
      width: 100,
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
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Receiver',
      field: 'deliveryName',
      name: 'Receiver',
      hidden: true,
      width: 120,
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
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Base Rate',
      field: 'baseRate',
      name: 'Base Rate',
      hidden: true,
      width: 100,
      filter: '',
      isNumeric: true,
      index: 3,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: null,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Adjusted',
      field: 'adjusted',
      name: 'Adjusted',
      hidden: true,
      width: 100,
      filter: '',
      isNumeric: true,
      index: 4,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: null,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Advance',
      field: 'advanced',
      name: 'Advance',
      hidden: true,
      width: 100,
      filter: '',
      isNumeric: true,
      index: 5,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: null,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Additional',
      field: 'additional',
      name: 'Additional',
      hidden: true,
      width: 100,
      filter: '',
      isNumeric: true,
      index: 5,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: null,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Revised',
      field: 'revised',
      name: 'Revised',
      hidden: true,
      width: 100,
      filter: '',
      isNumeric: true,
      index: 5,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: null,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Dispatcher',
      field: 'dispatcherName',
      name: 'Dispatcher',
      hidden: true,
      width: 150,
      filter: '',
      isNumeric: true,
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
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Trailer',
      field: 'trailerNumber',
      name: 'Trailer',
      hidden: true,
      width: 75,
      filter: '',
      isNumeric: true,
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
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Driver',
      field: 'driverName',
      name: 'Driver',
      hidden: true,
      width: 183,
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
      ngTemplate: 'defaultTemplate',
      title: 'Truck',
      field: 'truckNumber',
      name: 'Truck',
      hidden: false,
      width: 75,
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
      class: 'custom-font',
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Ref #',
      field: 'brokerLoadNumber',
      name: 'Ref #',
      hidden: false,
      width: 81,
      filter: '',
      isNumeric: false,
      index: 10,
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
      title: 'Date',
      field: 'pickupDateTime',
      name: 'Date',
      hidden: false,
      width: 84,
      filter: '',
      isNumeric: false,
      isDate: true,
      index: 11,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: true,
      resizable: true,
      class: 'custom-font',
      addClassToTitle: 'addGreenToTitle',
    },
    {
      ngTemplate: 'pickupTemplate',
      title: 'Pick-Up',
      field: 'pickupLocation.city',
      name: 'Pick-Up',
      hidden: false,
      width: 216,
      filter: '',
      isNumeric: false,
      index: 12,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: true,
      resizable: true,
      devFrom: true,
    },
    {
      ngTemplate: 'deliveryTemplate',
      title: 'Delivery',
      field: 'deliveryLocation.city',
      name: 'Delivery',
      hidden: false,
      width: 187,
      filter: '',
      isNumeric: false,
      index: 13,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: true,
      resizable: true,
      devTo: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Date',
      field: 'deliveryDateTime',
      name: 'Date',
      hidden: false,
      width: 76,
      filter: '',
      isNumeric: false,
      isDate: true,
      index: 14,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: true,
      resizable: true,
      class: 'custom-font',
      addClassToTitle: 'addRedToTitle',
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Total',
      field: 'total',
      name: 'Total',
      hidden: false,
      width: 92,
      filter: '',
      isNumeric: false,
      index: 15,
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
      ngTemplate: 'statusTemplate',
      title: 'Status',
      field: 'status',
      name: 'Status',
      hidden: false,
      width: 140,
      filter: '',
      isNumeric: false,
      index: 16,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
      showStatus: true,
      class: 'overflow-unset'
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Miles',
      field: 'mileage',
      name: 'Miles',
      hidden: false,
      width: 85,
      filter: '',
      isNumeric: false,
      index: 17,
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
      title: 'Stops',
      field: 'stops',
      name: 'Stops',
      hidden: true,
      width: 80,
      filter: '',
      isNumeric: true,
      index: 5,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: null,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'noteTemplate',
      title: '',
      field: 'note',
      name: 'Note',
      hidden: false,
      width: 40,
      filter: '',
      isNumeric: false,
      index: 18,
      sortable: false,
      isActionColumn: true,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: true,
      export: true,
      resizable: false,
    },
    {
      ngTemplate: 'commentsTemplate',
      title: '',
      field: 'commentsCount',
      name: 'Comments',
      hidden: false,
      width: 40,
      filter: '',
      isNumeric: false,
      index: 18,
      sortable: false,
      isActionColumn: true,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: true,
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
      index: 19,
      sortable: false,
      isActionColumn: true,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: true,
      export: false,
      resizable: false,
    },
  ] as TableColumnDefinition[];
}

// export function getDashboardLoadColumnDefinition() {
//   return [
//     {
//       title: 'Inv.',
//       field: 'loadNumber',
//       name: 'Invoice',
//       hidden: false,
//       width: 81,
//       filter: '',
//       isNumeric: false,
//       index: 1,
//       sortable: true,
//       isActionColumn: false,
//       isSelectColumn: false,
//       progress: null,
//       hoverTemplate: null,
//       filterable: true,
//       disabled: false,
//       export: true,
//       resizable: true,
//       linkField: {
//         routerLinkStart: '/loads/edit/',
//         routerLinkEnd: '/detail',
//       }
//     },
//     {
//       title: 'Broker',
//       field: 'brokerName',
//       name: 'Broker',
//       hidden: false,
//       width: 173,
//       filter: '',
//       isNumeric: true,
//       index: 2,
//       sortable: true,
//       isActionColumn: false,
//       isSelectColumn: false,
//       avatar: null,
//       progress: null,
//       hoverTemplate: null,
//       filterable: true,
//       disabled: false,
//       export: true,
//       resizable: true,
//     },
//     {
//       title: 'Pick-Up',
//       field: 'pickupLocation.city',
//       name: 'Pick-Up',
//       hidden: false,
//       width: 206,
//       filter: '',
//       isNumeric: false,
//       index: 12,
//       sortable: true,
//       isActionColumn: false,
//       isSelectColumn: false,
//       progress: null,
//       hoverTemplate: null,
//       filterable: true,
//       disabled: false,
//       export: true,
//       resizable: true,
//       devFrom: true,
//     },
//     {
//       title: 'Delivery',
//       field: 'deliveryLocation.city',
//       name: 'Delivery',
//       hidden: false,
//       width: 177,
//       filter: '',
//       isNumeric: false,
//       index: 13,
//       sortable: true,
//       isActionColumn: false,
//       isSelectColumn: false,
//       progress: null,
//       hoverTemplate: null,
//       filterable: true,
//       disabled: false,
//       export: true,
//       resizable: true,
//       devTo: true,
//     },
//     {
//       title: 'Status',
//       field: 'status',
//       name: 'Status',
//       hidden: false,
//       width: 140,
//       filter: '',
//       isNumeric: false,
//       index: 16,
//       sortable: true,
//       isActionColumn: false,
//       isSelectColumn: false,
//       progress: null,
//       hoverTemplate: null,
//       filterable: true,
//       disabled: false,
//       export: true,
//       resizable: true,
//       showStatus: true,
//       class: 'overflow-unset'
//     }
//   ] as TableColumnDefinition[];
// }

export function getExtendedLoadColumnDefinition() {
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
      ngTemplate: 'linkFieldTemplate',
      title: 'Inv.',
      field: 'loadNumber',
      name: 'Invoice',
      hidden: false,
      width: 51,
      filter: '',
      isNumeric: false,
      index: 1,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
      linkField: {
        routerLinkStart: '/loads/edit/',
        routerLinkEnd: '/detail',
      }
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Broker',
      field: 'brokerName',
      name: 'Broker',
      hidden: false,
      width: 183,
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
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Shipper',
      field: 'pickupName',
      name: 'Shipper',
      hidden: true,
      width: 100,
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
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Receiver',
      field: 'deliveryName',
      name: 'Receiver',
      hidden: true,
      width: 120,
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
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Base Rate',
      field: 'baseRate',
      name: 'Base Rate',
      hidden: true,
      width: 100,
      filter: '',
      isNumeric: true,
      index: 3,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: null,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Adjusted',
      field: 'adjusted',
      name: 'Adjusted',
      hidden: true,
      width: 100,
      filter: '',
      isNumeric: true,
      index: 4,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: null,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Advance',
      field: 'advanced',
      name: 'Advance',
      hidden: true,
      width: 100,
      filter: '',
      isNumeric: true,
      index: 5,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: null,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Additional',
      field: 'additional',
      name: 'Additional',
      hidden: true,
      width: 100,
      filter: '',
      isNumeric: true,
      index: 5,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: null,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Revised',
      field: 'revised',
      name: 'Revised',
      hidden: true,
      width: 100,
      filter: '',
      isNumeric: true,
      index: 5,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: null,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Dispatcher',
      field: 'dispatcherName',
      name: 'Dispatcher',
      hidden: true,
      width: 150,
      filter: '',
      isNumeric: true,
      index: 6,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: null,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Trailer',
      field: 'trailerNumber',
      name: 'Trailer',
      hidden: true,
      width: 75,
      filter: '',
      isNumeric: true,
      index: 7,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: null,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Driver',
      field: 'driverName',
      name: 'Driver',
      hidden: true,
      width: 183,
      filter: '',
      isNumeric: true,
      index: 8,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: null,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Truck',
      field: 'truckNumber',
      name: 'Truck',
      hidden: false,
      width: 75,
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
      class: 'custom-font',
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Ref #',
      field: 'brokerLoadNumber',
      name: 'Ref #',
      hidden: false,
      width: 81,
      filter: '',
      isNumeric: true,
      index: 10,
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
      title: 'Date',
      field: 'pickupDateTime',
      name: 'Date',
      hidden: false,
      width: 84,
      filter: '',
      isNumeric: false,
      isDate: true,
      index: 11,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: true,
      resizable: true,
      class: 'custom-font',
      addClassToTitle: 'addGreenToTitle',
    },
    {
      ngTemplate: 'pickupTemplate',
      title: 'Pick-Up',
      field: 'pickupLocation.city',
      name: 'Pick-Up',
      hidden: false,
      width: 216,
      filter: '',
      isNumeric: false,
      index: 12,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: true,
      resizable: true,
      devFrom: true,
    },
    {
      ngTemplate: 'deliveryTemplate',
      title: 'Delivery',
      field: 'deliveryLocation.city',
      name: 'Delivery',
      hidden: false,
      width: 187,
      filter: '',
      isNumeric: false,
      index: 13,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: true,
      resizable: true,
      devTo: true,
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Date',
      field: 'deliveryDateTime',
      name: 'Date',
      hidden: false,
      width: 76,
      filter: '',
      isNumeric: false,
      isDate: true,
      index: 14,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: true,
      resizable: true,
      class: 'custom-font',
      addClassToTitle: 'addRedToTitle',
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Total',
      field: 'total',
      name: 'Total',
      hidden: false,
      width: 92,
      filter: '',
      isNumeric: false,
      index: 15,
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
      ngTemplate: 'statusTemplate',
      title: 'Status',
      field: 'status',
      name: 'Status',
      hidden: false,
      width: 140,
      filter: '',
      isNumeric: false,
      index: 16,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: true,
      disabled: false,
      export: true,
      resizable: true,
      showStatus: true,
      class: 'overflow-unset'
    },
    {
      ngTemplate: 'defaultTemplate',
      title: 'Miles',
      field: 'mileage',
      name: 'Miles',
      hidden: false,
      width: 85,
      filter: '',
      isNumeric: false,
      index: 17,
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
      title: 'Stops',
      field: 'stops',
      name: 'Stops',
      hidden: true,
      width: 80,
      filter: '',
      isNumeric: true,
      index: 5,
      sortable: true,
      isActionColumn: false,
      isSelectColumn: false,
      avatar: null,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: false,
      export: true,
      resizable: true,
    },
    {
      ngTemplate: 'noteTemplate',
      title: '',
      field: 'note',
      name: 'Note',
      hidden: false,
      width: 40,
      filter: '',
      isNumeric: false,
      index: 18,
      sortable: false,
      isActionColumn: true,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: true,
      export: true,
      resizable: false,
    },
    {
      ngTemplate: 'commentsTemplate',
      title: '',
      field: 'commentsCount',
      name: 'Comments',
      hidden: false,
      width: 40,
      filter: '',
      isNumeric: false,
      index: 18,
      sortable: false,
      isActionColumn: true,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: true,
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
      index: 19,
      sortable: false,
      isActionColumn: true,
      isSelectColumn: false,
      progress: null,
      hoverTemplate: null,
      filterable: false,
      disabled: true,
      export: false,
      resizable: false,
    },
  ] as TableColumnDefinition[];
}
