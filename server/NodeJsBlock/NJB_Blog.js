/**
 * Created by liaohb on 15-10-29 下午10:48.
 * File name By BlogController.js
 */
var Comm = require("./../lib/commonMethod");


var BlogController = {
    user: function (Options,Callback) {
        var _TableName = "userinfo";
        Comm.DB.Query(_TableName,{}, function (err,data) {
            Callback(err,data);
        });
    },
    a: function (Options, Callback) {
        var _TableName = "messages";
        Comm.DB.Query(_TableName,{}, function (err,data) {
            Callback(err,data);
        });
    }
}

exports.NodeJsBlockBlog = BlogController;