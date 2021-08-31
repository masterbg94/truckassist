import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApplicantReviewService {
  public reviewStepOne = new BehaviorSubject<any>({});
  public reviewStepTwo = new BehaviorSubject<any>({});
  public reviewStepThree = new BehaviorSubject<any>({});
  public reviewStepFour = new BehaviorSubject<any>({});
  public reviewStepFive = new BehaviorSubject<any>({});
  public reviewStepSix = new BehaviorSubject<any>({});
  public reviewStepSeven = new BehaviorSubject<any>({});
  public reviewStepEight = new BehaviorSubject<any>({});
  public reviewStepNine = new BehaviorSubject<any>({});
  public reviewStepTen = new BehaviorSubject<any>({});
  public reviewStepEleven = new BehaviorSubject<any>({});

  public commonReviewSteps = new BehaviorSubject<any>({});

  public reviewStepMedical = new BehaviorSubject<any>(null);
  public reviewStepMVR = new BehaviorSubject<any>(null);
  public reviewStepPSP = new BehaviorSubject<any>(null);
  public reviewStepSPH = new BehaviorSubject<any>(null);
  public reviewStepHOS = new BehaviorSubject<any>(null);
  public reviewStepSSN = new BehaviorSubject<any>(null);
  public reviewStepCDL = new BehaviorSubject<any>(null);

  public singleItemReview = new BehaviorSubject<any>(0);

  // kakav format bi mogao da se implementira na backu (staticki podaci)

  // Review Step1
  companyReviewStepOne: {}[] = [
    {
      id: 'row1-step1',
      isTrue: null,
      firstName: {
        isFirstName: '',
      },
      lastName: {
        isLastName: '',
      },
      dob: {
        isDOB: '',
      },
      reviewerExplanation: '',
    },
    {
      id: 'row2-step1',
      isTrue: null,
      phone: {
        isPhone: '',
      },
      email: {
        isEmail: '',
      },
      reviewerExplanation: '',
    },
    {
      id: 'row3-step1',
      isTrue: null,
      address: {
        isAddress: '',
      },
      unit: {
        isUnit: '',
      },
      reviewerExplanation: '',
    },
    {
      id: 'row4-step1',
      isTrue: null,
      ssn: {
        isSSN: '',
      },
      bankName: {
        isBankName: '',
      },
      reviewerExplanation: '',
    },
    {
      id: 'row5-step1',
      isTrue: null,
      accountNumber: {
        isAccountNumber: '',
      },
      routingNumber: {
        isRoutingNumber: '',
      },
      reviewerExplanation: '',
    },
    {
      id: 'row6-step1',
      isTrue: null,
      legalWork: {
        isLegalWork: '',
      },
      reviewerExplanation: '',
    },
    {
      id: 'row7-step1',
      isTrue: null,
      otherName: {
        isOtherName: '',
      },
      reviewerExplanation: '',
    },
    {
      id: 'row8-step1',
      isTrue: null,
      explainOtherName: {
        isExplainOtherName: '',
      },
      reviewerExplanation: '',
    },
    {
      id: 'row9-step1',
      isTrue: null,
      military: {
        isMilitary: '',
      },
      reviewerExplanation: '',
    },
    {
      id: 'row10-step1',
      isTrue: null,
      felony: {
        isFelony: '',
      },
      reviewerExplanation: '',
    },
    {
      id: 'row11-step1',
      isTrue: null,
      explainFelony: {
        isExplainFelony: '',
      },
      reviewerExplanation: '',
    },
    {
      id: 'row12-step1',
      isTrue: null,
      misdemeanor: {
        isMisdemeanor: '',
      },
      reviewerExplanation: '',
    },
    {
      id: 'row13-step1',
      isTrue: null,
      explainMisdemeanor: {
        isExplainMisdemeanor: '',
      },
      reviewerExplanation: '',
    },
    {
      id: 'row14-step1',
      isTrue: null,
      duidwiovi: {
        isDuidwiovi: '',
      },
      reviewerExplanation: '',
    },
    {
      id: 'row15-step1',
      isTrue: null,
      explainDuidwiovi: {
        isExplainDuidwiovi: '',
      },
      reviewerExplanation: '',
    },
    {
      id: 'row16-step1',
      isTrue: null,
      oldAddress: {
        isOldAddress: '',
      },
      oldUnit: {
        isOldUnit: '',
      },
      reviewerExplanation: '',
    },
  ];

  // Review Step2
  companyReviewStepTwo: {}[] = [
    {
      id: 'row1-step2',
      isTrue: null,
      reviewerExplanation: '',
    },
    {
      id: 'row2-step2',
      isTrue: null,
      jobDescription: {
        isJobDescription: '',
      },
      fromDate: {
        isFromDate: '',
      },
      toDate: {
        isToDate: '',
      },
      reviewerExplanation: '',
    },
    {
      id: 'row3-step2',
      isTrue: null,
      phone: {
        isPhone: '',
      },
      email: {
        isEmail: '',
      },
      reviewerExplanation: '',
    },
    {
      id: 'row4-step2',
      isTrue: null,
      address: {
        isAddress: '',
      },
      unit: {
        isUnit: '',
      },
      reviewerExplanation: '',
    },
    {
      id: 'row5-step2',
      isTrue: null,
      truck: {
        isTruck: '',
      },
      trailer: {
        isTrailer: '',
      },
      length: {
        isLength: '',
      },
      reviewerExplanation: '',
    },
    {
      id: 'row6-step2',
      isTrue: null,
      reviewerExplanation: '',
    },
    {
      id: 'row7-step2',
      isTrue: null,
      reasonForLeaving: {
        isReasonForLeaving: '',
      },
      reviewerExplanation: '',
    },
    {
      id: 'row8-step2',
      isTrue: null,
      accountBetweenJobs: {
        isAccountBetweenJobs: '',
      },
      reviewerExplanation: '',
    },
  ];

  // Review Step3
  companyReviewStepThree: {}[] = [
    {
      id: 'row1-step3',
      isTrue: null,
      licence: {
        isLicence: '',
      },
      country: {
        isCountry: '',
      },
      state: {
        isState: '',
      },
      class: {
        isClass: '',
      },
      reviewerExplanation: '',
    },
    {
      id: 'row2-step3',
      isTrue: null,
      expDate: {
        isExpdate: '',
      },
      endorsements: {
        isEndorsements: '',
      },
      reviewerExplanation: '',
    },
    {
      id: 'row3-step3',
      isTrue: null,
      reviewerExplanation: '',
    },
    {
      id: 'row4-step3',
      isTrue: null,
      reviewerExplanation: '',
    },
    {
      id: 'row5-step3',
      isTrue: null,
      motorVehicle: {
        isMotorVehicle: '',
      },
      reviewerExplanation: '',
    },
  ];

  companyReviewStepFour: {}[] = [
    {
      id: 'row1-step4',
      isTrue: null,
      location: {
        isLocation: '',
      },
      date: {
        isDate: '',
      },
      reviewerExplanation: '',
    },
    {
      id: 'row2-step4',
      isTrue: null,
      reviewerExplanation: '',
    },
    {
      id: 'row3-step4',
      isTrue: null,
      reviewerExplanation: '',
    },
  ];

  // Must be implement dynamical array
  companyReviewStepFive: {}[] = [
    {
      id: 'row1-step5',
      isTrue: null,
      date: {
        isDate: '',
      },
      vehicle: {
        isVehicle: '',
      },
      location: {
        isLocation: '',
      },
      description: {
        isDescription: '',
      },
      reviewerExplanation: '',
    },
  ];

  companyReviewStepSix: {}[] = [
    {
      id: 'row1-step6',
      isTrue: null,
      grade: '',
      reviewerExplanation: '',
    },
    {
      id: 'row2-step6',
      isTrue: null,
      specialTraining: '',
      reviewerExplanation: '',
    },
    {
      id: 'row3-step6',
      isTrue: null,
      specialTrainingExp: {
        isSpecialTrainingExp: '',
      },
      reviewerExplanation: '',
    },
    {
      id: 'row4-step6',
      isTrue: null,
      otherTraining: '',
      reviewerExplanation: '',
    },
    {
      id: 'row5-step6',
      isTrue: null,
      otherTrainingExp: {
        isOtherTrainingExp: '',
      },
      reviewerExplanation: '',
    },
    {
      id: 'row6-step6',
      isTrue: null,
      federalMotoCarrier: '',
      reviewerExplanation: '',
    },
    {
      id: 'row7-step6',
      isTrue: null,
      drivingBefore: '',
      reviewerExplanation: '',
    },
    {
      id: 'row8-step6',
      isTrue: null,
      reason: '',
      reviewerExplanation: '',
    },
    {
      id: 'row9-step6',
      isTrue: null,
      reasonExp: {
        isReasonExp: '',
      },
      reviewerExplanation: '',
    },
    {
      id: 'row10-step6',
      isTrue: null,
      emergencyName: {
        isEmergencyName: '',
      },
      emergencyPhone: {
        isEmergencyPhone: '',
      },
      emergencyRelation: {
        isEmergencyRelation: '',
      },
      reviewerExplanation: '',
    },
  ];
  companyReviewStepSeven: {}[] = [
    {
      id: 'row1-step7',
      isTrue: null,
      hos: '',
      reviewerExplanation: '',
    },
    {
      id: 'row2-step7',
      isTrue: null,
      date: {
        isDate: '',
      },
      city: {
        isCity: '',
      },
      reviewerExplanation: '',
    },
    {
      id: 'row3-step7',
      isTrue: null,
      workForAnotherEmp: '',
      reviewerExplanation: '',
    },
    {
      id: 'row4-step7',
      isTrue: null,
      workForAnotherEmpExp: '',
      reviewerExplanation: '',
    },
    {
      id: 'row5-step7',
      isTrue: null,
      intendToWorkForAnotherEmp: '',
      reviewerExplanation: '',
    },
    {
      id: 'row6-step7',
      isTrue: null,
      intendToWorkForAnotherEmpExp: '',
      reviewerExplanation: '',
    },
  ];

  companyReviewStepEight: {}[] = [
    {
      id: 'row1-step8',
      isTrue: null,
      motorCarrier: {
        isMotorCarrier: '',
      },
      motorPone: {
        isMotorPhone: '',
      },
      reviewerExplanation: '',
    },
    {
      id: 'row2-step8',
      isTrue: null,
      motorAddress: {
        isMotorAddress: '',
      },
      motorUnit: {
        isMotorUnit: '',
      },
      reviewerExplanation: '',
    },
    {
      id: 'row3-step8',
      isTrue: null,
      sapName: {
        isSapName: '',
      },
      sapPhone: {
        isSapPhone: '',
      },
      reviewerExplanation: '',
    },
    {
      id: 'row4-step8',
      isTrue: null,
      sapAddress: {
        isSapAddress: '',
      },
      sapUnit: {
        isSapUnit: '',
      },
      reviewerExplanation: '',
    },
  ];
  companyReviewStepEleven: {}[] = [
    {
      id: 'row1-step11',
      isTrue: null,
      signaturePad: '',
      reviewerExplanation: '',
    },
  ];


  companyReviewStepMedical: {}[] = [
    {
      id: 'row1-stepMedical',
      isTrue: null,
      medicalFile: '',
      reviewerExplanation: '',
    },
  ];
  companyReviewStepMVR: {}[] = [
    {
      id: 'row1-stepMVR',
      isTrue: null,
      mvrFile: '',
      reviewerExplanation: '',
    },
  ];
  companyReviewStepPSP: {}[] = [
    {
      id: 'row1-stepPSP',
      isTrue: null,
      pspFile: '',
      reviewerExplanation: '',
    },
  ];
  companyReviewStepSPH: {}[] = [
    {
      id: 'row1-stepSPH',
      isTrue: null,
      sphFile: '',
      reviewerExplanation: '',
    },
  ];
  companyReviewStepHOS: {}[] = [
    {
      id: 'row1-stepHOS',
      isTrue: null,
      hosFile: '',
      reviewerExplanation: '',
    },
  ];
  companyReviewStepSSN: {}[] = [
    {
      id: 'row1-stepSSN',
      isTrue: null,
      ssnFile: '',
      reviewerExplanation: '',
    },
  ];
  companyReviewStepCDL: {}[] = [
    {
      id: 'row1-stepCDL',
      isTrue: null,
      cdlFile: '',
      reviewerExplanation: '',
    },
  ];
}
