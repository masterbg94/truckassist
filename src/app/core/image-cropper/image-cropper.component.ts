import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AppDriverService } from 'src/app/core/services/app-driver.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import * as AppConst from './../../const';
import { SpinnerService } from '../services/spinner.service';
// import { DriverAvatar } from '../model/driver';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html'
})
export class ImageCropperComponent implements OnInit {
  @Input() public inputData: any;
  public uploadedImageFile: any = null;
  private croppedImage: any = null;
  public files: File[] = [];
  public showDropzone = true;

  constructor(
    private activeModal: NgbActiveModal,
    private driverService: AppDriverService,
    private spinner: SpinnerService,
    private shared: SharedService,
    private notification: NotificationService
  ) {
  }

  ngOnInit() {
  }

  public saveImage(): void {
    switch (this.inputData.type) {
      /************************************************************************/
      /* CASE: Driver photo
      /************************************************************************/
      // case AppConst.DRIVER_PHOTO:
      //   const driverAvatar: DriverAvatar = {
      //     driverId: this.inputData.id,
      //     image: this.croppedImage
      //   };
      //   this.spinner.show(true);
      //   this.driverService.updateDriverAvatar(driverAvatar).subscribe(
      //     (response: any) => {
      //       if (response.status === 'ok') {
      //         this.activeModal.close();
      //         this.notification.success('Image saved.', 'Success:');
      //         this.spinner.show(false);
      //       } else {
      //         this.shared.handleServerError();
      //       }
      //     },
      //     (error: any) => {
      //       this.shared.handleServerError();
      //     }
      //   );
      //   break;
      /************************************************************************/
      /* CASE: Company large logo
      /************************************************************************/
      case AppConst.COMPANY_LARGE_LOGO:
        this.notification.warning('WIP: Edit large logo.');
        break;
      /************************************************************************/
      /* CASE: Company small logo
      /************************************************************************/
      case AppConst.COMPANY_SMALL_LOGO:
        this.notification.warning('WIP: Edit small logo.');
        break;
      default:
        return;
    }
  }

  /**
   * Close modal function
   */
  public closeModal() {
    this.activeModal.close();
  }

  /**
   * Image cropped function
   *
   * @param event ImageCroppedEvent
   */
  public imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  /**
   * Image loaded
   */
  public imageLoaded() {
  }

  /**
   * Cropper ready function
   */
  public cropperReady() {
  }

  /**
   * Load image failed function
   */
  public loadImageFailed() {
  }

  /**
   * On select function
   *
   * @param event Any
   */
  public onSelect(event: any) {
    this.showDropzone = false;
    this.files.push(...event.addedFiles);
    this.uploadedImageFile = this.files[0];
  }

  /**
   * On remove function
   */
  public onRemove() {
    this.files = [];
    this.showDropzone = true;
  }
}
