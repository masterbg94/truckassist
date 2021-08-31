import { takeUntil } from 'rxjs/operators';
import { CommunicatorUserDataService } from 'src/app/core/services/communicator-user-data.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { CommunicatorService } from '../core/services/communicator.service';
import { CommunicatorNotificationService } from '../core/services/communicator-notification.service';
import { CommunicatorUserService } from '../core/services/communicator-user.service';
import { CommunicatorHelpersService } from '../core/services/communicator-helpers.service';

@Component({
  selector: 'app-communicator',
  templateUrl: './communicator.component.html',
  styleUrls: ['./communicator.component.scss'],
})
export class CommunicatorComponent implements OnInit, OnDestroy {

  isDriverChannelOpened = true;
  isDriverDirectOpened = true;

  isCompanyChannelOpened = true;
  isCompanyDirectOpened = true;

  driverChannels?: any[] = [];
  driverDirects?: any[] = [];
  companyChannels?: any[] = [];
  companyDirects?: any[] = [];

  companyDirectsFilter: any[];
  driverDirectsFilter: any[];
  driverChannelsFilter: any[];

  private destroy$: Subject<void> = new Subject<void>();

  selectedChat?: any;

  infoUserBox: boolean = false;
  expandendSearchDirectCompany: boolean = false;
  expandendSearchDirectDriver: boolean = false;
  expandendSearchChannelTruck: boolean = false;

  private dataURLSubscription: Subscription;
  private getDataSubscription: Subscription;

  // for chat scroll
  public isScrollable: boolean;
  public wrapperWidth: number | null;
  private elementRef: ElementRef;

  // for user info component
  private attachedMedia = [];
  private attachedFiles = [];
  private attachedLinks = [];

  constructor(
    private communicatorService: CommunicatorService,
    private communicatorNotificationService: CommunicatorNotificationService,
    private communicatorUserService: CommunicatorUserService,
    private communicatorUserDataService: CommunicatorUserDataService,
    private communicatorHelpersService: CommunicatorHelpersService,
    private actRoute: ActivatedRoute,
    private router: Router,
    elementRef: ElementRef
  ) {
    this.elementRef = elementRef;
    this.isScrollable = false;
    this.wrapperWidth = null;
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

  ngOnInit() {
    this.communicatorService
      .getChats('channel', 'driver')
      .pipe(takeUntil(this.destroy$))
      .subscribe((channels: any[]) => {
        this.driverChannels = channels;
        this.driverChannelsFilter = channels;
    });

    this.communicatorService
    .getChats('direct', 'driver')
    .pipe(takeUntil(this.destroy$))
    .subscribe((directs: any[]) => {
      this.driverDirects = directs;
      this.driverDirectsFilter = directs;
    });

    this.communicatorService
    .getChats('channel', 'company')
    .pipe(takeUntil(this.destroy$))
    .subscribe((channels: any[]) => {
      this.companyChannels = channels;
    });

    this.communicatorService
      .getChats('direct', 'company')
      .pipe(takeUntil(this.destroy$))
      .subscribe((directs: any[]) => {
        this.companyDirects = directs;
        this.companyDirectsFilter = directs;
    });

    this.communicatorService.requestChatLists();

    this.communicatorNotificationService
    .onSubscriptionReset()
    .pipe(takeUntil(this.destroy$))
    .subscribe((subscription: any) => {
      if (this.selectedChat?.id === subscription.chat.id) {
        this.communicatorHelpersService.changeUnreadCountInChat(this.selectedChat, subscription);
      }
      this.communicatorHelpersService.changeUnreadCount(this.companyDirects, subscription);
      this.communicatorHelpersService.changeUnreadCount(this.driverDirects, subscription);
      this.communicatorHelpersService.changeUnreadCount(this.companyChannels, subscription);
      this.communicatorHelpersService.changeUnreadCount(this.driverChannels, subscription);
    });

    this.communicatorNotificationService
    .onUnreadSubscriptionCountChanged()
    .pipe(takeUntil(this.destroy$))
    .subscribe((subscription: any) => {
      this.increaseUnreadCount(subscription);
    });

    this.communicatorUserService
    .onUserStatusChanged()
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: { id: string; status: string; chats: any[] }) => {
      for (const chat of data.chats) {
        this.updateChatData(chat);
      }
    });

    this.communicatorService
    .onTypingChanged()
    .pipe(takeUntil(this.destroy$))
    .subscribe((subscription: any) => {
      if (subscription.chat?.id) {
        this.updateChatData(subscription.chat);
      }
    });

    this.communicatorService
    .onJoinToChatStatusChanged()
    .pipe(takeUntil(this.destroy$))
    .subscribe((subscription: any) => {
      this.updateJoined(subscription);
    });

    this.communicatorService
    .onAttachedDataReceived()
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.attachedMedia = data.media;
      this.attachedFiles = data.files;
      this.attachedLinks = data.links;
    });

    this.communicatorUserService.trackUserStatuses();
    this.communicatorService.trackTyping();
    this.communicatorNotificationService.trackUnreadSubscriptions();
    this.communicatorNotificationService.trackResetUnreadMessages();
    this.communicatorService.trackJoinToChatStatus();

    if (this.communicatorUserService.user?.status !== 'busy') {
      this.communicatorUserService.changeMyStatus('active');
    }

    if (this.actRoute.firstChild?.params) {
      this.dataURLSubscription = this.actRoute.firstChild.params.subscribe((params: Params) => {
        if (params.id && this.selectedChat?.id != params.id) {
          this.getDataSubscription = this.communicatorService
            .getChatData(params.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
              (res) => {
                this.onSelectChat(res.data);
              },
              (error) => {
                this.router.navigate(['communicator']);
              }
            );
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.communicatorUserService.user?.status !== 'busy') {
      this.communicatorUserService.changeMyStatus('online');
    }
    this.communicatorService.leaveJoinToChatStatus();
    this.communicatorUserService.leaveUserStatuses();
    this.communicatorNotificationService.untrackResetUnreadMessages();
    this.communicatorNotificationService.untrackUnreadSubscriptions();
    this.communicatorService.leaveTyping();
    this.dataURLSubscription?.unsubscribe();
    this.getDataSubscription?.unsubscribe();

    this.destroy$.next();
    this.destroy$.complete();
  }

  onSelectChat(chat: any, activeChatOption = 0) {
    if (this.selectedChat) {
      if (this.selectedChat.id === chat.id) {
        return;
      }
      this.communicatorService.leaveAttachedData(this.selectedChat.id);
      this.onClosedInfoUserBox(false);
      this.attachedMedia = [];
      this.attachedFiles = [];
      this.attachedLinks = [];
    }
    this.selectedChat = chat;
    this.resetUnreadMessages(activeChatOption);
    this.communicatorService.joinToAttachedData(this.selectedChat.id);
    this.communicatorService.requestAttachedData(this.selectedChat.id);
  }

  resetUnreadMessages(activeChatOption = 0) {
    let chatId;
    if (this.communicatorHelpersService.isDriverChannel(this.selectedChat)) {
      chatId = this.selectedChat.subchats[activeChatOption].id;
    } else {
      chatId = this.selectedChat?.id;
    }
    this.communicatorNotificationService.resetUnreadMessages(chatId);
  }

  private increaseUnreadCount(subscription: any) {
    this.communicatorHelpersService.changeUnreadCount(this.companyDirects, subscription);
    this.communicatorHelpersService.changeUnreadCount(this.driverDirects, subscription);
    this.communicatorHelpersService.changeUnreadCount(this.companyChannels, subscription);
    this.communicatorHelpersService.changeUnreadCount(this.driverChannels, subscription);
  }

  getIsTyping(chat: any) {
    return this.communicatorHelpersService.getIsTyping(chat);
  }

  private updateChatData(chat: any) {
    if (chat.type === 'channel' && chat.userType === 'driver') {
      this.communicatorHelpersService.updateChatData(this.driverChannels, chat);
    } else if (chat.type === 'channel' && chat.userType === 'company') {
      this.communicatorHelpersService.updateChatData(this.companyChannels, chat);
    } else if (chat.type === 'direct' && chat.userType === 'driver') {
      this.communicatorHelpersService.updateChatData(this.driverDirects, chat);
    } else if (chat.type === 'direct' && chat.userType === 'company') {
      this.communicatorHelpersService.updateChatData(this.companyDirects, chat);
    }
  }

  filterCompanyDirect(event) {
    if (!event) {
      this.companyDirectsFilter = this.companyDirects;
    } else {
      this.companyDirectsFilter = this.companyDirects.filter((chat) => {
        let flag = false;
        Object.values(chat.subscriptions).filter((val) => {
          if (
            Object(val).user.name.trim().toLowerCase().includes(event.toLowerCase().trim()) &&
            Object(val).user.id !== this.communicatorService.getUserId()
          ) {
            flag = true;
          }
        });
        if (flag) {
          return chat;
        }
      });
    }
  }

  filterDriverDirect(event) {
    if (!event) {
      this.driverDirectsFilter = this.driverDirects;
    } else {
      this.driverDirectsFilter = this.driverDirects.filter((chat) => {
        let flag = false;
        Object.values(chat.subscriptions).filter((val) => {
          if (
            Object(val).user.name.trim().toLowerCase().includes(event.toLowerCase().trim()) &&
            Object(val).user.id !== this.communicatorService.getUserId()
          ) {
            flag = true;
          }
        });
        if (flag) {
          return chat;
        }
      });
    }
  }

  filterDriverChannel(event) {
    if (!event) {
      this.driverChannelsFilter = this.driverChannels;
    } else {
      this.driverChannelsFilter = this.driverChannels.filter((chat) => {
        let flag = false;
        if (Object(chat).name.trim().toLowerCase().includes(event.toLowerCase().trim())) {
          flag = true;
        }

        if (flag) {
          return chat;
        }
      });
    }
  }

  hasUnreadMessages(chats: any[], type: string, userType: string) {
    return this.communicatorHelpersService.hasUnreadMessages(chats, type, userType);
  }

  onOpenInfoUserBox(event) {
      this.infoUserBox = event;
  }

  onClosedInfoUserBox(event) {
    this.infoUserBox = event;
    this.communicatorUserDataService.userInfoBoxSubject.next(743);
  }

  private updateJoined(subscription: any) {
    this.communicatorHelpersService.changeJoined(this.companyDirects, subscription);
    this.communicatorHelpersService.changeJoined(this.driverDirects, subscription);
    this.communicatorHelpersService.changeJoined(this.companyChannels, subscription);
    this.communicatorHelpersService.changeJoined(this.driverChannels, subscription);
  }

  deleteAttachment(attachment: any) {
    const mediaIndex = this.attachedMedia.findIndex((item) => item.id === attachment.id);
    if (mediaIndex !== -1) {
      this.attachedMedia.splice(mediaIndex, 1);
    }
    const fileIndex = this.attachedFiles.findIndex((item) => item.id === attachment.id);
    if (fileIndex !== -1) {
      this.attachedFiles.splice(fileIndex, 1);
    }
  }

  onExpandedChatSearch(isExpanded: boolean, type: string) {
    switch(type) {
      case 'directCompany': {
        this.expandendSearchDirectCompany = isExpanded
        break;
      }
      case 'directDriver': {
        this.expandendSearchDirectDriver = isExpanded
        break;
      }
      case 'channelTruck': {
        this.expandendSearchChannelTruck = isExpanded
        break;
      }
    }
  }
}
