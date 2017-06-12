/**
 * Created by liaohb on 15-10-9 上午11:08.
 * File name By router.js
 */
var util = require("util");
var path = require("path");
var querystring = require("querystring");
var url = require("url");
var fs = require('fs');
var formidable = require("formidable");

var CommExp = require("./lib/commonExports");
var Comm = require("./lib/commonMethod");
var Log = Comm.Log;
/**
 * 路由方法
 * @param response
 * @param request
 */
function route(response, request) {
  try {
    var _url = url.parse(request.url);
    var _pathname = _url.pathname;
    var fileExtName = path.extname(_pathname);
    if (fileExtName) {
      _ReadFileOperator(request, response, _pathname, fileExtName);
      return;
    }
    if (_pathname.indexOf('/WebApi/') >= 0) {
      response.setHeader("Content-Type", "application/json;charset=utf-8");
      response.setHeader("Access-Control-Allow-Origin", "*");
      response.setHeader("access-control-allow-headers", "x-pingother, origin, x-requested-with, content-type, accept");
      response.setHeader("access-control-allow-methods", "GET, POST, PUT, DELETE, OPTIONS");
      const { method } = request;
      if (method && method === 'OPTIONS') {
        response.end();
        return;
      }
    }
    _CallController(request, response, _url);
  }
  catch (e) {
    Comm.Log.Print(Comm.Comm.ParseObject(e));
  }
}
/**
 * 读取文件操作.
 * @param request
 * @param response
 * @param _pathname
 * @param fileExtName
 * @private
 */
function _ReadFileOperator(request, response, _pathname, fileExtName) {
  var charset = "utf-8";
  switch (fileExtName) {
    case ".js":
      response.writeHead(200, { "Content-Type": "text/javascript" });
      break;
    case ".css":
      response.writeHead(200, { "Content-Type": "text/css" });
      break;
    case ".gif":
      charset = "binary";
      response.writeHead(200, { "Content-Type": "image/gif" });
      break;
    case ".jpg":
      charset = "binary";
      response.writeHead(200, { "Content-Type": "image/jpeg" });
      break;
    case ".png":
      charset = "binary";
      response.writeHead(200, { "Content-Type": "image/png" });
      break;
    default:
      response.writeHead(200, { "Content-Type": "application/octet-stream" });
  }
  _pathname = "./server/" + _pathname;

  fs.readFile(_pathname, charset, function (err, data) {
    if (err) {
      Comm.Log.Print(Comm.Comm.ParseObject(err));
    }
    else {
      response.write(data, charset);
    }
    response.end();
  });
}
/**
 * 调用控制器操作
 * @param Request
 * @param Response
 * @param _url
 */
function _CallController(Request, Response, _url) {
  var _pathname = _url.pathname;
  var _Config = global.Config;
  var _PageTitle = _Config.hasOwnProperty("DefaultPage") ? _Config.PageTitle : "";
  if ("/" === _pathname) {
    if (_Config.hasOwnProperty("DefaultPage") && Comm.Const.Undefined !== _Config.DefaultPage) {
      _pathname = "/" + _Config.DefaultPage;
    } else {
      _pathname = "/Index/index";
    }
    Comm.Log.Print("默认访问 " + _pathname + " 页面");
  }
  var _c_a = _pathname.substr(1, _pathname.length - 1).split('/');
  if (1 === _c_a.length || "" === _c_a[1]) {
    _c_a[1] = "index";
  }
  var _ctrl = String(_c_a[0]).toLocaleLowerCase();
  if ("controller" === _ctrl || "public" === _ctrl || "runtime" === _ctrl || "view" === _ctrl || "config" === _ctrl || "lib" === _ctrl) {
    console.log("------------Controller name ", _ctrl);
    return;
  }


  /**
   * 判断控制器,视图是否存在
   */
  var ctrl = _c_a[0] + "Controller";
  var sendContent = "";
  if (!CommExp.hasOwnProperty(ctrl)) {
    sendContent = "[ " + _c_a[0] + " ] 控制器没有找到...";
    Comm.Log.Print(sendContent);
    Response.Send404(sendContent);
    return;
  }

  var _execute_function = "CommExp." + ctrl + "." + _c_a[1];
  var tempFun = eval(_execute_function);
  if (typeof tempFun !== 'function') {
    //-->判断html文件是否存在.下面这个以后再加了.
    //var _ViewPage = path.join(Comm.Comm.GetRootPath(), "view/" + _c_a[0] + "/" + _c_a[1] );
    //if(Comm.Comm.JudgeIsExistsByFullPathFileName(_ViewPage)){
    //
    //}
    sendContent = "[  /view/" + _c_a[0] + "/" + _c_a[1] + ".html  ] 页面没有找到...";
    console.log(_execute_function);
    Comm.Log.Print(sendContent);
    Response.Send404(sendContent);
    return;
  }

  var form = new formidable.IncomingForm();
  form.parse(Request, function (err, fields, files) {
    try {
      /**
       * 要传入的数据格式
       * @type {{PathName: (string|*|path|string|null), POST: *, GET}}
       */
      var Options = {
        Method: Request.method.toLocaleLowerCase(),
        PathName: "/" + _c_a[0] + "/" + _c_a[1],
        FileName: _c_a[0] + "/" + _c_a[1],
        POST: fields,
        GET: querystring.parse(_url.query),
      };
      Options.POST.PageTitle = _PageTitle;
      //参数设置
      if (_c_a.length > 2) {
        var _counts = _c_a.length;
        for (var i = 2; i < _counts; i += 2) {
          var _key = _c_a[i];
          var _value_index = i + 1;
          if (_value_index < _counts) {
            var _value = _c_a[_value_index];
            Options.GET[_key] = _value;
          }
        }
      }

      tempFun(Request, Response, Options);
    }
    catch (e) {
      var _msg = Comm.Comm.ParseObject(e);
      Log.Print(_msg);
      Response.Send(_msg);
    }
  });
}

exports.route = route;