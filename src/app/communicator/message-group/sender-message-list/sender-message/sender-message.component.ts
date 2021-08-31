import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommunicatorHelpersService } from 'src/app/core/services/communicator-helpers.service';
import { CommunicatorService } from 'src/app/core/services/communicator.service';

@Component({
  selector: 'app-sender-message',
  templateUrl: './sender-message.component.html',
  styleUrls: ['./sender-message.component.scss'],
})
export class SenderMessageComponent implements OnInit, OnDestroy {

  @ViewChild('messageInput', { static: false }) messageInputRef: ElementRef;
  @ViewChild('senderPosition') senderPosition: ElementRef;

  @Input() chatId?: string;
  @Input() type?: string;
  @Input() userType?: string;
  @Input() chatName?: string;

  @Input() message?: any;
  @Input() isFirst = false;
  @Input() isLast = false;

  @Output() onDelete = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onEditModeChange = new EventEmitter<boolean>();
  @Input() isChannelStatus = false;

  editMode = false;
  editMessageText = '';
  emojiVisible = false;
  attachments = [];
  deletedAttachments = [];

  timeoutOfLeavingEdit: any;

  isNotSent = false;
  private notSentTimeout?: any;

  positionOfSenderMessage?: any;

  // Channel users visible status marker
  isUsersVisible = false;

  timerOfEmoji: any;

  constructor(
    private cdref: ChangeDetectorRef,
    private communicatorService: CommunicatorService,
    private communicatorHelpersService: CommunicatorHelpersService
  ) {}

  ngOnInit() {
    if (this.message.statuses.length === 0) {
      this.notSentTimeout = setTimeout(() => {
        this.isNotSent = true;
      }, 10000);
    }
  }

  ngAfterViewChecked(): void {
    this.senderPosition.nativeElement.offsetTop > 560
      ? (this.positionOfSenderMessage = true)
      : (this.positionOfSenderMessage = false);
    this.cdref.detectChanges();
  }

  ngOnDestroy() {
    if (this.notSentTimeout) {
      clearTimeout(this.notSentTimeout);
    }

    if (this.timerOfEmoji) {
      clearTimeout(this.timerOfEmoji);
    }
  }

  deleteMessage() {
    if (this.message) {
      this.onDelete.emit(this.message);
    }
  }

  editMessage() {
    this.editMessageText = this.message.text;
    this.attachments = [...this.message.attachments];
    this.deletedAttachments = [];
    this.editMode = true;
    this.onEditModeChange.next(true);

    if (this.timerOfEmoji) {
      clearTimeout(this.timerOfEmoji);
    }
    this.timerOfEmoji = setTimeout(() => {
      this.messageInputRef.nativeElement.focus();
    }, 0);
  }

  confirmEditMessage() {
    const msg = !this.editMessageText ? null : this.editMessageText.trim();
    const addedAttachments = this.attachments.filter((item) => !item.id);
    if (this.message.text !== msg || addedAttachments || this.deletedAttachments) {
      this.onEdit.emit({
        id: this.message.id,
        text: msg,
        addedAttachments,
        deletedAttachments: this.deletedAttachments,
      });
    }
    this.closeEditMessage();
  }

  onKeyPressEnter(event) {
    this.confirmEditMessage();
  }

  onKeyPressEscape(event) {
    this.closeEditMessage();
  }

  onKeyEsc() {
    this.closeEditMessage();
  }

  leaveEmoji() {
    if (this.timerOfEmoji) {
      clearTimeout(this.timerOfEmoji);
    }
    this.timerOfEmoji = setTimeout(() => {
      this.emojiVisible = false;
    }, 800);
  }

  stayOnEmoji() {
    clearTimeout(this.timerOfEmoji);
    this.emojiVisible = true;
  }

  closeEditMessage() {
    this.editMode = false;
    this.onEditModeChange.next(false);
    this.emojiVisible = false;
    this.editMessageText = '';
    this.attachments = [];
    this.deletedAttachments = [];
  }

  addEmoji(event) {
    const emoji = event;
    const input = this.messageInputRef.nativeElement;
    input.focus();

    if (document.execCommand) {
      const event = new Event('input');
      document.execCommand('insertText', false, emoji);
      return;
    }
    const [start, end] = [input.selectionStart, input.selectionEnd];
    input.setRangeText(emoji, start, end, 'end');
  }

  // Close edit message on user mouse event (focus, hover...)
  leaveEvent() {
    if (this.timeoutOfLeavingEdit) {
      clearTimeout(this.timeoutOfLeavingEdit);
    }
    this.timeoutOfLeavingEdit = setTimeout(() => {
      this.closeEditMessage();
    }, 1000);
  }

  enterEvent() {
    clearTimeout(this.timeoutOfLeavingEdit);
  }

  getStatus() {
    if (!this.message?.id) {
      return 'sent';
    }

    const allStatuses = this.message.statuses.map((item) => item.status);
    const deliveredStatuses = allStatuses.filter((item) => item === 'delivered');
    const seenStatuses = allStatuses.filter((item) => item === 'seen');

    if (deliveredStatuses.length > 0 && seenStatuses.length === 0) {
      return 'delivered';
    }

    if (seenStatuses.length === allStatuses.length) {
      return 'full-seen';
    } else {
      return 'seen';
    }
  }

  getBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  async addAttachments(files: FileList) {
    for (let index = 0; index < files.length; index++) {
      const file = files.item(index);
      await this.addAttachment(file);
    }
  }

  async addAttachment(file: any) {
    try {
      const base64Content = await this.getBase64(file);
      const fileNameArray = file.name.split('.');
      const fileData = {
        fileName: file.name,
        base64Content,
      };
      this.attachments.push({
        id: null,
        guid: null,
        name: fileData.fileName,
        base64Content: fileData.base64Content,
        extension: fileNameArray[fileNameArray.length - 1],
      });

      this.communicatorService
        .uploadFile(this.type, this.userType, this.chatName, {
          ...fileData,
          base64Content: `${base64Content}`.split(',').splice(1, 1).join(','),
        })
        .subscribe((attachment: any) => {
          const index = this.attachments.findIndex(
            (item) => !item.guid && item.name === attachment.name
          );
          if (index !== -1) {
            this.attachments[index].url = attachment.url;
            this.attachments[index].base64Content = undefined;
            this.attachments[index].guid = attachment.guid;
          }
        });
    } catch (err) {}
  }

  async onPaste(event) {
    event.preventDefault();

    const items = (event.clipboardData || event.originalEvent.clipboardData).items;

    const images = [];
    if (items.length > 0) {
      for (const item of items) {
        if (item.type.indexOf('image') === 0) {
          images.push(item);
        }
      }
    }

    if (images.length === 0) {
      const clipboardData = event.clipboardData
        ? (event.originalEvent || event).clipboardData.getData('text/plain')
        : '';

      if (document.queryCommandSupported('insertText')) {
        document.execCommand('insertText', false, clipboardData);
      } else {
        const range = document.getSelection().getRangeAt(0);
        range.deleteContents();

        const textNode = document.createTextNode(clipboardData);
        range.insertNode(textNode);
        range.selectNodeContents(textNode);
        range.collapse(false);

        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } else {
      for (const item of images) {
        const file = item.getAsFile();
        await this.addAttachment(file);
      }
    }
  }

  deleteAttachment(attachment: any) {
    const index = this.attachments.findIndex((item) => item.guid === attachment.guid);
    if (index !== -1) {
      if (this.attachments[index].id) {
        this.deletedAttachments.push({
          ...this.attachments[index],
        });
      }
      this.attachments.splice(index, 1);
    }
  }

  isLinkMessage() {
    if(this.message.text !== null) {
      this.message.text = this.isContainUrl(this.message.text).text;
    }

    if (this.message.text?.includes('http')) {
      return true;
    }
    return false;
  }

  isContainUrl(text: string) {
      const textArray = text.split(' ');
      for (let index = 0; index < textArray.length; index++) {
        if (this.communicatorHelpersService.isUrl(textArray[index])) {
          if (!textArray[index].includes('http')) {
            textArray[index] = `http://${textArray[index]}`;
          } else {
            textArray[index] = textArray[index];
          }
        } else {
          textArray[index] = textArray[index];
        }
      }
      return {
        text: textArray.join(' '),
        array: textArray,
      };
  }

  openPageLink(text: any) {
    if (text.includes('http')) {
      window.open(text, '_blank');
    }
  }

  getSeenStatuses() {
    return this.message.statuses.filter((item) => item.status === 'seen');
  }
}
