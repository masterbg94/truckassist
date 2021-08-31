import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appScrollFix]',
})
export class ScrollFixDirective {
  readyFor: string;
  toReset = false;

  constructor(public elementRef: ElementRef) {
    this.readyFor = 'up';
    this.restore();
  }

  // resetting the scroll position to bottom because that is where chats start.
  reset() {
    this.readyFor = 'up';
    this.elementRef.nativeElement.scrollTop = this.elementRef.nativeElement.scrollHeight;
  }

  restore() {
    if (this.toReset) {
      if (this.readyFor === 'up') {
        this.elementRef.nativeElement.scrollTop = 50;
        // set scroll position 50px from top
      }
      this.toReset = false;
    }
  }

  prepareFor(direction) {
    this.toReset = true;
    this.readyFor = direction || 'up';
    // check for scrollTop is zero or not
    this.elementRef.nativeElement.scrollTop = !this.elementRef.nativeElement.scrollTop
      ? this.elementRef.nativeElement.scrollTop + 1
      : this.elementRef.nativeElement.scrollTop;
    // the current position is stored before new messages are loaded
  }
}
