import { ServerResponse, ServerResponseList } from './shared/response';
// import { Color } from './shared/color';
import { Make, Owner } from './truck';
import { Enums } from './shared/enums';
import { HistoryData } from 'src/app/shared/truckassist-history-data/truckassist-history-data.component';
import { OwnerData } from './shared/owner';
import { Address } from './address';

// export interface TrailerColumn {
//   name: string;
//   title: string;
//   resizable: boolean;
//   hidden: boolean;
//   disabled: boolean;
//   field: string;
//   width: any;
//   minWidth: any;
//   orderIndex: number;
//   sortable: boolean;
//   alignCenter: boolean;
//   number: boolean;
//   disableExport: boolean;
//   filterable: boolean;
// }

// // Trailer model
// export interface Trailer {
//   id: number;
//   property: string;
//   model: string;
//   type: Enums;
//   make: Make;
//   // color: Color;
//   length: Enums;
//   owner: Owner;
//   licensePlate: string;
//   plateExpiration: Date;
//   year: number;
//   note: string;
//   status: boolean;
//   axises: string;
//   tireSize: Enums;
//   VIN: string;
//   commission: number;
//   inspection: { start: string; end: string; endDateTimeStamp: number } | string;
//   companyOwned: boolean;
//   checked: boolean;
//   isSelected: boolean;
// }

// export interface TrailerDataResult {
//   data: Trailer[];
//   activeTrailers: Trailer[];
//   inactiveTrailers: Trailer[];
// }

// export interface TrailerList extends ServerResponseList {
//   data: Trailer[];
// }

// export interface TrailerEdit extends ServerResponse {
//   data: Trailer;
// }

// export interface Maintenance {
//   id: number;
//   date: Date;
//   repairShopName: string;
//   location: string;
//   description: string;
//   price: string;
// }

// export interface Inspection {
//   id: number;
//   startDate: Date;
//   endDate: Date;
//   files?: any;
// }

// export interface InspectionList extends ServerResponse {
//   data: Inspection[];
//   count: number;
// }

// export interface InspectionEdit extends ServerResponse {
//   data: Inspection;
// }

// // v2

// export interface ManageTrailer {
//   id?: number;
//   companyOwned: number;
//   ownerId: number;
//   trailerNumber: string;
//   vin: string;
//   year: string;
//   status: number;
//   doc?: ManageTrailerDoc;
//   meta?: any;
// }

// export interface ManageTrailerDoc {
//   additionalData: AdditionalData;
//   licenses?: TrailerLicense[];
//   inspections?: TrailerInspection[];
//   titles?: TrailerTitle[];
//   leases?: TrailerLease[];
//   activityHistory?: ActivityHistory[];
// }

// export interface AdditionalData {
//   axises: string;
//   color: DropdownData;
//   commission: number;
//   length: DropdownData;
//   make: DropdownData;
//   model: string;
//   owner: DropdownData;
//   note: string;
//   tireSize: DropdownData;
//   type: DropdownData;
// }

// export interface TrailerLicense {
//   id?: number;
//   startDate?: string;
//   endDate?: string;
//   licensePlate?: string;
//   attachments?: any;
// }

// export interface TrailerInspection {
//   id?: number;
//   startDate?: string;
//   endDate?: string;
//   attachments?: any;
// }

// export interface TrailerTitle {
//   id?: number;
//   titleNumber?: string;
//   startDate?: string;
//   attachments?: any;
// }

// export interface TrailerLease {
//   id?: number;
//   lessor?: any;
//   seller?: any;
//   date?: any;
//   paymentAmount?: any;
//   numberOfPayments?: any;
//   downPayment?: any;
//   attachments?: any;
// }

// export interface ActivityHistory {
//   id?: number;
//   startDate?: string;
//   endDate?: string;
// }

// export interface DropdownData {
//   id: number;
//   image?: string;
//   name?: string;
//   code?: string;
//   lastName?: string;
//   trailersCount?: number;
//   truckCount?: number;
//   type?: any;
// }



export interface TrailerTabData {
  activeTrailers: TrailerData[];
  allTrailers: TrailerData[];
  inactiveTrailers: TrailerData[];
}

export interface TrailerData {
  guid?: string;
  id?: number;
  companyId?: number;
  companyOwned: number;
  ownerId?: number;
  trailerNumber: number;
  divisionFlag: number;
  vin: string;
  status: number;
  doc?: TrailerDoc;
  meta?: any;
  year?: string;
  animationType?: string;
  isSelected?: boolean;
  ownerName?: string;
}

export interface TrailerDoc {
  additionalData: TrailerAdditional;
  licenseData?: TrailerLicense[];
  inspectionData?: TrailerInspection[];
  titleData?: TrailerTitle[];
  trailerLeaseData?: TrailerLease[];
  activityHistory?: HistoryData[];
}

export interface TrailerAdditional {
  axises?: string;
  color?: ColorData;
  emptyWeight?: string;
  engine?: any;
  insurancePolicyNumber?: string;
  make?: MakeData;
  mileage?: string;
  model?: string;
  note?: string;
  tireSize?: number;
  length?: LengthData;
  type?: TypeData;
  year?: string;
  reeferUnit?: ReeferUnitData;
}
export interface LengthData {
  id: number,
  key: string;
  value: string;
  domain: string;
  entityId: any,
  parentId: any,
  companyId: any,
  createdAt: string;
  protected: number,
  updatedAt: string;
  entityName: any
}

export interface MakeData {
  file: string;
  name: string;
  color: string;
}

export interface TypeData {
  file: string;
  name: string;
  type: string;
  color: string;
  whiteFile: string;
  class?: string;
}

export interface ReeferUnitData {
  id: number;
  name: string;
}

export interface ColorData {
  id: number;
  key: string;
  value: string;
  domain: string;
}

export interface TrailerLicense {
  id?: string;
  startDate?: string;
  endDate?: string;
  licensePlate?: string;
  attachments?: any;
}

export interface TrailerInspection {
  id?: string;
  startDate?: string;
  endDate?: string;
  attachments?: any;
}

export interface TrailerTitle {
  id?: string;
  titleNumber?: string;
  startDate?: string;
  attachments?: any;
}

export interface TrailerLease {
  id?: string;
  lessor?: any;
  seller?: any;
  date?: any;
  paymentAmount?: any;
  numberOfPayments?: any;
  downPayment?: any;
  attachments?: any;
}

export interface TrailerOwner {
  id: number;
  ownerName: string;
  ownerType: string;
  divisionFlag: number;
}
