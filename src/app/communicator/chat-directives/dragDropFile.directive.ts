import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';

@Directive({
  selector: '[appDragDropFile]',
})
export class DragDropFileDirective {
  @Output() onDropFile = new EventEmitter<any>();
  @Output() onDropBackground = new EventEmitter<boolean>();

  @HostBinding('style.background') public background: SafeStyle;
  @HostBinding('style.position') public position = 'absolute';
  @HostBinding('style.min-height') public min_height = '77vh';
  @HostBinding('style.width') public width = '874px';
  @HostBinding('style.top') public top = '50%';
  @HostBinding('style.left') public left = '50%';
  @HostBinding('style.transform') public transform = 'translate(-43.5%,-43.5%)';

  widthChange;

  viewportSizes = [Breakpoints.Large, Breakpoints.XLarge];

  constructor(private domSanitizer: DomSanitizer, private breakpointObserver: BreakpointObserver) {
    this.widthChange = breakpointObserver
      .observe([Breakpoints.Large, Breakpoints.XLarge])
      .subscribe((state: BreakpointState) => {
        if (breakpointObserver.isMatched(Breakpoints.Large)) {
          this.min_height = '80vh';
          this.transform = 'translate(-43.5%,-45.5%)'
        } else if (breakpointObserver.isMatched(Breakpoints.XLarge)) {
          this.min_height = '83vh';
          this.transform = 'translate(-43.5%,-46%)'
        }
      });
  }

  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    this.background = this.domSanitizer.bypassSecurityTrustStyle(
      'linear-gradient(45deg, rgb(255,255,255,.1), rgb(255,255,255,.1)),url("../../../assets/img/svgs/communicator/ic_dropbox-container.svg") no-repeat'
    );

    this.onDropBackground.emit(true);
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    this.onDropBackground.emit(false);
  }

  @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    this.onDropBackground.emit(false);

    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.onDropFile.emit(files);
    }
  }
}
