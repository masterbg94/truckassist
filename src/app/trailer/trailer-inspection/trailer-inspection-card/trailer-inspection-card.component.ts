import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { TrailerData } from 'src/app/core/model/trailer';
import { AppTrailerService } from 'src/app/core/services/app-trailer.service';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { ClonerService } from 'src/app/core/services/cloner-service';
import { SharedService } from 'src/app/core/services/shared.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { TrailerInspectionManageComponent } from '../trailer-inspection-manage/trailer-inspection-manage.component';

@Component({
  selector: 'app-trailer-inspection-card',
  templateUrl: './trailer-inspection-card.component.html',
  styleUrls: ['./trailer-inspection-card.component.scss'],
})
export class TrailerInspectionCardComponent implements OnInit, OnDestroy {
  card = 'trailer-inspection';
  @Input() trailer: TrailerData;
  @Input() status: boolean;
  private destroy$: Subject<void> = new Subject<void>();

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
      type: 'inspection',
      text: 'Are you sure you want to delete inspection?',
    },
  };
  attachmentsVisible: any = [];

  constructor(
    private customModalService: CustomModalService,
    private trailerService: AppTrailerService,
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

    this.trailer.doc.inspectionData.forEach((element, key) => {
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
    const saveData: TrailerData = this.clonerService.deepClone<TrailerData>(this.trailer);
    saveData.status = this.trailer.status ? 1 : 0;
    const tempArr = this.trailer.doc.inspectionData.filter((obj) => {
      return obj.id !== id;
    });
    saveData.doc.inspectionData = tempArr;
    this.trailerService.updateTrailerData(saveData, this.trailer.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (resp) => {
        this.notification.success('Trailer inspection has been deleted.', 'Success:');
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
    this.customModalService.openModal(TrailerInspectionManageComponent, { data }, null, { size: 'small' });
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
