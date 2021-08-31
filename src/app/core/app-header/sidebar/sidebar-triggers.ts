import { animate, keyframes, query, stagger, state, style, transition, trigger } from '@angular/animations';

export const toggleListShow = trigger('triggerList', [
    transition(':enter', [
      style({ height: 100 }),
      animate('150ms', style({ height: '*' })),
    ]),
    transition(':leave', [
      animate('150ms', style({ height: 0 })),
    ]),
]);


export const listItemTrigger = trigger('listItem', [
  state('left-item', style({
    opacity: 1,
    transform: 'translateX(0)'
  })),
  state('right-item', style({
    opacity: 1,
    transform: 'translateX(0)'
  })),
  state('additiona-left-item', style({
    opacity: 1,
    transform: 'translateX(0)'
  })),
  state('additional-right-item', style({
    opacity: 1,
    transform: 'translateX(0)'
  })),
  transition('* => left-item',
    animate(
      200,
      keyframes([
        style({
          transform: 'translateX(-446px)',
          opacity: 0.6,
          offset: 0
        }),
        style({
          transform: 'translateX(-334.5px)',
          opacity: 0.7,
          offset: 0.25
        }),
        style({
          transform: 'translateX(-223px)',
          opacity: 0.8,
          offset: 0.5
        }),
        style({
          transform: 'translateX(-111.5px)',
          opacity: 0.9,
          offset: 0.75
        }),
        style({
          transform: 'translateX(0px)',
          opacity: 1,
          offset: 1
        })
      ])
    )
  ),
  transition('* => right-item',
    animate(
      200,
      keyframes([
        style({
          transform: 'translateX(446px)',
          opacity: 0.6,
          offset: 0
        }),
        style({
          transform: 'translateX(334.5px)',
          opacity: 0.7,
          offset: 0.25
        }),
        style({
          transform: 'translateX(223px)',
          opacity: 0.8,
          offset: 0.5
        }),
        style({
          transform: 'translateX(111.5px)',
          opacity: 0.9,
          offset: 0.75
        }),
        style({
          transform: 'translateX(0px)',
          opacity: 1,
          offset: 1
        })
      ])
    )
  ),
  ,
  transition('* => additional-left-item',
    animate(
      100,
      keyframes([
        style({
          transform: 'translateX(-300px)',
          opacity: 0.6,
          offset: 0
        }),
        style({
          transform: 'translateX(-225px)',
          opacity: 0.7,
          offset: 0.25
        }),
        style({
          transform: 'translateX(-150px)',
          opacity: 0.8,
          offset: 0.5
        }),
        style({
          transform: 'translateX(-75px)',
          opacity: 0.9,
          offset: 0.75
        }),
        style({
          transform: 'translateX(0px)',
          opacity: 1,
          offset: 1
        })
      ])
    )
  ),
  transition('* => additional-right-item',
    animate(
      100,
      keyframes([
        style({
          transform: 'translateX(300px)',
          opacity: 0.6,
          offset: 0
        }),
        style({
          transform: 'translateX(225px)',
          opacity: 0.7,
          offset: 0.25
        }),
        style({
          transform: 'translateX(150px)',
          opacity: 0.8,
          offset: 0.5
        }),
        style({
          transform: 'translateX(75px)',
          opacity: 0.9,
          offset: 0.75
        }),
        style({
          transform: 'translateX(0px)',
          opacity: 1,
          offset: 1
        })
      ])
    )
  ),
  transition('additional-left-item => void',
    animate(
      100,
      keyframes([
        style({
          transform: 'translateX(0px)',
          opacity: 1,
          offset: 0
        }),
        style({
          transform: 'translateX(-75px)',
          opacity: 0.9,
          offset: 0.25
        }),
        style({
          transform: 'translateX(-150px)',
          opacity: 0.8,
          offset: 0.5
        }),
        style({
          transform: 'translateX(-225px)',
          opacity: 0.7,
          offset: 0.75
        }),
        style({
          transform: 'translateX(-300px)',
          opacity: 0.6,
          offset: 1
        })
      ])
    )
  ),
  transition('additional-right-item => void',
    animate(
      100,
      keyframes([
        style({
          transform: 'translateX(0px)',
          opacity: 1,
          offset: 0
        }),
        style({
          transform: 'translateX(75px)',
          opacity: 0.9,
          offset: 0.25
        }),
        style({
          transform: 'translateX(150px)',
          opacity: 0.8,
          offset: 0.5
        }),
        style({
          transform: 'translateX(225px)',
          opacity: 0.7,
          offset: 0.75
        }),
        style({
          transform: 'translateX(300px)',
          opacity: 0.6,
          offset: 1
        })
      ])
    )
  )
]);
