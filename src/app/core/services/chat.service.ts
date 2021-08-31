import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { v4 as uuid } from 'uuid';

import { dummyMessageGroups } from '../../communicator/dummy-chat-data';

@Injectable({ providedIn: 'root' })
export class ChatService {

  messageGroups: any;

  private driverChannels: any[];
  private driverDirects: any[];
  private companyChannels: any[];
  private companyDirects: any[];

  driverChannelsSubject?: BehaviorSubject<any[]>;
  driverDirectsSubject?: BehaviorSubject<any[]>;
  companyChannelsSubject?: BehaviorSubject<any[]>;
  companyDirectsSubject?: BehaviorSubject<any[]>;

  constructor() {
    this.messageGroups = [...dummyMessageGroups];
    this.initMockData();
    this.driverChannelsSubject = new BehaviorSubject(this.driverChannels);
    this.driverDirectsSubject = new BehaviorSubject(this.driverDirects);
    this.companyChannelsSubject = new BehaviorSubject(this.companyChannels);
    this.companyDirectsSubject = new BehaviorSubject(this.companyDirects);
  }

  searchDriverChatLists(companySearchText: string) {
    this.driverChannelsSubject.next(this.filter(this.driverChannels, companySearchText));
    this.driverDirectsSubject.next(this.filter(this.driverDirects, companySearchText));
  }

  searchCompanyChatLists(companySearchText: string) {
    this.companyChannelsSubject.next(this.filter(this.companyChannels, companySearchText));
    this.companyDirectsSubject.next(this.filter(this.companyDirects, companySearchText));
  }

  private filter(items: any[], searchText: string) {
    if (!items) {
      return [];
    }
    searchText = searchText.trim().toLowerCase();
    if (!searchText) {
      return items;
    }
    return items.filter(item => item.name.toLowerCase().includes(searchText));
  }

  deleteMessage(messageId: string) {
    for (const messageGroup of this.messageGroups) {
      for (const item of messageGroup.data) {
        const index = item.messages.findIndex(message => message.id === messageId);
        if (index !== -1) {
          item.messages.splice(index, 1);
          if (item.messages.length === 0) {
            const itemIndex = messageGroup.data.indexOf(item);
            messageGroup.data.splice(itemIndex, 1);
            if (messageGroup.data.length === 0) {
              const groupIndex = this.messageGroups.indexOf(messageGroup);
              this.messageGroups.splice(groupIndex, 1);
            } else {
              if (messageGroup.data.length >= 2) {
                const currentData = messageGroup.data[itemIndex];
                const previousData = messageGroup.data[itemIndex - 1];
                if (currentData.receiver.id === previousData.receiver.id) {
                  previousData.messages = previousData.messages.concat(currentData.messages);
                  messageGroup.data.splice(itemIndex, 1);
                }
              }
            }
          }
          break;
        }
      }
    }
  }

  checkNewMessages() {
    const indexOfLastGroup = this.messageGroups.length - 1;
    const lastMessageGroup = this.messageGroups[indexOfLastGroup];
    const previosMessageGroup = this.messageGroups[indexOfLastGroup - 1];
    if (lastMessageGroup.isNew) {
      if (indexOfLastGroup !== 0 && previosMessageGroup.date === lastMessageGroup.date) {
        if (lastMessageGroup.data.length > 0) {
          const data = lastMessageGroup.data[0];
          const lastDataFromPreviosGroup = previosMessageGroup.data[previosMessageGroup.data.length - 1];
          if (lastDataFromPreviosGroup.receiver.id === data.receiver.id) {
            lastDataFromPreviosGroup.messages = lastDataFromPreviosGroup.messages.concat(data.messages);
          } else {
            previosMessageGroup.data.push(data);
          }
          this.messageGroups.pop();
        }
      } else {
        lastMessageGroup.isNew = false;
        for (const item of lastMessageGroup.data) {
          item.status = 'seen';
        }
      }
    }
  }

  sendMessage(messageText: string) {
    const todayDate = new Date();
    const monthNumber = todayDate.getMonth() + 1;
    const dateString = `${todayDate.getDate()}/${monthNumber < 10 ? `0${monthNumber}` : monthNumber}/${todayDate.getFullYear()}`;
    const hoursNumber = todayDate.getHours() % 12;
    const minutesNumber = todayDate.getMinutes();
    const timeString = `${hoursNumber < 10 ? `0${hoursNumber}` : hoursNumber}:${minutesNumber < 10 ? `0${minutesNumber}` : minutesNumber} ${todayDate.getHours() > 12 ? 'PM' : 'AM'}`;
    const messageGroupIndex = this.messageGroups.findIndex(messageGroup => messageGroup.date === dateString);
    if (messageGroupIndex !== -1) {
      const messageGroup = this.messageGroups[messageGroupIndex];
      const lastData = messageGroup.data[messageGroup.data.length - 1];
      if (lastData.receiver.id === 2) {
        lastData.messages.push({
          id: uuid(),
          text: messageText,
          time: timeString
        });
      } else {
        messageGroup.data.push({
          receiver: {
            id: 2,
            name: 'Clay Patterson'
          },
          status: 'sent',
          messages: [
            {
              id: uuid(),
              text: messageText,
              time: timeString
            }
          ]
        });
      }
    } else {
      this.messageGroups.push({
        id: uuid(),
        isNew: false,
        date: dateString,
        data: [
          {
            receiver: {
              id: 2,
              name: 'Clay Patterson'
            },
            status: 'sent',
            messages: [
              {
                id: uuid(),
                text: messageText,
                time: timeString
              }
            ]
          }
        ]
      });
    }
  }

  private initMockData() {

    this.driverChannels = [
      { name: '#123654', unreadedMessages: 1 },
      { name: '#5622', unreadedMessages: 15 },
      { name: '#222655', unreadedMessages: 0 },
      { name: '#29967', unreadedMessages: 0 },
      { name: '#325669', unreadedMessages: 0 }
    ];

    this.driverDirects = [
      { name: 'Clay Patterson', status: 'active', unreadedMessages: 13 },
      { name: 'Shah Whitehouse', status: 'active', unreadedMessages: 4 },
      { name: 'Leonardo Cotton', status: 'dispatched', unreadedMessages: 0 },
      { name: 'Alister Storey', status: 'dead-heading', unreadedMessages: 0 },
      { name: 'Marius Whitmore', status: 'empty', unreadedMessages: 0 },
    ];

    this.companyChannels = [
      { name: 'Safety', unreadedMessages: 18 },
      { name: 'Dispatch', unreadedMessages: 3 },
      { name: 'Accounting', unreadedMessages: 0 },
      { name: 'General', unreadedMessages: 0 }
    ];

    this.companyDirects = [
      {
        name: 'Clay Patterson',
        status: 'active',
        unreadedMessages: 1,
        image: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Lueg_im_SWR1_Studio.jpg'
      },
      {
        name: 'Shah Whitehouse',
        status: 'active',
        unreadedMessages: 11,
        image: 'https://static.toiimg.com/photo/msid-77965239/77965239.jpg?pl=1189319'
      },
      {
        name: 'Leonardo Cotton',
        status: 'dispatched',
        unreadedMessages: 0,
        image: 'https://i.pinimg.com/originals/78/4d/86/784d86ebc0b04cdc04bc3b1f79b94455.jpg'
      },
      {
        name: 'Alister Storey',
        status: 'dead-heading',
        unreadedMessages: 0,
        image: 'https://i.pinimg.com/originals/78/4d/86/784d86ebc0b04cdc04bc3b1f79b94455.jpg'
      },
      {
        name: 'Marius Whitmore',
        status: 'empty',
        unreadedMessages: 0,
        image: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Lueg_im_SWR1_Studio.jpg'
      }
    ];

  }

}
