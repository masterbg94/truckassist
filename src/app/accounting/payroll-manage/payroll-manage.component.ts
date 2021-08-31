import { AppAccountingService } from './../../core/services/app-accounting-service';
import { SharedService } from 'src/app/core/services/shared.service';
import { dollarFormat } from 'src/app/core/helpers/formating';
import { AppDriverService } from 'src/app/core/services/app-driver.service';
import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrencyPipe} from '@angular/common';
import { SpinnerService } from 'src/app/core/services/spinner.service';
@Component({
  selector: 'app-payroll-manage',
  templateUrl: './payroll-manage.component.html',
  styleUrls: ['./payroll-manage.component.scss'],
  providers: [CurrencyPipe]
})
export class PayrollManageComponent implements OnInit {
  @Input() inputData: any;
  constructor(
              private formBuilder: FormBuilder,
              private activeModal: NgbActiveModal,
              private driverService: AppDriverService,
              private currencyPipe: CurrencyPipe,
              private spinner: SpinnerService,
              private shared: SharedService,
              private accountingService: AppAccountingService,
            ) { }

  payrollForm: FormGroup;
  driverList: any[];
  modalTitle = 'Add Credit';
  deducationDisabled = false;
  switchData: any = [
    {
      id: 'driver',
      name: 'Driver',
      checked: true,
    },
    {
      id: 'truck',
      name: 'Truck',
      checked: false,
    },
  ];

  eventRepeater: any = [
    {
      id: 1,
      name: 'Weekly',
      checked: true
    },
    {
      id: 2,
      name: 'Monthly',
      checked: false
    }
  ];

  deductionType: any = [
    {
      id: 1,
      name: 'Single'
    },
    {
      id: 2,
      name: 'Recurring'
    }
  ];

  switchType(data: any) {
    if (data !== undefined && data[0] !== undefined) {
      console.log(data);
    }
  }

  ngOnInit(): void {
    this.createForm();
    this.getAllDrivers();

    if (this.inputData.data.type === 'edit') {
      const tempData = this.inputData.data.id;
      this.payrollForm.patchValue({
        driverId: tempData.driverId,
        itemDate: tempData.itemDate,
        description: tempData.description,
        amount: tempData.amount,
        type: tempData.type,
        limitNumber: tempData.limitNumber,
        payment: tempData.payment,
        limited: tempData.limited,
        period: tempData.period
      });

      if ( tempData.limited ) { this.deducationDisabled = true; }
    }
  }

  closeModal() {
    this.activeModal.close();
  }

  public changeRepeater(item: any) {
    const selectedRepeater = item.filter((itm: any) => itm.checked)[0];
    console.log(selectedRepeater);
    this.payrollForm.get('period').setValue(selectedRepeater.id);
  }

  getAllDrivers() {
    this.driverService.getDrivers().subscribe((res) => {
      console.log(res);
      this.driverList = res.allDrivers;
    });
  }

  createForm() {
    this.payrollForm = this.formBuilder.group({
      driverId: [null, Validators.required],
      itemDate: [new Date(), Validators.required],
      description: [null, Validators.required],
      amount: [null, Validators.required],
      type: [null],
      limitNumber: 1,
      payment: dollarFormat(0),
      limited: false,
      period: 1
    });
  }

  saveAccountingItem() {
    if (this.payrollForm.invalid) {
      if (!this.shared.markInvalid(this.payrollForm)) {
        return false;
      }
      return;
    }

    this.spinner.show(true);
    const payrollForm = this.payrollForm.getRawValue();

    console.log(JSON.stringify(payrollForm));

    if (this.inputData.data.title == 'Deductions') {
      this.accountingService.createDeduction(payrollForm).then(res => {
        this.activeModal.close();
        this.spinner.show(false);
      });
    } else if (this.inputData.data.title == 'Bonuses') {
      this.accountingService.createBonuses(payrollForm).then(res => {
        this.activeModal.close();
        this.spinner.show(false);
      });
    } else if (this.inputData.data.title == 'Credits') {
      this.accountingService.createCredits(payrollForm).then(res => {
        this.activeModal.close();
        this.spinner.show(false);
      });
    }
  }

  transformAmount(element) {
    this.payrollForm.get('payment').setValue(this.currencyPipe.transform(this.payrollForm.get('payment').value, '$'));

    element.target.value = this.payrollForm.get('payment').value;
}

  public get paymentMain() {
    return this.payrollForm.get('payment').value;
  }

  deducationTypeChanged(e) {
    this.deducationDisabled = false;
    this.payrollForm.get('limited').setValue(false);
  }

  checkCheckbox(e) {
    this.deducationDisabled = !this.deducationDisabled;
    const limited_value = this.payrollForm.get('limited').value;
    this.payrollForm.get('limited').setValue(!limited_value);
    if ( !this.deducationDisabled ) {
      this.payrollForm.get('limitNumber').setValue(1);
      this.calculatePayment();
    }
  }

  pickupDateDateChange(e) {
    this.payrollForm.get('itemDate').setValue(e);
  }

  changeCount(upDown: string) {
    let limit = 0;
    const tempLimit = this.payrollForm.get('limitNumber').value;

    if ( upDown == 'up' ) {
      limit = tempLimit + 1;
    } else {
      limit = tempLimit - 1;
      if ( limit < 1 ) { limit = 1; }
    }

    this.payrollForm.get('limitNumber').setValue(limit);
    this.calculatePayment();
  }

  calculatePayment() {
    const amount = this.payrollForm.get('amount').value;
    const limit = this.payrollForm.get('limitNumber').value;
    if ( amount ) {
      this.payrollForm.get('payment').setValue(this.currencyPipe.transform(amount / limit, '$'));
    }
  }
}
