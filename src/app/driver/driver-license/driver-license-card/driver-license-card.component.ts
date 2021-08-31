import { takeUntil } from 'rxjs/operators';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AppDriverService } from 'src/app/core/services/app-driver.service';
import { Subject } from 'rxjs';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { DriverLicenseManageComponent } from './../driver-license-manage/driver-license-manage.component';
import { NotificationService } from 'src/app/services/notification-service.service';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { DriverData, LicenseData } from 'src/app/core/model/driver';
import { HttpErrorResponse } from '@angular/common/http';
import { animate, query, stagger, state, style, transition, trigger } from '@angular/animations';
import moment from 'moment';
import { SortPipe } from 'src/app/core/pipes/sort.pipe';

@Component({
  selector: 'app-driver-license-card',
  templateUrl: './driver-license-card.component.html',
  styleUrls: ['./driver-license-card.component.scss'],
  animations: [
    trigger('lineChanged', [
      state(
        'closed',
        style({
          height: '0px',
          borderTop: '0',
          borderBottom: '0',
        })
      ),
      state(
        'opened',
        style({
          height: '*',
        })
      ),
      transition('closed => opened', [animate(500)]),
      transition('opened => closed', [animate(250)]),
    ]),
  ],
})
export class DriverLicenseCardComponent implements OnInit, OnDestroy {
  card = 'driver-license';
  @Input() driver: DriverData;
  private destroy$: Subject<void> = new Subject<void>();
  licenseData: LicenseData[] = [];

  public dropdownOptions: any = {
    mainActions: [
      {
        title: 'Edit',
        name: 'edit-license',
      },
    ],
    otherActions: [],
    deleteAction: {
      title: 'Delete',
      name: 'delete-license',
      type: 'license',
      text: 'Are you sure you want to delete license?',
    },
  };
  attachmentsVisible: any = [];

  constructor(
    private driverService: AppDriverService,
    private spinner: SpinnerService,
    private shared: SharedService,
    private notification: NotificationService,
    private customModalService: CustomModalService
  ) {}

  ngOnInit() {
    this.shared.emitDeleteAction
    .pipe(takeUntil(this.destroy$))
    .subscribe((resp: any) => {
      if (resp.data && resp.data.id && resp.data.type === 'delete-license') {
        this.delete(resp.data.id);
      }
    });

    this.driver.doc.licenseData.forEach((element, key) => {
      this.attachmentsVisible[key] = false;
    });
  }

  delete(id: number) {
    this.spinner.show(true);

    this.licenseData =
      this.driver && this.driver.doc && this.driver.doc.licenseData
        ? this.driver.doc.licenseData
        : [];

    const index = this.licenseData.findIndex((l) => l.id == id.toString());
    if (index > -1) {
      this.licenseData.splice(index, 1);
    }

    this.driver.doc.licenseData = this.licenseData;

    // const licenseData = {
    //   ssn: this.driver.ssn,
    //   jsonNode: 'licenseData',
    //   doc: this.licenseData,
    //   upsert: true,
    // };

    // this.driverService.updateDriverBasic(licenseData, this.driver.id)
    // .pipe(takeUntil(this.destroy$))
    // .subscribe(
    //   () => {
    //     this.notification.success(
    //       `License has been deleted.`,
    //       'Success:'
    //     );
    //     this.spinner.show(false);
    //   },
    //   (error: HttpErrorResponse) => {
    //     this.shared.handleError(error);
    //   }
    // )
    this.driverService.updateDriverData(this.driver, this.driver.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (driverData: DriverData) => {
        this.notification.success(`License has been deleted.`, 'Success:');
        this.spinner.show(false);
      },
      (error: HttpErrorResponse) => {
        this.shared.handleError(error);
      }
    );
  }

  editLicense(id: any) {
    const data = {
      type: 'edit',
      driver: this.driver,
      id,
    };
    this.customModalService.openModal(DriverLicenseManageComponent, { data }, null, {
      size: 'small',
    });
  }

  public openAction(action: any): void {
    if (action.type === 'edit-license') {
      this.editLicense(action.id);
    } else if (action.type === 'delete-license') {
      this.delete(action.id);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
