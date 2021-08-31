import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { CustomModalService } from '../../core/services/custom-modal.service';
import { PaymentDetailsComponent } from '../payment-details/payment-details.component';

@Component({
  selector: 'app-processing-modal',
  templateUrl: './processing-modal.component.html',
  styleUrls: ['./processing-modal.component.scss']
})
export class ProcessingModalComponent implements OnInit {
  @Input() inputData: any;
  paymentState = 1;

  constructor(private activeModal: NgbActiveModal, private route: Router, private modalService: CustomModalService) {
  }

  closeModal() {
    this.activeModal.close();
  }

  ngOnInit(): void {
    console.log('input data', this.inputData);
    this.changeTab();
  }

  changeTab() {
    setTimeout(() => {
      if (this.inputData.data.authorize === true) {
        this.paymentState = 2;
      } else {
        this.paymentState = 3;
      }
    }, 4000);
  }

  buttonClick() {
    if (this.paymentState === 2) {
      console.log('button success');
      this.closeModal();
      this.route.navigate(['/']);
    } else {
      console.log('button fail');
      this.activeModal.close();
      this.modalService.openModal(PaymentDetailsComponent, null, null, { size: 'small' });
    }
  }
}
