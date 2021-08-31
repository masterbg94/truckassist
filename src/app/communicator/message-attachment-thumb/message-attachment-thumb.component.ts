import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-message-attachment-thumb',
  templateUrl: './message-attachment-thumb.component.html',
  styleUrls: ['./message-attachment-thumb.component.scss']
})
export class MessageAttachmentThumbComponent {

  @Input() attachment?: any;

  @Output() delete = new EventEmitter<any>();


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
    return ['jpeg', 'jpg', 'png'].includes(this.attachment.extension.toLowerCase());
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

  deleteAttachment() {
    this.delete.next(this.attachment);
  }

}
