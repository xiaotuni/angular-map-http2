/**
 * Created by liaohb on 15-10-25 上午12:51.
 * File name By publicProperty.js
 */

var http = require("http2");
var Comm = require("./commonMethod");

/**
 *
 * @returns {Number}
 * @constructor
 */
String.prototype.ToInt = function () {
    if (Comm.Comm.IsNaN(this)) {
        return 0;
    }
    return parseInt(this);
}
String.prototype.ToFloat = function () {
    if (Comm.Comm.IsNaN(this)) {
        return 0.00;
    }
    return parseFloat(this);
}

/**
 * 堆栈
 */
Object.defineProperty(global, '__stack', {
    get: function () {
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function (_, stack) {
            return stack;
        };
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        var stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
    }
});
/**
 * 获取行号
 */
Object.defineProperty(global, '__LINE__', {
    get: function () {
        return "行号:" + __stack[1].getLineNumber();
    }
});
Object.defineProperty(global, '__FILE_LINE__', {
    get: function () {
        var stack = __stack[1];
        var _Root = Comm.Comm.GetRootPath();
        return "文件:" + stack.getFileName().replace(_Root, "") + ",行号:" + stack.getLineNumber();
    }
});
Object.defineProperty(global, '__METHOD_NAME__', {
    get: function () {
        //console.log(util.inspect(__stack[1].fun.name, true, 2, true));
        //console.log(util.inspect(__stack[2].fun, true, 3, true));
        return "方法名:" + __stack[1].fun.name;
    }
});
/**
 * 获取文件
 */
Object.defineProperty(global, '__FILE__', {
    get: function () {
        return "文件名:" + __stack[1].getFileName();
    }
});
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
    this.write(data);
    this.end();
};
/**
 * 发送内容到界面上去.
 * @param data
 */
http.ServerResponse.prototype.SendJSON = function (data) {
    this.write(JSON.stringify(data));
    this.end();
};
/**
 * 错误页面
 * @param data
 * @constructor
 */
http.ServerResponse.prototype.Send404 = function (msg) {
    this.writeHead(404, { "content-type": "text/html;charset=utf-8" });
    this.SendErrorInfo(msg);
}

/**
 * 错误页面
 * @param data
 * @constructor
 */
http.ServerResponse.prototype.SendErrorMsg = function (msgInfo) {
    const { code, msg } = msgInfo;
    this.statusCode = code || 400;
    this.write(JSON.stringify(msgInfo));
    this.end();
}

/**
 * 向页面输出信息.
 * @param Msg 消息内容
 * @param Url 跳转的URL
 * @param Flag 1:正常消息,0:错误信息.
 * @constructor
 */
http.ServerResponse.prototype.SendMsg = function (Msg, Url, Flag) {
    if (null == Url || "" === Url) {
        Url = "javascript:history.go(-1);";
    }
    else {
        Url = "window.location.href ='" + Url + "'";
    }
    if (null === Flag || '' === Flag || typeof Flag === 'undefined') {
        Flag = 1;
    }
    var Options = {
        PathName: "/_template/message.tpl",
        FileName: "_template/message.tpl",
        DisplayName: "/_template/message.tpl",
        POST: {
            flag: Flag,
            title: "消息内容",
            times: 5,
            msg: Msg,
            jump: Url,
        }
    };
    Comm.Comm.Display(null, this, Options);
}
/**
 * 向页面,输入错误信息.
 * 并过 5 秒后,跟转到首页.
 * @param msg
 * @constructor
 */
http.ServerResponse.prototype.SendErrorInfo = function (msg) {
    this.SendMsg(msg, null, 0);
}
/**
 * 页面跳转,页面重定向
 * @param url 要跳转的url地址.
 */
http.ServerResponse.prototype.JumpPage = function (url) {
    Log.Print("页面跳转到:", url);
    this.writeHead(302, { 'Location': url });
    this.end();
}
/**
 * 弹出对话框
 * @param msg
 * @constructor
 */
http.ServerResponse.prototype.Alert = function (msg) {
    var al = "<script>alert('" + msg + "');javascript:history.go(-1)</script>";
    this.end(al);
}
/**
 * 设置 session 信息.
 * @param name 名称
 * @param value 值
 * @param expiress 时间
 * @constructor
 */
http.ServerResponse.prototype.SetSession = function (name, value, expiress) {
    this.SetCookie(name, value, expiress);
}
/**
 * 获取 session 内容.
 * @param name
 * @returns {*|null}
 * @constructor
 */
http.ServerResponse.prototype.GetSession = function (name) {
    return this.GetCookie(name);
}
/**
 * 删除 session
 * @param name
 * @constructor
 */
http.ServerResponse.prototype.DeleteSession = function (name) {
    this.DeleteCookie(name);
}
/**
 * 设置 cookie 信息.
 * @param name
 * @param value
 * @param expires
 * @param path
 * @param domain
 * @returns {boolean}
 * @constructor
 */
http.ServerResponse.prototype.SetCookie = function (name, value, expires, path, domain) {
    var cookiesArr = [];
    var cookieSrt = '';
    var cookieStr = name + '=' + value + ';';
    //cookie有效期时间
    if (expires != undefined) {
        expires = parseInt(expires);
        var today = new Date();
        var time = today.getTime() + expires * 1000;
        var newDate = new Date(time);
        var expiresDate = newDate.toGMTString(); //转换成 GMT 格式。
        cookieStr += 'expires=' + expiresDate + ';';
    }
    //路径
    if (path != undefined) {
        cookieStr += 'path=' + path + ';';
    }
    //域名
    if (domain != undefined) {
        cookieStr += 'domain=' + domain + ';';
    }
    cookiesArr.push(cookieStr);
    this.setHeader("Set-Cookie", cookiesArr)
    return true;
};
/**
 *
 * @param name
 * @returns {*|null}
 * @constructor
 */
http.ServerResponse.prototype.GetCookie = function (name) {
    return this.GetAllCookie()[name] || null;
}
/**
 * 获取 Cookie
 * @returns {{}}
 * @constructor
 */
http.ServerResponse.prototype.GetAllCookie = function () {
    var list = {};
    var rc = this.socket.parser.incoming.headers.cookie;
    rc && rc.split(';').forEach(function (cookie) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    return list;
}
/**
 * 删除 Cookie 操作
 * @param name
 * @constructor
 */
http.ServerResponse.prototype.DeleteCookie = function (name) {
    this.SetCookie(name, '', -60 * 60 * 24 * 100);
}
