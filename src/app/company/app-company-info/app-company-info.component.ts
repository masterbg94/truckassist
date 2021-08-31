import { Component, OnInit, OnDestroy, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/core/services/shared.service';
import { ManageCompany } from 'src/app/core/model/company';
import { AppSharedService } from 'src/app/core/services/app-shared.service';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { CompanyInfoComponent } from 'src/app/shared/company-info/company-info.component';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';
@Component({
  selector: 'app-app-company-info',
  templateUrl: './app-company-info.component.html',
  styleUrls: ['./app-company-info.component.scss'],
})
export class AppCompanyInfoComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() pageChange: EventEmitter<any> = new EventEmitter();
  hideCompanyInfo: boolean;

  @ViewChild('tabSet', { static: false }) tabSet: any;
  tabSelected = '';

  public dropdownOptions: any = {
    mainActions: [
      {
        title: 'Edit',
        name: 'edit-company',
      },
    ],
    otherActions: [],
    deleteAction: {
      title: 'Delete',
      name: 'delete-company',
      type: 'company',
      text: 'Are you sure you want to delete company?',
    }
  };

  public officeDropdownOptions: any = {
    mainActions: [
      {
        title: 'Edit',
        name: 'edit-office',
      },
    ],
    otherActions: [],
    deleteAction: {
      title: 'Delete',
      name: 'delete-office',
      type: 'office',
      text: 'Are you sure you want to delete office?',
    }
  };

  public factoringDropdownOptions: any = {
    mainActions: [
      {
        title: 'Edit',
        name: 'edit-factoring',
      },
    ],
    otherActions: [],
    deleteAction: {
      title: 'Delete',
      name: 'delete-factoring',
      type: 'factoring',
      text: 'Are you sure you want to delete factoring?',
    }
  };

  public company: ManageCompany;
  public divisionCompanies: ManageCompany[];
  private subscription: Subscription;
  private getCompanySubscription?: Subscription;


  constructor(private sharedService: AppSharedService, private shared: SharedService, private customModalService: CustomModalService) { }

  ngOnInit() {
    this.getCompany();
    this.subscription = this.sharedService.updateOfficeFactoringSubject.subscribe(() => {
      this.getCompany();
    });
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.getCompanySubscription?.unsubscribe();
  }

  getCompany() {

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const id = currentUser.companyId;

    this.getCompanySubscription = this.sharedService.getCompany(id).subscribe(
      (resp: any) => {
        this.company = resp;
        this.divisionCompanies = resp.companyDivision;
      },
      (error: any) => {
        this.shared.handleServerError();
      }
    );

  }

  onTabChange(event) {
    if (this.tabSelected === 'billing' || this.tabSelected === 'users') {
      event.preventDefault();
    }
    if (event.nextId === 'add-new' || event.nextId === 'company-side-nav') {
      event.preventDefault();
    }
  }

  openFactoringCompanyModal() {
    if (this.tabSelected === '' || this.tabSelected === 'documents') {
      const data = {
        company: this.company,
        createNew: true
      };
      this.customModalService.openModal(CompanyInfoComponent, data, null, { size: 'small' });
    }
  }

  onPageChange(event: any) {
    this.hideCompanyInfo = event !== '';
    this.tabSelected = event;
    this.pageChange.emit(event);
  }
}
