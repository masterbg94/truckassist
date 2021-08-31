import { CommunicatorHelpersService } from 'src/app/core/services/communicator-helpers.service';
import { CommunicatorService } from 'src/app/core/services/communicator.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ResizedEvent } from 'angular-resize-event';
import { CommunicatorUserDataService } from 'src/app/core/services/communicator-user-data.service';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-chat-user-info',
  templateUrl: './chat-user-info.component.html',
  styleUrls: ['./chat-user-info.component.scss'],
  animations: [
    trigger('infoShowed', [
      transition(':enter', [
        animate(
          '0.3s cubic-bezier(.35,0,.25,1)',
          keyframes([
            style({ transform: 'translateX(5%)', opacity: '0' }),
            style({ transform: 'translateX(0%)', opacity: '1' }),
          ])
        ),
      ]),
    ]),
  ],
})
export class ChatUserInfoComponent implements OnInit {
  @Input() selectedChat?: any;
  @Output() closeInfoUserBox = new EventEmitter<any>();

  attachments?: any;

  @Input() mediaData?: any[] = [];
  @Input() documentData?: any[] = [];
  @Input() othersData?: any[] = [];

  @Output() onDeleteAttachment = new EventEmitter<any>();

  filterMediaText = '';
  filterDocumentText = '';
  filterOthersText = '';

  isMediaPreview = false;
  isDocPreview = false;
  isOthersPreview = false;

  closePreviewAnimation: boolean = false;
  timeoutOfClosingPreview: any;

  mediaFilterType = ['Images', 'Videos', 'Other'];
  documentFilterType = ['PDF-Files', 'Documents', 'Spreadsheets', 'Other-Files'];

  dropDownChannelUsers: boolean = false;
  activeChatOption: number = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private communicatorService: CommunicatorService,
    private communicatorUserDataService: CommunicatorUserDataService,
    private communicatorHelpersService: CommunicatorHelpersService
  ) {}

  ngOnInit() {
    this.closePreviewAnimation = false;
    clearTimeout(this.timeoutOfClosingPreview);

    this.communicatorHelpersService.activeChannelSubchat
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        console.log("User selected")
        console.log(this.selectedChat.subchats[res])
        console.log("Subscription")
        console.log(this.getSubscriptions()[res]);
        this.activeChatOption = res;
      });
  }

  onResized(event: ResizedEvent) {
    this.communicatorUserDataService.userInfoBoxSubject.next(event.newHeight);
  }

  getUserData() {
    return this.communicatorHelpersService.getUser(this.selectedChat);
  }

  public formatTelephone(tel) {
    if (!tel) {
      return '';
    }

    const value = tel.toString().trim().replace(/^\+/, '');

    if (value.match(/[^0-9]/)) {
      return tel;
    }

    let country, city, number;

    switch (value.length) {
      case 10:
        country = 1;
        city = value.slice(0, 3);
        number = value.slice(3);
        break;

      case 11:
        country = value[0];
        city = value.slice(1, 4);
        number = value.slice(4);
        break;

      case 12:
        country = value.slice(0, 3);
        city = value.slice(3, 5);
        number = value.slice(5);
        break;

      default:
        return tel;
    }

    if (country == 1) {
      country = '';
    }

    number = number.slice(0, 3) + '-' + number.slice(3);

    return (country + ' (' + city + ') ' + number).trim();
  }

  getMediaData() {
    if (!this.filterMediaText) {
      return this.mediaData;
    } else {
      return this.mediaData.filter((data) =>
        data.name.trim().toLowerCase().includes(this.filterMediaText.trim().toLowerCase())
      );
    }
  }

  getDocumentsData() {
    if (!this.filterDocumentText) {
      return this.documentData;
    } else {
      return this.documentData.filter((data) =>
        data.name.trim().toLowerCase().includes(this.filterDocumentText.trim().toLowerCase())
      );
    }
  }

  getOthersData() {
    if (!this.filterOthersText) {
      return this.othersData;
    } else {
      return this.othersData.filter((data) =>
        data.title.trim().toLowerCase().includes(this.filterOthersText.trim().toLowerCase())
      );
    }
  }

  closeInfoUser() {
    this.closePreviewAnimation = true;
    if (this.timeoutOfClosingPreview) {
      clearTimeout(this.timeoutOfClosingPreview);
    }
    this.timeoutOfClosingPreview = setTimeout(() => {
      this.closeInfoUserBox.emit(false);
      this.communicatorUserDataService.userInfoBoxSubject.next(743);
      this.closePreviewAnimation = false;
    }, 200);
  }

  onPreview(type: string) {
    if (type === 'media') {
      this.isMediaPreview = true;
    } else if (type === 'document') {
      this.isDocPreview = true;
    } else if (type === 'other') {
      this.isOthersPreview = true;
    }
  }

  closePreview(type: string) {
    if (type === 'media') {
      this.isMediaPreview = false;
    } else if (type === 'document') {
      this.isDocPreview = false;
    } else if (type === 'other') {
      this.isOthersPreview = false;
    }
  }

  onDeleteMedia(deletedFile: any) {
    this.onDeleteAttachment.emit(deletedFile);
    this.communicatorService.editMessage(
      deletedFile.message.chat,
      deletedFile.message.id,
      deletedFile.message.content,
      [],
      [deletedFile]
    );
  }

  onExpandUser() {
    this.dropDownChannelUsers = !this.dropDownChannelUsers;
  }

  getChat() {
    let chat = this.selectedChat;
    if (chat && this.communicatorHelpersService.isDriverChannel(chat)) {
      chat = chat.subchats[this.activeChatOption];
    }
    return chat;
  }

  getSubscriptions() {
    return this.getChat()?.subscriptions;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
