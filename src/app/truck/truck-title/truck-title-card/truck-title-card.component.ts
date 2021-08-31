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
import { TruckTitleManageComponent } from '../truck-title-manage/truck-title-manage.component';

@Component({
  selector: 'app-truck-title-card',
  templateUrl: './truck-title-card.component.html',
  styleUrls: ['./truck-title-card.component.scss']
})
export class TruckTitleCardComponent implements OnInit, OnDestroy {
  card = 'truck-title';
  @Input() truck: TruckData;
  private destroy$: Subject<void> = new Subject<void>();

  public dropdownOptions: any = {
    mainActions: [
      {
        title: 'Edit',
        name: 'edit-title',
      },
    ],
    otherActions: [],
    deleteAction: {
      title: 'Delete',
      name: 'delete-title',
      type: 'truck-title',
      text: 'Are you sure you want to delete title?',
    },
  };
  attachmentsVisible: any = [];

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
        if (resp.data && resp.data.id && resp.data.type === 'delete-title') {
          this.delete(resp.data.id);
        }
      }
    );

    this.truck.doc.titleData.forEach((element, key) => {
      this.attachmentsVisible[key] = false;
    });
  }

  public openAction(action: any): void {
    if (action.type === 'edit-title') {
      this.editTitle(action.id);
    } else if (action.type === 'delete-title') {
      this.delete(action.id);
    }
  }

  delete(id: any) {
    const saveData: TruckData = this.clonerService.deepClone<TruckData>(this.truck);
    saveData.status = this.truck.status ? 1 : 0;
    const tempArr = this.truck.doc.titleData.filter((obj) => {
      return obj.id !== id;
    });
    saveData.doc.titleData = tempArr;
    this.spinner.show(true);
    this.truckService.updateTruckData(saveData, this.truck.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (resp) => {
        this.notification.success('Truck title has been deleted.', 'Success:');
        this.spinner.show(false);
      },
      (error: HttpErrorResponse) => {
        this.shared.handleError(error);
      }
    );
  }

  private editTitle(id: any) {
    const data = {
      type: 'edit',
      truck: this.truck,
      id,
    };
    this.customModalService.openModal(TruckTitleManageComponent, { data }, null, {
      size: 'small',
    });
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

