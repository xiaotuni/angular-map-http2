const http = require('http');
const util = require('util');
const queryString = require('querystring');
const formidable = require('formidable');
const url = require('url');
const querystring = require('querystring');
const path = require('path');
const fs = require('fs');
const api = require('./ctrl_es6/index');
const DbHelper = require('./ctrl_es6/DbHelper');

/**
 * 发送内容到界面上去.
 * @param data
 */
http.ServerResponse.prototype.Send = function (data) {
  this.write(JSON.stringify(data));
  this.end();
};


class server {
  constructor() { }

  createServer(port) {
    http.createServer((req, res) => {
      res.setHeader("Content-Type", "text/html;charset=utf-8");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("access-control-allow-headers", "x-pingother, origin, x-requested-with, content-type, accept");
      res.setHeader("access-control-allow-methods", "GET, POST, PUT, DELETE, OPTIONS");

      const r = new routes(req, res);
      r.initHeader();
    }).listen(port || 10000);
    console.log('http://127.0.0.1:%d', port || 10000)
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
    this.res.setHeader("access-control-allow-headers", "x-pingother, origin, x-requested-with, content-type, accept, xiaotuni,systemdate");
    this.res.setHeader("access-control-allow-methods", "GET, POST, PUT, DELETE, OPTIONS");
    this.res.setHeader("Access-Control-Expose-Headers", "date, token,systemdate");
    this.res.setHeader('systemdate', new Date().getTime());
    const { method } = this.req;
    if (method && method === 'OPTIONS') {
      response.end();
      return;
    }

    this.processRequestMethod(method);
  }

  processRequestMethod(method) {
    const PathInfo = path.parse(this.req.url);
    if (!this.judgeIsCallApi(PathInfo)) {
      return;
    }
    this.Method = method;
    this.parseUrlParams();
    switch (method.toLocaleLowerCase()) {
      case 'get':
        this.GetRequest(PathInfo);
        break;
      case 'post':
        this.PostReqeust(PathInfo);
        break;
      case 'put':
        this.PutRequest(PathInfo);
        break;
      case 'delete':
        this.DeleteRequest(PathInfo);
        break;
    }
    // this.parseFormDataInfo();
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
    this.QueryParams = querystring.parse(query);
  }

  parseFormDataInfo() {
    // new api.webapi(this.req, this.res).dept();
    const __api = api;
    const __webapi = __api.webapi;
    // __api.webapi.tempabc(this.req, this.res);
    this.res.Send({ msg: '哈全', date: new Date().getTime() });
  }

  GetRequest(PathInfo) {
    const __CallApi = this.__FindMethod(PathInfo);
    if (__CallApi) {
      __CallApi(DbHelper, this.req, this.res, this.QueryParams);
    }
  }

  DeleteRequest(PathInfo) {
    const __CallApi = this.__FindMethod(PathInfo);
    if (__CallApi) {
      __CallApi(DbHelper, this.req, this.res, this.QueryParams);
    }
  }

  PostReqeust(PathInfo) {
    
  }

  PutRequest(PathInfo) {

  }

  __FindMethod(PathInfo) {
    const { pathname } = this.UrlInfo;
    const pathList = pathname.split('/');
    pathList.shift();
    const __last = pathList.pop();
    let __CallApi = this.ApiInfo[pathList[0]];
    const __ApiIsExist = true;
    for (let i = 1; i < pathList.length; i++) {
      __CallApi = __CallApi[pathList[i]];
      if (!__CallApi) {
        __ApiIsExist = false;
      }
    }
    if (!__ApiIsExist) {
      this.res.Send({ status: 404, msg: pathname + '接口没有找到' });
      return false;
    }
    __CallApi = __CallApi[this.Method + '_' + __last]
    if (!__CallApi) {
      this.res.Send({ status: 404, msg: pathname + '接口没有找到' });
      return false;
    }

    return __CallApi;
  }
}

const __s = new server();
__s.createServer(process.env.PORT);