import { Component, OnInit, Output, Input } from '@angular/core';
import { Utility } from '../../Core';

@Component({
  selector: 'xtn-mode-action-sheet',
  templateUrl: './ActionSheet.html',
  styleUrls: ['./ActionSheet.scss']
})
export class XtnActionSheet implements OnInit {
  @Input('ActionSheetInfo') Info: any;

  constructor() { }

  ngOnInit() {
    console.log('ActionSheetInfo', this.Info);
    const { ToPage } = this.Info;
    if (ToPage) {
      const { Url, Params } = ToPage;
      if (Url) {
        setTimeout(() => {
          Utility.$ToPage(Url, Params);
        }, 1500);
      }
    }
  }

  __ClickClose() {
    Utility.$ActionSheetHide();
  }
}
