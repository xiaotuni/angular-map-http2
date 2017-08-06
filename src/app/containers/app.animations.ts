import { animate, AnimationEntryMetadata, state, style, transition, trigger } from '@angular/core';

const { height } = screen;
const __top = 36;
const __height = (height - __top) / height * 100;

const __style = {
    position: 'fixed', width: '100%', left: '0px', top: '0px', paddingTop: __top + 'px',
    height: __height + '%', overflow: 'auto'
};
export const routeAnimation: AnimationEntryMetadata = [

    trigger('routing', [ // paddingTop 添加这个是为了导航长的高度。 
        state('void', style(__style)),
        state('*', style(__style)),
        // state('void', style({ position: 'fixed', width: '100%', left: '0px', })),
        // state('*', style({ position: 'fixed', width: '100%', left: '0px', })),
        // 上一页
        transition('void => backward', [style({ transform: 'translateX(-100%)' }), animate('0.4s ease-in-out', style({ transform: 'translateX(0%)' }))]),
        transition('backward => void', [style({ transform: 'translateX(0%)' }), animate('0.4s ease-in-out', style({ transform: 'translateX(100%)' }))]),
        // 下一页
        transition('void => forward', [style({ transform: 'translateX(100%)' }), animate('0.4s ease-in-out', style({ transform: 'translateX(0%)' }))]),
        transition('forward => void', [style({ transform: 'translateX(0%)' }), animate('0.4s ease-in-out', style({ transform: 'translateX(-100%)' }))])
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
