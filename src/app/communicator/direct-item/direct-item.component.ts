import { Component, Input } from '@angular/core';
import { CommunicatorHelpersService } from 'src/app/core/services/communicator-helpers.service';

@Component({
  selector: 'app-direct-item',
  templateUrl: './direct-item.component.html',
  styleUrls: ['./direct-item.component.scss']
})
export class DirectItemComponent {

  @Input() direct?: any;
  @Input() imageCircle = false;
  @Input() isSelected = false;
  @Input() typing = false;
  @Input() shortenName = false;

  constructor(private communicatorHelpersService: CommunicatorHelpersService) { }

  getChatName() {
    return this.communicatorHelpersService.getChatName(this.direct);
  }

  getUserImage() {
    return this.communicatorHelpersService.getUserImage(this.direct);
  }

  getUserStatus() {
    return this.communicatorHelpersService.getUserStatus(this.direct);
  }

  isActive() {
    return this.direct.status === 'active';
  }

  getUnreadMessages() {
    return this.communicatorHelpersService.getMySubscriptionInChat(this.direct)?.unreadMessages;
  }
}
