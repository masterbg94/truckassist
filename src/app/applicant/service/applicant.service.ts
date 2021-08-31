import { BehaviorSubject } from 'rxjs';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { IReason } from '../model/reason.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicantStore {
  private forms = []; // all forms data

  private licences = new BehaviorSubject<any>(0); // emit licences to step5 and mvr
  private licence = new BehaviorSubject<any>(0); // listen for edit listen from step5
  public reviewCompany = new BehaviorSubject<any>(0);

  public licences$ = this.licences.asObservable();
  public licence$ = this.licence.asObservable();

  // Listen for steps
  @Output() stepForward = new EventEmitter<number>();
  @Output() stepBackward = new EventEmitter<number>();

  // Get information about section done
  @Output() isDoneApplicant = new EventEmitter<String>();
  @Output() isDoneMEdical = new EventEmitter<String>();
  @Output() isDoneMVR = new EventEmitter<String>();
  @Output() isDonePSP = new EventEmitter<String>();
  @Output() isDoneSPH = new EventEmitter<String>();
  @Output() isDoneHOS = new EventEmitter<String>();
  @Output() isDoneSSNcard = new EventEmitter<String>();
  @Output() isDoneCDLcard = new EventEmitter<String>();

  // Reason for leaving step2
  stateReason: IReason[] = [
    {
      id: 1,
      name: 'Illness',
    },
    {
      id: 2,
      name: 'Better opportunity',
    },
    {
      id: 3,
      name: 'Personal problems',
    },
    {
      id: 4,
      name: 'Company went out of business',
    },
    {
      id: 5,
      name: 'Fired or terminated',
    },
    {
      id: 6,
      name: 'Had to relocate',
    },
  ];

  // States for employers step2
  stateOfEmployer: string[] = [
    'current or',
    'second or',
    'third or',
    'fourth or',
    'fifth or',
    'sixth or',
    'seventh or',
    'eighth or',
    'ninth or',
    'tenth or',
    'eleventh or',
    'twelfth or',
    'thirteenth or',
    'fourteenth or',
    'fifteenth or',
  ];

  // Months to conver kendo
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  saveForm(formId: number, formData: any, formName?: string) {
    this.forms[formId] = formData;
    sessionStorage.setItem(formName, JSON.stringify(this.forms[formId]));
  }

  getForm(formName: string) {
    return JSON.parse(sessionStorage.getItem(formName));
  }

  saveStepCounter(step: any) {
    sessionStorage.setItem('step', JSON.stringify(step));
  }

  getStepCounter() {
    return JSON.parse(sessionStorage.getItem('step'));
  }

  getLicence(licence: any) {
    this.licence.next(licence);
  }

  convertKendoDate(date: any) {
    const month =
      date == null ? null : (this.months.indexOf(date.toString().slice(4, 7)) + 1).toString();
    const day = date == null ? null : date.toString().slice(8, 10);
    const year = date == null ? null : date.toString().slice(13, 15);
    const fullYear = date == null ? null : month.concat('/', day);
    return fullYear == null ? null : fullYear.concat('/', year);
  }
}
