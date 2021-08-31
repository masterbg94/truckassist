import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';


export const createTriggerHeading1 = (item: string) =>
trigger(item, [
    state('in', style({
        opacity: 1,
        transform: 'translateY(30px)'
    })),
    transition(':enter', [     // void => *
            animate(200, keyframes([
                style({
                    opacity: 0,
                    transform: 'translateY(-70px)',
                    offset: 0
                }),
                style({
                    opacity: 0.4,
                    transform: 'translateY(-50px)',
                    offset: 0.4
                }),
                style({
                    opacity: 0.6,
                    transform: 'translateY(-30px)',
                    offset: 0.6
                }),
                style({
                    opacity: 0.8,
                    transform: 'translateY(-10px)',
                    offset: 0.8
                })
            ]))
    ])
]);
export const createTriggerHeading2 = (item: string) =>
trigger(item, [
    state('in', style({
        opacity: 1,
        transform: 'translateX(80px)'
    })),
    transition(':enter', [     // void => *
            animate(200, keyframes([
                style({
                    opacity: 0,
                    transform: 'translateX(0px)',
                    offset: 0
                }),
                style({
                    opacity: 0.4,
                    transform: 'translateX(20px)',
                    offset: 0.4
                }),
                style({
                    opacity: 0.4,
                    transform: 'translateX(40px)',
                    offset: 0.6
                }),
                style({
                    opacity: 0.8,
                    transform: 'translateX(60px)',
                    offset: 0.8
                })
            ]))
    ])
]);
