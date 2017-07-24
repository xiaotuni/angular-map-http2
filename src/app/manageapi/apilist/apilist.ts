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
  public ApiList: any;
  public NewApiInfo: any = { RuleInfo: { rules: [] } };
  public CurrentItem: any;
  public isAddNewApiInfo: boolean = false;

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
      console.log(err);
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
    console.log(this.NewApiInfo);
    const _a = JSON.stringify(this.NewApiInfo.RuleInfo);
    this.NewApiInfo.Content = "'" + _a.replace(/'/g, "\\'").replace(/\"/g, '\\"') + "'"
    this.sHelper.ApiManager.AddApi(this.NewApiInfo).then(() => { }, () => { });
  }

  onSaveRule(rule) {
    console.log('rule-->', JSON.stringify(rule));
    this.sHelper.ApiManager.Modify(rule);
  }
  onDeleteRule(rule) {
    this.sHelper.ApiManager.DeleteById(rule);
  }
}
