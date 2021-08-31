import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RepairShopManageComponent } from '../../shared/app-repair-shop/repair-shop-manage/repair-shop-manage.component';
import { ManageRepairShop } from 'src/app/core/model/shared/repairShop';
import { AppTruckService } from 'src/app/core/services/app-truck.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { AppSharedService } from 'src/app/core/services/app-shared.service';
import { CustomModalService } from 'src/app/core/services/custom-modal.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { AppTrailerService } from 'src/app/core/services/app-trailer.service';
import { MaintenanceService } from 'src/app/core/services/maintenance.service';
import { checkSelectedText, pasteCheck } from 'src/assets/utils/methods-global';

import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { StorageService } from 'src/app/core/services/storage.service';
import { FILE_TABLES } from 'src/app/const';
import { ManageMaintenance } from 'src/app/core/model/shared/maintenance';

@Component({
  selector: 'app-maintenance-manage',
  templateUrl: './maintenance-manage.component.html',
  styleUrls: ['./maintenance-manage.component.scss'],
})
export class MaintenanceManageComponent implements OnInit, OnDestroy {
  @Input() inputData: any;
  @ViewChild('myselect') myselect;
  listShop: any[] = [];
  private destroy$: Subject<void> = new Subject<void>();
  vehicleType: string;
  maintenance: any;
  maintenanceForm: FormGroup;
  itemList: FormArray;
  repairShops: ManageRepairShop[] | any;
  selectedRepairShop = null;
  unitNumbers: any;
  quantity = [];
  price = [];
  types = [
    {
      id: 'mobile',
      name: 'Mobile',
      checked: false,
    },
    {
      id: 'shop',
      name: 'Shop',
      checked: false,
    },
    {
      id: 'towing',
      name: 'Towing',
      checked: false,
    },
    {
      id: 'parts',
      name: 'Parts',
      checked: false,
    },
    {
      id: 'tire',
      name: 'Tire',
      checked: false,
    },
    {
      id: 'dealer',
      name: 'Dealer',
      checked: false,
    },
  ];
  subTotal = [];
  totalPrice = 0;
  scrollConfig = {
    suppressScrollX: true,
    suppressScrollY: false,
  };

  files = [];
  truckActive = false;
  checked = true;
  switchData = [
    {
      id: 'truck',
      name: 'Truck',
      checked: true,
      inputName: 'truckTrailerSwitch',
    },
    {
      id: 'trailer',
      name: 'Trailer',
      checked: false,
      inputName: 'truckTrailerSwitch',
    },
  ];

  pmSwitch = [
    {
      id: 1,
      name: 'Box',
      checked: true,
      inputName: 'pmSwitch',
    },
    {
      id: 2,
      name: 'Reefer',
      checked: false,
      inputName: 'pmSwitch',
    },
  ];

  format: FormatSettings = environment.dateFormat;
  formSubmitted = false;

  repairSearchItems = 0;
  attachments: any = [];
  public idTruckTrailer = 0;
  maintenanceTitle = '';
  public fomratType = /^[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]*$/;
  selectedInputItem = -1;
  showPMOption: boolean;
  clickInput: boolean;
  isReefer: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private truckService: AppTruckService,
    private notification: NotificationService,
    private shared: SharedService,
    private spinner: SpinnerService,
    private sharedService: AppSharedService,
    private trailerService: AppTrailerService,
    private activeModal: NgbActiveModal,
    private customModalService: CustomModalService,
    private storageService: StorageService,
    private elementRef: ElementRef,
    private maintenanceService: MaintenanceService
  ) {}

  get itemFormGroup() {
    return this.maintenanceForm.get('items') as FormArray;
  }

  ngOnInit() {
    this.createForm();
    this.getRepairShop();
    this.truckActive = this.inputData.data.vehicle == 'truck' ? true : false;
    this.maintenanceForm.controls.modelVehicle.setValue(this.inputData.data.vehicle);
    this.getUnitNumber(this.inputData.data.vehicle);
    if (this.inputData.data.type == 'new') {
      this.maintenanceTitle = 'Add repair';
      if (this.inputData.data.useSetUnitForm) {
        this.setUnitForm(this.inputData.data.inputData[0]);
      }
    } else if (this.inputData.data.type == 'edit') {
      this.maintenanceTitle = 'Edit repair';
      this.setForm(this.inputData.data.maintenance);
    }
    this.switchData.forEach((el) => {
      el.checked = el.id == this.inputData.data.vehicle ? true : false;
    });
    this.maintenanceForm.controls.id.disable();

    this.sharedService.newRepairShop.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.getRepairShop();
    });

    this.shared.emitDeleteFiles.pipe(takeUntil(this.destroy$)).subscribe((files: any) => {
      if (files.success) {
        const removedFile = files.success[0];
        this.maintenance.doc.attachments = this.maintenance.doc.attachments.filter(
          (file: any) => file.fileItemGuid !== removedFile.guid
        );
        this.addMaintenance(true);
      }
    });
  }

  isRequiredField(field: string, item: any) {
    const formField = item.get(field);
    if (!formField.validator) {
      return false;
    }

    const validator = formField.validator({} as AbstractControl);
    return validator && validator.required;
  }

  /*  selectedInput(index: number){
    this.selectedInputItem = index;
    this.clickInput = true;
  } */

  @HostListener('document:click', ['$event.target'])
  public onClick(target) {
    const clickedInside = this.elementRef.nativeElement.contains(target);

    if (!clickedInside && this.maintenanceService.reloadAddRepair) {
      const interval = setInterval(() => {
        this.getRepairShop();
        clearInterval(interval);
      }, 100);
      this.maintenanceService.reloadAddRepair = false;
    }

    /* if(!clickedInside && !this.clickInput){
      this.selectedInputItem = -1;
    }

    this.clickInput = false; */
  }

  setUnitForm(data: any) {
    this.maintenanceForm.patchValue({
      id: data.category == 'truck' ? data.truckId : data.trailerId,
    });
  }

  setFiles(files: any) {
    this.files = files;
  }

  setForm(data: any) {
    this.maintenance = data;
    this.totalPrice =
      data.doc.total && data.doc.total[0] == '$' ? data.doc.total.split('$')[1] : data.doc.total;
    this.maintenanceForm.patchValue({
      id: data.category == 'truck' ? data.truckId : data.trailerId,
      date: new Date(data.maintenanceDate),
      repairShop: data.repairShopId,
      invoice: data.invoiceNo,
      types: data.doc.types,
      millage: data.doc.millage,
      mileage: data.millage,
      total: data.total && data.total[0] == '$' ? data.total.split('$')[1] : data.total,
    });
    this.attachments = data.doc && data.doc.attachments ? data.doc.attachments : [];
    this.types = data.doc.types;
    this.getUnitNumber(this.inputData.data.vehicle);
    this.maintenanceForm.controls.modelVehicle.setValue(this.inputData.data.vehicle);
    this.maintenanceForm.setControl('items', this.setItems(data.doc.items));
    this.sumSubtotal();
    this.truckActive = this.inputData.data.vehicle == 'truck' ? true : false;
    this.maintenanceForm.controls.modelVehicle.setValue(this.inputData.data.vehicle);
    this.shared.touchFormFields(this.maintenanceForm);
  }

  closeModal() {
    this.activeModal.close();
  }

  removeItem(maintenanceId, itemId, index) {
    const items = this.maintenanceForm.get('items') as FormArray;
    items.removeAt(index);
    if (itemId !== undefined) {
      this.truckService
        .deleteMaintennaceItem(maintenanceId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          () => {
            this.total();
            this.sumSubtotal();
          },
          () => {
            this.shared.handleServerError();
          }
        );
    } else {
      this.total();
      this.sumSubtotal();
    }
  }

  setItems(item): FormArray {
    const formArray = new FormArray([]);
    if (item) {
      item.forEach((s) => {
        formArray.push(
          this.formBuilder.group({
            id: s.id,
            item: s.item,
            price: s.price[0] == '$' ? s.price.split('$')[1] : s.price,
            quantity: s.quantity,
            subtotal: s.subtotal,
          })
        );
      });
    }
    this.itemList = formArray;
    return formArray;
  }

  getRepairShop() {
    this.sharedService
      .getRepairShops()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result: any) => {
          this.repairShops = result.data;
          this.repairShops = this.getSortedShops();

          this.repairShops.splice(0, 0, {
            id: 0,
            name: 'Add new',
          });

          if (this.inputData.data.type == 'edit') {
            const repairShop = this.shared.getItemById(
              result.data,
              this.inputData.data.maintenance.repairShopId
            );

            this.selectedRepairShop = {
              id: repairShop.id,
              name: repairShop.name,
              contact: {
                email: repairShop.doc.email,
                phone: repairShop.doc.phone,
                address: repairShop.doc.address.address,
              },
            };
          }
        },
        (error: any) => {
          this.shared.handleServerError();
        }
      );
  }

  getSortedShops() {
    for (let i = 0; i < this.repairShops.length; i++) {
      this.listShop.push({
        shop: this.repairShops[i],
      });
    }

    for (let i = 0; i < this.listShop.length; i++) {
      for (let j = 0; j < this.listShop.length; j++) {
        if (this.listShop[i].shop.pinned === 1 && this.listShop[j].shop.pinned === 0) {
          const pom: any = this.listShop[i];
          this.listShop[i] = this.listShop[j];
          this.listShop[j] = pom;
        }
      }
    }
    for (let i = 0; i < this.listShop.length; i++) {
      this.repairShops[i] = this.listShop[i].shop;
    }
    this.listShop = [];
    return this.repairShops;
  }

  getUnitNumber(event: any) {
    this.maintenanceForm.controls.id.reset();
    this.maintenanceForm.controls.id.disable();

    if (event.id === 'truck' || event === 'truck') {
      this.vehicleType = 'truck';
      this.truckService
        .getTruckList()
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (result: any) => {
            if (this.maintenanceTitle === 'Add repair') {
              this.unitNumbers = result.activeTrucks;
            } else {
              this.unitNumbers = result.allTrucks;
            }
            this.maintenanceForm.controls.id.enable();
            if (event === 'truck' && this.inputData.data.id) {
              setTimeout(() => {
                this.maintenanceForm.controls.id.setValue(this.maintenance?.truckId);
              }, 2000);
            }
          },
          () => {
            this.shared.handleServerError();
          }
        );
    } else if (event.id === 'trailer' || event === 'trailer') {
      this.vehicleType = 'trailer';
      this.trailerService
        .getTrailerList()
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (result: any) => {
            if (this.maintenanceTitle === 'Add repair') {
              this.unitNumbers = result.activeTrailers;
            } else {
              this.unitNumbers = result.allTrailers;
            }
            this.maintenanceForm.controls.id.enable();
            if (event === 'trailer' && this.inputData.data.id) {
              setTimeout(() => {
                this.maintenanceForm.controls.id.setValue(this.maintenance?.trailerId);
              }, 2000);
            }
          },
          () => {
            this.shared.handleServerError();
          }
        );
    } else {
      this.unitNumbers = [];
      this.vehicleType = '';
    }
  }

  createForm() {
    this.maintenanceForm = this.formBuilder.group({
      id: [null, Validators.required],
      date: ['', Validators.required],
      repairShop: [null, Validators.required],
      modelVehicle: [
        this.inputData !== undefined ? this.inputData.data.vehicle : null,
        Validators.required,
      ],
      invoice: [''],
      millage: [''],
      types: [''],
      items: this.formBuilder.array([this.createRequiredItem()]),
    });
    this.getUnitNumber(this.inputData.data.vehicle);
    this.itemList = this.maintenanceForm.get('items') as FormArray;
    this.sumSubtotal();
    setTimeout(() => {
      this.transformInputData();
    });
  }

  private transformInputData() {
    const data = {
      invoice: 'upper',
      contactName: 'capitalize',
    };
    this.shared.handleInputValues(this.maintenanceForm, data);
  }

  createRequiredItem() {
    const fb = this.formBuilder.group({
      item: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(0.1)]],
      price: [0, Validators.required],
    });
    const data = {
      item: 'capitalize',
      contactName: 'capitalize',
    };
    this.shared.handleInputValues(fb, data);
    return fb;
  }

  createItem() {
    const fb = this.formBuilder.group({
      item: [null],
      quantity: [1],
      price: [0],
    });
    const data = {
      item: 'capitalize',
    };
    this.shared.handleInputValues(fb, data);
    return fb;
  }

  // Deprecated
  addItemPossible() {
    if (this.itemList.controls.length == 1) {
      if (this.itemList.valid) {
        return true;
      } else {
        return false;
      }
    } else {
      const lastItem = this.itemList.controls[this.itemList.controls.length - 1].value;
      if (
        lastItem.item !== null &&
        lastItem.item !== '' &&
        lastItem.price !== null &&
        lastItem.price !== '' &&
        lastItem.quantity !== null &&
        lastItem.quantity !== ''
      ) {
        return true;
      } else {
        return false;
      }
    }
  }

  addNewItem() {
    this.itemList.push(this.createRequiredItem());

    /* deprecated
    if (this.itemList.controls.length == 0) {
      this.itemList.push(this.createRequiredItem());
    } else {
      this.itemList.push(this.createItem());
    }
    */

    this.subTotal[this.subTotal.length - 1] = undefined;
    this.sumSubtotal();
  }

  priceModel(event, index) {
    this.price[index] = event;
    this.sumSubtotal();
    this.total();
  }

  quantityModel(event, index) {
    this.quantity[index] = event;
    this.sumSubtotal();
    this.total();
  }

  sumSubtotal() {
    const arrQt = this.itemFormGroup.value;
    this.subTotal = [];
    for (let i = 0; i < arrQt.length; i++) {
      if (arrQt[i].price && arrQt[i].quantity) {
        this.subTotal[i] = arrQt[i].price * arrQt[i].quantity;
      }
    }
  }

  total() {
    const arrQt = this.itemFormGroup.value;
    this.totalPrice = 0;
    for (const ob of arrQt) {
      if (ob.price && ob.quantity) {
        this.totalPrice += ob.price * ob.quantity;
      }
    }
  }

  addMaintenance(keepModal: boolean) {
    /* this.maintenanceServise.newMaintenance = true; */
    this.formSubmitted = true;
    if (!this.shared.markInvalid(this.maintenanceForm)) {
      return false;
    }
    const types = [];
    this.types.forEach((element) => {
      if (element.checked) {
        types.push(element.id);
      }
    });
    const maintenance = this.maintenanceForm.getRawValue();
    let unitSelected: string;
    for (const unit of this.unitNumbers) {
      console.log(unit);
      if (maintenance.modelVehicle == 'truck') {
        if (unit.id === maintenance.id) {
          unitSelected = unit.truckNumber;
        }
      } else {
        if (unit.id === maintenance.id) {
          unitSelected = unit.trailerNumber;
        }
      }
    }
    const saveData: ManageMaintenance = {
      repairShopId: maintenance.repairShop,
      truckId: maintenance.modelVehicle == 'truck' ? maintenance.id : undefined,
      trailerId: maintenance.modelVehicle == 'trailer' ? maintenance.id : undefined,
      category: maintenance.modelVehicle,
      maintenanceDate: new Date(maintenance.date),
      invoiceNo: maintenance.invoice,
      doc: {
        millage: maintenance.millage,
        repairShop: this.selectedRepairShop,
        total: this.totalPrice,
        types: this.types,
        attachments:
          this.inputData.data.type == 'new'
            ? []
            : this.maintenance.doc.attachments !== null &&
              this.maintenance.doc.attachments.length == 0
            ? this.maintenance.doc.attachments
            : [],
        items: this.itemFormGroup.value,
        unit: unitSelected,
        additionalData: {
          note: '',
        },
      },
    };

    if (this.inputData.data.type == 'new') {
      this.sharedService
        .addMaintenanceGlobal(saveData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (resp1: any) => {
            this.notification.success(`Maintenance for unit ${resp1.id} added.`, ' ');
            const newFiles = this.shared.getNewFiles(this.files);
            if (newFiles.length > 0) {
              this.storageService
                .uploadFiles(resp1.guid, FILE_TABLES.MAINTENANCE, resp1.id, this.files)
                .pipe(takeUntil(this.destroy$))
                .subscribe(
                  (resp2: any) => {
                    if (resp2.success.length > 0) {
                      resp2.success.forEach((element) => {
                        saveData.doc.attachments.push(element);
                      });
                      this.notification.success(`Attachments successfully uploaded.`, ' ');
                      this.sharedService
                        .updateMaintennace(resp1.id, saveData)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe(
                          (resp3: any) => {
                            if (!keepModal) {
                              this.resetModalData();
                            }
                            this.spinner.show(false);
                            this.notification.success(
                              `Maintenance for unit ${resp1.id} updated.`,
                              ' '
                            );
                          },
                          (error: HttpErrorResponse) => {
                            this.shared.handleError(error);
                          }
                        );
                    } else {
                      if (!keepModal) {
                        this.resetModalData();
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
                this.resetModalData();
              }
              this.spinner.show(false);
            }
          },
          (error: HttpErrorResponse) => {
            this.shared.handleError(error);
          }
        );
    } else {
      if (
        this.selectedRepairShop !== null &&
        this.maintenance.repairShop !== undefined &&
        this.selectedRepairShop.id === this.maintenance.repairShopId
      ) {
        this.maintenanceForm.get('repairShop').setValue(this.maintenance.repairShopId);
      }

      const newFiles = this.shared.getNewFiles(this.files);
      if (newFiles.length > 0) {
        this.storageService
          .uploadFiles(
            this.maintenance.guid,
            FILE_TABLES.MAINTENANCE,
            this.maintenance.id,
            this.files
          )
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (resp2: any) => {
              if (resp2.success.length > 0) {
                resp2.success.forEach((element) => {
                  saveData.doc.attachments.push(element);
                });
                this.notification.success(`Attachments successfully uploaded.`, ' ');
                this.sharedService
                  .updateMaintennace(this.maintenance.id, saveData)
                  .pipe(takeUntil(this.destroy$))
                  .subscribe(
                    (resp3: any) => {
                      if (!keepModal) {
                        this.resetModalData();
                      }
                      this.spinner.show(false);
                      this.notification.success(
                        `Maintenance for unit ${this.maintenance.id} updated.`,
                        ' '
                      );
                    },
                    (error: HttpErrorResponse) => {
                      this.shared.handleError(error);
                    }
                  );
              } else {
                if (!keepModal) {
                  this.resetModalData();
                }
                this.spinner.show(false);
              }
            },
            (error: HttpErrorResponse) => {
              this.shared.handleError(error);
            }
          );
      } else {
        this.sharedService
          .updateMaintennace(this.maintenance.id, saveData)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (resp3: any) => {
              if (!keepModal) {
                this.resetModalData();
              }
              this.spinner.show(false);
              this.notification.success(
                `Maintenance for unit ${this.maintenance.id} updated.`,
                ' '
              );
            },
            (error: HttpErrorResponse) => {
              this.shared.handleError(error);
            }
          );
      }
    }
  }

  resetModalData() {
    this.closeModal();
    this.maintenanceForm.reset();
    this.selectedRepairShop = null;
    this.totalPrice = 0;
  }

  selectRepairShop(event) {
    if (event) {
      if (event.id == 0) {
        this.openRepairShopModal();
        this.maintenanceForm.controls.repairShop.reset();
        return;
      }
      const repairShop = {
        id: event.id,
        name: event.name,
        contact: {
          email: event.doc.email,
          phone: event.doc.phone,
          address: event.doc.address.address,
        },
      };
      this.selectedRepairShop = repairShop;
    } else {
      this.selectedRepairShop = null;
    }
  }

  closeCard() {
    this.selectedRepairShop = null;
    this.maintenanceForm.get('repairShop').setValue(null);
  }
  openRepairShopModal() {
    const data = {
      type: 'new',
      id: null,
    };
    this.customModalService.openModal(RepairShopManageComponent, { data }, null, { size: 'small' });
  }

  switchType(data: any) {
    if (data !== undefined && data[0] !== undefined) {
      let val = '';
      data.filter((item) => {
        if (item.checked == true) {
          val = item.id;
        }
      });
      this.truckActive = val == 'truck' ? true : false;
      this.maintenanceForm.controls.modelVehicle.setValue(val);
      this.getUnitNumber(val);
    }

    if(data[1].checked){
      this.isReefer = false;
      this.showPMOption = false;
      this.pmSwitch[0].checked = true;
      this.pmSwitch[1].checked = false;
    }
  }

  onTrailerSelected(trailer: any) {
    if (trailer) {
      this.isReefer =
        trailer.trailerNumber.charAt(0) === 'r' || trailer.trailerNumber.charAt(0) === 'R';
    } else {
      this.isReefer = false;
    }

    if(!this.isReefer){
      this.showPMOption = false;
      this.pmSwitch[0].checked = true;
      this.pmSwitch[1].checked = false;
    }
  }

  switchPM(event: any) {
    if (event[1].checked) {
      this.showPMOption = true;
    } else {
      this.showPMOption = false;
    }
  }

  onPaste(event: any, inputID: string, limitOfCuracters?: number, index?: number) {
    event.preventDefault();

    if (index !== undefined) {
      (document.getElementById(inputID + index) as HTMLInputElement).value = checkSelectedText(
        inputID,
        index
      );
    } else {
      (document.getElementById(inputID) as HTMLInputElement).value = checkSelectedText(
        inputID,
        index
      );
    }

    (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
      event.clipboardData.getData('Text'),
      this.fomratType,
      true,
      false,
      false,
      limitOfCuracters
    );

    this.maintenanceForm.controls[inputID].patchValue(
      (document.getElementById(inputID) as HTMLInputElement).value
    );
  }

  onSpecialChar(event) {
    let k;
    k = event.charCode;
    return (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      k == 8 ||
      k == 32 ||
      (k >= 48 && k <= 57) ||
      k == 45
    );
  }

  customSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.name.toLocaleLowerCase().indexOf(term) > -1 || item.id === 0;
  }

  onSearch(event: any) {
    this.repairSearchItems = event.items.length;
  }

  onClose(event: any) {
    this.repairSearchItems = 0;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
