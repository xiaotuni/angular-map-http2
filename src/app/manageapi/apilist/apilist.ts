import { Component, OnInit, Output, Input } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Utility, ServiceHelper } from '../Core';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'xtn-manage-apilist',
  templateUrl: './apilist.html',
  styleUrls: ['./apilist.scss'],
  providers: [ServiceHelper],
  animations: [trigger(
    'openClose',
    [
      state('collapsed, void', style({ height: '0px', color: 'maroon', borderColor: 'maroon' })),
      state('expanded', style({ height: '*', borderColor: 'green', color: 'green' })),
      transition(
        'collapsed <=> expanded', [animate(500, style({ height: '250px' })), animate(500)])
    ])]
})
export class ApiList implements OnInit {
  public ApiList: any;
  public NewApiInfo: any = { RuleInfo: { rules: [] } };
  public CurrentItem: any;
  public isAddNewApiInfo: boolean = false;
  stateExpression: string = 'collapsed';

  constructor(private sHelper: ServiceHelper) {
  }

  ngOnInit() {
    const __self = this;
    this.sHelper.ApiManager.List().then(() => {
      __self.ApiList = __self.sHelper.ApiManager.ApiList;
      const { ApiList } = __self;
      if (Array.isArray(ApiList)) {
        __self.CurrentItem = ApiList[ApiList.length - 1];
      }
    }, (err) => {
    });
  }

  onClickExpand(item) {
    if (this.CurrentItem === item) {
      this.CurrentItem = null;
    } else {
      this.CurrentItem = item;
    }
  }

  btnClickAdd() {
    this.isAddNewApiInfo = !this.isAddNewApiInfo;
  }

  btnClickSave() {
    this.NewApiInfo.Id = -1;
    this.sHelper.ApiManager.AddApi(this.NewApiInfo).then(() => {

    }, () => { });
  }

  onSaveRule(rule) {
    this.sHelper.ApiManager.AddApi(rule).then((data) => {
      Utility.$ShowMessage('接口列表', '添加或修改成功。');
    }, (ee) => {
    });
  }

  onDeleteRule(rule) {
    this.sHelper.ApiManager.DeleteById(rule);
  }
}
