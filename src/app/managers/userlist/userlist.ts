import { Component, OnInit, Output, Input, AfterViewInit } from '@angular/core';
import { Utility, ServiceHelper } from '../Core';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'xtn-manage-userlist',
  templateUrl: './userlist.html',
  styleUrls: ['./userlist.scss'],
  providers: [ServiceHelper]
})
export class UserListComponent implements OnInit, AfterViewInit {
  public UserInfo: any;
  public userList: any;
  constructor(private sHelper: ServiceHelper) {
    this.UserInfo = {};
  }

  ngOnInit() {
    console.log('on init...');
  }

  ngAfterViewInit(): void {
    console.log('AfterViewInit');
    const c = { pageIndex: 0, pageSize: 15 };
    const __self = this;
    this.sHelper.Userlist(c).then(() => {
      __self.userList = __self.sHelper.Users;
    });
  }

  __ClickDelete(item) {
    this.sHelper.DeleteUser(item).then(() => { });
  }

  __ClickModify(item) {
    console.log(item);
  }
}
