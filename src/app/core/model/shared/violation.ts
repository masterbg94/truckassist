export interface ViolationManage {
  reportNumber?: string;
  driverName?: string;
  date?: string;
  time?: string;
  state?: string;
  truck?: string;
  trailer?: string;
  lvl?: string;
  lvlTitle?: string;
  violationsData?: ViolationManageListData[];
  oos?: ViolationManageListDataOOS[];
  customer?: string;
  citation?: ViolationManageListDataCitation[];
  citationNumber?: string;
  policeDepartment?: ViolationManagePolice;
  files?: ViolationManageListDataFiles[];
  total?: string;
}
export interface ViolationManageListDataFiles {
  title?: string;
  fileUrl?: string;
}
export interface ViolationManageListDataCitation {
  title?: string;
  desc?: string;
  value?: string;
}
export interface ViolationManageListDataOOS {
  active?: boolean;
  title?: string;
  value?: string;
}
export interface ViolationManageListData {
  title?: string;
  iconUrl?: string;
  sumWeight?: string;
  timeWeight?: string;
  weight?: string;
  violationDetails?: ViolationManageListDataDetails[];
}
export interface ViolationManageListDataDetails {
  title?: string;
  oos?: string;
  oosStatus?: boolean;
  weight?: string;
  desc?: string;
}
export interface ViolationManagePolice {
  policeDepartment?: string;
  address?: string;
  phone?: string;
  fax?: string;
}
