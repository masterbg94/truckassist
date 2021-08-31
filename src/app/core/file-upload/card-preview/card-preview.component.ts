import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SlidesOutputData, OwlOptions } from 'ngx-owl-carousel-o';
import * as AppConst from 'src/app/const';
import { SharedService } from 'src/app/core/services/shared.service';
import { trigger, transition, animate, style } from '@angular/animations';
import { GalleryService } from '../../services/gallery.service';

@Component({
  selector: 'app-card-preview',
  templateUrl: './card-preview.component.html',
  styleUrls: ['./card-preview.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(
        ':enter',
        [
          style({ height: 0, opacity: 0 }),
          animate('0.1s ease-out',
                  style({ height: 208, opacity: 1 }))
        ]
      ),
      transition(
        ':leave',
        [
          style({ height: 208, opacity: 1 }),
          animate('0.1s ease-in',
            style({ height: 0, opacity: 0 }))
        ]
      )
    ])
  ]
})

export class CardPreviewComponent implements OnInit {
  files: any = [];
  activeSlides: SlidesOutputData;

  @Output() filesEvent = new EventEmitter<File[]>();
  @Output() noSanitizedFiles = new EventEmitter<boolean>();
  @Input() attachments: any = [];
  @Input() visible: boolean;
  @Input() component: string;

  sanitizedAttachments: any = [];

  customOptions: OwlOptions;

  loadedCount = 0;

  constructor(
    private sharedService: SharedService,
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
          items: this.component == 'todo' ? 3 : 1,
        },
      },
      nav: true,
      lazyLoad: false
    };

    this.attachments.forEach(file => {
      if (this.sharedService.fileSanityCheck(file.url)) {
        this.sanitizedAttachments.push(file)
      }
    });
    if (this.sanitizedAttachments.length == 0) {
      this.noSanitizedFiles.emit(true);
    } else {
      this.noSanitizedFiles.emit(false);
    }
    this.sanitizedAttachments && this.sanitizedAttachments.forEach((element: any) => {
      const urlToObject = async () => {
        const response = await fetch(element.url);
        // here image is url/location of image
        const blob = await response.blob();
        const file: any = new File([blob], element.fileName, { type: blob.type });
        file.fileType = (file.type == 'application/pdf') ? 'pdf' : 'img';
        this.files.push(file);
        // emit frontend files
      };
      urlToObject();
    });

    this.sharedService.emitGalleryDelete.subscribe(
      (resp: any) => {
        this.files = [];
        this.sanitizedAttachments = this.sanitizedAttachments.filter(item => item.url !== resp.url);
        if (this.sanitizedAttachments.length == 0) {
          this.noSanitizedFiles.emit(true);
        } else {
          this.noSanitizedFiles.emit(false);
        }
        this.sanitizedAttachments && this.sanitizedAttachments.forEach((element: any) => {
        const urlToObject = async () => {
          const response = await fetch(element.url);
          // here image is url/location of image
          const blob = await response.blob();
          const file: any = new File([blob], element.fileName, { type: blob.type });
          file.fileType = (file.type == 'application/pdf') ? 'pdf' : 'img';
          this.files.push(file);
          // emit frontend files
        };
        urlToObject();
      });
      }
    )
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
    this.sanitizedAttachments.forEach(file => {
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
