import { Component, OnInit, Output, Input } from '@angular/core';
import { Utility } from '../Core';
@Component({
  selector: 'xtn-manage-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {
  public UserInfo: any;
  constructor() {
    this.UserInfo = { username: 'admin', password: 'admin@163.com' };
  }

  ngOnInit() {
  }

  submit() {
    console.log('------------', this.UserInfo);
  }

  forgetPassword() {
    console.log('forgetPassword');
  }
}
