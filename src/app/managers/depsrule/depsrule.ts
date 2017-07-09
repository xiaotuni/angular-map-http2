import { Component, OnInit, Output, Input } from '@angular/core';
import { Utility, ServiceHelper } from '../Core';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'xtn-manage-depsrule',
  templateUrl: './depsrule.html',
  styleUrls: ['./depsrule.scss'],
  providers: [ServiceHelper]
})
export class DepsRuleComponent implements OnInit {
  public DepInfo: any;
  constructor(private sHelper: ServiceHelper) {
    this.DepInfo = { pid: 1, depname: '', status: true };
  }

  ngOnInit() {
  }

  __ClickRegister() {
    // const data = Object.assign({}, this.UserInfo);
    // console.log(JSON.stringify(data));
    // const a = {
    //   username: data.UserName,
    //   password: CryptoJS.MD5(data.Password).toString(),
    //   tel: data.Tel,
    //   address: data.Address,
    // }
    // const __self = this;
    // this.sHelper.AddUser(a).then(() => {
    //   console.log(__self.sHelper.UserInfo);
    // });
  }

  __ClickAddDep() {
    console.log(JSON.stringify(this.DepInfo));
  }
}
