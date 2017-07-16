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
  public CurrentItem: any;
  constructor(private sHelper: ServiceHelper) {
    this.UserInfo = { username: 'admin', password: 'admin@163.com' };
  }

  ngOnInit() {
    console.log(this.sHelper);
    const __self = this;
    this.sHelper.ApiManager.List().then(() => {
      const a = __self;
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
}
