import { Injectable, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification-service.service';
import { AppSharedService } from 'src/app/core/services/app-shared.service';
import { SpinnerService } from './spinner.service';
import { Address } from '../model/address';
import { Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  public emitTruckTypeAdd: EventEmitter<boolean> = new EventEmitter();
  public emitTruckMakeAdd: EventEmitter<boolean> = new EventEmitter();
  public emitColorAdd: EventEmitter<boolean> = new EventEmitter();
  public emitOwnerAdd: EventEmitter<boolean> = new EventEmitter();
  public emitOwnerDelete: EventEmitter<boolean> = new EventEmitter();
  public emitDriverToggle: EventEmitter<any> = new EventEmitter();
  public emitTruckToggle: EventEmitter<any> = new EventEmitter();
  public emitTrailerToggle: EventEmitter<any> = new EventEmitter();
  public emitPdfFile: EventEmitter<any> = new EventEmitter();
  public emitTogglePdf: EventEmitter<boolean> = new EventEmitter();
  public emitFrontendFiles: EventEmitter<any> = new EventEmitter();
  public emitFrontendPreview: EventEmitter<any> = new EventEmitter();
  public emitFrontendPageNum: EventEmitter<any> = new EventEmitter();
  public emitBackendFiles: EventEmitter<any> = new EventEmitter();
  public emitBackendPreview: EventEmitter<any> = new EventEmitter();
  public emitBackendPageNum: EventEmitter<any> = new EventEmitter();
  public emitSlideLeft: EventEmitter<boolean> = new EventEmitter();
  public emitSlideRight: EventEmitter<boolean> = new EventEmitter();
  public emitCloseNote: EventEmitter<boolean> = new EventEmitter();
  public emitAllNoteOpened: EventEmitter<boolean> = new EventEmitter();
  public emitOpenNote: EventEmitter<boolean> = new EventEmitter();
  public emitCloseModal: EventEmitter<boolean> = new EventEmitter();
  public emitFixedHeader: EventEmitter<boolean> = new EventEmitter();
  public emitShipperChange: EventEmitter<boolean> = new EventEmitter();
  public emitShipperClose: EventEmitter<boolean> = new EventEmitter();
  public emitOwnerStatus: EventEmitter<string> = new EventEmitter();
  public emitDeleteAction: EventEmitter<any> = new EventEmitter();
  public emitMagicLine: EventEmitter<boolean> = new EventEmitter();
  public emitAccountingChange: EventEmitter<boolean> = new EventEmitter();
  public emitStatusUpdate: EventEmitter<any> = new EventEmitter();
  public emitSortStatusUpdate: EventEmitter<any> = new EventEmitter();
  public emitAddItemAnimationAction: EventEmitter<number> = new EventEmitter();
  public emitDeleteItemAnimationAction: EventEmitter<any[]> = new EventEmitter();
  public emitUpdateStatusAnimationAction: EventEmitter<any[]> = new EventEmitter();
  public emitUpdateNoteActiveList: EventEmitter<any[]> = new EventEmitter();
  public emitGetDocuments: EventEmitter<any[]> = new EventEmitter();
  public emitDeleteFiles: EventEmitter<any[]> = new EventEmitter();
  public emitGalleryDelete: EventEmitter<any[]> = new EventEmitter();

  constructor(
    private notification: NotificationService,
    private sharedService: AppSharedService,
    private spinner: SpinnerService
  ) {}

  private notify = new Subject<any>();
  notifyObservable$ = this.notify.asObservable();

  public notifyOther(data: any) {
    if (data) {
      this.notify.next(data);
    }
  }

  /**
   * Marks all controls in a form group as touched
   *
   * @param formGroup FormGroup - The form group to touch
   */
  public markInvalid(formGroup: FormGroup) {
    this.spinner.show(true);
    if (formGroup.invalid) {
      (Object as any).values(formGroup.controls).forEach((control: any) => {
        control.markAsTouched();
        if (control.controls) {
          this.markInvalid(control);
        }
      });
      this.notification.warning('Please fill all required fields.', 'Warning:');
      this.spinner.show(false);
      return false;
    } else {
      (Object as any).values(formGroup.controls).forEach((control: any) => {
        control.markAsTouched();
        if (control.controls) {
          this.markInvalid(control);
        }
      });
      return true;
    }
  }

  public touchFormFields(formGroup: FormGroup) {
    (Object as any).values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();
    });
  }

  /**
   * It handles server error.
   */
  public handleServerError() {
    this.notification.error('Something went wrong. Please try again.', 'Error:');
    this.spinner.show(false);
  }

  /**
   * It handles  error.
   */
  public handleError(error?: HttpErrorResponse) {
    const message =
      error && error.error && error.error.message
        ? error.error.message
        : 'Something went wrong. Please try again.';
    this.notification.error(message, 'Error:');
    this.spinner.show(false);
  }

  /**
   * It returns object for given id.
   */
  public getItemById(arr: any, id: any) {
    if (arr !== undefined) {
      let temp = {};
      temp = arr.filter((item: any) => item.id === id);
      return temp[0];
    } else {
      return;
    }
  }

  /**
   * It returns object for given text.
   */
  public getItemByText(arr: any, text: any) {
    let temp = {};
    temp = arr.filter((item: any) => item.text === text);
    return temp[0];
  }

  /**
   * Get key by id function
   *
   * @param obj Any
   * @param id Any
   */
  public getKeyById(obj: any, id: any) {
    return Object.keys(obj).find((key) => obj[key].id === id);
  }

  /**
   * It handles input values.
   */
  public handleInputValues(form: any, data: any) {
    Object.keys(data).forEach((key1: any) => {
      Object.keys(form.controls).forEach((key2: any) => {
        if (key1 == key2) {
          const control = form.controls[key2];

          control.valueChanges.subscribe(() => {
            if (control.value !== undefined && control.value !== null && control.value !== '') {
              switch (data[key1]) {
                // First letter capitalized
                case 'capitalize':
                  const firstLetter = control.value.slice(0, 1);
                  const newValue =
                    firstLetter.toUpperCase() +
                    control.value.slice(1, control.value.length).toLowerCase();
                  control.patchValue(newValue, { emitEvent: false });
                  break;

                // lowercased and uppercases with first letter capitalized
                case 'nameInput':
                  const firstC = control.value.slice(0, 1);
                  const newName =
                    firstC.toUpperCase() + control.value.slice(1, control.value.length);
                  control.patchValue(newName, { emitEvent: false });
                  break;

                // All letters lowercased
                case 'lower':
                  control.patchValue(control.value.toLowerCase(), { emitEvent: false });
                  break;

                // All letters uppercases
                case 'upper':
                  control.patchValue(control.value.toUpperCase(), { emitEvent: false });
                  break;

                default:
                  break;
              }
            }
          });
        }
      });
    });
  }

  public toggleModalHeight(visible: boolean) {
    let modalHeight = $('.modal-body').outerHeight(false);
    modalHeight = visible ? modalHeight + 220 : modalHeight - 220;
    $('.modal-body').css('height', modalHeight);
  }

  public selectAddress(form: FormGroup, address: any) {
    const ret: Address = {
      address: address.formatted_address,
      streetNumber: this.retriveAddressComponents(address.address_components, 'street_number', 'long_name'),
      streetName: this.retriveAddressComponents(address.address_components, 'route', 'long_name'),
      city: this.retriveAddressComponents(address.address_components, 'locality', 'long_name'),
      state: this.retriveAddressComponents(
        address.address_components,
        'administrative_area_level_1',
        'long_name'
      ),
      stateShortName: this.retriveAddressComponents(
        address.address_components,
        'administrative_area_level_1',
        'short_name'
      ),
      country: this.retriveAddressComponents(address.address_components, 'country', 'short_name'),
      zipCode: this.retriveAddressComponents(
        address.address_components,
        'postal_code',
        'long_name'
      ),
    };
    return ret;
  }

  public retriveAddressComponents(addressArray: any, type: string, name: string) {
    if (!addressArray) { return ''; }
    const res = addressArray.find((addressComponents: any) => addressComponents.types[0] === type);
    if (res !== undefined) {
      return res[name];
    } else {
      return '';
    }
  }

  public saveCompany(saveData: any) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const id = currentUser.companyId;
    this.sharedService.updateCompany(saveData, id).subscribe(
      (result: any) => {
        this.spinner.show(false);
        this.notification.success(`Company ${saveData.name} updated!`, 'Success:');
        this.sharedService.emitTab.emit(0);
        this.emitCloseModal.emit();
      },
      (error: any) => {
        this.handleServerError();
      }
    );
  }

  public saveDivisionCompany(saveData: any, id: number) {
    this.sharedService.updateCompany(saveData, id).subscribe(
      (result: any) => {
        this.spinner.show(false);
        this.notification.success(`Company ${saveData.name} updated!`, 'Success:');
        this.sharedService.emitTab.emit(0);
        this.emitCloseModal.emit();
      },
      (error: any) => {
        this.handleServerError();
      }
    );
  }

  public manageInputValidation(formElement: any) {
    if (formElement.touched && formElement.valid) {
      return 'touched-valid';
    }
    if (formElement.touched && formElement.invalid) {
      return 'touched-invalid';
    }
    if (formElement.pristine && formElement.valid) {
      return 'untouched-valid';
    }
    if (formElement.pristine && formElement.invalid) {
      return 'untouched-invalid';
    }
  }

  /**
   * It handles switch between tabs and class name loss for truck, trailer type, bank, color.
   */
  handleMultiTabForms(form: any) {
    setTimeout(() => {
      // Truck and trailer type handler.
    if (form.type !== undefined && form.type !== null) {
      document.getElementById((form.type.type == 'truck') ? ('truck-type-dropdown') : ('trailer-type-dropdown')).classList.add(form.type.class);
    }

    // Colors dropdown handler.
    if (form.color !== undefined && form.color !== null) {
      document.getElementById('colors-dropdown').classList.add(form.color.key.replace(' ', '-').toLowerCase());
    }
    });
  }

  /**
   * It checkes files and returnes array with new files.
   * @param files any
   */
  getNewFiles(files: any) {
    return files.filter((item: any) => item.url == null);
  }


  fileSanityCheck(fileUrl: string) {
    const http = new XMLHttpRequest();
    http.open('HEAD', fileUrl, false);
    http.send();
    return http.status != 404;
  }
}
