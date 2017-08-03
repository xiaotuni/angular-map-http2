import { Component, OnInit, Output, Input } from '@angular/core';
import { Utility, ServiceHelper, routeAnimation, BaseComponent } from '../Core';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'xtn-manage-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  animations: [routeAnimation],   // 页面切换动画
  providers: [ServiceHelper]      // 注入一个service
})
export class Login extends BaseComponent implements OnInit {
  public UserInfo: any;

  /**
   * Creates an instance of Login.
   * @param {ServiceHelper} sHelper service用于接口调用等
   * @memberof Login
   */
  constructor(private sHelper: ServiceHelper) {
    super();
    this.UserInfo = { username: 'admin', password: 'admin@163.com' };
  }

  ngOnInit() {
  }

  /**
   * 点击登录按钮
   * 
   * @memberof Login
   */
  submit() {
    const data = Object.assign({}, this.UserInfo);
    data.password = CryptoJS.MD5(data.password).toString();
    this.sHelper.UserInfo.Login(data).then(() => {
      const { Params } = Utility.$GetContent(Utility.$ConstItem.UrlPathInfo) || { Params: {} };
      const { IsGoBack } = Params || { IsGoBack: 0 };
      if (!!Number(IsGoBack)) {
        Utility.$GoBack();
      } else {
        Utility.$ToPage(Utility.$ConstItem.UrlItem.ManagerDashboard, {});
      }
    }, () => {
     
    });
  }

  forgetPassword() {
  }
}
