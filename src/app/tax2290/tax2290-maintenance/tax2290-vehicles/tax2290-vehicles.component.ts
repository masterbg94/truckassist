import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppTruckService } from './../../../core/services/app-truck.service';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SharedService } from 'src/app/core/services/shared.service';
import { checkSelectedText, pasteCheck } from 'src/assets/utils/methods-global';
import { NotificationService } from 'src/app/services/notification-service.service';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

@Component({
  selector: 'app-tax2290-vehicles',
  templateUrl: './tax2290-vehicles.component.html',
  styleUrls: ['./tax2290-vehicles.component.scss'],
})
export class Tax2290VehiclesComponent implements OnInit {
  form: FormGroup;
  public trucks = [];
  public vehicles = [];
  private vehiclesTax: number = 0;
  public forestry: boolean = false;
  public farming: boolean = false;
  public suspended: boolean = false;
  @Output() onActionSchedule = new EventEmitter<any>();
  @Input() onResetCompany: boolean = false;

  firstUsedDate = [
    { id: 1, name: 'January' },
    { id: 2, name: 'February' },
    { id: 3, name: 'March' },
    { id: 4, name: 'April' },
    { id: 5, name: 'May' },
    { id: 6, name: 'June' },
    { id: 7, name: 'July' },
    { id: 8, name: 'August' },
    { id: 9, name: 'September' },
    { id: 10, name: 'October' },
    { id: 11, name: 'November' },
    { id: 12, name: 'December' },
  ];
  grossWeight = [
    { id: 1, name: 'A - 55,000 lbs.' },
    { id: 2, name: 'B - 55,001 - 56,000 lbs.' },
    { id: 3, name: 'C - 56,001 - 57,000 lbs.' },
    { id: 4, name: 'D - 57,001 - 58,000 lbs.' },
    { id: 5, name: 'E - 58,001 - 59,000 lbs.' },
    { id: 6, name: 'F - 59,001 - 60,000 lbs.' },
    { id: 7, name: 'G - 60,001 - 61,000 lbs.' },
    { id: 8, name: 'H - 61,001 - 62,000 lbs.' },
    { id: 9, name: 'I - 62,001 - 63,000 lbs.' },
    { id: 10, name: 'J - 63,001 - 64,000 lbs.' },
    { id: 11, name: 'K - 64,001 - 65,000 lbs.' },
    { id: 12, name: 'L - 65,001 - 66,000 lbs.' },
    { id: 13, name: 'M - 66,001 - 67,000 lbs.' },
    { id: 14, name: 'N - 67,001 - 68,000 lbs.' },
    { id: 15, name: 'O - 68,001 - 69,000 lbs.' },
    { id: 16, name: 'P - 69,001 - 70,000 lbs.' },
    { id: 17, name: 'Q - 70,001 - 71,000 lbs.' },
    { id: 18, name: 'R - 71,001 - 72,000 lbs.' },
    { id: 19, name: 'S - 72,001 - 73,000 lbs' },
    { id: 20, name: 'T - 73,001 - 74,000 lbs.' },
    { id: 21, name: 'U - 74,001 - 75,000 lbs.' },
    { id: 22, name: 'V - Over 75,000 lbs.' },
    { id: 23, name: 'W - Suspended' },
  ];

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private appTruckService: AppTruckService,
    private notificationService: NotificationService,
    private sharedService: SharedService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.initForm();
    this.getTrucks();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes.onResetCompany.currentValue) {
      this.vehicles = [];
      this.vehiclesTax = 0;
      this.onActionSchedule.emit({
        length: this.vehicles.length,
        type: 'reset-vehicle',
        vehiclesTax: this.vehiclesTax,
      });
    }
  }

  private getTrucks() {
    this.appTruckService
      .getTrucks()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.trucks = res.allTrucks;
        },
        (error: any) => {
          this.sharedService.handleServerError();
        }
      );
  }

  initForm() {
    this.form = this.formBuilder.group({
      vinNumber: [null, Validators.required],
      grossWeight: [null, Validators.required],
      firstUsedDate: [null, Validators.required],
      description: [null],
      forestry: [false],
      farming: [false],
      suspended: [false],
      tax: [null],
    });
  }

  onClear(data: any, type: string) {
    if (type === 'vin-number') {
      this.form.get('vinNumber').reset();
    } else if (type === 'gross-weight') {
      this.form.get('grossWeight').reset();
    } else if (type === 'first-used-date') {
      this.form.get('firstUsedDate').reset();
    }
  }

  public numOfSpaces = 0;
  public formatType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]*$/;

  onDescriptionTyping(event) {
    let k;
    k = event.charCode;
    if (k == 32) {
      this.numOfSpaces++;
    } else {
      this.numOfSpaces = 0;
    }
    if (this.numOfSpaces < 2) {
      return (
        (k > 64 && k < 91) ||
        (k > 96 && k < 123) ||
        k == 8 ||
        k == 32 ||
        (k >= 48 && k <= 57) ||
        k == 45
      );
    } else {
      event.preventDefault();
    }
  }

  onPaste(event: any, inputID: string, index?: number) {
    if (index !== undefined) {
      (document.getElementById(inputID + index) as HTMLInputElement).value = checkSelectedText(
        inputID,
        index
      );
    } else if (inputID === 'tax') {
      this.formatType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?A-Za-z]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        false
      );
    } else {
      (document.getElementById(inputID) as HTMLInputElement).value = checkSelectedText(
        inputID,
        index
      );
    }

    event.preventDefault();
    if (inputID === 'description') {
      this.formatType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        false
      );
    } else {
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        false
      );
    }

    this.form.controls[inputID].patchValue(
      (document.getElementById(inputID) as HTMLInputElement).value
    );
  }

  callAction(type: string) {
    if (type === 'upload-schedule') {
      this.onActionSchedule.emit('upload-schedule');
    } else if (type === 'add-new-vehicle') {
      if (this.form.get('vinNumber').value === null) {
        this.notificationService.warning('Please fill all required fields!')
        return;
      }
      this.populateVehicleCard();
      this.onActionSchedule.emit({
        length: this.vehicles.length,
        type: 'add-new-vehicle',
        vehiclesTax: this.vehiclesTax,
      });
      this.form.reset();
      this.form.get('tax').reset();
      this.form.get('tax').enable();
    } else if (type === 'clear-schedule') {
      this.onActionSchedule.emit('clear-schedule');
    }
  }

  clearFormInputs() {
    this.form.reset();
  }

  populateVehicleCard() {
    this.vehicles = [
      ...this.vehicles,
      {
        id: this.vehicles.length,
        vin: this.form.get('vinNumber').value.vin,
        grossWeight: this.form.get('grossWeight').value.name.split(' ')[0],
        firstUsedDate: this.manipulateWithDateFormat(this.form.get('firstUsedDate').value.name),
        description: this.form.get('description').value,
        forestry: this.form.get('forestry').value,
        farming: this.form.get('farming').value,
        suspended: this.form.get('suspended').value,
        tax: formatter.format(this.form.get('tax').value),
      },
    ];
    this.vehiclesTax += +this.form.get('tax').value;
  }

  onEditVehicleItem(index: number) {
    alert('Edit ' + index);
  }

  onDeleteVehicleItem(index: number) {
    alert('Delete ' + index);
    this.vehicles.splice(0, index);
  }

  manipulateWithDateFormat(data: any) {
    const months = [
      'january',
      'february',
      'march',
      'april',
      'may',
      'jun',
      'jul',
      'august',
      'september',
      'october',
      'november',
      'december',
    ];
    const monthNumber = months.indexOf(data.toLowerCase()) + 1;
    const currentYear = new Date().getFullYear().toString().substr(-2);

    return monthNumber + '/' + currentYear;
  }

  onPressSuspended() {
    this.suspended = !this.suspended;
    if (!this.suspended) {
      this.form.get('tax').reset();
      this.form.get('tax').disable();
    } else {
      this.form.get('tax').reset();
      this.form.get('tax').enable();
    }
  }
}
