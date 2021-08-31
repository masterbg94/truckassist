import { trigger, transition, style, animate, sequence, state } from '@angular/animations';

// animation for table rows
export let listAnimation = trigger('listAnimation', [
  transition('a => void', [
    style({
      height: '*',
      opacity: '1',
      transform: 'translateX(0)',
      'box-shadow': '0 1px 4px 0 rgba(0, 0, 0, 0.3)',
    }),
    sequence([
      animate(
        '0.5s ease',
        style({
          height: '*',
          opacity: '.2',
          transform: 'translateX(50px)',
          'box-shadow': 'none',
        })
      ),
      animate(
        '.1s ease',
        style({
          height: '0',
          opacity: 0,
          transform: 'translateX(50px)',
          'box-shadow': 'none',
        })
      ),
    ]),
  ]),
  transition('delete => void', [
    style({
      height: '*',
      opacity: '1',
      transform: 'translateX(0)',
      'box-shadow': '0 1px 4px 0 rgba(0, 0, 0, 0.3)',
      color: '#ffffff',
      backgroundColor: '#FF5D5D',
    }),
    sequence([
      animate(
        '0.5s ease',
        style({
          height: '*',
          opacity: '.2',
          transform: 'translateX(50px)',
          'box-shadow': 'none',
          color: '#ffffff',
          backgroundColor: '#FF5D5D',
        })
      ),
      animate(
        '.1s ease',
        style({
          height: '0',
          opacity: 0,
          transform: 'translateX(50px)',
          'box-shadow': 'none',
          color: '#ffffff',
          backgroundColor: '#FF5D5D',
        })
      ),
    ]),
  ]),
  transition('i => void', [
    style({
      height: '*',
      opacity: '1',
      transform: 'translateX(0)',
      boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.3)',
      backgroundColor: '#A5EF7A !important',
      color: '#ffffff !important !important',
    }),
    sequence([
      animate(
        '0.5s ease',
        style({
          height: '*',
          opacity: '.2',
          transform: 'translateX(-50px)',
          boxShadow: 'none',
          backgroundColor: '#A5EF7A',
          color: '#ffffff',
        })
      ),
      animate(
        '.1s ease',
        style({
          height: '0',
          opacity: 0,
          transform: 'translateX(-50px)',
          boxShadow: 'none',
          backgroundColor: '#A5EF7A',
          color: '#ffffff',
        })
      ),
    ]),
  ]),
  transition('void => new', [
    style({
      height: '*',
      opacity: '1',
      transform: 'translateX(-50px)',
      'box-shadow': '0 1px 4px 0 rgba(0, 0, 0, 0.3)',
      'background-color': '#008000 !important',
    }),
    sequence([
      animate(
        '0.5s ease',
        style({
          height: '*',
          opacity: '.2',
          transform: 'translateX(-20px)',
          'box-shadow': 'none',
        })
      ),
      animate(
        '.1s ease',
        style({
          height: '0',
          opacity: 0,
          transform: 'translateX(0px)',
          'box-shadow': 'none',
        })
      ),
    ]),
  ]),
]);

export let expandContainerCollapse = trigger('expandContainerCollapse', [
  state('open', style({ visibility: 'visible' })),
  state('close', style({ visibility: 'collapse' })),
  transition('open => close', animate(100)),
  transition('close => open', animate(50))
]);

export let expandCollapse = trigger('expandCollapse', [
  state('open', style({ height: '195px', padding: '0px' })),
  state('close', style({ height: '0px', padding: '0px' })),
  transition('open => close', animate(60)),
  transition('close => open', animate(80))
]);