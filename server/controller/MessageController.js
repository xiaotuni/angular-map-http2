/**
 * Created by liaohb on 15-10-11 下午8:27.
 * File name By MessageController.js
 */
var url = require("url");
var util = require("util");
var fs = require("fs");
var Comm = require("./../lib/commonMethod");

var Message = {

    addMessage: function (Request, Response, Options) {
        try {
            if ("post" === Options.Method) {
                Options.POST.createtime = Comm.Comm.GetCurrentDate();
                Comm.DB.Add("messages", Options.POST, function (err, data) {
                    if (err) {
                        Response.SendErrorInfo("添加失败." + Comm.Comm.ParseObject(err));
                    } else {
                        Response.SendMsg("添加成功", "/Message/list");
                    }
                });
            }
            else {
                Comm.Comm.Display(Request, Response, Options);
            }
        }
        catch (e) {
            Comm.Log.Print(Comm.Comm.ParseObject(e));
        }
    },
    list: function (Request, Response, Options) {
        if ("post" === Options.Method) {

        }
        else {
            //-->查询出所有流言信息.
            //Options.Condition = {};
            Comm.DB.Query("messages", Options, function (err, data) {
                if (err) {
                    Response.SendErrorInfo(Comm.Comm.ParseObject(ee));
                }
                else {
                    Options.POST.list = data;
                    Options.POST.PageTitle = "留言信息";
                    Comm.Comm.Display(Request, Response, Options);
                }
            });
        }
    },
    Reply: function (Request, Response, Options) {
        if ("post" === Options.Method) {
            //插入操作.

            Options.POST.createtime = Comm.Comm.GetCurrentDate();

            Comm.DB.Add("messages", Options.POST, function (err, data) {
                if (err) {
                    Response.SendErrorInfo("添加失败." + Comm.Comm.ParseObject(err));
                } else {
                    Response.SendMsg("添加成功", "/Message/list");
                }
            });
        }
        else {
            Options.Condition = {};
            Options.Condition._seqid = Options.GET.id.ToInt();
            Comm.DB.QueryOne("messages", Options, function (err, data) {
                if (err) {
                    Response.SendMsg(Comm.Comm.ParseObject(err));
                } else {
                    Options.POST.PageTitle = "正在回复[" + data.nickname + "]的留言.";
                    Options.POST.model = data;
                    Comm.Comm.Display(Request, Response, Options);
                }
            });
        }
    }
}

var post_register = function (request, response, options) {
    var POST = options.POST;
    try {
        if ('' === POST.username) {
            response.Alert("请输入用户名称");
            return;
        }
        POST.password = Comm.Comm.ToMD5(POST.password);
        Comm.database.Add("userinfo", POST, function (err, data) {
            if (err) {
                Comm.Log.Print(err);
            }
            response.JumpPage("/Message/login");
        });
    }
    catch (e) {
        Comm.Log.Print(util.inspect(e, true, 3, true));
    }
}

var _login = function (request, response, options) {
    var POST = options.POST;
    var password = Comm.Comm.ToMD5(POST.password);
    var username = BodyFields.username;
    Comm.database.POST("userinfo", {username: username, password: password}, function (err, data) {
        if (null == data) {
            response.JumpPage("/Message/register");
        }
        else {
            response.end();
        }
    });
};

var _loadTemplate = function (request, response) {
    var _url = url.parse(request.url).pathname;
    var filePath = "./view" + _url + ".html";
    fs.readFile(filePath, "utf-8", function (err, data) {
        response.Send(data);
    });
}

exports.Message = Message;
