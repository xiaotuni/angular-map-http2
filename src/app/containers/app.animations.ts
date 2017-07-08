import { animate, AnimationEntryMetadata, state, style, transition, trigger } from '@angular/core';

const speed: string = '600ms';

export const routeAnimation: AnimationEntryMetadata = [

    trigger('routing', [
        // state('void', style({ position: 'fixed', width: '100%', left: '0px', top: '0px' })),
        // state('*', style({ position: 'fixed', width: '100%', left: '0px', top: '0px' })),
        state('void', style({ position: 'fixed', width: '100%', left: '0px', })),
        state('*', style({ position: 'fixed', width: '100%', left: '0px', })),
        // 上一页
        transition('void => backward', [style({ transform: 'translateX(-100%)' }), animate('0.6s ease-in-out', style({ transform: 'translateX(0%)' }))]),
        transition('backward => void', [style({ transform: 'translateX(0%)' }), animate('0.6s ease-in-out', style({ transform: 'translateX(100%)' }))]),
        // 下一页
        transition('void => forward', [style({ transform: 'translateX(100%)' }), animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))]),
        transition('forward => void', [style({ transform: 'translateX(0%)' }), animate('0.5s ease-in-out', style({ transform: 'translateX(-100%)' }))])
    ])
]

export function ToRight() {
    return trigger('routerTransition', [
        state('void', style({ position: 'fixed', width: '100%', left: '0px' })),
        state('*', style({ position: 'fixed', width: '100%', left: '0px' })),
        transition(':enter', [style({ transform: 'translateX(-100%)' }), animate('11.5s ease-in-out', style({ transform: 'translateX(0%)' }))]),
        transition(':leave', [style({ transform: 'translateX(0%)' }), animate('11.5s ease-in-out', style({ transform: 'translateX(100%)' }))])
    ]);
}
