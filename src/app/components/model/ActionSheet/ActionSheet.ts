import {
  Component, OnInit, Output, Input, AfterContentInit, AfterContentChecked,
  trigger, state, style, transition, animate
} from '@angular/core';
import { Utility } from '../../Core';

@Component({
  selector: 'xtn-mode-action-sheet',
  templateUrl: './ActionSheet.html',
  styleUrls: ['./ActionSheet.scss'],
  animations: [
    trigger('TriggerState', [
      state('up', style({ transform: 'translateY(0%)' })),
      state('down', style({ transform: 'translateY(100%)' })),
      transition('up => down', animate('100ms ease-in')),
      transition('down => up', animate('100ms ease-out')),
    ])
  ]
})
export class XtnActionSheet implements OnInit, AfterContentInit {
  @Input('ActionSheetInfo') Info: any;
  TriggerStateName: any;
  @Input('Index') __Index: number;
  constructor() { }

  ngOnInit() {
    console.log('ngOnInit', this.Info);
  }

  ngAfterContentInit(): void {
    console.log('ngAfterContentInit-->', this.Info);
    const { ToPage } = this.Info;
    if (ToPage) {
      const { Url, Params } = ToPage;
      if (Url) {
        setTimeout(() => {
          Utility.$ToPage(Url, Params);
        }, 1500);
      }
    }
    this.TriggerStateName = 'down';
    setTimeout(() => {
      this.TriggerStateName = 'up';
    }, 2);
    setTimeout(() => {
      this.__ClickClose();
    }, 1000);
  }
  ngAfterContentChecked(): void {
    const { IsClose } = this.Info;
    if (!!IsClose && this.TriggerStateName === 'up') {
      this.TriggerStateName = 'down';
    }
  }

  __ClickClose() {
    this.TriggerStateName = 'down';
    Utility.$ActionSheetHide(this.__Index);
  }
}
