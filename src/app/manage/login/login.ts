import { Component, OnInit, Output, Input } from '@angular/core';
import { Utility, ServiceHelper } from '../Core';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'xtn-manage-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  providers: [ServiceHelper]
})
export class LoginComponent implements OnInit {
  public UserInfo: any;
  QueryParams: any;

  constructor(private sHelper: ServiceHelper) {
    this.UserInfo = { username: 'admin', password: 'admin@163.com' };

  }

  ngOnInit() {
    const __self = this;
    Utility.$On(Utility.$ConstItem.QueryParams, (params) => {
      __self.QueryParams = params;
    });
  }

  submit() {
    const data = Object.assign({}, this.UserInfo);
    data.password = CryptoJS.MD5(data.password).toString();
    const __self = this;
    this.sHelper.UserInfo.Login(data).then(() => {

    }, () => { });
  }

  forgetPassword() {
    console.log('forgetPassword');
  }
}
