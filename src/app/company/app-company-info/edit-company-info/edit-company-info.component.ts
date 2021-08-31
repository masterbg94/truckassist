import { takeUntil } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { CompanyOffice, ManageCompany } from 'src/app/core/model/company';
import { AppSharedService } from 'src/app/core/services/app-shared.service';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { AppCompanyFactoringEditComponent } from 'src/app/shared/app-company-factoring-edit/app-company-factoring-edit.component';
import { AppCompanyOfficeEditComponent } from 'src/app/shared/app-company-office-edit/app-company-office-edit.component';
import { CompanyInfoComponent } from 'src/app/shared/company-info/company-info.component';
import { DeleteDialogComponent } from 'src/app/shared/delete-dialog/delete-dialog.component';
import { TableActions } from 'src/app/shared/truckassist-table/models/truckassist-table';
import { CompanyInsurancePolicyEditComponent } from 'src/app/shared/company-insurance-policy-edit/company-insurance-policy-edit.component';

@Component({
  selector: 'app-edit-company-info',
  templateUrl: './edit-company-info.component.html',
  styleUrls: ['./edit-company-info.component.scss'],
})
export class EditCompanyInfoComponent implements OnInit, OnDestroy {
  @Input() company?: ManageCompany;

  officeMainActions: TableActions[];
  officeDeleteAction: TableActions;
  insurancePolicyMainActions: TableActions[];
  insurancePolicyDeleteAction: TableActions;
  private destroy$: Subject<void> = new Subject<void>();
  private deleteDivisionCompanySubscription?: Subscription;

  insurancePolicyDummyData = [
    {
      item: [
        { name: 'Commercial General Liability', code: 'WGL000695-00' },
        { name: 'Automobile Liability', code: 'WGL000695-00' },
        { name: 'Motor Truck Cargo/Reefer Breakdown', code: 'WGL000695-00' },
      ],
      days: 140,
    },
    {
      item: [
        { name: 'Physical Damage', code: 'WGL000695-00' },
      ],
      days: 73,
    },
    {
      item: [
        { name: 'Commercial General Liability', code: 'WGL000695-00' },
        { name: 'Automobile Liability', code: 'WGL000695-00' },
        { name: 'Motor Truck Cargo/Reefer Breakdown', code: 'WGL000695-00' },
      ],
      days: -58,
    },
    {
      item: [
        { name: 'Physical Damage', code: 'WGL000695-00' },
      ],
      days: -120,
    },
  ];

  constructor(
    private customModalService: CustomModalService,
    private sharedService: SharedService,
    private appSharedService: AppSharedService,
    private notificationService: NotificationService,
    private spinnerService: SpinnerService
  ) {
    this.initActions();
  }

  ngOnInit(): void {
    this.sharedService.emitDeleteAction.pipe(takeUntil(this.destroy$)).subscribe((resp: any) => {
      if (resp.data.type == 'division-company') {
        this.deleteDivisionCompany();
      }
      if (resp.data.type == 'factoring-company') {
        this.handleDeleteFactoringCompany();
      }
      if (resp.data.type == 'delete-office') {
        this.handleDeleteOffice(resp.data.id);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.deleteDivisionCompanySubscription?.unsubscribe();
  }

  handleActionEvent(event: { id: number; type: string }, id?: any): void {
    switch (event.type) {
      case 'edit-office':
        this.openOfficeModal(id);
        break;
      case 'delete-office':
        this.handleDeleteOffice(id);
        break;
    }
  }

  openCompanyInfoModal() {
    const data = {
      company: this.company,
    };
    this.customModalService.openModal(CompanyInfoComponent, data, null, { size: 'small' });
  }

  deleteDivisionCompany() {
    if (this.company && this.company.category !== 'company') {
      this.spinnerService.show(true);
      this.deleteDivisionCompanySubscription = this.appSharedService
        .deleteDivisionCompany(this.company.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res: any) => {
            this.notificationService.success('Division company successfully deleted.', 'Success:');
            this.spinnerService.show(false);
          },
          (err: any) => {
            console.log(err);
            this.sharedService.handleServerError();
            this.spinnerService.show(false);
          }
        );
    }
  }

  // If you want to open modal for adding new office, pass id value -1
  openOfficeModal(officeId: any) {
    this.customModalService.openModal(
      AppCompanyOfficeEditComponent,
      {
        id: officeId,
        company: this.company,
        type: 'edit',
      },
      null,
      { size: 'small' }
    );
  }

  private handleDeleteOffice(officeId: number) {
    if (this.company?.doc?.offices?.length > 0) {
      const index = this.company.doc.offices.findIndex(
        (office: CompanyOffice) => office.id === officeId
      );
      this.company.doc.offices.splice(index, 1);
      if (this.company.category === 'company') {
        this.sharedService.saveCompany(this.company);
      } else {
        this.sharedService.saveDivisionCompany(this.company, this.company.id);
      }
    }
  }

  openInsurancePolicyModal() {
    this.customModalService.openModal(
      CompanyInsurancePolicyEditComponent,
      {
        company: this.company,
        type: 'edit',
      },
      null,
      { size: 'small' }
    );
  }

  openFactoringCompanyModal(isNew: boolean) {
    this.customModalService.openModal(
      AppCompanyFactoringEditComponent,
      {
        id: isNew ? -1 : this.company.doc.factoringCompany[0].id,
        company: this.company,
      },
      null,
      { size: 'small' }
    );
  }

  handleDeleteFactoringCompany() {
    if (this.company?.doc?.factoringCompany?.length > 0) {
      this.company.doc.factoringCompany.splice(0, 1);
      if (this.company.category === 'company') {
        this.sharedService.saveCompany(this.company);
      } else {
        this.sharedService.saveDivisionCompany(this.company, this.company.id);
      }
    }
  }

  private initActions(): void {
    this.officeMainActions = [
      {
        title: 'Edit',
        name: 'edit-office',
      },
    ];

    this.officeDeleteAction = {
      title: 'Delete',
      name: 'delete-office',
      text: 'Are you sure you want to delete office?',
    };

    /* Insurance Policy Actions */
    this.insurancePolicyMainActions = [
      {
        title: 'Edit',
        name: 'edit-insurance-policy',
      },
    ];

    this.insurancePolicyDeleteAction = {
      title: 'Delete',
      name: 'delete-insurance-policy',
      text: 'Are you sure you want to delete office?',
    };
  }

  /* Insurance Policy Get Expire Data */
  public getExpireData(days: number): Date {
    const result = new Date();
    result.setDate(result.getDate() + days);
    return result;
    /*  if (expireData) {
      const newDate = new Date(expireData ? expireData : '');
      newDate.setFullYear(newDate.getFullYear() + 1);
      return newDate;
    } else {
      return undefined;
    } */
  }

  toggleDeleteDivisionCompany() {
    const data = {
      name: 'delete',
      type: 'division-company',
      text: null,
      category: 'division company',
      id: this.company.id,
    };
    this.customModalService.openModal(DeleteDialogComponent, { data }, null, { size: 'small' });
  }

  toggleDeleteFactoringCompany() {
    const data = {
      name: 'delete',
      type: 'factoring-company',
      text: null,
      category: 'factoring company',
      id: this.company.id,
    };
    this.customModalService.openModal(DeleteDialogComponent, { data }, null, { size: 'small' });
  }
  public saveCompanyNote(value: string) {
    this.company.doc.additional.note = value;
    this.sharedService.saveCompany(this.company);
  }
  public saveOfficeNote(value: string) {
    this.company.doc.offices[0].note = value;
    this.sharedService.saveCompany(this.company);
  }
  public saveFactoringNote(value: string) {
    this.company.doc.factoringCompany[0].note = value;
    this.sharedService.saveCompany(this.company);
  }
}
