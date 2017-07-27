import { Component, OnInit, Output, Input } from '@angular/core';
import { Utility, ServiceHelper } from '../Core';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'xtn-manage-register',
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  providers: [ServiceHelper]
})
export class RegisterComponent implements OnInit {
  public UserInfo: any;
  constructor(private sHelper: ServiceHelper) {
    this.UserInfo = {};
  }

  ngOnInit() {
  }

  __ClickRegister() {
    const data = Object.assign({}, this.UserInfo);
    data.Password = CryptoJS.MD5(this.UserInfo.Password).toString();
    const __self = this;
    this.sHelper.UserInfo.AddUser(data).then(() => {
      console.log(__self.sHelper.UserInfo);
    });
  }

}
