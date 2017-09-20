import superagent from 'superagent';
import { Utility } from '../Common/Utility';

const methods = ['get', 'post', 'put', 'patch', 'del'];

/**
 * 格式化URL
 * 
 * @param {any} path 
 * @returns 
 */
function formatUrl(path) {
  const __path = path[0] !== '/' ? '/' + path : path;
  const _ApiUrl = 'https://127.0.0.1:30081/webapi' + __path;
  return _ApiUrl;
}

/**
 * 访问接口类
 * 
 * @export
 * @class ApiClient
 */
export default class ApiClient {

  API = {
    Common: {
      /**
       * GET api/depts 获取组织机构
       * -------------------------------------参入的参数-------------------------------------------
       */
      Organization: '/depts',
      /**
       * post
       */
      SaveUser: '/saveUser',
      UserLogin: '/userinfo/user',
      AddUser: '/userinfo/register',
      Userlist: '/userinfo/users',
      DeleteUser: '/userinfo/user',
      Area: '/common/area',
      /**
       * get 根据Id获取信息
       */
      AreaById: '/base/AreaById',
      Captcha: '/apihelper/captcha',
      FileUpload: '/apihelper/fileupload',
      FilesUpload: '/apihelper/filesupload',
      CallThirdPartyApi: '/callThirdPartyApi',
    },
    Api: {
      List: '/manager/api/list',
      Add: '/manager/api/add',
      Delete: '/manager/api/info',
      Modify: '/manager/api/info',
    },
    UserInfo: {
      Info: '/userinfo/user',
      Add: '/userinfo/user',
      Delete: '/userinfo/user',
      Put: '/userinfo/user',
      Login: '/userinfo/login',
    },
    Map: {
      /**
       * post header token 加入活动
       * -------------------------------------- 
       */
      JoinPlace: '/map/joinplace',
      /**
       * post header token 添加活动起点
       * -------------------------------------- 
       */
      AddPlace: '/map/place',
      /**
       * get header token 获取我的活动点列表
       * --------------------------------------
       */
      MyPlaceList: '/map/placelist',
      /**
       * get header token 获取活动详情
       * -----------------------------------
       */
      JoinPlaceDetail: '/map/joinplacedetail',
      /**
       * put header token 更新当前的位置
       * -----------------------------------
       */
      UpdatePosition: '/map/place/join/detail',
    }
  }

  GetFormData(files) {
    const formData = new FormData();
    formData.append('test1', 'test_1');
    formData.append('test2', 'test_2');
    formData.append('test3', 'test_3');
    files.forEach((file) => {
      formData.append(file.name, file, file.name);
    });
    return formData;
  }

  /**
   * Creates an instance of ApiClient.
   * @param {any} req 
   * @memberof ApiClient
   */
  constructor(req) {
    /**
     * 循环生成五个方法
     */
    methods.forEach((method) => {
      this[method] = (path, condition) => {
        const { params, data, isFormData } = condition || { params: null, data: null, isFormData: false };
        return new Promise((resolve, reject) => {
          const request = superagent[method](formatUrl(path));
          const { token } = Utility.$GetContent(Utility.$ConstItem.UserInfo) || { token: null };
          request.header.xiaotuni = 'liaohaibing_' + new Date().getTime();
          request.header.token = token;
          if (params) {
            request.query(params);
          }

          if (req && req.get('cookie')) {
            request.set('cookie', req.getCookie());
          }

          if (path === this.API.Common.FilesUpload) {
            request.send(this.GetFormData(data));
          } else if (data) {
            if (!!isFormData) {
              const fd = new FormData();
              Object.keys(data).forEach((field) => {
                fd.append(field, data[field])
              });
              request.send(fd);
            } else {
              request.send(data);
            }
          }
          const { HttpStatus } = Utility.$ConstItem.Events;
          /**
           * 错误处理及提示
           *
           * @param {any} err
           */
          function __ProcessError(err, body, __req) {
            try {
              Utility.$LoadingHide();
              const { code, msg } = body || { code: 400, msg: '处理错误' };
              if (err.status) {
                if (HttpStatus[err.status]) {
                  if (err.status === 400 && HttpStatus[__req.status]) {
                    Utility.$Emit(HttpStatus[__req.status], { code: code || __req.status, msg: msg || err.message, body });
                  } else {
                    Utility.$Emit(HttpStatus[err.status], { code: code || err.status, msg: msg || err.message, body });
                  }
                } else {
                  Utility.$Emit(HttpStatus[400], { code: err.status, msg: err.message });
                }
              } else if (!!err.crossDomain) {
                Utility.$ActionSheet('与服务器连接中断...');
              } else if (err.message && err.message !== '') {
                Utility.$ActionSheet(err.message);
              }
            } catch (ex) {
              console.log(ex);
            }
          }

          const __PageTurning = (body) => {
            const { PageIndex, PageSize } = params || { PageSize: null, PageIndex: null };
            if (PageIndex >= 0) {
              if (Array.isArray(body)) {
                const __Size = body.length;
                const Condition = Object.assign({}, params);
                Condition.IsNextData = __Size === PageSize ? true : false;
                Condition.PageIndex++;
                return {
                  List: body,
                  Condition
                };
              }
            }
            return body;
          }

          function __SendRequest(_request) {
            _request.end((err, Response) => {
              const { body } = Response || { body: {} };
              if (err) {
                __ProcessError(err, body, Response);
                reject(body);
              } else {
                if (!body) {
                  Utility.$Emit(HttpStatus[Response.status], { status: Response.status, msg: '处理成功', Response });
                }
                resolve(__PageTurning(body));
              }
            });
          }

          try {
            __SendRequest(request);
          } catch (ex) {
            console.log(ex);
            reject({ code: 500, msg: ex.message })
          }
        });
      }
    });
  }
  empty() {
  }
}
