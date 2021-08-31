import { CommunicatorService } from 'src/app/core/services/communicator.service';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ResizedEvent } from 'angular-resize-event';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import moment from 'moment';
import { ChatSocket } from 'src/app/core/sockets/chat-socket.service';
import { ScrollFixDirective } from '../chat-directives/ScrollFix.directive';
import { CommunicatorUserDataService } from 'src/app/core/services/communicator-user-data.service';
import { ActivatedRoute, Router} from '@angular/router';
import { CommunicatorMessageMapperService } from 'src/app/core/services/communicator-message-mapper.service';
import { CommunicatorHelpersService } from 'src/app/core/services/communicator-helpers.service';
import { CommunicatorNotificationService } from 'src/app/core/services/communicator-notification.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.scss'],
  providers: [ChatSocket, CommunicatorService],
})

export class ChatContainerComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('inputMessage', { static: false }) inputMessageRef: ElementRef;
  @ViewChild('scrollMe') scroll: ElementRef;
  @ViewChild(ScrollFixDirective) scrollFix: any;

  @ViewChild('dropdown') dropdownRef: ElementRef;
  @ViewChild('headerUsers') headerUsersRef: ElementRef;

  @Input() selectedChat?: any;
  @Output() openInfoUserBox = new EventEmitter<any>();

  @Input() trackRoute = false

  // for chat scroll
  public isScrollable: boolean;
  public wrapperWidth: number | null;
  private elementRef: ElementRef;

  moment = moment;

  private destroy$: Subject<void> = new Subject<void>();

  activeChatOption = 0; // dispatch, safety, accounting, repair

  expandHeaderUser = false;

  showHideEmoji = false;
  timerOfEmoji: any;

  timerOfUserTyping = null;
  public focusInputMessage = false;
  message = '';
  messageGroups?: any[] = [];

  private enablePaging = true;
  private excludedMessageIds: string[] = [];
  private nextPage = 2;

  private attachments = [];
  files: any[] = [];

  @Input() throttle = 0; // miliseconds of show new message
  @Input() scrollUpDistance = 8; // 80% of whole container scroll detect
  @Input() scrollCounterDelay: any = 0;
  scrollSpinner = false;
  scrollUserID: any = null;
  scrollTimeout?: any;

  resizeInputContainer: any;

  dynamicContainerHeight = 0;

  // Channel actions
  dropDownChannel = false;
  dropDownHeaderUser = false;

  constructor(
    private communicatorService: CommunicatorService,
    private communicatorNotificationService: CommunicatorNotificationService,
    private communicatorUserDataService: CommunicatorUserDataService,
    private communicatorMessageMapperService: CommunicatorMessageMapperService,
    private communicatorHelpersService: CommunicatorHelpersService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    this.elementRef = elementRef;
    this.isScrollable = false;
    this.wrapperWidth = null;

    this.renderer.listen('window', 'click', (e: Event) => {
      if (e.target !== this.dropdownRef?.nativeElement) {
        this.dropDownChannel = false;
      }
      if (e.target !== this.headerUsersRef?.nativeElement) {
        this.expandHeaderUser = false;
      }
    });
  }

  // @HostListener('window:onpagehide', ['$event'])
  // unloadHandler() {
  //   event.preventDefault()
  //   if (this.selectedChat?.id) {
  //     let chat = this.selectedChat
  //     if(this.isDriverChannel()) {
  //       chat = this.selectedChat.subchats[this.activeChatOption]
  //     }
  //     console.log('Leave in unload:', this.selectedChat)
  //     this.communicatorService.leaveChat(chat.id)
  //   }
  // }

  ngOnInit() {

    if (!this.router.url.includes('communicator')) {
      this.dynamicContainerHeight = 743;
    }

    this.communicatorService
      .onGetMessages()
      .pipe(takeUntil(this.destroy$))
      .subscribe((messages: any[]) => {
        if (messages.length < environment.messageLimit) {
          this.enablePaging = false;
        }

        const chatId = this.communicatorHelpersService.isDriverChannel(this.selectedChat)
          ? this.selectedChat.subchats[this.activeChatOption].id
          : this.selectedChat.id;

        if (messages.length > 0) {
          if (messages[0].chat !== chatId) {
            return;
          }

          for (const message of messages) {
            this.communicatorMessageMapperService.addMessageToGroup(this.messageGroups, message);
          }
          this.communicatorMessageMapperService.shrinkMessageGroups(this.messageGroups);

          this.scrollFix.prepareFor('up');
        }

        if (this.scrollFix?.readyFor === 'up' && this.nextPage !== 2) {
          this.scrollSpinner = true;
          this.scrollTimeout = setTimeout(() => {
            this.scrollFix.restore(), (this.scrollSpinner = false);
          });
        }

        if (chatId !== this.scrollUserID && this.scrollUserID !== null) {
          clearTimeout(this.scrollTimeout);
          this.scrollCounterDelay = 0;
          this.scrollFix.reset();
          this.scrollSpinner = false;
        }

        if (this.scrollCounterDelay < 1) {
          if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
          }
          this.scrollTimeout = setTimeout(() => {
            this.scrollChat();
          }, 1100);
          this.scrollUserID = chatId;
          this.scrollCounterDelay++;
        }
      });

    this.communicatorService
      .onGetMessage()
      .pipe(takeUntil(this.destroy$))
      .subscribe((message: any) => {
        this.excludedMessageIds.push(message.id);
        if (message.user.id === this.communicatorService.getUserId()) {
          this.communicatorMessageMapperService.replaceMessageDataInGroup(
            this.messageGroups,
            message
          );
        } else {
          this.communicatorMessageMapperService.addMessageToGroup(this.messageGroups, message);
          this.changeMessageStatuses('seen');
        }
      });

    this.communicatorService
      .onMessageStatusesChanged()
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (statuses: any[]) => {
        if (this.messageGroups.length > 0) {
          this.communicatorMessageMapperService.updateMessageStatuses(this.messageGroups, statuses);
        }
      });

    this.communicatorService
      .onEditMessage()
      .pipe(takeUntil(this.destroy$))
      .subscribe((message: any) => {
        this.communicatorMessageMapperService.editMessageFromGroup(this.messageGroups, message);
      });

    this.communicatorService
      .onDeleteMessage()
      .pipe(takeUntil(this.destroy$))
      .subscribe((message: any) => {
        this.communicatorMessageMapperService.startDeleteMessageFromGroup(
          this.messageGroups,
          message
        );
        setTimeout(() => {
          this.communicatorMessageMapperService.deleteMessageFromGroup(this.messageGroups, message);
        }, 200);
      });

    this.communicatorService
      .onReactionAdded()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.communicatorMessageMapperService.addReactionToGroup(this.messageGroups, data);
      });

    this.communicatorService
      .onReactionDeleted()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.communicatorMessageMapperService.removeReactionFromGroup(this.messageGroups, data);
      });

    this.communicatorService
      .onLinksChanged()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.communicatorMessageMapperService.replaceLinksInMessageFromGroup(
          this.messageGroups,
          data.messageId,
          data.links,
          data.createdAt
        );
      });

    this.communicatorUserDataService.userInfoBoxSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (this.router.url.includes('communicator')) {
          this.dynamicContainerHeight = res;
        }
      });

    this.communicatorHelpersService.userDropBoxAttachment.pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.addAttachments(res);
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    const previousChatValue = changes.selectedChat.previousValue;
    const currentChatValue = changes.selectedChat.currentValue;

    if (!previousChatValue && !currentChatValue) {
      return;
    }

    if (previousChatValue) {
      const isPreviousDriverChannel = this.communicatorHelpersService.isDriverChannel(
        previousChatValue
      );
      const previousChatId = isPreviousDriverChannel
        ? previousChatValue.subchats[this.activeChatOption].id
        : previousChatValue.id;
      this.communicatorService.leaveMessageStatuses(previousChatId);
      this.communicatorService.leaveChat(previousChatId);
    }

    this.activeChatOption = this.trackRoute ? this.findActiveChatIndex(currentChatValue) : 0;
    this.resetToDefaultValues();

    const isCurrentDriverChannel = this.communicatorHelpersService.isDriverChannel(
      currentChatValue
    );
    const currentChatId = isCurrentDriverChannel
      ? currentChatValue.subchats[this.activeChatOption].id
      : currentChatValue.id;
    this.communicatorService.joinToChat(currentChatId);
    this.communicatorService.trackMessageStatuses(currentChatId);
    if(this.trackRoute) {
      this.communicatorHelpersService.changeRoute(this.router, currentChatValue, this.activeChatOption)
    }
  }

  // disable scroll on host component
  public disable(): void {
    this.isScrollable = false;
    this.wrapperWidth = null;
  }
  // enable scroll on host component
  public enable(): void {
    this.isScrollable = true;
    this.wrapperWidth = this.elementRef.nativeElement.childNodes[0].clientWidth;
  }

  setActiveChatOption(activeChatOption: number) {
    if (this.activeChatOption === activeChatOption) {
      return;
    }
    const chat = this.getChat();
    this.communicatorService.leaveMessageStatuses(chat.id);
    this.communicatorService.leaveChat(chat.id);

    this.activeChatOption = activeChatOption;
    this.communicatorHelpersService.getActiveChannelSubchat(this.activeChatOption);
    this.resetToDefaultValues();

    const newChat = this.getChat();

    this.communicatorService.joinToChat(newChat.id);
    this.communicatorService.trackMessageStatuses(newChat.id);
    this.communicatorNotificationService.resetUnreadMessages(newChat.id);
    if(this.trackRoute) {
      this.communicatorHelpersService.changeRoute(this.router, this.selectedChat, this.activeChatOption)
    }
  }

  findActiveChatIndex = (chat: any) => {
    const urlValues = this.router.url.split('/')
    if(urlValues.length === 5 && chat.subchats) {
      const index = chat.subchats.findIndex(item => item.id == urlValues[4])
      if (index !== -1) {
        return index
      }
    }
    return 0
  }

  getUnreadMessagesForSubchat(index: number) {
    return this.communicatorHelpersService.getMySubscriptionInChat(this.selectedChat.subchats[index])?.unreadMessages;
  }

  ngOnDestroy() {
    const chat = this.getChat();
    if (chat?.id) {
      this.communicatorService.leaveMessageStatuses(chat.id);
      this.communicatorService.leaveChat(chat.id);
    }

    this.destroy$.next();
    this.destroy$.complete();
  }

  getSubscriptions() {
    return this.getChat()?.subscriptions;
  }

  getReceiverUserLength() {
    if (this.getSubscriptions().length > 20) {
      return 54;
    }
    return this.getSubscriptions().length * 19;
  }

  getUserImage(chat: any) {
    return this.communicatorHelpersService.getUserImage(chat);
  }

  getUserStatus(chat: any) {
    return this.communicatorHelpersService.getUserStatus(chat);
  }

  getChatName() {
    return this.communicatorHelpersService.getChatName(this.selectedChat);
  }

  getIsTyping(chat: any) {
    return this.communicatorHelpersService.getIsTyping(chat);
  }

  onResizedInputContainer(event: ResizedEvent) {
    this.resizeInputContainer = event.newHeight;
  }

  sendMessage() {
    const msg = this.message ? this.message.trim() : null;
    const chat = this.getChat();

    if (chat && (msg || this.attachments.length > 0)) {
      const date = new Date();
      this.communicatorMessageMapperService.addNotSentMessageToGroup(
        this.messageGroups,
        msg,
        date,
        this.attachments
      );
      this.communicatorService.sendMessage(chat.id, msg, date, this.attachments);

      if(this.attachments.length > 0) {
        this.scrollChat(true);
      }
      else {
        this.scrollChat();
      }

      this.message = '';
      this.clearAttachmentData();

    }
    this.changeFocusInput(false);
    this.showHideEmoji = false;
    this.inputMessageRef.nativeElement.innerText = '';
  }

  addEmoji(event) {
    this.inputMessageRef.nativeElement.innerText += event;
    this.message = this.inputMessageRef.nativeElement.innerText;
  }

  leaveEmoji() {
    if (this.timerOfEmoji) {
      clearTimeout(this.timerOfEmoji);
    }
    this.timerOfEmoji = setTimeout(() => {
      this.showHideEmoji = false;
    }, 800);
  }

  stayOnEmoji() {
    clearTimeout(this.timerOfEmoji);
    this.showHideEmoji = true;
  }

  scrollChat(attachment?: any) {
    if(attachment) {
      this.scrollTimeout = setTimeout(() => {
        this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
        clearInterval(this.scrollTimeout);
      }, 2000);

    }
    else {
      this.scrollTimeout = setTimeout(() => {
        this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
        clearInterval(this.scrollTimeout);
      }, 0);
    }

  }

  goToLatestMessage() {
    $('#chat-container').animate({ scrollTop: this.scroll.nativeElement.scrollHeight }, 1000);
  }

  followChangingMessage(innerText) {
    this.message = innerText;
  }

  changeFocusInput(focus: boolean) {
    if (this.attachments.length > 0 && focus === false) {
      return;
    }
    this.focusInputMessage = focus;
    const chat = this.getChat();
    if (chat && focus) {
      this.communicatorService.sendTyping(chat.id, focus);
    }

    if (this.focusInputMessage) {
      clearTimeout(this.timerOfUserTyping);
      this.timerOfUserTyping = setTimeout(() => {
        this.communicatorService.sendTyping(chat.id, false);
      }, 3000);
    }
  }

  onKeyboardEvent(event: KeyboardEvent) {
    if (!event.shiftKey && event.key === 'Enter') {
      event.preventDefault();
      this.sendMessage();
      this.inputMessageRef.nativeElement.innerText = '';
      this.focusInputMessage = true;
    }
  }

  isUserStillTyping() {
    const chat = this.getChat();
    this.communicatorService.sendTyping(chat.id, true);
    clearTimeout(this.timerOfUserTyping);
    this.timerOfUserTyping = setTimeout(() => {
      this.communicatorService.sendTyping(chat.id, false);
    }, 3000);
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

  // onDragDropFile(files: FileList) {
  //   this.addAttachments(files);
  //   this.changeFocusInput(true);
  // }

  async addAttachments(files: any) {
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
      this.files.push({
        ...fileData,
        extension: fileNameArray[fileNameArray.length - 1],
        guid: null,
        size: file.size,
      });
      this.communicatorService
        .uploadFile(this.selectedChat.type, this.selectedChat.userType, this.selectedChat.name, {
          ...fileData,
          base64Content: `${base64Content}`.split(',').splice(1, 1).join(','),
        })
        .subscribe((attachment: any) => {
          const fileIndex = this.files.findIndex(
            (item) => item.fileName === attachment.name && !item.uploaded
          );
          if (fileIndex !== -1) {
            this.files[fileIndex].guid = attachment.guid;
            this.attachments.push({
              ...attachment,
              size: this.files[fileIndex].size,
            });
            this.scrollFix.reset();
          }
        });

    } catch (err) {
      console.error(`Can't upload ${file.name}`);
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

  onDeleteFile(file: any) {
    const fileIndex = this.files.findIndex((item) => item.guid === file.guid);
    if (fileIndex !== -1) {
      // this.communicatorService.deleteFile(this.files[fileIndex].guid).subscribe(() => {})
      this.files.splice(fileIndex, 1);
    }
  }

  private clearAttachmentData() {
    this.attachments = [];
    this.files = [];
  }

  onScrollUp() {
    const chat = this.getChat();
    if (this.enablePaging && chat) {
      this.communicatorService.loadMessages(chat.id, this.nextPage, this.excludedMessageIds);
      this.scrollSpinner = true;
      this.nextPage++;
    } else {
      this.scrollSpinner = false;
    }
  }

  private resetToDefaultValues() {
    this.expandHeaderUser = false;

    this.showHideEmoji = false;
    this.timerOfEmoji = undefined;

    this.timerOfUserTyping = null;
    this.focusInputMessage = false;
    this.message = '';
    this.messageGroups = [];

    this.enablePaging = true;
    this.excludedMessageIds = [];
    this.nextPage = 2;

    this.clearAttachmentData();

    this.throttle = 0; // miliseconds of show new message
    this.scrollUpDistance = 9.9; // 80% of whole container scroll detect
    this.scrollSpinner = false;
    this.scrollCounterDelay = 0;
    this.scrollUserID = null;
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    this.scrollTimeout = undefined;

    this.resizeInputContainer = undefined;
  }

  private changeMessageStatuses(status: string) {
    const chat = this.getChat();
    if (chat?.id) {
      this.communicatorService.changeMessageStatuses(chat.id, status);
    }
  }

  changeEditMode(editMode: boolean) {
    this.clearAttachmentData();
  }

  editMessage(message: any) {
    const chat = this.communicatorHelpersService.isDriverChannel(this.selectedChat)
      ? this.selectedChat.subchats[this.activeChatOption]
      : this.selectedChat;
    if (chat && message) {
      this.communicatorService.editMessage(
        chat.id,
        message.id,
        message.text,
        message.addedAttachments,
        message.deletedAttachments
      );
    }
  }

  deleteMessage(message: any) {
    const chat = this.getChat();
    if (chat && message) {
      this.communicatorService.deleteMessage(chat.id, message.id);
    }
  }

  openInfoBox() {
    this.openInfoUserBox.emit(true);
  }

  isDriverChannel() {
    return this.communicatorHelpersService.isDriverChannel(this.selectedChat);
  }

  isJoined() {
    if (!this.selectedChat) {
      return true;
    }
    const chat = this.getChat();
    return this.communicatorHelpersService.getMySubscriptionInChat(chat)?.joined;
  }

  isJoinedInChat(chat: any) {
    return this.communicatorHelpersService.getMySubscriptionInChat(chat)?.joined;
  }

  onClickJoin() {
    const chat = this.getChat();
    this.communicatorService.changeJoinToChatStatus(chat.id);
  }

  closeDropDown(event) {
    this.dropDownChannel = false;
  }

  onExpandUser() {
    if (this.getSubscriptions().length > 20) {
      this.expandHeaderUser = false;
      this.dropDownHeaderUser = !this.dropDownHeaderUser;
      return;
    }
    this.dropDownHeaderUser = false;
    this.expandHeaderUser = !this.expandHeaderUser;
  }

  getChat() {
    let chat = this.selectedChat;
    if (chat && this.communicatorHelpersService.isDriverChannel(chat)) {
      chat = chat.subchats[this.activeChatOption];
    }
    return chat;
  }
}
