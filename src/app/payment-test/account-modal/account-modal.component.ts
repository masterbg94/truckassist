import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
export interface CustomItem {
  name: string;
}

export interface AdditionalCharges {
  truck: number;
  unit: number;
  ach: number;
  fax: number;
  gps: number;
  eld: number;
}

export interface SwitchValues {
  id: string;
  name: string;
  checked: boolean;
}
@Component({
  selector: 'app-account-modal',
  templateUrl: './account-modal.component.html',
  styleUrls: ['./account-modal.component.scss'],
})
export class AccountModalComponent implements OnInit {
  @Input() inputData: any;
  toggle = true;
  modalTitle = '';
  topHeadline = '';
  middHeadline = '';
  bottomtext = '';
  selectedTab = 'Anually';
  buttonText = '';

  SwitchValues = [
    {
      id: 'anually',
      name: 'Anually',
      checked: true,
    },
    {
      id: 'monthly',
      name: 'Monthly',
      checked: false,
    },
  ];
  headers = new Map([
    ['truck', 'Truck'],
    ['unit', 'Lic. Per Unit'],
    ['ach', 'ACH Pay'],
    ['fax', 'Fax'],
    ['gps', 'GPS'],
    ['eld', 'ELD'],
  ]);
  items: CustomItem[] = [
    {
      name: 'Dispatch',
    },
    {
      name: 'Load Managmant',
    },
    {
      name: 'Dynamic Board',
    },
    {
      name: 'Accounting',
    },
    {
      name: 'Billing',
    },
    {
      name: 'Settlements',
    },
    {
      name: 'IFTA',
    },
    {
      name: 'Safety',
    },
    {
      name: 'Customers',
    },
    {
      name: 'Reporting',
    },
    {
      name: 'Repair Managment',
    },
    {
      name: 'Fuel Managment',
    },
    {
      name: 'Chart',
    },
    {
      name: 'Division Company',
    },
    {
      name: 'To-do list',
    },
    {
      name: 'Scheduler',
    },
    {
      name: 'Contacts',
    },
    {
      name: 'Accounts',
    },
    {
      name: 'File Managment',
    },
    {
      name: 'Fax',
    },
    {
      name: 'Mobile app',
    },
  ];

  charges: AdditionalCharges[] = [
    {
      truck: 50,
      unit: 10,
      ach: 1,
      fax: 10,
      gps: 25,
      eld: 35,
    },
    {
      truck: 100,
      unit: 9,
      ach: 0.7,
      fax: 15,
      gps: 22,
      eld: 30,
    },
    {
      truck: 200,
      unit: 8,
      ach: 0.5,
      fax: 20,
      gps: 20,
      eld: 25,
    },
    {
      truck: 500,
      unit: 7,
      ach: 0.4,
      fax: 25,
      gps: 17,
      eld: 22,
    },
    {
      truck: 1000,
      unit: 6,
      ach: 0.3,
      fax: 30,
      gps: 15,
      eld: 20,
    },
  ];

  @Output() switchClicked = new EventEmitter<any>();
  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    const t = this;
    t.loadInitAcc();
    setTimeout(() => {
      t.addBorderOnFirstColunm();
    }, 0);
  }

  loadInitAcc(): void {
    this.modalTitle = this.inputData.data.modalTitle;
    this.middHeadline = this.inputData.data.middHeadline;
    this.topHeadline = this.inputData.data.topHeadline;
    this.bottomtext = this.inputData.data.bottomtext;
    this.buttonText = this.inputData.data.buttonText;
  }

  closeModal() {
    this.activeModal.close();
  }

  switch_plan() {
    if (this.toggle) {
      (document.getElementById('anually') as HTMLDivElement).innerHTML = 'Base Monthly Plan';
      (document.getElementById('income') as HTMLDivElement).innerHTML = '$99.99';
    } else {
      (document.getElementById('anually') as HTMLDivElement).innerHTML = 'Base Anually Plan';
      (document.getElementById('income') as HTMLDivElement).innerHTML = '$1,049.00';
    }
    this.toggle = !this.toggle;
  }

  // handleChange(event: any) {
  //   const clickedKey = event.srcElement.id();
  //   this.inputData => {
  //     el.checked = false;
  //   });
  //   this.inputData[clickedKey].checked = true;
  //   this.switchClicked.emit(this.inputData);
  // }
  public tabChange(event: any) {
    this.selectedTab = event;
  }

  onTabChange(event: any) {}
  addBorderOnFirstColunm() {
    const liNum = $('#acc-modal-ul li').length; // This computes the number of list items
    const colNum = 3; // This is the number of columns you want

    $('#acc-modal-ul li').each(function(i) {
      if (i % Math.floor(liNum / colNum) === 0) {
        $(this).addClass('topBorder');
      }
      if ((i + 1) % Math.floor(liNum / colNum) === 0) {
        $(this).addClass('bottomBorder');
      }
    });
  }
}
