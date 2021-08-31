import { Component, ElementRef, HostBinding } from '@angular/core';

@Component({
  selector: 'th[resizable]',
  templateUrl: './resizable.component.html',
  styleUrls: ['./resizable.component.scss'],
})
export class ResizableComponent {
  @HostBinding('style.width.%')
  width: number | null = null;

  onResize(element: any) {
    // this.width = width;
  }
}
