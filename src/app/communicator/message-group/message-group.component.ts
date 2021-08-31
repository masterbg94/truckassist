import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-message-group',
  templateUrl: './message-group.component.html',
  styleUrls: ['./message-group.component.scss']
})
export class MessageGroupComponent {

  @Input() chatId?: string;
  @Input() type?: string;
  @Input() userType?: string;
  @Input() chatName?: string;

  @Input() messageGroup?: any;
  @Input() headerVisible = true;
  @Input() isChannel = true;

  @Output() onDeleteMessage = new EventEmitter<any>();
  @Output() onEditMessage = new EventEmitter<any>();
  @Output() onEditModeChange = new EventEmitter<any>();

  user?: any;

  constructor() {
    this.user = JSON.parse(localStorage.getItem('chatUser'));
  }

  deleteMessage(message: any) {
    this.onDeleteMessage.emit(message);
  }

  editMessage(message: any) {
    this.onEditMessage.emit(message);
  }

  changeEditMode(editMode: boolean) {
    this.onEditModeChange.next(editMode);
  }

}
