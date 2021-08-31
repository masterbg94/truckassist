import { Tax2290Service } from 'src/app/core/services/tax2290.service';
import { SharedService } from './../../core/services/shared.service';
import { Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppSharedService } from 'src/app/core/services/app-shared.service';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from 'src/app/services/notification-service.service';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
@Component({
  selector: 'app-tax2290-maintenance',
  templateUrl: './tax2290-maintenance.component.html',
  styleUrls: ['./tax2290-maintenance.component.scss'],
})
export class Tax2290MaintenanceComponent implements OnInit, OnDestroy {
  public modalTitle: string = 'New Order';
  public loaded: boolean = false;
  public company: any[] = [];
  public taxSeason: any[] = [
    // TODO: trebalo bi da se povuce sa nekog globalnog drzavnog API-a
    { id: 1, name: '2020 - 2021 HVUT Return' },
    { id: 2, name: '2019 - 2020 HVUT Return' },
    { id: 3, name: '2018 - 2019 HVUT Return' },
    { id: 4, name: '2017 - 2018 HVUT Return' },
  ];

  public showCompanyInfo: boolean = false;
  public showVehicles: boolean = false;
  public showAttachmentVehicle: boolean = false;
  public showSigner: boolean = false;
  public showIrsPayment: boolean = false;
  public showReview: boolean = false;

  public isSignerEditable: boolean = false;
  public isNewCompany: boolean = false;
  public counterStep: number = 1;
  public isResetCompany: boolean = false;
  private canCounterStep: boolean = false;

  public selectedCompany: any;
  public numberOfAttachments: number = 0;
  public numberOfVehicles: number = 0;
  public vehiclesSumTax: string = '';

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private appSharedService: AppSharedService,
    private sharedService: SharedService,
    private tax2290Service: Tax2290Service,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getCompanyAndDivisions(currentUser.companyId);
    this.loaded = true;

    this.tax2290Service.selectedCompany.pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        if (res) {
          this.canCounterStep = true;
          if (res.company.id === null) {
            this.isNewCompany = true;
            this.modalTitle = 'New Order';
          } else {
            this.isNewCompany = false;
            this.selectedCompany = res;
            this.modalTitle = `New Order #${this.selectedCompany.company.id}`;
          }
        }
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

  getCompanyAndDivisions(companyId) {
    this.appSharedService
      .getCompany(companyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          if (res.companyDivision !== null) {
            this.company = [res, ...res.companyDivision];
            this.company.push({
              name: 'New Company',
              id: null,
            });
          } else {
            this.company = [res];
            this.company.push({
              name: 'New Company',
              id: null,
            });
          }
        },
        (error: any) => {
          this.sharedService.handleServerError();
        }
      );
  }

  onSave2290(event: any) {
    alert('Save modal from header');
  }

  onBack() {
    if (this.counterStep === 1) {
      return;
    }

    this.counterStep--;

    if (this.counterStep === 1) {
      this.showCompanyInfo = false;
    } else if (this.counterStep === 2) {
      this.showCompanyInfo = true;
      this.showVehicles = false;
    } else if (this.counterStep === 3) {
      this.showVehicles = true;
      this.showSigner = false;
    } else if (this.counterStep === 4) {
      this.showSigner = true;
      this.showIrsPayment = false;
    } else if (this.counterStep === 5) {
      this.showIrsPayment = true;
      this.showReview = false;
    }
  }

  onSubmit() {
    if (this.counterStep === 6) {
      return;
    }
    if (this.canCounterStep) {
      this.counterStep++;
      // this.canCounterStep = false;
      if (this.counterStep === 2) {
        this.showCompanyInfo = !this.showCompanyInfo;
      } else if (this.counterStep === 3) {
        this.showCompanyInfo = false;
        this.showVehicles = !this.showVehicles;
      } else if (this.counterStep === 4) {
        this.showVehicles = false;
        this.showAttachmentVehicle = false;
        this.showSigner = !this.showSigner;
      } else if (this.counterStep === 5) {
        this.showSigner = false;
        this.showIrsPayment = !this.showIrsPayment;
      } else if (this.counterStep === 6) {
        this.showIrsPayment = false;
        this.showReview = !this.showReview;
      }
    }
    else {
      this.notificationService.warning('Please fill all required fields!', 'Warning')
    }
  }

  openNewStep(type: string) {
    if (this.counterStep === 2 && type === 'company-info') {
      this.showCompanyInfo = !this.showCompanyInfo;
    } else if (this.counterStep === 3 && type === 'vehicles') {
      this.showVehicles = !this.showVehicles;
    } else if (this.counterStep === 4 && type === 'signer') {
      this.showSigner = !this.showSigner;
    } else if (this.counterStep === 5 && type === 'irs-payment') {
      this.showIrsPayment = !this.showIrsPayment;
    } else if (this.counterStep === 6 && type === 'review') {
      this.showReview = !this.showReview;
    } else if (this.counterStep === 3 && type === 'vehicle-attachment') {
      this.showAttachmentVehicle = !this.showAttachmentVehicle;
    } else {
      return;
    }
  }

  onEditableSigner() {
    if (!this.showSigner) {
      return;
    }
    this.isSignerEditable = !this.isSignerEditable;
  }

  onResetCompany($event) {
    this.modalTitle = 'New Order';
    this.counterStep = 1;
    this.isResetCompany = true;
    this.showCompanyInfo = false;
    this.showVehicles = false;
    this.showSigner = false;
    this.showIrsPayment = false;
    this.showReview = false;
    this.onActionsSchedule('reset-vehicle')
  }

  addNewPaymentMethod() {
    this.isNewCompany = !this.isNewCompany;
  }

  onActionsSchedule(type: any) {
    if (type === 'upload-schedule') {
      this.showAttachmentVehicle = !this.showAttachmentVehicle;
    }
    else if (type.type === 'add-new-vehicle') {
      this.numberOfVehicles = type.length;
      this.vehiclesSumTax = ''
      this.vehiclesSumTax = formatter.format(type.vehiclesTax);
    }
    else if(type === 'reset-vehicle') {
      this.numberOfVehicles = 0;
      this.vehiclesSumTax = ''
    }
    else if (type === 'clear-schedule') {
      this.numberOfAttachments = 0;
      this.showAttachmentVehicle = false;
    }
  }

  onCountAttachments(num: number) {
    this.numberOfAttachments = num;
  }
}
