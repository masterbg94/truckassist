import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { TrailerData } from 'src/app/core/model/trailer';
import { AppTrailerService } from 'src/app/core/services/app-trailer.service';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { ClonerService } from 'src/app/core/services/cloner-service';
import { SharedService } from 'src/app/core/services/shared.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { TrailerLeasePurchaseManageComponent } from '../trailer-lease-purchase-manage/trailer-lease-purchase-manage.component';

@Component({
  selector: 'app-trailer-lease-purchase-card',
  templateUrl: './trailer-lease-purchase-card.component.html',
  styleUrls: ['./trailer-lease-purchase-card.component.scss']
})
export class TrailerLeasePurchaseCardComponent implements OnInit, OnDestroy {
  card = 'trailer-lease';
  @Input() trailer: TrailerData;
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
      type: 'trailer-lease-purchase',
      text: 'Are you sure you want to delete trailer lease purchase?',
    },
  };
  attachmentsVisible: any = [];

  constructor(
    private customModalService: CustomModalService,
    private trailerService: AppTrailerService,
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

    this.trailer.doc.trailerLeaseData.forEach((element, key) => {
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
    const saveData: TrailerData = this.clonerService.deepClone<TrailerData>(this.trailer);
    saveData.status = this.trailer.status ? 1 : 0;
    const tempArr = this.trailer.doc.trailerLeaseData.filter((obj) => {
      return obj.id !== id;
    });
    saveData.doc.trailerLeaseData = tempArr;
    this.spinner.show(true);
    this.trailerService.updateTrailerData(saveData, this.trailer.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (resp) => {
        this.notification.success('Trailer lease purchase has been deleted.', 'Success:');
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
      trailer: this.trailer,
      id,
    };
    this.customModalService.openModal(TrailerLeasePurchaseManageComponent, { data }, null, {
      size: 'small',
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
