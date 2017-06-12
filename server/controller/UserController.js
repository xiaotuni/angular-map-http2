/**
 * Created by liaohb on 15-10-19 下午5:38.
 * File name By UserController.js
 */
/**
 * Created by liaohb on 15-10-11 下午8:27.
 * File name By MessageController.js
 */
var url = require("url");
var util = require("util");
var fs = require("fs");
var Comm = require("./../lib/commonMethod");
var pp = require("./../lib/publicProperty");
var DB = require("./../lib/database");
var User = {
    /**
     * 显示出所有用户
     */
    index: function (Request, Response, Options) {
        DB.database.Find("userinfo", {}, function (err, data) {
            if (err) {
                Comm.Log.Print(Comm.Comm.ParseObject(ee));
            }
            else {
                Options.POST.Users = data;
                Options.POST.DisplayPage = "/User/index"
                Comm.Comm.Display(Request, Response, Options);
            }
        });
    },
    register: function (Request, Response, Options) {
        try {
            if (Request.method === 'POST') {
                _PostRegister(Request, Response, Options);
            } else {
                Comm.Comm.Display(Request, Response, Options);
            }
        }
        catch (e) {
            Comm.Log.Print(Comm.Comm.ParseObject(e));
            response.end();
        }
    },
    login: function (Request, Response, Options) {
        if (Request.method === 'POST') {
            _PostLogin(Request, Response, Options);
        } else {
            Comm.Comm.Display(Request, Response, Options);
        }
    },
    addMessage: function (request, response, options) {
        response.write("call message controller addMessage method");
        response.end();
    },

    delete: function (Request, Response, Options) {
        //parseInt(Options.GET.id)
        DB.database.Delete("userinfo", {_seqId: Options.GET.id}, function (err, counts) {
            if (err) {
                Response.Send(err);
            }
            else
            {
                console.log(counts.result.n);
                //{"ok":1,"n":0}
                Response.SendMsg("成功删除[" + counts.result.n + "]条记录.", "/User/register");
            }
        })
    },
    edit: function (Request, Response, Options) {

        var method = Options.Method;
        if ("post" === method) {
            console.log(Options);
            var _Condition = {};
            _Condition._seqid =String( Options.POST._seqid).ToInt();
            Options.POST._seqid =_Condition._seqid;
            DB.database.Edit("userinfo", _Condition, Options.POST, function (err, data) {
                console.log(data.result.n);
                Response.end("ok");
                //Response.SendMsg("ok");
            });
        }
        else {
            var _seqid =  Options.GET.id.ToInt();

            DB.database.FindOne("userinfo",{_seqid:_seqid}, function (err, data) {
                Options.POST = data;

                Options.POST.PageTitle = "编辑用户";
                console.log(Options);
                Comm.Comm.Display(Request, Response, Options);
            })

        }
    }
}

function _PostLogin(Request, Response, Options) {
    try {

        console.log(Comm.Comm.ParseObject(Options));
        var POST = Options.POST;
        var password = Comm.Comm.ToMD5(POST.password);
        var username = POST.username;
        Comm.database.Find("userinfo", {username: username, password: password}, function (err, data) {
            if (null == data) {
                //response.JumpPage("/Message/register");
                Response.SendMsg("用户名或密码错误.");
            }
            else {
                Response.SendMsg(err);
            }
        });
    }
    catch (ee) {
        Response.Send(Comm.Comm.ParseObject(ee));
    }
};

function _PostRegister(Request, Response, Options) {
    var POST = Options.POST;
    try {
        if ('' === POST.username) {
            response.Alert("请输入用户名称");
            return;
        }
        POST.password = Comm.Comm.ToMD5(POST.password);
        Comm.database.Add("userinfo", POST, function (err, data) {
            if (err) {
                Comm.Log.Print(err);
                Response.SendMsg(err);
            }
            else {
                Response.SendMsg("用户注册成功.", "/User/login");
            }
            //response.JumpPage("/Message/login");
        });
    }
    catch (e) {
        Comm.Log.Print(util.inspect(e, true, 3, true));
    }
}


exports.User = User;