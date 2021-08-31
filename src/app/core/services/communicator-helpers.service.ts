import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CommunicatorUserDataService } from './communicator-user-data.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class CommunicatorHelpersService {
  private activeChannelSubchatSubject = new BehaviorSubject<number>(0);
  private userDropBoxAttachmentSubject = new Subject<[]>();
  private user?: any;

  constructor(private communicatorUserDataService: CommunicatorUserDataService) {
    this.user = JSON.parse(localStorage.getItem('chatUser'));
    this.communicatorUserDataService.chatUser.subscribe((user?: any) => {
      this.user = user;
    });
  }

  get activeChannelSubchat(){
    return this.activeChannelSubchatSubject.asObservable();
  }

  get userDropBoxAttachment() {
    return this.userDropBoxAttachmentSubject.asObservable();
  }

  getActiveChannelSubchat(type: number){
    this.activeChannelSubchatSubject.next(type);
  }

  getMySubscriptionInChat = (chat: any) => {
    const index = chat.subscriptions.findIndex(item => item.user.id === this.user.id);
    if (index === -1) {
      return null;
    }
    return chat.subscriptions[index];
  }

  public isDriverChannel = (chat: any) => {
    return chat.type === 'channel' && chat.userType === 'driver';
  }

  hasUnreadMessages = (chats: any[], type: string, userType: string) => {
    if (chats.length === 0) {
      return false;
    }
    const unreadStats = [];
    let subscriptionCount = 0;
    if (type === 'channel' && userType === 'driver') {
      for (const chat of chats) {
        for (const subchat of chat.subchats) {
          const index = subchat.subscriptions.findIndex(item => item.user.id === this.user.id);
          if (index !== -1) {
            if (subchat.subscriptions[index].unreadMessages > 0) {
              unreadStats.push(subchat.subscriptions[index].unreadMessages);
            }
            subscriptionCount++;
          }
        }
      }
    } else {
      for (const chat of chats) {
        const index = chat.subscriptions.findIndex(item => item.user.id === this.user.id);
        if (index !== -1) {
          if (chat.subscriptions[index].unreadMessages > 0) {
            unreadStats.push(chat.subscriptions[index].unreadMessages);
          }
          subscriptionCount++;
        }
      }
    }
    return subscriptionCount !== (subscriptionCount - unreadStats.length);
  }

  updateChatData = (chats: any[], chat: any) => {
    if (this.isDriverChannel(chat)) {
      for (const c of chats) {
        const index = c.subchats.findIndex((item: any) => item.id === chat.id);
        if (index !== -1) {
          c.subchats[index] = chat;
          break;
        }
      }
    } else {
      const index = chats.findIndex((item: any) => item.id === chat.id);
      if (index !== -1) {
        chats[index] = chat;
      }
    }
  }

  getChatName = (chat: any) => {
    if (chat?.type === 'direct') {
      let chatName = '';
      chat.subscriptions.forEach((subscription: any) => {
        const { user } = subscription;
        if (user.id !== this.user.id) {
          chatName = user.name;
        }
      });
      return chatName;
    } else if (chat?.userType === 'company') {
      return `#${chat?.name}`;
    }
    return chat?.name;
  }

  getUser(chat: any) {
    let user = null;
    if (this.isDriverChannel(chat)) {
      const permissionIndex = chat.permissions.findIndex(item => item.name === 'owner');
      if (permissionIndex !== -1) {
        user = chat.permissions[permissionIndex].user;
      }
    } else {
      chat.subscriptions.forEach((subscription: any) => {
        if (subscription.user.id !== this.user.id) {
          user = subscription.user;
        }
      });
    }
    return user;
  }

  getUserImage(chat: any) {
    let image = null;
    if (this.isDriverChannel(chat)) {
      const permissionIndex = chat.permissions.findIndex(item => item.name === 'owner');
      if (permissionIndex !== -1) {
        image = chat.permissions[permissionIndex].user.image;
      }
    } else {
      chat.subscriptions.forEach((subscription: any) => {
        const { user } = subscription;
        if (user.id !== this.user.id) {
          image = user.image;
        }
      });
    }
    return image;
  }

  getUserStatus(chat: any) {
    let status = '';
    chat.subscriptions.forEach((subscription: any) => {
      const { user } = subscription;
      if (user.id !== this.user.id) {
        status = user.status;
      }
    });
    return status;
  }

  getIsTyping(chat: any) {
    let typing = false;
    chat.subscriptions.forEach((subscription: any) => {
      const { user } = subscription;
      if (user.id !== this.user.id && subscription.typing) {
        typing = subscription.typing;
      }
    });
    return typing;
  }

  changeUnreadCount = (chats: any[] = [], subscription: any) => {
    for (const chat of chats) {
      this.changeUnreadCountInChat(chat, subscription);
    }
  }

  changeUnreadCountInChat = (chat: any, subscription: any) => {
    if (chat) {
      if (chat.subchats) {
        for (const subchat of chat.subchats) {
          if (subchat.subscriptions) {
            this.changeNumberOfUnreadInSubscriptions(subchat.subscriptions, subscription);
          }
        }
      }
      if (chat.subscriptions) {
        this.changeNumberOfUnreadInSubscriptions(chat.subscriptions, subscription);
      }
    }
  }

  private changeNumberOfUnreadInSubscriptions = (subscriptions: any[] = [], subscription: any) => {
    for (const s of subscriptions) {
      if (s.id === subscription.id) {
        s.unreadMessages = subscription.unreadMessages || 0;
      }
    }
  }

  changeJoined = (chats: any[] = [], subscription: any) => {
    for (const chat of chats) {
      this.changeJoinedInChat(chat, subscription);
    }
  }

  changeJoinedInChat = (chat: any, subscription: any) => {
    if (chat) {
      if (chat.subchats) {
        for (const subchat of chat.subchats) {
          if (subchat.subscriptions) {
            this.changeJoinedInSubscriptions(subchat.subscriptions, subscription);
          }
        }
      }
      if (chat.subscriptions) {
        this.changeJoinedInSubscriptions(chat.subscriptions, subscription);
      }
    }
  }

  private changeJoinedInSubscriptions = (subscriptions: any[] = [], subscription: any) => {
    for (const s of subscriptions) {
      if (s.id === subscription.id) {
        s.joined = subscription.joined;
      }
    }
  }

  isUrl = (text: string) => {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(text);
  }

  changeRoute(router: Router, selectedChat?: any, subchatIndex = 0) {
    if(selectedChat) {
      if(this.isDriverChannel(selectedChat)) {
        console.log('ROUTE:', selectedChat)
        router.navigate([`communicator/${selectedChat.id}/subchats/${selectedChat.subchats[subchatIndex].id}`])
      } else {
        router.navigate([`communicator/${selectedChat.id}`])
      }
    }
  }

  getUserDropBoxAttachment(type: any) {
    this.userDropBoxAttachmentSubject.next(type);
  }

}
