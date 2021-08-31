import { takeUntil } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppDriverService } from 'src/app/core/services/app-driver.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { Subject } from 'rxjs';
import { DriverMedicalManageComponent } from '../driver-medical-manage/driver-medical-manage.component';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { DriverData, MedicalData } from 'src/app/core/model/driver';
import { HttpErrorResponse } from '@angular/common/http';

const moment = require('moment/moment');

@Component({
  selector: 'app-driver-medical-card',
  templateUrl: './driver-medical-card.component.html',
  styleUrls: ['./driver-medical-card.component.scss'],
})
export class DriverMedicalCardComponent implements OnInit, OnDestroy {
  card = 'driver-medical';
  @Input() driver: DriverData;
  medicalData: MedicalData[] = [];
  private destroy$: Subject<void> = new Subject<void>();

  public dropdownOptions: any = {
    mainActions: [
      {
        title: 'Edit',
        name: 'edit-medical',
      },
    ],
    otherActions: [],
    deleteAction: {
      title: 'Delete',
      name: 'delete-medical',
      type: 'medical',
      text: 'Are you sure you want to delete medical?',
    },
  };
  attachmentsVisible: any = [];

  constructor(
    private route: ActivatedRoute,
    private driverService: AppDriverService,
    private shared: SharedService,
    private notification: NotificationService,
    private spinner: SpinnerService,
    private customModalService: CustomModalService
  ) {}

  ngOnInit() {
    this.shared.emitDeleteAction
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (resp: any) => {
        if (resp.data && resp.data.id && resp.data.type === 'delete-medical') {
          this.delete(resp.data.id);
        }
      }
    );

    this.driver.doc.medicalData.forEach((element, key) => {
      this.attachmentsVisible[key] = false;
    });
  }

  public openAction(action: any): void {
    if (action.type === 'edit-medical') {
      this.editMedical(action.id);
    } else if (action.type === 'delete-medical') {
      this.delete(action.id);
    }
  }

  delete(id: any) {
    this.spinner.show(true);

    this.medicalData =
      this.driver && this.driver.doc && this.driver.doc.medicalData ? this.driver.doc.medicalData : [];

    const index = this.medicalData.findIndex((l) => l.id === id);
    if (index > -1) {
      this.medicalData.splice(index, 1);
    }

    // const medicalData = {
    //   ssn: this.driver.ssn,
    //   jsonNode: 'medicalData',
    //   doc: this.medicalData,
    //   upsert: true,
    // };
    this.driver.doc.medicalData = this.medicalData;

    // this.driverService.updateDriverBasic(medicalData, this.driver.id)
    // .pipe(takeUntil(this.destroy$))
    // .subscribe(
    //   () => {
    //     this.notification.success(`Medical has been deleted.`, 'Success:');
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
        this.notification.success(`Medical has been deleted.`, 'Success:');
        this.spinner.show(false);
      },
      (error: HttpErrorResponse) => {
        this.shared.handleError(error);
      }
    );
  }

  editMedical(id: any) {
    const data = {
      type: 'edit',
      driver: this.driver,
      id,
    };
    this.customModalService.openModal(DriverMedicalManageComponent, { data }, null, {
      size: 'small',
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
