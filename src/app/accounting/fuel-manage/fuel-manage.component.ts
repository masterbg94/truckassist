import { AppLoadService } from './../../core/services/app-load.service';
import { AppFuelService } from './../../core/services/app-fuel.service';
import { AppDriverService } from 'src/app/core/services/app-driver.service';
import { AppSharedService } from 'src/app/core/services/app-shared.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { TruckTabData } from 'src/app/core/model/truck';
import { AppTruckService } from '../../core/services/app-truck.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { NotificationService } from 'src/app/services/notification-service.service';
@Component({
  selector: 'app-fuel-manage',
  templateUrl: './fuel-manage.component.html',
  styleUrls: ['./fuel-manage.component.scss'],
})
export class FuelManageComponent implements OnInit {
  @Input() inputData: any;
  public bankData: any;
  fuelForm: FormGroup;
  public steps: any = { year: 1, month: 1, day: 1, hour: 1, minute: 15, second: 0 };
  modalTitle = 'Add Fuel';
  truckList: any;
  driversList: any;
  driverData = {
    driverName: '',
    driverId: '',
  };
  public options = {
    componentRestrictions: { country: ['US', 'CA'] },
  };
  loadData = [];
  fuelCategories: any = [
    {
      id: 1,
      name: 'Diesel',
    },
    {
      id: 2,
      name: 'DEF',
    },
    {
      id: 3,
      name: 'Scale Ticket',
    },
    {
      id: 4,
      name: 'Advance',
    },
    {
      id: 5,
      name: 'Reefer',
    },
  ];
  fuelTotal: any = 0;

  constructor(
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,
    private truckService: AppTruckService,
    private sharedService: AppSharedService,
    private shared: SharedService,
    private spinner: SpinnerService,
    public driverService: AppDriverService,
    private notification: NotificationService,
    public fuelService: AppFuelService,
    private loadService: AppLoadService
  ) {}

  public get fuelItems() {
    return (this.fuelForm.get('doc') as FormGroup).get('fuel') as FormArray;
  }

  ngOnInit(): void {
    this.createForm();
    this.getTrucks();
    this.getLoads();

    if (this.inputData.data.type === 'new') {
      this.modalTitle = 'Add Fuel';
      if (this.inputData.data.truckId) {
        this.fuelForm.patchValue({
          truckId: parseInt(this.inputData.data.truckId),
        });
      }
    } else {
      this.modalTitle = 'Edit Fuel';
      if (this.inputData.data.id) {
        this.fuelService.getFuelById(this.inputData.data.id).subscribe((res: any) => {
          this.fuelForm.patchValue({
            truckId: res.truckId,
            transactionDate: new Date(res.transactionDate),
            driverId: res.driverId,
            location: res.location,
            name: res.name,
          });

          this.driverService.getDriverData(res.driverId, 'all').subscribe(
            (driver) => {;
              this.driverData = {
                driverId: res.driverId,
                driverName: driver.firstName + ' ' + driver.lastName,
              };
            },
            () => {
              this.driverData = {
                driverId: '',
                driverName: '',
              };
            }
          );

          res.doc.fuel.map((item, indx) => {
            if (this.fuelItems.at(indx)) {
              this.fuelItems.at(indx).patchValue({
                category: item.category,
                qty: item.qty,
                price: item.price,
                subtotal: item.subtotal,
              });
            } else {
              this.addEditCategory(item);
            }
          });

          this.calculateTotal();
        });
      }
    }
  }

  public getTrucks(): void {
    this.truckService.getTrucks().subscribe((truckTabData: TruckTabData) => {
      this.truckList = truckTabData.allTrucks;
    });
  }

  public getLoads() {
    this.loadService.getDispatchData().subscribe((res: any) => {
      this.loadData = res;

      console.log('Load Data');
      console.log(this.loadData);
    });
  }

  removeCategories(indx: number) {
    this.fuelItems.removeAt(indx);
    this.calculateTotal();
  }

  createForm() {
    this.fuelForm = this.formBuilder.group({
      truckId: [null, Validators.required],
      transactionDate: [null, Validators.required],
      driverId: [null],
      location: [null, Validators.required],
      name: [null],
      doc: this.formBuilder.group({
        fuel: this.formBuilder.array([
          this.formBuilder.group({
            category: [null, Validators.required],
            qty: [null, Validators.required],
            price: [null, Validators.required],
            subtotal: [0],
          }),
        ]),
      }),
    });
  }

  public addCategory(): void {
    this.fuelItems.push(
      this.formBuilder.group({
        category: [null, Validators.required],
        qty: [null, Validators.required],
        price: [null, Validators.required],
        subtotal: [0],
      })
    );
  }

  public addEditCategory(result): void {
    this.fuelItems.push(
      this.formBuilder.group({
        category: [result.category, Validators.required],
        qty: [result.qty, Validators.required],
        price: [result.price, Validators.required],
        subtotal: [result.subtotal],
      })
    );
  }

  selectTruck(truckSelected) {
    let hasTruckId = false;
    this.loadData.map((load) => {
      if (load.truckId === truckSelected.id) {
        hasTruckId = true;
        this.driverData = load.driverName
          ? {
              driverName: load.driverName,
              driverId: load.driverId,
            }
          : { driverName: '', driverId: '' };
      }
    });

    if (!hasTruckId) {
      this.driverData = { driverName: '', driverId: '' };
    }
  }

  public onBankChange(event: any) {}

  pickupDateTimeChange(e) {
    this.fuelForm.get('fuelTime').setValue(e);
  }

  public handleAddressChange(address: any) {
    const faddress = this.shared.selectAddress(null, address);
    const final_address = `${faddress.city}, ${faddress.stateShortName} ${faddress.zipCode}`;
    this.fuelForm.get('location').setValue(final_address.trim());
  }

  pickupDateDateChange(e) {
    this.fuelForm.get('fuelDate').setValue(e);
  }

  closeModal() {
    this.activeModal.close();
  }

  saveFuel() {
    if (this.fuelForm.invalid) {
      if (!this.shared.markInvalid(this.fuelForm)) {
        return false;
      }
      return;
    }

    this.spinner.show(true);
    const fuelForm = this.fuelForm.getRawValue();
    if (this.inputData.data.type === 'new' && this.driverData.driverId !== '') {
      fuelForm.fuelItems = fuelForm.doc.fuel;
      fuelForm.fuelItems.driverId = this.driverData.driverId;
      this.fuelService.addFuel(JSON.stringify(fuelForm)).subscribe((res) => {
        this.fuelForm.reset();
        this.activeModal.close();
        this.spinner.show(false);
        this.notification.success('Fuel added successfully.', 'Success:');
      });
    } else {
      if(this.driverData.driverId){
        fuelForm.driverId = this.driverData.driverId;
        this.fuelService.editFuelById(fuelForm, this.inputData.data.id).subscribe((res) => {
          this.fuelForm.reset();
          this.activeModal.close();
          this.spinner.show(false);
          this.notification.success('Fuel updated successfully.', 'Success:');
        });
      }
    }
  }

  truckListSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.truckNumber.toLocaleLowerCase().indexOf(term) > -1;
  }

  categorySearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.name.toLocaleLowerCase().indexOf(term) > -1;
  }

  calculateSubTotalAndTotal(indx) {
    const qty = this.fuelItems.at(indx).get('qty').value
      ? this.fuelItems.at(indx).get('qty').value
      : 0;
    const price = this.fuelItems.at(indx).get('price').value
      ? this.fuelItems.at(indx).get('price').value
      : 0;
    this.fuelItems
      .at(indx)
      .get('subtotal')
      .setValue(qty * price);
    this.calculateTotal();
  }

  calculateTotal() {
    this.fuelTotal = 0;
    this.fuelItems.value.forEach((element) => {
      if (element.subtotal) {
        this.fuelTotal += element.subtotal;
      }
    });
  }
}
