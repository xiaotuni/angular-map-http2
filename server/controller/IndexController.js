/**
 * Created by liaohb on 15-10-14 下午6:29.
 * File name By IndexController.js
 */
var Comm = require("./../lib/commonMethod");

var Index = {
    index: function (Request, Response, Options) {
        //var aa = Comm.DBsync.Query("userinfo", Options);
        Options.POST = {
            "title": "liaohaibing",
            "posts": [
                {"title": "title 1", "address": "yesterday", "city": "city 1", sex: "男"},
                {"title": "title 2", "address": "today", "city": "city 2", sex: "女"},
                {"title": "title 3", "address": "tomorrow", "city": "city 3", sex: "男"},
                {"title": "title 4", "address": "eee", "city": "city 4", sex: "女"},
            ]
        };
        Comm.Comm.Display(Request, Response, Options);
    },
}

exports.Index = Index;
