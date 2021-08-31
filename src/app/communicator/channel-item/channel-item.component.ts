import { Component, Input } from '@angular/core';
import { CommunicatorService } from 'src/app/core/services/communicator.service';

@Component({
  selector: 'app-channel-item',
  templateUrl: './channel-item.component.html',
  styleUrls: ['./channel-item.component.scss']
})
export class ChannelItemComponent {

  @Input() channel?: any;
  @Input() visibleNumberOfMessages = true;
  @Input() isSelected = false;
  @Input() addPrefix = false;

  constructor(private communicatorService: CommunicatorService) {}

  isActive() {
    return this.channel.status === 'active';
  }

  getNumberOfUnreadMessages() {
    if (this.channel.userType === 'company') {
      const index = this.channel.subscriptions.findIndex(item => item.user.id === this.communicatorService.getUserId());
      if (index !== -1) {
        return this.channel.subscriptions[index].unreadMessages;
      }
    } else {
      let sum = 0;
      for (const chat of this.channel.subchats) {
        const index = chat.subscriptions.findIndex(item => item.user.id === this.communicatorService.getUserId());
        if (index !== -1) {
          sum += chat.subscriptions[index].unreadMessages;
        }
      }
      return sum;
    }
    return 0;
  }

}
