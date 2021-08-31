import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SharedService } from 'src/app/core/services/shared.service';
import { Tax2290Service } from 'src/app/core/services/tax2290.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { checkSelectedText, pasteCheck } from 'src/assets/utils/methods-global';

@Component({
  selector: 'app-tax2290-company-info',
  templateUrl: './tax2290-company-info.component.html',
  styleUrls: ['./tax2290-company-info.component.scss'],
})
export class Tax2290CompanyInfoComponent implements OnInit, OnDestroy {
  form: FormGroup;
  @Input() selectedCompany: any;

  public options = {
    componentRestrictions: { country: ['US', 'CA'] },
  };

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private tax2290Service: Tax2290Service,
    private sharedService: SharedService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.tax2290Service.selectedCompany.pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        if (res) {
          if (res.company.id !== null) {

            this.form.patchValue({
              companyName: res.company.name,
              ein: res.company.taxNumber,
              address: res.company.doc.additional.address.address,
              unit: res.company.doc.additional.addressUnit,
            });
            this.form.disable();
          }
          else {
            this.form.reset();
            this.form.enable();
          }
        }
      },
      (error: any) => {
        this.sharedService.handleServerError();
      }
    );

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(
      () => {
        if (this.form.invalid) {
          return;
        }
        // TODO: podaci iz forme ako je New Company => this.form.value
      },
      (error: any) => {
        this.sharedService.handleServerError();
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm() {
    this.form = this.formBuilder.group({
      companyName: [null, Validators.required],
      ein: [null, Validators.required],
      address: [null, Validators.required],
      unit: [null, Validators.required],
    });
  }

  public formatType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]*$/;
  public numOfSpaces = 0;
  onPaste(event: any, inputID: string, index?: number) {
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

    event.preventDefault();
    if (inputID === 'email') {
      this.formatType = /^[!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        false
      );
    }
    else {
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

  address: any;
  isValidAddress = false;
  public handleAddressChange(address: any) {
    this.isValidAddress = true;
    this.address = this.sharedService.selectAddress(this.form, address);

    this.form.get('address').patchValue(this.address.address);
  }
}
