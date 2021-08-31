import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { DateFormatter } from 'src/app/core/helpers/dateFormatter';
import { TruckData, TruckTitle } from 'src/app/core/model/truck';
import { AppTruckService } from 'src/app/core/services/app-truck.service';
import { ClonerService } from 'src/app/core/services/cloner-service';
import { SharedService } from 'src/app/core/services/shared.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { checkSelectedText, pasteCheck } from 'src/assets/utils/methods-global';
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from 'src/app/core/services/storage.service';
import { FILE_TABLES } from 'src/app/const';

import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-truck-title-manage',
  templateUrl: './truck-title-manage.component.html',
  styleUrls: ['./truck-title-manage.component.scss'],
})
export class TruckTitleManageComponent implements OnInit, OnDestroy {

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
  @Output() event = new EventEmitter<any>();
  @Input() inputData: any;
  private destroy$: Subject<void> = new Subject<void>();
  titleForm: FormGroup;
  truck: TruckData = null;
  titleData: TruckTitle[] = [];
  title: TruckTitle = null;
  formData = new FormData();
  modalTitle: string;
  loaded = false;
  format: FormatSettings = environment.dateFormat;
  files = [];
  attachments: any = [];

  public fomratType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?A-Za-z]*$/;
  public numOfSpaces = 0;

  ngOnInit() {
    this.modalTitle = this.inputData.data.truck && this.inputData.data.prefix
      ? 'Unit # ' + this.inputData.data.truck.truckNumber + ' - '
      : '';
    this.modalTitle += this.inputData.data.type === 'edit' ? 'Edit title' : 'New title';
    this.loadTitleData();

    this.shared.emitDeleteFiles
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (files: any) => {
        if (files.success) {
          const removedFile = files.success[0];
          this.title.attachments = this.title.attachments.filter((file: any) => file.fileItemGuid !== removedFile.guid);
          this.saveTitle(true);
        }
      }
    );
  }

  createForm() {
    this.titleForm = this.formBuilder.group({
      titleNumber: ['', Validators.required],
      startDate: ['', Validators.required],
    });
  }

  public loadTitleData(): void {
    this.truck = this.inputData.data.truck ? this.inputData.data.truck : null;
    if (this.inputData.data.truck && this.inputData.data.truck.doc.titleData) {
      this.titleData = this.inputData.data.truck.doc.titleData;
      if (this.inputData.data.type === 'edit') {
        const title = this.shared.getItemById(this.titleData, this.inputData.data.id);
        this.title = title;
        this.attachments = title.attachments;
        this.setTitleData(title);
      } else {
        this.setTitleData(null);
      }
    } else {
      this.setTitleData(null);
    }
  }

  public setTitleData(title: TruckTitle) {
    this.loaded = true;
    this.title = title;
    if (this.inputData.data.type === 'edit') {
      this.titleForm.setValue({
        titleNumber: title.titleNumber,
        startDate: new Date(title.startDate),
      });
      this.shared.touchFormFields(this.titleForm);
    }
  }

  closeModal() {
    this.activeModal.close();
  }

  saveTitle(keepModal: boolean) {
    if (!this.shared.markInvalid(this.titleForm)) {
      return false;
    }

    const title: TruckTitle = {
      id: this.title ? this.title.id : uuidv4(),
      titleNumber: this.titleForm.controls.titleNumber.value,
      startDate: this.titleForm.controls.startDate.value,
      attachments: (this.title && this.title.attachments) ? this.title.attachments : []
    };

    const saveData: TruckData = this.clonerService.deepClone<TruckData>(this.truck);
    saveData.status = this.truck.status ? 1 : 0;

    title.startDate = DateFormatter.formatDate(title.startDate.toString());

    const index = this.titleData.findIndex((l) => l.id === title.id);

    const tempData = this.titleData;

    if (index !== -1) {
      tempData[index] = title;
    } else {
      tempData.push(title);
    }

    saveData.doc.titleData = tempData;

    this.spinner.show(true);

    const newFiles = this.shared.getNewFiles(this.files);
    if (newFiles.length > 0) {
      this.storageService.uploadFiles(
        this.truck.guid,
        FILE_TABLES.TRUCK,
        this.truck.id,
        this.files,
        'title',
        title.id
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp: any) => {
          resp.success.forEach(element => {
            title.attachments.push(element);
          });
          this.notification.success(`Attachments successfully uploaded.`, ' ');
          this.truckService.updateTruckData(saveData, this.truck.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (truckData: TruckData) => {
              if (this.inputData.data.type === 'new') {
                this.notification.success('Title has been added.', 'Success:');
              } else {
                this.notification.success('Title has been updated.', 'Success:');
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
        (truckData: TruckData) => {
          if (this.inputData.data.type === 'new') {
            this.notification.success('Title has been added.', 'Success:');
          } else {
            this.notification.success('Title has been updated.', 'Success:');
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
      this.saveTitle(false);
    }
  }
  /* Form Validation on paste and word validation */
  onPaste(event: any, inputID: string, limitOfCuructers?: number, index?: number) {
    event.preventDefault();

    if (index !== undefined) {
      (document.getElementById(inputID + index) as HTMLInputElement).value  = checkSelectedText(inputID, index);
    } else {
       (document.getElementById(inputID) as HTMLInputElement).value = checkSelectedText(inputID, index);
    }
    this.numOfSpaces = 0;

    (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
      event.clipboardData.getData('Text'),
      this.fomratType,
      true,
      false,
      false,
      limitOfCuructers
    );
    this.titleForm.controls[inputID].patchValue((document.getElementById(inputID) as HTMLInputElement).value);
  }

  onTitleNumberTyping(event) {
    let k;
    k = event.charCode;
    if (k == 32) {
      this.numOfSpaces++;
    } else {
      this.numOfSpaces = 0;
    }
    if (this.numOfSpaces < 2) {
      return k == 8 || k == 32 || (k >= 48 && k <= 57);
    } else {
      event.preventDefault();
    }
  }

  onCheckBackSpace(event) {
    if (event.keyCode === 8) {
      this.numOfSpaces = 0;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
