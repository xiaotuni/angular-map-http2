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
  ScrollInfo: any;
  public DataList: Array<any>;
  AreaInfo: any;

  constructor(private sHelper: ServiceHelper) {
    super();
    this.ScrollInfo = {};
  }

  ngOnInit() {
    // this.__ShowDialog();
  }

  __UserInfo(methodType) {
    this.sHelper.DemoService.UserInfo(methodType).then((result) => {
    }, (a) => {
    });
  }

  TestEvent(args) {
    console.log('test event-->', args);
  }

  __ShowDialog2() {
    Utility.$ShowDialogComponent('XtnConfirm',
      { Title: 'XtnConfirm组件' },
      {
        onConfirm: (event) => {
          const { dialog, args } = event;
          console.log(args);
          dialog.onClose();
        }
      });

  }

  __ShowDialog() {
    Utility.$ShowDialogComponent('XtnMapPlaceItem', {
      Place: { Address: '就在这里啦', },
    }, {
        onSave: (ee) => {
          Utility.$ShowMessage('标题', '这是弹出来的内容');
          if (ee.dialog) {
            ee.dialog.onClose();
          }
        },
        onDelete: this.TestEvent.bind(this),
        onModify: (event) => {
          console.log('on modify--', event);
        },
      });
  }




  
  __GetArearData(Condition) {
    const { ScrollInfo } = this;
    const { Common } = this.sHelper;
    const self = this;
    Common.GetArea(Condition).then(() => {
      ScrollInfo.IsRefreshFinish = true;
      ScrollInfo.IsNextPageFinish = true;
      self.AreaInfo = Common.AreaInfo;
    }, () => {
      ScrollInfo.IsRefreshFinish = true;
      ScrollInfo.IsNextPageFinish = true;
    });
  }

  onScrollRefresh() {
    this.ScrollInfo.IsRefreshFinish = false;
    this.__GetArearData(null);
  }
  onScrollNextPage() {
    this.ScrollInfo.IsNextPageFinish = false;
    const { AreaInfo } = this.sHelper.Common;
    this.__GetArearData(AreaInfo && AreaInfo.Condition ? AreaInfo.Condition : null);
  }
  onSlideLeft() {
    console.log('向左边滑动啦...');
  }
  onSlideRight() {
    console.log('向右边滑动..');
  }
}
