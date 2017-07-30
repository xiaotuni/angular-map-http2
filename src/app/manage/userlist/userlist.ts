import { Component, OnInit, Output, Input, AfterViewInit } from '@angular/core';
import { Utility, ServiceHelper, BaseComponent, routeAnimation } from '../Core';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'xtn-manage-userlist',
  templateUrl: './userlist.html',
  styleUrls: ['./userlist.scss'],
  animations: [routeAnimation],
  providers: [ServiceHelper]
})
export class UserList extends BaseComponent implements OnInit, AfterViewInit {
  public UserInfo: any;
  public userList: any;
  constructor(private sHelper: ServiceHelper) {
    super();
    this.UserInfo = {};
  }

  ngOnInit() {
    console.log('on init...');
  }

  ngAfterViewInit(): void {
    console.log('AfterViewInit');
    const c = { pageIndex: 0, pageSize: 15 };
    const __self = this;
    this.sHelper.UserInfo.Userlist(c).then(() => {
      __self.userList = __self.sHelper.UserInfo.Users;
    });
  }

  __ClickDelete(item) {
    this.sHelper.UserInfo.DeleteUser(item).then(() => { });
  }

  __ClickModify(item) {
    console.log(item);
  }
}
