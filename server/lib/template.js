/**
 * Created by liaohb on 15-10-15 上午9:32.
 * File name By template.js
 */
var fs = require("fs");
var path = require("path");
var util = require("util");
var Fibers = require('fibers');
var Comm = require("./commonMethod");
var NJB = require("./commonNodeJsBlock");

/**
 * 去除所有空格. tpl.replace(/\s/g, "")
 * 替换: <% %>  tpl.replace(/<%([^%>]+)?%>/g,function(s0,s1,s2){});
 *      <%= %> tpl.replace(/<%=([^%>]+)?%>/g,function(s0,s1,s2){});
 *      Options 里面的格式如下
 *      var Options = {
                PathName: '/Index/index/a/b/c/d/e?&a=1&b=2&c...',
                FileName: "Index/index",
                POST: {
                        "title": "liaohaibing",
                        "posts": [
                            {"title": "title 1", "address": "yesterday", "city": "city 1", sex: "男"},
                            {"title": "title 2", "address": "today", "city": "city 2", sex: "女"},
                            {"title": "title 3", "address": "tomorrow", "city": "city 3", sex: "男"},
                            {"title": "title 4", "address": "eee", "city": "city 4", sex: "女"},
                        ]
                    },
                GET: querystring.parse(_url.query),
            }:
 *
 * @type {{ParseHtml: Function, ReadCache: Function}}
 */
var template = {

  /**
   * 解析HTML文件
   * @param Html
   * @param Options
   * @param callback
   * @constructor
   */
  ParseHtml: function (Html, Options, Callback) {
    //Callback(null, HtmlEngine(Html, Options.POST, Options.FileName));
    _BuilderNodeJsBlock1(Html, Options, function (err, content) {
      try {
        var code = HtmlEngine(content)
        _SaveCodeToRuntimeDir(code, Options.FileName);
        code = new Function(code.replace(/[\r\t\n]/g, '')).apply(Options.POST);
        Callback(null, code);
      }
      catch (e) {
        console.log(e);
        Callback(e, null);
      }
    });
  },

  /**
   * 读取缓存文件
   * @param CacheHtml
   * @param Options
   * @param Callback
   * @constructor
   */
  ReadCache: function (CacheHtml, Options, Callback) {
    //console.log(__FILE_LINE__, "template.ReadCache 读取缓存文件");
    fs.readFile(CacheHtml, "utf-8", function (err, html) {
      Callback(err, new Function(html.replace(/[\r\t\n]/g, '')).apply(Options.POST));
    });
  },

}

/**
 * HTML模板引擎
 * @param Html
 * @param data
 * @param FileName
 * @returns {*|any|Object|String}
 * @constructor
 */
var HtmlEngine = function (Html) {
  /**
   * 加载 layout 模板.
   * @type {*}
   */
  Html = _BuilderLayout(Html);
  /**
   * 加载 include 文件.
   */
  Html = _BuilderInclude(Html);

  var reg = /<%([^%>]+)?%>/g;
  var regOut = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g;
  var code = 'var p=[];\n';
  var _index = 0;     //主要的作用是定位代码最后一截
  var _BuildCode = function (line, js) {
    line = line.trim();
    if (js) {
      if (line.replace(/\s/g, "").match(regOut)) {
        code += line + "\n";
      }
      else {
        //-->默认给当前的要生成的变量加一个this.；如果当前值里有 '.' 这说明是变量是数组下面的属性,就不在前面加this了.
        if (-1 === line.indexOf("this.") && -1 === line.indexOf(".")) {
          line = "this." + line;
        }
        code += 'p.push(' + line + ');\n';
      }
    }
    else {
      if ('' != line) {
        code += 'p.push("' + line.replace(/"/g, '\"') + '");\n';
      }
      else {
        code += '';
      }
    }
  }

  while (match = reg.exec(Html)) {
    var _SubContent = String(Html).substring(_index, match.index).replace(/"/g, '\"');
    _BuildCode(_SubContent.replace(/"/g, '\''), false);     //添加非逻辑部分
    //添加逻辑部分 match[0] = "<%" +="" match[1]="" "%="">";
    _BuildCode(match[1], true);                              // match[1] 除去后的内容.
    _index = match.index + match[0].length
  }
  _SubContent = Html.substr(_index, Html.length - _index).replace(/"/g, '\'');
  _BuildCode(_SubContent, false);
  code += ' return p.join("");';      // 返回结果，在这里我们就拿到了装入数组后的代码
  //console.log("-code 其实这部份,可以保存到一个缓存文件里去,下次的时候,就可以直接从缓存里读取,就不用每次进行解析了--");
  //_SaveCodeToRuntimeDir(code, FileName);
  //try {
  //    return new Function(code.replace(/[\r\t\n]/g, '')).apply(data);
  //}
  //catch (e) {
  //    Comm.Log.Print(Comm.Comm.ParseObject(e));
  //    return _oldHtml
  //}
  code = code.replace(/[\r\t\n]/g, '');
  return code;
}

/**
 * 将解析后的 html 文件内容保存指定路径里去.
 * 以便下次读取此文件,不用再将 HTML 文件进行解析了.
 * @param BuilderCode
 * @param FileName
 * @private
 */
var _SaveCodeToRuntimeDir = function (BuilderCode, FileName) {
  var _NewFielName = Comm.Comm.GetHtmlTemplateByFileName(FileName);
  if ('' === _NewFielName || null == _NewFielName) {
    _NewFielName = Comm.Comm.ToMD5(new Date().getDate()) + ".html";
  }
  var _NewFilePath = path.join(Comm.Comm.GetTemplatePath(String(FileName).split('/')[0]), _NewFielName);
  Comm.Log.Print(_NewFilePath);
  fs.writeFile(_NewFilePath, BuilderCode, "utf-8", function (err) {
    //字典里记录着,哪个文件与之对应的模板文件.{HtmlTemplate:{'Index/index':'1223423423234.html'}}
    if (err) {
      Comm.Log.Print(Comm.Comm.ParseObject(err));
    }
    else {
      Comm.Comm.SetHtmlTemplateByFileName(FileName, _NewFielName);
    }
  });
}

/**
 * 解析加载 Layout 模板.
 * @param Html 页面内容
 * @returns {*} 返回解析后的页面内容
 * @private 私有方法
 */
var _BuilderLayout = function (Html) {
  //匹配 <layout name/>
  var _Reg = /<layout( name=[\s\S]*?)\/>/g;
  var _LayoutList = _MatchReg(Html, _Reg, _BuilderLayout);

  var _SubReg = /{__CONTENT__}/g
  for (var i = 0; i < _LayoutList.length; i++) {
    var _row = _LayoutList[i];
    var _info_length = _row.Info.length;
    var _index = _row.Index;
    Html = _row.Content.replace(_SubReg, Html);
    Html = Html.replace(_row.Info, "");
  }
  return Html;
}

/**
 * 解析 include 引入内容
 * @param Html 页面内容
 * @returns {*} 返回解析后的页面内容
 * @private 私有方法
 */
function _BuilderInclude(Html) {
  // 匹配 <include name
  var reg = /<include( name=[\s\S]*?)\/>/g;
  var _IncludeFileList = _MatchReg(Html, reg, _BuilderInclude);
  for (var i = _IncludeFileList.length - 1; i >= 0; i--) {
    var _row = _IncludeFileList[i];
    var _content = _row.Content;
    //下面这段注释代码也是可以用的.
    // var _info_length = _row.Info.length;
    // var _index = _row.Index;
    // var _01 = String(Html).substr(0, _index);
    // var _02 = String(Html).substr(_index + _info_length, Html.length - _index - _info_length);
    // Html = _01 + _content + _02;

    Html = Html.replace(_row.Info, _content);
  }
  return Html;
}

function _BuilderNodeJsBlock(Html, Options, Callback) {
  var oldOptions = Options;
  console.log("------_BuilderNodeJsBlock----------1--------------");
  //匹配 <NodejsBlock MethodName=/>
  var _Reg = /<NodejsBlock MethodName=[\"|\']([\s\S]*?)<\/NodejsBlock>/g;
  var isMatch = false;
  while (match = _Reg.exec(Html)) {
    isMatch = true;
    try {
      var _subIndex = String(match[1]).indexOf("'>") || String(match[1]).indexOf("\">");
      var _BlockCtrl = String(match[1]).substr(0, _subIndex).replace("/", ".");
      var _BuilderDataSource = String(match[1]).substr(_subIndex + 2, String(match[1]).length - _subIndex);
      //NJB.NJB_Blog.user;
      var _execute_function = "NJB.NJB_" + _BlockCtrl;
      var tempFun = eval(_execute_function);
      if (typeof tempFun !== 'function') {
        console.log(__FILE_LINE__, "----------------not exists--------------------------------");
      }
      else {
        var _index = match.index;
        var _s1 = String(Html).substr(0, _index);
        var _s2_index = _index + match[0].length;
        var _s2 = Html.substr(_s2_index, Html.length - _s2_index);
        tempFun(Options || {}, function (err, data) {
          var _htmlE = HtmlEngine(_BuilderDataSource);
          var _o = {};
          _o.list = data;
          code = new Function(_htmlE).apply(_o);
          code = _s1 + code + _s2;
          _BuilderNodeJsBlock(code, oldOptions, Callback);
        })
      }
    }
    catch (ee) {
      console.log(Comm.Comm.ParseObject(ee));
      break;
    }
    break;
  }
  if (!isMatch) {
    Callback(null, Html);
  }
}

function _BuilderNodeJsBlock1(Html, Options, Callback) {
  var oldOptions = Options;
  console.log("------_BuilderNodeJsBlock----------1--------------");
  //匹配 <NodejsBlock BlockInfo=/>
  var _Reg = /<NodejsBlock BlockInfo=[\"|\']([\s\S]*?)<\/NodejsBlock>/g;
  var isMatch = false;
  while (match = _Reg.exec(Html)) {
    isMatch = true;
    try {
      var _subIndex = String(match[1]).indexOf(">");
      var _t_1 = String(match[1]).substr(0, _subIndex).trim();
      var _new = _t_1.substr(0, _t_1.length - 1).replace(/\'/g, "\"");
      var _BlockJSON = JSON.parse(_new);
      var _BlockCtrl = _BlockJSON.Method.replace("/", ".");
      var _BlockDataSourceName = _BlockJSON.DataSourceName;
      var _BuilderDataSource = String(match[1]).substr(_subIndex + 1, String(match[1]).length - _subIndex);
      //NJB.NJB_Blog.user;
      var _execute_function = "NJB.NJB_" + _BlockCtrl;
      console.log(_execute_function);
      var tempFun = eval(_execute_function);
      if (typeof tempFun !== 'function') {
        console.log(__FILE_LINE__, "----------------not exists--------------------------------");
      }
      else {
        var _index = match.index;
        var _s1 = String(Html).substr(0, _index);
        var _s2_index = _index + match[0].length;
        var _s2 = Html.substr(_s2_index, Html.length - _s2_index);
        tempFun(Options || {}, function (err, data) {
          if (err) {
            console.log(err);
          }
          var _htmlE = HtmlEngine(_BuilderDataSource);
          var _o = {};
          _o[_BlockDataSourceName] = data || [];
          code = new Function(_htmlE).apply(_o);
          code = _s1 + code + _s2;
          _BuilderNodeJsBlock1(code, oldOptions, Callback);
        })
      }
    }
    catch (ee) {
      console.log(Comm.Comm.ParseObject(ee));
      break;
    }
    break;
  }
  if (!isMatch) {
    Callback(null, Html);
  }
}

/**
 * 根据不同正则表达式,返回对应解析后的文件内容信息
 * @param Html 页面内容
 * @param Reg 正则表达式
 * @param CallBack 回调函数
 * @returns {Array} 返回内容
 * @private 私有方法
 */
function _MatchReg(Html, Reg, CallBack) {
  var _MatchItem = [];
  while (match = Reg.exec(Html)) {
    try {
      if (null == match || typeof match === 'undefined') {
        console.log("match is null");
        continue;
      }
      //{name:"layout",src:"/view/main_layout.html"}
      var _IncludeJSON = {};
      if (Object(match).hasOwnProperty("index")) {
        var _Index = match.index;
        _IncludeJSON.Info = match[0];
        _IncludeJSON.Index = _Index;
        var _temp = JSON.parse("{\"" + String(match[1]).replace(/=/g, '\":').trim().replace(/ /g, ',\"') + "}");
        var _IncludeContent = _ReadIncludeFile(_temp, CallBack);
        _IncludeJSON.Content = _IncludeContent;
        _MatchItem.push(_IncludeJSON);
      }
    }
    catch (ee) {
      console.log(Comm.Comm.ParseObject(ee));
      break;
    }
  }
  return _MatchItem;
}

/**
 * 读取要 include 的文件.
 * @param _FileJSON
 * @param CallBack 回调函数.
 * @returns {string} 返回解析好的文件内容.
 * @private 私有方法
 */
function _ReadIncludeFile(_FileJSON, CallBack) {
  try {
    var _SRC = _FileJSON.src;
    if ('' === _SRC || null === _SRC) {
      return "";
    }
    var _FileContent = "";
    var _FileType = String(_FileJSON.name).toLocaleLowerCase();
    switch (_FileType) {
      case "html":
      case "htm":
        var _IncludeFilePath = path.join(Comm.Comm.GetRootPath(), _SRC);
        if (Comm.Comm.JudgeIsExistsByFullPathFileName(_IncludeFilePath)) {
          _FileContent = fs.readFileSync(_IncludeFilePath, "utf-8")
        }
        _FileContent = CallBack(_FileContent);
        break;
      case "js"://<script type="text/javascript" src="/public/js/jquery-easyui/jquery.min.js"></script>
        _FileContent = '<script type="text/javascript" src="' + _SRC + '"></script>';
        break;
      case "css"://<link rel="stylesheet" type="text/css" href="/public/js/jquery-easyui/themes/icon.css">
        _FileContent = '<link rel="stylesheet" type="text/css" href="' + _SRC + '">';
        break;
    }
    return _FileContent;
  }
  catch (ee) {
    Comm.Log.Print(Comm.Comm.ParseObject(ee));
  }
}

exports.Template = template;