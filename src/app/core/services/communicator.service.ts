import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChatSocket } from '../sockets/chat-socket.service';
import { CommunicatorUserDataService } from './communicator-user-data.service';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable()
export class CommunicatorService {

  private user?: any;

  constructor(private communicatorUserDataService: CommunicatorUserDataService,
              private chatSocket: ChatSocket,
              private http: HttpClient) {
    this.user = JSON.parse(localStorage.getItem('chatUser'));
    this.communicatorUserDataService.chatUser.subscribe((user?: any) => {
      const shouldRequestChatLists = !this.user && user;
      this.user = user;
      if (shouldRequestChatLists) {
        this.requestChatLists();
      }
    });
  }

  private requestChatList = (type: string, userType: string) => {
    if (this.user) {
      this.chatSocket.emit('get-chat-lists', this.user.companyId, this.user.id, type, userType);
    }
  }

  requestChatLists = () => {
    this.requestChatList('channel', 'driver');
    this.requestChatList('direct', 'driver');
    this.requestChatList('channel', 'company');
    this.requestChatList('direct', 'company');
  }

  getChats = (type: string, userType: string) => {
    return this.chatSocket.fromEvent<any[]>(`${type}-${userType}-chat-lists`);
  }

  getUserId = () => {
    return this.user.id;
  }

  joinToChat = (chatId: string) => {
    if (this.user) {
      this.chatSocket.emit('join-to-chat', chatId, this.user.id);
    }
  }

  leaveChat = (chatId: string) => {
    if (this.user) {
      return this.chatSocket.emit('leave-chat', chatId, this.user.id);
    }
  }

  resetUnreadMessages = (chatId: string) => {
    if (this.user) {
      this.chatSocket.emit('reset-unread-messages', chatId, this.user.id);
    }
  }

  onGetMessages = () => {
    return this.chatSocket.fromEvent<any[]>('messages');
  }

  sendMessage = (chatId: string, message: string, date: Date, attachments: any[]) => {
    if (this.user) {
      this.chatSocket.emit('send-message', chatId, this.user.id, message, date, attachments);
    }
  }

  onGetMessage = () => {
    return this.chatSocket.fromEvent<any>('get-message');
  }

  deleteMessage = (chatId: string, messageId: string) => {
    this.chatSocket.emit('delete-message', chatId, messageId);
  }

  onDeleteMessage = () => {
    return this.chatSocket.fromEvent<any>('message-deleted');
  }

  editMessage = (chatId: string, messageId: string, content: string, addedAttachments = [], deletedAttachments = []) => {
    this.chatSocket.emit('edit-message', chatId, messageId, content, addedAttachments, deletedAttachments);
  }

  onEditMessage = () => {
    return this.chatSocket.fromEvent<any>('message-edited');
  }

  trackTyping = () => {
    if (this.user) {
      this.chatSocket.emit('track-typing', this.user.id, this.user.companyId);
    }
  }

  leaveTyping = () => {
    if (this.user) {
      this.chatSocket.emit('leave-typing', this.user.id, this.user.companyId);
    }
  }

  sendTyping = (chatId: string, typing: boolean) => {
    if (this.user) {
      this.chatSocket.emit('typing', chatId, this.user.id, typing);
    }
  }

  onTypingChanged = () => {
    return this.chatSocket.fromEvent<any>('typing-changed');
  }

  trackMessageStatuses = (chatId: string) => {
    this.chatSocket.emit('track-message-statuses', chatId);
  }

  leaveMessageStatuses = (chatId: string) => {
    this.chatSocket.emit('leave-user-statuses', chatId);
  }

  changeMessageStatuses = (chatId: string, status: string) => {
    if (this.user && ['delivered', 'seen'].includes(status)) {
      this.chatSocket.emit('change-message-statuses', chatId, this.user.id, status);
    }
  }

  onMessageStatusesChanged = () => {
    return this.chatSocket.fromEvent<any[]>('message-statuses-changed');
  }

  toggleReaction = (messageId: string, reaction: string) => {
    if (this.user) {
      this.chatSocket.emit('message-reaction', this.user.id, messageId, reaction);
    }
  }

  onReactionAdded = () => {
    return this.chatSocket.fromEvent<any>('reaction-added');
  }

  onReactionDeleted = () => {
    return this.chatSocket.fromEvent<any>('reaction-deleted');
  }

  trackJoinToChatStatus = () => {
    if (this.user) {
      this.chatSocket.emit('track-join-status', this.user.companyId);
    }
  }

  leaveJoinToChatStatus = () => {
    if (this.user) {
      this.chatSocket.emit('leave-join-status', this.user.companyId);
    }
  }

  changeJoinToChatStatus = (chatId: string) => {
    if (this.user) {
      console.log(chatId, this.user.id);
      this.chatSocket.emit('change-join-status', chatId, this.user.id);
    }
  }

  onJoinToChatStatusChanged = () => {
    return this.chatSocket.fromEvent<any>('join-status-changed');
  }

  loadMessages = (chatId: string, page: number, excludedMessageIds: string[]) => {
    if (this.user?.id) {
      this.chatSocket.emit('load-messages', chatId, this.user.id, page, excludedMessageIds);
    }
  }

  onLinksChanged = () => {
    return this.chatSocket.fromEvent<any>('changed-links');
  }

  joinToAttachedData = (chatId: string) => {
    this.chatSocket.emit('join-to-attached-data', chatId);
  }

  leaveAttachedData = (chatId: string) => {
    this.chatSocket.emit('leave-attached-data', chatId);
  }

  requestAttachedData = (chatId: string) => {
    this.chatSocket.emit('get-attached-data', chatId);
  }

  onAttachedDataReceived = () => {
    return this.chatSocket.fromEvent<any>('attached-data');
  }

  getChatData = (chatId: string) => {
      return this.http.get<any>(`${environment.baseChatApiUrl}/company/${this.user.companyId}/chats/${chatId}`);
  }

  uploadFile = (type: string, userType: string, chatName: string, file: any) => {
    return this.http.post(
      `${environment.API_ENDPOINT}storage/chat/b64/upload`,
      {
        type,
        userType,
        name: chatName,
        files: [ file ]
      }
    ).pipe(map((res: any) => {
      const { fileItemGuid, fileName, url } = res.success[0];
      const fileNameArray = fileName.split('.');
      const formattedData = {
        guid: fileItemGuid,
        url,
        name: fileName,
        extension: fileNameArray[fileNameArray.length - 1]
      };
      return formattedData;
    }));
  }

  deleteFile = (guid: string) => {
    return this.http.delete(`${environment.API_ENDPOINT}storage/chat/${guid}`);
  }

  getAllAttachments = (chatId: string) => {
    return this.http.get<any>(`${environment.baseChatApiUrl}/company/${this.user.companyId}/chats/${chatId}/attachments`);
  }

  // gallery method
  getAttachmentsByType = (chatId: string) => {
    return this.http.get<any>(`${environment.baseChatApiUrl}/company/${this.user.companyId}/chats/${chatId}/attachments/media`);
  }

  deleteAttachment = (chatId: string, attachmentId: string) => {
    return this.http.delete<any>(`${environment.baseChatApiUrl}/company/${this.user.companyId}/chats/${chatId}/attachments/${attachmentId}`);
  }

}
