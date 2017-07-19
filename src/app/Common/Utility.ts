import { Router } from '@angular/router';
import { Location } from '@angular/common';
// import { HttpHelper } from './HttpHelpers';
/**
 * 通用类
 * 
 * @export
 * @class Utility
 */
export class Utility {
  private static __TempContent = {};
  // static __Instance: Utility;

  // private _TempSaveContent: Object;
  constructor() {
    // this._TempSaveContent = {};
  }

  /**
   * 常量
   * 
   * @static
   * 
   * @memberOf Utility
   */
  static $ConstItem = {
    Route: 'XTN_Router',
    Location: 'XTN_Location',
    AppIsGoBack: 'XTN_APP_IS_GO_BACK',
    BrowerTitle: 'XTN_BrowerTitle',
    Event: 'XTN_EVENT_INFO',
    Events: {
      HttpStatus: {
        400: 'XTN_HTTP_STATUS_404',
        401: 'XTN_HTTP_STATUS_401',
        402: 'XTN_HTTP_STATUS_402',
        403: 'XTN_HTTP_STATUS_403',
        404: 'XTN_HTTP_STATUS_404',
        405: 'XTN_HTTP_STATUS_405',
        500: 'XTN_HTTP_STATUS_500',
        501: 'XTN_HTTP_STATUS_501',
      },
      ShowModel: {
        onActionSheet: 'XTN_MODEL_ACTION_SHEET',
        onActionSheetHide: 'XTN_MODEL_ACTION_SHEET_HIDE',
        onLoading: 'XTN_MODEL_LOADING',
        onLoadingHide: 'XTN_MODEL_LOADING_HIDE',
        onDialog: 'XTN_MODEL_DIALOG',
        onDialogHide: 'XTN_MODEL_DIALOG_HIDE',
      }
    },
    UrlItem: {
      GoBack: 'XTN_GOBACK',
      Home: 'home',
      BaiduMap: 'baidumap',
      Member: 'member',
      MyComponent: 'mycomponent',
      Product: 'product',
      ManagerLogin: 'manager/login',
      ManagerRegister: 'manager/register',
      ManagerUserlist: 'manager/userlist',
      ApiList: 'api/list',
    },
    UrlTitle: {
      '/home': { Title: '首页', },
      '/baidumap': { Title: '百度地图', },
      '/member': { Title: '成员', },
      '/mycomponent': { Title: '我的组件', },
      '/product': { Title: '产品', },
      '/manager/login': { Title: '登录', },
      '/manager/register': { Title: '注册', },
      '/manager/userlist': { Title: '用户列表', },
      '/api/list': { Title: '接口列表', },
    }
  };

  static $Emit(eventName, args) {
    if (!eventName || eventName === '') {
      return;
    }
    const __event = this.$GetContent(this.$ConstItem.Event);
    if (!__event) {
      return;
    }
    __event.emit(eventName, args);
  }
  static $On(eventName, callback) {
    if (!eventName || eventName === '') {
      return;
    }
    const __event = this.$GetContent(this.$ConstItem.Event);
    if (!__event) {
      return;
    }
    __event.on(eventName, callback);
  }

  static $Loading() {
    this.$Emit(this.$ConstItem.Events.ShowModel.onLoading, null);
  }
  static $LoadingHide() {
    this.$Emit(this.$ConstItem.Events.ShowModel.onLoadingHide, null);
  }

  static $ActionSheet(msg) {
    this.$Emit(this.$ConstItem.Events.ShowModel.onActionSheet, { msg });
  }

  static $ActionSheetHide() {
    this.$Emit(this.$ConstItem.Events.ShowModel.onActionSheetHide, null);
  }

  static $ShowDialog(Title, Msg, OkBtn, CancelBtn, Options) {
    this.$Emit(this.$ConstItem.Events.ShowModel.onDialog, { Title, Msg, OkBtn, CancelBtn, Options });
  }

  static $ShowDialogHide() {
    this.$Emit(this.$ConstItem.Events.ShowModel.onDialogHide, null);
  }


  /**
   * 保存内容
   * 
   * @static
   * @param {string} key
   * @param {*} Content
   * @param {boolean} IsSaveLocalStore
   * @returns
   * 
   * @memberOf Utility
   */
  static $SetContent(key: string, Content: any, IsSaveLocalStore: boolean) {
    if (!key) {
      return;
    }
    this.__TempContent[key] = Content;
    if (!!IsSaveLocalStore) {
      window.localStorage.setItem(key, JSON.stringify(Content));
    }
  }

  static $GetContent(key: string) {
    if (!key) {
      return null;
    }

    let __value = this.__TempContent[key];
    if (__value) {
      return __value;
    }
    __value = window.localStorage.getItem(key);
    if (__value) {
      __value = JSON.parse(__value);
      this.__TempContent[key] = __value;
      return __value;
    }
    return null;
  }

  static $RemoveContent(key: string, IsSaveLocalStore: boolean) {
    if (!key) {
      return;
    }
    delete this.__TempContent[key];
    if (!!IsSaveLocalStore) {
      window.localStorage.removeItem(key);
    }
  }

  /**
   * go to page
   * 
   * @static
   * @param {string} url 
   * @param {*} params 
   * @returns 
   * 
   * @memberof Utility
   */
  static $ToPage(url: string, params: any) {
    const __Route: Router = this.$GetContent(this.$ConstItem.Route);
    if (!__Route) {
      return;
    }
    if (this.$ConstItem.UrlItem.GoBack === url) {
      const __Location: Location = this.$GetContent(this.$ConstItem.Location);
      if (__Location) {
        console.log('go back~~~');
        __Location.back();
      }
      setTimeout(() => {
        this.$RemoveContent(this.$ConstItem.AppIsGoBack, false);
      }, 650);
      return;
    }

    // __Route.navigate(['/' + url, { key: 1234, qq: 'qq1234' }], { queryParams: { a: 1111, b: 'adsfa', c: 'queryString' } });
    // Navigate to /results?page=1
    // this.router.navigate(['/results'], { queryParams: { page: 1 } });
    const __params = Object.assign(params || {}, { __timestamp: new Date().getTime() });
    __Route.navigate(['/' + url], { queryParams: __params });
  }

  static $GoBack() {
    this.$SetContent(this.$ConstItem.AppIsGoBack, true, false);
    this.$ToPage(this.$ConstItem.UrlItem.GoBack, {});
  }

  /**
  * 格式化
  * @example
  * format('{0} is dead, but {1} is alive! {0} {2}', 'ASP', 'ASP.NET');
  * ASP is dead, but ASP.NET is alive! ASP {2}
  * @param format
  * @returns {*}
  */
  static $format(format) {
    const args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, (match, number) => {
      return typeof args[number] !== 'undefined'
        ? args[number] : match;
    });
  }
}
