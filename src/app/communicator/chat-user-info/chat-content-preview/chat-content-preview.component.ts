import { CommunicatorService } from './../../../core/services/communicator.service';
import { GalleryService } from './../../../core/services/gallery.service';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import moment from 'moment';
import { ResizedEvent } from 'angular-resize-event';

@Component({
  selector: 'app-chat-content-preview',
  templateUrl: './chat-content-preview.component.html',
  styleUrls: ['./chat-content-preview.component.scss'],
})
export class ChatContentPreviewComponent implements OnInit {
  @Input() mediaData?: any[] = [];
  @Input() mediaFilterType = [];
  @Input() isLink = false;

  sortFilterType: string[] = ['Newest', 'Oldest', 'AZ', 'ZA'];
  counterSortFilterType = 0;

  filterMediaData?: any[] = [];

  openFileType = false;
  openSortType = false;

  sortTypeName = 'Newest';
  fileTypeName = 'File Type';

  fileNameReset = '';

  constructor(
    private galleryService: GalleryService,
    private communicatorService: CommunicatorService
  ) {}

  ngOnInit() {
    for (const item of this.mediaData) {
      item.newFormatDate = {
        date: moment.parseZone(item.createdAt).local().format('DD/MM/YY'),
        time: moment.parseZone(item.createdAt).local().format('hh:mm'),
      };
      item.createdAt = new Date(item.createdAt);
    }
    this.filterMediaData = this.mediaData;
    this.onSortType('Newest');
    this.counterSortFilterType = 0;
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const item of changes.mediaData.currentValue) {
      item.newFormatDate = {
        date: moment.parseZone(item.createdAt).local().format('DD/MM/YY'),
        time: moment.parseZone(item.createdAt).local().format('hh:mm'),
      };
      item.createdAt = new Date(item.createdAt);
    }
    this.filterMediaData = changes.mediaData.currentValue;
  }

  sortUp() {
    this.counterSortFilterType++;

    if (this.counterSortFilterType === 4) {
      this.counterSortFilterType = 3;
      return;
    }

    this.onSortType(this.sortFilterType[this.counterSortFilterType]);
  }

  sortDown() {
    this.counterSortFilterType--;

    if (this.counterSortFilterType === -1) {
      this.counterSortFilterType = 0;
      return;
    }

    this.onSortType(this.sortFilterType[this.counterSortFilterType]);
  }

  onSortType(type: string) {
    this.sortTypeName = type;
    const sortData = this.filterMediaData;
    switch (type) {
      case 'Newest': {
        sortData.sort((a, b) => {
          return b.createdAt - a.createdAt;
        });

        this.filterMediaData = sortData;
        break;
      }
      case 'Oldest': {
        sortData.sort((a, b) => {
          return a.createdAt - b.createdAt;
        });
        this.filterMediaData = sortData;
        break;
      }
      case 'AZ': {
        this.sortTypeName = 'A to Z';
        sortData.sort((a, b) => {
          return a.name
            .replaceAll('[-+.^:,/]', ' ')
            .localeCompare(b.name.replaceAll('[-+.^:,/]', ' '), 'en', {
              ignorePunctuation: true,
              sensitivity: 'base',
            });
        });
        this.filterMediaData = sortData;
        break;
      }
      case 'ZA': {
        this.sortTypeName = 'Z to A';
        sortData.sort((a, b) => {
          console.log(b.name.replaceAll('[-+.^:,/]', ' '));
          return b.name
            .replaceAll('[-+.^:,/]', ' ')
            .localeCompare(a.name.replaceAll('[-+.^:,/]', ' '), 'en', {
              ignorePunctuation: true,
              sensitivity: 'base',
            });
        });
        this.filterMediaData = sortData;
        break;
      }
    }
    this.openSortType = false;
  }

  onFilterType(type: string) {
    switch (type) {
      case 'Images': {
        this.fileTypeName = 'Images';
        this.filterMediaData = this.mediaData.filter((data) => this.isImage(data));
        break;
      }
      case 'Videos': {
        this.fileTypeName = 'Videos';
        this.filterMediaData = this.mediaData.filter((data) => this.isVideo(data));
        break;
      }
      case 'Other': {
        this.fileTypeName = 'Other';
        this.filterMediaData = this.mediaData.filter(
          (data) => !this.isImage(data) && !this.isVideo(data)
        );
        break;
      }
      case 'Documents': {
        this.fileTypeName = 'Documents';
        this.filterMediaData = this.mediaData.filter((data) => this.isDoc(data));
        break;
      }
      case 'Spreadsheets': {
        this.fileTypeName = 'Spreadsheets';
        this.filterMediaData = this.mediaData.filter((data) => this.isXls(data));
        break;
      }
      case 'PDF-Files': {
        this.fileTypeName = 'PDF Files';
        this.filterMediaData = this.mediaData.filter((data) => this.isPdf(data));
        break;
      }
      case 'Other-Files': {
        this.fileTypeName = 'Other Files';
        this.filterMediaData = this.mediaData.filter((data) => this.isZip(data));
      }
      default: {
        this.filterMediaData = this.mediaData;
      }
    }

    if (type !== 'Show All') {
      for (let index = 0; index < this.mediaFilterType.length; index++) {
        if (this.mediaFilterType[index] === type) {
          const findPreviousIndex = this.mediaFilterType.findIndex(item => item === 'Show All')
          if(findPreviousIndex !== -1) {
            this.mediaFilterType[findPreviousIndex] = this.fileNameReset;
          }
          this.fileNameReset = type;
          this.mediaFilterType[index] = 'Show All';
        }
      }
    } else {
      this.closeFIleTypeFilter(this.fileNameReset);
    }

    this.openFileType = false;
  }

  clearFileType(fileName: string) {
    return fileName.replace('-', ' ');
  }

  onlyImageVideo() {
    let isImage = false;
    this.mediaData.forEach((data) => {
      if (['png', 'jpeg', 'jpg'].includes(data.extension)) {
        isImage = true;
      }
    });
    return isImage;
  }

  isDocuments() {
    let isDocument = false;
    this.mediaData.forEach((data) => {
      if (['doc', 'docx', 'xls', 'xlsx', 'pdf', 'zip'].includes(data.extension)) {
        isDocument = true;
      }
    });
    return isDocument;
  }

  isImage(file: any) {
    if (!file) {
      return false;
    }
    return ['jpeg', 'jpg', 'png'].includes(file.extension);
  }

  isVideo(file: any) {
    if (!file) {
      return false;
    }
    return ['mp4'].includes(file.extension);
  }

  isDoc(file: any) {
    if (!file) {
      return false;
    }
    return ['doc', 'docx'].includes(file.extension);
  }

  isXls(file: any) {
    if (!file) {
      return false;
    }
    return ['xls', 'xlsx'].includes(file.extension);
  }

  isPdf(file: any) {
    if (!file) {
      return false;
    }
    return file.extension === 'pdf';
  }

  isZip(file: any) {
    if (!file) {
      return false;
    }
    return file.extension === 'zip';
  }

  async openGallery(media: any) {
    this.galleryService.changeVisibility(true);
    try {
      const mediaa = await this.getContentAttachment(media.message.chat);
      const selectedMediaIndex = mediaa.findIndex((item) => item.id === media.id);
      this.galleryService.pushGalleryData({
        galleryItems: mediaa,
        selectedItemIndex: selectedMediaIndex !== -1 ? selectedMediaIndex : 0,
      });
    } catch (err) {
      console.error(err);
    }
  }

  getContentAttachment(chatId: string) {
    return new Promise<any[]>((resolve, reject) => {
      this.communicatorService.getAttachmentsByType(chatId).subscribe(
        (res: { status: string; data: any[] }) => {
          resolve(res.data);
        },
        (err: any) => {
          reject(err);
        }
      );
    });
  }

  renderCorrectlyNameSort(name: string) {
    if (name === 'AZ') {
      return 'A to Z';
    } else if (name === 'ZA') {
      return 'Z to A';
    } else if (name === 'Newest') {
      return 'Newest';
    } else {
      return 'Oldest';
    }
  }

  closeFIleTypeFilter(fileName: string) {
    
    this.filterMediaData = this.mediaData;
    for (let index = 0; index < this.mediaFilterType.length; index++) {
      if (this.mediaFilterType[index] === 'Show All') {
        this.mediaFilterType[index] = fileName;
      }
    }
    this.fileTypeName = 'File Type';
  }

  openLink(document: any) {
    if (document.url) {
      window.open(document.url, '_blank');
    }
  }
}
