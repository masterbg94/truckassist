import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { checkSelectedText, pasteCheck } from 'src/assets/utils/methods-global';

import { map, takeUntil } from 'rxjs/operators';
import { AppDriverService } from 'src/app/core/services/app-driver.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { MetaData } from 'src/app/core/model/shared/enums';
import { MetaDataService } from 'src/app/core/services/metadata.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-mvr-maintenance',
  templateUrl: './mvr-maintenance.component.html',
  styleUrls: ['./mvr-maintenance.component.scss'],
})
export class MvrMaintenanceComponent implements OnInit, OnDestroy {
  @ViewChild('driverDetails') driverDetailsRef: ElementRef;

  modalTitle: string = 'Order';

  selectedDriver = [];
  selectedApplicant = [];
  driverId: number = -1;

  pickUpForm: FormGroup;
  driverDetailForm: FormGroup;

  countryData: MetaData[];
  stateData: MetaData[];

  selectedTab = 1;
  tabs = [
    {
      id: 1,
      name: 'Driver',
    },
    {
      id: 2,
      name: 'Applicant',
    },
    {
      id: 3,
      name: 'New',
    },
  ];
  loaded: boolean = false;

  public options = {
    componentRestrictions: { country: ['US', 'CA'] },
  };
  public formatType: any;
  public numOfSpaces = 0;

  showDriverDetails: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private appDriverService: AppDriverService,
    private shared: SharedService,
    private metadataService: MetaDataService
  ) {}

  ngOnInit() {
    this.initPickUpForm();
    this.initDriverDetailForm();
    this.getDrivers();
    this.getCountryData();

    this.driverDetailForm.disable();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getDrivers() {
    this.appDriverService
      .getDrivers()
      .pipe(
        takeUntil(this.destroy$),
        map(({ activeDrivers, applicantDrivers }) => {
          return {
            drivers: activeDrivers,
            applicants: applicantDrivers,
          };
        })
      )
      .subscribe((data) => {
        this.selectedApplicant = this.premmapedDriversData(data.applicants);
        this.selectedDriver = this.premmapedDriversData(data.drivers);
      });
    this.loaded = true;
    this.showDriverDetails = true;
  }

  private premmapedDriversData(driverData: any) {
    if (driverData.length < 0) {
      return [];
    }
    for (let driver of driverData) {
      driver.fullName = driver.firstName + ' ' + driver.lastName;
    }
    return driverData;
  }

  private getCountryData() {
    this.metadataService
      .getMetaDataByDomainKey('driver', 'country')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (countries) => {
          this.countryData = countries;
        },
        (error: HttpErrorResponse) => {
          this.shared.handleError(error);
        }
      );
  }

  public getStateData(country: any) {
    if (country && country.value) {
      this.metadataService
        .getJSON(country.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe((states: MetaData[]) => {
          this.driverDetailForm.controls.state.reset();
          this.driverDetailForm.controls.state.enable();
          this.stateData = states;
        });
    } else {
      this.driverDetailForm.controls.state.reset();
      this.driverDetailForm.controls.state.disable();
    }
  }

  private initPickUpForm() {
    this.pickUpForm = this.formBuilder.group({
      pickUpOrder: [null, Validators.required],
    });
  }

  private initDriverDetailForm() {
    this.driverDetailForm = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      ssn: [null, Validators.required],
      cdl: [null, Validators.required],
      country: [null, Validators.required],
      state: [null, Validators.required],
      address: [null, Validators.required],
      unit: [null],
      charge: [null],
    });
  }

  public tabChange(event: any) {
    this.selectedTab = event.id;
    this.driverDetailForm.reset();

    if (this.selectedTab === 1) {
      this.driverDetailForm.disable();
      this.pickUpForm.enable();
    } else if (this.selectedTab === 2) {
      this.driverDetailForm.disable();
      this.pickUpForm.enable();
    } else {
      this.driverDetailForm.enable();
      this.pickUpForm.disable();
    }
  }

  public driverSelect(driver: any) {
    if (driver) {
      this.modalTitle = `Order #${driver.id}`;
      this.driverId = driver.id;
      this.driverDetailForm.enable();
      let timeout = setTimeout(() => {
        this.driverDetailForm.setValue({
          firstName: driver.firstName,
          lastName: driver.lastName,
          ssn: driver.ssn,
          cdl: driver.licenseData.lenght > 0 ? driver.licenseData[0].number : '',
          country: driver.additionalData.address.country,
          state: driver.additionalData.address.state,
          address: driver.additionalData.address.address,
          unit: driver.additionalData.address.addressUnit,
          charge: '$13.4',
        });
        this.driverDetailForm.disable();
        clearTimeout(timeout);
      }, 10);
    }
  }

  public clearSelectedDriver(event: any) {
    this.driverDetailForm.reset();
    this.driverDetailForm.disable();
  }

  public closeMvrMaintenance() {
    this.activeModal.close();
  }

  public requestMvr() {
    //******** Poslat zahtev firmi, dok se ceka odgovor status je pending
    if (!this.driverDetailForm.disabled) {
      if (!this.shared.markInvalid(this.driverDetailForm)) {
        return false;
      } else {
        if (this.selectedTab === 3) {
          // TODO: proslediti back-u podatke iz forme
        }
      }
    }

    if (!this.pickUpForm.disabled) {
      if (!this.shared.markInvalid(this.pickUpForm)) {
        return false;
      } else {
        if (this.selectedTab === 1) {
          // TODO: proslediti backu drivera postojeceg i dobiti podatke
        } else if (this.selectedTab === 2) {
          // TODO: proslediti backu applicanta postojeg i dobiti podatke
        }
      }
    }
    this.activeModal.close();
  }

  public keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.requestMvr();
    }
  }

  public openDriverDetails() {
    if (this.showDriverDetails === true) {
      this.showDriverDetails = false;
    } else {
      this.showDriverDetails = true;
      const timeout = setTimeout(() => {
        this.driverDetailsRef.nativeElement.focus();
        clearTimeout(timeout);
      }, 50);
    }
  }

  onLicenseNumberTyping(event) {
    let k;
    k = event.charCode;
    if (k == 32) {
      this.numOfSpaces++;
    } else {
      this.numOfSpaces = 0;
    }

    if (this.numOfSpaces < 2) {
      return (
        k == 8 ||
        k == 32 ||
        (k >= 65 && k <= 90) ||
        (k >= 97 && k <= 122) ||
        (k >= 48 && k <= 57) ||
        k == 45 ||
        k == 42
      );
    } else {
      event.preventDefault();
    }
  }

  /* Form Validation on paste and word validation */
  public onPaste(event: any, inputID: string, limitedCaracters?: number, index?: number) {
    if (index !== undefined) {
      (document.getElementById(inputID + index) as HTMLInputElement).value = checkSelectedText(
        inputID,
        index
      );
    } else {
      (document.getElementById(inputID) as HTMLInputElement).value = checkSelectedText(
        inputID,
        index
      );
    }

    this.numOfSpaces = 0;

    this.formatType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]*$/;
    event.preventDefault();
    if (inputID === 'ssn') {
      this.formatType = /^[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?A-Za-z]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        false
      );
    } else {
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        true,
        false,
        false,
        limitedCaracters
      );
    }

    this.driverDetailForm.controls[inputID].patchValue(
      (document.getElementById(inputID) as HTMLInputElement).value
    );
  }

  public manageInputValidation(formElement: any) {
    return this.shared.manageInputValidation(formElement);
  }

  address: any;
  isValidAddress = false;
  public handleAddressChange(address: any) {
    this.isValidAddress = true;
    this.address = this.shared.selectAddress(this.driverDetailForm, address);

    this.driverDetailForm.get('address').patchValue(this.address.address);
  }
}
