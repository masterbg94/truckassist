import { Injectable } from '@angular/core';
import { CommunicatorUserDataService } from './communicator-user-data.service';
import _ from 'lodash';
import moment from 'moment';
import { v4 as uuid } from 'uuid';

@Injectable({ providedIn: 'root' })
export class CommunicatorMessageMapperService {

  private user?: any;

  constructor(private communicatorUserDataService: CommunicatorUserDataService) {
    this.user = JSON.parse(localStorage.getItem('chatUser'));
    this.communicatorUserDataService.chatUser.subscribe((user?: any) => {
      this.user = user;
    });
  }

  private formatReactionGroups = (reactions: any[]) => {
    const reactionGroups = [];
    for (const reaction of reactions) {
      const reactionGroupIndex = reactionGroups.findIndex(item => item.type === reaction.type);
      if (reactionGroupIndex !== -1) {
        reactionGroups[reactionGroupIndex].users.push({
          reactionId: reaction.id,
          user: reaction.user
        });
      } else {
        reactionGroups.push({
          type: reaction.type,
          users: [
            {
              reactionId: reaction.id,
              user: reaction.user
            }
          ]
        });
      }
    }
    return reactionGroups;
  }

  private formatMessageStatuses = (messageStatuses: any) => {
    const formattedStatuses = [];
    for (const status of messageStatuses) {
      formattedStatuses.push({
        id: status.id,
        status: status.status,
        user: {
          id: status.user.id,
          name: status.user.name,
          image: status.user.image,
          active: status.user.active
        }
      });
    }
    return formattedStatuses;
  }

  updateMessageStatuses = (messageGroups: any[], statuses: any[]) => {
    for (const status of statuses) {
      const date = moment.parseZone(status.message.createdAt).local().format('DD/MM/YYYY');
      const messageGroupIndex = messageGroups.findIndex(item => item.date === date);
      if (messageGroupIndex !== -1) {
        for (const data of messageGroups[messageGroupIndex].data) {
          const messageIndex = data.messages.findIndex(item => item.id === status.message.id);
          if (messageIndex !== -1) {
            const statusIndex = data.messages[messageIndex].statuses.findIndex(item => item.id === status.id);
            if (statusIndex !== -1) {
              data.messages[messageIndex].statuses[statusIndex].status = status.status;
            }
          }
        }
      }
    }
  }

  addReactionToGroup = (messageGroups: any[], reaction: any) => {
    const date = moment.parseZone(reaction.message.createdAt).local().format('DD/MM/YYYY');
    const messageGroupIndex = messageGroups.findIndex(item => item.date === date);
    if (messageGroupIndex !== -1) {
      for (const data of messageGroups[messageGroupIndex].data) {
        for (const message of data.messages) {
          if (message.id === reaction.message.id) {
            const reactionGroupIndex = message.reactionGroups.findIndex(item => item.type === reaction.type);
            if (reactionGroupIndex !== -1) {
              message.reactionGroups[reactionGroupIndex].users.push({
                reactionId: reaction.id,
                user: reaction.user
              });
            } else {
              message.reactionGroups.push({
                type: reaction.type,
                users: [
                  {
                    reactionId: reaction.id,
                    user: reaction.user
                  }
                ]
              });
            }
            return;
          }
        }
      }
    }
  }

  removeReactionFromGroup = (messageGroups: any[], reaction: any) => {
    const date = moment.parseZone(reaction.message.createdAt).local().format('DD/MM/YYYY');
    const messageGroupIndex = messageGroups.findIndex(item => item.date === date);
    if (messageGroupIndex !== -1) {
      for (const data of messageGroups[messageGroupIndex].data) {
        for (const message of data.messages) {
          if (message.id === reaction.message.id) {
            const reactionGroupIndex = message.reactionGroups.findIndex(item => item.type === reaction.type);
            if (reactionGroupIndex !== -1) {
              if (message.reactionGroups[reactionGroupIndex].users.length === 1) {
                message.reactionGroups.splice(reactionGroupIndex, 1);
              } else {
                const reactionIndex = message.reactionGroups[reactionGroupIndex].users.findIndex(item => item.reactionId === reaction.id);
                if (reactionIndex !== -1) {
                  message.reactionGroups[reactionGroupIndex].users.splice(reactionIndex, 1);
                }
              }
            }
          }
        }
      }
    }
  }

  addNotSentMessageToGroup = (messageGroups: any[], message: string, createdAt: Date, attachments: any[]) => {
    if (this.user?.id) {
      this.addMessageToGroup(messageGroups, {
        id: null,
        content: message,
        user: {
          id: this.user.id,
          name: this.user.name,
          image: this.user.image,
          active: this.user.active
        },
        reactions: [],
        statuses: [],
        attachments,
        links: [],
        createdAt,
        updatedAt: createdAt
      });
    }
  }

  replaceMessageDataInGroup = (messageGroups: any[], message: any) => {
    const date = moment.parseZone(message.createdAt).local().format('DD/MM/YYYY'); // 20/10/2020
    const time = moment.parseZone(message.createdAt).local().format('hh:mm'); // 16:58 PM
    const groupIndex = messageGroups.findIndex(item => item.date === date);

    const reactionGroups = this.formatReactionGroups(message.reactions);
    const statuses = this.formatMessageStatuses(message.statuses);

    if (this.user && groupIndex !== -1) {
      for (const data of messageGroups[groupIndex].data) {
        if (data.sender.id === this.user.id) {
          for (let i = 0; i < data.messages.length; i++) {
            const msg = data.messages[i];
            if (msg.id === null && msg.text === message.content && msg.time === time) {
              data.messages[i] = {
                id: message.id,
                text: message.content,
                edited: message.edited,
                deleted: message.deleted,
                time,
                reactionGroups,
                statuses,
                attachments: message.attachments || [],
                links: message.links || [],
                timestamp: message.createdAt
              };
              break;
            }
          }
        }
      }
    }
  }

  addMessageToGroup = (messageGroups: any[], message: any) => {

    if (this.user?.id === message.user.id && message.deleted) {
      return;
    }

    const date = moment.parseZone(message.createdAt).local().format('DD/MM/YYYY'); // 20/10/2020
    const time = moment.parseZone(message.createdAt).local().format('hh:mm'); // 16:58 PM
    const groupIndex = messageGroups.findIndex(item => item.date === date);

    const reactionGroups = this.formatReactionGroups(message.reactions);
    const statuses = this.formatMessageStatuses(message.statuses);

    const formattedMessage = {
      id: message.id,
      text: message.content,
      edited: message.edited,
      deleteStarted: message.deleted,
      deleted: message.deleted,
      time,
      reactionGroups,
      statuses,
      attachments: message.attachments || [],
      links: message.links || [],
      timestamp: message.createdAt
    };

    const sender = {
      id: message.user.id,
      name: message.user.name,
      image: message.user.image,
      active: message.user.active
    };

    if (groupIndex === -1) {
      const position = _.findLastIndex(messageGroups, (item) => moment(new Date(message.createdAt)).isAfter(new Date(item.timestamp)));
      messageGroups.splice(position + 1, 0, {
        id: uuid(),
        date,
        timestamp: message.createdAt,
        data: [
          {
            sender,
            messages: [formattedMessage]
          }
        ]
      });
    } else {
      const messageGroup = messageGroups[groupIndex];
      const dataIndex = _.findLastIndex(messageGroup.data, (item) => moment(new Date(message.createdAt)).isAfter(new Date(item.messages[0].timestamp)));
      if (dataIndex === -1) {
        messageGroup.data.splice(0, 0, {
          sender,
          messages: [formattedMessage]
        });
      } else {
        if (messageGroup.data[dataIndex].sender.id === sender.id) {
          const messageIndex = _.findLastIndex(messageGroup.data[dataIndex].messages, item => moment(new Date(message.createdAt)).isAfter(new Date(item.timestamp)));
          messageGroup.data[dataIndex].messages.splice(messageIndex + 1, 0, formattedMessage);
        } else {
          messageGroup.data.splice(dataIndex + 1, 0, {
            sender,
            messages: [formattedMessage]
          });
        }
      }
    }
  }

  shrinkMessageGroups = (messageGroups: any[]) => {
    for (const messageGroup of messageGroups) {
      let i = 0;
      while (i < messageGroup.data.length - 1) {
        if (messageGroup.data[i].sender.id === messageGroup.data[i + 1].sender.id) {
          const currentGroupMessages = messageGroup.data[i].messages;
          const nextGroupMessages = messageGroup.data[i + 1].messages;
          messageGroup.data[i].messages = [...currentGroupMessages, ...nextGroupMessages];
          messageGroup.data.splice(i + 1, 1);
        } else {
          i++;
        }
      }
    }
  }

  deleteMessageFromGroup = (messageGroups: any[], message: any) => {

    const date = moment.parseZone(message.createdAt).local().format('DD/MM/YYYY'); // 20/10/2020

    const groupIndex = messageGroups.findIndex((item: any) => item.date === date);
    // Check does group exist
    if (groupIndex !== -1) {
      // if group exist
      const { data } = messageGroups[groupIndex];
      // find message index
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const messageIndex = item.messages.findIndex((msg: any) => msg.id === message.id);
        if (messageIndex !== -1) {
          // if message index found, change deleted flag
          if (item.sender.id === this.user?.id) {
            item.messages.splice(messageIndex, 1);
            if (item.messages.length === 0) {
              data.splice(i, 1);
              if (data.length === 0) {
                messageGroups.splice(groupIndex, 1);
              }
            }
          } else {
            item.messages[messageIndex].deleted = true;
          }
          break;
        }
      }
    }

  }

  startDeleteMessageFromGroup = (messageGroups: any[], message: any) => {

    const date = moment.parseZone(message.createdAt).local().format('DD/MM/YYYY'); // 20/10/2020

    const groupIndex = messageGroups.findIndex((item: any) => item.date === date);
    // Check does group exist
    if (groupIndex !== -1) {
      // if group exist
      const { data } = messageGroups[groupIndex];
      // find message index
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const messageIndex = item.messages.findIndex((msg: any) => msg.id === message.id);
        if (messageIndex !== -1) {
          // if message index found, change delete started flag
          item.messages[messageIndex].deleteStarted = true;
          break;
        }
      }
    }

  }

  editMessageFromGroup = (messageGroups: any[], message: any) => {

    const date = moment.parseZone(message.createdAt).local().format('DD/MM/YYYY'); // 20/10/2020

    const groupIndex = messageGroups.findIndex((item: any) => item.date === date);
    // Check does group exist
    if (groupIndex !== -1) {
      // if group exist
      const { data } = messageGroups[groupIndex];
      // find message index
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const messageIndex = item.messages.findIndex((msg: any) => msg.id === message.id);
        if (messageIndex !== -1) {
          // if message index found, edit message
          item.messages[messageIndex].text = message.content;
          item.messages[messageIndex].edited = true;
          item.messages[messageIndex].attachments = message.attachments;
          break;
        }
      }
    }
  }

  replaceLinksInMessageFromGroup = (messageGroups: any[], messageId: string, links = [], createdAt: string) => {

    const date = moment.parseZone(createdAt).local().format('DD/MM/YYYY'); // 20/10/2020

    const groupIndex = messageGroups.findIndex((item: any) => item.date === date);
    // Check does group exist
    if (groupIndex !== -1) {
      // if group exist
      const { data } = messageGroups[groupIndex];
      // find message index
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const messageIndex = item.messages.findIndex((msg: any) => msg.id === messageId);
        if (messageIndex !== -1) {
          // if message index found, add links
          item.messages[messageIndex].links = links;
          break;
        }
      }
    }
  }

  deleteAttachment = (messageGroups: any[], attachment: any) => {

    const message = attachment.message;
    const date = moment.parseZone(message.createdAt).local().format('DD/MM/YYYY'); // 20/10/2020

    const groupIndex = messageGroups.findIndex((item: any) => item.date === date);
    // Check does group exist
    if (groupIndex !== -1) {
      // if group exist
      const { data } = messageGroups[groupIndex];
      // find message index
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const messageIndex = item.messages.findIndex((msg: any) => msg.id === message.id);
        if (messageIndex !== -1) {
          const messageFromGroup = item.messages[messageIndex];
          const attachmentIndex = messageFromGroup.attachments.findIndex(item => item.id === attachment.id);
          if (attachmentIndex !== -1) {
            messageFromGroup.attachments.splice(attachmentIndex, 1);
            if (!messageFromGroup.text && messageFromGroup.attachments.length === 0) {
              this.deleteMessageFromGroup(messageGroups, message);
            } else {
              messageFromGroup.edited = true;
            }
            break;
          }
        }
      }
    }

  }

}
