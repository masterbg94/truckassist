export interface ApplicantData {
  name: string;
  dob: string;
  phone: string;
  email: string;
  app: number | boolean;
  mvr: number | boolean;
  psp: number | boolean;
  sph: number | boolean;
  ssn: number | boolean;
  medical: any;
  cdl: any;
  rev: number | boolean;
  note: string;
  files: any[];
}
