/**
 * Created by liaohb on 15-10-27 下午3:02.
 * File name By CategoryController.js
 */
var Comm = require("./../lib/commonMethod");
var Log = Comm.Log;
var DB = Comm.DB;

var _TableName_Category = "category";
/**
 * 分类
 * @type {{}}
 */
var Category = {
    index: function (Request, Response, Options) {
        //Options.Condition = {};
        //Options.OrderBy = {};
        DB.Query(_TableName_Category, Options, function (err, data) {

            Options.POST.list = data;
            Comm.Comm.Display(Request, Response, Options);
        });
    },
    add: function (Request, Response, Options) {
        if ("post" === Options.Method) {
            Options.POST.createtime = Comm.Comm.GetCurrentDate();
            DB.Add(_TableName_Category,Options.POST, function (err, data) {
               if(err){
                   Response.SendErrorInfo(Comm.Comm.ParseObject(err));
               }
                else{
                   Response.SendMsg("")
               }
            });
        }
        else {
            Options.POST.PageTitle += " 添加分类";
            Comm.Comm.Display(Request, Response, Options);
        }
    }
}

exports.Category = Category;