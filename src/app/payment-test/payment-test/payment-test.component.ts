import { Component, OnInit } from '@angular/core';
import { ExpiredModalComponent } from '../expired-modal/expired-modal.component';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { AccountModalComponent } from '../account-modal/account-modal.component';
import { PaymentDetailsModalComponent } from '../payment-details-modal/payment-details-modal.component';
import { PaymentDetailsSecondComponent } from '../payment-details-second/payment-details-second.component';
import { ExpiredSecondModalComponent } from '../expired-second-modal/expired-second-modal.component';
import { SuccessfulSubscibingModalComponent } from '../successful-subscibing-modal/successful-subscibing-modal.component';
import { PaymentFaliModalComponent } from '../payment-fali-modal/payment-fali-modal.component';
import { AddCardAccountModalComponent } from '../add-card-account-modal/add-card-account-modal.component';
import { AddCardModalComponent } from '../add-card-modal/add-card-modal.component';
import { PaymentUnsuccesfulModalComponent } from '../payment-unsuccesful-modal/payment-unsuccesful-modal.component';
import { ProcessingModalComponent } from '../processing-modal/processing-modal.component';
import { PaymentDetailsComponent } from '../payment-details/payment-details.component';
import { ExpiredNewModalComponent } from '../expired-new/expired-new-modal.component';

@Component({
  selector: 'app-payment-test',
  templateUrl: './payment-test.component.html',
  styleUrls: ['./payment-test.component.scss'],
})
export class PaymentTestComponent implements OnInit {
  constructor(private customModalService: CustomModalService) {}

  ngOnInit(): void {}

  openExpiredModal(): void {
    const data = {
      textAlert: 'Your trial has expired',
      textNote: `Lorem ipsum dolor sit, amet consectetur adipisicing elit.
      Temporibus vel ducimus dolorem totam libero cumque facilis
      delectus blanditiis accusantium, ad perspiciatis, vitae eius
       quia aliquam non nostrum modi repudiandae voluptate.`,
      buttonText: 'Subscribe',
    };
    this.customModalService.openModal(ExpiredModalComponent, { data }, null, {
      size: 'small',
    });
  }

  openAccountModal(): void {
    const data = {
      modalTitle: 'Account Plans',
      middHeadline: 'Additional Charges',
      bottomtext: `Lorem ipsum dolor sit, amet consectetur adipisicing elit.
    Temporibus vel ducimus dolorem totam libero cumque facilis
    delectus blanditiis accusantium, ad perspiciatis, vitae eius
     quia aliquam non nostrum modi repudiandae voluptate`,
      buttonText: 'Subscribe',
    };
    this.customModalService.openModal(AccountModalComponent, { data }, null, {
      size: 'medium',
    });
  }
  openPaymentDetailsModalComponent(): void {
    const data = {
      headerFirst: 'Payment Details',
      markedTitle: 'NEXT PAYMENT DUE DATE-',
      markedData: '12.4.2020',
      textUnderlogoFirst: 'Add your payment method',
      textUnderlogoSecond: 'Pay via bank transfer',
      headerSecond: 'Billinig Info',
      buttonText: 'Authorize payment',
      headerthird: 'ACH Confirmation',
      checkedSecond: `I authorize <span style='color:#28529F'>TruckAssist</span> to electornically debit my account and,
      if necessary, electronically credit my account to correct
      erroneous debits.`,
      checkedFirst: 'Save billing info',
    };
    this.customModalService.openModal(PaymentDetailsModalComponent, { data }, null, {
      size: 'small',
    });
    // setTimeout(function() {
    //   console.log(document.getElementById('truckAssist'));
    //   document.getElementById('trackAssist').innerHTML = this.checkedSecond;
    // }, 4000);
  }
  openPaymentDetailsSecondComponent(): void {
    const data = {
      headerFirst: 'Payment Details',
      markedTitle: 'NEXT PAYMENT DUE DATE-',
      markedData: '12.4.2020',
      textUnderlogoFirst: 'Add your payment method',
      textUnderlogoSecond: 'Play via card',
      headerSecond: 'Billinig Info',
      checkedFirst: 'Save billing info',
      headerthird: 'ACH Confirmation',
      checkedSecond: `I authorize <span style='color:#28529F'>TruckAssist</span> to electornically debit my account and,
      if necessary, electronically credit my account to correct
      erroneous debits.`,
      buttonText: 'Authorize payment',
    };
    this.customModalService.openModal(PaymentDetailsSecondComponent, { data }, null, {
      size: 'small',
    });
  }
  openExpiredSecondModalComponent(): void {
    this.customModalService.openModal(ExpiredSecondModalComponent, null , null, {
      size: 'small',
    });
  }

  openSuccessfulSubscibingModalComponent(): void {
    this.customModalService.openModal(SuccessfulSubscibingModalComponent, null , null, {
      size: 'small',
    });
  }

  openPaymentFaliModalComponent(): void {
    const data = {
      headerFirst: 'Payment Details',
      markedTitle: 'PAYMENT UNSUCCESFUL',
      unmarkedTitle: 'Choose your payment method',
      headerSecond: 'Billinig Info',
      checkedFirst: 'Save billing info',
      headerthird: 'ACH Confirmation',
      checkedSecond: `I authorize <span style='color:#28529F'>TruckAssist</span> to electornically debit my account and,
      if necessary, electronically credit my account to correct
      erroneous debits.`,
      buttonText: 'Athorize another payment',
    };

    this.customModalService.openModal(PaymentFaliModalComponent, { data }, null, {
      size: 'small',
    });
  }
  openAddCardAccountModalComponent(): void {
    const data = {
      headerFirst: 'Payment Details',
      markedTitle: 'NEXT PAYMENT DUE DATE-',
      markedData: '12.4.2020',
      textUnderlogoFirst: 'Add your payment method',
      textUnderlogoSecond: 'Play via card',
      headerSecond: 'Billinig Info',
      checkedFirst: 'Save billing info',
      headerthird: 'ACH Confirmation',
      checkedSecond: `I authorize <span style='color:#28529F'>TruckAssist</span> to electornically debit my account and,
      if necessary, electronically credit my account to correct
      erroneous debits.`,
      buttonText: 'Pay $99',
    };
    this.customModalService.openModal(AddCardAccountModalComponent, { data }, null, {
      size: 'small',
    });
  }
  openAddCardModalComponent(): void {
    const data = {
      headerFirst: 'Payment Details',
      markedTitle: 'NEXT PAYMENT DUE DATE-',
      markedData: '12.4.2020',
      textUnderlogoFirst: 'Add your payment method',
      textUnderlogoSecond: 'Play via card',
      headerSecond: 'Billinig Info',
      checkedFirst: 'Save billing info',
      headerthird: 'ACH Confirmation',
      checkedSecond: `I authorize <span style='color:#28529F'>TruckAssist</span> to electornically debit my account and,
      if necessary, electronically credit my account to correct
      erroneous debits.`,
      buttonText: 'Pay $99',
    };
    this.customModalService.openModal(AddCardModalComponent, { data }, null, {
      size: 'small',
    });
  }
  openPaymentUnsuccesfulModalComponent(): void {
    const data = {
      headerFirst: 'Payment Details',
      markedTitle: 'PAYMENT UNSUCCESFUL',
      textUnderlogoFirst: 'Add your payment method',
      textUnderlogoSecond: 'Pay via card',
      headerSecond: 'Billinig Info',
      checkedFirst: 'Save billing info',
      headerthird: 'ACH Confirmation',
      checkedSecond: `I authorize <span style='color:#28529F'>TruckAssist</span> to electornically debit my account and,
      if necessary, electronically credit my account to correct
      erroneous debits.`,
      buttonText: 'Pay $99',
    };
    this.customModalService.openModal(  PaymentUnsuccesfulModalComponent, { data }, null, {
      size: 'small',
    });
  }

  openProcessingModalComponent(): void {
    this.customModalService.openModal(ProcessingModalComponent, null, null, {
      size: 'small',
    });
  }

  openExpiredNew() {
    this.customModalService.openModal(ExpiredNewModalComponent, null, null, { size: 'small' });
  }

  openPaymentDetail() {
    this.customModalService.openModal(PaymentDetailsComponent, null, null, { size: 'small' });
  }
}
