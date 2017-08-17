import { Component, OnInit, Output, Input } from '@angular/core';
import { Utility, ServiceHelper, routeAnimation, BaseComponent } from '../Core';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'xtn-manage-register',
  templateUrl: './register.html',
  animations: [routeAnimation],
  styleUrls: ['./register.scss'],
  providers: [ServiceHelper]
})
export class Register extends BaseComponent implements OnInit {
  public UserInfo: any;
  constructor(private sHelper: ServiceHelper) {
    super();
    this.UserInfo = { UserName: 1, Password: 1, ConfromPassword: 1, Tel: '12142141', Address: 'address' };
  }

  ngOnInit() {
  }

  __ClickRegister() {
    const data = Object.assign({}, this.UserInfo);
    data.Password = CryptoJS.MD5(this.UserInfo.Password).toString();
    const __self = this;
    this.sHelper.UserInfo.AddUser(data).then(() => {
    });
  }

  onChangeHeadPortrait(event, field) {
    this.UserInfo[field] = event.currentTarget.files[0];
  }
}
