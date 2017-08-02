import { Component, OnInit } from '@angular/core';
import { ServiceHelper, BaseComponent, routeAnimation, Utility, Client, } from '../Core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [routeAnimation],
  providers: [ServiceHelper]
})
export class Home extends BaseComponent implements OnInit {
  tempData: any = '哈哈';
  public DataList: Array<any>;

  constructor(private sHelper: ServiceHelper) {
    super();
  }

  ngOnInit() {
  }

  __UserInfo(methodType) {
    this.sHelper.DemoService.UserInfo(methodType).then((result) => {
      console.log('result', result);
    }, (a) => {
      console.log(a);
    });
  }

  TestEvent(args) {
    console.log('test event-->', args);
  }

  __ShowDialog() {
    // Utility.$ShowMessage('这是一个标题', '这里是内容了，随便写的东西，看看出来的情况吧。');

    Utility.$ShowDialogComponent('XtnMapPlaceItem', {
      Place: { address: '就在这里啦', },
      Params: { __Title: '里面的参数了' },
      Params2: { Params2: 'Params-->里的信息啦' },
      Params123: { Params123: 'Params123-->里的信息啦' },
      __Title: this.tempData, parma2: '12431243',
    }, {
        onSave: (ee) => {
          console.log(ee);
          Utility.$ShowMessage('标题', '这是弹出来的内容');
          if (ee.dialog) {
            ee.dialog.onClose();
          }
          // Utility.$ShowDialogHide(0);
        },
        onDelete: this.TestEvent.bind(this),
        onModify: this.TestEvent.bind(this),
      });

  }
}
