import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SharedService } from 'src/app/core/services/shared.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { checkSelectedText, pasteCheck } from 'src/assets/utils/methods-global';

@Component({
  selector: 'app-tax2290-review',
  templateUrl: './tax2290-review.component.html',
  styleUrls: ['./tax2290-review.component.scss'],
})
export class Tax2290ReviewComponent implements OnInit {
  @Input() isNewCompany: boolean = false;
  @Input() userData: any;
  public form: FormGroup;
  public selectPaymentMethod = [];
  public paymentData: any[] = [
    {
      name: 'Denis Rodman',
      accountNumber: '8789665544',
      routingNumber: '236589',
    },
    {
      name: 'Michael Scarn',
      accountNumber: '8789665544',
      routingNumber: '236589',
    },
    {
      name: 'Pedro Maximoff',
      accountNumber: '8789665544',
      routingNumber: '236589',
    },
    {
      name: 'Aleksandar Pero',
      accountNumber: '8789665544',
      routingNumber: '236589',
    },
  ];
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private formBuilder: FormBuilder, private sharedService: SharedService) {}

  ngOnInit(): void {
    for (let i = 0; i < this.paymentData.length; i++) {
      this.selectPaymentMethod.push({
        index: i,
        pressed: false,
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isNewCompany?.currentValue) {
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
  }

  private initForm() {
    this.form = this.formBuilder.group({
      nameOfPayment: [null, Validators.required],
      accountNumber: [null, Validators.required],
      routingNumber: [null, Validators.required],
    });
  }

  public formatType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]*$/;
  public numOfSpaces = 0;
  public onPaste(event: any, inputID: string, index?: number) {
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
    if (inputID === 'accountNumber' || inputID === 'routingNumber') {
      this.formatType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?A-Za-z]*$/;
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

  public convertTextWithStars(text: string) {
    let reg = /.{1,7}/;
    return text.replace(reg, (m) => '*'.repeat(m.length));
  }

  onSelectPayment(index: number) {
    if (this.selectPaymentMethod[index].pressed) {
      this.selectPaymentMethod[index].pressed = !this.selectPaymentMethod[index].pressed;
    } else {
      for (const method of this.selectPaymentMethod) {
        method.pressed = false;
      }
      this.selectPaymentMethod[index].pressed = true;
    }
  }
}
