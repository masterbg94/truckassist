import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommunicatorService } from 'src/app/core/services/communicator.service';
import { CommunicatorHelpersService } from '../../core/services/communicator-helpers.service';

@Component({
  selector: 'app-chat-channel-actions',
  templateUrl: './chat-channel-actions.component.html',
  styleUrls: ['./chat-channel-actions.component.scss']
})
export class ChatChannelActionsComponent implements OnInit {

  @Input() chats = [];
  @Output() closeDropDown = new EventEmitter<void>();

  constructor(private communicatorService: CommunicatorService, private communicatorHelpersService: CommunicatorHelpersService) { }

  ngOnInit() {
  }

  channelAction(chat: any) {
    this.communicatorService.changeJoinToChatStatus(chat.id);
    this.closeDropDown.emit();
  }

  isJoined(chat: any) {
    return this.communicatorHelpersService.getMySubscriptionInChat(chat)?.joined;
  }

}
