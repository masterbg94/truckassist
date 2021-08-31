import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NotificationService } from 'src/app/services/notification-service.service';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-tax2290-irs-payment',
  templateUrl: './tax2290-irs-payment.component.html',
  styleUrls: ['./tax2290-irs-payment.component.scss'],
})
export class Tax2290IrsPaymentComponent implements OnInit {
  form: FormGroup;

  isRegisteredEFTPSAccount: boolean = false;
  eftpsNotCreditCard: boolean = false;
  cannotAccessMyEFTPSAccound: boolean = false;
  madePaymentUsingEFTPS: boolean = false;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(
      () => {
        if (this.form.invalid) {
          return;
        }
        // TODO: podaci iz forme odraditi akciju
      },
      (error: any) => {
        this.sharedService.handleServerError();
      }
    );
  }

  private initForm() {
    this.form = this.formBuilder.group({
      isRegisteredEFTPSAccount: [false, Validators.requiredTrue],
      eftpsNotCreditCard: [false, Validators.requiredTrue],
      cannotAccessMyEFTPSAccound: [false, Validators.requiredTrue],
      madePaymentUsingEFTPS: [false, Validators.requiredTrue],
    });
  }
}
