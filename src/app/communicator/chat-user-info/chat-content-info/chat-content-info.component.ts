import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import moment from 'moment';
import { CommunicatorService } from 'src/app/core/services/communicator.service';
import { GalleryService } from 'src/app/core/services/gallery.service';
import { CommunicatorHelpersService } from '../../../core/services/communicator-helpers.service';

@Component({
  selector: 'app-chat-content-info',
  templateUrl: './chat-content-info.component.html',
  styleUrls: ['./chat-content-info.component.scss'],
})
export class ChatContentInfoComponent implements OnInit {
  @Input() File?: any;
  @Input() chat?: any;
  @Input() isDocument?: any = false;

  @Output() deleteFile = new EventEmitter<any>();

  createdDateFile?: any;
  createdTimeFile?: any;

  openModalDelete = {
    id: 0,
    isOpen: false,
  };

  constructor(
    private galleryService: GalleryService,
    private communicatorService: CommunicatorService
  ) {}

  ngOnInit() {
    this.createdDateFile = moment.parseZone(this.File.createdAt).local().format('DD/MM/YY');
    this.createdTimeFile = moment.parseZone(this.File.createdAt).local().format('hh:mm');
  }

  isVideo() {
    if (!this.File) {
      return false;
    }
    return ['mp4', 'wav' , 'wmv', 'mov', 'flv', 'mkv', 'avi'].includes(this.File.extension);
  }

  isImage() {
    if (!this.File) {
      return false;
    }
    return ['jpeg', 'jpg', 'png'].includes(this.File.extension);
  }

  isDoc() {
    if (!this.File) {
      return false;
    }
    return ['doc', 'docx'].includes(this.File.extension);
  }

  isXls() {
    if (!this.File) {
      return false;
    }
    return ['xls', 'xlsx'].includes(this.File.extension);
  }

  isPdf() {
    if (!this.File) {
      return false;
    }
    return this.File.extension === 'pdf';
  }

  isZip() {
    if (!this.File) {
      return false;
    }
    return this.File.extension === 'zip';
  }

  isLink() {
    if (!this.File) {
      return false;
    }
    return !this.File.extension;
  }

  async openGallery() {
    if(!this.isLink() && !this.isDocument) {
      this.galleryService.changeVisibility(true);
      try {
        const media = await this.getContentAttachment(this.File.message.chat);
        const selectedMediaIndex = media.findIndex((item) => item.id === this.File.id);
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

  openDeleteModal(id: any) {
    this.openModalDelete = {
      id,
      isOpen: !this.openModalDelete.isOpen,
    };
  }

  deleteAttachment() {
    this.deleteFile.emit(this.File);
  }

  isMyAttachment() {
    return this.File.message.user?.id === this.communicatorService.getUserId();
  }

  openPage() {
    if ((this.File.url && this.isLink()) || (this.File.url && this.isDocument)) {
      const url = this.File.url.startsWith('http://') || this.File.url.startsWith('https://') ? this.File.url : `http://${this.File.url}`;
      window.open(url, '_blank');
    }
  }

}
