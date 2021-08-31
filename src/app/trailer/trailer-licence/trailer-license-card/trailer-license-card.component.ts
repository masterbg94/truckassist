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
import { TrailerLicenseManageComponent } from '../trailer-license-manage/trailer-license-manage.component';

@Component({
  selector: 'app-trailer-license-card',
  templateUrl: './trailer-license-card.component.html',
  styleUrls: ['./trailer-license-card.component.scss'],
})
export class TrailerLicenseCardComponent implements OnInit, OnDestroy {
  card = 'trailer-license';
  @Input() trailer: TrailerData;
  private destroy$: Subject<void> = new Subject<void>();

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
      type: 'trailer-license',
      text: 'Are you sure you want to delete license?',
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
        if (resp.data && resp.data.id && resp.data.type === 'delete-license') {
          this.delete(resp.data.id);
        }
      }
    );

    this.trailer.doc.licenseData.forEach((element, key) => {
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
    const saveData: TrailerData = this.clonerService.deepClone<TrailerData>(this.trailer);
    saveData.status = this.trailer.status ? 1 : 0;
    const tempArr = this.trailer.doc.licenseData.filter((obj) => {
      return obj.id !== id;
    });
    saveData.doc.licenseData = tempArr;
    this.spinner.show(true);
    this.trailerService.updateTrailerData(saveData, this.trailer.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (resp) => {
        this.notification.success('Trailer license has been deleted.', 'Success:');
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
    this.customModalService.openModal(TrailerLicenseManageComponent, { data }, null, {
      size: 'small',
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
