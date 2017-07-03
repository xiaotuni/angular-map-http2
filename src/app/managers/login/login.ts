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
    console.log('------------', this.UserInfo);
    console.log(CryptoJS.MD5('xiaotuni').toString());
    this.sHelper.Login(this.UserInfo);
  }

  forgetPassword() {
    console.log('forgetPassword');
  }
}
