import { Component, OnInit } from '@angular/core';
import { Utility, Client, CommonComponent } from '../Core';
import { routeAnimation } from '../app.animations';
import { BaseComponent } from '../base.component';
import { ServiceHelper } from '../../service/index';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [routeAnimation],
  providers: [ServiceHelper]
})
export class Home extends BaseComponent implements OnInit {

  public DataList: Array<any>;

  constructor(private sHelper: ServiceHelper) {
    super();
  }

  ngOnInit() {
  }

  __UserInfo(methodType) {
    this.sHelper.DemoService.UserInfo(methodType);
  }
  tempData: any = '哈哈';

  TestEvent(args) {
    console.log('test event-->', args);
  }
  __ShowDialog() {
    const __Html = `<div class="testDemo">
      <div>组件开始</div>
      <xtn-navbar [(Title)]="__Title"></xtn-navbar>
      <div class="homeComCssEnd">组件结束</div>
     </div>`;
    const __Options = {
      html: __Html,
      IsLoadingComponent: true,
      ComponentName: 'XtnMapPlaceItem',
      Params: {
        Inputs: {
          Place: { address: '就在这里啦', },
          Params: { __Title: '里面的参数了' },
          Params2: { Params2: 'Params-->里的信息啦' },
          Params123: { Params123: 'Params123-->里的信息啦' },
          __Title: this.tempData, parma2: '12431243',
        },
        Outputs: {
          onSave: this.TestEvent.bind(this),
          onDelete: this.TestEvent.bind(this),
          onModify: this.TestEvent.bind(this),
        }
      },
    };
    Utility.$Emit(Utility.$ConstItem.Events.ShowModel.onDialog, __Options);
  }
}
