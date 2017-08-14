const http = require('http2');
// const http = require('http');
const util = require('util');
const querystring = require('querystring');
const url = require('url');
const path = require('path');
const fs = require('fs');
const api = require('./ctrl_es6/index');
const MySqlHelper = require('./ctrl_es6/DbHelper');
const ManagerQueue = require('./ManagerQueue');

/**
 * 为什么在这里引用呢，JS是从上向下找的，如果在send()之前没有找到 __MQ变量的话，会报错误
 * 在每个请求处理完Send()之后，要调用 __MQ.Next()方法。
 * 所在就在这里引用进来。
 */
const __MQ = new ManagerQueue(MySqlHelper);

/**
 * 日期格式化
 * var time1 = new Date().Format(“yyyy-MM-dd”);
 * var time2 = new Date().Format(“yyyy-MM-dd hh:mm:ss”);
 * var time2 = new Date().Format(“yyyy-MM-dd hh:mm:ss.S”);
 * @param fmt
 * @returns {*}
 * @constructor
 */
Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

/**
 * 发送内容到界面上去.
 * @param data
 */
http.ServerResponse.prototype.Send = function (data) {
  this.write(JSON.stringify(data));
  this.end();
  // 处理下一个请求。
  __MQ.Next();
};
http.ServerResponse.prototype.SendImgSvg = function (data) {
  this.setHeader('Content-Type', 'image/svg+xml');
  this.write(String(data));
  this.end();
  // 处理下一个请求。
  __MQ.Next();
}
http.ServerResponse.prototype.SendOk = function () {
  this.Send({ msg: 'ok' });
};
http.ServerResponse.prototype.Send_404 = function (data) {
  this.statusCode = 404;
  this.Send(data);
};
http.ServerResponse.prototype.Send401 = function (data) {
  this.statusCode = 401;
  this.Send({ msg: data });
};
http.ServerResponse.prototype.Send_500 = function (data) {
  this.statusCode = 500;
  this.Send(data);
};
http.ServerResponse.prototype.SendError = function (data) {
  const { code } = data;
  this.statusCode = code || 400;
  this.Send(data);
};


class Server {
  constructor() { }

  CreateServer(port) {
    const __key = '/ca/www.other.org.key';
    const __crt = '/ca/www.other.org.crt';
    const __keys = [path.join('.', 'server', __key), '.' + __key];
    const __crts = [path.join('.', 'server', __crt), '.' + __crt];
    const extKey = __keys.filter((p) => {
      if (fs.existsSync(p)) {
        return p;
      }
    });
    const extCrt = __crts.filter((p) => {
      if (fs.existsSync(p)) {
        return p;
      }
    });

    const options = {
      key: fs.readFileSync(extKey[0]), //读取key
      cert: fs.readFileSync(extCrt[0]) //读取crt
    };
    http.createServer(options, (req, res) => {
      const r = new routes(req, res);
      r.initHeader();
    }).listen(port || 10000);
    console.log('https://127.0.0.1:%d', port || 10000)
  }
}

class routes {
  constructor(req, res) {
    this.ApiInfo = api;
    this.res = res;
    this.req = req;
  }

  initHeader() {
    this.res.setHeader("Content-Type", "application/json;charset=utf-8");
    this.res.setHeader("Access-Control-Allow-Origin", "*");
    this.res.setHeader("access-control-allow-headers", "x-pingother, origin, x-requested-with, content-type, accept, token, xiaotuni,systemdate,sessionid");
    this.res.setHeader("access-control-allow-methods", "GET, POST, PUT, DELETE, OPTIONS");
    this.res.setHeader("Access-Control-Expose-Headers", "date, token,systemdate,sessionid");
    this.res.setHeader('systemdate', new Date().getTime());
    const { method } = this.req;
    if (method && method === 'OPTIONS') {
      this.res.end();
      return;
    }
    this.processRequestMethod(method);
  }

  processRequestMethod(method) {
    const PathInfo = path.parse(this.req.url);
    if (!this.judgeIsCallApi(PathInfo)) {
      return;
    }
    this.Method = method.toLocaleLowerCase();
    this.parseUrlParams();
    //读取数据库里的token信息
    let { TokenCollection } = MySqlHelper;
    if (!TokenCollection || TokenCollection.length || TokenCollection.length === 0) {
      TokenCollection = {};
      const DbAccess = new MySqlHelper();
      const __self = this;
      DbAccess.Query('select t.id as tokenId,t.token,t.deadline,t.UserId as tokenUserId from sys_session t', (data) => {
        const { result } = data;
        if (Array.isArray(result)) {
          result.forEach((item) => {
            TokenCollection[item.token] = item;
          });
        }
        MySqlHelper.TokenCollection = TokenCollection;
        __self.__ProcessApi(PathInfo);
      }, (err) => { });
    } else {
      this.__ProcessApi(PathInfo);
    }
  }

  __ProcessApi(PathInfo) {
    const methodInfo = { pathname: this.UrlInfo.pathname, method: this.Method };
    const { func, ctrl } = this.__FindMethod(PathInfo) || {};
    const cType = this.req.headers['content-type'];
    if (!cType || cType === 'application/json') {
      // 以utf - 8的形式接受body数据
      this.req.setEncoding('utf8');
    } else {
      // this.req.setEncoding('Buffer');
    }

    let __ReData = { DataType: 'String', Data: '' };
    const __fileName = 'file_name_' + new Date().getTime() + '.png';
    // 这里接受用户调用接口时，向body发送的数据
    this.req.on('data', (data) => {
      if (Buffer.isBuffer(data)) {
        if (!__ReData.BufferData) {
          __ReData.DataType = 'Buffer';
          __ReData.BufferData = data;
        } else {
          __ReData.BufferData = Buffer.concat([__ReData.BufferData, data], data.length + __ReData.BufferData.length);
        }
      } else {
        __ReData.Data += data;
      }
    });
    const __self = this;
    const { TokenCollection } = MySqlHelper;
    const args = {
      request: this.req,
      response: this.res,
      params: this.QueryParams,
      token: this.token,
      TokenCollection,
      methodInfo,
      ApiInfo: this.ApiInfo,
    };
    this.req.on('end', () => {      // 监听数据接受完后事件。
      // 查询用户定义好的接口。
      const { DataType, Data, BufferData } = __ReData;
      if (DataType === 'Buffer') {
        args.data = BufferData;
      } else {
        args.data = Data && Data !== '' ? JSON.parse(Data) : {};
      }
      if (func) {
        args.func = func;
        args.ctrl = ctrl;
        __MQ.AddQueue(args);
        return;
      }
      __MQ.AddQueue(args);
    });
  }

  judgeIsCallApi(PathInfo) {
    if (PathInfo.ext === '') {
      return true;
    }
    let charset = "binary";
    switch (PathInfo.ext) {
      case ".js":
        this.res.writeHead(200, { "Content-Type": "text/javascript" });
        break;
      case ".css":
        this.res.writeHead(200, { "Content-Type": "text/css" });
        break;
      case ".gif":
        charset = "binary";
        this.res.writeHead(200, { "Content-Type": "image/gif" });
        break;
      case ".jpg":
        charset = "binary";
        this.res.writeHead(200, { "Content-Type": "image/jpeg" });
        break;
      case ".png":
        charset = "binary";
        this.res.writeHead(200, { "Content-Type": "image/png" });
        break;
      default:
        this.res.writeHead(200, { "Content-Type": "application/octet-stream" });
    }

    const { dir, ext, name } = PathInfo;
    const __abs = path.join(dir, name + ext);
    const _pathInfo = [path.join('./server/', __abs), path.join('.', __abs)];
    const __self = this;
    let __fileIsExist = false;
    for (let i = 0; i < _pathInfo.length; i++) {
      const dir = _pathInfo[i];
      __fileIsExist = fs.existsSync(dir);
      if (__fileIsExist) {
        fs.readFile(dir, (err, data) => {
          if (err) {
            __self.res.Send({ code: -1, msg: err.toString() });
          } else {
            __self.res.write(data, charset);
          }
          __self.res.end();
        });
        return false;
      }
    }
    if (!__fileIsExist) {
      __self.res.end();
    }
    return false;
  }

  parseUrlParams() {
    const _url = url.parse(this.req.url);
    this.UrlInfo = _url;
    const { query } = _url;
    this.token = this.req.headers.token;
    this.QueryParams = querystring.parse(query);
  }

  __FindMethod(PathInfo, isSendMsg) {
    const { pathname } = this.UrlInfo;
    const pathList = pathname.split('/');
    pathList.shift();
    if (pathList.length === 1) {
      if (isSendMsg) {
        this.res.Send_404({ status: 404, msg: pathname + '接口没有找到' });
      }
      return null;
    }
    const __last = pathList.pop();
    let __CallApi = this.ApiInfo[pathList[0]];
    if (!__CallApi) {
      return null;
    }
    let __ApiIsExist = true;
    for (let i = 1; i < pathList.length; i++) {
      __CallApi = __CallApi[pathList[i]];
      if (!__CallApi) {
        __ApiIsExist = false;
        break;
      }
    }
    if (!__ApiIsExist) {
      if (isSendMsg) {
        this.res.Send_404({ status: 404, msg: pathname + '接口没有找到' });
      }
      return null;
    }
    const Controller = __CallApi;
    __CallApi = __CallApi[this.Method + '_' + __last]
    if (!__CallApi) {
      if (isSendMsg) {
        this.res.Send_404({ status: 404, msg: pathname + '接口没有找到' });
      }
      return null;
    }

    return { func: __CallApi, ctrl: Controller };
  }
}

console.log('---process.env.PORT-', process.env.APIPORT);

const start = new Server();
start.CreateServer(process.env.APIPORT);
