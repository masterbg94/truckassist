import { ComponentRef, Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { AwesomeTooltipComponent } from './awesome-tooltip.component';

@Directive({ selector: '[appAwesomeTooltip]' })
export class AwesomeTooltipDirective implements OnInit {
  @Input('appAwesomeTooltip') text = '';
  private overlayRef: OverlayRef;

  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'center',
          offsetY: -20,
          offsetX: 0,
        },
      ]);

    this.overlayRef = this.overlay.create({ positionStrategy });
  }

  @HostListener('mouseenter')
  show() {
    if (this.text) {
      const tooltipRef: ComponentRef<AwesomeTooltipComponent> = this.overlayRef.attach(
        new ComponentPortal(AwesomeTooltipComponent)
      );
      tooltipRef.instance.text = this.text;
    }
  }

  @HostListener('mouseout')
  hide(targetElement: string) {
    this.overlayRef.detach();
  }

  // @HostListener('document:click')
  // clickout() {
  //   this.overlayRef.detach();
  // }
}
