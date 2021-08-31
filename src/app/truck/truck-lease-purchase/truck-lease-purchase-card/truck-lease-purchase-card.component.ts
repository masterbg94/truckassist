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
import { TruckLeasePurchaseManageComponent } from '../truck-lease-purchase-manage/truck-lease-purchase-manage.component';

@Component({
  selector: 'app-truck-lease-purchase-card',
  templateUrl: './truck-lease-purchase-card.component.html',
  styleUrls: ['./truck-lease-purchase-card.component.scss']
})
export class TruckLeasePurchaseCardComponent implements OnInit, OnDestroy {
  card = 'truck-lease';
  @Input() truck: TruckData;
  private destroy$: Subject<void> = new Subject<void>();

  public dropdownOptions: any = {
    mainActions: [
      {
        title: 'Edit',
        name: 'edit-lease',
      },
    ],
    otherActions: [],
    deleteAction: {
      title: 'Delete',
      name: 'delete-lease',
      type: 'truck-lease-purchase',
      text: 'Are you sure you want to delete truck lease purchase?',
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
        if (resp.data && resp.data.id && resp.data.type === 'delete-lease') {
          this.delete(resp.data.id);
        }
      }
    );

    this.truck.doc.truckLeaseData.forEach((element, key) => {
      this.attachmentsVisible[key] = false;
    });
  }

  public openAction(action: any): void {
    if (action.type === 'edit-lease') {
      this.editLicence(action.id);
    } else if (action.type === 'delete-lease') {
      this.delete(action.id);
    }
  }

  delete(id: any) {
    const saveData: TruckData = this.clonerService.deepClone<TruckData>(this.truck);
    saveData.status = this.truck.status ? 1 : 0;
    const tempArr = this.truck.doc.truckLeaseData.filter((obj) => {
      return obj.id !== id;
    });
    saveData.doc.truckLeaseData = tempArr;
    this.spinner.show(true);
    this.truckService.updateTruckData(saveData, this.truck.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (resp) => {
        this.notification.success('Truck lease purchase has been deleted.', 'Success:');
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
    this.customModalService.openModal(TruckLeasePurchaseManageComponent, { data }, null, {
      size: 'small',
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
