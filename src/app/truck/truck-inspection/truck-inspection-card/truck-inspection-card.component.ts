import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { TruckData } from 'src/app/core/model/truck';
import { AppTruckService } from 'src/app/core/services/app-truck.service';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { ClonerService } from 'src/app/core/services/cloner-service';
import { SharedService } from 'src/app/core/services/shared.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { TruckInspectionManageComponent } from '../truck-inspection-manage/truck-inspection-manage.component';

@Component({
  selector: 'app-truck-inspection-card',
  templateUrl: './truck-inspection-card.component.html',
  styleUrls: ['./truck-inspection-card.component.scss'],
})
export class TruckInspectionCardComponent implements OnInit, OnDestroy {
  @Input() truck: TruckData;
  card = 'truck-inspection';
  private destroy$: Subject<void> = new Subject<void>();
  attachmentsVisible: any = [];

  public dropdownOptions: any = {
    mainActions: [
      {
        title: 'Edit',
        name: 'edit-inspection',
      },
    ],
    otherActions: [],
    deleteAction: {
      title: 'Delete',
      name: 'delete-inspection',
      type: 'truck-inspection',
      text: 'Are you sure you want to delete inspection?',
    },
  };

  constructor(
    private customModalService: CustomModalService,
    private truckService: AppTruckService,
    private notification: NotificationService,
    private shared: SharedService,
    private clonerService: ClonerService
  ) {}

  ngOnInit(): void {

    this.shared.emitDeleteAction
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (resp: any) => {
        if (resp.data && resp.data.id && resp.data.type === 'delete-inspection') {
          this.delete(resp.data.id);
        }
      }
    );

    this.truck.doc.inspectionData.forEach((element, key) => {
      this.attachmentsVisible[key] = false;
    });
  }

  public openAction(action: any): void {
    if (action.type === 'edit-inspection') {
      this.editLicence(action.id);
    } else if (action.type === 'delete-inspection') {
      this.delete(action.id);
    }
  }

  delete(id: any) {
    const tempArr = this.truck.doc.inspectionData.filter((obj) => {
      return obj.id !== id;
    });

    const saveData: TruckData = this.clonerService.deepClone<TruckData>(this.truck);
    saveData.status = this.truck.status ? 1 : 0;
    saveData.doc.inspectionData = tempArr;

    this.truckService.updateTruckData(saveData, this.truck.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (truckData: TruckData) => {
        this.truck = truckData;
        this.notification.success('Truck inspection has been deleted.', 'Success:');
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
    this.customModalService.openModal(TruckInspectionManageComponent, { data }, null, { size: 'small' });
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
