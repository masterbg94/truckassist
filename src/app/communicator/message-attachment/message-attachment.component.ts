import { Component, Input, OnInit } from '@angular/core';
import moment from 'moment';
import { CommunicatorService } from 'src/app/core/services/communicator.service';
import { GalleryService } from 'src/app/core/services/gallery.service';
@Component({
  selector: 'app-message-attachment',
  templateUrl: './message-attachment.component.html',
  styleUrls: ['./message-attachment.component.scss']
})
export class MessageAttachmentComponent implements OnInit {

  @Input() attachment?: any;
  @Input() isReceived?: boolean;
  @Input() chatId?: string;

  hoveredWord = false;
  hoveredExcel = false;
  hoveredPdf = false;
  hoveredZip = false;
  hoveredUnknown = false;

  constructor(private galleryService: GalleryService, private communicatorService: CommunicatorService) {}

  ngOnInit(): void {
    console.log(this.attachment)
    try {
      this.attachment = {
        ...this.attachment,
        date: moment.parseZone(this.attachment.createdAt).local().format('DD/MM/YY'),
        time: moment.parseZone(this.attachment.createdAt).local().format('hh:mm')
      }
    } catch (err) {
      this.attachment = {
        ...this.attachment
      }
    }
  }

  isVideo() {
    if (!this.attachment) {
      return false;
    }
    return ['mp4', 'wav' , 'wmv', 'mov', 'flv', 'mkv', 'avi'].includes(this.attachment.extension);
  }

  isImage() {
    if (!this.attachment) {
      return false;
    }
    return ['jpeg', 'jpg', 'png'].includes(this.attachment.extension);
  }

  isDoc() {
    if (!this.attachment) {
      return false;
    }
    return ['doc', 'docx'].includes(this.attachment.extension);
  }

  isXls() {
    if (!this.attachment) {
      return false;
    }
    return ['xls', 'xlsx'].includes(this.attachment.extension);
  }

  isPdf() {
    if (!this.attachment) {
      return false;
    }
    return this.attachment.extension === 'pdf';
  }

  isZip() {
    if (!this.attachment) {
      return false;
    }
    return this.attachment.extension === 'zip';
  }

  goToLink() {
    if (this.attachment?.url) {
      window.open(this.attachment.url, '_blank');
    }
  }

  async openGallery() {
    if (this.chatId) {
      this.galleryService.changeVisibility(true);
      try {
        const media = await this.getContentAttachment(this.chatId)
        const selectedMediaIndex = media.findIndex(item => item.id === this.attachment.id)
        this.galleryService.pushGalleryData({
          galleryItems: media,
          selectedItemIndex: selectedMediaIndex !== -1 ? selectedMediaIndex : 0,
        });
      } catch (err) {
        console.error(err);
      }
    }
  }

  getContentAttachment(chatId: string) {
    return new Promise<any[]>((resolve, reject) => {
      this.communicatorService.getAttachmentsByType(chatId).subscribe((res: { status: string, data: any[] }) => {
        resolve(res.data);
      },
      (err: any) => {
        reject(err);
      });
    });
  }
}
