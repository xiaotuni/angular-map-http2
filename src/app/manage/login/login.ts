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
  constructor(private sHelper: ServiceHelper) {
    this.UserInfo = { username: 'admin', password: 'admin@163.com' };
  }

  ngOnInit() {
  }

  submit() {
    const data = Object.assign({}, this.UserInfo);
    data.password = CryptoJS.MD5(data.password).toString();
    const __self = this;
    this.sHelper.UserInfo.Login(data).then(() => {
      // console.log(__self.sHelper.UserInfo.UserInfo);
    });
  }

  forgetPassword() {
    console.log('forgetPassword');
  }
}
