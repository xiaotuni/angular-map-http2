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
  const _ApiUrl = 'https://127.0.0.1:30001/webapi' + __path;
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
      Area: '/base/area',
      /**
       * get 根据Id获取信息
       */
      AreaById: '/base/AreaById',
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
       * post header token 添加活动起点
       * -------------------------------------- 
       */
      AddPlace: '/map/place',
      /**
       * get header token 获取我的活动点列表
       * --------------------------------------
       */
      MyPlaceList: '/map/placelist',
    }
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
        const { params, data } = condition || { params: null, data: null };
        return new Promise((resolve, reject) => {
          const request = superagent[method](formatUrl(path));

          if (params) {
            request.query(params);
          }

          if (req && req.get('cookie')) {
            request.set('cookie', req.get('cookie'));
          }

          if (data) {
            request.send(data);
          }

          const { token } = Utility.$GetContent(Utility.$ConstItem.UserInfo) || { token: null };

          request.header.xiaotuni = 'liaohaibing_' + new Date().getTime();
          request.header.token = token;

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
                resolve(body);
              }
            });
          }

          try {
            __SendRequest(request);
          } catch (ex) {
            console.log(ex);
          }
        });
      }
    });
  }
  empty() {
  }
}
