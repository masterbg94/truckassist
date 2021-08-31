import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { TruckData } from 'src/app/core/model/truck';
import { AppTruckService } from 'src/app/core/services/app-truck.service';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { ClonerService } from 'src/app/core/services/cloner-service';
import { SharedService } from 'src/app/core/services/shared.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { TruckLicenseManageComponent } from '../truck-license-manage/truck-license-manage.component';

@Component({
  selector: 'app-truck-license-card',
  templateUrl: './truck-license-card.component.html',
  styleUrls: ['./truck-license-card.component.scss'],
})
export class TruckLicenseCardComponent implements OnInit, OnDestroy {
  @Input() truck: TruckData;
  private destroy$: Subject<void> = new Subject<void>();
  attachmentsVisible: any = [];
  card = 'truck-license';
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
      type: 'truck-license',
      text: 'Are you sure you want to delete licence?',
    },
  };

  constructor(
    private customModalService: CustomModalService,
    private truckService: AppTruckService,
    private notification: NotificationService,
    private shared: SharedService,
    private spinner: SpinnerService,
    private clonerService: ClonerService
  ) {}

  ngOnInit(): void {
    this.shared.emitDeleteAction
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (resp: any) => {
        if (resp.data && resp.data.id && resp.data.type === 'delete-license') {
          this.delete(resp.data.id);
        }
      }
    );

    this.truck.doc.licenseData.forEach((element, key) => {
      this.attachmentsVisible[key] = false;
    });
  }

  public openAction(action: any): void {
    if (action.type === 'edit-license') {
      this.editLicence(action.id);
    } else if (action.type === 'delete-license') {
      this.delete(action.id);
    }
  }

  delete(id: any) {
    const saveData: TruckData = this.clonerService.deepClone<TruckData>(this.truck);
    saveData.status = this.truck.status ? 1 : 0;
    const tempArr = this.truck.doc.licenseData.filter((obj) => {
      return obj.id !== id;
    });
    saveData.doc.licenseData = tempArr;
    this.spinner.show(true);
    this.truckService.updateTruckData(saveData, this.truck.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (resp) => {
        this.notification.success('Truck license has been deleted.', 'Success:');
        this.spinner.show(false);
      },
      (error: HttpErrorResponse) => {
        this.shared.handleError(error);
      }
    );
  }

  private editLicence(id: any) {
    const data = {
      type: 'edit',
      truck: this.truck,
      id,
    };
    this.customModalService.openModal(TruckLicenseManageComponent, { data }, null, {
      size: 'small',
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
