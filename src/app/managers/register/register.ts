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
    this.UserInfo = {};// username: 'admin', password: 'admin@163.com' };
  }

  ngOnInit() {
  }

  __ClickRegister() {
    const data = Object.assign({}, this.UserInfo);
    console.log(JSON.stringify(data));
    const a = {
      username: data.UserName,
      password: CryptoJS.MD5(data.Password).toString(),
      tel: data.Tel,
      address: data.Address,
    }
    const __self = this;
    this.sHelper.AddUser(a).then(() => {
      console.log(__self.sHelper.UserInfo);
    });
  }

}
