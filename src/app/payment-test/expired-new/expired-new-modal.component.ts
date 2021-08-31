import { Component, OnInit } from '@angular/core';
import { CustomModalService } from '../../core/services/custom-modal.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentDetailsComponent } from '../payment-details/payment-details.component';

@Component({
  selector: 'app-expired-new',
  templateUrl: './expired-new-modal.component.html',
  styleUrls: ['./expired-new-modal.component.scss']
})
export class ExpiredNewModalComponent implements OnInit {
  selectedTab;

  allItems = [
    'Dispatch',
    'Accounting',
    'IFTA',
    'Reporting',
    'Chat',
    'Scheduler',
    'File Management',
    'Load Management',
    'Billing',
    'Safety',
    'Repair Management',
    'Division Company',
    'Contacts',
    'Fax',
    'Dynamic Board',
    'Settlements',
    'Customers',
    'Fuel Management',
    'To-do list',
    'Accounts',
    'Mobile app'
  ];
  additionalOptions = [
    {
      trucks: 50,
      license: 10,
      ach: 1,
      fax: 10,
      gps: 25,
      eld: 35
    },
    {
      trucks: 100,
      license: 9,
      ach: 0.7,
      fax: 15,
      gps: 22,
      eld: 30
    },
    {
      trucks: 200,
      license: 8,
      ach: 0.5,
      fax: 20,
      gps: 20,
      eld: 25
    },
    {
      trucks: 500,
      license: 7,
      ach: 0.4,
      fax: 25,
      gps: 17,
      eld: 22
    },
    {
      trucks: 1000,
      license: 6,
      ach: 0.3,
      fax: 30,
      gps: 15,
      eld: 20
    }
  ];

  switchData = [
    {
      name: 'Anually',
      checked: true,
      id: 1,
      inputName: 'anually'
    },
    {
      name: 'Monthly',
      checked: false,
      id: 2,
      inputName: 'monthly'
    }
  ];

  tabValue = 1;

  constructor(private customModal: CustomModalService, private activeModal: NgbActiveModal) {
  }

  closeModal() {
    this.activeModal.close();
  }

  public tabChange(event: any) {
    this.selectedTab = event.find(x => x.checked === true);
  }

  ngOnInit(): void {
    this.selectedTab = this.switchData.find(x => x.checked === true);
  }

  goNext() {
    if (this.tabValue === 2) {
      this.activeModal.close();
      this.customModal.openModal(PaymentDetailsComponent , null , null , { size: 'small' });
    } else {
      this.tabValue++;
    }
  }
}
