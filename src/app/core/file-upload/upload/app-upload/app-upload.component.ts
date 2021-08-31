import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import * as AppConst from 'src/app/const';
import { SharedService } from 'src/app/core/services/shared.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from 'src/app/services/notification-service.service';
import { GalleryService } from 'src/app/core/services/gallery.service';

@Component({
  selector: 'app-app-upload',
  templateUrl: './app-upload.component.html',
})
export class AppUploadComponent implements OnInit, OnChanges {
  files: any = [];

  @Output() filesEvent = new EventEmitter<File[]>();
  @Input() clearFiles: boolean;
  @Input() multiple: boolean;
  @Input() component: string;
  @Input() attachments: any = [];
  // Special case for load modal.
  @Input() commentsVisible: boolean;

  customOptions: OwlOptions;

  loadedCount = 0;

  deletedItems = [];

  constructor(
    private sharedService: SharedService,
    private storageService: StorageService,
    private notification: NotificationService,
    private galleryService: GalleryService
  ) { }

  ngOnInit() {
    this.customOptions = {
      loop: false,
      mouseDrag: false,
      touchDrag: true,
      pullDrag: true,
      dots: false,
      margin: 8,
      autoWidth: false,
      navText: [AppConst.LEFT_NAV_ARROW, AppConst.RIGHT_NAV_ARROW],
      responsive: {
        0: {
          items: (this.component == 'repair' || this.component == 'load') ? 3 : 2,
        },
      },
      nav: true,
      lazyLoad: false,
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.clearFiles) {
      this.files = [];
    }
    if (changes.commentsVisible.previousValue == undefined) {
      this.attachments && this.attachments.forEach((element: any) => {
        const urlToObject = async () => {
          const response = await fetch(element.url);
          // here image is url/location of image
          const blob = await response.blob();
          const file: any = new File([blob], element.fileName, { type: blob.type });

          file.fileType = (file.type == 'application/pdf') ? 'pdf' : 'img';
          file.fileItemGuid = element.fileItemGuid ? element.fileItemGuid : null;
          file.url = element.url ? element.url : null;

          this.files.push(file);
          // emit frontend files
        };
        urlToObject();
      });
    }
  }

  onSelect(event: any) {
    event.addedFiles.forEach(element => {
      element.fileItemGuid = null;
      element.url = null;
    });
    this.files.push(...event.addedFiles);
    this.files.forEach((element, key) => {
      element.fileType = element.type == 'application/pdf' ? 'pdf' : 'img';
    });
    this.filesEvent.emit(this.files);
    // emit frontend files
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
    this.filesEvent.emit(this.files);
  }

  removePdf(pdf: any) {
    if (pdf.url && pdf.fileItemGuid) {
      const removedFile = [
        {
          url: pdf.url,
          guid: pdf.fileItemGuid
        }
      ];
      this.storageService.deleteFiles(removedFile).subscribe(
        (resp: any) => {
          this.notification.success('File ' + pdf.name + ' removed.', 'Success:');
          this.sharedService.emitDeleteFiles.emit(resp);
        }
      ),
      (error: HttpErrorResponse) => {
        this.sharedService.handleError(error);
      };
    }

    this.files.splice(this.files.indexOf(pdf), 1);
    this.filesEvent.emit(this.files);
  }

  openGallery(i: number, event: any) {
    if (
      event.srcElement.className == 'pagination-down' ||
      event.srcElement.className == 'pagination-up' ||
      event.srcElement.nodeName == 'path' ||
      event.srcElement.nodeName == 'svg' ||
      event.srcElement.nodeName == 'SVG-ICON'
    ) {
      return;
    }
    const files = {
      galleryItems: [],
      selectedItemIndex: i
    };
    this.attachments.forEach(file => {
      const temp = {
        extension: file.fileName.split('.').pop(),
        guid: file.fileItemGuid,
        name: file.fileName,
        url: file.url
      };
      files.galleryItems.push(temp);
    });

    this.galleryService.changeVisibility(true);
      try {
        this.galleryService.pushGalleryData(files);
      } catch (err) {
        console.error(err);
      }
  }
}
