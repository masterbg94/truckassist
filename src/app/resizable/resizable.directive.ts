import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, Inject, Output } from '@angular/core';
import { distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';

@Directive({
  selector: '[resizable]',
})
export class ResizableDirective {
  @Output()
  readonly resizable = fromEvent<MouseEvent>(
    this.elementRef.nativeElement,
    'mousedown'
  ).pipe(
    tap((e) => e.preventDefault()),
    switchMap(() => {
      const currentElement = this.elementRef.nativeElement
        .closest('th')
        .getBoundingClientRect();
      const nextElement = this.elementRef.nativeElement
        .closest('th')
        .nextElementSibling.getBoundingClientRect();

      return fromEvent<MouseEvent>(this.documentRef, 'mousemove').pipe(
        map(({ clientX }) => {
          const table = this.elementRef.nativeElement.closest(
            '.truckassist-table'
          );

          const tempWidth =
            currentElement.width + clientX - currentElement.right;

          const currentElementWidth = (tempWidth / table.offsetWidth) * 100;

          const nextElementWidth =
            ((nextElement.width + (currentElement.width - tempWidth)) /
              table.offsetWidth) *
            100;

          const currentElementMinWidth = Number(
            this.elementRef.nativeElement
              .closest('th')
              .style.minWidth.replace('%', '')
          );
          const currentElementMaxWidth = Number(
            this.elementRef.nativeElement
              .closest('th')
              .style.maxWidth.replace('%', '')
          );

          const nextElementMinWidth = Number(
            this.elementRef.nativeElement
              .closest('th')
              .nextElementSibling.style.minWidth.replace('%', '')
          );
          const nextElementMaxWidth = Number(
            this.elementRef.nativeElement
              .closest('th')
              .nextElementSibling.style.maxWidth.replace('%', '')
          );

          // Current Element

          if (currentElementWidth <= currentElementMinWidth) {
            this.elementRef.nativeElement.closest('th').style.width = Math.trunc(currentElementMinWidth) + '%';
          }

          if (currentElementWidth >= currentElementMaxWidth) {
            this.elementRef.nativeElement.closest('th').style.width = Math.trunc(currentElementMaxWidth) + '%';
          }

          if (currentElementWidth >= currentElementMinWidth && currentElementWidth <= currentElementMaxWidth) {
            this.elementRef.nativeElement.closest('th').style.width = Math.trunc(currentElementWidth) + '%';
          }

          // Next Element

          if (nextElementWidth <= nextElementMinWidth) {
            this.elementRef.nativeElement.closest('th').nextElementSibling.style.width = Math.trunc(nextElementMinWidth) + '%';
          }

          if (nextElementWidth >= nextElementMaxWidth) {
            this.elementRef.nativeElement.closest('th').nextElementSibling.style.width = Math.trunc(nextElementMaxWidth) + '%';
          }

          if (nextElementWidth >= nextElementMinWidth && nextElementWidth <= nextElementMaxWidth) {
            this.elementRef.nativeElement.closest('th').nextElementSibling.style.width = Math.trunc(nextElementWidth) + '%';
          }

          return null;
        }),
        distinctUntilChanged(),
        takeUntil(fromEvent(this.documentRef, 'mouseup'))
      );
    })
  );

  constructor(
    @Inject(DOCUMENT) private readonly documentRef: Document,
    @Inject(ElementRef)
    private readonly elementRef: ElementRef
  ) {}
}
