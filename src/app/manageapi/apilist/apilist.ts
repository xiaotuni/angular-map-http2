import { Component, OnInit, Output, Input } from '@angular/core';
import { Utility, ServiceHelper } from '../Core';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'xtn-manage-apilist',
  templateUrl: './apilist.html',
  styleUrls: ['./apilist.scss'],
  providers: [ServiceHelper]
})
export class ApiListComponent implements OnInit {
  public UserInfo: any;
  public ApiList: any;
  public NewApiInfo: any = { RuleInfo: { rules: [] } };
  public CurrentItem: any;
  public isAddNewApiInfo: boolean = false;

  constructor(private sHelper: ServiceHelper) {

    this.UserInfo = { username: 'admin', password: 'admin@163.com' };
  }

  ngOnInit() {
    const __self = this;
    this.sHelper.ApiManager.List().then(() => {
      __self.ApiList = __self.sHelper.ApiManager.ApiList;
    }, (err) => {
      console.log(err);
    });
  }

  __ClickExpand(item) {
    if (this.CurrentItem === item) {
      this.CurrentItem = null;
    } else {
      this.CurrentItem = item;
    }
  }

  __ClickDeleteItem(item, b, c) {
    console.log('__ClickDeleteItem-->', item, b, c);
  }

  __ClickAddApi() {
    // const newApi = JSON.parse(JSON.stringify(this.ApiList[this.ApiList.length - 1]));
    // this.ApiList.push(newApi);

    this.isAddNewApiInfo = !this.isAddNewApiInfo;
  }

  __ClickSaveApi() {
    console.log(this.NewApiInfo);
    const _a = JSON.stringify(this.NewApiInfo.RuleInfo);
    this.NewApiInfo.Content = "'" + _a.replace(/'/g, "\\'").replace(/\"/g, '\\"') + "'"
    this.sHelper.ApiManager.AddApi(this.NewApiInfo).then(() => { }, () => { });
  }
}
