import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, Input, OnInit, OnDestroy, SimpleChanges } from '@angular/core';
import { Tax2290Service } from 'src/app/core/services/tax2290.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SharedService } from 'src/app/core/services/shared.service';
import { checkSelectedText, emailChack, pasteCheck } from 'src/assets/utils/methods-global';
import { NotificationService } from 'src/app/services/notification-service.service';

@Component({
  selector: 'app-tax2290-signer',
  templateUrl: './tax2290-signer.component.html',
  styleUrls: ['./tax2290-signer.component.scss'],
})
export class Tax2290SignerComponent implements OnInit, OnDestroy {
  form: FormGroup;
  @Input() signer: any;
  @Input() isSignerEditable: boolean = false;

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
            const user = JSON.parse(localStorage.getItem('currentUser')); // TODO: Proveriti sa Ivanom
            this.form.patchValue({
              firstName: user.firstName,
              lastName: user.lastName,
              title: 'President', // TODO: Proveriti sa Ivanom, kako ce ovo ici
              phone: res.company.doc.additional.phone,
              email: res.company.doc.additional.email,
            });
            this.form.disable();
          } else {
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isSignerEditable.currentValue) {
      this.form?.enable();
      this.sharedService.touchFormFields(this.form);
    } else {
      this.form?.disable();
    }
  }

  private initForm() {
    this.form = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      title: [null, Validators.required],
      phone: [null, Validators.required],
      email: [null, Validators.required],
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

  manageInputValidation(formElement: any) {
    return this.sharedService.manageInputValidation(formElement);
  }

  onEmailTyping(event) {
    return emailChack(event);
  }
}
