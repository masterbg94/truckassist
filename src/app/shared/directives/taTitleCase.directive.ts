import { Directive, ElementRef, HostListener, Self } from '@angular/core';

@Directive({
  selector: '[taTitleCase]',
})
export class TaTitleCaseDirective {
  constructor(@Self() private _el: ElementRef) {}

  @HostListener('keyup', ['$event']) onKeyDown(evt: KeyboardEvent) {
    if (this._el.nativeElement.value) {
      const arr: string[] = this._el.nativeElement.value.split('');
      arr[0] = arr[0].toUpperCase();
      this._el.nativeElement.value = arr.join('');
    }
  }
}
