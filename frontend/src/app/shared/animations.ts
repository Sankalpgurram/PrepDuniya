import { trigger, transition, style, animate, query, stagger, keyframes } from '@angular/animations';

export const pageAnimations = trigger('pageAnimations', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(20px)' }),
    animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);

export const cardHover = trigger('cardHover', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.95)' }),
    animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
  ])
]);

export const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      stagger('100ms', [
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true })
  ])
]);

export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms ease-in', style({ opacity: 1 }))
  ])
]);

export const dropdownAnimation = trigger('dropdownAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.95)', transformOrigin: 'top right' }),
    animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
  ]),
  transition(':leave', [
    animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
  ])
]);

export const buttonInteraction = trigger('buttonInteraction', [
  transition(':enter', [
    style({ transform: 'scale(1)' })
  ]),
  transition('hover => *', [
    animate('100ms ease-in', style({ transform: 'scale(1.05)' }))
  ]),
  transition('* => hover', [
    animate('100ms ease-out', style({ transform: 'scale(1)' }))
  ])
]);
