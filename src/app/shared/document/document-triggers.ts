import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

export const createZoomTrigger = (itemName: string) => trigger(itemName, [
  state('deleted', style({
    opacity: 1,
    transform: 'scale(1)'
  })),
  state('normal', style({
    opacity: 1,
    transform: 'scale(1)'
  })),
  transition('void => normal',
    animate(
      200,
      keyframes([
        style({
          transform: 'scale(0.8)',
          opacity: 0.8,
          offset: 0
        }),
        style({
          transform: 'scale(0.85)',
          opacity: 0.85,
          offset: 0.25
        }),
        style({
          transform: 'scale(0.9)',
          opacity: 0.9,
          offset: 0.5
        }),
        style({
          transform: 'scale(0.95)',
          opacity: 0.95,
          offset: 0.75
        }),
        style({
          transform: 'scale(1)',
          opacity: 1,
          offset: 1
        })
      ])
    )
  ),
  transition('normal => deleted',
    animate(
      200,
      keyframes([
        style({
          transform: 'scale(1)',
          opacity: 1,
          offset: 0
        }),
        style({
          transform: 'scale(0.95)',
          opacity: 0.95,
          offset: 0.25
        }),
        style({
          transform: 'scale(0.9)',
          opacity: 0.9,
          offset: 0.5
        }),
        style({
          transform: 'scale(0.85)',
          opacity: 0.85,
          offset: 0.75
        }),
        style({
          transform: 'scale(0.8)',
          opacity: 0.8,
          offset: 1
        })
      ])
    )
  )
]);
