import { takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { AppDriverService } from 'src/app/core/services/app-driver.service';
import { Subject } from 'rxjs';
import { SharedService } from 'src/app/core/services/shared.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { DriverDrugManageComponent } from '../driver-drug-manage/driver-drug-manage.component';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { DriverData, TestData } from 'src/app/core/model/driver';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-driver-drug-card',
  templateUrl: './driver-drug-card.component.html',
  styleUrls: ['./driver-drug-card.component.scss'],
})
export class DriverDrugCardComponent implements OnInit, OnDestroy {
  card = 'driver-drug';
  @Input() driver: DriverData;
  private destroy$: Subject<void> = new Subject<void>();
  testData: TestData[] = [];
  note: string;

  public dropdownOptions: any = {
    mainActions: [
      {
        title: 'Edit',
        name: 'edit-test',
      },
    ],
    otherActions: [],
    deleteAction: {
      title: 'Delete',
      name: 'delete-test',
      type: 'test',
      text: 'Are you sure you want to delete test?',
    },
  };
  attachmentsVisible: any = [];

  constructor(
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
        if (resp.data && resp.data.id && resp.data.type === 'delete-test') {
          this.delete(resp.data.id);
        }
      }
    );

    this.driver.doc.testData.forEach((element, key) => {
      this.attachmentsVisible[key] = false;
    });
  }

  public openAction(action: any): void {
    if (action.type === 'edit-test') {
      this.editDrug(action.id);
    } else if (action.type === 'delete-test') {
      this.delete(action.id);
    }
  }

  delete(id: number) {
    this.spinner.show(true);

    this.testData =
      this.driver && this.driver.doc && this.driver.doc.testData ? this.driver.doc.testData : [];

    const index = this.testData.findIndex((l) => l.id == id.toString());
    if (index > -1) {
      this.testData.splice(index, 1);
    }

    this.driver.doc.testData = this.testData;
    // const testData = {
    //   ssn: this.driver.ssn,
    //   jsonNode: 'testData',
    //   doc: this.testData,
    //   upsert: true,
    // };
    // this.driverService.updateDriverBasic(testData, this.driver.id)
    // .pipe(takeUntil(this.destroy$))
    // .subscribe(
    //   () => {
    //     this.notification.success(`Test has been deleted.`, 'Success:');
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
        this.notification.success(`Test has been deleted.`, 'Success:');
        this.spinner.show(false);
      },
      (error: HttpErrorResponse) => {
        this.shared.handleError(error);
      }
    );
  }

  openShowMore(id: any) {
    const noteSpan = document.getElementById('span-note-' + id);
    const noteLabel = document.getElementById('label-note-' + id);
    if (!noteLabel.classList.contains('show')) {
      noteLabel.classList.add('show');
      noteSpan.innerHTML = 'Less';
    } else {
      noteLabel.classList.remove('show');
      noteSpan.innerHTML = 'More';
    }
  }

  editDrug(id: any) {
    const data = {
      type: 'edit',
      driver: this.driver,
      testId: id,
    };
    this.customModalService.openModal(DriverDrugManageComponent, { data }, null, { size: 'small' });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
