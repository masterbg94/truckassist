import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';
import { CroppieDirective } from 'angular-croppie-module';
import { Options } from 'ng5-slider';
import { Subject } from 'rxjs';
import { Address } from 'src/app/core/model/address';
import { AppDriverService } from 'src/app/core/services/app-driver.service';
import { AppTrailerService } from 'src/app/core/services/app-trailer.service';
import { AppTruckService } from 'src/app/core/services/app-truck.service';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { SafetyService } from 'src/app/core/services/safety.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { DriverManageComponent } from 'src/app/driver/driver-manage/driver-manage.component';
import { NotificationService } from 'src/app/services/notification-service.service';
import { FILE_TABLES } from 'src/app/const';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-accident-manage',
  templateUrl: './accident-manage.component.html',
  styleUrls: ['./accident-manage.component.scss'],
})
export class AccidentManageComponent implements OnInit, OnDestroy {
  @Input() inputData: any;
  accidentForm: FormGroup;
  accidentManageTitel = 'Add Accident';
  openBillingAddress = false;
  checkStatus = true;
  mcVisible = true;
  zipCodes: [];
  private destroy$: Subject<void> = new Subject<void>();
  options = {
    componentRestrictions: { country: ['US', 'CA'] },
  };
  modalTitle: string;
  address: Address;
  isValidAddress: boolean;
  accidentEditData: any;
  driversData: any[];
  steps: any = { year: 1, month: 1, day: 1, hour: 1, minute: 15, second: 0 };
  croppedImage = '';
  @ViewChild('croppie')
  croppieDirective: CroppieDirective | any;
  croppieOptions: Croppie.CroppieOptions = {
    enableExif: true,
    viewport: {
      width: 77,
      height: 77,
      type: 'circle',
    },
    boundary: {
      width: 315,
      height: 150,
    },
  };
  showDropzone = true;
  uploadedImageFile: any = null;
  files: any = [];
  slideInit = 0.75;
  optionsDragFile: Options = {
    floor: 0,
    ceil: 1.5,
    step: 0.0001,
    animate: false,
    showSelectionBar: true,
    hideLimitLabels: true,
  };
  scale = 0.75;
  avatarError = false;
  showUploadZone = true;
  isTow = false;
  showNote = false;
  isHM = false;
  fatalityCount = 0;
  injuriesCount = 0;
  trucks: any;
  @ViewChild(NgSelectComponent)
  ngSelect: NgSelectComponent;
  trailerTabData: any[];

  driverSearchItems = 0;
  attachments: any = [];
  loaded = false;
  isReportable: boolean;
  isReportableClicked = true;

  constructor(
    private formBuilder: FormBuilder,
    private notification: NotificationService,
    private spinner: SpinnerService,
    private shared: SharedService,
    private activeModal: NgbActiveModal,
    private driverService: AppDriverService,
    private truckService: AppTruckService,
    private customModalService: CustomModalService,
    private safetyService: SafetyService,
    private storageService: StorageService,
    private trailerService: AppTrailerService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.getDirvers();
    this.getTrucks();
    this.getTrailers();
    if (this.inputData.data.type === 'new') {
      this.modalTitle = 'Add Accident';
      this.loaded = true;
    } else if (this.inputData.data.type === 'edit') {
      this.modalTitle = 'Edit Accident';
      this.isReportable = true;
      this.getAccidentData(this.inputData.data);
    }

    this.shared.emitDeleteFiles.pipe(takeUntil(this.destroy$)).subscribe((files: any) => {
      if (files.success) {
        const removedFile = files.success[0];
        this.accidentEditData.doc.attachments = this.accidentEditData.doc.attachments.filter(
          (file: any) => file.fileItemGuid !== removedFile.guid
        );
        this.updateAccident(true);
      }
    });
  }

  setForm() {
    const reportable = typeof this.accidentEditData.report === 'string' ? true : false;
    this.loaded = true;
    this.attachments =
      this.accidentEditData.doc && this.accidentEditData.doc.attachments
        ? this.accidentEditData.doc.attachments
        : [];
    this.accidentForm.setValue({
      driver: this.accidentEditData.driverId,
      accidentDate: new Date(this.accidentEditData.createdAt),
      accidentTime: this.accidentEditData?.doc?.time
        ? new Date(this.accidentEditData.doc.time)
        : null,
      address: this.accidentEditData.address,
      truck: this.accidentEditData.doc.truck ? this.accidentEditData.doc.truck : null,
      trailer: this.accidentEditData.doc.trailer ? this.accidentEditData.doc.trailer : null,
      report: this.accidentEditData.report,
      reportable,
      insuranceClaim: this.accidentEditData.insuranceClaim,
      tow: this.accidentEditData.towing,
      hm: this.accidentEditData.hm,
      note:
        this.accidentEditData.note !== null
          ? this.accidentEditData.note.replace(/<\/?[^>]+(>|$)/g, '')
          : '',
      fatality: 0,
      injuries: 0,
    });
    if (this.accidentEditData.note && this.accidentEditData.note !== '') {
      this.showNote = true;
    }
    this.accidentForm.patchValue({
      reportable,
    });
    this.isTow = this.accidentEditData.towing === 'No' ? false : true;
    this.isHM = this.accidentEditData.hm === 'No' ? false : true;
    this.fatalityCount = this.accidentEditData.fatality;
    this.injuriesCount = this.accidentEditData.injuries;
    this.address = this.accidentEditData.doc.fullAddress;
    this.isReportable = reportable;
    this.isReportableClicked = reportable;
    this.shared.touchFormFields(this.accidentForm);
  }

  getAccidentData(data: any) {
    this.safetyService
      .getAccidentById(data.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp: any) => {
          this.accidentEditData = resp;
          this.setForm();
        },
        (error: HttpErrorResponse) => {
          this.shared.handleError(error);
        }
      );
  }

  handleAddressChange(address: any) {
    this.isValidAddress = true;
    this.address = this.shared.selectAddress(this.accidentForm, address);
  }

  addressKeyDown(event: any) {
    this.isValidAddress = false;
    this.address = null;
  }

  createForm() {
    this.accidentForm = this.formBuilder.group({
      driver: [null, Validators.required],
      accidentDate: [null, Validators.required],
      accidentTime: [null],
      address: [null, Validators.required],
      truck: [null, Validators.required],
      trailer: [null],
      report: [null],
      reportable: [null, Validators.required],
      fatality: [0],
      injuries: [0],
      insuranceClaim: [null],
      tow: [null],
      hm: [null],
      note: [null],
    });
    setTimeout(() => {
      this.transformInputData();
    });
  }

  private transformInputData() {
    const data = {
      name: 'upper',
    };

    this.shared.handleInputValues(this.accidentForm, data);
  }

  updateAccident(keepModal: boolean) {
    if (!this.shared.markInvalid(this.accidentForm)) {
      return false;
    }
    const accident = this.accidentForm.value;
    const saveData = {
      driverId: accident.driver,
      eventDate: new Date(accident.accidentDate),
      address: this.address.address,
      report: accident.reportable ? accident.report : null,
      insuranceClaim: accident.insuranceClaim,
      fatality: accident.fatality,
      injuries: accident.injuries,
      towing: this.isTow ? 1 : 0,
      hm: this.isHM ? 1 : 0,
      note: accident.note,
      trailerId: accident.trailer,
      truckId: accident.truck,
      doc: {
        time: new Date(accident.accidentDate),
        fullAddress: this.address,
        truck: accident?.truck,
        trailer: accident?.trailer,
        attachments:
          this.inputData.data.type === 'new' ? [] : this.accidentEditData.doc.attachments,
      },
    };
    this.spinner.show(true);
    if (this.inputData.data.type === 'new') {
      this.safetyService
        .createAccident(saveData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (resp: any) => {
            const newFiles = this.shared.getNewFiles(this.files);
            if (newFiles.length > 0) {
              this.notification.success(`Accident added.`, ' ');
              this.storageService
                .uploadFiles(resp.guid, FILE_TABLES.ACCIDENT, resp.id, this.files)
                .pipe(takeUntil(this.destroy$))
                .subscribe(
                  (resp1: any) => {
                    if (!keepModal) {
                      this.closeAccidentEdit();
                    }
                    this.spinner.show(false);
                    if (resp1.success.length > 0) {
                      resp1.success.forEach((element) => {
                        saveData.doc.attachments.push(element);
                      });
                      this.notification.success(`Attachments successfully uploaded.`, ' ');
                      this.safetyService
                        .updateAccident(saveData, resp.id)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe(
                          () => {
                            this.notification.success(`Accident updated.`, ' ');
                            if (!keepModal) {
                              this.closeAccidentEdit();
                            }
                            this.spinner.show(false);
                          },
                          (error: HttpErrorResponse) => {
                            this.shared.handleError(error);
                          }
                        );
                    } else {
                      if (!keepModal) {
                        this.closeAccidentEdit();
                      }
                      this.spinner.show(false);
                    }
                  },
                  (error: HttpErrorResponse) => {
                    this.shared.handleError(error);
                  }
                );
            } else {
              if (!keepModal) {
                this.closeAccidentEdit();
              }
              this.spinner.show(false);
            }
          },
          (error: HttpErrorResponse) => {
            this.shared.handleError(error);
          }
        );
    } else if (this.inputData.data.type === 'edit') {
      const newFiles = this.shared.getNewFiles(this.files);
      if (newFiles.length > 0) {
        this.storageService
          .uploadFiles(
            this.accidentEditData.guid,
            FILE_TABLES.ACCIDENT,
            this.accidentEditData.id,
            this.files
          )
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (resp1: any) => {
              if (!keepModal) {
                this.closeAccidentEdit();
              }
              this.spinner.show(false);
              if (resp1.success.length > 0) {
                resp1.success.forEach((element) => {
                  saveData.doc.attachments.push(element);
                });
                this.notification.success(`Attachments successfully uploaded.`, ' ');
                this.safetyService
                  .updateAccident(saveData, this.accidentEditData.id)
                  .pipe(takeUntil(this.destroy$))
                  .subscribe(
                    (resp: any) => {
                      this.notification.success(`Accident updated.`, ' ');
                      if (!keepModal) {
                        this.closeAccidentEdit();
                      }
                      this.spinner.show(false);
                    },
                    (error: HttpErrorResponse) => {
                      this.shared.handleError(error);
                    }
                  );
              } else {
                if (!keepModal) {
                  this.closeAccidentEdit();
                }
                this.spinner.show(false);
              }
            },
            (error: HttpErrorResponse) => {
              this.shared.handleError(error);
            }
          );
      } else {
        this.safetyService
          .updateAccident(saveData, this.accidentEditData.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (resp: any) => {
              this.notification.success(`Accident updated.`, ' ');
              if (!keepModal) {
                this.closeAccidentEdit();
              }
              this.spinner.show(false);
            },
            (error: HttpErrorResponse) => {
              this.shared.handleError(error);
            }
          );
      }
    }
  }

  setFiles(files: any) {
    this.files = files;
  }

  keyDownFunction(event: any) {
    if (event.keyCode === 13 && event.target.localName !== 'textarea') {
      this.updateAccident(false);
    }
  }

  clearList(event: any) {
    if (!event) {
      this.zipCodes = [];
    }
  }

  closeAccidentEdit() {
    this.activeModal.close();
  }

  getTrucks() {
    this.truckService
      .getTruckList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result: any) => {
          this.trucks = result.allTrucks;
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  getTrailers() {
    this.trailerService
      .getTrailers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (trailerTabData: any) => {
          this.trailerTabData = trailerTabData.allTrailers;
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  getDirvers() {
    this.driverService
      .getDriverSelect()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (driverTabDate: any[]) => {
          this.driversData = driverTabDate;
          this.driversData.splice(0, 0, {
            driverName: 'Add New',
            id: 0,
          });
        },
        () => {
          this.shared.handleServerError();
        }
      );
  }

  selectDriver(event: any) {
    if (event) {
      if (event.id === 0) {
        this.openDriverModal();
        this.accidentForm.controls.driver.reset();
        return;
      }
    }
  }

  selectTrucks(event: any) {}

  selectTrailers(event: any) {}

  openDriverModal() {
    const data = {
      type: 'new',
      id: null,
    };
    this.customModalService.openModal(DriverManageComponent, { data }, null, { size: 'small' });
  }

  pickupDateDateChange(event: any) {}
  pickupDateTimeChange(event: any) {}

  onTow(isTow: boolean) {
    if (isTow) {
      this.isTow = true;
    } else {
      this.isTow = false;
    }
  }
  onHM(isHM: boolean) {
    if (isHM) {
      this.isHM = true;
    } else {
      this.isHM = false;
    }
  }

  onReportable(isReportable: boolean, isClicked?: boolean) {
    this.isReportable = isReportable;
    this.accidentForm.controls.reportable.setValidators([]);
    this.accidentForm.controls.reportable.setValue(isReportable);
    if (!this.isReportable) {
      this.isReportableClicked = isClicked;
      if (isClicked) {
        this.accidentForm.controls.reportable.setValue(null);
        this.accidentForm.controls.reportable.setErrors({ invalid: true });
      } else {
        this.accidentForm.controls.reportable.setErrors(null);
        this.accidentForm.controls.reportable.setValue(false);
      }
      this.accidentForm.controls.report.setValue(null);
      this.accidentForm.controls.report.setValidators([]);
      this.accidentForm.controls.reportable.setValidators([Validators.required]);
    } else {
      this.accidentForm.controls.reportable.setValue(true);
      this.accidentForm.controls.reportable.setValidators([]);
      this.accidentForm.controls.report.setValidators([Validators.required]);
    }
  }

  onCountFatality(isUp: boolean) {
    if (isUp) {
      this.fatalityCount++;
    } else {
      if (this.fatalityCount) {
        this.fatalityCount--;
      }
    }
  }
  onCountInjuries(isUp: boolean) {
    if (isUp) {
      this.injuriesCount++;
    } else {
      if (this.injuriesCount) {
        this.injuriesCount--;
      }
    }
  }

  openNote() {
    this.showNote = !this.showNote;
  }

  onSelect(event: any) {
    this.files.push(...event.addedFiles);
    const file = this.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.croppieDirective.croppie.bind({
        url: reader.result as string,
        points: [188, 101, 260, 191],
        zoom: this.scale,
      });
      this.showDropzone = false;
    };
  }

  public handleUpdate(event) {
    this.slideInit = event.zoom;
  }

  public zooming(event: any) {
    this.scale = event ? event : 0.1;
    this.croppieDirective.croppie.setZoom(this.scale);
  }

  public saveImage() {
    this.croppieDirective.croppie.result('base64').then((base64) => {
      this.croppedImage = base64;
      this.avatarError = false;
      this.showDropzone = true;
    });
  }

  public onRemove() {
    this.files = [];
    this.showDropzone = true;
  }

  public editProfileImage() {
    this.showUploadZone = true;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  customSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.driverName.toLocaleLowerCase().indexOf(term) > -1 || item.id === 0;
  }

  onSearch(event: any) {
    this.driverSearchItems = event.items.length;
  }

  onClose(event: any) {
    this.driverSearchItems = 0;
  }

  manageInputValidation(formElement: any) {
    return this.shared.manageInputValidation(formElement);
  }
}
