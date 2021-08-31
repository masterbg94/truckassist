import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';

@Component({
    selector: 'app-chat-search',
    templateUrl: './chat-search.component.html',
    styleUrls: ['./chat-search.component.scss'],
    animations: [
      trigger('toggleClick', [
        state('true', style({
          width: '126px'
        })),
        state('false', style({
          width: '0px'
        })),
        transition('true => false', animate('100ms')),
        transition('false => true', animate('100ms'))
      ]),

      trigger('toggleClickMiniChat', [
        state('true', style({
          width: '129.5px'
        })),
        state('false', style({
          width: '0px'
        })),
        transition('true => false', animate('200ms')),
        transition('false => true', animate('400ms'))
      ])
    ]
})
export class ChatSearchComponent {
  @ViewChild('focusSearch') focusSearch: ElementRef;
  @Output() onChangeSearch = new EventEmitter<string>();
  @Input() unreadMessage = false;
  @Input() expanded = false;
  @Input() chatName = 'mainChat';
  @Input() expandedMiniChat = false;
  @Input() inFocus = false;

  @Output() onExpandedEmit = new EventEmitter<boolean>();

  searchText = '';

  constructor() {}

  toggleSearch = () => {
    this.expanded = !this.expanded;
    this.onExpandedEmit.emit(this.expanded)

    if (this.expanded) {
      this.searchText = '';
      this.textChanged();
      this.inFocus = true;
      setTimeout(() => {
        this.focusSearch.nativeElement.focus();
      }, 300);

    } else {
      this.inFocus = false;
    }
  }

  textChanged() {
    this.onChangeSearch.emit(this.searchText);
  }

  emptyInputContent() {
    this.focusSearch.nativeElement.value = '';
    this.focusSearch.nativeElement.focus();
    this.onChangeSearch.emit(this.focusSearch.nativeElement.value);
  }

  eventOnBackspace() {
    const text = this.focusSearch.nativeElement.value;
    this.onChangeSearch.emit(text);
  }
}


