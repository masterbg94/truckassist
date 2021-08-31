import { Component, EventEmitter, Input,  Output } from '@angular/core';

@Component({
  selector: 'app-chat-emoji',
  templateUrl: './chat-emoji.component.html',
  styleUrls: ['./chat-emoji.component.scss']
})
export class ChatEmojiComponent {

  @Input() visibilityEmoji = false;
  @Input() typeOfTriangle = 'down';
  @Output() selectedEmoji = new EventEmitter<any>();


  selectEmoji(event) {
    this.selectedEmoji.emit((event.emoji as any).native);
  }
}
