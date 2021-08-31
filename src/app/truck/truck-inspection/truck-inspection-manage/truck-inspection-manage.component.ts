import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { DateFormatter } from 'src/app/core/helpers/dateFormatter';
import { TruckData, TruckInspection } from 'src/app/core/model/truck';
import { AppTruckService } from 'src/app/core/services/app-truck.service';
import { ClonerService } from 'src/app/core/services/cloner-service';
import { SharedService } from 'src/app/core/services/shared.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from 'src/app/core/services/storage.service';
import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import { environment } from 'src/environments/environment';
import { FILE_TABLES } from 'src/app/const';

@Component({
  selector: 'app-truck-inspection-manage',
  templateUrl: './truck-inspection-manage.component.html',
  styleUrls: ['./truck-inspection-manage.component.scss'],
})
export class TruckInspectionManageComponent implements OnInit, OnDestroy {
  @Output() event = new EventEmitter<any>();
  @Input() inputData: any;
  private destroy$: Subject<void> = new Subject<void>();
  inspectionForm: FormGroup;
  truck: TruckData = null;
  inspectionData: TruckInspection[] = [];
  inspection: TruckInspection = null;
  formData = new FormData();
  modalTitle: string;
  loaded = false;
  format: FormatSettings = environment.dateFormat;
  files = [];
  attachments: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private truckService: AppTruckService,
    private spinner: SpinnerService,
    private activeModal: NgbActiveModal,
    private shared: SharedService,
    private storageService: StorageService,
    private notification: NotificationService,
    private clonerService: ClonerService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.modalTitle =
      this.inputData.data.truck && this.inputData.data.prefix
        ? 'Unit # ' + this.inputData.data.truck.truckNumber + ' - '
        : '';
    this.modalTitle += this.inputData.data.type === 'edit' ? 'Edit inspection' : 'New inspection';
    this.loadinspectionData();

    this.shared.emitDeleteFiles
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (files: any) => {
        if (files.success) {
          const removedFile = files.success[0];
          this.inspection.attachments = this.inspection.attachments.filter((file: any) => file.fileItemGuid !== removedFile.guid);
          this.saveInspection(true);
        }
      }
    );
  }

  createForm() {
    this.inspectionForm = this.formBuilder.group({
      startDate: ['', Validators.required],
    });
  }

  public loadinspectionData(): void {
    this.truck = this.inputData.data.truck ? this.inputData.data.truck : null;
    if (this.inputData.data.truck && this.inputData.data.truck.doc.inspectionData) {
      this.inspectionData = this.inputData.data.truck.doc.inspectionData;
      if (this.inputData.data.type === 'edit') {
        const inspection = this.shared.getItemById(this.inspectionData, this.inputData.data.id);
        this.inspection = inspection;
        this.attachments = inspection.attachments;
        this.setInspectionData(inspection);
        this.shared.touchFormFields(this.inspectionForm);
      } else {
        this.setInspectionData(null);
      }
    } else {
      this.setInspectionData(null);
    }
  }

  public setInspectionData(inspection: TruckInspection) {
    this.loaded = true;
    this.inspection = inspection;
    if (this.inputData.data.type === 'edit') {
      this.inspectionForm.setValue({
        startDate: new Date(inspection.startDate),
      });
    }
  }

  closeModal() {
    this.activeModal.close();
  }

  saveInspection(keepModal: boolean) {
    if (!this.shared.markInvalid(this.inspectionForm)) {
      return false;
    }

    const inspection: TruckInspection = {
      id: this.inspection ? this.inspection.id : uuidv4(),
      startDate: this.inspectionForm.controls.startDate.value,
      attachments:
        this.inspection && this.inspection.attachments ? this.inspection.attachments : [],
    };

    const saveData: TruckData = this.clonerService.deepClone<TruckData>(this.truck);
    saveData.status = this.truck.status ? 1 : 0;

    inspection.startDate = DateFormatter.formatDate(inspection.startDate.toString());

    const index = this.inspectionData.findIndex((l) => l.id === inspection.id);

    const tempData = this.inspectionData;

    if (index !== -1) {
      tempData[index] = inspection;
    } else {
      tempData.push(inspection);
    }

    saveData.doc.inspectionData = tempData;

    this.spinner.show(true);

    const newFiles = this.shared.getNewFiles(this.files);
    if (newFiles.length > 0) {
      this.storageService
        .uploadFiles(
          this.truck.guid,
          FILE_TABLES.TRUCK,
          this.truck.id,
          this.files,
          'inspection',
          inspection.id
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (resp: any) => {
            resp.success.forEach(element => {
              inspection.attachments.push(element);
            });
            this.notification.success(`Attachments successfully uploaded.`, ' ');
            this.truckService.updateTruckData(saveData, this.truck.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
              () => {
                if (this.inputData.data.type === 'new') {
                  this.notification.success('Inspection has been added.', 'Success:');
                } else {
                  this.notification.success('Inspection has been updated.', 'Success:');
                }
                if (!keepModal) {
                  this.closeModal();
                }
                this.spinner.show(false);
              },
              (error: HttpErrorResponse) => {
                this.shared.handleError(error);
              }
            );
          },
          (error: HttpErrorResponse) => {
            this.shared.handleError(error);
          }
        );
    } else {
      this.truckService.updateTruckData(saveData, this.truck.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          if (this.inputData.data.type === 'new') {
            this.notification.success('Inspection has been added.', 'Success:');
          } else {
            this.notification.success('Inspection has been updated.', 'Success:');
          }
          if (!keepModal) {
            this.closeModal();
          }
          this.spinner.show(false);
        },
        (error: HttpErrorResponse) => {
          this.shared.handleError(error);
        }
      );
    }
  }

  setFiles(files: any) {
    this.files = files;
  }

  keyDownFunction(event: any) {
    if (
      event.keyCode === 13 &&
      event.target.localName !== 'textarea' &&
      event.path !== undefined &&
      event.path !== null &&
      event.path[3].className !== 'ng-select-container ng-has-value'
    ) {
      this.saveInspection(false);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
