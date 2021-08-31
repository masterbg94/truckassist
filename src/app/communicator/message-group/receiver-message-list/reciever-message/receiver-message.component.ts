import { Component, Input, ViewChild, ElementRef, ChangeDetectorRef, SimpleChanges} from '@angular/core';
import { CommunicatorService } from 'src/app/core/services/communicator.service';
import { CommunicatorHelpersService } from '../../../../core/services/communicator-helpers.service';

@Component({
  selector: 'app-receiver-message',
  templateUrl: './receiver-message.component.html',
  styleUrls: ['./receiver-message.component.scss'],
})
export class ReceiverMessageComponent {

  @ViewChild('receiverPosition') receiverPosition: ElementRef;

  @Input() chatId?: string;
  @Input() message?: any;
  @Input() isGroup = true;
  @Input() sender?: any;
  @Input() isFirst = false;
  @Input() isLast = false;

  emojiVisible = false;
  reactionEmoji = false;
  timerOfEmoji: any;
  receiverPos = false;

  positionOfReceiverMessage?: any;

  isDeletedMessage: [] = [];

  constructor(
    private communicatorService: CommunicatorService,
    private communicatorHelpersService: CommunicatorHelpersService,
    private cdref: ChangeDetectorRef
  ) {}

  ngAfterViewChecked(): void {
    this.receiverPosition.nativeElement.offsetTop > 560
      ? (this.positionOfReceiverMessage = true)
      : (this.positionOfReceiverMessage = false);

    this.cdref.detectChanges();
  }

  toggleEmoji(event: any) {
    this.communicatorService.toggleReaction(this.message.id, event);
    this.emojiVisible = false;
  }

  leaveEmoji() {
    if (this.timerOfEmoji) {
      clearTimeout(this.timerOfEmoji);
    }
    this.timerOfEmoji = setTimeout(() => {
      this.emojiVisible = false;
    }, 800);
  }

  stayOnEmoji() {
    clearTimeout(this.timerOfEmoji);
    this.emojiVisible = true;
  }

  onClickReaction(emoji: string) {
    if (this.message) {
      this.reactionEmoji = true;
      this.communicatorService.toggleReaction(this.message.id, emoji);
    }
  }


  isLinkMessage() {
    if(this.message.text !== null) {
      this.message.text = this.isContainUrl(this.message.text).text;
    }

    if (this.message.text?.includes('http')) {
      return true;
    }
    return false;
  }

  isContainUrl(text: string) {
      const textArray = text.split(' ');
      for (let index = 0; index < textArray.length; index++) {
        if (this.communicatorHelpersService.isUrl(textArray[index])) {
          if (!textArray[index].includes('http')) {
            textArray[index] = `http://${textArray[index]}`;
          } else {
            textArray[index] = textArray[index];
          }
        } else {
          textArray[index] = textArray[index];
        }
      }
      return {
        text: textArray.join(' '),
        array: textArray,
      };
  }

  openPageLink(text: any) {
    if (text.includes('http')) {
      window.open(text, '_blank');
    }
  }
}
