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
    UserInfo: 'XTN_USER_INFO',
    QueryParams: 'XTN_QUERY_PARAMS',
    UrlPathInfo: 'XTN_URL_PATH_INFO',

    Events: {
      HttpStatus: {
        400: 'XTN_HTTP_STATUS_400',
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
      BaiduMapMyPlace: 'baidumap/myplace',
      Member: 'member',
      MyComponent: 'mycomponent',
      Product: 'product',
      ManagerLogin: 'manager/login',
      ManagerDashboard: 'manager/dashboard',
      ManagerRegister: 'manager/register',
      ManagerUserlist: 'manager/userlist',
      ApiList: 'api/list',
    },
    UrlTitle: {
      '/home': { Title: '首页', },
      '/baidumap': { Title: '地图', },
      '/baidumap/myplace': { Title: '我发起的活动', },
      '/member': { Title: '成员', },
      '/mycomponent': { Title: '我的组件', },
      '/product': { Title: '产品', },
      '/manager/login': { Title: '登录', },
      '/manager/dashboard': { Title: '个人中心', },
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

  static $ActionSheetHide(actionIndex = -1) {
    this.$Emit(this.$ConstItem.Events.ShowModel.onActionSheetHide, actionIndex);
  }

  static $ShowDialog(Title, Msg, OkBtn, CancelBtn, Options) {
    this.$Emit(this.$ConstItem.Events.ShowModel.onDialog, { Title, Msg, OkBtn, CancelBtn, Options });
  }

  static $ShowDialogHide(dialogIndex = -1) {
    this.$Emit(this.$ConstItem.Events.ShowModel.onDialogHide, dialogIndex);
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

  /**
   * 弹出动态创建组件
   * 
   * @static
   * @param {any} ComponentName 组件名称 XtnMapPlaceItem
   * @param {any} Inputs 输入的参数 {Field:'哈哈',Params1:{},...}
   * @param {any} Outputs 输入出一的参数 { onSave: ()=>{},onConfirm:()=>{},onCancel:()=>{} ...}
   * @memberof Utility
   */
  static $ShowDialogComponent(ComponentName, Inputs, Outputs) {
    const __Options = {
      IsLoadingComponent: true,
      IsShowCancel: true,
      IsShowConfirm: true,
      ComponentName: ComponentName,
      Params: { Inputs, Outputs },
    };
    this.$Emit(this.$ConstItem.Events.ShowModel.onDialog, __Options);
  }

  static $ShowMessage(Title, Msg) {
    this.$Emit(this.$ConstItem.Events.ShowModel.onDialog, {
      IsLoadingComponent: false,
      IsShowCancel: false,
      IsShowConfirm: true,
      IsShowTitle: true,
      Title: Title,
      Msg: Msg,
    });
  }


  /**
   * 判断是否是日期类型
   *
   * @static
   * @param {any} obj  判断对象
   * @returns {boolean} true: 是日期，false:不是日期。
   * @example
   *        Utility.$IsDate('abcadfa')  ---> false
   *        Utility.$IsDate(new Date()) ---> true
   *        Utility.$IsDate('2013年10月10日') ---> true
   * @memberOf Utility
   */
  static $IsDate(obj) {
    if (typeof obj === 'undefined' || obj === null || obj === '') {   // 判断是不是 undefined,或 null
      return false;
    }
    const __isDate = obj.constructor.name === 'Date';  // 如果传入的就是日期
    if (__isDate) {
      return true;
    }
    try {
      return (new Date(obj.replace('年', '-').replace('月', '-').replace('日', ''))).constructor.name === 'Date';
    } catch (ex) {
      return false;
    }
  }
  /**
   * 将日期转为时间戳
   *
   * @static    * @param {any} date
   * @returns
   *
   * @memberOf Utility
   */
  static $ConvertToTimestamp(date) {
    if (typeof date === 'undefined' || date === null || date === '') {
      return 0;
    }
    if (this.$IsDate(date)) {
      return date.constructor.name === 'Date' ? date.getTime() : new Date(date.replace('年', '-').replace('月', '-').replace('日', '').replace(/-/g, '/')).getTime();
    }
    return 0;
  }

  /**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * @method __FormatDate
 * @param fmt
 * @param date
 * @return {*}
 * @example
 *  Utility.FormatDate('yyyy-MM-dd hh:mm:ss.S',new Date());
 * @constructor
 */
  static $FormatDate(date, fmt) {
    if (!date) {
      return '';
    }
    let __this = new Date();
    let _fmt = fmt || 'yyyy-MM-dd HH:mm:ss.S';
    if (date !== null) {
      if (Date.parse(date)) {
        __this = date;
      } else {
        try {
          __this = new Date(date);
        } catch (ex) {
          __this = new Date();
        }
      }
    }
    const oo = {
      'M+': __this.getMonth() + 1,                    // 月份
      'd+': __this.getDate(),                         // 日
      'D+': __this.getDate(),                         // 日
      'H+': __this.getHours(),                        // 小时
      'h+': __this.getHours(),                        // 小时
      'm+': __this.getMinutes(),                      // 分
      's+': __this.getSeconds(),                      // 秒
      'q+': Math.floor((__this.getMonth() + 3) / 3),  // 季度
      'S': __this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(_fmt)) {
      /(y+)/.exec(_fmt);
      const fmt1 = _fmt.replace(RegExp.$1, (__this.getFullYear() + '').substr(4 - RegExp.$1.length));
      _fmt = fmt1;
    }
    for (const kk in oo) {
      if (new RegExp('(' + kk + ')').test(fmt)) {
        _fmt = _fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (oo[kk]) : (('00' + oo[kk]).substr(('' + oo[kk]).length)));
      }
    }
    return _fmt;
  }
}
