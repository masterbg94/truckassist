import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-receiver-message-list',
  templateUrl: './receiver-message-list.component.html'
})
export class ReceiverMessageListComponent {

  @Input() chatId?: string;
  @Input() item?: any;
  @Input() isGroup = true;

}
