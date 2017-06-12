/**
 * Created by liaohb on 15-10-27 上午11:13.
 * File name By BlogController.js
 */
var Comm = require("./../lib/commonMethod");
var Fiber = require('fibers');

var Blog = {
    index: function (Request, Respone, Options) {
        //Options.Condition = {};
        //Fiber.yield();
        Comm.Comm.Display(Request, Respone, Options);
    },
}

exports.Blog = Blog;