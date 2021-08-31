import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { url } from 'node:inspector';
import { FuelManageComponent } from 'src/app/accounting/fuel-manage/fuel-manage.component';
import { AccountsManageComponent } from 'src/app/accounts/accounts-manage/accounts-manage.component';
import { CompanyUserManageComponent } from 'src/app/company/app-company-user/company-user-manage/company-user-manage.component';
import { ContactManageComponent } from 'src/app/contact/contact-manage/contact-manage.component';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { CustomerManageComponent } from 'src/app/customer/customer-manage/customer-manage.component';
import { ShipperManageComponent } from 'src/app/customer/shipper-manage/shipper-manage.component';
import { DriverManageComponent } from 'src/app/driver/driver-manage/driver-manage.component';
import { ManageLoadComponent } from 'src/app/load/manage-load/manage-load.component';
import { MvrMaintenanceComponent } from 'src/app/mvr/mvr-maintenance/mvr-maintenance.component';
import { OwnerManageComponent } from 'src/app/owners/owner-manage/owner-manage.component';
import { MaintenanceManageComponent } from 'src/app/repairs/maintenance-manage/maintenance-manage.component';
import { AccidentManageComponent } from 'src/app/safety/safety-accident/accident-manage/accident-manage.component';
import { SafetyViolationComponent } from 'src/app/safety/safety-violation/safety-violation/safety-violation.component';
import { Tax2290MaintenanceComponent } from 'src/app/tax2290/tax2290-maintenance/tax2290-maintenance.component';
import { TodoManageComponent } from 'src/app/todo/todo-manage/todo-manage.component';
import { TrailerManageComponent } from 'src/app/trailer/trailer-manage/trailer-manage.component';
import { TruckManageComponent } from 'src/app/truck/truck-manage/truck-manage.component';
import { RepairShopManageComponent } from '../app-repair-shop/repair-shop-manage/repair-shop-manage.component';

@Component({
  selector: 'app-no-empty-status',
  templateUrl: './no-empty-status.component.html',
  styleUrls: ['./no-empty-status.component.scss'],
})
export class NoEmptyStatusComponent implements OnInit {

  @Input() isNote: boolean;
  @Input() isAssignLoads: boolean;
  @Output() createNote: EventEmitter<boolean> = new EventEmitter();

  noResultsSvgs = [
    {
      btn_text: 'Add Load',
      url: '/dispatcher',
      text: 'Add your first load',
      path: '../../../assets/img/no-empty-status/dispatch.svg',
    },
    {
      btn_text: 'Add Load',
      url: '/loads',
      text: 'Add your first load',
      path: '../../../assets/img/no-empty-status/load.svg',
    },
    {
      btn_text: 'Add Customer',
      url: '/customers',
      text: 'Add your first customer',
      path: '../../../assets/img/no-empty-status/customer.svg',
    },
    {
      btn_text: 'Add Driver',
      url: '/drivers',
      text: 'Add your first driver',
      path: '../../../assets/img/no-empty-status/driver.svg',
    },
    {
      btn_text: 'Add Truck',
      url: '/trucks',
      text: 'Add your first truck',
      path: '../../../assets/img/no-empty-status/truck.svg',
    },
    {
      btn_text: 'Add Trailer',
      url: '/trailers',
      text: 'Add your first trailer',
      path: '../../../assets/img/no-empty-status/trailer.svg',
    },
    {
      btn_text: 'Add Repair',
      url: '/repairs',
      text: 'Add your first repair',
      path: '../../../assets/img/no-empty-status/repair.svg',
    },
    {
      btn_text: 'Add Owner',
      url: '/owners',
      text: 'Add your first owner',
      path: '../../../assets/img/no-empty-status/owner.svg',
    },
    {
      btn_text: 'Add Accident',
      url: '/safety/accident',
      text: 'Add your first accident',
      path: '../../../assets/img/no-empty-status/accident.svg',
    },
    {
      btn_text: 'Add Driver',
      url: '/accounting/payroll',
      text: 'Payroll is currently unavailable.',
      path: '../../../assets/img/no-empty-status/accounting.svg',
    },
    {
      btn_text: 'Go back to Payroll',
      url: '/accounting/ifta',
      text: 'IFTA is currently empty and without info',
      path: '../../../assets/img/no-empty-status/ifta.svg',
    },
    /* izbacuje /page-not-found */
    /*   {btn_text: 'Add First Load', url: '', text: 'Loads statistic are currently empty', path: '../../../assets/img/no-empty-status/statistics.svg'}, */

    {
      btn_text: 'Add Account',
      url: '/tools/accounts',
      text: 'Add your first Account',
      path: '../../../assets/img/no-empty-status/accounts.svg',
    },
    {
      btn_text: 'Add Contact',
      url: '/tools/contacts',
      text: 'Add your first Contact',
      path: '../../../assets/img/no-empty-status/contacts.svg',
    },
    {
      btn_text: 'Add Task',
      url: '/tools/todo',
      text: 'Add your first Task',
      path: '../../../assets/img/no-empty-status/to_do_list.svg',
    },
    {
      btn_text: 'Request MVR',
      url: '/tools/mvr',
      text: 'Add your first MVR',
      path: '../../../assets/img/no-empty-status/mvr.svg',
    },
    {
      btn_text: 'Add 2290',
      url: '/tools/2290',
      text: 'Add your first 2290',
      path: '../../../assets/img/no-empty-status/2290.svg',
    },
    {
      btn_text: 'Add Violation',
      url: '/safety/violation',
      text: 'Add your first violationc',
      path: '../../../assets/img/no-empty-status/violation.svg',
    },
    /* Ne postoji */
    /*  {btn_text: 'Sign Up', url: '', text: 'Sign up for FAX service', path: '../../../assets/img/no-empty-status/fax.svg'}, */
  ];

  isPayroll: boolean;
  isIfta: boolean;
  isTodo: boolean;

  constructor(public router: Router, private customModalService: CustomModalService) {}

  ngOnInit(): void {
    console.log('Url');
    console.log(this.router.url);
    
    /* FOR PAYROL */
    if(this.router.url === '/accounting/payroll') {
      this.isPayroll = true;
    } else {
      this.isPayroll = false;
    }
    console.log('nesto');
    console.log(this.isPayroll);

    /* IFTA */

    if(this.router.url === '/accounting/ifta') {
      this.isIfta = true;
    } else {
      this.isIfta = false;
    }
    console.log('IFTA');
    console.log(this.isIfta);

    /* TODO */
    if(this.router.url === '/tools/todo') {
      this.isTodo = true;
    } else {
      this.isTodo = false;
    }
    console.log('todo');
    console.log(this.isTodo);
  }

  getPathData() {
    /*  console.log('getPathData')
    console.log(
      this.noResultsSvgs.find((item) => {
        return this.router.url.includes(item.url);
      })
    ); */
    return this.noResultsSvgs.find((item) => this.router.url.includes(item.url));
  }

  public openModal() {
    const data = {
      type: 'new',
      vehicle: 'truck',
    };

    switch (this.router.url) {

      /* 
      case '/safety/violation':
        this.customModalService.openModal(SafetyViolationComponent, { data }, null, {
          size: 'small',
        });
        break;
 */
      case '/tools/2290':
        this.customModalService.openModal(Tax2290MaintenanceComponent, { data }, null, {
          size: 'small',
        });
        break;

      case '/tools/contacts':
        this.customModalService.openModal(ContactManageComponent, { data }, null, {
          size: 'small',
        });
        break;

      case '/tools/mvr':
        this.customModalService.openModal(MvrMaintenanceComponent, { data }, null, {
          size: 'small',
        });
        break;

      case '/dispatcher':
        this.customModalService.openModal(ManageLoadComponent, { data }, null, { size: 'xxl' });
        break;

      case '/drivers':
        this.customModalService.openModal(DriverManageComponent, { data }, null, { size: 'small' });
        break;

      case '/trucks':
        this.customModalService.openModal(TruckManageComponent, { data }, null, { size: 'small' });
        break;

      /*  case 'fuel':
        this.customModalService.openModal(FuelManageComponent, { data }, null, { size: 'small' });
        break; */

      /*  case 'shop':
        this.customModalService.openModal(RepairShopManageComponent, { data }, null, {
          size: 'small',
        });
        break; */

      case '/customers':
        this.customModalService.openModal(CustomerManageComponent, { data }, null, {
          size: 'small',
        });
        break;

      case '/trailers':
        this.customModalService.openModal(TrailerManageComponent, { data }, null, {
          size: 'small',
        });
        break;

      case '/loads':
        this.customModalService.openModal(ManageLoadComponent, { data }, null, {
          size: 'xxl',
        });
        break;

      case '/repairs':
        this.customModalService.openModal(MaintenanceManageComponent, { data }, null, {
          size: 'large',
        });
        break;

      case '/owners':
        this.customModalService.openModal(OwnerManageComponent, { data }, null, {
          size: 'small',
        });
        break;

      /*  case 'user':
        this.customModalService.openModal(CompanyUserManageComponent, { data }, null, {
          size: 'small',
        });
        break; */

      case '/tools/accounts':
        this.customModalService.openModal(AccountsManageComponent, { data }, null, {
          size: 'small',
        });
        break;

      case '/safety/accident':
        this.customModalService.openModal(AccidentManageComponent, { data }, null, {
          size: 'small',
        });
        break;

      case '/tools/contacts':
        this.customModalService.openModal(ContactManageComponent, { data }, null, {
          size: 'small',
        });
        break;

      /*  case 'task':
        this.customModalService.openModal(TodoManageComponent, { data }, null, {
          size: 'small',
        });
        break; */

      /*  case 'broker':
        this.customModalService.openModal(CustomerManageComponent, { data }, null, {
          size: 'small',
        });
        break; */

      /* case 'shipper':
        this.customModalService.openModal(ShipperManageComponent, { data }, null, {
          size: 'small',
        });
        break; */

      default:
        return;
    }
  }
}
