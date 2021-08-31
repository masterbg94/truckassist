import { takeUntil } from 'rxjs/operators';
import { CommunicatorUserDataService } from 'src/app/core/services/communicator-user-data.service';
import { CommunicatorService } from 'src/app/core/services/communicator.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { CommunicatorUserService } from '../core/services/communicator-user.service';
import { CommunicatorNotificationService } from '../core/services/communicator-notification.service';
import { CommunicatorHelpersService } from '../core/services/communicator-helpers.service';

@Component({
  selector: 'app-communicator-mini',
  templateUrl: './communicator-mini.component.html',
  styleUrls: ['./communicator-mini.component.scss'],
})
export class CommunicatorMiniComponent implements OnInit, OnDestroy {
  isDriverChannelOpened = false;
  isDriverDirectOpened = false;
  isCompanyChannelOpened = true;
  isCompanyDirectOpened = true;

  driverChannels?: any[] = [];
  driverDirects?: any[] = [];
  companyChannels?: any[] = [];
  companyDirects?: any[] = [];

  companyDirectsFilter: any[];
  driverDirectsFilter: any[];
  driverChannelsFilter: any[];

  openSearch = false;

  private destroy$: Subject<void> = new Subject<void>();

  selectedChatLeft?: any;
  selectedChatRight?: any;

  constructor(
    private communicatorService: CommunicatorService,
    private communicatorUserService: CommunicatorUserService,
    private communicatorNotificationService: CommunicatorNotificationService,
    private communicatorHelpersService: CommunicatorHelpersService,
    public router: Router
  ) {}

  ngOnInit() {
    this.communicatorService.getChats('channel', 'driver')
    .pipe(takeUntil(this.destroy$))
    .subscribe((channels: any[]) => {
      this.driverChannels = channels;
      this.driverChannelsFilter = channels;
    });

    this.communicatorService.getChats('direct', 'driver')
    .pipe(takeUntil(this.destroy$))
    .subscribe((directs: any[]) => {
      this.driverDirects = directs;
      this.driverDirectsFilter = directs;
    });

    this.communicatorService.getChats('channel', 'company')
    .pipe(takeUntil(this.destroy$))
    .subscribe((channels: any[]) => {
      this.companyChannels = channels;
    });
    
    this.communicatorService.getChats('direct', 'company')
    .pipe(takeUntil(this.destroy$))
    .subscribe((directs: any[]) => {
      this.companyDirects = directs;
      this.companyDirectsFilter = directs;
    });

    this.communicatorUserService
      .onUserStatusChanged()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: { id: string; status: string; chats: any[] }) => {
        for (const chat of data.chats) {
          this.updateChatData(chat);
        }
      });

    this.communicatorNotificationService
      .onUnreadSubscriptionCountChanged()
      .pipe(takeUntil(this.destroy$))
      .subscribe((subscription: any) => {
        this.increaseUnreadCount(subscription);
    });

    this.communicatorNotificationService.onSubscriptionReset()
    .pipe(takeUntil(this.destroy$))
    .subscribe((subscription: any) => {
      if (this.selectedChatLeft?.id === subscription.chat.id) {
        this.communicatorHelpersService.changeUnreadCountInChat(
          this.selectedChatLeft,
          subscription
        );
      } else if (this.selectedChatRight?.id === subscription.chat.id) {
        this.communicatorHelpersService.changeUnreadCountInChat(
          this.selectedChatRight,
          subscription
        );
      }
      this.communicatorHelpersService.changeUnreadCount(this.companyDirects, subscription);
      this.communicatorHelpersService.changeUnreadCount(this.driverDirects, subscription);
      this.communicatorHelpersService.changeUnreadCount(this.companyChannels, subscription);
      this.communicatorHelpersService.changeUnreadCount(this.driverChannels, subscription);
    });

    this.communicatorService.onTypingChanged()
    .pipe(takeUntil(this.destroy$))
    .subscribe((subscription: any) => {
      if (subscription.chat?.id) {
        this.updateChatData(subscription.chat);
      }
    });

    this.communicatorService.onJoinToChatStatusChanged()
    .pipe(takeUntil(this.destroy$))
    .subscribe((subscription: any) => {
      this.updateJoined(subscription);
    });

    this.communicatorService.requestChatLists();
    this.communicatorUserService.trackUserStatuses();
    this.communicatorNotificationService.trackUnreadSubscriptions();
    this.communicatorNotificationService.trackResetUnreadMessages();
    this.communicatorService.trackTyping();
    this.communicatorService.trackJoinToChatStatus();
  }

  ngOnDestroy() {
    this.communicatorService.leaveJoinToChatStatus();
    this.communicatorService.leaveTyping();
    this.communicatorNotificationService.untrackResetUnreadMessages();
    this.communicatorNotificationService.untrackUnreadSubscriptions();
    this.communicatorUserService.leaveUserStatuses();
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSelectLeftChat(chat: any) {
    if (this.selectedChatLeft) {
      if (this.selectedChatLeft.id === chat.id) {
        return;
      }
    }
    this.selectedChatLeft = chat;
    this.resetUnreadMessages(true);
  }

  onSelectRightChat(chat: any) {
    if (this.selectedChatRight) {
      if (this.selectedChatRight.id === chat.id) {
        return;
      }
    }
    this.selectedChatRight = chat;
    this.resetUnreadMessages(false);
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
            Object(val).user.id !== JSON.parse(localStorage.getItem('chatUser')).id
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
  // subscription nije moj i sadrzi to ime da vratim chat
  filterDriverDirect(event) {
    if (!event) {
      this.driverDirectsFilter = this.driverDirects;
    } else {
      this.driverDirectsFilter = this.driverDirects.filter((chat) => {
        let flag = false;
        Object.values(chat.subscriptions).filter((val) => {
          if (
            Object(val).user.name.trim().toLowerCase().includes(event.toLowerCase().trim()) &&
            Object(val).user.id !== JSON.parse(localStorage.getItem('chatUser')).id
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

  openSidebar() {
    document.getElementById('mini-chat').classList.toggle('opened');
    document.getElementById('mini-chat-toggle').classList.toggle('opened');
  }

  onExpandChatSection(type: string, userType: string) {
    if (type === 'direct') {
      // handle direct opening
      if (userType === 'company') {
        this.isCompanyDirectOpened = true;
        this.isDriverDirectOpened = false;
      } else {
        this.isCompanyDirectOpened = false;
        this.isDriverDirectOpened = true;
      }
    } else {
      // handle channel opening
      if (userType === 'company') {
        this.isCompanyChannelOpened = true;
        this.isDriverChannelOpened = false;
      } else {
        this.isCompanyChannelOpened = false;
        this.isDriverChannelOpened = true;
      }
    }
  }

  getDirects() {
    if (this.isCompanyDirectOpened && !this.isDriverDirectOpened) {
      // return this.companyDirects
      return this.companyDirectsFilter;
    }
    return this.driverDirectsFilter;
  }

  getChannels() {
    if (this.isCompanyChannelOpened && !this.isDriverChannelOpened) {
      return this.companyChannels;
    }
    return this.driverChannelsFilter;
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

  private increaseUnreadCount(subscription: any) {
    this.communicatorHelpersService.changeUnreadCount(this.companyDirects, subscription);
    this.communicatorHelpersService.changeUnreadCount(this.driverDirects, subscription);
    this.communicatorHelpersService.changeUnreadCount(this.companyChannels, subscription);
    this.communicatorHelpersService.changeUnreadCount(this.driverChannels, subscription);
  }

  private resetUnreadMessages(isLeft: boolean) {
    let chatId;
    const chat = isLeft ? this.selectedChatLeft : this.selectedChatRight;
    if (this.communicatorHelpersService.isDriverChannel(chat)) {
      chatId = chat.subchats[0].id;
    } else {
      chatId = chat.id;
    }
    this.communicatorNotificationService.resetUnreadMessages(chatId);
  }

  getIsTyping(chat: any) {
    return this.communicatorHelpersService.getIsTyping(chat);
  }

  private updateJoined(subscription: any) {
    this.communicatorHelpersService.changeJoined(this.companyDirects, subscription);
    this.communicatorHelpersService.changeJoined(this.driverDirects, subscription);
    this.communicatorHelpersService.changeJoined(this.companyChannels, subscription);
    this.communicatorHelpersService.changeJoined(this.driverChannels, subscription);
  }
}
