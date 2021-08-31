import { takeUntil } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AppDriverService } from 'src/app/core/services/app-driver.service';
import { Subject } from 'rxjs';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { DriverMvrManageComponent } from '../driver-mvr-manage/driver-mvr-manage.component';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { DriverData, MvrData } from 'src/app/core/model/driver';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-driver-mvr-card',
  templateUrl: './driver-mvr-card.component.html',
  styleUrls: ['./driver-mvr-card.component.scss'],
})
export class DriverMvrCardComponent implements OnInit, OnDestroy {
  card = 'driver-mvr';
  @Input() driver: DriverData;
  mvrData: MvrData[] = [];
  private destroy$: Subject<void> = new Subject<void>();

  public dropdownOptions: any = {
    mainActions: [
      {
        title: 'Edit',
        name: 'edit-mvr',
      },
    ],
    otherActions: [],
    deleteAction: {
      title: 'Delete',
      name: 'delete-mvr',
      type: 'mvr',
      text: 'Are you sure you want to delete mvr?',
    },
  };
  attachmentsVisible: any = [];

  constructor(
    private driverService: AppDriverService,
    private shared: SharedService,
    private spinner: SpinnerService,
    private notification: NotificationService,
    private customModalService: CustomModalService
  ) {}

  ngOnInit() {
    this.shared.emitDeleteAction
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (resp: any) => {
        if (resp.data && resp.data.id && resp.data.type === 'delete-mvr') {
          this.delete(resp.data.id);
        }
      }
    );

    this.driver.doc.mvrData.forEach((element, key) => {
      this.attachmentsVisible[key] = false;
    });
  }

  public openAction(action: any): void {
    if (action.type === 'edit-mvr') {
      this.editMvr(action.id);
    } else if (action.type === 'delete-mvr') {
      this.delete(action.id);
    }
  }

  delete(id: any) {
    this.spinner.show(true);

    this.mvrData =
      this.driver && this.driver.doc && this.driver.doc.mvrData ? this.driver.doc.mvrData : [];

    const index = this.mvrData.findIndex((l) => l.id === id);
    if (index > -1) {
      this.mvrData.splice(index, 1);
    }

    // const mvrData = {
    //   ssn: this.driver.ssn,
    //   jsonNode: 'mvrData',
    //   doc: this.mvrData,
    //   upsert: true,
    // };

    this.driver.doc.mvrData = this.mvrData;

    // this.driverService.updateDriverBasic(mvrData, this.driver.id)
    // .pipe(takeUntil(this.destroy$))
    // .subscribe(
    //   () => {
    //     this.notification.success(`Mvr has been deleted.`, 'Success:');
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
        this.notification.success(`Mvr has been deleted.`, 'Success:');
        this.spinner.show(false);
      },
      (error: HttpErrorResponse) => {
        this.shared.handleError(error);
      }
    );
  }

  editMvr(id: any) {
    const data = {
      type: 'edit',
      driver: this.driver,
      id,
    };
    this.customModalService.openModal(DriverMvrManageComponent, { data }, null, { size: 'small' });
  }

  public getExpireData(expireData: Date): Date {
    if (expireData) {
      const newDate = new Date(expireData ? expireData : '');
      newDate.setFullYear(newDate.getFullYear() + 1);
      return newDate;
    } else {
      return undefined;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
