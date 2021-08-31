export interface TaCard {
  title?: any;
  status?: any;

  repair?: TaCardRepair;
  truck?: TaCardTruck;
  trailer?: TaCardTrailer;
  driver?: TaCardDriver;
  repairTruckTrailer?: TaCardRepairTruckTrailer;
  customer?: TaCardCustomer;
  load?: TaCardLoad;
  violation?: TaCardViolation;
  accident?: TaCardAccident;
}

export interface TaCardRepair {
  phone?: number;
  email?: string;
  address?: any;
  likes?: any;
  dislikes?: any;
  dropdownItems?: any[];
}

export interface TaCardTruck {
  mainImage?: string;
  logoImage?: string;
  vin?: number | any;
  year?: number | any;
  color?: string;
  model?: string;
  //  expand
  expireDate?: any;
  licencePlate?: string;
  owner?: string;
  axles?: number | any;
  weight?: number | any;
  engine?: string;
  tireSize?: string | any;
  commission?: number;
  mileage?: number | any;
  ipass?: number | any;
  insurance?: number | any;
}

export interface TaCardTrailer {
  mainImage?: string;
  logoImage?: string;
  vin?: number | string;
  year?: number | any;
  color?: string | any;
  model?: string;
  //  expand
  expireDate?: any;
  licencePlate?: string;
  owner?: string | any;
  axles?: number | string;
  tireSize?: string | number;
  length?: string | number;
  insurance?: number | string;
}

export interface TaCardDriver {
  image?: string | any;
  ssn?: string | number;
  dob?: Date | any;
  cdl?: number;
  hired?: Date | any;
  state?: any;
  term?: any;
  status?: number;
  //  expand
  phone?: number | string;
  mail?: string;
  address?: any;
  expiredMedical?: Date | any;
  expiredCDL?: Date | any;
  expiredMVR?: Date | any;
  //  bank
  account?: number;
  routing?: number;
  bankImage?: string;
  commission?: number | any;
  restrictions?: any[];
  endorsements?: any[];
}

export interface TaCardRepairTruckTrailer {
  company?: string;
  repairDate?: any;
  inv?: number;
  odo?: number;
  repairItems?: TruckTrailerRepairs[];
  total?: number | string;
}

export interface TruckTrailerRepairs {
  name?: string;
  price?: any;
  quantity?: number;
}

export interface TaCardCustomer {
  phone?: any;
  email?: string;
  address?: any;
  likes?: any;
  dislikes?: any;
  loads?: number;
  gross?: any;
}

export interface TaCardLoad {
  company?: string | number;
  miles?: number | string;
  reference?: number | string;
  dispatcher?: string;
  loads?: Load[];
  truck?: number;
  trailer?: number;
  driver?: string;
  baseRate?: number;
  adjusted?: number;
  advance?: number;
  additional?: number;
  loadMap?: any;
  totalPrice?: any;
  route?: any;
  lastRoute?: any;
  status?: any;
}

export interface Load {
  startingPoint?: LoadDestination;
  endingPoint?: LoadDestination;
  additionalPickups?: LoadDestination[];
}

export interface LoadDestination {
  place?: string;
  pickupDate?: any;
  id?: number;
  pointZip?: any;
  pointCity?: string;
  pointType?: string;
  shipperId?: number;
  pointOrder?: number;
  pointState?: string;
  shipperName?: string;
  pointAddress?: string;
  pointCountry?: string;
  pointDateTime?: string;
}

/*
    VIOLATION MODEL
*/
export interface TaCardViolation {
  reportNumber?: string;
  driverName?: string;
  date?: string;
  time?: string;
  state?: string;
  truck?: string;
  trailer?: string;
  lvl?: string;
  lvlTitle?: string;
  violationsData?: TaCardViolationListData[];
  oos?: TaCardViolationListDataOOS[];
  customer?: string;
  citation?: TaCardViolationListDataCitation[];
  citationNumber?: string;
  policeDepartment?: string;
  files?: TaCardViolationListDataFiles[];
  total?: string;
}
export interface TaCardViolationListDataFiles {
  title?: string;
  fileUrl?: string;
}
export interface TaCardViolationListDataCitation {
  title?: string;
  desc?: string;
  value?: string;
}
export interface TaCardViolationListDataOOS {
  active?: boolean;
  title?: string;
  value?: string;
}
export interface TaCardViolationListData {
  title?: string;
  iconUrl?: string;
  sumWeight?: string;
  timeWeight?: string;
  weight?: string;
  violationDetails?: TaCardViolationListDataDetails[];
}
export interface TaCardViolationListDataDetails {
  title?: string;
  oos?: string;
  oosStatus?: boolean;
  weight?: string;
  desc?: string;
}

/*
    VIOLATION MODEL
*/
/*
  ACCIDENT MODEL
*/
export interface TaCardAccident {
  reportNumber?: string;
  driverFullName?: string;
  eventDate?: string;
  state?: string;
  time?: string;
  truck?: string;
  trailer?: string;
  insuranceClaim?: string;
  fatality?: string;
  injuries?: string;
  towing?: string;
  hm?: string;
  files?: TaCardViolationListDataFiles[];
}
/*
  ACCIDENT MODEL
*/
