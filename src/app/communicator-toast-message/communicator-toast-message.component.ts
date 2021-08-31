import { Router } from '@angular/router';
import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommunicatorHelpersService } from '../core/services/communicator-helpers.service';

@Component({
  selector: 'app-communicator-toast-message',
  templateUrl: './communicator-toast-message.component.html',
  styleUrls: ['./communicator-toast-message.component.scss'],
})
export class CommunicatorToastMessageComponent implements OnInit, OnDestroy {
  @Input() toastMessage: any;
  @Output() toastMessageClosed = new EventEmitter<string>();
  @Output() hoverReactionOnMessage = new EventEmitter<string>();
  @Output() noHoverReactionOnMessage = new EventEmitter<string>();

  toastContent?: any;
  expiredToastTime: boolean = false;

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    if (this.toastMessage.type === 'message') {
      this.toastContent = {
        chatId: this.toastMessage.data.chat.id,
        parentId: this.toastMessage.data.chat.parent,
        headerTitle:
          this.toastMessage.data.chat.type === 'direct'
            ? this.toastMessage.data.user.type === 'company'
              ? 'Company'
              : 'Driver'
            : this.toastMessage.data.chat.name,
        userType: this.toastMessage.data.user.type,
        image: this.toastMessage.data.user.image || null,
        name: this.toastMessage.data.user.name,
        text: this.generateToastTextContent(
          this.toastMessage.data.content,
          this.toastMessage.data.attachments.length
        ),
      };
    } else if (this.toastMessage.type === 'reaction') {
      this.toastContent = {
        chatId: this.toastMessage.data.message.chat.id,
        parentId: this.toastMessage.data.message.chat.parent,
        headerTitle:
          this.toastMessage.data.message.chat.type === 'direct'
            ? this.toastMessage.data.user.type === 'company'
              ? 'Company'
              : 'Driver'
            : this.toastMessage.data.message.chat.name,
        userType: this.toastMessage.data.user.type,
        image: this.toastMessage.data.user.image || null,
        name: this.toastMessage.data.user.name,
        text: `${this.toastMessage.data.user.name} reacted with ${this.toastMessage.data.type} on "${this.toastMessage.data.message.content}".`,
      };
    }
  }

  ngOnDestroy() {
    this.toastContent = null;
  }

  closeToastMessage() {
    this.expiredToastTime = true;
    setTimeout(() => {
      this.toastMessageClosed.emit(this.toastMessage.data.id);
    }, 30);
  }

  mouseEnter() {
    this.hoverReactionOnMessage.emit(this.toastMessage.data.id);
  }

  mouseLeave() {
    this.noHoverReactionOnMessage.emit(this.toastMessage.data.id);
  }

  navigateToChat() {
    if (this.toastContent?.chatId) {
      if (this.toastContent?.parentId) {
        this.router.navigate([
          `communicator/${this.toastContent.parentId}/subchats/${this.toastContent.chatId}`,
        ]);
      } else {
        this.router.navigate([`communicator/${this.toastContent.chatId}`]);
      }
    }
  }

  private generateToastTextContent(message: string, attachmentCount: number) {
    let text;
    if (message) {
      text = message;
    } else {
      if (attachmentCount === 1) {
        text = 'sent you an attachment';
      } else {
        text = `sent you ${attachmentCount} attachments`;
      }
    }
    return text;
  }
}
