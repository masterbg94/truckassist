import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sender-message-list',
  templateUrl: './sender-message-list.component.html'
})
export class SenderMessageListComponent {

  @Input() chatId?: string;
  @Input() type?: string;
  @Input() userType?: string;
  @Input() chatName?: string;
  @Input() isChannel?: any;

  @Input() item?: any;
  @Output() onDeleteMessage = new EventEmitter<any>();
  @Output() onEditMessage = new EventEmitter<any>();
  @Output() onEditModeChange = new EventEmitter<boolean>();

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
