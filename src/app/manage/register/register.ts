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
    this.UserInfo = {};
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

  onChangeHeadPortrait(event) {
    this.UserInfo.HeadPortrait = event.currentTarget.files[0];
  }
}
