import {
  animate,
  group,
  keyframes,
  query,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

// Animating route for navbar
export const navAnimation = (route: string) =>
  trigger(route, [
    transition(
      'application => medical, medical => mvr, mvr => psp, psp => sph, sph => hos, hos => ssn, ssn => cdl',
      [
        // '!' set height of element on the start equal to the height would be on the end of animation
        style({ height: '!' }),
        // query access to animate and children routes
        query(':enter', style({ transform: 'translateX(100%)' })),
        query(':enter, :leave', style({ position: 'absolute', top: -16, left: 0, right: 0 })),
        // animate the leave page away
        group([
          query(':leave', [
            animate(
              '0.3s cubic-bezier(.35,0,.25,1)',
              style({ transform: 'translateX(-100%)', opacity: 0 })
            ),
          ]),
          // and now reveal the enter
          query(
            ':enter',
            animate(
              '0.3s cubic-bezier(.35,0,.25,1)',
              style({ transform: 'translateX(0)', opacity: 1 })
            )
          ),
        ]),
      ]
    ),
    transition(
      'medical => application, mvr => medical, psp => mvr, sph => psp, hos => sph, ssn => hos, cdl => ssn',
      [
        style({ height: '!' }),
        query(':enter', style({ transform: 'translateX(-100%)' })),
        query(':enter, :leave', style({ position: 'absolute', top: -16, left: 0, right: 0 })),
        // animate the leave page away
        group([
          query(':leave', [
            animate(
              '0.3s cubic-bezier(.35,0,.25,1)',
              style({ transform: 'translateX(100%)', opacity: 0 })
            ),
          ]),
          // and now reveal the enter
          query(
            ':enter',
            animate(
              '0.3s cubic-bezier(.35,0,.25,1)',
              style({ transform: 'translateX(0)', opacity: 1 })
            )
          ),
        ]),
      ]
    ),
  ]);

// Animating route for application (steps)
export const routerAnimation = (route: string) =>
  trigger(route, [
    transition(
      '1 => 2, 2 => 3, 3 => 4, 4 => 5, 5 => 6, 6 => 7, 7 => 8, 8 => 9, 9 => 10, 10 => 11',
      [
        // '!' set height of element on the start equal to the height would be on the end of animation
        style({ height: '!' }),
        // query access to animate and children routes
        query(':enter', style({ transform: 'translateX(100%)' })),
        query(':enter, :leave', style({ position: 'absolute', top: -8, left: 0, right: 0 })),
        // animate the leave page away
        group([
          query(':leave', [
            animate(
              '0.3s cubic-bezier(.35,0,.25,1)',
              style({ transform: 'translateX(-100%)', opacity: 0 })
            ),
          ]),
          // and now reveal the enter
          query(
            ':enter',
            animate(
              '0.3s cubic-bezier(.35,0,.25,1)',
              style({ transform: 'translateX(0)', opacity: 1 })
            )
          ),
        ]),
      ]
    ),
    transition(
      '2 => 1, 3 => 2, 4 => 3, 5 => 4, 6 => 5, 7 => 6, 8 => 7, 9 => 8, 10 => 9, 11 => 10',
      [
        style({ height: '!' }),
        query(':enter', style({ transform: 'translateX(-100%)' })),
        query(':enter, :leave', style({ position: 'absolute', top: -8, left: 0, right: 0 })),
        // animate the leave page away
        group([
          query(':leave', [
            animate(
              '0.3s cubic-bezier(.35,0,.25,1)',
              style({ transform: 'translateX(100%)', opacity: 0 })
            ),
          ]),
          // and now reveal the enter
          query(
            ':enter',
            animate(
              '0.3s cubic-bezier(.35,0,.25,1)',
              style({ transform: 'translateX(0)', opacity: 1 })
            )
          ),
        ]),
      ]
    ),
  ]);

// Personal Info - Step1
export const createTriggerAddress = (item: string) =>
  trigger(item, [
    state(
      'out',
      style({
        opacity: 0,
        visibility: 'hidden',
      })
    ),
    state(
      'in',
      style({
        opacity: 1,
        visibility: 'visible',
      })
    ),
    transition('out => in', [
      animate(
        200,
        keyframes([
          style({
            opacity: 0,
            offset: 0,
          }),
          style({
            opacity: 0.3,
            visibility: 'visible',
            offset: 0.4,
          }),
          style({
            opacity: 1,
            offset: 0.6,
          }),
        ])
      ),
    ]),
  ]);

// Personal Info - Step1
export const createTriggerForm = (item: string) =>
  trigger(item, [
    state(
      'in',
      style({
        opacity: 1,
        transform: 'translateX(0)',
      })
    ),
    transition(':enter', [
      style({
        opacity: 0,
        transform: 'translateX(-50px)',
      }),
      animate(300),
    ]),
  ]);
